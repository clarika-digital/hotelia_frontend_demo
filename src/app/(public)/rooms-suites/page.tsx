import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/global/components/layout/Hero";
import { RoomsBrowser } from "@/global/components/ui/RoomsBrowser";

export const metadata: Metadata = { title: "Rooms & Suites" };

export default function RoomsPage() {
  return (
    <>
      <Hero
        title="Rooms & Suites"
        subtitle="Spacious, contemporary rooms in the heart of Accra"
        image="/images/ghana/hero-accra-skyline.jpg"
      />
      <div className="mx-auto max-w-6xl px-5 py-14">
        <Suspense>
          <RoomsBrowser />
        </Suspense>
      </div>
    </>
  );
}