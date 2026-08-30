"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { StaffNavGroup, StaffRoleMeta } from "@/data/staff-nav";
import { Icon } from "@/global/components/ui/Icon";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string): boolean {
  const norm = (p: string) => p.replace(/\/+$/, "") || "/";
  return norm(pathname) === norm(href);
}

interface SidebarProps {
  meta: StaffRoleMeta;
  collapsed: boolean;
  onSetCollapsed: (collapsed: boolean) => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({
  meta,
  collapsed,
  onSetCollapsed,
  mobile = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [hoverGroup, setHoverGroup] = useState<string | null>(null);
  const year = new Date().getFullYear();

  const wide = !collapsed || mobile;

  useEffect(() => {
    setOpenGroups(() => {
      const first = meta.groups[0];
      return first ? { [first.title]: true } : {};
    });
  }, [meta]);

  useEffect(() => {
    const activeGroup = meta.groups.find((g) =>
      g.items.some((i) => !i.disabled && isActive(pathname, i.href))
    );
    if (activeGroup) {
      setOpenGroups((prev) =>
        prev[activeGroup.title] ? prev : { ...prev, [activeGroup.title]: true }
      );
    }
  }, [pathname, meta]);

  function toggleGroup(title: string) {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  const homeActive = isActive(pathname, meta.home);

  const itemRow = (item: { label: string; href: string; disabled?: boolean }) => {
    const active = !item.disabled && isActive(pathname, item.href);
    const cls = cn(
      "flex items-center gap-2.5 rounded-lg py-2 pr-3 text-sm transition-colors",
      active &&
        "bg-brand-gold/15 font-semibold text-white shadow-[inset_3px_0_0_0_#d9bd82]",
      !item.disabled && !active && "text-white/70 hover:bg-white/10 hover:text-white",
      item.disabled && "cursor-not-allowed text-white/35"
    );
    if (item.disabled) {
      return (
        <span className={cls} aria-disabled>
          <span className="truncate">{item.label}</span>
          <span className="ml-auto shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/45">
            Soon
          </span>
        </span>
      );
    }
    return (
      <Link href={item.href} onClick={onNavigate} className={cls}>
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  const groupButton = (g: StaffNavGroup) => {
    const open = !!openGroups[g.title];
    const hasActive = g.items.some(
      (i) => !i.disabled && isActive(pathname, i.href)
    );
    return (
      <button
        type="button"
        onClick={() => toggleGroup(g.title)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          open
            ? "font-semibold text-white"
            : "text-white/70 hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon
          name={g.icon}
          className={cn(
            "h-[18px] w-[18px] shrink-0",
            open || hasActive ? "text-brand-goldBright" : "text-white/55"
          )}
        />
        <span className="flex-1 truncate text-left">{g.title}</span>
        <Icon
          name="chevron-down"
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            open ? "rotate-180 text-brand-goldBright" : "text-white/40"
          )}
        />
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-brand-navy to-brand-navyDark text-white">
      <div
        className={cn(
          "shrink-0 border-b border-white/10",
          wide
            ? "flex h-16 items-center justify-between gap-2 px-3"
            : "flex flex-col items-center justify-center gap-1.5 px-2 py-3"
        )}
      >
        <img
          src="/images/logo-hotelia.svg"
          alt="Hotelia"
          className="h-8 w-auto shrink-0 brightness-0 invert"
        />
        {wide ? (
          mobile ? (
            <button
              type="button"
              onClick={onNavigate}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-2xl leading-none text-white/70 hover:bg-white/10 hover:text-white"
            >
              &times;
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSetCollapsed(true)}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-goldBright/50"
            >
              <Icon name="chevrons-left" className="h-4 w-4" />
            </button>
          )
        ) : (
          <button
            type="button"
            onClick={() => onSetCollapsed(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-goldBright/50"
          >
            <Icon name="chevrons-right" className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav
        className={cn(
          "min-h-0 flex-1",
          wide
            ? "overflow-y-auto px-3 py-4"
            : "overflow-visible px-2 py-4"
        )}
        aria-label="Staff navigation"
      >
        {wide ? (
          <ul className="space-y-0.5">
            <li>
              <Link
                href={meta.home}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  homeActive
                    ? "bg-brand-gold/15 font-semibold text-white shadow-[inset_3px_0_0_0_#d9bd82]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon
                  name="layout-dashboard"
                  className={cn(
                    "h-[18px] w-[18px]",
                    homeActive ? "text-brand-goldBright" : "text-white/55"
                  )}
                />
                <span>{meta.homeLabel ?? "Dashboard"}</span>
              </Link>
            </li>
          </ul>
        ) : (
          <div className="flex flex-col items-stretch gap-1">
            <Link
              href={meta.home}
              onClick={onNavigate}
              aria-label={meta.homeLabel ?? "Dashboard"}
              title={meta.homeLabel ?? "Dashboard"}
              className={cn(
                "flex h-11 w-full items-center justify-center rounded-lg transition-colors",
                homeActive
                  ? "bg-white/10 text-brand-goldBright"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon name="layout-dashboard" className="h-5 w-5" />
            </Link>
          </div>
        )}

        <div
          className={cn(
            "space-y-0.5",
            wide ? "mt-1" : "mt-1 flex flex-col items-stretch"
          )}
        >
          {meta.groups.map((g) => (
            <div
              key={g.title}
              className={wide ? "" : "relative"}
              onMouseEnter={() => !wide && setHoverGroup(g.title)}
              onMouseLeave={() => !wide && setHoverGroup(null)}
            >
              {wide ? (
                <div>
                  {groupButton(g)}
                  {openGroups[g.title] && (
                    <ul className="mb-1 mt-1 space-y-0.5 pl-11">
                      {g.items.map((item) => (
                        <li key={item.label}>{itemRow(item)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleGroup(g.title)}
                    aria-label={g.title}
                    title={g.title}
                    aria-expanded={!!openGroups[g.title]}
                    className={cn(
                      "flex h-11 w-full items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-goldBright/50",
                      openGroups[g.title] ||
                        g.items.some(
                          (i) => !i.disabled && isActive(pathname, i.href)
                        )
                        ? "bg-white/10 text-brand-goldBright"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon name={g.icon} className="h-5 w-5" />
                    {(openGroups[g.title] ||
                      g.items.some(
                        (i) => !i.disabled && isActive(pathname, i.href)
                      )) && (
                      <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-brand-goldBright" />
                    )}
                  </button>

                  {hoverGroup === g.title && (
                    <div className="absolute left-full top-0 z-50 ml-2 w-60 rounded-xl border border-gray-200 bg-white p-3 text-left text-gray-700 shadow-xl">
                      <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                        {g.title}
                      </p>
                      <ul className="space-y-0.5">
                        {g.items.map((item) =>
                          item.disabled ? (
                            <li key={item.label}>
                              <span
                                className="flex cursor-not-allowed items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-400"
                                aria-disabled
                              >
                                <span className="truncate">{item.label}</span>
                                <span className="ml-auto shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-gray-400">
                                  Soon
                                </span>
                              </span>
                            </li>
                          ) : (
                            <li key={item.label}>
                              <Link
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                  "flex items-center gap-2 rounded-lg px-2 py-2 text-sm no-underline transition-colors",
                                  isActive(pathname, item.href)
                                    ? "bg-surface-muted font-semibold text-brand-navy"
                                    : "text-gray-600 hover:bg-surface-muted hover:text-brand-navy"
                                )}
                              >
                                <span className="truncate">{item.label}</span>
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-white/10",
          wide ? "px-3 py-3" : "px-2 py-3"
        )}
      >
        {wide ? (
          <p className="text-center text-[11px] leading-relaxed text-white/45">
            Powered by{" "}
            <span className="font-semibold text-white/70">
              Teva Clarica Digital™
            </span>
            <span className="mt-0.5 block">© {year}</span>
          </p>
        ) : (
          <p
            className="text-center text-[10px] leading-tight text-white/45"
            title={`Powered by Teva Clarica Digital™ © ${year}`}
          >
            TC™
            <span className="block">© {year}</span>
          </p>
        )}
      </div>
    </div>
  );
}