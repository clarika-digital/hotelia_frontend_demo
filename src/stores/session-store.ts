import { create } from "zustand";
import type { SessionClaims, TokenPair } from "@/domains/auth/types";

export type SessionStatus = "guest" | "authenticated" | "locked";

interface SessionState {
  status: SessionStatus;
  accessToken: string | null;
  refreshToken: string | null;
  claims: SessionClaims | null;
  setSession: (tokens: TokenPair, claims: SessionClaims) => void;
  setTokens: (tokens: TokenPair) => void;
  lock: () => void;
  unlock: () => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  status: "guest",
  accessToken: null,
  refreshToken: null,
  claims: null,
  setSession: (tokens, claims) =>
    set({ status: "authenticated", ...tokens, claims }),
  setTokens: (tokens) => set(tokens),
  lock: () => set({ status: "locked" }),
  unlock: () => set({ status: "authenticated" }),
  clear: () =>
    set({
      status: "guest",
      accessToken: null,
      refreshToken: null,
      claims: null,
    }),
}));
