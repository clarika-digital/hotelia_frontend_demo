export interface ApiEnvelope<T = unknown> {
  data: T;
  meta?: Record<string, unknown>;
  error?: {
    status: number;
    title: string;
    detail?: string;
  };
}

export interface PagePayload<T = unknown> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type RoomStatus =
  | "available"
  | "occupied"
  | "cleaning"
  | "maintenance"
  | "blocked";

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";
