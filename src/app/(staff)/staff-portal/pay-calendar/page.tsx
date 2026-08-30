"use client";

import { NEXT_PAYDAY, PORTAL_PAY_CALENDAR } from "@/data/staff-portal";
import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

export default function PortalPayCalendarPage() {
  return (
    <RoleGuard>
      <PageHeader
        title="Pay Calendar"
        description="Scheduled pay days and the countdown to your next salary."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Next payday" value={NEXT_PAYDAY.date} sub={NEXT_PAYDAY.label} accent />
        <StatCard label="Days to payday" value={1} sub="Funds land by end of day" />
        <StatCard label="Payment frequency" value="Monthly" sub="Last working day" />
        <StatCard label="Payment method" value="Bank transfer" sub="Registered account" />
      </div>

      <div className="mt-6">
        <Panel title="Upcoming paydays" description="Salary for the month shown left of each date.">
          <div className="divide-y divide-gray-100">
            {PORTAL_PAY_CALENDAR.map((p) => (
              <div key={p.date} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">{p.label}</p>
                  <p className="text-xs text-gray-500">Salary credited on {p.date}</p>
                </div>
                <StatusBadge tone={p.status === "upcoming" ? "gold" : "neutral"}>
                  {p.status === "upcoming" ? "Upcoming" : "Paid"}
                </StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </RoleGuard>
  );
}