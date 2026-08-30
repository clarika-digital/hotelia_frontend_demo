"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { staffPortalMeta, staffRoleMeta } from "@/data/staff-nav";
import { lockSession, logout } from "@/domains/auth/api";
import { PAGE_ROUTES } from "@/domains/auth/constants";
import { useIdleLock } from "@/global/hooks/useIdleLock";
import { cn } from "@/lib/cn";
import { useSessionStore } from "@/stores/session-store";
import { IdleLockOverlay } from "./IdleLockOverlay";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const COLLAPSE_KEY = "hotelia.staff.sidebar.collapsed";

const IDLE_LOCK_MS: Record<string, number> = {
  front_desk: 60_000,
  housekeeping: 120_000,
  accountant: 300_000,
  maintenance: 300_000,
  manager: 300_000,
  it_manager: 300_000,
  executive: 600_000,
  super_admin: 600_000,
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const claims = useSessionStore((s) => s.claims);
  const status = useSessionStore((s) => s.status);
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const locked = status === "locked";

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // ignore storage access errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore storage access errors
    }
  }, [collapsed]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useIdleLock(
    IDLE_LOCK_MS[claims?.role ?? ""] ?? IDLE_LOCK_MS.front_desk,
    handleLock,
    !locked
  );

  const PORTAL_BASE = PAGE_ROUTES.staffPortal.replace(/\/+$/, "");
  const path = pathname.replace(/\/+$/, "");
  const isPortal = path === PORTAL_BASE || path.startsWith(`${PORTAL_BASE}/`);
  const meta = isPortal
    ? staffPortalMeta(claims?.role)
    : staffRoleMeta(claims?.role);
  const showPortal = claims?.role !== "super_admin";
  const sidebarKey = isPortal ? "staff-portal" : `ops-${claims?.role ?? "unknown"}`;

  function handleLock() {
    void lockSession().catch(() => {});
    useSessionStore.getState().lock();
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
      router.replace(PAGE_ROUTES.guestLanding);
    }
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      {meta && (
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 transition-[width] duration-200 lg:block",
            collapsed ? "w-[76px]" : "w-64"
          )}
        >
          <Sidebar
            key={sidebarKey}
            meta={meta}
            collapsed={collapsed}
            onSetCollapsed={setCollapsed}
          />
        </aside>
      )}

      {mobileOpen && meta && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-2xl">
            <Sidebar
              key={sidebarKey}
              meta={meta}
              collapsed={false}
              onSetCollapsed={setCollapsed}
              mobile
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          meta={meta}
          userName={claims?.name}
          signingOut={signingOut}
          onSignOut={handleSignOut}
          onLock={handleLock}
          onOpenMenu={() => setMobileOpen(true)}
          showPortal={showPortal}
          isPortal={isPortal}
        />

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <IdleLockOverlay open={locked} />
    </div>
  );
}