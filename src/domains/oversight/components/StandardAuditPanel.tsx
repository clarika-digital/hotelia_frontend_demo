"use client";

import { useEffect, useState } from "react";
import { fetchStandardAuditLog } from "@/domains/oversight/api";
import type { AuditEntry } from "@/domains/oversight/types";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { Panel } from "@/global/components/ui/Panel";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatShortDate } from "@/lib/formatters";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StandardAuditPanel() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const log = await fetchStandardAuditLog();
        if (!cancelled) setEntries(log);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.detail ?? err.title
              : "Could not load the audit log."
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

  if (loading) {
    return <Panel title="Standard audit log" description="Operational activity across departments."><p className="py-6 text-center text-sm text-gray-500">Loading audit log\u2026</p></Panel>;
  }

  return (
    <Panel
      title="Standard audit log"
      description="Operational activity across departments. Super admin actions never appear here [FR-019, T-ADM-02]."
    >
      {error && (
        <p className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <th className="pb-2 pr-4 font-semibold">When</th>
              <th className="pb-2 pr-4 font-semibold">Actor</th>
              <th className="pb-2 pr-4 font-semibold">Action</th>
              <th className="pb-2 pr-4 font-semibold">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="whitespace-nowrap py-2.5 pr-4 text-xs text-gray-500">
                  {formatShortDate(e.at)} {"\u00b7"} {formatTime(e.at)}
                </td>
                <td className="whitespace-nowrap py-2.5 pr-4">
                  <span className="font-medium text-brand-navy">{e.actor}</span>{" "}
                  <StatusBadge tone="neutral">{e.actorRole}</StatusBadge>
                </td>
                <td className="py-2.5 pr-4 font-medium text-brand-navy">{e.action}</td>
                <td className="py-2.5 pr-4 text-xs text-gray-600">{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
        <Icon name="shield" className="h-3.5 w-3.5" />
        Read-only legal view \u2014 super admin changes are quarantined to the
        isolated trail.
      </p>
    </Panel>
  );
}