"use client";

import { PORTAL_BENEFITS } from "@/data/staff-portal";
import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

export default function PortalBenefitsPage() {
  const enrolled = PORTAL_BENEFITS.filter((b) => b.status === "enrolled").length;
  return (
    <RoleGuard>
      <PageHeader
        title="Benefits"
        description="Everything you're entitled to as a Hotelia staff member."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active benefits" value={enrolled} sub={`${PORTAL_BENEFITS.length} in total`} accent />
        <StatCard label="In progress" value={PORTAL_BENEFITS.length - enrolled} sub="1 enrolling" />
        <StatCard label="Pension contribution" value="15%" sub="Employer, SSNIT" />
        <StatCard label="Accommodation discount" value="Up to 30%" sub="Personal stays" />
      </div>

      <div className="mt-6">
        <Panel title="Your benefits" description="Rolled out at start of tenure.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PORTAL_BENEFITS.map((b) => (
              <div key={b.title} className="flex flex-col rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-brand-navy">{b.title}</p>
                  <StatusBadge tone={b.status === "enrolled" ? "green" : "amber"}>
                    {b.status === "enrolled" ? "Active" : "Enrolling"}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{b.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </RoleGuard>
  );
}