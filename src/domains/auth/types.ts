export type UserType = "guest" | "staff";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface GuestRegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface StaffLoginRequest {
  email: string;
  password: string;
  pin: string;
}

export interface GuestLoginRequest {
  identifier: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface SessionClaims {
  sub: string;
  name: string;
  email: string;
  userType: UserType;
  role: string | null;
  permissions: string[];
  geofenceVerified: boolean;
}

export interface LoginResponse {
  tokens: TokenPair;
  user: SessionClaims;
}

export interface RegisterResponse {
  user: SessionClaims;
}
