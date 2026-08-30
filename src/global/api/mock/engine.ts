import { digitsOnly, isValidE164 } from "@/data/phones";
import { getRoomBySlug } from "@/data/rooms";
import { rateForRoom, withTax } from "@/domains/booking/rates";
import { CANCELABLE_STATUSES } from "@/domains/guests/types";
import type { GuestBooking } from "@/domains/guests/types";
import type { GuestProfile } from "@/domains/guests/types";
import { GUEST_BOOKINGS, GUEST_USERS, STAFF_USERS, type MockUser } from "./fixtures";

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

  return problem(404, "Not found", `No mock handler for ${method} ${path}`);
}
