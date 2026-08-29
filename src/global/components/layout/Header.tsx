"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { megaNav, siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";

const TOP_NAV_LINKS = megaNav.filter((item) => item.href);
const DROPDOWN_ITEMS = megaNav.filter((item) => item.columns);

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ---- Top utility bar ---- */}
      <div className="bg-[#f4f5f6] text-[13px] text-brand-navy" style={{ fontFamily: "Montserrat, sans-serif" }}>
        <div className="mx-auto flex h-[60px] max-w-[1180px] items-center justify-between px-5">
          <Link href="/" className="flex items-center">
            <img src="/images/logo-hotelia.svg" alt="Hotelia" className="h-[44px] w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            <a href="tel:+233240258378" className="flex items-center gap-1.5 no-underline text-brand-navy">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#876a20" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {siteConfig.phone}
            </a>
            <span className="text-[#ccc]">|</span>
            <a href="#" className="no-underline text-brand-navy">Sign In</a>
            <a
              href="/offers/"
              className="no-underline text-white font-semibold tracking-[.5px]"
              style={{ background: "#876a20", padding: "10px 22px", borderRadius: 2 }}
            >
              BOOK NOW
            </a>
            <span className="text-[#ccc]">|</span>
            <div className="flex cursor-pointer items-center gap-1 text-brand-navy">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#876a20" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              English
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#876a20" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          <button
            className="lg:hidden text-brand-navy text-2xl"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? "\u2715" : "\u2630"}
          </button>
        </div>
      </div>

      {/* ---- Main nav bar ---- */}
      <nav
        id="js-nav-con"
        className="hidden lg:block relative z-40"
        style={{ backgroundColor: "#223047" }}
        onMouseLeave={() => setOpen(null)}
      >
        <div className="mx-auto flex max-w-[1180px] items-stretch justify-between px-5">
          {megaNav.map((item) => {
            const isDropdown = !!item.columns;
            if (!isDropdown) {
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={cn(
                    "flex items-center px-5 text-sm text-white capitalize no-underline",
                    "hover:opacity-90",
                    pathname === item.href && "underline underline-offset-4 decoration-2"
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
                  type="button"
                  className="flex items-center gap-1.5 px-5 text-sm text-white capitalize cursor-pointer"
                  style={{ minHeight: 40 }}
                >
                  {item.label}
                  <span className="inline-block rotate-180 text-[10px]" aria-hidden>
                    {"\u25BE"}
                  </span>
                </button>
                {open === item.label && (
                  <div
                    className="fixed left-0 right-0 z-50"
                    style={{
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 4px rgba(0,0,0,.08)",
                    }}
                  >
                    <div
                      className="mx-auto flex max-w-[1180px] flex-wrap px-5"
                      style={{ paddingTop: 20 }}
                    >
                      {item.columns!.map((col) => (
                        <div
                          key={col.title}
                          className="mb-5"
                          style={{ width: 240, marginRight: 40 }}
                        >
                          <h3
                            className="mb-4 text-base text-[#333]"
                            style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 }}
                          >
                            {col.title}
                          </h3>
                          <ul className="space-y-2.5">
                            {col.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className={cn(
                                    "text-sm text-[#333] no-underline hover:text-[#a68a3a]",
                                    pathname === link.href && "text-[#a68a3a]"
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
                    {item.overview && (
                      <div
                        className="mx-auto flex max-w-[1180px] items-center px-5"
                        style={{ borderTop: "1px solid #ccc", height: 50 }}
                      >
                        <Link href={item.overview.href} className="text-sm no-underline text-brand-gold font-semibold uppercase tracking-wide">
                          {item.overview.label}
                        </Link>
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
        <div className="lg:hidden bg-white border-t border-surface-muted px-5 py-4">
          {megaNav.map((item) => (
            <div key={item.label} className="mb-3">
              <div className="font-display text-sm font-bold text-brand-navy mb-1">
                {item.label}
              </div>
              {item.columns ? (
                item.columns.map((col) => (
                  <div key={col.title} className="mb-2">
                    <div className="text-xs uppercase text-brand-gold">{col.title}</div>
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
                <Link href={item.overview.href} className="block py-1 pl-3 text-sm font-semibold text-brand-gold no-underline" onClick={() => setMobileOpen(false)}>
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
