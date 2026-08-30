"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { cancelGuestBooking, fetchGuestBooking } from "@/domains/guests/api";
import { GUEST_PAGE_ROUTES } from "@/domains/guests/constants";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TONE,
  CANCELABLE_STATUSES,
  type GuestBooking,
} from "@/domains/guests/types";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { PageHeader } from "@/global/components/ui/PageHeader";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatMoney, formatShortDate } from "@/lib/formatters";

export default function BookingDetailPage() {
  const params = useParams<{ ref: string }>();
  const ref = typeof params?.ref === "string" ? params.ref : "";
  const [booking, setBooking] = useState<GuestBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showCancel, setShowCancel] = useState(false);
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref) return;
    fetchGuestBooking(ref)
      .then(setBooking)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [ref]);

  const cancelable = !!booking && CANCELABLE_STATUSES.includes(booking.status);

  async function onSubmitCancel(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!booking) return;
    setBusy(true);
    try {
      const updated = await cancelGuestBooking(booking.ref, pin.trim());
      setBooking(updated);
      setShowCancel(false);
      setPin("");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "Could not cancel this booking."
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-gray-500">Loading booking…</p>;
  }

  if (notFound || !booking) {
    return (
      <div className="py-10 text-center">
        <p className="font-display text-xl font-bold text-brand-navy">
          Booking not found
        </p>
        <p className="mt-2 text-sm text-gray-500">
          We couldn&rsquo;t find that reservation on your account.
        </p>
        <Link
          href={GUEST_PAGE_ROUTES.bookings}
          className="mt-4 inline-block text-sm font-semibold text-brand-gold no-underline hover:underline"
        >
          Back to my bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <PageHeader
          title={booking.roomCategory}
          description={`Booking ${booking.ref}`}
          action={
            <StatusBadge tone={BOOKING_STATUS_TONE[booking.status]}>
              {BOOKING_STATUS_LABELS[booking.status]}
            </StatusBadge>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Stay dates" value={`${formatShortDate(booking.checkIn)} → ${formatShortDate(booking.checkOut)}`} sub={`${booking.nights} night${booking.nights > 1 ? "s" : ""}`} accent />
          <StatCard label="Guests" value={booking.guests} sub="Adults on this booking" />
          <StatCard label="Booking total" value={booking.total !== undefined ? formatMoney(booking.total, "GHS", "en-GH") : "—"} sub={booking.cancellation ? `Refunded ${booking.cancellation.refundPercent}%` : "Per your confirmation"} />
          <StatCard label="Status" value={<StatusBadge tone={BOOKING_STATUS_TONE[booking.status]}>{BOOKING_STATUS_LABELS[booking.status]}</StatusBadge>} sub="Stays current as of today" />
        </div>

        <Panel
          title="Booking timeline"
          description="What's happened with this reservation so far."
        >
          <ol className="relative space-y-5 border-l border-gray-100 pl-5">
            {booking.events.map((ev, i) => (
              <li key={`${ev.at}-${i}`} className="relative">
                <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-brand-gold bg-white" />
                <p className="text-sm font-semibold text-brand-navy">{ev.label}</p>
                <p className="text-xs text-gray-500">
                  {formatShortDate(ev.at)}
                  {ev.note ? ` · ${ev.note}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel
          title="Manage your booking"
          description={
            cancelable
              ? "Bookings can be cancelled online using the PIN from your confirmation."
              : "This booking is no longer cancellable online."
          }
        >
          {cancelable ? (
            <>
              <p className="text-sm text-gray-600">
                Cancellation refunds follow our policy, based on notice before
                check-in. Refunds return to the original payment method.
              </p>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setShowCancel((v) => !v);
                }}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Cancel this booking
              </button>

              {showCancel && (
                <form
                  onSubmit={onSubmitCancel}
                  className="mt-5 rounded-xl border border-red-100 bg-red-50/60 p-4"
                >
                  <label
                    htmlFor="cancel-pin"
                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Booking PIN (from your confirmation)
                  </label>
                  <input
                    id="cancel-pin"
                    type="password"
                    inputMode="numeric"
                    autoFocus
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-lg font-semibold tracking-[0.5em] text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  />
                  {error && (
                    <p className="mt-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-medium text-red-600">
                      {error}
                    </p>
                  )}
                  <div className="mt-3 flex gap-3">
                    <button
                      type="submit"
                      disabled={busy || !pin.trim()}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {busy ? "Cancelling…" : "Confirm cancellation"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancel(false)}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-surface-muted"
                    >
                      Keep booking
                    </button>
                  </div>
                </form>
              )}

              {booking.cancellation && (
                <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <Icon name="check" className="h-4 w-4" />
                    Booking cancelled
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    Refund of {booking.cancellation.refundPercent}% (
                    {formatMoney(booking.cancellation.refundAmount, "GHS", "en-GH")}) applies per policy.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="shield" className="h-4 w-4 text-gray-400" />
              {booking.status === "cancelled"
                ? "This booking has already been cancelled."
                : "This reservation is in progress or completed — contact the front desk for changes."}
            </div>
          )}
        </Panel>

        <Panel title="Need help?" description="Our team is happy to assist.">
          <p className="text-sm text-gray-600">
            Call{" "}
            <a href="tel:+233240258378" className="font-semibold text-brand-gold no-underline hover:underline">
              +233 24 025 8378
            </a>{" "}
            or email{" "}
            <a
              href="mailto:reservations@hotelia.test"
              className="font-semibold text-brand-gold no-underline hover:underline"
            >
              reservations@hotelia.test
            </a>
            .
          </p>
        </Panel>
      </div>
    </div>
  );
}