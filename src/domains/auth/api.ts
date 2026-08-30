import { client } from "@/global/api/client";
import { useSessionStore } from "@/stores/session-store";
import type {
  GuestLoginRequest,
  LoginResponse,
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

export function staffLogin(req: StaffLoginRequest): Promise<SessionClaims> {
  return startSession(AUTH_ROUTES.staffLogin, req);
}

export function guestLogin(req: GuestLoginRequest): Promise<SessionClaims> {
  return startSession(AUTH_ROUTES.guestLogin, req);
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
