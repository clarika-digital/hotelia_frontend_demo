"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchGuestProfile, requestGuestExport } from "@/domains/guests/api";
import { GUEST_PAGE_ROUTES } from "@/domains/guests/constants";
import type {
  GuestExportPayload,
  GuestProfile,
} from "@/domains/guests/types";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatMoney, formatShortDate } from "@/lib/formatters";

export default function AccountExportPage() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<GuestExportPayload | null>(null);

  useEffect(() => {
    fetchGuestProfile()
      .then(setProfile)
      .catch(() => setError("Could not load your profile."))
      .finally(() => setLoading(false));
  }, []);

  async function onRequest() {
    setExporting(true);
    setError(null);
    try {
      setPayload(await requestGuestExport());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "Could not prepare your export."
      );
    } finally {
      setExporting(false);
    }
  }

  function onDownload() {
    if (!payload) return;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hotelia-data-${profile?.email ?? "guest"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const complete = profile?.profileComplete ?? false;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <PageHeader
          title="Data & privacy"
          description="Access and export the information Hotelia holds about you."
        />

        {loading ? (
          <Panel>
            <p className="py-6 text-center text-sm text-gray-500">Loading…</p>
          </Panel>
        ) : !complete ? (
          <Panel
            title="Complete your profile first"
            description="Your data export unlocks once your profile is complete."
          >
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Icon name="alert-triangle" className="h-5 w-5 flex-none text-amber-600" />
              <p className="text-sm text-gray-700">
                We need your full name, a valid phone number and your country of
                residence before you can export your data.{" "}
                {profile && profile.missingFields.length > 0 && (
                  <>
                    <span className="font-semibold text-brand-navy">
                      Missing: {profile.missingFields.join(", ")}.
                    </span>
                  </>
                )}
              </p>
            </div>
            <Link
              href={GUEST_PAGE_ROUTES.profile}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-navyDark"
            >
              Complete my profile
            </Link>
          </Panel>
        ) : (
          <Panel
            title="Request your data"
            description="A copy of your profile and reservation history."
            action={<StatusBadge tone="green">Available</StatusBadge>}
          >
            <p className="text-sm text-gray-600">
              Your export includes your profile details and every booking linked
              to this account. No payment card numbers are included.
            </p>

            <button
              type="button"
              onClick={onRequest}
              disabled={exporting}
              className="mt-4 w-full rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navyDark disabled:opacity-60"
            >
              {exporting ? "Preparing your export…" : "Request my data"}
            </button>

            {error && (
              <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </p>
            )}
          </Panel>
        )}
      </div>

      {payload && (
        <Panel
          title="Your export is ready"
          description={`Generated ${formatShortDate(payload.generatedAt)}`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bookings</p>
              <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{payload.totals.count}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nights</p>
              <p className="mt-1 font-display text-2xl font-bold text-brand-navy">{payload.totals.nights}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total spent</p>
              <p className="mt-1 font-display text-2xl font-bold text-brand-navy">
                {formatMoney(payload.totals.totalSpent, "GHS", "en-GH")}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Profile</p>
              <p className="mt-1 truncate font-display text-2xl font-bold text-brand-navy">
                {payload.profile.name.split(" ")[0]}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDownload}
            className="mt-5 w-full rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-goldLight"
          >
            Download JSON
          </button>
        </Panel>
      )}
    </div>
  );
}