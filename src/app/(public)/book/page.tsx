import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingShop } from "@/domains/booking/components/BookingShop";

export const metadata: Metadata = { title: "Select a Room & Rate" };

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-[#faf9f7]" />}>
      <BookingShop />
    </Suspense>
  );
}