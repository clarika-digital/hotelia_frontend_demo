"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAllRooms, type Room } from "@/data";
import { getRoomHref } from "@/data/rooms";
import { BookingSearchBar } from "./BookingSearchBar";
import { BookingStepper } from "./BookingStepper";
import {
  BOOKING_PAGE_ROUTES,
  BOOKING_POLICY_LABELS,
  BOOKING_TAB_LABELS,
  DIRECT_BOOK_PERKS,
  ROOM_TYPE_FILTERS,
} from "@/domains/booking/constants";
import { parseBookingQuery, fmtCompact } from "@/domains/booking/params";
import { ratesForRoom, withTax } from "@/domains/booking/rates";
import type { RoomRateOption } from "@/domains/booking/types";
import { Icon } from "@/global/components/ui/Icon";
import { formatMoney } from "@/lib/formatters";

function parseOccupancy(occupancy?: string): { max: number } | null {
  if (!occupancy) return null;
  const m = occupancy.match(/(\d+)\s*(?:-\s*(\d+))?/);
  if (!m) return null;
  return { max: m[2] ? Number(m[2]) : Number(m[1]) };
}

function bedMatches(room: Room, bed: "king" | "twin"): boolean {
  if (!room.bed) return true;
  return bed === "king" ? room.bed.includes("King") : room.bed.includes("Twin");
}

function priceOf(rate: RoomRateOption, taxIncluded: boolean): number {
  return taxIncluded ? withTax(rate.perNight) : rate.perNight;
}

function compareAtOf(
  rate: RoomRateOption,
  taxIncluded: boolean
): number | undefined {
  if (!rate.compareAt) return undefined;
  return taxIncluded ? withTax(rate.compareAt) : rate.compareAt;
}

export function BookingShop() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = useMemo(() => parseBookingQuery(searchParams), [searchParams]);
  const [taxIncluded, setTaxIncluded] = useState(false);
  const [moreFilters, setMoreFilters] = useState(false);
  const highlightRef = useRef<HTMLDivElement>(null);

  const { checkIn, checkOut } = query;
  const totalGuests = query.adults + query.children;

  const roomsToShow = useMemo(() => {
    return getAllRooms().filter((room) => {
      const occ = parseOccupancy(room.occupancy);
      if (occ && occ.max < totalGuests) return false;
      if (query.roomTypes.size > 0 && !query.roomTypes.has(room.category))
        return false;
      if (query.bed && !bedMatches(room, query.bed)) return false;
      return true;
    });
  }, [query.roomTypes, query.bed, totalGuests]);

  useEffect(() => {
    if (query.highlightRoom && highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [query.highlightRoom]);

  const buildHref = (patch: (Record<string, string | undefined>)) => {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined) sp.delete(key);
      else sp.set(key, value);
    }
    const qs = sp.toString();
    return qs ? `/book/?${qs}` : "/book/";
  };

  const toggleType = (cat: Room["category"]) => {
    const next = new Set(query.roomTypes);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    router.replace(buildHref({ type: next.size ? [...next].join(",") : undefined }));
  };

  const setPolicy = (policy: string | undefined) => {
    router.replace(buildHref({ policy }));
  };

  const setBed = (bed: string | undefined) => {
    router.replace(buildHref({ bed }));
  };

  const setTab = (tab: "standard" | "packages") => {
    if (tab === query.tab) return;
    router.replace(buildHref({ tab }));
  };

  const removeParam = (keys: string[]) => {
    const sp = new URLSearchParams(searchParams.toString());
    for (const key of keys) sp.delete(key);
    const qs = sp.toString();
    router.replace(qs ? `/book/?${qs}` : "/book/");
  };

  const clearAll = () => router.replace("/book/");

  const pills: { id: string; label: string; remove: () => void }[] = [];
  pills.push({
    id: "dates",
    label: `${fmtCompact(query.checkIn)} \u2013 ${fmtCompact(query.checkOut)}`,
    remove: () => removeParam(["checkIn", "checkOut"]),
  });
  pills.push({
    id: "guests",
    label: `${query.adults + query.children} guest${
      query.adults + query.children !== 1 ? "s" : ""
    } \u00b7 ${query.rooms} room${query.rooms !== 1 ? "s" : ""}`,
    remove: () => removeParam(["rooms", "adults", "children"]),
  });
  if (query.code) {
    pills.push({
      id: "code",
      label: `Promo: ${query.code}`,
      remove: () => removeParam(["code"]),
    });
  }
  for (const cat of query.roomTypes) {
    const label = ROOM_TYPE_FILTERS.find((f) => f.key === cat)?.label ?? cat;
    pills.push({
      id: `type-${cat}`,
      label,
      remove: () => toggleType(cat),
    });
  }
  if (query.policy) {
    pills.push({
      id: "policy",
      label: BOOKING_POLICY_LABELS[query.policy],
      remove: () => removeParam(["policy"]),
    });
  }
  if (query.bed) {
    pills.push({
      id: "bed",
      label: query.bed === "king" ? "King bed" : "Twin bed",
      remove: () => removeParam(["bed"]),
    });
  }

  const activePlanStats = roomsToShow.reduce(
    (acc, room) => {
      const plans = ratesForRoom(room).filter(
        (r) =>
          r.tab === query.tab &&
          (!query.policy ||
            r.policyLabel === BOOKING_POLICY_LABELS[query.policy])
      );
      if (plans.length > 0) {
        acc.rooms += 1;
        acc.plans += plans.length;
      }
      return acc;
    },
    { rooms: 0, plans: 0 }
  );
  const matchedRoomsCount = activePlanStats.rooms;
  const matchedPlansCount = activePlanStats.plans;

  const tabStartFor = (tab: "standard" | "packages") => {
    let min: number | undefined;
    for (const room of roomsToShow) {
      for (const rate of ratesForRoom(room)) {
        if (rate.tab !== tab) continue;
        if (!min || rate.perNight < min) min = rate.perNight;
      }
    }
    return min;
  };
  const standardStart = tabStartFor("standard");
  const packagesStart = tabStartFor("packages");

  const reviewHref = (roomSlug: string, rateId: string) => {
    const sp = new URLSearchParams();
    sp.set("room", roomSlug);
    sp.set("rate", rateId);
    sp.set("checkIn", query.checkIn);
    sp.set("checkOut", query.checkOut);
    sp.set("rooms", String(query.rooms));
    sp.set("adults", String(query.adults));
    sp.set("children", String(query.children));
    if (query.code) sp.set("code", query.code);
    return `${BOOKING_PAGE_ROUTES.review}?${sp.toString()}`;
  };

  const taxSuffix = taxIncluded
    ? "Price includes 15% tax & service charge"
    : "Excludes 15% tax & service charge";

  return (
    <div className="bg-[#faf9f7]">
      <BookingStepper current={2} />

      <div className="border-b border-surface-muted bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-6">
          <BookingSearchBar
            checkIn={query.checkIn}
            checkOut={query.checkOut}
            rooms={query.rooms}
            adults={query.adults}
            children={query.children}
            code={query.code}
          />
        </div>
      </div>

      <div className="border-b border-surface-muted bg-[#f4f5f6]">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3">
          {DIRECT_BOOK_PERKS.map((perk) => (
            <span
              key={perk}
              className="flex items-center gap-1.5 text-xs text-gray-600"
            >
              <Icon name="shield-check" className="h-3.5 w-3.5 text-brand-gold" />
              {perk}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-brand-gold">
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" className="h-3 w-3" />
              ))}
              Accra, Ghana
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-brand-navy">
              Hotelia Accra
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              12 Jensen Road, Airport Residential Area, Accra
            </p>
          </div>
          {standardStart !== undefined && (
            <p className="text-sm text-gray-600">
              Rates from{" "}
              <span className="font-display text-xl font-bold text-brand-gold">
                {formatMoney(standardStart, "GHS", "en-GH")}
              </span>{" "}
              per night
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          {(["standard", "packages"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTab(tab)}
              className={`flex items-center justify-between gap-2 rounded-lg px-5 py-4 text-left transition-colors ${
                tab === query.tab
                  ? "bg-brand-navy text-white"
                  : "bg-white text-brand-navy hover:bg-surface-muted"
              }`}
            >
              <span className="font-display text-sm font-semibold uppercase tracking-wide">
                {BOOKING_TAB_LABELS[tab]}
              </span>
              <span className={tab === query.tab ? "text-brand-gold" : "text-gray-400"}>
                {formatMoney(
                  tab === "standard" ? (standardStart ?? 0) : (packagesStart ?? 0),
                  "GHS",
                  "en-GH"
                )}
                <span className="text-[10px] font-normal"> /night</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-start gap-x-8 gap-y-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Room Type
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROOM_TYPE_FILTERS.map((f) => {
                const activeFilter = query.roomTypes.has(f.key);
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => toggleType(f.key)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      activeFilter
                        ? "border-brand-navy bg-brand-navy text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-brand-gold"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Booking Policy
            </div>
            <div className="mt-2 flex gap-2">
              {(Object.keys(BOOKING_POLICY_LABELS) as (keyof typeof BOOKING_POLICY_LABELS)[]).map(
                (polKey) => {
                  const activeFilter = query.policy === polKey;
                  return (
                    <button
                      key={polKey}
                      type="button"
                      onClick={() => setPolicy(activeFilter ? undefined : polKey)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        activeFilter
                          ? "border-brand-navy bg-brand-navy text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-brand-gold"
                      }`}
                    >
                      {BOOKING_POLICY_LABELS[polKey]}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMoreFilters((v) => !v)}
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-gold no-underline hover:underline"
          >
            See More Filters
            <span aria-hidden className={moreFilters ? "rotate-180" : ""}>
              {"\u25BE"}
            </span>
          </button>

          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-xs text-gray-600 sm:ml-auto">
            <input
              type="checkbox"
              checked={taxIncluded}
              onChange={(e) => setTaxIncluded(e.target.checked)}
              className="h-3.5 w-3.5 accent-brand-gold"
            />
            Show prices including taxes
          </label>
        </div>

        {moreFilters && (
          <div className="mt-4 rounded-lg border border-surface-muted bg-white p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Bed preference
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { key: undefined, label: "Any" },
                { key: "king", label: "King bed" },
                { key: "twin", label: "Twin bed" },
              ].map((opt) => {
                const activeFilter = query.bed === opt.key;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setBed(opt.key)}
                    className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                      activeFilter
                        ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                        : "border-gray-300 bg-white text-gray-700 hover:border-brand-gold"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {pills.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-surface-muted pt-4">
            {pills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={pill.remove}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-brand-navy"
              >
                {pill.label}
                <span aria-hidden className="text-gray-400">
                  {"\u00d7"}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-brand-gold no-underline hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        <p className="mt-6 text-sm text-gray-500">
          Showing {matchedPlansCount} rate plan{matchedPlansCount !== 1 ? "s" : ""}{" "}
          across {matchedRoomsCount} room type{matchedRoomsCount !== 1 ? "s" : ""}{" "}
          {"\u2022"} {taxSuffix}
        </p>

        {/* ---- Column headers ---- */}
        <div className="mt-4 hidden grid-cols-[300px_1fr] gap-6 rounded-t-lg border border-gray-200 bg-white px-5 py-3 md:grid">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            Room Type
          </div>
          <div className="grid grid-cols-[1fr_220px] items-center">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Rate Plan
            </div>
            <div className="text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Average per night
            </div>
          </div>
        </div>

        <div className="mt-0 space-y-6">
          {matchedRoomsCount === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-600">
                No {query.tab === "packages" ? "packages" : "room types"} match
                your filters.{" "}
                <button
                  type="button"
                  onClick={clearAll}
                  className="font-semibold text-brand-gold no-underline hover:underline"
                >
                  Clear filters
                </button>
              </p>
            </div>
          ) : (
            roomsToShow.map((room) => {
              const plans = ratesForRoom(room).filter(
                (r) =>
                  r.tab === query.tab &&
                  (!query.policy ||
                    r.policyLabel === BOOKING_POLICY_LABELS[query.policy])
              );
              if (plans.length === 0) return null;
              const highlighted = query.highlightRoom === room.slug;
              return (
                <div
                  key={room.slug}
                  ref={
                    query.highlightRoom === room.slug ? highlightRef : undefined
                  }
                  className={`grid overflow-hidden rounded-lg border bg-white md:grid-cols-[300px_1fr] ${
                    highlighted
                      ? "border-brand-gold ring-2 ring-brand-gold/30"
                      : "border-gray-200"
                  }`}
                >
                  <div className="p-5">
                    <div className="aspect-[4/3] overflow-hidden rounded bg-surface-muted">
                      <img
                        src={room.image}
                        alt={room.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-brand-navy">
                      {room.title}
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs text-gray-500">
                      {room.size && <li>{room.size}</li>}
                      {room.bed && <li>{room.bed}</li>}
                      {room.occupancy && <li>Occupancy: {room.occupancy}</li>}
                    </ul>
                    <Link
                      href={getRoomHref(room)}
                      className="mt-3 inline-block text-xs font-semibold text-brand-gold no-underline hover:underline"
                    >
                      Room details &rarr;
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 md:border-l md:border-t-0">
                    {plans.map((rate, planIdx) => {
                      const price = priceOf(rate, taxIncluded);
                      const compare = compareAtOf(rate, taxIncluded);
                      return (
                        <div
                          key={rate.id}
                          className={`grid gap-4 px-5 py-5 sm:grid-cols-[1fr_220px] ${
                            planIdx > 0 ? "border-t border-gray-200" : ""
                          }`}
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-sm font-bold text-brand-navy">
                                {rate.title}
                              </span>
                              {rate.badges?.map((badge) => (
                                <span
                                  key={badge}
                                  className="rounded-full bg-brand-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                            <ul className="mt-2.5 space-y-1 text-xs text-gray-500">
                              <li>Policy: {rate.policyLabel}</li>
                              <li className="flex items-start gap-1">
                                <Icon
                                  name="shield-check"
                                  className="mt-0.5 h-3.5 w-3.5 flex-none text-brand-gold"
                                />
                                {rate.cancellation}
                              </li>
                              {rate.included &&
                                rate.included.map((item) => (
                                  <li key={item}>Included: {item}</li>
                                ))}
                              {rate.earn && (
                                <li className="text-brand-gold">{rate.earn}</li>
                              )}
                            </ul>
                          </div>
                          <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
                            <div className="text-right">
                              {compare && (
                                <div className="text-xs text-gray-400 line-through">
                                  {formatMoney(compare, "GHS", "en-GH")}
                                </div>
                              )}
                              <div className="font-display text-2xl font-bold text-brand-navy">
                                {formatMoney(price, "GHS", "en-GH")}
                              </div>
                              <div className="text-[11px] text-gray-500">
                                avg per night
                              </div>
                            </div>
                            <Link
                              href={reviewHref(room.slug, rate.rateId)}
                              className="inline-block rounded bg-brand-gold px-6 py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}