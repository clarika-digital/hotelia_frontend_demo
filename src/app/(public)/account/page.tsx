"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchGuestBookings } from "@/domains/guests/api";
import { GUEST_PAGE_ROUTES } from "@/domains/guests/constants";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TONE,
  CANCELABLE_STATUSES,
  type GuestBooking,
} from "@/domains/guests/types";
import { Icon } from "@/global/components/ui/Icon";
import { Panel } from "@/global/components/ui/Panel";
import { StatCard } from "@/global/components/ui/StatCard";
import { StatusBadge } from "@/global/components/ui/StatusBadge";
import { formatMoney, formatShortDate } from "@/lib/formatters";
import { useSessionStore } from "@/stores/session-store";

export default function AccountOverviewPage() {
  const claims = useSessionStore((s) => s.claims);
  const [bookings, setBookings] = useState<GuestBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchGuestBookings()
      .then(setBookings)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const firstName = claims?.name.split(" ")[0] ?? "guest";
  const upcoming = bookings.filter((b) =>
    CANCELABLE_STATUSES.includes(b.status)
  );
  const nextStay =
    [...upcoming].sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0] ??
    null;
  const completed = bookings.filter(
    (b) => b.status === "checked_out" || b.status === "no_show"
  );
  const totalSpent = bookings
    .filter((b) => b.status === "checked_out")
    .reduce((sum, b) => sum + b.total, 0);

  const activity = bookings
    .flatMap((b) =>
      b.events.map((e) => ({ at: e.at, label: e.label, ref: b.ref }))
    )
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Upcoming stays"
            value={upcoming.length}
            sub={nextStay ? `${formatShortDate(nextStay.checkIn)} → ${formatShortDate(nextStay.checkOut)}` : "No upcoming stays"}
            accent
          />
          <StatCard
            label="Stays completed"
            value={completed.length}
            sub="Checked out or no-show"
          />
          <StatCard
            label="Nights booked (upcoming)"
            value={upcoming.reduce((n, b) => n + b.nights, 0)}
            sub={`${bookings.length} booking${bookings.length === 1 ? "" : "s"} on file`}
          />
          <StatCard
            label="Total spent"
            value={formatMoney(totalSpent, "GHS", "en-GH")}
            sub="Paid stays to date"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel
            title={nextStay ? "Your next stay" : "Ready when you are"}
            description={
              nextStay
                ? `${nextStay.roomCategory} · ${nextStay.nights} night${nextStay.nights > 1 ? "s" : ""}`
                : "Browse the property while you plan your trip."
            }
          >
            {nextStay ? (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-xl font-bold text-brand-navy">
                    {formatShortDate(nextStay.checkIn)} → {formatShortDate(nextStay.checkOut)}
                  </p>
                  <StatusBadge tone={BOOKING_STATUS_TONE[nextStay.status]}>
                    {BOOKING_STATUS_LABELS[nextStay.status]}
                  </StatusBadge>
                </div>
                <div className="mt-3 grid gap-3 text-sm text-gray-500 sm:grid-cols-3">
                  <div>
                    <p className="font-semibold text-brand-navy">{nextStay.total !== undefined ? formatMoney(nextStay.total, "GHS", "en-GH") : "—"}</p>
                    <p>Booking total</p>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy">{nextStay.guests}</p>
                    <p>Guest{nextStay.guests > 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy">{nextStay.ref}</p>
                    <p>Reference</p>
                  </div>
                </div>
                <Link
                  href={`${GUEST_PAGE_ROUTES.bookings}${nextStay.ref}/`}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-navyDark"
                >
                  View booking
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                You have no upcoming stays. Book online or call{" "}
                <span className="font-semibold text-brand-navy">+233 24 025 8378</span>.
              </p>
            )}
          </Panel>

          <Panel title="Quick actions" description="Everything in your account, one tap away.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={GUEST_PAGE_ROUTES.bookings}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 no-underline transition-colors hover:border-brand-gold"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
                  <Icon name="list" className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-brand-navy">All bookings</span>
              </Link>
              <Link
                href={GUEST_PAGE_ROUTES.profile}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 no-underline transition-colors hover:border-brand-gold"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
                  <Icon name="user" className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-brand-navy">Update profile</span>
              </Link>
              <Link
                href={GUEST_PAGE_ROUTES.export}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 no-underline transition-colors hover:border-brand-gold"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
                  <Icon name="shield-check" className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-brand-navy">Data & privacy</span>
              </Link>
            </div>
          </Panel>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Panel title="Recent activity" description="Events across your bookings.">
          {loading ? (
            <p className="py-6 text-center text-sm text-gray-500">Loading…</p>
          ) : error ? (
            <p className="py-6 text-center text-sm text-red-600">
              Could not load your account.
            </p>
          ) : activity.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No activity yet.</p>
          ) : (
            <ol className="relative space-y-5 border-l border-gray-100 pl-5">
              {activity.map((item, i) => (
                <li key={`${item.ref}-${item.at}-${i}`} className="relative">
                  <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-brand-gold bg-white" />
                  <p className="text-sm font-semibold text-brand-navy">{item.label}</p>
                  <p className="text-xs text-gray-500">
                    {item.ref} · {formatShortDate(item.at)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  );
}