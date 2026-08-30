import { client } from "@/global/api/client";
import { useSessionStore } from "@/stores/session-store";
import type {
  GuestLoginRequest,
  GuestRegisterRequest,
  LoginRequest,
  LoginResponse,
  RegisterResponse,
  SessionClaims,
  StaffLoginRequest,
} from "./types";
import { AUTH_ROUTES } from "./constants";

async function startSession<B>(
  path: string,
  body: B
): Promise<SessionClaims> {
  const res = await client.post<LoginResponse, B>(path, body);
  useSessionStore.getState().setSession(res.tokens, res.user);
  return res.user;
}

export function login(req: LoginRequest): Promise<SessionClaims> {
  return startSession(AUTH_ROUTES.login, req);
}

export function staffLogin(req: StaffLoginRequest): Promise<SessionClaims> {
  return startSession(AUTH_ROUTES.staffLogin, req);
}

export function guestLogin(req: GuestLoginRequest): Promise<SessionClaims> {
  return startSession(AUTH_ROUTES.guestLogin, req);
}

export async function registerGuest(
  req: GuestRegisterRequest
): Promise<SessionClaims> {
  const res = await client.post<RegisterResponse, GuestRegisterRequest>(
    AUTH_ROUTES.register,
    req
  );
  return res.user;
}

export async function logout(): Promise<void> {
  try {
    await client.post(AUTH_ROUTES.logout, {});
  } finally {
    useSessionStore.getState().clear();
  }
}

export function fetchSession(): Promise<SessionClaims> {
  return client.get<SessionClaims>(AUTH_ROUTES.me);
}

export interface SessionLockState {
  locked: boolean;
  lockedAt?: string;
  unlockedAt?: string;
}

export async function lockSession(): Promise<SessionLockState> {
  return client.post<SessionLockState, Record<string, never>>(
    AUTH_ROUTES.sessionLock,
    {}
  );
}

export async function unlockSession(pin: string): Promise<SessionLockState> {
  return client.post<SessionLockState, { pin: string }>(
    AUTH_ROUTES.sessionUnlock,
    { pin }
  );
}
