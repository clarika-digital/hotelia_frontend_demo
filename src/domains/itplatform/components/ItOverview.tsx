"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { actOnDevice, fetchItOverview } from "@/domains/itplatform/api";
import type {
  GeofenceStatus,
  ItPlatformSnapshot,
  KioskTouchpoint,
  SessionDevice,
} from "@/domains/itplatform/types";
import { ApiError } from "@/global/api/client";
import { Icon, type IconName } from "@/global/components/ui/Icon";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { ChartCard, Donut, Section, StatCell } from "@/global/components/ui/charts";

const GEOFENCE_TONE: Record<GeofenceStatus, "green" | "red"> = {
  verified: "green",
  denied: "red",
};

function lastActiveLabel(min: number): string {
  if (min <= 1) return "now";
  if (min < 60) return `${min} min ago`;
  return `${Math.floor(min / 60)} h ago`;
}

function SessionRow({
  s,
  onAct,
  busy,
}: {
  s: SessionDevice;
  onAct: (id: string, target: "session" | "kiosk", action: "revoke" | "terminate") => void;
  busy: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-brand-navy">
          {s.user} · {s.role}
        </p>
        <p className="truncate text-[11px] text-gray-500">
          {s.device} · {s.os} · {s.ip} · {s.country} · {lastActiveLabel(s.lastActive)}
        </p>
      </div>
      <div className="flex-none">
        <StatusBadge tone={GEOFENCE_TONE[s.geofence]}>{s.geofence}</StatusBadge>
      </div>
      {s.geofence === "verified" && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onAct(s.id, "session", "terminate")}
          className="flex-none rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          Terminate
        </button>
      )}
    </div>
  );
}

function KioskRow({
  k,
  onAct,
  busy,
}: {
  k: KioskTouchpoint;
  onAct: (id: string, target: "session" | "kiosk", action: "revoke" | "terminate") => void;
  busy: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-brand-navy">{k.device}</p>
        <p className="text-[11px] text-gray-500">Role · {k.role}</p>
      </div>
      <div className="flex-none">
        {k.online ? (
          <StatusBadge tone="green">online</StatusBadge>
        ) : (
          <StatusBadge tone="neutral">offline</StatusBadge>
        )}
        <StatusBadge tone={k.token === "valid" ? "green" : "red"}>{k.token}</StatusBadge>
      </div>
      {k.token === "valid" && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onAct(k.id, "kiosk", "revoke")}
          className="flex-none rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          Revoke
        </button>
      )}
    </div>
  );
}

interface OverviewSection {
  id: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  kpi: string;
  children: ReactNode;
}

export function ItOverview() {
  const [snap, setSnap] = useState<ItPlatformSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(["charts", "sessions", "kiosks", "health"])
  );

  const refresh = useCallback(async () => {
    try {
      const data = await fetchItOverview();
      setSnap(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail ?? err.title : "Could not load the platform overview."
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchItOverview();
        if (!cancelled) setSnap(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.detail ?? err.title : "Could not load the platform overview."
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

  async function onAct(id: string, target: "session" | "kiosk", action: "revoke" | "terminate") {
    setBusyId(id);
    try {
      await actOnDevice(id, target, action);
      await refresh();
    } catch {
      setError("Could not update that device.");
    } finally {
      setBusyId(null);
    }
  }

  if (!snap && !error) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Loading platform health…
      </p>
    );
  }

  if (error && !snap) {
    return (
      <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
        {error}
      </p>
    );
  }

  const s = snap!;
  const k = s.kpis;

  const sections: OverviewSection[] = [
    {
      id: "sessions",
      icon: "user",
      eyebrow: "Sessions",
      title: "Active Sessions & Devices",
      kpi: String(s.sessions.length),
      children: (
        <div className="space-y-2">
          {s.sessions.map((ss) => (
            <SessionRow key={ss.id} s={ss} onAct={onAct} busy={busyId === ss.id} />
          ))}
        </div>
      ),
    },
    {
      id: "kiosks",
      icon: "key",
      eyebrow: "Touchpoints",
      title: "Kiosk Touchpoints",
      kpi: String(s.kiosks.length),
      children: (
        <div className="space-y-2">
          {s.kiosks.map((kk) => (
            <KioskRow key={kk.id} k={kk} onAct={onAct} busy={busyId === kk.id} />
          ))}
        </div>
      ),
    },
    {
      id: "health",
      icon: "bell",
      eyebrow: "System",
      title: "System Health",
      kpi: s.systouch.status,
      children: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCell label="Uptime" value={s.systouch.uptime} />
            <StatCell label="Last sync" value={s.systouch.lastSync} />
            <StatCell label="Token refreshes / 24h" value={String(k.tokenRefreshes24h)} />
            <StatCell label="Refresh failures" value={String(k.tokenRefreshFailures)} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Error feed
            </p>
            <div className="space-y-2">
              {s.systouch.errorFeed.map((e) => (
                <p
                  key={e}
                  className="rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2 text-xs text-gray-600"
                >
                  {e}
                </p>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "geofence",
      icon: "shield",
      eyebrow: "Identity",
      title: "Geofence & Identity",
      kpi: `${s.geofence.radiusKm} km`,
      children: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCell label="Property" value={s.geofence.property} />
            <StatCell label="Radius" value={`${s.geofence.radiusKm} km`} />
            <StatCell label="Staff accounts" value={String(k.staffAccounts)} />
            <StatCell label="Touchpoints provisioned" value={String(k.touchpointsProvisioned)} />
          </div>
          <p className="text-xs text-gray-500">
            Centre {s.geofence.latitude}, {s.geofence.longitude}. Enforcement applies to{" "}
            {s.geofence.enforcedRoles.join(" · ")}. Executive & Super Admin are whitelisted.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Staff accounts" value={String(k.staffAccounts)} sub={`${k.touchpointsProvisioned} touchpoints provisioned`} accent />
        <StatCard label="Active sessions" value={String(k.activeSessions)} sub="On-property, last sync minutes ago" />
        <StatCard label="Token refreshes / 24h" value={String(k.tokenRefreshes24h)} sub={`${k.tokenRefreshFailures} failure`} />
        <StatCard label="Revoked tokens" value={String(k.revokedTokens7d)} sub="Last 7 days" />
      </div>

      <div className="mt-4 space-y-3">
        <Section id="charts" icon="chart" eyebrow="Analytics" title="Platform Health" kpi={`${k.activeSessions} active`} open={open.has("charts")} onToggle={toggle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartCard title="Provisioned devices">
              <Donut data={s.deviceMix} />
            </ChartCard>
            <ChartCard title="Token health">
              <Donut data={s.tokenHealth} />
            </ChartCard>
          </div>
        </Section>

        {sections.map((sec) => (
          <Section
            key={sec.id}
            id={sec.id}
            icon={sec.icon}
            eyebrow={sec.eyebrow}
            title={sec.title}
            kpi={sec.kpi}
            open={open.has(sec.id)}
            onToggle={toggle}
          >
            {sec.children}
          </Section>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Icon name="shield" className="h-3.5 w-3.5" />
        IT platform health is on-premise only — device revokes and session terminations are audited.
      </p>
    </div>
  );
}
