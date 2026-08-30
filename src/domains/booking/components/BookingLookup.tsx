"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { BOOKING_PAGE_ROUTES } from "@/domains/booking/constants";
import { cancelGuestBooking, lookupGuestBooking } from "@/domains/guests/api";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TONE,
  CANCELABLE_STATUSES,
  type GuestBooking,
} from "@/domains/guests/types";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatMoney, formatShortDate } from "@/lib/formatters";

export function BookingLookup() {
  const [ref, setRef] = useState("");
  const [pin, setPin] = useState("");
  const [searching, setSearching] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [booking, setBooking] = useState<GuestBooking | null>(null);

  const [showCancel, setShowCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function onLookup(e: FormEvent) {
    e.preventDefault();
    const refValue = ref.trim().toUpperCase();
    const pinValue = pin.trim();
    if (!refValue || !pinValue) {
      setLookupError("Enter both the reference and the PIN from your confirmation.");
      return;
    }
    setSearching(true);
    setLookupError(null);
    setCancelError(null);
    setShowCancel(false);
    try {
      const found = await lookupGuestBooking(refValue, pinValue);
      setBooking(found);
    } catch (err) {
      setBooking(null);
      setLookupError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "We could not look up that reservation."
      );
    } finally {
      setSearching(false);
    }
  }

  async function onSubmitCancel(e: FormEvent) {
    e.preventDefault();
    setCancelError(null);
    if (!booking) return;
    setBusy(true);
    try {
      const updated = await cancelGuestBooking(booking.ref, pin.trim());
      setBooking(updated);
      setShowCancel(false);
    } catch (err) {
      setCancelError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "Could not cancel this booking."
      );
    } finally {
      setBusy(false);
    }
  }

  const cancelable = !!booking && CANCELABLE_STATUSES.includes(booking.status);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-brand-navy">
          Find Your Booking
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-gray-600">
          Reserved as a guest without an account? Enter the reference and
          cancellation PIN from your confirmation to view your stay or cancel
          it online.
        </p>
      </div>

      <Panel className="mt-8">
        <form onSubmit={onLookup} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="lookup-ref"
                className="block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Reference
              </label>
              <input
                id="lookup-ref"
                value={ref}
                onChange={(e) => setRef(e.target.value.toUpperCase())}
                placeholder="HT-9001"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold tracking-wider text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>
            <div>
              <label
                htmlFor="lookup-pin"
                className="block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                PIN
              </label>
              <input
                id="lookup-pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-sm font-semibold tracking-[0.4em] text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
            </div>
          </div>

          {lookupError && (
            <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {lookupError}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={searching || !ref.trim() || !pin.trim()}
              className="btn-sheen flex-1 rounded-lg bg-brand-gold px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-goldLight disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? "Looking up\u2026" : "Find my reservation"}
            </button>
            <Link
              href={BOOKING_PAGE_ROUTES.select}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-brand-navy no-underline transition-colors hover:bg-surface-muted"
            >
              Start a new booking
            </Link>
          </div>
        </form>
      </Panel>

      {booking && (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <StatCard
            label="Stay"
            value={`${formatShortDate(booking.checkIn)} \u2192 ${formatShortDate(booking.checkOut)}`}
            sub={`${booking.nights} night${booking.nights > 1 ? "s" : ""} \u00b7 ${booking.guests} guest${booking.guests > 1 ? "s" : ""}`}
            accent
          />
          <StatCard
            label="Total (incl. taxes)"
            value={formatMoney(booking.total, "GHS", "en-GH")}
            sub={booking.roomCategory}
          />
        </div>

        <Panel className="mt-6" title={`Reservation ${booking.ref}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-brand-navy">
              {booking.roomCategory}
              {booking.planTitle ? (
                <>
                  {" "}
                  {"\u00b7"} {booking.planTitle}
                </>
              ) : null}
            </p>
            <StatusBadge tone={BOOKING_STATUS_TONE[booking.status]}>
              {BOOKING_STATUS_LABELS[booking.status]}
            </StatusBadge>
          </div>

          <ol className="mt-5 space-y-4">
            {booking.events.map((ev, i) => (
              <li
                key={`${ev.at}-${i}`}
                className="relative border-l border-gray-100 pl-4"
              >
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-brand-gold bg-white" />
                <p className="text-sm font-semibold text-brand-navy">{ev.label}</p>
                <p className="text-xs text-gray-500">
                  {ev.note ?? formatShortDate(ev.at)}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-5 border-t border-surface-muted pt-4">
            {cancelable ? (
              <>
                <p className="text-sm text-gray-600">
                  This booking can be cancelled online with its PIN. Refunds
                  depend on how much notice you give before check-in.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCancelError(null);
                    setShowCancel((v) => !v);
                  }}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Cancel this booking
                </button>

                {showCancel && (
                  <form
                    onSubmit={onSubmitCancel}
                    className="mt-4 rounded-xl border border-red-100 bg-red-50/60 p-4"
                  >
                    <p className="text-sm text-gray-600">
                      You&apos;ll need the PIN from your confirmation to cancel{" "}
                      <strong className="text-brand-navy">{booking.ref}</strong>.
                    </p>
                    <input
                      type="password"
                      inputMode="numeric"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Booking PIN \u2022\u2022\u2022\u2022"
                      className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-lg font-semibold tracking-[0.5em] text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                    />
                    {cancelError && (
                      <p className="mt-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-medium text-red-600">
                        {cancelError}
                      </p>
                    )}
                    <div className="mt-3 flex gap-3">
                      <button
                        type="submit"
                        disabled={busy || !pin.trim()}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                      >
                        {busy ? "Cancelling\u2026" : "Confirm cancellation"}
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
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <Icon name="check" className="h-4 w-4" />
                    Cancelled — refund of {booking.cancellation.refundPercent}% (
                    {formatMoney(booking.cancellation.refundAmount, "GHS", "en-GH")})
                  </div>
                )}
              </>
            ) : (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Icon name="shield" className="h-4 w-4 text-gray-400" />
                This reservation is no longer cancellable online.
              </p>
            )}
          </div>
        </Panel>
        </>
      )}
    </div>
  );
}