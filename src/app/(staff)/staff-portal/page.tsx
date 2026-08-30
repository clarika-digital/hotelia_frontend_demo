"use client";

import Link from "next/link";
import { staffRoleLabel } from "@/data/staff-nav";
import { PAGE_ROUTES, ROLE_LANDING } from "@/domains/auth/constants";
import { RoleGuard } from "@/global/auth/RoleGuard";
import { ActionTile } from "@/global/components/ui/ActionTile";
import { Icon } from "@/global/components/ui/Icon";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { useSessionStore } from "@/stores/session-store";

const LEAVE_HISTORY = [
  { type: "Annual leave", dates: "16–20 Jun 2026", days: 5, status: "approved" as const },
  { type: "Sick leave", dates: "3 Aug 2026", days: 1, status: "used" as const },
  { type: "Annual leave", dates: "22–26 Sep 2026", days: 5, status: "pending" as const },
];

const NOTICES = [
  { title: "August holiday rota published", date: "24 Aug 2026" },
  { title: "New HR noticeboard channel live", date: "18 Aug 2026" },
  { title: "Uniform refresh – collect from Housekeeping", date: "02 Aug 2026" },
];

export default function StaffPortalPage() {
  const claims = useSessionStore((s) => s.claims);
  const roleLabel = staffRoleLabel(claims?.role);
  const backHref = claims?.role ? ROLE_LANDING[claims.role] ?? PAGE_ROUTES.guestLanding : PAGE_ROUTES.guestLanding;

  return (
    <RoleGuard>
      <PageHeader
        title={`Welcome, ${claims?.name?.split(" ")[0] ?? "staff"}`}
        description="Your employment, tenure and benefits at Hotelia."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tenure at Hotelia" value="3 yrs 4 mo" sub="Since 12 Apr 2023" accent />
        <StatCard label="Annual leave" value="12 / 24 days" sub="5 pending approval" />
        <StatCard label="Sick days used" value="2 / 6" sub="Financial year 2026" />
        <StatCard label="Next payday" value="31 Aug 2026" sub="GHS into registered account" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Employment snapshot"
          description="Current details on file with HR."
        >
          <dl className="divide-y divide-gray-100 text-sm">
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Department</dt>
              <dd className="font-semibold text-brand-navy">{roleLabel}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Position</dt>
              <dd className="font-semibold text-brand-navy">
                {claims?.role === "manager" ? "Duty Manager" : claims?.role === "it_manager" ? "IT Manager" : `${roleLabel} Staff`}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Start date</dt>
              <dd className="font-semibold text-brand-navy">12 Apr 2023</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Employment type</dt>
              <dd className="font-semibold text-brand-navy">Full-time</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Manager</dt>
              <dd className="font-semibold text-brand-navy">Mrs. Ama Owusu</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Location</dt>
              <dd className="font-semibold text-brand-navy">Hotelia Accra</dd>
            </div>
          </dl>
        </Panel>

        <Panel
          title="Leave & time off"
          description="Recent requests and current balance."
          action={<StatusBadge tone="gold">12 days left</StatusBadge>}
        >
          <div className="divide-y divide-gray-100">
            {LEAVE_HISTORY.map((l) => (
              <div key={`${l.type}-${l.dates}`} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">{l.type}</p>
                  <p className="text-xs text-gray-500">
                    {l.dates} · {l.days} day{l.days > 1 ? "s" : ""}
                  </p>
                </div>
                <StatusBadge
                  tone={l.status === "approved" ? "green" : l.status === "pending" ? "amber" : "neutral"}
                >
                  {l.status === "approved" ? "Approved" : l.status === "pending" ? "Pending" : "Used"}
                </StatusBadge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Pay & benefits"
          description="What you're on, and when you get paid."
        >
          <dl className="divide-y divide-gray-100 text-sm">
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Monthly base pay</dt>
              <dd className="font-semibold text-brand-navy">GHS 2,800</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Next payday</dt>
              <dd className="font-semibold text-brand-navy">31 Aug 2026</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Pension contribution</dt>
              <dd className="font-semibold text-brand-navy">15% employer</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-gray-500">Benefits</dt>
              <dd className="font-semibold text-brand-navy">Meals · Uniform · Staff rates</dd>
            </div>
          </dl>
        </Panel>

        <Panel
          title="HR notices"
          description="Latest updates from the people team."
        >
          <div className="divide-y divide-gray-100">
            {NOTICES.map((n) => (
              <div key={n.title} className="flex items-center justify-between gap-3 py-3">
                <p className="text-sm font-medium text-brand-navy">{n.title}</p>
                <span className="shrink-0 text-xs text-gray-400">{n.date}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Portal modules" description="Everything in the left menu, one click away.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <ActionTile label="My Profile" href="/staff-portal/profile/" icon={<Icon name="user" className="h-5 w-5" />} />
            <ActionTile label="Tenure & Recognition" href="/staff-portal/tenure/" icon={<Icon name="chart" className="h-5 w-5" />} />
            <ActionTile label="Documents" href="/staff-portal/documents/" icon={<Icon name="inbox" className="h-5 w-5" />} />
            <ActionTile label="Leave & Time Off" href="/staff-portal/leave/" icon={<Icon name="history" className="h-5 w-5" />} />
            <ActionTile label="Shift Roster" href="/staff-portal/roster/" icon={<Icon name="list" className="h-5 w-5" />} />
            <ActionTile label="Payslips" href="/staff-portal/payslips/" icon={<Icon name="wallet" className="h-5 w-5" />} />
            <ActionTile label="Pay Calendar" href="/staff-portal/pay-calendar/" icon={<Icon name="star" className="h-5 w-5" />} />
            <ActionTile label="Benefits" href="/staff-portal/benefits/" icon={<Icon name="shield-check" className="h-5 w-5" />} />
            <ActionTile label="Training & Certifications" href="/staff-portal/training/" icon={<Icon name="key" className="h-5 w-5" />} />
            <ActionTile label="Performance Reviews" href="/staff-portal/reviews/" icon={<Icon name="grid" className="h-5 w-5" />} />
          </div>
        </Panel>
      </div>

      <div className="mt-6 rounded-xl border border-brand-gold/30 bg-brand-gold/5 p-4">
        <p className="text-sm text-brand-navy">
          This is your personal staff portal — HR and tenure details alongside your
          operations work. Return to your{" "}
          <Link
            href={backHref}
            className="font-semibold text-brand-gold underline-offset-2 hover:underline"
          >
            {roleLabel} dashboard
          </Link>{" "}
          at any time.
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Apply for leave and track your requests in Leave & Time Off.
        </p>
      </div>
    </RoleGuard>
  );
}