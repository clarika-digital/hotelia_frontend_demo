"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  decideApproval,
  fetchAccountantOverview,
} from "@/domains/accounting/api";
import type {
  AccountantSnapshot,
  ApprovalItem,
  InvoiceItem,
  MethodSplit,
  PaymentMethod,
  RefundItem,
} from "@/domains/accounting/types";
import { ApiError } from "@/global/api/client";
import { Icon, type IconName } from "@/global/components/ui/Icon";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import {
  Bar,
  ChartCard,
  Donut,
  Section,
  StatCell,
  TrendBars,
} from "@/global/components/ui/charts";
import { formatMoney } from "@/lib/formatters";
import { cn } from "@/lib/cn";

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  card: "Card / POS",
  momo: "Mobile Money",
};

const METHOD_COLORS: Record<PaymentMethod, string> = {
  cash: "#15803d",
  card: "#223047",
  momo: "#876a20",
};

function ageLabel(iso: string): string {
  const min = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

interface OverviewSection {
  id: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  kpi: string;
  children: ReactNode;
}

function MethodDonut({ data }: { data: MethodSplit[] }) {
  return (
    <Donut
      data={data.map((m) => ({
        label: METHOD_LABELS[m.method],
        value: m.amount,
        color: METHOD_COLORS[m.method],
      }))}
      size={120}
      thickness={16}
    />
  );
}

function ApprovalRow({
  a,
  onDecide,
  busy,
}: {
  a: ApprovalItem;
  onDecide: (id: string, action: "approve" | "reject") => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
      <div className="min-w-0 flex-1 basis-40">
        <p className="truncate text-xs font-semibold text-brand-navy">
          {a.ref} · {a.guest}
        </p>
        <p className="text-[11px] text-gray-500">
          {METHOD_LABELS[a.method]} · {ageLabel(a.createdAt)} ago
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs font-semibold text-brand-navy">
          {formatMoney(a.amount, "GHS", "en-GH")}
        </p>
      </div>
      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={busy}
          onClick={() => onDecide(a.id, "approve")}
          className="rounded-md bg-green-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onDecide(a.id, "reject")}
          className="rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function RefundRow({ r }: { r: RefundItem }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
      <div className="min-w-0 basis-40">
        <p className="truncate text-xs font-semibold text-brand-navy">{r.ref} · {r.guest}</p>
        <p className="text-[11px] text-gray-500">{ageLabel(r.createdAt)} ago</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-brand-navy">
          {formatMoney(r.amount, "GHS", "en-GH")}
        </span>
        <StatusBadge tone={r.status === "paid" ? "green" : r.status === "manager_sign_off" ? "amber" : "neutral"}>
          {r.status === "manager_sign_off" ? "Needs sign-off" : r.status}
        </StatusBadge>
      </div>
    </div>
  );
}

function InvoiceRow({ i }: { i: InvoiceItem }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2">
      <div className="min-w-0 basis-40">
        <p className="truncate text-xs font-semibold text-brand-navy">{i.ref} · {i.guest}</p>
        <p className="text-[11px] text-gray-500">Due {i.dueDate}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-brand-navy">
          {formatMoney(i.amount, "GHS", "en-GH")}
        </span>
        <StatusBadge tone={i.status === "paid" ? "green" : i.status === "overdue" ? "red" : "neutral"}>
          {i.status}
        </StatusBadge>
      </div>
    </div>
  );
}

export function AccountantOverview() {
  const [snapshot, setSnapshot] = useState<AccountantSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(["charts", "approvals", "collections", "reconciliation"])
  );

  const refresh = useCallback(async () => {
    try {
      const snap = await fetchAccountantOverview();
      setSnapshot(snap);
      setError(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail ?? err.title : "Could not load the payments overview."
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await fetchAccountantOverview();
        if (!cancelled) setSnapshot(snap);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.detail ?? err.title : "Could not load the payments overview."
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function onDecide(id: string, action: "approve" | "reject") {
    setBusyId(id);
    try {
      await decideApproval(id, action);
      await refresh();
    } catch {
      setError("Could not update that approval.");
    } finally {
      setBusyId(null);
    }
  }

  if (!snapshot && !error) {
    return (
      <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Loading payments overview…
      </p>
    );
  }

  if (error && !snapshot) {
    return (
      <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
        {error}
      </p>
    );
  }

  const a = snapshot;
  if (!a) return null;

  const k = a.kpis;

  const sections: OverviewSection[] = [
    {
      id: "approvals",
      icon: "alert-triangle",
      eyebrow: "Approvals",
      title: "Approval Queue",
      kpi: String(k.pendingApprovals),
      children: (
        <div className="space-y-2">
          {a.approvals
            .filter((ap) => ap.status === "pending")
            .map((ap) => (
              <ApprovalRow key={ap.id} a={ap} onDecide={onDecide} busy={busyId === ap.id} />
            ))}
          {a.approvals.filter((ap) => ap.status === "pending").length === 0 && (
            <p className="px-1 py-4 text-center text-xs text-gray-400">
              Approval queue is clear.
            </p>
          )}
        </div>
      ),
    },
    {
      id: "collections",
      icon: "wallet",
      eyebrow: "Collections",
      title: "Collections by Method",
      kpi: formatMoney(k.collectedToday, "GHS", "en-GH"),
      children: (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Today by method
            </p>
            <MethodDonut data={a.collections.todayByMethod} />
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Last 7 days
            </p>
            <TrendBars
              buckets={a.collections.trend7d.map((b) => ({ label: b.date, amount: b.amount }))}
            />
          </div>
        </div>
      ),
    },
    {
      id: "refunds",
      icon: "wrench",
      eyebrow: "Refunds",
      title: "Refunds In Flight",
      kpi: String(k.refundsInFlight),
      children: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCell label="In flight" value={String(k.refundsInFlight)} />
            <StatCell label="Sign-off required" value={String(k.refundsRequiringSignOff)} />
          </div>
          <div className="space-y-2">
            {a.refunds.map((r) => (
              <RefundRow key={r.id} r={r} />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "invoices",
      icon: "inbox",
      eyebrow: "Receivables",
      title: "Invoices & Outstanding",
      kpi: formatMoney(k.outstandingValue, "GHS", "en-GH"),
      children: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCell label="Outstanding" value={String(k.outstandingInvoices)} />
            <StatCell label="Overdue" value={String(k.overdueInvoices)} />
            {a.invoices
              .filter((i) => i.status !== "paid")
              .slice(0, 2)
              .map((i) => (
                <StatCell key={i.ref} label={i.status === "overdue" ? "Overdue amount" : "Largest open"} value={formatMoney(i.amount, "GHS", "en-GH")} />
              ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Open / overdue</p>
              {a.invoices
                .filter((i) => i.status !== "paid")
                .slice(0, 4)
                .map((i) => (
                  <InvoiceRow key={i.id} i={i} />
                ))}
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Open value</p>
              {a.invoices
                .filter((i) => i.status !== "paid")
                .map((i) => (
                  <div key={i.id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="truncate text-gray-600">{i.ref}</span>
                      <span className="font-semibold text-brand-navy">
                        {formatMoney(i.amount, "GHS", "en-GH")}
                      </span>
                    </div>
                    <Bar value={i.amount} total={k.outstandingValue} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "reconciliation",
      icon: "check",
      eyebrow: "Reconciliation",
      title: "Daily Reconciliation",
      kpi: `${k.reconciliationVariance >= 0 ? "✓" : "✕"} ${formatMoney(Math.abs(k.reconciliationVariance), "GHS", "en-GH")}`,
      children: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Expected" value={formatMoney(a.reconciliation.expected, "GHS", "en-GH")} />
            <StatCard label="Settled" value={formatMoney(a.reconciliation.settled, "GHS", "en-GH")} />
            <StatCell label="Variance" value={formatMoney(a.reconciliation.variance, "GHS", "en-GH")} />
            <StatCell label="FX conversions" value={String(k.fxConversions)} />
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium",
              a.reconciliation.variance === 0
                ? "border-green-100 bg-green-50 text-green-700"
                : "border-red-100 bg-red-50 text-red-700"
            )}
          >
            <Icon name={a.reconciliation.variance === 0 ? "check" : "alert-triangle"} className="h-4 w-4" />
            {a.reconciliation.variance === 0
              ? "Today balances — no variance to chase."
              : `Today is off by ${formatMoney(Math.abs(a.reconciliation.variance), "GHS", "en-GH")}. Review unsettled settlements.`}
          </div>
        </div>
      ),
    },
  ];

  const methodSplitForTop = a.collections.todayByMethod.slice(0, 4);

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending approvals" value={String(k.pendingApprovals)} sub={`${k.pendingApprovalsValue > 0 ? formatMoney(k.pendingApprovalsValue, "GHS", "en-GH") : "—"} awaiting · oldest ${k.oldestApprovalAgeMin} min ago`} accent />
        <StatCard label="Collected today" value={formatMoney(k.collectedToday, "GHS", "en-GH")} sub="Across cash · card · Momo" />
        <StatCard label="Refunds in flight" value={String(k.refundsInFlight)} sub={`${k.refundsRequiringSignOff} need manager sign-off`} />
        <StatCard label="Outstanding (AR)" value={formatMoney(k.outstandingValue, "GHS", "en-GH")} sub={`${k.overdueInvoices} overdue invoices`} />
      </div>

      <div className="mt-4 space-y-3">
        <Section id="charts" icon="chart" eyebrow="Analytics" title="Payments Dashboard" kpi={formatMoney(k.collectedToday, "GHS", "en-GH")} open={open.has("charts")} onToggle={toggle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartCard title="Collections by method">
              {methodSplitForTop.length > 0 ? (
                <MethodDonut data={methodSplitForTop} />
              ) : (
                <p className="py-4 text-center text-xs text-gray-400">No collections yet.</p>
              )}
            </ChartCard>
            <ChartCard title="7-day collections">
              <TrendBars buckets={a.collections.trend7d.map((b) => ({ label: b.date, amount: b.amount }))} />
            </ChartCard>
          </div>
        </Section>

        {sections.map((s) => (
          <Section
            key={s.id}
            id={s.id}
            icon={s.icon}
            eyebrow={s.eyebrow}
            title={s.title}
            kpi={s.kpi}
            open={open.has(s.id)}
            onToggle={toggle}
          >
            {s.children}
          </Section>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Icon name="chart" className="h-3.5 w-3.5" />
        Live snapshot from current mock state — approval decisions are tracked in the audit log.
      </p>
    </div>
  );
}
