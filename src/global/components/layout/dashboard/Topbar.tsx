"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StaffRoleMeta } from "@/data/staff-nav";
import { PAGE_ROUTES } from "@/domains/auth/constants";
import { Icon, type IconName } from "@/global/components/ui/Icon";
import { cn } from "@/lib/cn";

function initialsOf(name: string | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface Notification {
  id: number;
  text: string;
  time: string;
  dot: "brand-gold" | "amber" | "red";
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, text: "New check-in request for Room 412", time: "2 min ago", dot: "brand-gold" },
  { id: 2, text: "Payment PYM-8839 awaiting your approval", time: "20 min ago", dot: "amber" },
  { id: 3, text: "Room 405 reported an AC fault", time: "1 h ago", dot: "red" },
];

const DOT_CLASS: Record<Notification["dot"], string> = {
  "brand-gold": "bg-brand-gold",
  amber: "bg-amber-500",
  red: "bg-red-500",
};

interface UserMenuEntry {
  label: string;
  icon: IconName;
}

const USER_MENU: UserMenuEntry[] = [
  { label: "My Profile", icon: "user" },
  { label: "Settings", icon: "settings" },
  { label: "Inbox", icon: "inbox" },
];

function ConsoleSwitcher({
  isPortal,
  meta,
  onNavigate,
}: {
  isPortal: boolean;
  meta: StaffRoleMeta | null;
  onNavigate: () => void;
}) {
  const opsHref = isPortal
    ? (meta?.backTo?.href ?? PAGE_ROUTES.guestLanding)
    : PAGE_ROUTES.guestLanding;
  return (
    <nav
      aria-label="Console"
      className="hidden items-center gap-0.5 self-center rounded-full border border-gray-200 bg-surface-muted p-0.5 md:flex"
    >
      <Link
        href={opsHref}
        onClick={onNavigate}
        aria-current={isPortal ? undefined : "page"}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-semibold no-underline transition-colors",
          isPortal
            ? "text-gray-500 hover:text-brand-navy"
            : "bg-brand-navy text-white"
        )}
      >
        Operations
      </Link>
      <Link
        href={PAGE_ROUTES.staffPortal}
        onClick={onNavigate}
        aria-current={isPortal ? "page" : undefined}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-semibold no-underline transition-colors",
          isPortal
            ? "bg-brand-navy text-white"
            : "text-gray-500 hover:text-brand-navy"
        )}
      >
        Staff Portal
      </Link>
    </nav>
  );
}

interface TopbarProps {
  meta: StaffRoleMeta | null;
  userName?: string;
  signingOut: boolean;
  onSignOut: () => void;
  onLock: () => void;
  onOpenMenu: () => void;
  showPortal: boolean;
  isPortal: boolean;
}

export function Topbar({
  meta,
  userName,
  signingOut,
  onSignOut,
  onLock,
  onOpenMenu,
  showPortal,
  isPortal,
}: TopbarProps) {
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [read, setRead] = useState<Set<number>>(new Set());

  const unreadCount = INITIAL_NOTIFICATIONS.filter((n) => !read.has(n.id)).length;
  const anyOpen = bellOpen || userOpen;

  useEffect(() => {
    if (!anyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBellOpen(false);
        setUserOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anyOpen]);

  function closeAll() {
    setBellOpen(false);
    setUserOpen(false);
  }

  function markRead(id: number) {
    setRead((prev) => new Set(prev).add(id));
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-surface-muted hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40 lg:hidden"
        >
          <Icon name="menu" className="h-5 w-5" />
        </button>
        <span className="min-w-0 truncate text-sm font-semibold text-brand-navy">
          Hotelia{" "}
          <span className="text-gray-300">/</span>{" "}
          <span className="font-normal text-gray-500">{meta?.label ?? "Staff"}</span>
        </span>
        {showPortal && (
          <ConsoleSwitcher isPortal={isPortal} meta={meta} onNavigate={closeAll} />
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onLock}
          aria-label="Lock session"
          title="Lock session"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-surface-muted hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
        >
          <Icon name="lock" className="h-5 w-5" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setBellOpen((v) => !v);
              setUserOpen(false);
            }}
            aria-label="Notifications"
            aria-expanded={bellOpen}
            aria-haspopup="true"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-surface-muted hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
          >
            <Icon name="bell" className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-brand-navy">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setRead(new Set(INITIAL_NOTIFICATIONS.map((n) => n.id)))}
                    className="text-xs font-semibold text-brand-gold hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <ul className="max-h-72 overflow-y-auto py-1">
                {INITIAL_NOTIFICATIONS.map((n) => {
                  const isRead = read.has(n.id);
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted",
                          !isRead && "bg-surface-muted/60"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                            isRead ? "bg-gray-300" : DOT_CLASS[n.dot]
                          )}
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "block text-sm",
                              isRead ? "text-gray-500" : "font-medium text-brand-navy"
                            )}
                          >
                            {n.text}
                          </span>
                          <span className="mt-0.5 block text-xs text-gray-400">{n.time}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {unreadCount === 0 && (
                <p className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
                  You&apos;re all caught up.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserOpen((v) => !v);
              setBellOpen(false);
            }}
            aria-label="Account menu"
            aria-expanded={userOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-lg border border-gray-200 p-1.5 pl-1.5 pr-2 transition-colors hover:border-brand-gold/50 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-white">
              {initialsOf(userName)}
            </span>
            <span className="hidden max-w-28 truncate text-sm font-semibold text-brand-navy xl:block">
              {userName}
            </span>
            <Icon
              name="chevron-down"
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                userOpen && "rotate-180"
              )}
            />
          </button>

          {userOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white text-left text-sm shadow-xl"
            >
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-white">
                  {initialsOf(userName)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-brand-navy">{userName ?? "Staff"}</p>
                  <p className="truncate text-xs text-gray-500">{meta?.label ?? "Signed in"}</p>
                </div>
              </div>

              {showPortal && (
                <div className="border-b border-gray-100 py-1">
                  <Link
                    href={isPortal && meta?.backTo ? meta.backTo.href : PAGE_ROUTES.staffPortal}
                    onClick={closeAll}
                    className="flex items-center gap-3 px-4 py-2 font-medium text-brand-navy no-underline transition-colors hover:bg-surface-muted"
                  >
                    <Icon
                      name={isPortal && meta?.backTo ? "arrow-left" : "user"}
                      className="h-4 w-4 shrink-0"
                    />
                    <span>
                      {isPortal && meta?.backTo
                        ? meta.backTo.label
                        : "My Staff Portal"}
                    </span>
                  </Link>
                </div>
              )}

              <ul className="py-1">
                {USER_MENU.map((entry) => (
                  <li key={entry.label} role="menuitem">
                    <button
                      type="button"
                      className="flex w-full cursor-not-allowed items-center gap-3 px-4 py-2 text-gray-400"
                      aria-disabled
                    >
                      <Icon name={entry.icon} className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{entry.label}</span>
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-gray-400">
                        Soon
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 py-1">
                <Link
                  href={PAGE_ROUTES.guestLanding}
                  onClick={closeAll}
                  className="flex items-center gap-3 px-4 py-2 text-brand-navy no-underline transition-colors hover:bg-surface-muted"
                >
                  <Icon name="external-link" className="h-4 w-4 shrink-0" />
                  <span>View Website</span>
                </Link>
              </div>

              <div className="border-t border-gray-100 py-1">
                <button
                  type="button"
                  onClick={onSignOut}
                  disabled={signingOut}
                  className="flex w-full items-center gap-3 px-4 py-2 font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                >
                  <Icon name="logout" className="h-4 w-4 shrink-0" />
                  <span>{signingOut ? "Signing out\u2026" : "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {anyOpen && <div className="fixed inset-0 z-40" onClick={closeAll} aria-hidden />}
    </header>
  );
}