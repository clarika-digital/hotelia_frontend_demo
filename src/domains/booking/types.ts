import type { Room } from "@/data";

export type RateKind = "saver" | "flexible" | "member" | "bb" | "stay3";

export interface RoomRateOption {
  id: string;
  tab: "standard" | "packages";
  rateId: RateKind;
  title: string;
  badges?: string[];
  /** Active price per night, pre-tax (GHS). */
  perNight: number;
  /** Struck-through list price per night, pre-tax — present when discounted. */
  compareAt?: number;
  policyLabel: "Pay at property" | "Pay online";
  cancellation: string;
  earn?: string;
  included?: string[];
  taxLabel: string;
}

export interface CreateReservationRequest {
  roomSlug: string;
  rateId: RateKind;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
}