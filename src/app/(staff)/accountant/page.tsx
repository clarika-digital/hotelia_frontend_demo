"use client";

import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";

const APPROVALS = [
  {
    ref: "PYM-8841",
    guest: "Ama Serwaa",
    method: "Mobile Money",
    amount: "GHS 1,250",
    age: "38 min",
  },
  {
    ref: "PYM-8839",
    guest: "Daniel Boadu",
    method: "Card / POS",
    amount: "GHS 3,480",
    age: "52 min",
  },
  {
    ref: "PYM-8836",
    guest: "John Smith",
    method: "Cash",
    amount: "GHS 940",
    age: "1 h 10 min",
  },
];

export default function AccountantPage() {
  return (
    <RoleGuard allowedRoles={["accountant"]}>
      <PageHeader
        title="Payments Overview"
        description="Approvals waiting on the accountant, oldest first."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending approvals" value={3} sub="Oldest 38 min ago" accent />
        <StatCard
          label="Collected today"
          value="GHS 18,450"
          trend={{ label: "+12% vs yesterday", positive: true }}
        />
        <StatCard label="Refunds in flight" value={2} sub="1 requires manager sign-off" />
        <StatCard label="FX conversions" value={6} sub="USD · EUR · GBP today" />
      </div>

      <div className="mt-6">
        <Panel
          title="Approval queue"
          description="Pending payments awaiting your approval."
          action={<StatusBadge tone="amber">3 oldest-first</StatusBadge>}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="py-2 pr-4 font-semibold">Reference</th>
                  <th className="py-2 pr-4 font-semibold">Guest</th>
                  <th className="py-2 pr-4 font-semibold">Method</th>
                  <th className="py-2 pr-4 font-semibold">Amount</th>
                  <th className="py-2 pr-4 font-semibold">Age</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {APPROVALS.map((p) => (
                  <tr key={p.ref}>
                    <td className="py-3 pr-4 font-medium text-brand-navy">{p.ref}</td>
                    <td className="py-3 pr-4 text-brand-navy">{p.guest}</td>
                    <td className="py-3 pr-4 text-gray-600">{p.method}</td>
                    <td className="py-3 pr-4 font-semibold text-brand-navy">{p.amount}</td>
                    <td className="py-3 pr-4 text-gray-500">{p.age}</td>
                    <td className="py-3">
                      <StatusBadge tone="amber">Awaiting approval</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Approve / reject actions, the invoice list, and the refund calculator are
        the next accountant screens after this landing.
      </p>
    </RoleGuard>
  );
}