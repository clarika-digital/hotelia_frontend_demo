import type { Room } from "@/data";
import { TAX_RATE_PCT } from "./constants";
import type { RateKind, RoomRateOption } from "./types";

function pct(base: number, percent: number): number {
  return Math.round((base * percent) / 100);
}

const DEFAULT_RATE_FLOOR = 1200;

export function ratesForRoom(room: Room): RoomRateOption[] {
  const base = room.rate ?? DEFAULT_RATE_FLOOR;
  return [
    {
      id: `${room.slug}:saver`,
      tab: "standard",
      rateId: "saver",
      title: "Advance Purchase Saver Rate",
      badges: ["Advance saver", "Save 5%"],
      perNight: pct(base, 95),
      compareAt: base,
      policyLabel: "Pay online",
      cancellation: "Non-refundable — full prepayment is charged at booking",
      earn: "Earn 2x Hotelia Rewards points",
      taxLabel: "Excludes taxes",
    },
    {
      id: `${room.slug}:flexible`,
      tab: "standard",
      rateId: "flexible",
      title: "Flexible Rate",
      badges: ["Free cancellation"],
      perNight: base,
      policyLabel: "Pay at property",
      cancellation: "Free cancellation until 24 hours before check-in",
      earn: "Earn 1x Hotelia Rewards points",
      taxLabel: "Excludes taxes",
    },
    {
      id: `${room.slug}:member`,
      tab: "standard",
      rateId: "member",
      title: "Hotelia Rewards Member Rate",
      badges: ["Members only", "Save 8%"],
      perNight: pct(base, 92),
      compareAt: base,
      policyLabel: "Pay at property",
      cancellation: "Free cancellation until 48 hours before check-in",
      earn: "Earn 3x Hotelia Rewards points",
      taxLabel: "Excludes taxes",
    },
    {
      id: `${room.slug}:bb`,
      tab: "packages",
      rateId: "bb",
      title: "Bed & Breakfast Package",
      badges: ["Breakfast included"],
      perNight: pct(base, 110),
      policyLabel: "Pay at property",
      cancellation: "Free cancellation until 24 hours before check-in",
      included: [
        "Daily breakfast for two",
        "High-speed Wi-Fi",
        "Daily housekeeping",
      ],
      earn: "Earn 2x Hotelia Rewards points",
      taxLabel: "Excludes taxes",
    },
    {
      id: `${room.slug}:stay3`,
      tab: "packages",
      rateId: "stay3",
      title: "Stay 3 Nights — Save 15%",
      badges: ["Book 3+ nights", "Save 15%"],
      perNight: pct(base, 90),
      compareAt: base,
      policyLabel: "Pay online",
      cancellation: "Non-refundable — 3-night minimum stay applies",
      included: ["Late check-out on request", "Welcome drink on arrival"],
      earn: "Earn 3x Hotelia Rewards points",
      taxLabel: "Excludes taxes",
    },
  ];
}

export function rateForRoom(
  room: Room,
  rateId: RateKind
): RoomRateOption | undefined {
  return ratesForRoom(room).find((r) => r.rateId === rateId);
}

export function withTax(amount: number): number {
  return Math.round(amount * (1 + TAX_RATE_PCT / 100));
}

export function taxPct(): number {
  return TAX_RATE_PCT;
}