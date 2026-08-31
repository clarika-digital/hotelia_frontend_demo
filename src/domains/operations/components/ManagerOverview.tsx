"use client";

import { useEffect, useState, type ReactNode } from "react";
import { fetchManagerOverview } from "@/domains/operations/api";
import type {
  AttentionItem,
  AttentionPriority,
  OperationalSnapshot,
  WorkOrderItem,
} from "@/domains/operations/types";
import { ApiError } from "@/global/api/client";
import { Icon, type IconName } from "@/global/components/ui/Icon";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import {
  ChartCard,
  Donut,
  Section,
  StatCell,
} from "@/global/components/ui/charts";

const PRIORITY_TONE: Record<AttentionPriority, "red" | "amber" | "neutral"> = {
  high: "red",
  medium: "amber",
  low: "neutral",
};

const ORDER_PRIORITY_TONE: Record<WorkOrderItem["priority"], "red" | "amber" | "neutral"> = {
  high: "red",
  medium: "amber",
  low: "neutral",
};

const REC_LEVEL_TONE: Record<string, "gold" | "amber" | "green"> = {
  info: "gold",
  warning: "amber",
  success: "green",
};

interface OverviewSection {
  id: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  kpi: string;
  children: ReactNode;
}

function OccupancyTrend({ snap }: { snap: OperationalSnapshot }) {
  const max = Math.max(...snap.occupancyTrend.map((b) => b.value), 1);
  return (
    <div className="flex h-28 items-end justify-between gap-3">
      {snap.occupancyTrend.map((b) => (
        <div key={b.label} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-semibold text-brand-navy">
            {Math.round((b.value / max) * 100)}%
          </span>
          <div
            className="w-full rounded-t-md bg-brand-gold/80"
            style={{ height: `${Math.max(Math.round((b.value / max) * 100), 4)}%` }}
          />
          <span className="text-[10px] text-gray-400">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

function AttentionRow({ a }: { a: AttentionItem }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-brand-navy">{a.label}</p>
        <p className="text-[11px] text-gray-500">{a.detail}</p>
      </div>
      <StatusBadge tone={PRIORITY_TONE[a.priority]}>{a.priority}</StatusBadge>
    </div>
  );
}

function WorkOrderRow({ w }: { w: WorkOrderItem }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-brand-navy">
          {w.ref} · Room {w.room} · {w.issue}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge tone={ORDER_PRIORITY_TONE[w.priority]}>{w.priority}</StatusBadge>
        <StatusBadge tone={w.status === "resolved" ? "green" : "neutral"}>{w.status}</StatusBadge>
      </div>
    </div>
  );
}

export function ManagerOverview() {
  const [snap, setSnap] = useState<OperationalSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(["charts", "operations", "team", "attention"])
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchManagerOverview();
        if (!cancelled) setSnap(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.detail ?? err.title : "Could not load the operational overview."
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

  if (!snap && !error) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Loading operational overview…
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
      id: "operations",
      icon: "key",
      eyebrow: "Operations",
      title: "Rooms & Reservations",
      kpi: `${k.occupancy}%`,
      children: (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCell label="Occupancy" value={`${k.occupancy}%`} />
            <StatCell label="Arrivals today" value={String(k.arrivalsToday)} />
            <StatCell label="Departures today" value={String(k.departuresToday)} />
            <StatCell label="Account bookings" value={String(s.pipeline.account)} />
            <StatCell label="Walk-in bookings" value={String(s.pipeline.walkIn)} />
            <StatCell label="Blocked rooms" value={String(k.blockedRooms)} />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Booking mix
            </p>
            <Donut
              data={[
                { label: "Pending", value: s.pipeline.status[0].count, color: "#d97706" },
                { label: "Confirmed", value: s.pipeline.status[1].count, color: "#876a20" },
                { label: "In-house", value: s.pipeline.status[2].count, color: "#15803d" },
                { label: "Completed", value: s.pipeline.status[3].count, color: "#64748b" },
                { label: "Cancelled", value: s.pipeline.status[4].count, color: "#dc2626" },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      id: "team",
      icon: "users",
      eyebrow: "Work Orders",
      title: "Maintenance Work Orders",
      kpi: String(k.openWorkOrders),
      children: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCell label="Open work orders" value={String(k.openWorkOrders)} />
            <StatCell label="High priority" value={String(k.highPriorityMaintenance)} />
            <StatCell label="Housekeeping in progress" value={String(k.housekeepingInProgress)} />
            <StatCell label="Guest approvals pending" value={String(k.guestApprovalsPending)} />
          </div>
          <div className="space-y-2">
            {s.workOrders
              .filter((w) => w.status !== "resolved")
              .map((w) => (
                <WorkOrderRow key={w.id} w={w} />
              ))}
          </div>
        </div>
      ),
    },
    {
      id: "attention",
      icon: "alert-triangle",
      eyebrow: "Escalations",
      title: "Needs Your Attention",
      kpi: String(k.pendingEscalations),
      children:
        s.attention.length > 0 ? (
          <div className="space-y-2">
            {s.attention.map((a) => (
              <AttentionRow key={a.id} a={a} />
            ))}
          </div>
        ) : (
          <p className="px-1 py-4 text-center text-xs text-gray-400">
            Nothing needs your attention right now.
          </p>
        ),
    },
    {
      id: "recommendations",
      icon: "star",
      eyebrow: "Insights",
      title: "Recommendations",
      kpi: String(s.recommendations.length),
      children: (
        <div className="space-y-2">
          {s.recommendations.map((r) => (
            <div
              key={r.id}
              className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2"
            >
              <span className="mt-0.5 flex-none">
                <StatusBadge tone={REC_LEVEL_TONE[r.level]}>
                  {r.level === "warning" ? "Action" : r.level === "success" ? "Good" : "Note"}
                </StatusBadge>
              </span>
              <p className="text-xs text-brand-navy">{r.message}</p>
            </div>
          ))}
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
        <StatCard
          label="Occupancy"
          value={`${k.occupancy}%`}
          sub={`${k.arrivalsToday} arriving · ${k.departuresToday} departing`}
          accent
        />
        <StatCard label="Open tasks" value={String(k.openTasks)} sub="Across housekeeping + maintenance" />
        <StatCard label="Pending escalations" value={String(k.pendingEscalations)} sub={`${k.signOffRequired} need your sign-off`} />
        <StatCard label="Open work orders" value={String(k.openWorkOrders)} sub={`${k.highPriorityMaintenance} high priority`} />
      </div>

      <div className="mt-4 space-y-3">
        <Section id="charts" icon="chart" eyebrow="Analytics" title="Operational Dashboard" kpi={`${k.occupancy}% occupancy`} open={open.has("charts")} onToggle={toggle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartCard title="Occupancy — this week">
              <OccupancyTrend snap={s} />
            </ChartCard>
            <ChartCard title="Booking pipeline">
              <Donut
                data={s.pipeline.status.map((p) => ({
                  label: p.label,
                  value: p.count,
                  color: p.color,
                }))}
              />
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
        <Icon name="chart" className="h-3.5 w-3.5" />
        Live snapshot from current mock state — operational oversight only, read-level.
      </p>
    </div>
  );
}
