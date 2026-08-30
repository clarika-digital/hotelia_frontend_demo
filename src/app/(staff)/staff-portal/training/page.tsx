"use client";

import { PORTAL_TRAINING } from "@/data/staff-portal";
import { Icon } from "@/global/components/ui/Icon";
import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

export default function PortalTrainingPage() {
  const completed = PORTAL_TRAINING.filter((t) => t.status === "completed").length;
  const inProgress = PORTAL_TRAINING.find((t) => t.status === "in-progress");
  return (
    <RoleGuard>
      <PageHeader
        title="Training & Certifications"
        description="Courses completed, in flight and coming up."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Completed courses" value={completed} sub={`${PORTAL_TRAINING.length} tracked`} accent />
        <StatCard label="In progress" value={inProgress ? 1 : 0} sub={inProgress ? inProgress.title : ""} />
        <StatCard label="Certifications held" value={3} sub="Service · payments · escalation" />
        <StatCard label="Upcoming" value={1} sub="Fire & evacuation marshal" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Completed" description="With completion date and certificate status.">
          <div className="divide-y divide-gray-100">
            {PORTAL_TRAINING.filter((t) => t.status === "completed").map((t) => (
              <div key={t.title} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-navy">{t.title}</p>
                    <p className="text-xs text-gray-500">Completed {t.completed}</p>
                  </div>
                </div>
                <StatusBadge tone="green">Certified</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="In progress" description="Pick up where you left off.">
            {inProgress && (
              <div>
                <p className="text-sm font-semibold text-brand-navy">{inProgress.title}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-brand-gold"
                    style={{ width: `${inProgress.progress}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500">{inProgress.progress}% complete</p>
              </div>
            )}
          </Panel>

          <Panel title="Upcoming" description="Scheduled by the people team.">
            <div className="flex items-center justify-between gap-3 py-1">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-navy">Fire & evacuation marshal</p>
                <p className="text-xs text-gray-500">Scheduled 18 Sep 2026 · all day</p>
              </div>
              <StatusBadge tone="amber">Upcoming</StatusBadge>
            </div>
          </Panel>
        </div>
      </div>

      <p className={cn("mt-6 text-xs text-gray-400")}>
        Enrolment and certificate downloads land with the backend courses API.
      </p>
    </RoleGuard>
  );
}