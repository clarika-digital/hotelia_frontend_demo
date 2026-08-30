"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BookingStepper } from "./BookingStepper";
import { BOOKING_CONTEXT_KEY, BOOKING_PAGE_ROUTES } from "@/domains/booking/constants";
import { GUEST_PAGE_ROUTES } from "@/domains/guests/constants";
import { fetchGuestBooking, lookupGuestBooking } from "@/domains/guests/api";
import { BOOKING_STATUS_LABELS } from "@/domains/guests/types";
import type { GuestBooking } from "@/domains/guests/types";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { Panel } from "@/global/components/ui/Panel";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatMoney, formatShortDate } from "@/lib/formatters";
import { useSessionStore } from "@/stores/session-store";

function ConfirmationInner() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "";
  const claims = useSessionStore((s) => s.claims);
  const isGuest = claims?.userType === "guest";
  const [booking, setBooking] = useState<GuestBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setError("We could not find that reservation.");
      setLoading(false);
      return;
    }
    if (isGuest) {
      fetchGuestBooking(ref)
        .then(setBooking)
        .catch((err) =>
          setError(
            err instanceof ApiError
              ? err.detail ?? err.title
              : "We could not load your reservation."
          )
        )
        .finally(() => setLoading(false));
      return;
    }
    let stored: { ref: string; pin: string } | null = null;
    try {
      const raw = sessionStorage.getItem(BOOKING_CONTEXT_KEY);
      if (raw) stored = JSON.parse(raw) as { ref: string; pin: string };
    } catch {
      stored = null;
    }
    if (!stored || stored.ref !== ref || !stored.pin) {
      setError(
        "We could not verify this reservation on this device. Look it up anytime with your reference and PIN."
      );
      setLoading(false);
      return;
    }
    lookupGuestBooking(ref, stored.pin)
      .then(setBooking)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.detail ?? err.title
            : "We could not load your reservation."
        )
      )
      .finally(() => setLoading(false));
  }, [ref, isGuest]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center text-gray-500">
        Loading your reservation{"\u2026"}
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <Icon name="alert-triangle" className="mx-auto h-10 w-10 text-amber-500" />
        <p className="mt-4 text-gray-600">
          {error ?? "We could not find that reservation."}
        </p>
        <Link
          href={isGuest ? GUEST_PAGE_ROUTES.bookings : BOOKING_PAGE_ROUTES.find}
          className="mt-4 inline-block font-semibold text-brand-gold no-underline hover:underline"
        >
          {isGuest ? "View my bookings" : "Find your booking"}
        </Link>
      </div>
    );
  }

  const subtotal =
    booking.perNight && booking.nights
      ? booking.perNight * booking.nights
      : booking.total;
  const taxes = booking.total - subtotal;

  return (
    <div className="bg-[#faf9f7]">
      <BookingStepper current={4} />

      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Icon name="check" className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-brand-navy">
            Thank You — Your Reservation Is Pending
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
            We have reserved <strong className="text-brand-navy">{booking.roomCategory}</strong>
            {booking.planTitle ? (
              <>
                {" "}
                on the{" "}
                <strong className="text-brand-navy">{booking.planTitle}</strong>
              </>
            ) : null}{" "}
            for {booking.nights} night{booking.nights !== 1 ? "s" : ""}. Keep your
            reference and PIN ready — the front desk will confirm your stay by
            phone or email shortly.
          </p>
        </div>

        <Panel className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Reference
              </p>
              <p className="font-display text-3xl font-bold text-brand-navy">
                {booking.ref}
              </p>
            </div>
            <StatusBadge tone="amber">
              {BOOKING_STATUS_LABELS[booking.status]}
            </StatusBadge>
          </div>

          <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-surface-muted bg-surface-muted sm:grid-cols-2">
            <div className="bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cancellation PIN
              </p>
              <p className="mt-0.5 font-mono text-2xl font-bold text-brand-gold">
                {booking.pin}
              </p>
            </div>
            <div className="bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Total (incl. taxes)
              </p>
              <p className="mt-0.5 font-display text-2xl font-bold text-brand-navy">
                {formatMoney(booking.total, "GHS", "en-GH")}
              </p>
            </div>
            <div className="bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Stay
              </p>
              <p className="mt-0.5 font-medium text-brand-navy">
                {formatShortDate(booking.checkIn)} {"\u2192"}{" "}
                {formatShortDate(booking.checkOut)}
              </p>
            </div>
            <div className="bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Guests
              </p>
              <p className="mt-0.5 font-medium text-brand-navy">{booking.guests}</p>
            </div>
          </div>

          {booking.perNight ? (
            <div className="mt-5 border-t border-surface-muted pt-4">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-gray-600">
                  {formatMoney(booking.perNight, "GHS", "en-GH")}
                  {booking.nights > 1
                    ? ` \u00d7 ${booking.nights} nights`
                    : " / night"}
                </span>
                <span className="font-medium text-brand-navy">
                  {formatMoney(subtotal, "GHS", "en-GH")}
                </span>
              </div>
              <div className="mt-1.5 flex items-baseline justify-between text-sm">
                <span className="text-gray-600">Tax &amp; service (15%)</span>
                <span className="font-medium text-brand-navy">
                  {formatMoney(taxes, "GHS", "en-GH")}
                </span>
              </div>
            </div>
          ) : null}

          <div className="mt-5 rounded-lg border border-surface-muted bg-surface-muted/50 px-4 py-3 text-xs text-gray-600">
            <span className="font-semibold text-brand-gold">Keep your PIN.</span>{" "}
            You&apos;ll need the reference and PIN to cancel or manage this
            reservation online.{" "}
            {!isGuest && (
              <Link
                href={BOOKING_PAGE_ROUTES.find}
                className="font-semibold text-brand-gold no-underline hover:underline"
              >
                You can find it anytime here.
              </Link>
            )}
          </div>
        </Panel>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {isGuest ? (
            <>
              <Link
                href={GUEST_PAGE_ROUTES.bookings}
                className="flex-1 rounded bg-brand-navy px-6 py-3 text-center text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-navyDark"
              >
                View My Bookings
              </Link>
              <Link
                href={GUEST_PAGE_ROUTES.account}
                className="flex-1 rounded border border-brand-gold px-6 py-3 text-center text-sm font-semibold text-brand-gold no-underline transition-colors hover:bg-brand-gold/10"
              >
                Go to My Account
              </Link>
            </>
          ) : (
            <>
              <Link
                href={BOOKING_PAGE_ROUTES.find}
                className="flex-1 rounded bg-brand-navy px-6 py-3 text-center text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-navyDark"
              >
                Find Your Booking
              </Link>
              <Link
                href={BOOKING_PAGE_ROUTES.select}
                className="flex-1 rounded border border-brand-gold px-6 py-3 text-center text-sm font-semibold text-brand-gold no-underline transition-colors hover:bg-brand-gold/10"
              >
                Start a New Booking
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function BookingConfirmation() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-[#faf9f7]" />}>
      <ConfirmationInner />
    </Suspense>
  );
}