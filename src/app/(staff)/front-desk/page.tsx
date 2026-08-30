"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { ActionTile } from "@/global/components/ui/ActionTile";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

const ARRIVALS = [
  { guest: "Ama Serwaa", room: 412, time: "12:30", ref: "BK-1042", status: "waiting" },
  { guest: "Daniel Boadu", room: 218, time: "13:00", ref: "BK-1035", status: "due" },
  { guest: "Grace Mensah", room: 330, time: "14:15", ref: "BK-1021", status: "due" },
  { guest: "Ekow Quartey", room: 501, time: "14:45", ref: "BK-1018", status: "due" },
];

export default function FrontDeskPage() {
  return (
    <RoleGuard allowedRoles={["front_desk"]}>
      <PageHeader
        title="Today Overview"
        description="Front desk start of shift — Sun 30 Aug 2026, 06:00–14:00."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Arrivals today" value={12} sub="2 waiting now" accent />
        <StatCard label="Departures" value={9} sub="5 requested late checkout" />
        <StatCard label="In-house guests" value="47 / 60" sub="Units occupied" />
        <StatCard
          label="Occupancy"
          value="78%"
          trend={{ label: "+4% vs same day last week", positive: true }}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Arrivals this hour"
          description="Guests expected to check in shortly."
          action={<StatusBadge tone="gold">4 pending</StatusBadge>}
        >
          <div className="divide-y divide-gray-100">
            {ARRIVALS.map((a) => (
              <div key={a.ref} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-navy">
                    {a.guest} <span className="font-normal text-gray-400">· Room {a.room}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Ref {a.ref} · Arrival {a.time}
                  </p>
                </div>
                <StatusBadge tone={a.status === "waiting" ? "amber" : "neutral"}>
                  {a.status === "waiting" ? "Waiting" : "Due"}
                </StatusBadge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Quick actions"
          description="Frequently used front desk tasks."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ActionTile
              label="Guest Lookup"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              }
              href="/front-desk/lookup/"
            />
            <ActionTile
              label="Walk-in Booking"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              }
              href="/front-desk/walk-in/"
            />
            <ActionTile
              label="Check-in"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              }
              href="/front-desk/check-in/"
            />
            <ActionTile
              label="Record Payment"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <path d="M1 10h22" />
                </svg>
              }
              href="/front-desk/payments/"
            />
            <ActionTile
              label="Room Rack"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
                </svg>
              }
              href="/front-desk/rack/"
            />
            <ActionTile
              label="Guest Messages"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              }
              href="/front-desk/inbox/"
            />
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Deeper modules (lookup, payments, room rack, inbox) are queued next — the
        tiles above will light up as those screens ship.
      </p>
    </RoleGuard>
  );
}