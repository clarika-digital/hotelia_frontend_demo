"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSessionStore } from "@/stores/session-store";
import { fetchSession } from "@/domains/auth/api";

/**
 * Rehydrates the session from the session cookie on first mount, mirroring
 * how the real backend would restore a session from an HttpOnly cookie via
 * the /auth/session/me endpoint. No tokens are ever held in localStorage.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const store = useSessionStore.getState();
      const token = store.restoreFromCookie();
      if (!token) {
        if (!cancelled) setHydrated(true);
        return;
      }
      try {
        const claims = await fetchSession();
        if (!cancelled) {
          useSessionStore.getState().restoreClaims(claims, token);
        }
      } catch {
        if (!cancelled) {
          useSessionStore.getState().clear();
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface-muted">
        <div className="flex items-center gap-3 text-brand-navy">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-gold border-t-transparent" />
          <span className="text-sm font-medium">Restoring session…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
