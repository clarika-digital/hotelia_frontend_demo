export const AUTH_ROUTES = {
  login: "/v1/auth/login",
  staffLogin: "/v1/auth/staff/login",
  guestLogin: "/v1/auth/guest/login",
  register: "/v1/auth/guest/register",
  refresh: "/v1/auth/refresh",
  logout: "/v1/auth/logout",
  me: "/v1/auth/session/me",
  sessionLock: "/v1/auth/session/lock",
  sessionUnlock: "/v1/auth/session/unlock",
} as const;

export const PAGE_ROUTES = {
  login: "/login/",
  staffLogin: "/login/",
  guestLogin: "/login/",
  register: "/register/",
  guestLanding: "/",
  staffPortal: "/staff-portal/",
} as const;

export const ROLE_LANDING: Record<string, string> = {
  front_desk: "/front-desk/",
  accountant: "/accountant/",
  housekeeping: "/housekeeping/",
  maintenance: "/maintenance/",
  manager: "/manager/",
  it_manager: "/it/",
  executive: "/executive/",
  super_admin: "/super_admin/",
};