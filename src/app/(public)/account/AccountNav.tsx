"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GUEST_PAGE_ROUTES } from "@/domains/guests/constants";
import { cn } from "@/lib/cn";

const TABS = [
  { label: "Overview", href: GUEST_PAGE_ROUTES.account, icon: "layout-dashboard" },
  { label: "Bookings", href: GUEST_PAGE_ROUTES.bookings, icon: "list" },
  { label: "Profile", href: GUEST_PAGE_ROUTES.profile, icon: "user" },
  { label: "Data & Privacy", href: GUEST_PAGE_ROUTES.export, icon: "shield-check" },
] as const;

function normalize(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export function AccountNav() {
  const pathname = usePathname();
  const path = normalize(pathname);

  const isActive = (href: string) => {
    const base = normalize(href);
    if (href === GUEST_PAGE_ROUTES.account) return path === "/account";
    return path === base || path.startsWith(`${base}/`);
  };

  return (
    <nav aria-label="Account sections" className="overflow-x-auto">
      <div className="flex gap-8 border-t border-gray-100">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap border-b-2 py-3 text-sm font-semibold no-underline transition-colors",
                active
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-gray-500 hover:text-brand-navy"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}