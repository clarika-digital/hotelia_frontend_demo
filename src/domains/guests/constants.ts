export const GUEST_API_ROUTES = {
  bookings: "/v1/guest/bookings",
  reservations: "/v1/guest/reservations",
  bookingLookup: "/v1/guest/bookings/lookup",
  profile: "/v1/guest/profile",
  export: "/v1/guest/export",
} as const;

export const GUEST_PAGE_ROUTES = {
  account: "/account/",
  bookings: "/account/bookings/",
  profile: "/account/profile/",
  export: "/account/export/",
} as const;