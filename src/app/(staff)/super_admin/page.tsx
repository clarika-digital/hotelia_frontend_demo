"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { ActionTile } from "@/global/components/ui/ActionTile";
import { Icon, type IconName } from "@/global/components/ui/Icon";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

const OVERSIGHT = [
  { label: "Permission overrides active", count: 2, detail: "2 accounts", tone: "amber" as const },
  { label: "Geofence whitelist", count: 3, detail: "executive · super_admin · kiosk", tone: "green" as const },
  { label: "Recent escalations", count: 4, detail: "All resolved", tone: "neutral" as const },
];

const DOMAINS: { label: string; icon: IconName }[] = [
  { label: "Reception", icon: "key" },
  { label: "Finance", icon: "wallet" },
  { label: "Housekeeping", icon: "list" },
  { label: "Maintenance", icon: "wrench" },
  { label: "Management", icon: "shield" },
  { label: "IT & Platforms", icon: "users" },
  { label: "Executive", icon: "chart" },
];

export default function SuperAdminPage() {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <PageHeader
        title="Oversight Dashboard"
        description="Full access across every role — categorised in one place."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered users" value={87} sub="48 guests · 38 staff · 1 admin" accent />
        <StatCard label="Active sessions" value={41} sub="Includes kiosk" />
        <StatCard label="Permission overrides" value={2} trend={{ label: "Review recommended", positive: false }} />
        <StatCard label="Geofence exemptions" value={3} sub="Roles, not devices" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="All domains"
          description="Every role's surface, represented under one console."
        >
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {DOMAINS.map((d) => (
              <ActionTile
                key={d.label}
                label={d.label}
                icon={
                  <Icon name={d.icon} className="h-5 w-5" />
                }
                disabled
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Each domain opens that role's full module set — queued after the
            domain consoles themselves.
          </p>
        </Panel>

        <Panel
          title="Current overrides"
          description="Non-standard permissions active across the system."
        >
          <div className="divide-y divide-gray-100">
            {OVERSIGHT.map((o) => (
              <div key={o.label} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">{o.label}</p>
                  <p className="text-xs text-gray-500">{o.detail}</p>
                </div>
                <StatusBadge tone={o.tone}>{o.count}</StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Role matrix"
          description="Exempt and geofence-required roles in force."
        >
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Geofence required</span>
              <span className="text-sm font-medium text-brand-navy">
                front_desk · accountant · housekeeping · maintenance · manager · it_manager
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Geofence exempt</span>
              <span className="text-sm font-medium text-brand-navy">
                executive · super_admin
              </span>
            </div>
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Permission override management, the geofence whitelist UI and the
        system-wide oversight log are the next super_admin screens.
      </p>
    </RoleGuard>
  );
}