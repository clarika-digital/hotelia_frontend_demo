"use client";

import { PORTAL_REVIEWS } from "@/data/staff-portal";
import { Icon } from "@/global/components/ui/Icon";
import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

function stars(rating: number) {
  return (
    <span className="flex items-center gap-0.5 text-brand-gold">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="star"
          className={i < Math.round(rating) ? "h-4 w-4" : "h-4 w-4 opacity-25"}
        />
      ))}
    </span>
  );
}

export default function PortalReviewsPage() {
  const completed = PORTAL_REVIEWS.filter((r) => r.status === "completed");
  const avg = completed.reduce((s, r) => s + (r.rating ?? 0), 0) / completed.length;
  return (
    <RoleGuard>
      <PageHeader
        title="Performance Reviews"
        description="How you're tracking against goals, review by review."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Average rating" value={avg.toFixed(1)} sub="Across completed reviews" accent />
        <StatCard label="Reviews completed" value={completed.length} sub="Every half year" />
        <StatCard label="Current progress" value="On track" sub="Q2 2026 feedback" />
        <StatCard label="Next review" value="15 Nov 2026" sub="Q4 2026 cycle" />
      </div>

      <div className="mt-6">
        <Panel title="Review history" description="Ratings and summaries from your manager.">
          <div className="divide-y divide-gray-100">
            {PORTAL_REVIEWS.map((r) => (
              <div key={r.period} className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-brand-navy">{r.period}</p>
                    {r.status === "completed" ? stars(r.rating ?? 0) : null}
                  </div>
                  <StatusBadge tone={r.status === "completed" ? "green" : "amber"}>
                    {r.status === "completed" ? "Completed" : "Upcoming"}
                  </StatusBadge>
                </div>
                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-gray-500">
                  {r.status === "upcoming"
                    ? `Scheduled for ${r.scheduledOn}. Self-assessment opens two weeks before.`
                    : r.summary}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </RoleGuard>
  );
}