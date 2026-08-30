import { digitsOnly, isValidE164 } from "@/data/phones";
import { GUEST_USERS, STAFF_USERS, type MockUser } from "./fixtures";

interface MockResponse {
  ok: boolean;
  status: number;
  statusText: string;
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
}

interface MockRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

const NETWORK_DELAY_MS = 350;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function respond(status: number, body: unknown, contentType: string): MockResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: "",
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "content-type" ? contentType : null,
    },
    json: () => Promise.resolve(body),
  };
}

function envelope(data: unknown): MockResponse {
  return respond(
    200,
    {
      data,
      meta: {
        request_id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      },
      error: null,
    },
    "application/json"
  );
}

function problem(status: number, title: string, detail: string): MockResponse {
  return respond(
    status,
    { type: "about:blank", title, status, detail },
    "application/problem+json"
  );
}

const INVALID_REFRESH_DETAIL = "Session expired. Please sign in again.";

let refreshCounter = 0;
const activeRefreshTokens = new Map<string, string>();
const registeredGuests: MockUser[] = [];

function claimsOf(user: MockUser) {
  return {
    sub: user.id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    role: user.role ?? null,
    permissions: user.permissions,
    geofenceVerified: user.geofenceVerified,
  };
}

function mintTokens(user: MockUser) {
  const accessToken = `mock.${btoa(
    JSON.stringify({ sub: user.id, exp: Date.now() + 15 * 60 * 1000 })
  )}`;
  refreshCounter += 1;
  const refreshToken = `mock-refresh.${btoa(
    JSON.stringify({ sub: user.id, jti: refreshCounter })
  )}`;
  activeRefreshTokens.set(refreshToken, user.id);
  return { accessToken, refreshToken };
}

function userById(id: string | undefined): MockUser | undefined {
  if (!id) return undefined;
  return [...STAFF_USERS, ...GUEST_USERS].find((u) => u.id === id);
}

function userFromAccessToken(token: string | null): MockUser | undefined {
  if (!token?.startsWith("mock.")) return undefined;
  try {
    const payload = JSON.parse(atob(token.slice(5))) as { sub?: string };
    return userById(payload.sub);
  } catch {
    return undefined;
  }
}

function userFromRefreshToken(token: string): MockUser | undefined {
  const id = activeRefreshTokens.get(token);
  return id ? userById(id) : undefined;
}

function bearerToken(headers?: Record<string, string>): string | null {
  const value = headers?.["Authorization"];
  if (!value) return null;
  return value.replace(/^Bearer\s+/i, "");
}

function canonicalPhone(value: string): string {
  const digits = digitsOnly(value);
  return digits ? `+${digits}` : "";
}

function matchesPhone(identifier: string, phone: string): boolean {
  const digits = digitsOnly(identifier);
  if (digits.length < 7) return false;
  return canonicalPhone(identifier) === canonicalPhone(phone);
}

const GEOFENCE_EXEMPT_ROLES = new Set(["executive", "super_admin"]);

function roleRequiresGeofence(role: string | undefined): boolean {
  return !role || !GEOFENCE_EXEMPT_ROLES.has(role);
}

function geofenceAllowed(user: MockUser): boolean {
  if (!roleRequiresGeofence(user.role)) return true;
  return user.geofenceVerified;
}

export async function mockRequest(
  path: string,
  options: MockRequest
): Promise<MockResponse> {
  await sleep(NETWORK_DELAY_MS);

  const method = (options.method ?? "GET").toUpperCase();
  const body = (options.body ?? {}) as Record<string, unknown>;
  const bearer = bearerToken(options.headers);

  if (method === "POST" && path === "/v1/auth/login") {
    const username = String(body.username ?? "").trim().toLowerCase();
    const staffUser = STAFF_USERS.find(
      (u) =>
        u.email.toLowerCase() === username ||
        (u.pin ?? "").toLowerCase() === username
    );
    if (staffUser) {
      if (staffUser.password !== body.password) {
        return problem(
          401,
          "Invalid credentials",
          "Username or password is incorrect."
        );
      }
      if (!geofenceAllowed(staffUser)) {
        return problem(
          403,
          "Geofence violation",
          "On-premise access required for this account. Connect from the property network or request a whitelist exemption."
        );
      }
      return envelope({ tokens: mintTokens(staffUser), user: claimsOf(staffUser) });
    }

    const guestUser = [...GUEST_USERS, ...registeredGuests].find(
      (u) =>
        u.email.toLowerCase() === username ||
        matchesPhone(String(body.username ?? ""), u.phone ?? "")
    );
    if (guestUser) {
      if (guestUser.password !== body.password) {
        return problem(
          401,
          "Invalid credentials",
          "Email or phone and password do not match our records."
        );
      }
      return envelope({ tokens: mintTokens(guestUser), user: claimsOf(guestUser) });
    }

    return problem(
      401,
      "Invalid credentials",
      "We could not find an account with those details."
    );
  }

  if (method === "POST" && path === "/v1/auth/guest/register") {
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = canonicalPhone(String(body.phone ?? ""));
    const password = String(body.password ?? "");
    if (!name || !email || !phone || !password) {
      return problem(
        400,
        "Missing fields",
        "Name, email, phone and password are required."
      );
    }
    if (!isValidE164(phone)) {
      return problem(
        400,
        "Invalid phone number",
        "Enter a valid phone number including the country code."
      );
    }
    const allGuests = [...GUEST_USERS, ...registeredGuests];
    if (
      allGuests.some(
        (u) =>
          u.email.toLowerCase() === email ||
          canonicalPhone(u.phone ?? "") === phone
      )
    ) {
      return problem(
        409,
        "Account exists",
        "An account with that email or phone already exists."
      );
    }
    const user: MockUser = {
      id: `guest-${Date.now()}`,
      userType: "guest",
      name,
      email,
      phone,
      password,
      permissions: ["bookings.own.read", "profile.own.manage", "export.own.request"],
      geofenceVerified: true,
    };
    registeredGuests.push(user);
    return envelope({ user: claimsOf(user) });
  }

  if (method === "POST" && path === "/v1/auth/staff/login") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const user = STAFF_USERS.find((u) => u.email.toLowerCase() === email);
    if (!user || user.password !== body.password || user.pin !== body.pin) {
      return problem(401, "Invalid credentials", "Email, password or PIN is incorrect.");
    }
    if (!geofenceAllowed(user)) {
      return problem(
        403,
        "Geofence violation",
        "On-premise access required for this account. Connect from the property network or request a whitelist exemption."
      );
    }
    return envelope({ tokens: mintTokens(user), user: claimsOf(user) });
  }

  if (method === "POST" && path === "/v1/auth/guest/login") {
    const identifier = String(body.identifier ?? "").trim().toLowerCase();
    const user = GUEST_USERS.find(
      (u) =>
        u.email.toLowerCase() === identifier ||
        matchesPhone(identifier, u.phone ?? "")
    );
    if (!user || user.password !== body.password) {
      return problem(
        401,
        "Invalid credentials",
        "Email or phone and password do not match our records."
      );
    }
    return envelope({ tokens: mintTokens(user), user: claimsOf(user) });
  }

  if (method === "POST" && path === "/v1/auth/refresh") {
    const token = String(body.refreshToken ?? "");
    const user = userFromRefreshToken(token);
    if (!user) {
      return problem(401, "Invalid refresh token", INVALID_REFRESH_DETAIL);
    }
    activeRefreshTokens.delete(token);
    return envelope({ tokens: mintTokens(user) });
  }

  if (method === "POST" && path === "/v1/auth/logout") {
    if (bearer?.startsWith("mock.")) {
      try {
        const payload = JSON.parse(atob(bearer.slice(5))) as { sub?: string };
        for (const [token, sub] of activeRefreshTokens) {
          if (sub === payload.sub) activeRefreshTokens.delete(token);
        }
      } catch {
        activeRefreshTokens.clear();
      }
    }
    return envelope(null);
  }

  if (method === "GET" && path === "/v1/auth/session/me") {
    const user = userFromAccessToken(bearer);
    if (!user) {
      return problem(401, "Unauthorized", "Sign in to continue.");
    }
    return envelope(claimsOf(user));
  }

  return problem(404, "Not found", `No mock handler for ${method} ${path}`);
}
