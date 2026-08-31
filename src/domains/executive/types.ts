import type { CategoryOccupancy, RevenueBucket } from "@/domains/oversight/types";

export type { CategoryOccupancy, RevenueBucket };

export interface ExecutiveRecommendation {
  label: string;
  impact: string;
  tone: "green" | "amber" | "neutral";
  why: string;
}

export interface ExecutiveSnapshot {
  generatedAt: string;
  performance: {
    revenueToday: number;
    occupancyRate: number;
    adr: number;
    revpar: number;
    totalRooms: number;
    inHouse: number;
    available: number;
  };
  occupancy: {
    totalRooms: number;
    inHouse: number;
    arrivingToday: number;
    departingToday: number;
    available: number;
    rate: number;
    byCategory: CategoryOccupancy[];
  };
  revenue: {
    confirmed: number;
    pending: number;
    cancelled: number;
    perNight: number;
    adr: number;
    revpar: number;
    tax: number;
    trend: RevenueBucket[];
  };
  demand: {
    pending: number;
    confirmed: number;
    inHouse: number;
    completed: number;
    cancelled: number;
    account: number;
    walkIn: number;
    advance7d: number;
    weekendProjection: number;
    avgNights: number;
  };
  markets: {
    total: number;
    byCountry: { country: string; count: number }[];
  };
  recommendations: ExecutiveRecommendation[];
}
