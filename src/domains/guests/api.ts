import { client } from "@/global/api/client";
import { GUEST_API_ROUTES } from "./constants";
import type { CreateReservationRequest } from "@/domains/booking/types";
import type {
  GuestBooking,
  GuestExportPayload,
  GuestProfile,
  ProfileUpdateRequest,
} from "./types";

export function fetchGuestBookings(): Promise<GuestBooking[]> {
  return client.get<GuestBooking[]>(GUEST_API_ROUTES.bookings);
}

export function createGuestReservation(
  req: CreateReservationRequest
): Promise<GuestBooking> {
  return client.post<GuestBooking, CreateReservationRequest>(
    GUEST_API_ROUTES.reservations,
    req
  );
}

export function lookupGuestBooking(
  ref: string,
  pin: string
): Promise<GuestBooking> {
  return client.post<GuestBooking, { ref: string; pin: string }>(
    GUEST_API_ROUTES.bookingLookup,
    { ref, pin }
  );
}

export function fetchGuestBooking(ref: string): Promise<GuestBooking> {
  return client.get<GuestBooking>(
    `${GUEST_API_ROUTES.bookings}/${encodeURIComponent(ref)}`
  );
}

export function cancelGuestBooking(
  ref: string,
  pin: string
): Promise<GuestBooking> {
  return client.post<GuestBooking, { pin: string }>(
    `${GUEST_API_ROUTES.bookings}/${encodeURIComponent(ref)}/cancel`,
    { pin }
  );
}

export function fetchGuestProfile(): Promise<GuestProfile> {
  return client.get<GuestProfile>(GUEST_API_ROUTES.profile);
}

export function updateGuestProfile(
  req: ProfileUpdateRequest
): Promise<GuestProfile> {
  return client.put<GuestProfile, ProfileUpdateRequest>(
    GUEST_API_ROUTES.profile,
    req
  );
}

export function requestGuestExport(): Promise<GuestExportPayload> {
  return client.post<GuestExportPayload, Record<string, never>>(
    GUEST_API_ROUTES.export,
    {}
  );
}