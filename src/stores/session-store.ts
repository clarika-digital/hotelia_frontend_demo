import { create } from "zustand";
import type { SessionClaims, TokenPair } from "@/domains/auth/types";
import { readSessionCookie, writeSessionCookie } from "@/domains/auth/session-cookie";

export type SessionStatus = "guest" | "authenticated" | "locked";

interface SessionState {
  status: SessionStatus;
  accessToken: string | null;
  refreshToken: string | null;
  claims: SessionClaims | null;
  setSession: (tokens: TokenPair, claims: SessionClaims) => void;
  setTokens: (tokens: TokenPair) => void;
  setClaims: (claims: SessionClaims | null) => void;
  restoreClaims: (claims: SessionClaims, token: string) => void;
  lock: () => void;
  unlock: () => void;
  clear: () => void;
  /** Pull the remembered token from the session cookie (access only). */
  restoreFromCookie: () => string | null;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  status: "guest",
  accessToken: null,
  refreshToken: null,
  claims: null,
  setSession: (tokens, claims) => {
    writeSessionCookie(tokens.accessToken);
    set({ status: "authenticated", ...tokens, claims });
  },
  setTokens: (tokens) => {
    if (tokens.accessToken) writeSessionCookie(tokens.accessToken);
    set(tokens);
  },
  setClaims: (claims) => set({ claims }),
  restoreClaims: (claims, token) =>
    set({ status: "authenticated", claims, accessToken: token }),
  lock: () => set({ status: "locked" }),
  unlock: () => set({ status: "authenticated" }),
  clear: () => {
    writeSessionCookie(null);
    set({
      status: "guest",
      accessToken: null,
      refreshToken: null,
      claims: null,
    });
  },
  restoreFromCookie: () => {
    const token = readSessionCookie();
    if (token) {
      set({ accessToken: token });
      return token;
    }
    return null;
  },
}));
