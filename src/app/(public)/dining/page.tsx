import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";
import { DiningCard } from "@/global/components/ui/cards";
import { diningVenues } from "@/data/dining";

export const metadata: Metadata = { title: "Dining" };

export default function DiningPage() {
  return (
    <>
      <Hero
        title="Dining at Hotelia Accra"
        subtitle="Ghanaian flavour, from flame-grilled to fire-roasted"
        image="/images/ghana/banner-dining.jpg"
      />
      <Section title="A Culinary Journey in Accra">
        <div className="grid gap-6 sm:grid-cols-2">
          {diningVenues.map((venue) => (
            <DiningCard key={venue.slug} venue={venue} />
          ))}
        </div>
      </Section>
      <Section title="Eat Where Accra Eats" className="bg-surface-muted">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-gray-600 leading-relaxed">
            Our kitchens celebrate the city&apos;s tables — the smoky char of
            suya, the warmth of peanut soup, the brightness of fresh coconut.
            Menus shift with the market and the season.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Private dining, chef&apos;s tables and celebrations are arranged
            with our team to suit any occasion.
          </p>
        </div>
      </Section>
    </>
  );
}
