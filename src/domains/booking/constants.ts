import type { Room } from "@/data";

export const BOOKING_PAGE_ROUTES = {
  select: "/book/",
  review: "/book/review/",
  confirmation: "/book/confirmation/",
  find: "/book/find/",
} as const;

export const BOOKING_CONTEXT_KEY = "hotelia:booking-ctx";

export const TAX_RATE_PCT = 15;

export type BookingTab = "standard" | "packages";

export const BOOKING_TAB_LABELS: Record<BookingTab, string> = {
  standard: "Standard Offers",
  packages: "Packages",
};

export type BookingPolicy = "pay-property" | "pay-online";

export const BOOKING_POLICY_LABELS: Record<BookingPolicy, string> = {
  "pay-property": "Pay at property",
  "pay-online": "Pay online",
};

export type BedChoice = "king" | "twin";

export const ROOM_TYPE_FILTERS: { key: Room["category"]; label: string }[] = [
  { key: "rooms", label: "Room" },
  { key: "horizon-club", label: "Club Room" },
  { key: "suites", label: "Suite" },
  { key: "connecting", label: "Connecting Room" },
];

export const ROOM_CATEGORY_ORDER = [
  "rooms",
  "horizon-club",
  "suites",
  "connecting",
] as const;

export const BOOKING_STEPS = [
  { step: 1, label: "Select Dates & Hotel" },
  { step: 2, label: "Select Room & Rate" },
  { step: 3, label: "Review Reservation" },
  { step: 4, label: "Guarantee or Pay" },
] as const;

export const CHECK_IN_HOUR = 15;
export const CHECK_OUT_HOUR = 12;

export const DIRECT_BOOK_PERKS = [
  "Best direct rate — always lowest online",
  "Free cancellation on most rates",
  "No booking fees",
  "Free Wi-Fi throughout your stay",
] as const;