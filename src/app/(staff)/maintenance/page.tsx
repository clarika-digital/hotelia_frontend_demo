"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

const REQUESTS = [
  { room: 405, issue: "AC not cooling", priority: "high", status: "open" },
  { room: 312, issue: "Shower pressure low", priority: "normal", status: "in-progress" },
  { room: 118, issue: "Light fitting flickers", priority: "normal", status: "in-progress" },
  { room: 509, issue: "Door lock keypad", priority: "high", status: "open" },
];

export default function MaintenancePage() {
  return (
    <RoleGuard allowedRoles={["maintenance"]}>
      <PageHeader
        title="Maintenance Requests"
        description="Open and in-progress work orders across the property."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open requests" value={6} sub="2 high priority" accent />
        <StatCard label="In progress" value={2} sub="Your active queue" />
        <StatCard label="Completed today" value={4} trend={{ label: "On track", positive: true }} />
        <StatCard label="Rooms blocked" value={1} sub="Room 509 under repair" />
      </div>

      <div className="mt-6">
        <Panel
          title="Work orders"
          description="Priority order, oldest high-priority first."
          action={<StatusBadge tone="red">2 high</StatusBadge>}
        >
          <div className="divide-y divide-gray-100">
            {REQUESTS.map((r) => (
              <div key={`${r.room}-${r.issue}`} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">
                    Room {r.room} <span className="font-normal text-gray-400">· {r.issue}</span>
                  </p>
                  <p className="text-xs text-gray-500">Work order logged by front desk</p>
                </div>
                <div className="flex items-center gap-2">
                  {r.priority === "high" && <StatusBadge tone="red">High</StatusBadge>}
                  <StatusBadge tone={r.status === "in-progress" ? "gold" : "amber"}>
                    {r.status === "in-progress" ? "In progress" : "Open"}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Accept → complete transitions and the block-room-from-booking toggle ship
        with the next maintenance release.
      </p>
    </RoleGuard>
  );
}