"use client";

import { useEffect, useState } from "react";
import { fetchOversightLog } from "@/domains/oversight/api";
import type { AuditEntry } from "@/domains/oversight/types";
import { ApiError } from "@/global/api/client";
import { Icon, type IconName } from "@/global/components/ui/Icon";
import { Panel } from "@/global/components/ui/Panel";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatShortDate } from "@/lib/formatters";

function actionIcon(action: string): IconName {
  if (action.startsWith("Override")) return "shield-check";
  if (action.startsWith("Whitelist")) return "shield";
  if (action.includes("revok")) return "shield-check";
  return "history";
}

export function OversightLogPanel() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const log = await fetchOversightLog();
        if (!cancelled) setEntries(log);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.detail ?? err.title
              : "Could not load the oversight log."
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
    return <Panel title="Isolated super-admin audit trail" description="Exclusive record of console changes (also visible to guest aptitude) [FR-020, T-ADM-01]."><p className="py-6 text-center text-sm text-gray-500">Loading audit trail\u2026</p></Panel>;
  }

  return (
    <Panel
      title="Isolated super-admin audit trail"
      description="Every override, exemption, and revocation with actor attribution [FR-020, T-ADM-01]."
    >
      {error && (
        <p className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
      <div className="relative">
        <div className="absolute bottom-0 left-[5px] top-0 w-px bg-gray-200" />
        <ol className="space-y-4">
          {entries.map((e) => {
            const IconCmp = actionIcon(e.action);
            return (
              <li key={e.id} className="relative flex gap-4 pl-1">
                <span className="z-10 mt-0.5 grid h-3.5 w-3.5 flex-none place-items-center rounded-full bg-brand-gold ring-4 ring-brand-gold/15" />
                <div className="min-w-0 flex-1 rounded-lg border border-gray-100 bg-gray-50/60 px-3 py-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon name={IconCmp} className="h-4 w-4 text-brand-gold" />
                    <p className="text-sm font-semibold text-brand-navy">
                      {e.action}
                    </p>
                    <StatusBadge tone="neutral">
                      {formatShortDate(e.at)}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">
                    {e.detail}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    By {e.actor} \u00b7 {e.actorRole}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Panel>
  );
}