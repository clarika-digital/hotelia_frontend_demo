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

interface MockLeaveRequest {
  id: string;
  type: "annual" | "sick" | "casual" | "unpaid";
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: "pending" | "approved" | "used";
  submittedAt: string;
}

const INITIAL_LEAVE_REQUESTS: MockLeaveRequest[] = [
  {
    id: "L-1070",
    type: "annual",
    startDate: "2026-09-22",
    endDate: "2026-09-26",
    days: 5,
    reason: "Family trip",
    status: "pending",
    submittedAt: "2026-08-24T12:10:00.000Z",
  },
  {
    id: "L-1062",
    type: "sick",
    startDate: "2026-08-03",
    endDate: "2026-08-03",
    days: 1,
    status: "used",
    submittedAt: "2026-08-03T07:30:00.000Z",
  },
  {
    id: "L-1041",
    type: "annual",
    startDate: "2026-06-16",
    endDate: "2026-06-20",
    days: 5,
    status: "approved",
    submittedAt: "2026-05-20T09:00:00.000Z",
  },
];

const createdLeaveRequests = new Map<string, MockLeaveRequest[]>();

function leaveStoreFor(user: MockUser): MockLeaveRequest[] {
  if (!createdLeaveRequests.has(user.id)) {
    createdLeaveRequests.set(user.id, [...INITIAL_LEAVE_REQUESTS]);
  }
  return createdLeaveRequests.get(user.id)!;
}

interface MockAuditEvent {
  event: "session.lock" | "session.unlock" | "session.expire";
  at: string;
}

interface MockSessionState {
  locked: boolean;
  audit: MockAuditEvent[];
}

const userSessions = new Map<string, MockSessionState>();

function sessionStateFor(user: MockUser): MockSessionState {
  if (!userSessions.has(user.id)) {
    userSessions.set(user.id, { locked: false, audit: [] });
  }
  return userSessions.get(user.id)!;
}

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

  if (path === "/v1/auth/session/lock") {
    const user = userFromAccessToken(bearer);
    if (!user || user.userType !== "staff") {
      return problem(401, "Unauthorized", "Sign in to continue.");
    }
    const state = sessionStateFor(user);
    state.locked = true;
    state.audit.push({ event: "session.lock", at: new Date().toISOString() });
    return envelope({ locked: true, lockedAt: new Date().toISOString() });
  }

  if (path === "/v1/auth/session/unlock") {
    const user = userFromAccessToken(bearer);
    if (!user || user.userType !== "staff") {
      return problem(401, "Unauthorized", "Sign in to continue.");
    }
    const pin = String(body.pin ?? "");
    if (!pin || user.pin !== pin) {
      return problem(
        401,
        "Invalid PIN",
        "Enter the correct staff PIN to resume your session."
      );
    }
    const state = sessionStateFor(user);
    state.locked = false;
    state.audit.push({ event: "session.unlock", at: new Date().toISOString() });
    return envelope({ locked: false, unlockedAt: new Date().toISOString() });
  }

  if (path === "/v1/staff/leave/requests") {
    const user = userFromAccessToken(bearer);
    if (!user || user.userType !== "staff") {
      return problem(401, "Unauthorized", "Sign in to continue.");
    }

    if (method === "GET") {
      return envelope(leaveStoreFor(user));
    }

    if (method === "POST") {
      const type = String(body.type ?? "");
      const allowed = new Set(["annual", "sick", "casual", "unpaid"]);
      if (!allowed.has(type)) {
        return problem(
          400,
          "Invalid request",
          "Leave type is required and must be one of annual, sick, casual or unpaid."
        );
      }
      const startDate = String(body.startDate ?? "");
      const endDate = String(body.endDate ?? "");
      const reason = String(body.reason ?? "").trim();
      const start = Date.parse(startDate);
      const end = Date.parse(endDate);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
        return problem(
          400,
          "Invalid request",
          "Provide valid start and end dates (ISO), with the end on or after the start."
        );
      }
      const days = Math.round((end - start) / 86_400_000) + 1;
      const request: MockLeaveRequest = {
        id: `L-${Date.now()}`,
        type: type as MockLeaveRequest["type"],
        startDate,
        endDate,
        days,
        ...(reason ? { reason } : {}),
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      leaveStoreFor(user).unshift(request);
      return envelope(request);
    }
  }

  return problem(404, "Not found", `No mock handler for ${method} ${path}`);
}
