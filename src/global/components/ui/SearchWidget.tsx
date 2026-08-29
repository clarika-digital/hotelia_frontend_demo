"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/cn";

function openDatePicker(ref: RefObject<HTMLInputElement | null>) {
  const el = ref.current;
  if (!el) return;
  try {
    el.showPicker();
  } catch {
    el.focus();
  }
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#876a20" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#876a20" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#876a20" strokeWidth="2">
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return toISO(d);
}

function fmt(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function stayNights(ci: string, co: string): number {
  if (!ci || !co) return 0;
  const a = new Date(ci + "T00:00:00");
  const b = new Date(co + "T00:00:00");
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

interface DateFieldProps {
  name: string;
  value: string;
  min?: string;
  ariaLabel: string;
  onChange: (value: string) => void;
}

function DateField({ name, value, min, ariaLabel, onChange }: DateFieldProps) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <span className="hs-date" onClick={() => openDatePicker(ref)}>
      <span className="hs-value hs-date-value">{fmt(value) || "Select"}</span>
      <input
        type="date"
        name={name}
        className="hs-date-input"
        ref={ref}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
      />
    </span>
  );
}

export function SearchWidget() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [code, setCode] = useState("");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = toISO(new Date());
    setCheckIn(today);
    setCheckOut(addDays(today, 1));
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setGuestsOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const nights = stayNights(checkIn, checkOut);

  const dec =
    (setter: (v: number) => void, v: number, min: number) =>
    () =>
      setter(Math.max(min, v - 1));
  const inc =
    (setter: (v: number) => void, v: number) =>
    () =>
      setter(v + 1);

  const guestSummary =
    `${rooms} Room${rooms !== 1 ? "s" : ""} \u00b7 ${adults} Guest${adults !== 1 ? "s" : ""}` +
    (children > 0 ? ` \u00b7 ${children} child${children !== 1 ? "ren" : ""}` : "");

  const toggleGuests = () => setGuestsOpen((o) => !o);

  return (
    <form
      className="hs-widget"
      method="get"
      action="/rooms-suites/"
      aria-label="Check room availability"
    >
      <div className="hs-seg hs-seg-dates">
        <span className="hs-seg-icon">
          <CalendarIcon />
        </span>
        <div className="hs-seg-body">
          <span className="hs-fld-label">Check-in &mdash; Check-out</span>
          <div className="hs-date-row">
            <DateField
              name="checkIn"
              value={checkIn}
              ariaLabel="Check-in date"
              onChange={(v) => {
                setCheckIn(v);
                if (v && checkOut && checkOut <= v) setCheckOut(addDays(v, 1));
              }}
            />
            <span className="hs-stay">
              {nights} Night{nights !== 1 ? "s" : ""}
            </span>
            <DateField
              name="checkOut"
              value={checkOut}
              min={checkIn ? addDays(checkIn, 1) : undefined}
              ariaLabel="Check-out date"
              onChange={setCheckOut}
            />
          </div>
        </div>
      </div>

      <div
        className={cn("hs-seg hs-seg-guests", guestsOpen && "guests-open")}
        ref={guestsRef}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={guestsOpen}
        aria-label="Number of guests and rooms"
        onClick={toggleGuests}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleGuests();
          }
        }}
      >
        <span className="hs-seg-icon">
          <PersonIcon />
        </span>
        <div className="hs-seg-body">
          <span className="hs-fld-label">Guests</span>
          <span className="hs-value">{guestSummary}</span>
          <div className="hs-guest-panel">
            <div className="hs-guest-row">
              <span className="hs-guest-lbl">Rooms</span>
              <div className="hs-stepper">
                <button type="button" className="hs-step" onClick={dec(setRooms, rooms, 1)} aria-label="Fewer rooms">
                  &minus;
                </button>
                <span className="hs-step-val">{rooms}</span>
                <button type="button" className="hs-step" onClick={inc(setRooms, rooms)} aria-label="More rooms">
                  +
                </button>
              </div>
            </div>
            <div className="hs-guest-row">
              <span className="hs-guest-lbl">Adults</span>
              <div className="hs-stepper">
                <button type="button" className="hs-step" onClick={dec(setAdults, adults, 1)} aria-label="Fewer adults">
                  &minus;
                </button>
                <span className="hs-step-val">{adults}</span>
                <button type="button" className="hs-step" onClick={inc(setAdults, adults)} aria-label="More adults">
                  +
                </button>
              </div>
            </div>
            <div className="hs-guest-row">
              <span className="hs-guest-lbl">Children</span>
              <div className="hs-stepper">
                <button type="button" className="hs-step" onClick={dec(setChildren, children, 0)} aria-label="Fewer children">
                  &minus;
                </button>
                <span className="hs-step-val">{children}</span>
                <button type="button" className="hs-step" onClick={inc(setChildren, children)} aria-label="More children">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hs-seg hs-seg-code">
        <span className="hs-seg-icon">
          <TagIcon />
        </span>
        <div className="hs-seg-body hs-code-wrap">
          <span className="hs-fld-label">Special Code</span>
          <input
            type="text"
            name="code"
            className="hs-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="None"
          />
        </div>
      </div>

      <input type="hidden" name="rooms" value={rooms} />
      <input type="hidden" name="adults" value={adults} />
      <input type="hidden" name="children" value={children} />

      <button type="submit" className="hs-search">
        Search
      </button>
    </form>
  );
}