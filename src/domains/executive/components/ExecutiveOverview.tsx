"use client";

import { useEffect, useState, type ReactNode } from "react";
import { fetchExecutiveAnalytics } from "@/domains/executive/api";
import type {
  CategoryOccupancy,
  ExecutiveRecommendation,
  ExecutiveSnapshot,
} from "@/domains/executive/types";
import { ApiError } from "@/global/api/client";
import { Icon, type IconName } from "@/global/components/ui/Icon";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import {
  Bar,
  ChartCard,
  Donut,
  Section,
  SectionDivider,
  STATUS_DONUT,
  StatCell,
  TrendBars,
} from "@/global/components/ui/charts";
import { formatMoney } from "@/lib/formatters";

interface OverviewSection {
  id: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  kpi: string;
  children: ReactNode;
}

const RECOMMENDATION_TONES: Record<ExecutiveRecommendation["tone"], "green" | "amber" | "neutral"> = {
  green: "green",
  amber: "amber",
  neutral: "neutral",
};

function RecommendationRow({ r }: { r: ExecutiveRecommendation }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-brand-navy">{r.label}</p>
        <p className="text-xs text-gray-500">{r.why}</p>
      </div>
      <StatusBadge tone={RECOMMENDATION_TONES[r.tone]}>{r.impact}</StatusBadge>
    </div>
  );
}

export function ExecutiveOverview() {
  const [snapshot, setSnapshot] = useState<ExecutiveSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(["charts", "performance", "demand", "recommendations"])
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await fetchExecutiveAnalytics();
        if (!cancelled) setSnapshot(snap);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.detail ?? err.title : "Could not load the executive summary."
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

  if (!snapshot && !error) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Loading executive summary…
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

  const statusData = STATUS_DONUT.map((s) => ({
    label: s.label,
    value: a.demand[s.field],
    color: s.color,
  }));

  const sections: OverviewSection[] = [
    {
      id: "performance",
      icon: "chart",
      eyebrow: "Performance",
      title: "Occupancy & Room Performance",
      kpi: `${a.performance.occupancyRate}%`,
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
      id: "demand",
      icon: "list",
      eyebrow: "Demand",
      title: "Booking Pipeline & Demand",
      kpi: String(a.demand.confirmed + a.demand.pending + a.demand.inHouse),
      children: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Advance (7d)" value={String(a.demand.advance7d)} accent />
            <StatCard label="Weekend projection" value={`${a.demand.weekendProjection}%`} />
            <StatCard label="Account guests" value={String(a.demand.account)} />
            <StatCard label="Walk-in" value={String(a.demand.walkIn)} />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border border-gray-100 bg-gray-50/60 p-4 lg:justify-start">
            <Donut data={statusData} size={120} thickness={16} />
          </div>
        </div>
      ),
    },
    {
      id: "revenue",
      icon: "wallet",
      eyebrow: "Finance",
      title: "Revenue Overview",
      kpi: formatMoney(a.revenue.confirmed, "GHS", "en-GH"),
      children: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="ADR" value={formatMoney(a.revenue.adr, "GHS", "en-GH")} accent />
            <StatCard label="RevPAR" value={formatMoney(a.revenue.revpar, "GHS", "en-GH")} />
            <StatCard label="Avg / night room" value={formatMoney(a.revenue.perNight, "GHS", "en-GH")} />
            <StatCard label="Tax (15%)" value={formatMoney(a.revenue.tax, "GHS", "en-GH")} />
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Weekly revenue trend
            </p>
            <TrendBars buckets={a.revenue.trend} />
          </div>
        </div>
      ),
    },
    {
      id: "markets",
      icon: "user",
      eyebrow: "Markets",
      title: "Guest Base & Markets",
      kpi: String(a.markets.total),
      children: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total guests" value={String(a.markets.total)} accent />
            <StatCard label="Avg stay" value={`${a.demand.avgNights} nights`} />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Top markets</p>
            {a.markets.byCountry.map((m) => (
              <div key={m.country}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-gray-600">{m.country}</span>
                  <span className="font-semibold text-brand-navy">{m.count}</span>
                </div>
                <Bar value={m.count} total={a.markets.total} />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "recommendations",
      icon: "star",
      eyebrow: "Insights",
      title: "Recommendations",
      kpi: String(a.recommendations.length),
      children: (
        <div className="divide-y divide-gray-100">
          {a.recommendations.map((r) => (
            <RecommendationRow key={r.label} r={r} />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue today" value={formatMoney(a.performance.revenueToday, "GHS", "en-GH")} accent />
        <StatCard label="Occupancy" value={`${a.performance.occupancyRate}%`} sub={`${a.performance.inHouse} of ${a.performance.totalRooms} rooms in-house`} />
        <StatCard label="ADR" value={formatMoney(a.performance.adr, "GHS", "en-GH")} sub="Average daily rate" />
        <StatCard label="RevPAR" value={formatMoney(a.performance.revpar, "GHS", "en-GH")} sub="Revenue per available room" />
      </div>

      <div className="mt-4 space-y-3">
        <Section id="charts" icon="chart" eyebrow="Analytics" title="Performance Dashboard" kpi={`${a.performance.occupancyRate}% occ`} open={open.has("charts")} onToggle={toggle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartCard title="Booking status">
              <Donut data={statusData} size={120} thickness={16} />
            </ChartCard>
            <ChartCard title="Revenue trend">
              <TrendBars buckets={a.revenue.trend} />
            </ChartCard>
            <ChartCard title="Category utilisation">
              {a.occupancy.byCategory.map((c: CategoryOccupancy) => (
                <div key={c.category} className="mt-2 first:mt-0">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="capitalize text-gray-600">{c.category}</span>
                    <span className="font-semibold text-brand-navy">{c.occupied}/{c.total}</span>
                  </div>
                  <Bar value={c.occupied} total={c.total} />
                </div>
              ))}
            </ChartCard>
            <ChartCard title="Demand mix">
              <div className="space-y-3 pt-1">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-600">Account</span>
                    <span className="font-semibold text-brand-navy">{a.demand.account}</span>
                  </div>
                  <Bar value={a.demand.account} total={a.demand.account + a.demand.walkIn} />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-gray-600">Walk-in</span>
                    <span className="font-semibold text-brand-navy">{a.demand.walkIn}</span>
                  </div>
                  <Bar value={a.demand.walkIn} total={a.demand.account + a.demand.walkIn} />
                </div>
              </div>
            </ChartCard>
          </div>
        </Section>

        {sections.map((s) => (
          <Section
            key={s.id}
            id={s.id}
            icon={s.icon}
            eyebrow={s.eyebrow}
            title={s.title}
            kpi={s.kpi}
            open={open.has(s.id)}
            onToggle={toggle}
          >
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
