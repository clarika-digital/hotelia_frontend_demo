"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { getAllRooms } from "@/data";
import { RoomCard } from "@/global/components/ui/cards";

const categories = [
  { key: "rooms", label: "Rooms" },
  { key: "horizon-club", label: "Horizon Club" },
  { key: "suites", label: "Suites" },
  { key: "connecting", label: "Connecting" },
] as const;

function parseOccupancy(occupancy?: string): { min: number; max: number } | null {
  if (!occupancy) return null;
  const m = occupancy.match(/(\d+)\s*(?:-\s*(\d+))?/);
  if (!m) return null;
  const min = Number(m[1]);
  const max = m[2] ? Number(m[2]) : min;
  return { min, max };
}

function fmtLong(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function RoomsBrowser() {
  const searchParams = useSearchParams();
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = Number(searchParams.get("adults") ?? 0) || 0;
  const children = Number(searchParams.get("children") ?? 0) || 0;
  const rooms = Number(searchParams.get("rooms") ?? 0) || 0;
  const hasSelection = Boolean(checkIn || checkOut || adults || children || rooms);

  const guests = adults + children;

  const filtered = useMemo(() => {
    if (!hasSelection || guests <= 0) return getAllRooms();
    return getAllRooms().filter((room) => {
      const occ = parseOccupancy(room.occupancy);
      return !occ || occ.max >= guests;
    });
  }, [hasSelection, guests]);

  if (!hasSelection) {
    return (
      <>
        {categories.map((cat) => {
          const items = getAllRooms().filter((r) => r.category === cat.key);
          if (!items.length) return null;
          return (
            <section key={cat.key} className="mb-10">
              <h2 className="mb-6 text-center font-display text-3xl text-brand-navy">
                {cat.label}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((room) => (
                  <RoomCard key={room.slug} room={room} />
                ))}
              </div>
            </section>
          );
        })}
      </>
    );
  }

  return (
    <>
      <div className="mb-8 rounded-lg bg-surface-muted p-5 text-center">
        {checkIn && checkOut ? (
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-brand-navy">{fmtLong(checkIn)}</span>
            {" \u2014 "}
            <span className="font-semibold text-brand-navy">{fmtLong(checkOut)}</span>
            {" \u00b7 "}
            {rooms > 0 && `${rooms} Room${rooms > 1 ? "s" : ""}`}
            {rooms > 0 && adults > 0 && " \u00b7 "}
            {adults > 0 && `${adults} Adult${adults > 1 ? "s" : ""}`}
            {children > 0 && ` \u00b7 ${children} Child${children > 1 ? "ren" : ""}`}
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            {adults > 0 && `${adults} Adult${adults > 1 ? "s" : ""}`}
            {children > 0 && ` \u00b7 ${children} Child${children > 1 ? "ren" : ""}`}
          </p>
        )}
        <Link href="/rooms-suites/" className="mt-2 inline-block text-sm text-brand-gold underline">
          Clear search
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-gray-600">
          No room types match {guests} guest{guests > 1 ? "s" : ""}. Try fewer guests or contact us.
        </p>
      ) : (
        categories.map((cat) => {
          const items = filtered.filter((r) => r.category === cat.key);
          if (!items.length) return null;
          return (
            <section key={cat.key} className="mb-10">
              <h2 className="mb-6 text-center font-display text-3xl text-brand-navy">
                {cat.label}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((room) => (
                  <RoomCard key={room.slug} room={room} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </>
  );
}