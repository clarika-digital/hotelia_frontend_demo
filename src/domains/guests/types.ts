export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";

export interface BookingEvent {
  at: string;
  label: string;
  note?: string;
}

export interface BookingCancellation {
  requestedAt: string;
  refundPercent: number;
  refundAmount: number;
}

export interface GuestBooking {
  id: string;
  ref: string;
  guestId: string;
  roomCategory: string;
  planTitle?: string;
  perNight?: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  currency: "GHS";
  status: BookingStatus;
  pin: string;
  createdAt: string;
  events: BookingEvent[];
  cancellation?: BookingCancellation;
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked in",
  checked_out: "Checked out",
  cancelled: "Cancelled",
  no_show: "No show",
};

export type BookingStatusTone = "neutral" | "gold" | "green" | "red" | "amber";

export const BOOKING_STATUS_TONE: Record<BookingStatus, BookingStatusTone> = {
  pending: "amber",
  confirmed: "gold",
  checked_in: "green",
  checked_out: "neutral",
  cancelled: "red",
  no_show: "neutral",
};

export const CANCELABLE_STATUSES: readonly BookingStatus[] = [
  "pending",
  "confirmed",
];

export interface GuestProfile {
  name: string;
  email: string;
  phone: string;
  locale: string;
  currency: string;
  preferredCountry?: string;
  profileComplete: boolean;
  missingFields: string[];
}

export interface ProfileUpdateRequest {
  name?: string;
  phone?: string;
  locale?: string;
  currency?: string;
  preferredCountry?: string;
}

export interface GuestExportTotals {
  count: number;
  nights: number;
  totalSpent: number;
}

export interface GuestExportPayload {
  generatedAt: string;
  profile: GuestProfile;
  bookings: GuestBooking[];
  totals: GuestExportTotals;
}