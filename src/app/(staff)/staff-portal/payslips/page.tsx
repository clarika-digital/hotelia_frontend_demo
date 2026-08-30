"use client";

import { useState } from "react";
import { formatGhs, PORTAL_PAYSLIPS } from "@/data/staff-portal";
import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { cn } from "@/lib/cn";

export default function PortalPayslipsPage() {
  const [selected, setSelected] = useState(PORTAL_PAYSLIPS[0]);
  const gross = selected.earnings.reduce((s, e) => s + e.amount, 0);
  const deductions = selected.deductions.reduce((s, d) => s + d.amount, 0);

  return (
    <RoleGuard>
      <PageHeader
        title="Payslips"
        description="Monthly pay statements from HR & payroll."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Latest take-home" value={formatGhs(PORTAL_PAYSLIPS[0].net)} sub={PORTAL_PAYSLIPS[0].month} accent />
        <StatCard label="Gross vs net" value="GHS 2,800" sub="Gross this month" />
        <StatCard label="Total deductions" value={formatGhs(gross - selected.net)} sub={selected.month} />
        <StatCard label="Payday" value="31 Aug 2026" sub="Into registered account" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <Panel title="Statements" description="Select a month to view.">
          <ul className="space-y-1">
            {PORTAL_PAYSLIPS.map((p) => (
              <li key={p.month}>
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    selected.month === p.month
                      ? "bg-brand-gold/10 font-semibold text-brand-navy"
                      : "text-gray-600 hover:bg-surface-muted"
                  )}
                >
                  <span>{p.month}</span>
                  <span className="text-xs text-gray-400">{formatGhs(p.net)}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={`Statement — ${selected.month}`}
          action={<StatusBadge tone="green">Paid</StatusBadge>}
        >
          <dl className="mb-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-surface-muted p-3">
              <dt className="text-xs uppercase tracking-wide text-gray-500">Gross</dt>
              <dd className="mt-1 font-display text-xl font-bold text-brand-navy">{formatGhs(gross)}</dd>
            </div>
            <div className="rounded-lg bg-surface-muted p-3">
              <dt className="text-xs uppercase tracking-wide text-gray-500">Deductions</dt>
              <dd className="mt-1 font-display text-xl font-bold text-red-600">−{formatGhs(deductions)}</dd>
            </div>
            <div className="rounded-lg bg-surface-muted p-3">
              <dt className="text-xs uppercase tracking-wide text-gray-500">Net pay</dt>
              <dd className="mt-1 font-display text-xl font-bold text-brand-gold">{formatGhs(selected.net)}</dd>
            </div>
          </dl>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">Earnings</h3>
              <div className="divide-y divide-gray-100">
                {selected.earnings.map((e) => (
                  <div key={e.label} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-gray-600">{e.label}</span>
                    <span className="font-semibold text-brand-navy">{formatGhs(e.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">Deductions</h3>
              <div className="divide-y divide-gray-100">
                {selected.deductions.map((d) => (
                  <div key={d.label} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-gray-600">{d.label}</span>
                    <span className="font-semibold text-red-600">−{formatGhs(d.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </RoleGuard>
  );
}