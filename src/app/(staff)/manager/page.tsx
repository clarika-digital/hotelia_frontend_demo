"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

const ATTENTION = [
  { label: "High-priority maintenance", count: 2, detail: "Rooms 405 and 509", tone: "red" as const },
  { label: "Refunds above threshold", count: 1, detail: "PYM-8832 · GHS 6,400", tone: "amber" as const },
  { label: "Escalated guest messages", count: 1, detail: "Conversation #1041", tone: "amber" as const },
];

export default function ManagerPage() {
  return (
    <RoleGuard allowedRoles={["manager"]}>
      <PageHeader
        title="Operational Oversight"
        description="A single view across teams, reservations and escalations."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Occupancy" value="78%" trend={{ label: "+4% WoW", positive: true }} accent />
        <StatCard label="Arrivals / Departures" value="12 / 9" sub="Today" />
        <StatCard label="Open tasks" value={11} sub="Across housekeeping + maintenance" />
        <StatCard label="Pending escalations" value={4} sub="2 need your sign-off" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Needs your attention"
          description="Items routed to management this shift."
        >
          <div className="divide-y divide-gray-100">
            {ATTENTION.map((a) => (
              <div key={a.label} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">{a.label}</p>
                  <p className="text-xs text-gray-500">{a.detail}</p>
                </div>
                <StatusBadge tone={a.tone}>{a.count}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Team snapshot"
          description="Read-level today, updated on a refresh."
        >
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Housekeeping in progress</span>
              <span className="text-sm font-semibold text-brand-navy">3</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Maintenance open work orders</span>
              <span className="text-sm font-semibold text-brand-navy">6</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Guest approvals pending</span>
              <span className="text-sm font-semibold text-brand-navy">3</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Rooms blocked for maintenance</span>
              <span className="text-sm font-semibold text-brand-navy">1</span>
            </div>
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Manager dashboards for maintenance oversight and the role-scoped audit log
        are planned next.
      </p>
    </RoleGuard>
  );
}