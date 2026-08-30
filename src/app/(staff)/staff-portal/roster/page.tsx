"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { PORTAL_ROSTER } from "@/data/staff-portal";
import { cn } from "@/lib/cn";

export default function PortalRosterPage() {
  const next = PORTAL_ROSTER.find((r) => r.shift !== "Off");
  return (
    <RoleGuard>
      <PageHeader
        title="Shift Roster"
        description="Two weeks ahead, published by the duty manager."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Next shift" value={next?.date ?? "—"} sub={next ? `${next.shift} · ${next.duty}` : ""} accent />
        <StatCard label="Shifts (next 14 days)" value={PORTAL_ROSTER.filter((r) => r.shift !== "Off").length} sub="Days on duty" />
        <StatCard label="Days off" value={PORTAL_ROSTER.filter((r) => r.shift === "Off").length} sub="Next two weeks" />
        <StatCard label="Earliest start" value="06:00" sub="Front desk pattern" />
      </div>

      <div className="mt-6">
        <Panel title="Next 14 days" description="Times are local; report 15 minutes early.">
          <div className="divide-y divide-gray-100">
            {PORTAL_ROSTER.map((r) => {
              const off = r.shift === "Off";
              return (
                <div key={r.date} className="flex items-center justify-between gap-3 py-3">
                  <span className={cn("text-sm", off ? "text-gray-400" : "font-semibold text-brand-navy")}>
                    {r.date}
                  </span>
                  <span className={cn("text-sm", off ? "text-gray-400" : "text-brand-navy")}>{r.shift}</span>
                  <span className={cn("hidden text-xs sm:block", off ? "text-gray-300" : "text-gray-500")}>
                    {r.duty}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Swap-shift requests will be added once approvals plumbing lands.
      </p>
    </RoleGuard>
  );
}