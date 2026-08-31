"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  addWhitelistEntry,
  fetchOversightUsers,
  fetchWhitelist,
  revokeWhitelistEntry,
} from "@/domains/oversight/api";
import type { OversightUser, WhitelistEntry } from "@/domains/oversight/types";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { Panel } from "@/global/components/ui/Panel";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatShortDate } from "@/lib/formatters";

export function WhitelistPanel() {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [users, setUsers] = useState<OversightUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [scoped, setScoped] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    reason: "",
    start: "21:00",
    end: "06:00",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ws, us] = await Promise.all([
          fetchWhitelist(),
          fetchOversightUsers(),
        ]);
        if (cancelled) return;
        setEntries(ws);
        setUsers(us);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.detail ?? err.title
              : "Could not load the whitelist."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!form.userId) return;
    setBusy(true);
    try {
      await addWhitelistEntry({
        userId: form.userId,
        ...(form.reason.trim() ? { reason: form.reason.trim() } : {}),
        ...(scoped ? { scopedHours: { start: form.start, end: form.end } } : {}),
      });
      setForm((f) => ({ ...f, userId: "", reason: "" }));
      setNotice("Geofence exemption added and isolated to the oversight log.");
      setEntries(await fetchWhitelist());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "Could not add the exemption."
      );
    } finally {
      setBusy(false);
    }
  }

  async function onRevoke(w: WhitelistEntry) {
    const ok = window.confirm(
      `Remove the exception for ${w.userName}? Geofence will be enforced again for their role.`
    );
    if (!ok) return;
    setError(null);
    setNotice(null);
    try {
      await revokeWhitelistEntry(w.id);
      setNotice(`Exception removed for ${w.userName}.`);
      setEntries(await fetchWhitelist());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "Could not remove the exception."
      );
    }
  }

  if (loading) {
    return <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Loading whitelist\u2026</p>;
  }

  const roleLabel = (u: OversightUser) =>
    u.userType === "staff" ? (u.role ?? "staff") : "guest";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel
        title="Geofence exemptions"
        description="Users whose resume/session is exempt from on-premise geofencing [UC-12, FR-012]."
      >
        {error && (
          <p className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
        {notice && (
          <p className="mb-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            {notice}
          </p>
        )}
        {entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            No exemptions currently active.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {entries.map((w) => (
              <div key={w.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-navy">{w.userName}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {w.reason ?? "No reason recorded."} {"\u00b7"}{" "}
                    {formatShortDate(w.createdAt)}
                  </p>
                  {w.scopedHours && (
                    <span className="mt-1 inline-block rounded-full bg-brand-gold/10 px-2 py-0.5 text-[11px] font-semibold text-brand-gold">
                      Scoped {w.scopedHours.start}\u2013{w.scopedHours.end}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRevoke(w)}
                  className="flex-none rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel
        title="Add an exemption"
        description="Optional scoped hours limit the exception to a daily window."
      >
        <form onSubmit={onAdd} className="space-y-4">
          <div>
            <label
              htmlFor="wl-user"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              User
            </label>
            <select
              id="wl-user"
              value={form.userId}
              onChange={(e) =>
                setForm((f) => ({ ...f, userId: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              <option value="">Choose a user\u2026</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} \u2014 {roleLabel(u)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="wl-reason"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Reason
            </label>
            <input
              id="wl-reason"
              value={form.reason}
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
              placeholder="e.g. Night-shift reception from home kiosk"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={scoped}
              onChange={(e) => setScoped(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
            />
            Apply scoped hours only
          </label>

          {scoped && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="wl-start"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  From
                </label>
                <input
                  id="wl-start"
                  type="time"
                  value={form.start}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, start: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              <div>
                <label
                  htmlFor="wl-end"
                  className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Until
                </label>
                <input
                  id="wl-end"
                  type="time"
                  value={form.end}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, end: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !form.userId}
            className="btn-sheen flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-goldLight disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="shield-check" className="h-4 w-4" />
            {busy ? "Adding\u2026" : "Add exemption"}
          </button>
        </form>
      </Panel>
    </div>
  );
}