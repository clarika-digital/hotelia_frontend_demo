"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useMemo, useState, type FormEvent } from "react";
import { getAllRooms } from "@/data";
import { BookingStepper } from "./BookingStepper";
import { BOOKING_CONTEXT_KEY, BOOKING_PAGE_ROUTES } from "@/domains/booking/constants";
import { addDays, defaultRange, nightsBetween } from "@/domains/booking/params";
import { rateForRoom, taxPct, withTax } from "@/domains/booking/rates";
import type { CreateReservationRequest, RateKind } from "@/domains/booking/types";
import { createGuestReservation } from "@/domains/guests/api";
import { PAGE_ROUTES } from "@/domains/auth/constants";
import { ApiError } from "@/global/api/client";
import { Icon } from "@/global/components/ui/Icon";
import { Panel } from "@/global/components/ui/Panel";
import { formatMoney, formatShortDate } from "@/lib/formatters";
import { useSessionStore } from "@/stores/session-store";

function ReviewInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claims = useSessionStore((s) => s.claims);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });

  const roomSlug = searchParams.get("room") ?? "";
  const rateId = (searchParams.get("rate") ?? "") as RateKind;
  const fallback = defaultRange();
  const checkInRaw = searchParams.get("checkIn");
  const checkOutRaw = searchParams.get("checkOut");
  const checkIn =
    checkInRaw && !Number.isNaN(new Date(checkInRaw + "T00:00:00").getTime())
      ? checkInRaw
      : fallback.checkIn;
  const checkOut =
    checkOutRaw &&
    !Number.isNaN(new Date(checkOutRaw + "T00:00:00").getTime()) &&
    checkOutRaw > checkIn
      ? checkOutRaw
      : addDays(checkIn, 1);
  const rooms = Math.max(1, Number(searchParams.get("rooms")) || 1);
  const adults = Math.max(1, Number(searchParams.get("adults")) || 2);
  const children = Math.max(0, Number(searchParams.get("children")) || 0);
  const code = searchParams.get("code") ?? undefined;

  const room = useMemo(
    () => getAllRooms().find((r) => r.slug === roomSlug),
    [roomSlug]
  );
  const rate = room ? rateForRoom(room, rateId) : undefined;

  const nights = nightsBetween(checkIn, checkOut);
  const guests = adults + children;

  if (!room || !rate || nights <= 0 || !checkIn || !checkOut) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <p className="text-gray-600">
          This reservation link is incomplete or no longer valid.
        </p>
        <Link
          href={BOOKING_PAGE_ROUTES.select}
          className="mt-4 inline-block font-semibold text-brand-gold no-underline hover:underline"
        >
          Start a new booking
        </Link>
      </div>
    );
  }

  const subtotal = rate.perNight * nights * rooms;
  const taxes = withTax(subtotal) - subtotal;
  const grandTotal = withTax(subtotal);

  const isGuest = claims?.userType === "guest";

  async function onGuarantee(e: FormEvent) {
    e.preventDefault();
    if (!room || !rate) return;
    let request: CreateReservationRequest;
    if (isGuest) {
      request = {
        roomSlug: room.slug,
        rateId: rate.rateId,
        checkIn,
        checkOut,
        rooms,
        adults,
        children,
        code,
      };
    } else {
      const name = contact.name.trim();
      const email = contact.email.trim();
      const phone = contact.phone.trim();
      if (!name || !email || !phone) {
        setError("Add a name, email and phone number to guarantee as a guest.");
        return;
      }
      request = {
        roomSlug: room.slug,
        rateId: rate.rateId,
        checkIn,
        checkOut,
        rooms,
        adults,
        children,
        code,
        name,
        email,
        phone,
      };
    }
    setSubmitting(true);
    setError(null);
    try {
      const booking = await createGuestReservation(request);
      sessionStorage.setItem(
        BOOKING_CONTEXT_KEY,
        JSON.stringify({ ref: booking.ref, pin: booking.pin })
      );
      const params = new URLSearchParams({ ref: booking.ref });
      router.push(
        `${BOOKING_PAGE_ROUTES.confirmation}?${params.toString()}`
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail ?? err.title
          : "We could not guarantee your reservation. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const reviewParams = new URLSearchParams(searchParams.toString());

  return (
    <div className="bg-[#faf9f7]">
      <BookingStepper current={3} />

      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-brand-navy">
                Review Your Reservation
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Hotelia Accra {"\u2022"} 12 Jensen Road, Accra
              </p>
            </div>
            <Link
              href={`${BOOKING_PAGE_ROUTES.select}?${reviewParams.toString()}`}
              className="text-sm font-semibold text-brand-gold no-underline hover:underline"
            >
              Change room or rate
            </Link>
          </div>

          <Panel title="Stay details" className="mt-6">
            <div className="flex flex-wrap items-center gap-4">
              <img
                src={room.image}
                alt={room.title}
                className="h-24 w-36 flex-none rounded object-cover"
              />
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold text-brand-navy">
                  {room.title}
                </h2>
                {rate.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="mr-2 mt-1 inline-block rounded-full bg-brand-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold"
                  >
                    {badge}
                  </span>
                ))}
                <dl className="mt-2 grid grid-cols-1 gap-1 text-sm text-gray-600 sm:grid-cols-2">
                  <div>
                    <dt className="inline text-gray-400">Size: </dt>
                    <dd className="inline font-medium text-brand-navy">
                      {room.size ?? "\u2014"}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-gray-400">Bed: </dt>
                    <dd className="inline font-medium text-brand-navy">
                      {room.bed ?? "\u2014"}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-gray-400">Check-in: </dt>
                    <dd className="inline font-medium text-brand-navy">
                      {formatShortDate(checkIn)} (from 15:00)
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-gray-400">Check-out: </dt>
                    <dd className="inline font-medium text-brand-navy">
                      {formatShortDate(checkOut)} (by 12:00)
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-gray-400">Nights: </dt>
                    <dd className="inline font-medium text-brand-navy">
                      {nights}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline text-gray-400">Guests: </dt>
                    <dd className="inline font-medium text-brand-navy">
                      {guests} ({adults} adult{adults !== 1 ? "s" : ""}
                      {children > 0
                        ? `, ${children} child${children !== 1 ? "ren" : ""}`
                        : ""})
                      {rooms > 1 ? ` \u00b7 ${rooms} rooms` : ""}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Panel>

          <Panel title="Rate plan & terms" className="mt-5">
            <p className="font-semibold text-brand-navy">{rate.title}</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Icon
                  name="shield-check"
                  className="mt-0.5 h-4 w-4 flex-none text-brand-gold"
                />
                {rate.cancellation}
              </li>
              <li className="flex items-start gap-2">
                <Icon name="wallet" className="mt-0.5 h-4 w-4 flex-none text-brand-gold" />
                Payment: {rate.policyLabel}
              </li>
              {rate.included?.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-brand-gold" />
                  {item}
                </li>
              ))}
              {rate.earn && (
                <li className="text-brand-gold">{rate.earn}</li>
              )}
            </ul>
            <p className="mt-4 border-t border-surface-muted pt-3 text-xs text-gray-500">
              {rate.compareAt && (
                <>
                  List price{" "}
                  <span className="line-through">
                    {formatMoney(rate.compareAt, "GHS", "en-GH")}
                  </span>{" "}
                  \u00b7
                </>
              )}{" "}
              You pay {formatMoney(rate.perNight, "GHS", "en-GH")} per night.
            </p>
          </Panel>

          {isGuest && (
            <div className="mt-5 rounded-lg border border-surface-muted bg-surface-muted/50 px-4 py-3 text-sm text-gray-600">
              Guaranteeing as{" "}
              <span className="font-semibold text-brand-navy">
                {claims.name}
              </span>{" "}
              ({claims.email}) — your guest account will be attached to this
              reservation.
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Panel title="Price summary">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-600">
                {formatMoney(rate.perNight, "GHS", "en-GH")}
                {nights > 1 ? ` \u00d7 ${nights} nights` : " / night"}
                {rooms > 1 ? ` \u00d7 ${rooms} room${rooms > 1 ? "s" : ""}` : ""}
              </span>
              <span className="font-medium text-brand-navy">
                {formatMoney(subtotal, "GHS", "en-GH")}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm text-gray-600">
                Tax &amp; service ({taxPct()}%)
              </span>
              <span className="font-medium text-brand-navy">
                {formatMoney(taxes, "GHS", "en-GH")}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-surface-muted pt-3">
              <span className="text-sm font-semibold text-brand-navy">
                Total (incl. taxes)
              </span>
              <span className="font-display text-2xl font-bold text-brand-navy">
                {formatMoney(grandTotal, "GHS", "en-GH")}
              </span>
            </div>

            {error && (
              <p className="mt-4 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </p>
            )}

            {!isGuest ? (
              <form onSubmit={onGuarantee} className="mt-5 space-y-3">
                <p className="text-sm text-gray-600">
                  No account? Guarantee this reservation as a guest — just tell
                  us who&apos;s staying. You&apos;ll manage it later with your
                  reference and PIN.
                </p>
                <div>
                  <label
                    htmlFor="wg-name"
                    className="block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Full name
                  </label>
                  <input
                    id="wg-name"
                    value={contact.name}
                    onChange={(eInput) =>
                      setContact((c) => ({ ...c, name: eInput.target.value }))
                    }
                    required
                    placeholder="Ama Mensah"
                    className="mt-1 w-full rounded border border-surface-muted bg-white px-3 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label
                    htmlFor="wg-email"
                    className="block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Email
                  </label>
                  <input
                    id="wg-email"
                    type="email"
                    value={contact.email}
                    onChange={(eInput) =>
                      setContact((c) => ({ ...c, email: eInput.target.value }))
                    }
                    required
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded border border-surface-muted bg-white px-3 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label
                    htmlFor="wg-phone"
                    className="block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Mobile phone
                  </label>
                  <input
                    id="wg-phone"
                    type="tel"
                    inputMode="tel"
                    value={contact.phone}
                    onChange={(eInput) =>
                      setContact((c) => ({ ...c, phone: eInput.target.value }))
                    }
                    required
                    placeholder="+233 24 000 0000"
                    className="mt-1 w-full rounded border border-surface-muted bg-white px-3 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-sheen mt-1 w-full rounded bg-brand-gold px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-goldLight disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Guaranteeing\u2026" : "Guarantee as Guest"}
                </button>
                <p className="mt-3 text-center text-xs text-gray-500">
                  Already a member?{" "}
                  <Link
                    href={`/login/?next=${encodeURIComponent(
                      `${BOOKING_PAGE_ROUTES.review}?${reviewParams.toString()}`
                    )}`}
                    className="font-semibold text-brand-gold no-underline hover:underline"
                  >
                    Sign in
                  </Link>{" "}
                  {"\u00b7"}{" "}
                  <Link
                    href={PAGE_ROUTES.register}
                    className="font-semibold text-brand-gold no-underline hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
                <p className="mt-2 text-center text-xs text-gray-500">
                  No payment is taken today. The desk confirms your
                  reservation on arrival, or by phone on +233 240 258 378.
                </p>
              </form>
            ) : (
              <form onSubmit={onGuarantee}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-sheen mt-5 w-full rounded bg-brand-gold px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-goldLight disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Guaranteeing\u2026" : "Guarantee or Pay"}
                </button>
                <p className="mt-3 text-center text-xs text-gray-500">
                  No payment is taken today. The desk confirms your
                  reservation on arrival, or by phone on +233 240 258 378.
                </p>
              </form>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

export function BookingReview() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-[#faf9f7]" />}>
      <ReviewInner />
    </Suspense>
  );
}