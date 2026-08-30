import type { Metadata } from "next";
import { BookingReview } from "@/domains/booking/components/BookingReview";

export const metadata: Metadata = { title: "Review Your Reservation" };

export default function BookReviewPage() {
  return <BookingReview />;
}