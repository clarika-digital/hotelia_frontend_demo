"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

const RECOMMENDATIONS = [
  { label: "Weekend rate lift", impact: "+8% RevPAR est.", tone: "green" as const, why: "Occupancy trend +4% WoW" },
  { label: "Repeat-guest loyals", impact: "128 guests", tone: "amber" as const, why: "2+ stays in 60 days" },
  { label: "Early-bird breakfast bundle", impact: "Adoption low", tone: "neutral" as const, why: "24% take-rate" },
];

export default function ExecutivePage() {
  return (
    <RoleGuard allowedRoles={["executive"]}>
      <PageHeader
        title="Executive Summary"
        description="High-level performance across the property."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue today" value="GHS 74,300" trend={{ label: "+14% vs YTD avg", positive: true }} accent />
        <StatCard label="Occupancy" value="78%" sub="60-unit property" />
        <StatCard label="ADR" value="GHS 1,240" sub="Room rate" />
        <StatCard label="RevPAR" value="GHS 967" trend={{ label: "+6% MoM", positive: true }} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Recommendations"
          description="Generated from the last 30 days of performance signals."
        >
          <div className="divide-y divide-gray-100">
            {RECOMMENDATIONS.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">{r.label}</p>
                  <p className="text-xs text-gray-500">{r.why}</p>
                </div>
                <StatusBadge tone={r.tone}>{r.impact}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Demand snapshot"
          description="Forward-looking booking pressure."
        >
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Advance bookings (7 days)</span>
              <span className="text-sm font-semibold text-brand-navy">31</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">This weekend occupancy</span>
              <span className="text-sm font-semibold text-brand-navy">84% projected</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Top source market</span>
              <span className="text-sm font-semibold text-brand-navy">Accra</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Repeat guests this month</span>
              <span className="text-sm font-semibold text-brand-navy">22%</span>
            </div>
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Recommendation drill-downs and exportable reports are planned next for
        this console.
      </p>
    </RoleGuard>
  );
}