"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

const TASKS = [
  { room: 214, task: "Full clean", assigned: "Akosua", status: "needs-cleaning" },
  { room: 318, task: "Turn-down + towels", assigned: "—", status: "needs-cleaning" },
  { room: 405, task: "Full clean", assigned: "Akosua", status: "in-progress" },
  { room: 502, task: "Make-up clean", assigned: "Efua", status: "in-progress" },
  { room: 221, task: "Full clean", assigned: "—", status: "ready" },
];

const STATUS_TONE: Record<string, "amber" | "gold" | "green"> = {
  "needs-cleaning": "amber",
  "in-progress": "gold",
  ready: "green",
};

export default function HousekeepingPage() {
  return (
    <RoleGuard allowedRoles={["housekeeping"]}>
      <PageHeader
        title="Cleaning Board"
        description="Room-status driven tasks for today's shift."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Needs cleaning" value={8} sub="2 high priority" accent />
        <StatCard label="In progress" value={3} sub="2 attendants working" />
        <StatCard label="Clean & ready" value={5} sub="Awaiting inspection" />
        <StatCard label="Available rooms" value={34} sub="Of 60 units" />
      </div>

      <div className="mt-6">
        <Panel
          title="Current tasks"
          description="Docked from live room-status transitions."
          action={<StatusBadge tone="gold">3 active</StatusBadge>}
        >
          <div className="divide-y divide-gray-100">
            {TASKS.map((t) => (
              <div key={t.room} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">
                    Room {t.room} <span className="font-normal text-gray-400">· {t.task}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Assigned: {t.assigned === "—" ? "Unassigned" : t.assigned}
                  </p>
                </div>
                <StatusBadge tone={STATUS_TONE[t.status] ?? "neutral"}>
                  {t.status === "needs-cleaning"
                    ? "Needs cleaning"
                    : t.status === "in-progress"
                      ? "In progress"
                      : "Ready"}
                </StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Start / complete actions and the optional inspection step land with the
        next housekeeping release; this board is current as a read.
      </p>
    </RoleGuard>
  );
}