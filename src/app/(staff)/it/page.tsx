"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

const DEVICES = [
  { device: "Hotelia kiosk — Lobby", role: "Front Desk", token: "Valid", tone: "green" as const },
  { device: "Tablet — Accounts", role: "Accountant", token: "Valid", tone: "green" as const },
  { device: "Housekeeping phone", role: "Housekeeping", token: "Expired", tone: "red" as const },
];

export default function ItPage() {
  return (
    <RoleGuard allowedRoles={["it_manager"]}>
      <PageHeader
        title="Platform Health"
        description="Identity, sessions and devices under IT management."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Staff accounts" value={38} sub="7 touchpoints provisioned" accent />
        <StatCard label="Active sessions" value={41} sub="Last sync minutes ago" />
        <StatCard label="Token refreshes / 24h" value={6} sub="0 failures" />
        <StatCard label="Revoked tokens" value={2} sub="Last 7 days" />
      </div>

      <div className="mt-6">
        <Panel
          title="Device touchpoints"
          description="Provisioned staff and kiosk devices on property."
          action={<StatusBadge tone="green">Healthy</StatusBadge>}
        >
          <div className="divide-y divide-gray-100">
            {DEVICES.map((d) => (
              <div key={d.device} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">{d.device}</p>
                  <p className="text-xs text-gray-500">Used by · {d.role}</p>
                </div>
                <StatusBadge tone={d.tone}>{d.token}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Staff account management, session detail and remote device revoke ship
        after this console landing.
      </p>
    </RoleGuard>
  );
}