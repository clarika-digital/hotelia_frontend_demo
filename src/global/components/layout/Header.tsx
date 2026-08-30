"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { megaNav, siteConfig } from "@/data/site";
import { getRoomHref } from "@/data/rooms";
import { formatMoney } from "@/lib/formatters";
import { cn } from "@/lib/cn";
import { logout } from "@/domains/auth/api";
import { PAGE_ROUTES } from "@/domains/auth/constants";
import { BOOKING_PAGE_ROUTES } from "@/domains/booking/constants";
import { useSessionStore } from "@/stores/session-store";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const claims = useSessionStore((s) => s.claims);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement | null>());

  const closeAndFocus = (label: string) => {
    setOpen(null);
    triggerRefs.current.get(label)?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        triggerRefs.current.get(open)?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
      router.push(PAGE_ROUTES.guestLanding);
    }
  }

  const firstName = claims?.name.split(" ")[0];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ---- Top utility bar ---- */}
      <div className="bg-[#f4f5f6] text-[13px] text-brand-navy">
        <div className="mx-auto flex h-[60px] max-w-[1180px] items-center justify-between px-5">
          <Link href="/" className="flex items-center no-underline">
            <img
              src="/images/logo-hotelia.svg"
              alt="Hotelia"
              className="h-[44px] w-auto"
            />
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href="tel:+233240258378"
              className="flex items-center gap-1.5 text-brand-navy no-underline"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#876a20"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {siteConfig.phone}
            </a>
            <span className="text-[#ccc]">|</span>
            {claims ? (
              <>
                <span className="text-brand-navy">Hi, {firstName}</span>
                <span className="text-[#ccc]">|</span>
                {claims.userType === "guest" ? (
                  <Link
                    href={PAGE_ROUTES.guestAccount}
                    className="no-underline text-brand-navy"
                  >
                    My Account
                  </Link>
                ) : (
                  <span className="text-brand-navy">Staff</span>
                )}
                <span className="text-[#ccc]">|</span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="text-brand-navy disabled:opacity-60"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href={PAGE_ROUTES.guestLogin}
                className="no-underline text-brand-navy"
              >
                Sign In
              </Link>
            )}
            <Link
              href={BOOKING_PAGE_ROUTES.select}
              className="no-underline text-white font-semibold tracking-[.5px]"
              style={{ background: "#876a20", padding: "10px 22px", borderRadius: 2 }}
            >
              BOOK NOW
            </Link>
            <span className="text-[#ccc]">|</span>
            <div className="flex cursor-pointer items-center gap-1 text-brand-navy">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#876a20"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              English
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#876a20"
                strokeWidth="2.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          <button
            className="text-2xl text-brand-navy lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "\u2715" : "\u2630"}
          </button>
        </div>
      </div>

      {/* ---- Main nav bar ---- */}
      <nav
        className="relative z-40 hidden bg-brand-navy lg:block"
        aria-label="Main navigation"
        onMouseLeave={() => setOpen(null)}
      >
        <div className="mx-auto flex max-w-[1180px] items-stretch justify-between px-5">
          {megaNav.map((item) => {
            const isDropdown = !!item.columns || !!item.roomMenu;
            if (!isDropdown) {
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={cn(
                    "flex items-center px-5 text-sm text-white capitalize no-underline hover:opacity-90",
                    pathname === item.href &&
                      "underline underline-offset-4 decoration-2"
                  )}
                  style={{ minHeight: 40 }}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpen(item.label)}
              >
                <button
                  ref={(el) => {
                    if (el) triggerRefs.current.set(item.label, el);
                    else triggerRefs.current.delete(item.label);
                  }}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={open === item.label}
                  onClick={() =>
                    open === item.label
                      ? closeAndFocus(item.label)
                      : setOpen(item.label)
                  }
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 px-5 text-sm text-white capitalize hover:opacity-90",
                    open === item.label && "bg-white/10"
                  )}
                  style={{ minHeight: 40 }}
                >
                  {item.label}
                  <span className="inline-block rotate-180 text-[10px]" aria-hidden>
                    {"\u25BE"}
                  </span>
                </button>

                {open === item.label && (
                  <div
                    className="animate-nav-panel fixed left-0 right-0 top-[100px] z-50 bg-white shadow-lg"
                    style={{ boxShadow: "0 18px 40px rgba(15,23,38,.14)" }}
                    onMouseLeave={() => setOpen(null)}
                  >
                    <div className="mx-auto max-w-[1180px] px-5 py-8">
                      {item.roomMenu ? (
                        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
                          {item.roomMenu.map((cat) => (
                            <div key={cat.title}>
                              <h3 className="font-display text-base font-bold text-brand-navy">
                                {cat.title}
                              </h3>
                              <div className="mt-4 space-y-3">
                                {cat.rooms.map((room) => (
                                  <Link
                                    key={room.slug}
                                    href={getRoomHref(room)}
                                    onClick={() => setOpen(null)}
                                    className="group flex items-center gap-3 rounded-md p-2 no-underline transition-colors hover:bg-surface-muted"
                                  >
                                    <img
                                      src={room.image}
                                      alt={room.title}
                                      className="h-14 w-20 flex-none rounded object-cover"
                                      loading="lazy"
                                    />
                                    <span className="min-w-0">
                                      <span className="block text-sm font-semibold leading-snug text-brand-navy group-hover:text-brand-gold">
                                        {room.title}
                                      </span>
                                      {room.rate && (
                                        <span className="mt-0.5 block text-xs text-gray-500">
                                          From {formatMoney(room.rate, "GHS")}/night
                                        </span>
                                      )}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-x-12 gap-y-6">
                          {item.columns!.map((col) => (
                            <div key={col.title} style={{ width: 240 }}>
                              <h3 className="font-display text-base font-bold text-brand-navy">
                                {col.title}
                              </h3>
                              <ul className="mt-4 space-y-2.5">
                                {col.links.map((link) => (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      onClick={() => setOpen(null)}
                                      className={cn(
                                        "text-sm text-gray-700 no-underline hover:text-brand-gold",
                                        pathname === link.href &&
                                          "font-semibold text-brand-gold"
                                      )}
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {item.overview && (
                      <div className="border-t border-surface-muted bg-surface-muted/40">
                        <div className="mx-auto flex max-w-[1180px] items-center px-5 py-4">
                          <Link
                            href={item.overview.href}
                            onClick={() => setOpen(null)}
                            className="text-sm font-semibold uppercase tracking-wide text-brand-gold no-underline hover:underline"
                          >
                            {item.overview.label}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div className="flex-1" />
        </div>
      </nav>

      {/* ---- Mobile menu ---- */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-60px)] overflow-y-auto border-t border-surface-muted bg-white px-5 py-4 lg:hidden">
          <div className="mb-3 flex items-center justify-between border-b border-surface-muted pb-3">
            {claims ? (
              <>
                <span className="text-sm font-semibold text-brand-navy">
                  Hi, {firstName}
                </span>
                {claims.userType === "guest" && (
                  <Link
                    href={PAGE_ROUTES.guestAccount}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold text-brand-gold no-underline"
                  >
                    My Account
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="text-sm text-brand-navy disabled:opacity-60"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href={PAGE_ROUTES.guestLogin}
                className="text-sm font-semibold text-brand-gold no-underline"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>

          {megaNav.map((item) => (
            <div key={item.label} className="mb-4">
              <div className="mb-1 font-display text-sm font-bold text-brand-navy">
                {item.label}
              </div>
              {item.roomMenu ? (
                item.roomMenu.map((cat) => (
                  <div key={cat.title} className="mb-2">
                    <div className="text-xs uppercase text-brand-gold">
                      {cat.title}
                    </div>
                    {cat.rooms.map((room) => (
                      <Link
                        key={room.slug}
                        href={getRoomHref(room)}
                        className="block py-1 pl-3 text-sm text-brand-navy no-underline"
                        onClick={() => setMobileOpen(false)}
                      >
                        {room.title}
                      </Link>
                    ))}
                  </div>
                ))
              ) : item.columns ? (
                item.columns.map((col) => (
                  <div key={col.title} className="mb-2">
                    <div className="text-xs uppercase text-brand-gold">
                      {col.title}
                    </div>
                    {col.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-1 pl-3 text-sm text-brand-navy no-underline"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))
              ) : (
                <Link
                  href={item.href!}
                  className="block py-1 text-sm text-brand-navy no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
              {item.overview && (
                <Link
                  href={item.overview.href}
                  className="block py-1 pl-3 text-sm font-semibold text-brand-gold no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.overview.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}