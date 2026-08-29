import type { ApiEnvelope } from "@/global/types";

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
const API_MODE = process.env.NEXT_PUBLIC_API_MODE ?? "live";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok || body?.error) {
    throw new ApiError(
      body?.error?.status ?? res.status,
      body?.error?.title ?? res.statusText,
      body?.error?.detail
    );
  }

  return body?.data as T;
}

export async function get<T>(path: string, options?: RequestInit): Promise<T> {
  return request<T>(path, { ...options, method: "GET" });
}

export async function post<T, B = unknown>(
  path: string,
  body: B,
  options?: RequestInit
): Promise<T> {
  return request<T>(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export const client = {
  mode: API_MODE,
  get,
  post,
};
