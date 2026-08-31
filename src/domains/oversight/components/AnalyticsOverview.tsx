"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  fetchOversightAnalytics,
  fetchOversightLog,
  fetchOversightOverrides,
  fetchOversightUsers,
  fetchWhitelist,
} from "@/domains/oversight/api";
import type {
  AnalyticsSnapshot,
  AuditEntry,
  CategoryOccupancy,
  OversightUser,
  PermissionOverride,
  RevenueBucket,
  WhitelistEntry,
} from "@/domains/oversight/types";
import { ApiError } from "@/global/api/client";
import { Icon, type IconName } from "@/global/components/ui/Icon";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import {
  Bar,
  DAY_MS,
  Donut,
  ROLE_COLORS,
  Section,
  SectionDivider,
  SectionFilter,
  STATUS_DONUT,
  StatCell,
  TrendBars,
} from "@/global/components/ui/charts";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/formatters";

type Scope = "all" | "admin" | "hotel";
type AuditRange = "today" | "7d" | "all";
type OverrideStatus = "all" | "active" | "expiring" | "expired";

const ROLE_LABELS: Record<string, string> = {
  front_desk: "Front Desk",
  accountant: "Accountant",
  housekeeping: "Housekeeping",
  maintenance: "Maintenance",
  manager: "Manager",
  it_manager: "IT Manager",
  executive: "Executive",
  super_admin: "Super Admin",
  security: "Security",
  chef: "Culinary",
  guest: "Guests",
};

function prettyRole(role: string | null): string {
  if (!role) return "Unassigned";
  return ROLE_LABELS[role] ?? role.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function overrideState(o: PermissionOverride): OverrideStatus {
  if (!o.expiresAt) return "active";
  const exp = Date.parse(o.expiresAt);
  const now = Date.now();
  if (exp < now) return "expired";
  if (exp <= now + 7 * DAY_MS) return "expiring";
  return "active";
}

export function AnalyticsOverview() {
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [overrides, setOverrides] = useState<PermissionOverride[]>([]);
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [users, setUsers] = useState<OversightUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState<Set<string>>(
    () => new Set(["charts", "identity", "governance", "security", "audit"])
  );
  const [scope, setScope] = useState<Scope>("all");

  const [identitySearch, setIdentitySearch] = useState("");
  const [govSearch, setGovSearch] = useState("");
  const [govOverrideStatus, setGovOverrideStatus] = useState<OverrideStatus>("all");
  const [auditSearch, setAuditSearch] = useState("");
  const [auditRange, setAuditRange] = useState<AuditRange>("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [snap, overs, wl, logs, usrs] = await Promise.all([
          fetchOversightAnalytics(),
          fetchOversightOverrides(),
          fetchWhitelist(),
          fetchOversightLog(),
          fetchOversightUsers(),
        ]);
        if (!cancelled) {
          setSnapshot(snap);
          setOverrides(overs);
          setWhitelist(wl);
          setAuditLog(logs);
          setUsers(usrs);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.detail ?? err.title : "Could not load the overview."
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const todayKey = new Date().toISOString().slice(0, 10);

  const filteredUsers = useMemo(() => {
    const q = identitySearch.trim().toLowerCase();
    return users.filter(
      (u) => !q || [u.name, u.email, prettyRole(u.role)].some((v) => v.toLowerCase().includes(q))
    );
  }, [users, identitySearch]);

  const filteredOverrides = useMemo(() => {
    const q = govSearch.trim().toLowerCase();
    return overrides.filter(
      (o) =>
        (govOverrideStatus === "all" || overrideState(o) === govOverrideStatus) &&
        (!q || [o.userName, o.permission, o.grantedBy].some((v) => v.toLowerCase().includes(q)))
    );
  }, [overrides, govOverrideStatus, govSearch]);

  const filteredWhitelist = useMemo(() => {
    const q = govSearch.trim().toLowerCase();
    return whitelist.filter(
      (w) => !q || [w.userName, w.reason ?? "", w.grantedBy].some((v) => v.toLowerCase().includes(q))
    );
  }, [whitelist, govSearch]);

  const filteredAudit = useMemo(() => {
    const q = auditSearch.trim().toLowerCase();
    return auditLog.filter((e) => {
      const inRange =
        auditRange === "today"
          ? e.at.slice(0, 10) === todayKey
          : auditRange === "7d"
            ? Date.now() - Date.parse(e.at) <= 7 * DAY_MS
            : true;
      return (
        inRange &&
        (!q || [e.actor, e.actorRole, e.action, e.detail].some((v) => v.toLowerCase().includes(q)))
      );
    });
  }, [auditLog, auditRange, auditSearch]);

  if (!snapshot && !error) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Loading overview…
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
        {error}
      </p>
    );
  }

  const a = snapshot;
  if (!a) return null;

  const activeBookings = a.reservations.pending + a.reservations.confirmed + a.reservations.inHouse;
  const statusData = STATUS_DONUT.map((s) => ({ label: s.label, value: a.reservations[s.field], color: s.color }));
  const roleData = a.security.accountsByRole
    .map((r, i) => ({ label: prettyRole(r.role), value: r.count, color: ROLE_COLORS[i % ROLE_COLORS.length] }))
    .sort((x, y) => y.value - x.value);
  const staffCount = users.filter((u) => u.userType === "staff").length;
  const guestCount = users.filter((u) => u.userType === "guest").length;

  interface OverviewSection {
    id: string;
    sectionScope: Scope;
    icon: IconName;
    eyebrow: string;
    title: string;
    kpi: string;
    keywords: string[];
    pinned: boolean;
    children: ReactNode;
  }

  const sections: OverviewSection[] = [
    {
      id: "identity",
      sectionScope: "admin",
      icon: "users",
      eyebrow: "Identity & Access",
      title: "Accounts & Sessions",
      kpi: String(users.length),
      keywords: ["accounts", "sessions", "staff", "guests", "identity", "access", "users"],
      pinned: true,
      children: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Staff accounts" value={String(staffCount)} accent />
            <StatCard label="Guest accounts" value={String(guestCount)} />
            <StatCard label="Complete profiles" value={String(a.guests.completeProfiles)} />
            <StatCard label="Live sessions" value={String(a.security.activeSessions)} />
          </div>
          <SectionFilter>
            <label className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 focus-within:border-brand-gold">
              <Icon name="search" className="h-4 w-4 flex-none text-gray-400" />
              <input
                type="search"
                value={identitySearch}
                onChange={(e) => setIdentitySearch(e.target.value)}
                placeholder="Search accounts…"
                className="w-full bg-transparent text-sm text-brand-navy outline-none placeholder:text-gray-400"
              />
            </label>
          </SectionFilter>
          <div className="space-y-2">
            {filteredUsers.slice(0, 8).map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand-navy/10 font-display text-xs font-semibold text-brand-navy">
                  {u.name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-brand-navy">{u.name}</p>
                  <p className="truncate text-[11px] text-gray-500">{u.email}</p>
                </div>
                <StatusBadge tone={u.userType === "staff" ? "gold" : "neutral"}>
                  {prettyRole(u.role)}
                </StatusBadge>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="px-1 text-xs text-gray-400">No accounts match this search.</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "governance",
      sectionScope: "admin",
      icon: "shield-check",
      eyebrow: "Governance",
      title: "Overrides & Geofence Exemptions",
      kpi: String(a.security.overrides),
      keywords: ["overrides", "geofence", "whitelist", "exemptions", "permissions", "grants"],
      pinned: true,
      children: (
        <div className="space-y-4">
          <SectionFilter>
            <label className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 focus-within:border-brand-gold">
              <Icon name="search" className="h-4 w-4 flex-none text-gray-400" />
              <input
                type="search"
                value={govSearch}
                onChange={(e) => setGovSearch(e.target.value)}
                placeholder="Search overrides & whitelist…"
                className="w-full bg-transparent text-sm text-brand-navy outline-none placeholder:text-gray-400"
              />
            </label>
            <select
              value={govOverrideStatus}
              onChange={(e) => setGovOverrideStatus(e.target.value as OverrideStatus)}
              className="flex-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-brand-navy outline-none focus:border-brand-gold"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring</option>
              <option value="expired">Expired</option>
            </select>
          </SectionFilter>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Permission overrides ({filteredOverrides.length})
              </p>
              {filteredOverrides.slice(0, 6).map((o) => (
                <div key={o.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-brand-navy">{o.userName}</p>
                    <p className="truncate text-[11px] text-gray-500">{o.permission}</p>
                  </div>
                  <StatusBadge tone={overrideState(o) === "active" ? "green" : overrideState(o) === "expiring" ? "amber" : "red"}>
                    {overrideState(o)}
                  </StatusBadge>
                </div>
              ))}
              {filteredOverrides.length === 0 && (
                <p className="px-1 text-xs text-gray-400">No overrides match the current filters.</p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Geofence whitelist ({filteredWhitelist.length})
              </p>
              {filteredWhitelist.slice(0, 6).map((w) => (
                <div key={w.id} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-brand-navy">{w.userName}</p>
                    <p className="truncate text-[11px] text-gray-500">{w.reason ?? "Whitelisted for off-site work"}</p>
                  </div>
                  <Icon name="check" className="h-3.5 w-3.5 flex-none text-green-600" />
                </div>
              ))}
              {filteredWhitelist.length === 0 && (
                <p className="px-1 text-xs text-gray-400">No whitelist entries match the current filters.</p>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      sectionScope: "admin",
      icon: "shield",
      eyebrow: "Security",
      title: "Security Posture",
      kpi: String(a.security.activeSessions),
      keywords: ["sessions", "security", "geofence", "accounts", "roles", "violations", "exemptions"],
      pinned: true,
      children: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Live sessions" value={String(a.security.activeSessions)} accent />
          <StatCard label="Active overrides" value={String(a.security.overrides)} />
          <StatCard label="Expiring ≤ 7 days" value={String(a.security.expiringSoon)} />
          <StatCard label="Geofence exemptions" value={String(a.security.whitelist)} />
          <StatCard label="Violations" value={String(a.security.violations)} />
          <StatCard label="Roles provisioned" value={String(a.security.accountsByRole.length)} />
        </div>
      ),
    },
    {
      id: "audit",
      sectionScope: "admin",
      icon: "history",
      eyebrow: "Audit",
      title: "Oversight & Audit Activity",
      kpi: String(a.audit.isolatedToday),
      keywords: ["audit", "oversight", "isolated", "log", "events", "activity"],
      pinned: true,
      children: (
        <div className="space-y-4">
          <SectionFilter>
            <label className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 focus-within:border-brand-gold">
              <Icon name="search" className="h-4 w-4 flex-none text-gray-400" />
              <input
                type="search"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit events…"
                className="w-full bg-transparent text-sm text-brand-navy outline-none placeholder:text-gray-400"
              />
            </label>
            <select
              value={auditRange}
              onChange={(e) => setAuditRange(e.target.value as AuditRange)}
              className="flex-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-brand-navy outline-none focus:border-brand-gold"
            >
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="today">Today</option>
            </select>
          </SectionFilter>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Isolated today" value={String(a.audit.isolatedToday)} accent />
            <StatCard label="Standard today" value={String(a.audit.standardToday)} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Isolated events ({filteredAudit.length})
            </p>
            {filteredAudit.slice(0, 8).map((e) => (
              <div key={e.id} className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
                <Icon name="shield-check" className="mt-0.5 h-3.5 w-3.5 flex-none text-brand-gold" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-brand-navy">{e.action}</p>
                  <p className="truncate text-[11px] text-gray-500">{e.detail}</p>
                </div>
                <span className="flex-none text-[10px] text-gray-400">
                  {new Date(e.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
            {filteredAudit.length === 0 && (
              <p className="px-1 text-xs text-gray-400">No audit events match the current filters.</p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "occupancy",
      sectionScope: "hotel",
      icon: "key",
      eyebrow: "Rooms",
      title: "Occupancy & Room Performance",
      kpi: `${a.occupancy.rate}%`,
      keywords: ["occupancy", "rooms", "house", "arrivals", "departures"],
      pinned: false,
      children: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="In-house" value={String(a.occupancy.inHouse)} accent />
          <StatCard label="Available" value={String(a.occupancy.available)} />
          <StatCard label="Arriving today" value={String(a.occupancy.arrivingToday)} />
          <StatCard label="Departing today" value={String(a.occupancy.departingToday)} />
        </div>
      ),
    },
    {
      id: "revenue",
      sectionScope: "hotel",
      icon: "wallet",
      eyebrow: "Finance",
      title: "Revenue Overview",
      kpi: formatMoney(a.revenue.total, "GHS", "en-GH"),
      keywords: ["revenue", "finance", "income", "tax", "night"],
      pinned: false,
      children: (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Confirmed" value={formatMoney(a.revenue.confirmed, "GHS", "en-GH")} accent />
          <StatCard label="Pending" value={formatMoney(a.revenue.pending, "GHS", "en-GH")} />
          <StatCard label="Avg / night" value={formatMoney(a.revenue.perNight, "GHS", "en-GH")} />
          <StatCard label="Tax (15%)" value={formatMoney(a.revenue.tax, "GHS", "en-GH")} />
        </div>
      ),
    },
    {
      id: "reservations",
      sectionScope: "hotel",
      icon: "list",
      eyebrow: "Reservations",
      title: "Booking Pipeline",
      kpi: String(activeBookings),
      keywords: ["bookings", "reservations", "pipeline", "status", "walk-in", "account"],
      pinned: false,
      children: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Account guests" value={String(a.reservations.account)} accent />
            <StatCard label="Walk-in" value={String(a.reservations.walkIn)} />
            <StatCard label="Avg stay" value={`${a.reservations.avgNights} nights`} />
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-5">
              <StatusBadge tone="amber">Pending {a.reservations.pending}</StatusBadge>
              <StatusBadge tone="gold">Confirmed {a.reservations.confirmed}</StatusBadge>
              <StatusBadge tone="green">In-house {a.reservations.inHouse}</StatusBadge>
              <StatusBadge tone="neutral">Completed {a.reservations.completed}</StatusBadge>
              <StatusBadge tone="red">Cancelled {a.reservations.cancelled}</StatusBadge>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "guests",
      sectionScope: "hotel",
      icon: "user",
      eyebrow: "Guests",
      title: "Guest Base & Markets",
      kpi: String(a.guests.total),
      keywords: ["guests", "markets", "countries", "profiles", "export"],
      pinned: false,
      children: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total guests" value={String(a.guests.total)} accent />
            <StatCard label="Registered" value={String(a.guests.registered)} />
            <StatCard label="Complete profiles" value={`${a.guests.completeProfiles}`} />
            <StatCard label="Export-ready" value={a.guests.completeProfiles === a.guests.total ? "All" : "Partial"} />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Top markets</p>
            {a.guests.byCountry.map((m) => (
              <div key={m.country}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-gray-600">{m.country}</span>
                  <span className="font-semibold text-brand-navy">{m.count}</span>
                </div>
                <Bar value={m.count} total={a.guests.total} />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const visibleSections = sections.filter(
    (s) => (scope === "all" || s.sectionScope === scope)
  );
  const pinned = visibleSections.filter((s) => s.pinned);
  const rest = visibleSections.filter((s) => !s.pinned);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Live sessions" value={String(a.security.activeSessions)} sub={`${a.security.violations} geofence violation${a.security.violations === 1 ? "" : "s"}`} accent />
        <StatCard label="Active overrides" value={String(a.security.overrides)} sub={`${a.security.expiringSoon} expiring ≤ 7 days`} />
        <StatCard label="Isolated events today" value={String(a.audit.isolatedToday)} sub={`${a.audit.standardToday} standard events`} />
        <StatCard label="Total accounts" value={String(users.length)} sub={`${staffCount} staff · ${guestCount} guest`} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-gold">
          {scope === "all" ? "System & Hotel" : scope === "admin" ? "System" : "Hotel"}
        </p>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {([
            ["all", "All"],
            ["admin", "System"],
            ["hotel", "Hotel"],
          ] as [Scope, string][]).map(([v, label]) => (
            <button
              key={v}
              type="button"
              onClick={() => setScope(v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                scope === v ? "bg-white text-brand-navy shadow-sm" : "text-gray-500 hover:text-brand-navy"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visibleSections.length === 0 && (
        <p className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Nothing in this scope.
        </p>
      )}

      <div className="mt-4 space-y-3">
        <Section id="charts" icon="chart" eyebrow="Analytics" title="System & Operations" kpi={`${a.occupancy.rate}% occ`} open={open.has("charts")} onToggle={toggle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Accounts by role</p>
              <Donut data={roleData} size={120} thickness={16} />
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Booking status</p>
              <Donut data={statusData} size={120} thickness={16} />
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Category utilisation</p>
              {a.occupancy.byCategory.map((c: CategoryOccupancy) => (
                <div key={c.category} className="mt-2 first:mt-0">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="capitalize text-gray-600">{c.category}</span>
                    <span className="font-semibold text-brand-navy">{c.occupied}/{c.total}</span>
                  </div>
                  <Bar value={c.occupied} total={c.total} />
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Revenue trend</p>
              <TrendBars buckets={a.revenue.trend} />
            </div>
          </div>
        </Section>

        {pinned.map((s) => (
          <Section key={s.id} id={s.id} icon={s.icon} eyebrow={s.eyebrow} title={s.title} kpi={s.kpi} open={open.has(s.id)} onToggle={toggle}>
            {s.children}
          </Section>
        ))}
        {pinned.length > 0 && rest.length > 0 && (
          <SectionDivider label="Hotel operations" />
        )}
        {rest.map((s) => (
          <Section key={s.id} id={s.id} icon={s.icon} eyebrow={s.eyebrow} title={s.title} kpi={s.kpi} open={open.has(s.id)} onToggle={toggle}>
            {s.children}
          </Section>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Icon name="chart" className="h-3.5 w-3.5" />
        Live snapshot from current mock state — derived on request, refreshed on each load.
      </p>
    </div>
  );
}