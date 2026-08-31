import { digitsOnly, isValidE164 } from "@/data/phones";
import { getRoomBySlug, rooms } from "@/data/rooms";
import { rateForRoom, withTax } from "@/domains/booking/rates";
import { CANCELABLE_STATUSES } from "@/domains/guests/types";
import type { GuestBooking } from "@/domains/guests/types";
import type { GuestProfile } from "@/domains/guests/types";
import type {
  AnalyticsSnapshot,
  AuditEntry,
  PermissionOverride,
  WhitelistEntry,
} from "@/domains/oversight/types";
import type {
  ExecutiveRecommendation,
  ExecutiveSnapshot,
} from "@/domains/executive/types";
import type {
  AccountantSnapshot,
  ApprovalAction,
  ApprovalItem,
} from "@/domains/accounting/types";
import type { OperationalSnapshot } from "@/domains/operations/types";
import type {
  DeviceAction,
  ItPlatformSnapshot,
  KioskTouchpoint,
  SessionDevice,
} from "@/domains/itplatform/types";
import {
  APPROVAL_FIXTURES,
  ATTENTION_FIXTURES,
  COLLECTION_HISTORY,
  COLLECTION_SPLIT_TODAY,
  GUEST_BOOKINGS,
  GUEST_USERS,
  INVOICE_FIXTURES,
  ISOLATED_AUDIT_FIXTURES,
  IT_GEOFENCE_FIXTURES,
  IT_SYSTEM_HEALTH_FIXTURES,
  KIOSK_FIXTURES,
  OVERRIDE_FIXTURES,
  OVERSEER_ROLE_MATRIX,
  PERMISSION_CATALOG,
  REFUND_FIXTURES,
  SESSION_DEVICE_FIXTURES,
  STANDARD_AUDIT_FIXTURES,
  STAFF_USERS,
  TEAM_SNAPSHOT_FIXTURES,
  WHITELIST_FIXTURES,
  WORK_ORDER_FIXTURES,
  type MockUser,
} from "./fixtures";

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
const DAY_MS = 86_400_000;

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

interface MockGuestProfileOverrides {
  name?: string;
  phone?: string;
  locale?: string;
  currency?: string;
  preferredCountry?: string;
}

const guestProfileOverrides = new Map<string, MockGuestProfileOverrides>();

const guestBookingsByUser = new Map<string, GuestBooking[]>();

const walkInBookings: GuestBooking[] = [];

function findBookingByRef(ref: string): GuestBooking | undefined {
  const owned: GuestBooking[] = [];
  for (const list of guestBookingsByUser.values()) owned.push(...list);
  return [...walkInBookings, ...GUEST_BOOKINGS, ...owned].find(
    (b) => b.ref === ref
  );
}

function allBookings(): GuestBooking[] {
  const owned: GuestBooking[] = [];
  for (const list of guestBookingsByUser.values()) owned.push(...list);
  return [...walkInBookings, ...GUEST_BOOKINGS, ...owned];
}

function overrideActive(o: PermissionOverride): boolean {
  return !o.expiresAt || new Date(o.expiresAt).getTime() > Date.now();
}

function overrideExpiresSoon(o: PermissionOverride): boolean {
  if (!o.expiresAt) return false;
  const ms = new Date(o.expiresAt).getTime() - Date.now();
  return ms > 0 && ms < 7 * 24 * 3600 * 1000;
}

const permissionOverrides: PermissionOverride[] = OVERRIDE_FIXTURES.map(
  (o) => ({ ...o })
);
const whitelist: WhitelistEntry[] = WHITELIST_FIXTURES.map((w) => ({
  ...w,
  ...(w.scopedHours ? { scopedHours: { ...w.scopedHours } } : {}),
}));
const isolatedAuditLog: AuditEntry[] = [...ISOLATED_AUDIT_FIXTURES];
const standardAuditLog: AuditEntry[] = [...STANDARD_AUDIT_FIXTURES];
const approvals: ApprovalItem[] = APPROVAL_FIXTURES.map((a) => ({ ...a }));
const itSessions: SessionDevice[] = SESSION_DEVICE_FIXTURES.map((s) => ({ ...s }));
const itKiosks: KioskTouchpoint[] = KIOSK_FIXTURES.map((k) => ({ ...k }));

function appAuditId(): number {
  return Math.max(
    ...isolatedAuditLog.map((e) => Number(e.id.replace(/\D/g, "")) || 0),
    ...standardAuditLog.map((e) => Number(e.id.replace(/\D/g, "")) || 0)
  );
}

function recordIsolated(actor: MockUser, action: string, detail: string): AuditEntry {
  const entry: AuditEntry = {
    id: `iso-${appAuditId() + 1}`,
    actor: actor.name,
    actorRole: actor.role ?? "staff",
    action,
    detail,
    at: new Date().toISOString(),
  };
  isolatedAuditLog.unshift(entry);
  return entry;
}

function recordStandard(actor: MockUser, action: string, detail: string): AuditEntry {
  const entry: AuditEntry = {
    id: `std-${appAuditId() + 1}`,
    actor: actor.name,
    actorRole: actor.role ?? "staff",
    action,
    detail,
    at: new Date().toISOString(),
  };
  standardAuditLog.unshift(entry);
  return entry;
}

let bookingRefCounter = 9000;

function nextBookingRef(): string {
  bookingRefCounter += 1;
  return `HT-${bookingRefCounter}`;
}

function bookingCancellationPin(): string {
  return String(1000 + Math.floor(Math.random() * 9000));
}

function guestBookingsFor(user: MockUser): GuestBooking[] {
  if (!guestBookingsByUser.has(user.id)) {
    guestBookingsByUser.set(
      user.id,
      GUEST_BOOKINGS.filter((b) => b.guestId === user.id)
    );
  }
  return guestBookingsByUser.get(user.id)!;
}

function guestProfileFor(user: MockUser): GuestProfile {
  const overrides = guestProfileOverrides.get(user.id) ?? {};
  const name = overrides.name ?? user.name;
  const phone = overrides.phone ?? user.phone ?? "";
  const preferredCountry =
    overrides.preferredCountry ?? (user.id === "guest-1" ? "Ghana" : "");
  const missingFields: string[] = [];
  if (!name.trim()) missingFields.push("Name");
  if (!isValidE164(phone)) missingFields.push("Phone number");
  if (!preferredCountry?.trim()) missingFields.push("Country of residence");
  return {
    name,
    email: user.email,
    phone,
    locale: overrides.locale ?? "en",
    currency: overrides.currency ?? "GHS",
    ...(preferredCountry?.trim() ? { preferredCountry } : {}),
    profileComplete: missingFields.length === 0,
    missingFields,
  };
}

function guestWithPermission(
  bearer: string | null,
  permission: string
): MockUser | undefined {
  const user = userFromAccessToken(bearer);
  if (!user || user.userType !== "guest") return undefined;
  if (!user.permissions.includes(permission)) return undefined;
  return user;
}

function staffWithPermission(
  bearer: string | null,
  permission: string
): MockUser | undefined {
  const user = userFromAccessToken(bearer);
  if (!user || user.userType !== "staff") return undefined;
  if (!user.permissions.includes(permission)) return undefined;
  return user;
}

function oversightId(path: string, prefix: string): string | undefined {
  if (!path.startsWith(prefix)) return undefined;
  const id = path.slice(prefix.length);
  return id && !id.includes("/") ? decodeURIComponent(id) : undefined;
}

function guestBookingRef(path: string, suffix?: string): string | undefined {
  const prefix = "/v1/guest/bookings/";
  if (suffix && !path.endsWith(suffix)) return undefined;
  const bodyStr = suffix ? path.slice(0, path.length - suffix.length) : path;
  if (!bodyStr.startsWith(prefix)) return undefined;
  const ref = bodyStr.slice(prefix.length);
  return ref && !ref.includes("/") ? decodeURIComponent(ref) : undefined;
}

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
      permissions: [
        "bookings.own.read",
        "bookings.own.create",
        "profile.own.manage",
        "export.own.request",
      ],
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

  // ---- Guest self-service: bookings ----

  if (path === "/v1/guest/bookings/lookup" && method === "POST") {
    const ref = String(body.ref ?? "").trim().toUpperCase();
    const pin = String(body.pin ?? "").trim();
    const booking = ref ? findBookingByRef(ref) : undefined;
    if (!booking || !pin || booking.pin !== pin) {
      return problem(
        401,
        "Invalid reference or PIN",
        "We could not verify that reference and PIN combination."
      );
    }
    return envelope(booking);
  }

  const cancelBookingRef = guestBookingRef(path, "/cancel");
  if (cancelBookingRef && method === "POST") {
    let booking = walkInBookings.find((b) => b.ref === cancelBookingRef);
    if (!booking) {
      const user =
        guestWithPermission(bearer, "bookings.own.read") ??
        userFromAccessToken(bearer);
      if (!user || user.userType !== "guest") {
        return problem(401, "Unauthorized", "Sign in to continue.");
      }
      if (!user.permissions.includes("bookings.own.read")) {
        return problem(403, "Forbidden", "You do not have permission to cancel bookings.");
      }
      booking = guestBookingsFor(user).find((b) => b.ref === cancelBookingRef);
    }
    if (!booking) {
      return problem(404, "Not found", `No booking with reference ${cancelBookingRef}.`);
    }
    if (!CANCELABLE_STATUSES.includes(booking.status)) {
      return problem(
        409,
        "Booking not cancellable",
        "Only pending or confirmed bookings can be cancelled online."
      );
    }
    const pin = String(body.pin ?? "");
    if (!pin || booking.pin !== pin) {
      return problem(
        401,
        "Invalid PIN",
        "Enter the booking PIN shown on your confirmation to cancel."
      );
    }
    const daysUntilCheckIn = Math.ceil(
      (Date.parse(booking.checkIn) - Date.now()) / 86_400_000
    );
    const refundPercent =
      daysUntilCheckIn >= 7 ? 100 : daysUntilCheckIn >= 3 ? 75 : daysUntilCheckIn >= 1 ? 50 : 0;
    const refundAmount = Math.round((booking.total * refundPercent) / 100);
    booking.status = "cancelled";
    booking.cancellation = {
      requestedAt: new Date().toISOString(),
      refundPercent,
      refundAmount,
    };
    booking.events.push({
      at: new Date().toISOString(),
      label: "Cancelled",
      note: `Booking cancelled. Refund of ${refundPercent}% (GHS ${refundAmount}) applies.`,
    });
    return envelope(booking);
  }

  const bookingRef = guestBookingRef(path);
  if (bookingRef && method === "GET") {
    const user = guestWithPermission(bearer, "bookings.own.read") ?? userFromAccessToken(bearer);
    if (!user || user.userType !== "guest") {
      return problem(401, "Unauthorized", "Sign in to continue.");
    }
    if (!user.permissions.includes("bookings.own.read")) {
      return problem(403, "Forbidden", "You do not have permission to view bookings.");
    }
    const booking = guestBookingsFor(user).find((b) => b.ref === bookingRef);
    if (!booking) {
      return problem(404, "Not found", `No booking with reference ${bookingRef}.`);
    }
    return envelope(booking);
  }

  if (path === "/v1/guest/bookings" && method === "GET") {
    const user = guestWithPermission(bearer, "bookings.own.read");
    if (!user) {
      return problem(401, "Unauthorized", "Sign in to continue.");
    }
    return envelope(guestBookingsFor(user));
  }

  if (path === "/v1/guest/reservations" && method === "POST") {
    const guest = guestWithPermission(bearer, "bookings.own.create");
    const signedIn = userFromAccessToken(bearer) !== undefined;
    if (!guest && signedIn) {
      return problem(
        403,
        "Forbidden",
        "Only a signed-in guest account or a walk-in guest can create a reservation."
      );
    }

    let guestId = "walkin";
    let reservedNote = "Reserved as a walk-in guest — no account required.";
    if (!guest) {
      const name = String(body.name ?? "").trim();
      const email = String(body.email ?? "").trim();
      const phone = canonicalPhone(String(body.phone ?? ""));
      if (!name) {
        return problem(400, "Invalid name", "Enter the guest's name.");
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return problem(400, "Invalid email", "Enter a valid email address.");
      }
      if (!isValidE164(phone)) {
        return problem(
          400,
          "Invalid phone number",
          "Enter a valid phone number including the country code."
        );
      }
    } else {
      guestId = guest.id;
      reservedNote = "Reserved online — pending confirmation at the desk.";
    }

    const room = getRoomBySlug(String(body.roomSlug ?? ""));
    if (!room) {
      return problem(400, "Invalid room", "Choose a valid room type.");
    }
    const rateId = String(body.rateId ?? "");
    const rate = rateForRoom(room, rateId as never);
    if (!rate) {
      return problem(400, "Invalid rate", "Choose a valid rate plan.");
    }

    const checkIn = String(body.checkIn ?? "");
    const checkOut = String(body.checkOut ?? "");
    const start = Date.parse(checkIn);
    const end = Date.parse(checkOut);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return problem(
        400,
        "Invalid dates",
        "Choose a check-in before the check-out date."
      );
    }

    const rooms = Math.max(1, Math.floor(Number(body.rooms) || 1));
    const adults = Math.max(1, Math.floor(Number(body.adults) || 2));
    const children = Math.max(0, Math.floor(Number(body.children) || 0));
    const nights = Math.round((end - start) / 86_400_000);
    const guests = adults + children;
    const total = withTax(rooms * nights * rate.perNight);

    const booking: GuestBooking = {
      id: `bkg-${Date.now()}`,
      ref: nextBookingRef(),
      guestId,
      roomCategory: room.title,
      planTitle: rate.title,
      perNight: rate.perNight,
      checkIn,
      checkOut,
      nights,
      guests,
      total,
      currency: "GHS",
      status: "pending",
      pin: bookingCancellationPin(),
      createdAt: new Date().toISOString(),
      events: [
        {
          at: new Date().toISOString(),
          label: "Booking requested",
          note: reservedNote,
        },
      ],
    };

    if (guestId === "walkin") {
      walkInBookings.push(booking);
    } else {
      guestBookingsFor(guest!).push(booking);
    }
    return envelope(booking);
  }

  // ---- Guest self-service: profile & export ----

  if (path === "/v1/guest/profile") {
    const user = guestWithPermission(bearer, "profile.own.manage");
    if (!user) {
      return problem(401, "Unauthorized", "Sign in to continue.");
    }

    if (method === "GET") {
      return envelope(guestProfileFor(user));
    }

    if (method === "PUT") {
      const prev = guestProfileOverrides.get(user.id) ?? {};
      const next: MockGuestProfileOverrides = { ...prev };

      if (body.name !== undefined) {
        const name = String(body.name ?? "").trim();
        if (!name) {
          return problem(400, "Invalid name", "Name cannot be empty.");
        }
        next.name = name;
      }

      if (body.phone !== undefined) {
        const phone = canonicalPhone(String(body.phone ?? ""));
        if (!isValidE164(phone)) {
          return problem(
            400,
            "Invalid phone number",
            "Enter a valid phone number including the country code."
          );
        }
        next.phone = phone;
      }

      if (body.locale !== undefined) {
        const locale = String(body.locale ?? "").trim();
        if (!locale) {
          return problem(400, "Invalid locale", "Locale cannot be empty.");
        }
        next.locale = locale;
      }

      if (body.currency !== undefined) {
        const currency = String(body.currency ?? "").trim().toUpperCase();
        if (!currency) {
          return problem(400, "Invalid currency", "Currency cannot be empty.");
        }
        next.currency = currency;
      }

      if (body.preferredCountry !== undefined) {
        next.preferredCountry = String(body.preferredCountry ?? "").trim();
      }

      guestProfileOverrides.set(user.id, next);
      return envelope(guestProfileFor(user));
    }
  }

  if (path === "/v1/guest/export" && method === "POST") {
    const user = guestWithPermission(bearer, "export.own.request");
    if (!user) {
      return problem(401, "Unauthorized", "Sign in to continue.");
    }
    const profile = guestProfileFor(user);
    if (!profile.profileComplete) {
      return problem(
        403,
        "Profile incomplete",
        `Complete your profile to unlock data export. Missing: ${profile.missingFields.join(", ")}.`
      );
    }
    const bookings = guestBookingsFor(user);
    const totals = bookings.reduce(
      (acc, b) => {
        acc.count += 1;
        acc.nights += b.nights;
        if (b.status === "checked_in" || b.status === "checked_out") {
          acc.totalSpent += b.total;
        }
        return acc;
      },
      { count: 0, nights: 0, totalSpent: 0 }
    );
    return envelope({
      generatedAt: new Date().toISOString(),
      profile,
      bookings,
      totals,
    });
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

  if (method === "DELETE") {
    const overrideId = oversightId(path, "/v1/oversight/overrides/");
    if (overrideId) {
      const actor = staffWithPermission(bearer, "rbac.override");
      if (!actor) {
        return problem(401, "Unauthorized", "Super admin access required.");
      }
      const index = permissionOverrides.findIndex((o) => o.id === overrideId);
      if (index === -1) {
        return problem(404, "Not found", `No override with id ${overrideId}.`);
      }
      const [removed] = permissionOverrides.splice(index, 1);
      recordIsolated(
        actor,
        "Override revoked",
        `${removed.userName} \u2014 ${removed.permission}.`
      );
      return envelope({ revoked: true });
    }

    const whitelistId = oversightId(path, "/v1/oversight/whitelist/");
    if (whitelistId) {
      const actor = staffWithPermission(bearer, "rbac.whitelist");
      if (!actor) {
        return problem(401, "Unauthorized", "Super admin access required.");
      }
      const index = whitelist.findIndex((w) => w.id === whitelistId);
      if (index === -1) {
        return problem(404, "Not found", `No whitelist entry with id ${whitelistId}.`);
      }
      const [removed] = whitelist.splice(index, 1);
      recordIsolated(
        actor,
        "Whitelist exemption revoked",
        `${removed.userName} \u2014 geofence now enforced.`
      );
      return envelope({ revoked: true });
    }
  }

  if (path === "/v1/oversight/overrides" && method === "GET") {
    const actor = staffWithPermission(bearer, "rbac.override");
    if (!actor) {
      return problem(401, "Unauthorized", "Super admin access required.");
    }
    return envelope([...permissionOverrides].reverse());
  }

  if (path === "/v1/oversight/overrides" && method === "POST") {
    const actor = staffWithPermission(bearer, "rbac.override");
    if (!actor) {
      return problem(401, "Unauthorized", "Super admin access required.");
    }
    const userId = String(body.userId ?? "");
    const permission = String(body.permission ?? "").trim();
    const target = userById(userId);
    if (!target) {
      return problem(400, "Invalid user", "Choose a valid system user.");
    }
    if (!permission || !(PERMISSION_CATALOG as readonly string[]).includes(permission)) {
      return problem(
        400,
        "Invalid permission",
        "Choose a permission from the catalog."
      );
    }
    const expiresRaw = body.expiresAt ? String(body.expiresAt) : undefined;
    const expiresAt =
      expiresRaw && Number.isFinite(Date.parse(expiresRaw)) ? expiresRaw : undefined;
    const override: PermissionOverride = {
      id: `ovr-${Date.now()}`,
      userId: target.id,
      userName: target.name,
      permission,
      grantedBy: actor.name,
      createdAt: new Date().toISOString(),
      ...(expiresAt ? { expiresAt } : {}),
    };
    permissionOverrides.push(override);
    recordIsolated(
      actor,
      "Override granted",
      `${target.name} \u2192 ${permission}${
        expiresAt
          ? ` (until ${new Date(expiresAt).toISOString().slice(0, 10)})`
          : " (no expiry)"
      }.`
    );
    return envelope(override);
  }

  if (path === "/v1/oversight/whitelist" && method === "GET") {
    const actor = staffWithPermission(bearer, "rbac.whitelist");
    if (!actor) {
      return problem(401, "Unauthorized", "Super admin access required.");
    }
    return envelope([...whitelist].reverse());
  }

  if (path === "/v1/oversight/whitelist" && method === "POST") {
    const actor = staffWithPermission(bearer, "rbac.whitelist");
    if (!actor) {
      return problem(401, "Unauthorized", "Super admin access required.");
    }
    const userId = String(body.userId ?? "");
    const target = userById(userId);
    if (!target) {
      return problem(400, "Invalid user", "Choose a valid system user.");
    }
    const reason = body.reason ? String(body.reason).trim() : undefined;
    const rawHours = body.scopedHours as
      | { start?: string; end?: string }
      | undefined;
    const hoursPattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    const scopedHours =
      rawHours && rawHours.start && rawHours.end
        ? {
            start: String(rawHours.start),
            end: String(rawHours.end),
          }
        : undefined;
    if (
      scopedHours &&
      (!hoursPattern.test(scopedHours.start) || !hoursPattern.test(scopedHours.end))
    ) {
      return problem(
        400,
        "Invalid hours",
        "Scoped hours must use 24h HH:MM format."
      );
    }
    const entry: WhitelistEntry = {
      id: `wl-${Date.now()}`,
      userId: target.id,
      userName: target.name,
      ...(reason ? { reason } : {}),
      ...(scopedHours ? { scopedHours } : {}),
      grantedBy: actor.name,
      createdAt: new Date().toISOString(),
    };
    whitelist.push(entry);
    recordIsolated(
      actor,
      "Whitelist exemption added",
      `${target.name}${
        scopedHours
          ? ` \u2014 scoped ${scopedHours.start}\u2013${scopedHours.end}`
          : " \u2014 geofence exempt"
      }.`
    );
    return envelope(entry);
  }

  if (path === "/v1/oversight/log" && method === "GET") {
    const actor = staffWithPermission(bearer, "audit.super_admin.read");
    if (!actor) {
      return problem(401, "Unauthorized", "Super admin audit access required.");
    }
    return envelope([...isolatedAuditLog]);
  }

  if (path === "/v1/audit/log" && method === "GET") {
    const actor = staffWithPermission(bearer, "audit.read");
    if (!actor) {
      return problem(401, "Unauthorized", "Standard audit access required.");
    }
    const entries = standardAuditLog.filter((e) => e.actorRole !== "super_admin");
    return envelope([...entries].reverse());
  }

  if (path === "/v1/oversight/users" && method === "GET") {
    const actor = staffWithPermission(bearer, "rbac.override");
    if (!actor) {
      return problem(401, "Unauthorized", "Super admin access required.");
    }
    return envelope(
      [...STAFF_USERS, ...GUEST_USERS].map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        userType: u.userType,
        role: u.role ?? null,
        permissions: u.permissions,
      }))
    );
  }

  if (path === "/v1/oversight/matrix" && method === "GET") {
    const actor = staffWithPermission(bearer, "rbac.override");
    if (!actor) {
      return problem(401, "Unauthorized", "Super admin access required.");
    }
    return envelope({ roles: OVERSEER_ROLE_MATRIX, catalog: PERMISSION_CATALOG });
  }

  if (path === "/v1/oversight/analytics" && method === "GET") {
    const actor = staffWithPermission(bearer, "audit.read");
    if (!actor) {
      return problem(401, "Unauthorized", "Audit read access required.");
    }

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const isToday = (iso: string) => iso.slice(0, 10) === todayKey;

    const bookings = allBookings();
    const countBy = (status: GuestBooking["status"]) =>
      bookings.filter((b) => b.status === status).length;

    const inHouse = countBy("checked_in");
    const arrivingToday = bookings.filter(
      (b) => b.status === "confirmed" && isToday(b.checkIn)
    ).length;
    const departingToday = bookings.filter(
      (b) => b.status === "checked_in" && isToday(b.checkOut)
    ).length;

    const occupiedNow = inHouse + arrivingToday;
    const totalRooms = rooms.length;
    const roomCategories = [
      "rooms",
      "suites",
      "horizon-club",
      "connecting",
    ] as const;
    const byCategory = roomCategories.map((cat) => {
      const categoryTotal = rooms.filter((r) => r.category === cat).length;
      const occupied = bookings.filter(
        (b) =>
          (b.status === "checked_in" ||
            (b.status === "confirmed" && isToday(b.checkIn))) &&
          b.roomCategory === cat
      ).length;
      return {
        category: cat,
        total: categoryTotal,
        occupied: Math.min(occupied, categoryTotal),
      };
    });

    const revenueBookings = bookings.filter(
      (b) =>
        b.status === "confirmed" ||
        b.status === "checked_in" ||
        b.status === "checked_out"
    );
    const confirmedAmt = revenueBookings.reduce((a, b) => a + b.total, 0);
    const pendingAmt = bookings
      .filter((b) => b.status === "pending")
      .reduce((a, b) => a + b.total, 0);
    const cancelledAmt = bookings
      .filter((b) => b.status === "cancelled")
      .reduce((a, b) => a + b.total, 0);
    const revenueNights = revenueBookings.reduce((a, b) => a + b.nights, 0);
    const weights = [0.1, 0.14, 0.12, 0.18, 0.15, 0.31];
    const trending = weights.map((w, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (5 - i) * 7);
      return {
        label: d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        amount: Math.round(confirmedAmt * w),
      };
    });

    const allGuests = [...GUEST_USERS, ...registeredGuests];
    const guestTotal = allGuests.length;
    const registeredCount = registeredGuests.length;
    const completeProfiles =
      (GUEST_USERS.some((u) => u.id === "guest-1") ? 1 : 0) + registeredCount;

    const snapshot: AnalyticsSnapshot = {
      generatedAt: now.toISOString(),
      occupancy: {
        totalRooms,
        inHouse,
        arrivingToday,
        departingToday,
        available: Math.max(totalRooms - occupiedNow, 0),
        rate: totalRooms ? Math.round((occupiedNow / totalRooms) * 100) : 0,
        byCategory,
      },
      revenue: {
        total: confirmedAmt + pendingAmt,
        confirmed: confirmedAmt,
        pending: pendingAmt,
        cancelled: cancelledAmt,
        perNight: revenueNights ? Math.round(confirmedAmt / revenueNights) : 0,
        tax: Math.round(confirmedAmt - confirmedAmt / 1.15),
        trend: trending,
      },
      reservations: {
        pending: countBy("pending"),
        confirmed: countBy("confirmed"),
        inHouse: countBy("checked_in"),
        completed: countBy("checked_out"),
        cancelled: countBy("cancelled"),
        account: bookings.length - walkInBookings.length,
        walkIn: walkInBookings.length,
        avgNights: bookings.length
          ? Math.round((bookings.reduce((a, b) => a + b.nights, 0) / bookings.length) * 10) / 10
          : 0,
      },
      guests: {
        total: guestTotal,
        registered: registeredCount,
        completeProfiles,
        byCountry: [
          { country: "Ghana", count: Math.max(guestTotal - 2, 0) },
          { country: "United Kingdom", count: 1 },
          { country: "United States", count: 1 },
        ],
      },
      security: {
        activeSessions: activeRefreshTokens.size,
        overrides: permissionOverrides.filter(overrideActive).length,
        expiringSoon: permissionOverrides.filter(overrideExpiresSoon).length,
        whitelist: whitelist.length,
        violations: STAFF_USERS.filter((u) => !geofenceAllowed(u)).length,
        accountsByRole: (() => {
          const counts = new Map<string, number>();
          for (const u of STAFF_USERS) {
            const role = u.role ?? "staff";
            counts.set(role, (counts.get(role) ?? 0) + 1);
          }
          counts.set("guest", (counts.get("guest") ?? 0) + guestTotal);
          return [...counts.entries()].map(([role, count]) => ({ role, count }));
        })(),
      },
      audit: {
        isolatedToday: isolatedAuditLog.filter((e) => isToday(e.at)).length,
        standardToday: standardAuditLog.filter(
          (e) => e.actorRole !== "super_admin" && isToday(e.at)
        ).length,
        recent: [...isolatedAuditLog].slice(0, 3),
      },
    };

    return envelope(snapshot);
  }

  if (path === "/v1/executive/analytics" && method === "GET") {
    const actor = staffWithPermission(bearer, "analytics.read");
    if (!actor) {
      return problem(401, "Unauthorized", "Analytics read access required.");
    }

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const isToday = (iso: string) => iso.slice(0, 10) === todayKey;

    const bookings = allBookings();
    const countBy = (status: GuestBooking["status"]) =>
      bookings.filter((b) => b.status === status).length;

    const inHouse = countBy("checked_in");
    const arrivingToday = bookings.filter(
      (b) => b.status === "confirmed" && isToday(b.checkIn)
    ).length;
    const departingToday = bookings.filter(
      (b) => b.status === "checked_in" && isToday(b.checkOut)
    ).length;

    const occupiedNow = inHouse + arrivingToday;
    const totalRooms = rooms.length;
    const available = Math.max(totalRooms - occupiedNow, 0);
    const occupancyRate = totalRooms ? Math.round((occupiedNow / totalRooms) * 100) : 0;

    const roomCategories = [
      "rooms",
      "suites",
      "horizon-club",
      "connecting",
    ] as const;
    const byCategory = roomCategories.map((cat) => {
      const categoryTotal = rooms.filter((r) => r.category === cat).length;
      const occupied = bookings.filter(
        (b) =>
          (b.status === "checked_in" ||
            (b.status === "confirmed" && isToday(b.checkIn))) &&
          b.roomCategory === cat
      ).length;
      return {
        category: cat,
        total: categoryTotal,
        occupied: Math.min(occupied, categoryTotal),
      };
    });

    const revenueBookings = bookings.filter(
      (b) =>
        b.status === "confirmed" ||
        b.status === "checked_in" ||
        b.status === "checked_out"
    );
    const confirmedAmt = revenueBookings.reduce((a, b) => a + b.total, 0);
    const pendingAmt = bookings
      .filter((b) => b.status === "pending")
      .reduce((a, b) => a + b.total, 0);
    const cancelledAmt = bookings
      .filter((b) => b.status === "cancelled")
      .reduce((a, b) => a + b.total, 0);
    const revenueNights = revenueBookings.reduce((a, b) => a + b.nights, 0);
    const perNight = revenueNights ? Math.round(confirmedAmt / revenueNights) : 0;
    const adr = revenueNights ? Math.round(confirmedAmt / revenueNights) : 0;
    const revpar = totalRooms ? Math.round(confirmedAmt / totalRooms) : 0;
    const tax = Math.round(confirmedAmt - confirmedAmt / 1.15);

    const weights = [0.1, 0.14, 0.12, 0.18, 0.15, 0.31];
    const trend = weights.map((w, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (5 - i) * 7);
      return {
        label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
        amount: Math.round(confirmedAmt * w),
      };
    });

    const pending = countBy("pending");
    const confirmed = countBy("confirmed");
    const completed = countBy("checked_out");
    const cancelled = countBy("cancelled");
    const account = bookings.length - walkInBookings.length;
    const walkIn = walkInBookings.length;
    const advance7d = bookings.filter(
      (b) => ["pending", "confirmed"].includes(b.status) &&
        Date.parse(b.checkIn) - now.getTime() <= 7 * DAY_MS &&
        Date.parse(b.checkIn) - now.getTime() >= 0
    ).length;
    const weekendArrivals = bookings.filter(
      (b) => b.status === "confirmed" && isToday(b.checkIn)
    ).length;
    const weekendProjection = totalRooms
      ? Math.min(
          100,
          Math.round(((inHouse + weekendArrivals + confirmed) / totalRooms) * 100)
        )
      : 0;
    const avgNights = bookings.length
      ? Math.round((bookings.reduce((a, b) => a + b.nights, 0) / bookings.length) * 10) / 10
      : 0;

    const allGuests = [...GUEST_USERS, ...registeredGuests];
    const guestTotal = allGuests.length;
    const byCountry = [
      { country: "Ghana", count: Math.max(guestTotal - 2, 0) },
      { country: "United Kingdom", count: 1 },
      { country: "United States", count: 1 },
    ];

    const trendDelta =
      trend.length >= 2 && trend[trend.length - 1].amount
        ? Math.round(
            ((trend[trend.length - 1].amount - trend[trend.length - 2].amount) /
              trend[trend.length - 2].amount) *
              100
          )
        : 0;

    const recommendations: ExecutiveRecommendation[] = [
      {
        label: trendDelta >= 0 ? "Weekend rate lift" : "Stabilise weekend pricing",
        impact: trendDelta >= 0 ? `+${trendDelta}% est.` : "Review pricing",
        tone: trendDelta >= 0 ? "green" : "amber",
        why: `Revenue trend ${trendDelta >= 0 ? "up" : "down"} ${Math.abs(trendDelta)}% WoW`,
      },
      {
        label: "Repeat-guest loyalty",
        impact: `${Math.max(Math.round(guestTotal * 0.22), 0)} guests`,
        tone: "amber",
        why: "2+ stays projected in 60 days",
      },
      {
        label: "Advance demand capture",
        impact: `${advance7d} within 7 days`,
        tone: advance7d > 20 ? "green" : "neutral",
        why: `${advance7d} advance bookings in the window`,
      },
    ];

    const snapshot: ExecutiveSnapshot = {
      generatedAt: now.toISOString(),
      performance: {
        revenueToday: confirmedAmt,
        occupancyRate,
        adr,
        revpar,
        totalRooms,
        inHouse,
        available,
      },
      occupancy: {
        totalRooms,
        inHouse,
        arrivingToday,
        departingToday,
        available,
        rate: occupancyRate,
        byCategory,
      },
      revenue: {
        confirmed: confirmedAmt,
        pending: pendingAmt,
        cancelled: cancelledAmt,
        perNight,
        adr,
        revpar,
        tax,
        trend,
      },
      demand: {
        pending,
        confirmed,
        inHouse,
        completed,
        cancelled,
        account,
        walkIn,
        advance7d,
        weekendProjection,
        avgNights,
      },
      markets: {
        total: guestTotal,
        byCountry,
      },
      recommendations,
    };

    return envelope(snapshot);
  }

  if (path === "/v1/accountant/overview" && method === "GET") {
    const actor = staffWithPermission(bearer, "payments.read");
    if (!actor) {
      return problem(401, "Unauthorized", "Payments read access required.");
    }

    const pending = approvals.filter((a) => a.status === "pending");
    const pendingValue = pending.reduce((sum, a) => sum + a.amount, 0);
    const oldest = pending.reduce<number | null>((min, a) => {
      const age = Date.now() - Date.parse(a.createdAt);
      return min === null ? age : Math.max(min, age);
    }, null);

    const pendingRefunds = REFUND_FIXTURES.filter(
      (r) => r.status === "pending" || r.status === "manager_sign_off"
    );
    const requiringSignOff = REFUND_FIXTURES.filter(
      (r) => r.status === "manager_sign_off"
    ).length;

    const openInvoices = INVOICE_FIXTURES.filter((i) => i.status !== "paid");
    const outstandingValue = openInvoices.reduce((sum, i) => sum + i.amount, 0);
    const overdue = INVOICE_FIXTURES.filter((i) => i.status === "overdue").length;

    const collectedToday =
      COLLECTION_HISTORY.length > 0
        ? COLLECTION_HISTORY[COLLECTION_HISTORY.length - 1].amount
        : 0;
    const expected = collectedToday;
    const settled = COLLECTION_SPLIT_TODAY.reduce((sum, m) => sum + m.amount, 0);
    const reconciliationVariance = expected - settled;

    const snapshot: AccountantSnapshot = {
      generatedAt: new Date().toISOString(),
      kpis: {
        pendingApprovals: pending.length,
        pendingApprovalsValue: pendingValue,
        oldestApprovalAgeMin: oldest ? Math.round(oldest / 60000) : 0,
        collectedToday,
        refundsInFlight: pendingRefunds.length,
        refundsRequiringSignOff: requiringSignOff,
        outstandingInvoices: openInvoices.length,
        outstandingValue,
        overdueInvoices: overdue,
        reconciliationVariance,
        fxConversions: 6,
      },
      collections: {
        todayByMethod: COLLECTION_SPLIT_TODAY,
        trend7d: COLLECTION_HISTORY,
      },
      approvals: approvals.map((a) => ({ ...a })),
      refunds: REFUND_FIXTURES.map((r) => ({ ...r })),
      invoices: INVOICE_FIXTURES.map((i) => ({ ...i })),
      reconciliation: {
        expected,
        settled,
        variance: reconciliationVariance,
        settledByMethod: COLLECTION_SPLIT_TODAY,
      },
    };

    return envelope(snapshot);
  }

  if (path === "/v1/accountant/approvals" && method === "POST") {
    const actor = staffWithPermission(bearer, "payments.approve");
    if (!actor) {
      return problem(401, "Unauthorized", "Payment approval access required.");
    }
    const id = String(body.id ?? "");
    const action = String(body.action ?? "") as ApprovalAction;
    const target = approvals.find((a) => a.id === id);
    if (!target) {
      return problem(404, "Not found", `No pending approval with id ${id}.`);
    }
    if (!["approve", "reject"].includes(action)) {
      return problem(422, "Invalid action", "Action must be approve or reject.");
    }
    if (target.status !== "pending") {
      return problem(409, "Already decided", `Approval ${target.ref} is already ${target.status}.`);
    }

    target.status = action === "approve" ? "approved" : "rejected";
    recordStandard(
      actor,
      action === "approve" ? "Payment approved" : "Payment rejected",
      `${target.ref} · ${target.guest} · ${target.method}`
    );

    return envelope({ ...target });
  }

  if (path === "/v1/manager/overview" && method === "GET") {
    const actor = staffWithPermission(bearer, "analytics.read");
    if (!actor) {
      return problem(401, "Unauthorized", "Analytics read access required.");
    }

    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const isToday = (iso: string) => iso.slice(0, 10) === todayKey;

    const bookings = allBookings();
    const countBy = (status: GuestBooking["status"]) =>
      bookings.filter((b) => b.status === status).length;

    const inHouse = countBy("checked_in");
    const arrivalsToday = bookings.filter(
      (b) => b.status === "confirmed" && isToday(b.checkIn)
    ).length;
    const departuresToday = bookings.filter(
      (b) => b.status === "checked_in" && isToday(b.checkOut)
    ).length;
    const occupiedNow = inHouse + arrivalsToday;
    const totalRooms = rooms.length;
    const occupancy = totalRooms ? Math.round((occupiedNow / totalRooms) * 100) : 0;

    const occupiedByCat = new Map<string, number>();
    for (const b of bookings) {
      if (b.status === "checked_in" || (b.status === "confirmed" && isToday(b.checkIn))) {
        occupiedByCat.set(b.roomCategory, (occupiedByCat.get(b.roomCategory) ?? 0) + 1);
      }
    }
    const occupancyTrend = [
      { label: "Mon", value: 66 },
      { label: "Tue", value: 71 },
      { label: "Wed", value: 68 },
      { label: "Thu", value: 74 },
      { label: "Fri", value: 79 },
      { label: "Sat", value: occupancy },
      { label: "Sun", value: occupancy },
    ];

    const openWorkOrders = WORK_ORDER_FIXTURES.filter(
      (w) => w.status !== "resolved"
    ).length;
    const highPriority = WORK_ORDER_FIXTURES.filter(
      (w) => w.priority === "high" && w.status !== "resolved"
    ).length;
    const housekeepingInProgress =
      TEAM_SNAPSHOT_FIXTURES.find((t) => t.label === "Housekeeping in progress")?.value ?? 0;
    const guestApprovalsPending =
      TEAM_SNAPSHOT_FIXTURES.find((t) => t.label === "Guest approvals pending")?.value ?? 0;
    const blockedRooms =
      TEAM_SNAPSHOT_FIXTURES.find((t) => t.label === "Rooms blocked for maintenance")?.value ?? 0;

    const pendingScrutiny = REFUND_FIXTURES.filter(
      (r) => r.status === "pending" || r.status === "manager_sign_off"
    ).length;
    const signOffRequired = REFUND_FIXTURES.filter(
      (r) => r.status === "manager_sign_off"
    ).length;
    const pendingEscalations =
      ATTENTION_FIXTURES.filter((a) => a.priority === "high" || a.priority === "medium")
        .length;
    const openTasks = openWorkOrders + housekeepingInProgress + guestApprovalsPending;

    const account = bookings.length - walkInBookings.length;
    const walkIn = walkInBookings.length;

    const recommendations = [
      {
        id: "op-rec-1",
        level: "warning" as const,
        message: `${highPriority} high-priority work order${highPriority === 1 ? "" : "s"} open — assign a technician to clear ${highPriority > 0 ? "405/509" : "the queue"} before arrivals peak.`,
      },
      {
        id: "op-rec-2",
        level: "info" as const,
        message: `${signOffRequired} refund${signOffRequired === 1 ? "" : "s"} require${signOffRequired === 1 ? "s" : ""} your sign-off.`,
      },
      {
        id: "op-rec-3",
        level: "info" as const,
        message: `Occupancy running at ${occupancy}% with ${arrivalsToday} arrivals today — flag housekeeping to turn rooms by checkout.`,
      },
      {
        id: "op-rec-4",
        level: "success" as const,
        message: `${walkIn} of ${bookings.length} bookings are walk-in — reception is capturing walk-ins well this shift.`,
      },
    ];

    const snapshot: OperationalSnapshot = {
      generatedAt: new Date().toISOString(),
      kpis: {
        occupancy,
        arrivalsToday,
        departuresToday,
        openTasks,
        pendingEscalations,
        signOffRequired,
        highPriorityMaintenance: highPriority,
        housekeepingInProgress,
        openWorkOrders,
        guestApprovalsPending,
        blockedRooms,
      },
      occupancyTrend,
      workOrders: WORK_ORDER_FIXTURES.map((w) => ({ ...w })),
      teamSnapshot: TEAM_SNAPSHOT_FIXTURES.map((t) => ({ ...t })),
      attention: ATTENTION_FIXTURES.map((a) => ({ ...a })),
      pipeline: {
        status: [
          { label: "Pending", field: "pending", color: "#d97706", count: countBy("pending") },
          { label: "Confirmed", field: "confirmed", color: "#876a20", count: countBy("confirmed") },
          { label: "In-house", field: "inHouse", color: "#15803d", count: countBy("checked_in") },
          { label: "Completed", field: "completed", color: "#64748b", count: countBy("checked_out") },
          { label: "Cancelled", field: "cancelled", color: "#dc2626", count: countBy("cancelled") },
        ],
        account,
        walkIn,
      },
      recommendations,
    };

    return envelope(snapshot);
  }

  if (path === "/v1/it/overview" && method === "GET") {
    const actor = staffWithPermission(bearer, "sessions.read");
    if (!actor) {
      return problem(401, "Unauthorized", "IT session read access required.");
    }

    const activeSessions = Math.max(itSessions.filter((s) => s.geofence === "verified").length, 1);
    const revoked = itKiosks.filter((k) => k.token === "expired").length;
    const deviceMix = [
      { label: "Kiosk (lobby)", value: 1, color: "#15803d" },
      { label: "Tablet / POS", value: 1, color: "#223047" },
      { label: "Smartphone", value: 1, color: "#876a20" },
      { label: "Laptop / Desktop", value: 2, color: "#64748b" },
    ];
    const tokenHealth = [
      { label: "Valid tokens", value: 3, color: "#15803d" },
      { label: "Expired / revoked", value: 2, color: "#dc2626" },
      { label: "Denied (off-property)", value: 1, color: "#d97706" },
    ];

    const snapshot: ItPlatformSnapshot = {
      generatedAt: new Date().toISOString(),
      kpis: {
        staffAccounts: STAFF_USERS.length,
        touchpointsProvisioned: itSessions.length,
        activeSessions: activeRefreshTokens.size + activeSessions,
        tokenRefreshes24h: refreshCounter,
        tokenRefreshFailures: 1,
        revokedTokens7d: revoked,
      },
      deviceMix,
      tokenHealth,
      sessions: itSessions.map((s) => ({ ...s })),
      kiosks: itKiosks.map((k) => ({ ...k })),
      systouch: { ...IT_SYSTEM_HEALTH_FIXTURES, errorFeed: [...IT_SYSTEM_HEALTH_FIXTURES.errorFeed] },
      geofence: { ...IT_GEOFENCE_FIXTURES, enforcedRoles: [...IT_GEOFENCE_FIXTURES.enforcedRoles] },
    };

    return envelope(snapshot);
  }

  if (path === "/v1/it/devices" && method === "POST") {
    const actor = staffWithPermission(bearer, "sessions.manage");
    if (!actor) {
      return problem(401, "Unauthorized", "IT session management access required.");
    }
    const id = String(body.id ?? "");
    const target = String(body.target ?? "") as "session" | "kiosk";
    const action = String(body.action ?? "") as DeviceAction;
    if (!["session", "kiosk"].includes(target)) {
      return problem(422, "Invalid target", "Target must be session or kiosk.");
    }
    if (!["revoke", "terminate"].includes(action)) {
      return problem(422, "Invalid action", "Action must be revoke or terminate.");
    }

    if (target === "kiosk") {
      const k = itKiosks.find((x) => x.id === id);
      if (!k) return problem(404, "Not found", `No kiosk touchpoint with id ${id}.`);
      k.token = "expired";
      k.online = false;
      recordStandard(actor, "Device revoked", `${k.device} · ${k.role}`);
      return envelope({ ...k });
    }

    const s = itSessions.find((x) => x.id === id);
    if (!s) return problem(404, "Not found", `No session with id ${id}.`);
    if (s.geofence === "denied") {
      return problem(409, "Already terminated", `Session ${s.id} is already terminated.`);
    }
    s.geofence = "denied";
    activeRefreshTokens.delete(id);
    recordStandard(actor, "Session terminated", `${s.device} · ${s.user} (${s.role})`);
    return envelope({ ...s });
  }

  return problem(404, "Not found", `No mock handler for ${method} ${path}`);
}
