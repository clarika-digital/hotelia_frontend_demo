"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchGuestBookings } from "@/domains/guests/api";
import { GUEST_PAGE_ROUTES } from "@/domains/guests/constants";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TONE,
  type GuestBooking,
} from "@/domains/guests/types";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatMoney, formatShortDate } from "@/lib/formatters";

export default function AccountBookingsPage() {
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchGuestBookings()
      .then(setBookings)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <PageHeader
        title="My bookings"
        description="Your reservation history at Hotelia."
      />

      <Panel title="Booking history">
        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">Loading bookings…</p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-red-600">
            Could not load your bookings.
          </p>
        ) : sorted.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No bookings yet — plan your stay with us soon.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {sorted.map((b) => (
              <Link
                key={b.id}
                href={`${GUEST_PAGE_ROUTES.bookings}${b.ref}/`}
                className="flex items-center justify-between gap-4 py-4 no-underline transition-colors hover:bg-surface-muted/60"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-brand-navy">
                      {b.roomCategory}
                    </p>
                    <span className="text-xs font-medium text-gray-400">{b.ref}</span>
                    <StatusBadge tone={BOOKING_STATUS_TONE[b.status]}>
                      {BOOKING_STATUS_LABELS[b.status]}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatShortDate(b.checkIn)} → {formatShortDate(b.checkOut)} ·{" "}
                    {b.nights} night{b.nights > 1 ? "s" : ""} · {b.guests} guest
                    {b.guests > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-brand-navy">
                    {b.total !== undefined ? formatMoney(b.total, "GHS", "en-GH") : "—"}
                  </p>
                  {b.cancellation && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      Refunded {b.cancellation.refundPercent}%
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}