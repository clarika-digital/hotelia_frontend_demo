import type { ApiEnvelope } from "@/global/types";
import { useSessionStore } from "@/stores/session-store";
import { AUTH_ROUTES } from "@/domains/auth/constants";
import type { TokenPair } from "@/domains/auth/types";

export class ApiError extends Error {
  status: number;
  title: string;
  detail?: string;

  constructor(status: number, title: string, detail?: string) {
    super(title);
    this.name = "ApiError";
    this.status = status;
    this.title = title;
    this.detail = detail;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type ApiMode = "dev" | "test" | "prod";

const LEGACY_TEST_MODES = new Set(["mock"]);

function resolveApiMode(value: string | undefined): ApiMode {
  const mode = (value ?? "prod").trim().toLowerCase();
  if (mode === "test" || LEGACY_TEST_MODES.has(mode)) return "test";
  if (mode === "dev") return "dev";
  return "prod";
}

export const API_MODE: ApiMode = resolveApiMode(
  process.env.NEXT_PUBLIC_API_MODE
);

export const USE_MOCK_ENGINE = API_MODE === "test";

export function idempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface ApiResponse {
  ok: boolean;
  status: number;
  statusText: string;
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  skipRefresh?: boolean;
  idempotency?: boolean;
  idempotencyKey?: string;
}

interface ProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
}

function isProblem(payload: unknown): payload is ProblemDetails {
  return typeof payload === "object" && payload !== null && "title" in payload;
}

async function send(path: string, options: RequestOptions): Promise<ApiResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  const token = useSessionStore.getState().accessToken;
  if (!options.skipAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (options.idempotency) {
    headers["Idempotency-Key"] = options.idempotencyKey ?? idempotencyKey();
  }

  if (USE_MOCK_ENGINE) {
    const { mockRequest } = await import("./mock/engine");
    return mockRequest(path, {
      method: options.method,
      body: options.body,
      headers,
    });
  }

  return fetch(`${BASE_URL}${path}`, {
    method: options.method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

let refreshPromise: Promise<boolean> | null = null;

function tryRefresh(): Promise<boolean> {
  const { refreshToken, setTokens, clear } = useSessionStore.getState();
  if (!refreshToken) return Promise.resolve(false);

  if (!refreshPromise) {
    refreshPromise = request<TokenPair>(AUTH_ROUTES.refresh, {
      method: "POST",
      body: { refreshToken },
      skipAuth: true,
      skipRefresh: true,
    })
      .then((tokens) => {
        setTokens(tokens);
        return true;
      })
      .catch(() => {
        clear();
        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let res = await send(path, options);

  if (res.status === 401 && !options.skipRefresh) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await send(path, options);
    }
  }

  const contentType = res.headers.get("content-type") ?? "";
  const payload = (await res.json().catch(() => null)) as unknown;

  if (!res.ok) {
    if (contentType.includes("application/problem+json") && isProblem(payload)) {
      throw new ApiError(
        payload.status ?? res.status,
        payload.title ?? (res.statusText || "Request failed"),
        payload.detail
      );
    }
    if (typeof payload === "object" && payload !== null && "error" in payload) {
      const envelope = payload as ApiEnvelope;
      if (envelope.error) {
        throw new ApiError(
          envelope.error.status,
          envelope.error.title,
          envelope.error.detail
        );
      }
    }
    throw new ApiError(res.status, res.statusText || "Request failed");
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    "error" in payload
  ) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

export async function get<T>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: "GET" });
}

export async function post<T, B = unknown>(
  path: string,
  body: B,
  options?: RequestOptions
): Promise<T> {
  return request<T>(path, { ...options, method: "POST", body });
}

export async function put<T, B = unknown>(
  path: string,
  body: B,
  options?: RequestOptions
): Promise<T> {
  return request<T>(path, { ...options, method: "PUT", body });
}

export async function del<T>(path: string, options?: RequestOptions): Promise<T> {
  return request<T>(path, { ...options, method: "DELETE" });
}

export const client = {
  mode: API_MODE,
  useMockEngine: USE_MOCK_ENGINE,
  get,
  post,
  put,
  delete: del,
};
