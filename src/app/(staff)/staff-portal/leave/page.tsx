"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PORTAL_LEAVE_BALANCES, LEAVE_OPTIONS } from "@/data/staff-portal";
import { ApiError } from "@/global/api/client";
import { RoleGuard } from "@/global/auth/RoleGuard";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { fetchLeaveRequests, submitLeaveRequest } from "@/domains/staff/api";
import { LEAVE_TYPE_LABELS, type LeaveRequest, type LeaveType } from "@/domains/staff/types";

const EMPTY_FORM = { type: "annual" as LeaveType, startDate: "", endDate: "", reason: "" };

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function daysBetween(start: string, end: string): number {
  const s = Date.parse(start);
  const e = Date.parse(end);
  if (!Number.isFinite(s) || !Number.isFinite(e) || e < s) return 0;
  return Math.round((e - s) / 86_400_000) + 1;
}

export default function PortalLeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchLeaveRequests()
      .then(setRequests)
      .catch(() => setError("Could not load your leave history."))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!form.startDate || !form.endDate) {
      setError("Pick a start and end date.");
      return;
    }
    if (form.endDate < form.startDate) {
      setError("End date must be on or after the start date.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await submitLeaveRequest(form);
      setRequests((prev) => [created, ...prev]);
      setSuccess(true);
      setForm({ type: form.type, startDate: "", endDate: "", reason: "" });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail ?? err.title : "Could not submit your request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const previewDays =
    form.startDate && form.endDate && form.endDate >= form.startDate
      ? daysBetween(form.startDate, form.endDate)
      : 0;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const annual = PORTAL_LEAVE_BALANCES[0];

  return (
    <RoleGuard>
      <PageHeader
        title="Leave & Time Off"
        description="Your balances, applications and request history."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Annual leave left" value={`${annual.total - annual.used} / ${annual.total} days`} accent />
        <StatCard label="Sick leave left" value={`${PORTAL_LEAVE_BALANCES[1].total - PORTAL_LEAVE_BALANCES[1].used} / ${PORTAL_LEAVE_BALANCES[1].total} days`} />
        <StatCard label="Pending requests" value={pendingCount} sub={pendingCount ? "Awaiting manager approval" : "None in flight"} />
        <StatCard label="Total taken (FY26)" value={annual.used} sub="Annual + sick" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Apply for leave" description="Requests go to your manager for approval.">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="leave-type" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Leave type
              </label>
              <select
                id="leave-type"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as LeaveType }))}
                className={inputCls}
              >
                {LEAVE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="leave-start" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Start date
                </label>
                <input
                  id="leave-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="leave-end" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  End date
                </label>
                <input
                  id="leave-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="leave-reason" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Reason (optional)
              </label>
              <textarea
                id="leave-reason"
                rows={3}
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Anything your manager should know…"
                className={inputCls}
              />
            </div>

            {previewDays > 0 && (
              <p className="rounded-lg bg-surface-muted px-3 py-2 text-xs font-medium text-brand-navy">
                Requesting {previewDays} day{previewDays > 1 ? "s" : ""} of {LEAVE_TYPE_LABELS[form.type]}.
              </p>
            )}

            {error && (
              <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                Request submitted — it appears in your history as pending.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navyDark disabled:opacity-60"
            >
              {submitting ? "Submitting\u2026" : "Submit request"}
            </button>
          </form>
        </Panel>

        <Panel
          title="Request history"
          description="Seeded history plus anything you submit this session."
          action={<StatusBadge tone="gold">{pendingCount} pending</StatusBadge>}
        >
          {loading ? (
            <p className="py-6 text-center text-sm text-gray-500">Loading history…</p>
          ) : requests.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No requests yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-navy">
                      {LEAVE_TYPE_LABELS[r.type]}
                      <span className="font-normal text-gray-400"> · {r.days} day{r.days > 1 ? "s" : ""}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                      {r.reason ? ` · ${r.reason}` : ""}
                    </p>
                  </div>
                  <StatusBadge
                    tone={r.status === "approved" ? "green" : r.status === "pending" ? "amber" : "neutral"}
                  >
                    {r.status === "approved" ? "Approved" : r.status === "pending" ? "Pending" : "Used"}
                  </StatusBadge>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </RoleGuard>
  );
}