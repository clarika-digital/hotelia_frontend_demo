"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  fetchOversightOverrides,
  fetchOversightUsers,
  fetchRoleMatrix,
  grantOverride,
  revokeOverride,
} from "@/domains/oversight/api";
import { OVERRIDE_EXPIRY_OPTIONS, expiresFromOption } from "@/domains/oversight/constants";
import type { OversightUser, PermissionOverride } from "@/domains/oversight/types";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { Panel } from "@/global/components/ui/Panel";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatShortDate } from "@/lib/formatters";

function isActive(o: PermissionOverride): boolean {
  return !o.expiresAt || new Date(o.expiresAt).getTime() > Date.now();
}

export function OverridesPanel() {
  const [overrides, setOverrides] = useState<PermissionOverride[]>([]);
  const [users, setUsers] = useState<OversightUser[]>([]);
  const [catalog, setCatalog] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    permission: "",
    expiry: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [os, us, mx] = await Promise.all([
          fetchOversightOverrides(),
          fetchOversightUsers(),
          fetchRoleMatrix(),
        ]);
        if (cancelled) return;
        setOverrides(os);
        setUsers(us);
        setCatalog(mx.catalog);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.detail ?? err.title
              : "Could not load overrides."
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

  async function onGrant(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!form.userId || !form.permission) return;
    const expiresAt = expiresFromOption(form.expiry);
    setBusy(true);
    try {
      await grantOverride({
        userId: form.userId,
        permission: form.permission,
        ...(expiresAt ? { expiresAt } : {}),
      });
      setForm((f) => ({ ...f, userId: "", permission: "" }));
      setNotice("Override granted. It appears only inside this console.");
      setOverrides(await fetchOversightOverrides());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "Could not grant the override."
      );
    } finally {
      setBusy(false);
    }
  }

  async function onRevoke(o: PermissionOverride) {
    const ok = window.confirm(
      `Revoke "${o.permission}" from ${o.userName} immediately?`
    );
    if (!ok) return;
    setError(null);
    setNotice(null);
    try {
      await revokeOverride(o.id);
      setNotice(`Revoked "${o.permission}" from ${o.userName}.`);
      setOverrides(await fetchOversightOverrides());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "Could not revoke the override."
      );
    }
  }

  if (loading) {
    return <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Loading overrides\u2026</p>;
  }

  const roleLabel = (u: OversightUser) =>
    u.userType === "staff" ? (u.role ?? "staff") : "guest";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel
        title="Active overrides"
        description="Every non-standard permission granted beyond a role. Visible only to super admin [UAT 3.6, T-ADM-04]."
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
        {overrides.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">
            No overrides are currently granted.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {overrides.map((o) => {
              const active = isActive(o);
              return (
                <div key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-brand-navy">{o.userName}</p>
                      <code className="rounded bg-brand-gold/10 px-1.5 py-0.5 text-[11px] font-semibold text-brand-gold">
                        {o.permission}
                      </code>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Granted by {o.grantedBy} {"\u00b7"} {formatShortDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-none items-center gap-3">
                    {active ? (
                      o.expiresAt ? (
                        <StatusBadge tone="amber">
                          Until {formatShortDate(o.expiresAt)}
                        </StatusBadge>
                      ) : (
                        <StatusBadge tone="green">No expiry</StatusBadge>
                      )
                    ) : (
                      <StatusBadge tone="neutral">Expired</StatusBadge>
                    )}
                    {active && (
                      <button
                        type="button"
                        onClick={() => onRevoke(o)}
                        className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel
        title="Grant an override"
        description="Beyond-role permission with an optional time-box [UC-11, FR-008, SDLC-08 \u00a73]."
      >
        <form onSubmit={onGrant} className="space-y-4">
          <div>
            <label
              htmlFor="ovr-user"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              User
            </label>
            <select
              id="ovr-user"
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
              htmlFor="ovr-permission"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Permission
            </label>
            <select
              id="ovr-permission"
              value={form.permission}
              onChange={(e) =>
                setForm((f) => ({ ...f, permission: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              <option value="">Choose a permission\u2026</option>
              {catalog.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="ovr-expiry"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Expiry
            </label>
            <select
              id="ovr-expiry"
              value={form.expiry}
              onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              {OVERRIDE_EXPIRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={busy || !form.userId || !form.permission}
            className="btn-sheen flex w-full items-center justify-center gap-2 rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-goldLight disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon name="shield-check" className="h-4 w-4" />
            {busy ? "Granting\u2026" : "Grant override"}
          </button>
        </form>
      </Panel>
    </div>
  );
}