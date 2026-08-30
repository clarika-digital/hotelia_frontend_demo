"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { PORTAL_TENURE } from "@/data/staff-portal";
import { cn } from "@/lib/cn";

const TONE_DOT: Record<string, string> = {
  completed: "bg-gray-300",
  awarded: "bg-brand-gold",
  upcoming: "bg-brand-gold/30",
};

const TONE_LABEL: Record<string, string> = {
  completed: "bg-gray-100 text-gray-600",
  awarded: "bg-brand-gold/10 text-brand-gold",
  upcoming: "bg-gray-100 text-gray-400",
};

export default function PortalTenurePage() {
  const t = PORTAL_TENURE;
  return (
    <RoleGuard>
      <PageHeader
        title="Tenure & Recognition"
        description={`With Hotelia since ${t.started}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Years with Hotelia" value={t.years} sub={`${t.months} months`} accent />
        <StatCard label="Service awards" value={2} sub="2y award · EOTM Jun 25" />
        <StatCard label="Team celebrations" value={3} sub="Milestones this journey" />
        <StatCard label="Next milestone" value="4 yrs" sub="Due 12 Apr 2027" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Service milestones" description="Your journey, year by year.">
          <ol className="relative ml-3 border-l-2 border-gray-100 pb-1 pl-6">
            {t.milestones.map((m) => (
              <li key={m.label} className="relative pb-5 last:pb-0">
                <span
                  className={cn(
                    "absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-white",
                    TONE_DOT[m.tone]
                  )}
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-brand-navy">{m.label}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", TONE_LABEL[m.tone])}>
                    {m.tone === "completed" ? "Reached"
                      : m.tone === "awarded" ? "Awarded"
                      : "Upcoming"}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{m.date}</p>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Recognitions" description="Shout-outs and awards on record.">
          <div className="divide-y divide-gray-100">
            {t.recognitions.map((r) => (
              <div key={r.title} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.detail}</p>
                </div>
                <StatusBadge tone="gold">{r.date}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </RoleGuard>
  );
}