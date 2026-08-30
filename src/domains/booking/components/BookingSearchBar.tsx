"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import {
  addDays,
  buildBookingHref,
  fmtShort,
  nightsBetween,
  toISODate,
} from "@/domains/booking/params";
import { cn } from "@/lib/cn";

interface BookingSearchBarProps {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  code?: string;
}

function openDatePicker(ref: React.RefObject<HTMLInputElement | null>) {
  const el = ref.current;
  if (!el) return;
  try {
    el.showPicker();
  } catch {
    el.focus();
  }
}

export function BookingSearchBar({
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  rooms: initialRooms,
  adults: initialAdults,
  children: initialChildren,
  code: initialCode,
}: BookingSearchBarProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [rooms, setRooms] = useState(initialRooms);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [code, setCode] = useState(initialCode ?? "");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const nights = nightsBetween(checkIn, checkOut);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const href = buildBookingHref({
      checkIn,
      checkOut,
      rooms,
      adults,
      children,
      code: code.trim() || undefined,
    });
    router.push(href);
  }

  const guestSummary =
    `${adults} Adult${adults !== 1 ? "s" : ""}` +
    (children > 0 ? ` \u00b7 ${children} Child${children !== 1 ? "ren" : ""}` : "") +
    ` \u00b7 ${rooms} Room${rooms !== 1 ? "s" : ""}`;

  return (
    <form onSubmit={onSearch} className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => openDatePicker(checkInRef)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-left"
        >
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Check-in
          </span>
          <span className="text-sm font-semibold text-brand-navy">
            {fmtShort(checkIn) || "Select"}
          </span>
          <input
            type="date"
            ref={checkInRef}
            value={checkIn}
            min={toISODate(new Date())}
            onChange={(e) => {
              const v = e.target.value;
              setCheckIn(v);
              if (v && checkOut <= v) setCheckOut(addDays(v, 1));
            }}
            className="sr-only"
            aria-label="Check-in date"
            tabIndex={-1}
          />
        </button>
        <button
          type="button"
          onClick={() => openDatePicker(checkOutRef)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-left"
        >
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Check-out
          </span>
          <span className="text-sm font-semibold text-brand-navy">
            {fmtShort(checkOut) || "Select"}
          </span>
          <input
            type="date"
            ref={checkOutRef}
            value={checkOut}
            min={checkIn ? addDays(checkIn, 1) : undefined}
            onChange={(e) => setCheckOut(e.target.value)}
            className="sr-only"
            aria-label="Check-out date"
            tabIndex={-1}
          />
        </button>
        <span className="grid min-w-[72px] place-items-center rounded-md bg-surface-muted px-3 py-2 text-sm font-bold text-brand-navy">
          {nights} Night{nights !== 1 ? "s" : ""}
        </span>
      </div>

      <div
        ref={guestsRef}
        className={cn(
          "relative cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2",
          guestsOpen && "border-brand-gold")
        }
        onClick={() => setGuestsOpen((o) => !o)}
      >
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Guests
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-navy">
          {guestSummary}
          <span className="text-gray-400" aria-hidden>
            {"\u25BE"}
          </span>
        </span>
        {guestsOpen && (
          <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-md border border-surface-muted bg-white p-4 shadow-lg">
            {(
              [
                ["Rooms", rooms, setRooms, 1, 8],
                ["Adults", adults, setAdults, 1, 8],
                ["Children", children, setChildren, 0, 6],
              ] as const
            ).map(([label, value, setter, min]) => (
              <div
                key={label}
                className="mb-3 flex items-center justify-between last:mb-0"
              >
                <span className="text-sm text-gray-600">{label}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="h-7 w-7 rounded border border-gray-300 text-brand-navy"
                    onClick={() => setter(Math.max(min, value - 1))}
                    aria-label={`Fewer ${label.toLowerCase()}`}
                  >
                    {"\u2212"}
                  </button>
                  <span className="w-5 text-center text-sm font-semibold text-brand-navy">
                    {value}
                  </span>
                  <button
                    type="button"
                    className="h-7 w-7 rounded border border-gray-300 text-brand-navy"
                    onClick={() => setter(Math.min(12, value + 1))}
                    aria-label={`More ${label.toLowerCase()}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Promo code
        </span>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="None"
          className="w-24 border-0 p-0 text-sm font-semibold text-brand-navy outline-none placeholder:font-normal placeholder:text-gray-300"
        />
      </label>

      <button
        type="submit"
        className="ml-auto rounded-md bg-brand-gold px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-goldLight"
      >
        Search
      </button>
    </form>
  );
}