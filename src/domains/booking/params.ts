import type { Room } from "@/data";
import type { BedChoice, BookingPolicy, BookingTab } from "./constants";

export interface BookingQuery {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  code?: string;
  tab: BookingTab;
  roomTypes: Set<Room["category"]>;
  policy?: BookingPolicy;
  bed?: BedChoice;
  highlightRoom?: string;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function defaultRange(): { checkIn: string; checkOut: string } {
  const checkIn = toISODate(new Date());
  return { checkIn, checkOut: addDays(checkIn, 1) };
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn + "T00:00:00");
  const b = new Date(checkOut + "T00:00:00");
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

export function fmtShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtCompact(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function clampInt(value: string | null, fallback: number, min: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? Math.max(min, n) : fallback;
}

const ROOM_CATEGORIES: Room["category"][] = [
  "rooms",
  "horizon-club",
  "suites",
  "connecting",
];

export function parseBookingQuery(
  params: { get(name: string): string | null } | null
): BookingQuery {
  const get = (name: string) => (params ? params.get(name) : null);
  const fallback = defaultRange();

  const checkInRaw = get("checkIn");
  const checkOutRaw = get("checkOut");
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

  const roomTypes = new Set<Room["category"]>();
  const typesCsv = get("type");
  if (typesCsv) {
    for (const key of typesCsv.split(",")) {
      const k = key.trim() as Room["category"];
      if (ROOM_CATEGORIES.includes(k)) roomTypes.add(k);
    }
  }

  const policyRaw = get("policy");
  const policy: BookingPolicy | undefined =
    policyRaw === "pay-property" || policyRaw === "pay-online"
      ? policyRaw
      : undefined;

  const bedRaw = get("bed");
  const bed: BedChoice | undefined =
    bedRaw === "king" || bedRaw === "twin" ? bedRaw : undefined;

  const tab: BookingTab =
    get("tab") === "packages" ? "packages" : "standard";

  return {
    checkIn,
    checkOut,
    rooms: clampInt(get("rooms"), 1, 1),
    adults: clampInt(get("adults"), 2, 1),
    children: clampInt(get("children"), 0, 0),
    ...(get("code") ? { code: get("code")! } : {}),
    tab,
    roomTypes,
    ...(policy ? { policy } : {}),
    ...(bed ? { bed } : {}),
    ...(get("room") ? { highlightRoom: get("room")! } : {}),
  };
}

interface QueryValues {
  [key: string]: string | number | undefined;
}

export function buildBookingHref(values: QueryValues): string {
  const parts = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === "") continue;
    parts.set(key, String(value));
  }
  const qs = parts.toString();
  return qs ? `/book/?${qs}` : "/book/";
}