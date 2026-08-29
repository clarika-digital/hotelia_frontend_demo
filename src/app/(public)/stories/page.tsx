import { Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { StoriesBrowser } from "@/global/components/ui/StoriesBrowser";

export const metadata: Metadata = { title: "Stories" };

export default function StoriesPage() {
  return (
    <>
      <Hero
        title="Hotelia Stories"
        subtitle="News, life & the spirit of Accra"
        image="/images/ghana/hero-accra-skyline.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="The Journal"
            title="Latest Stories"
            subtitle="Search and filter the life of Hotelia Accra and the city we call home."
          />
          <Suspense
            fallback={
              <div className="py-20 text-center text-gray-500">
                Loading stories&#8230;
              </div>
            }
          >
            <StoriesBrowser />
          </Suspense>
        </div>
      </section>
    </>
  );
}