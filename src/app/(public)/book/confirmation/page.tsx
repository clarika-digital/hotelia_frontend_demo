import type { Metadata } from "next";
import { BookingConfirmation } from "@/domains/booking/components/BookingConfirmation";

export const metadata: Metadata = { title: "Reservation Pending" };

export default function BookConfirmationPage() {
  return <BookingConfirmation />;
}