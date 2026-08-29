import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = { title: "Awards & Recognition" };

const awards = [
  { year: "2026", title: "West Africa Leading Hotel", org: "World Travel Awards — Africa Region" },
  { year: "2025", title: "Best Luxury City Retreat", org: "Global Luxury Hospitality Awards" },
  { year: "2025", title: "Excellence in Guest Experience", org: "Hospitality Excellence Institute" },
  { year: "2024", title: "Top Hotel in Accra", org: "Business Traveller Africa" },
  { year: "2024", title: "Culinary Excellence — The Gold Coast Grill", org: "Taste of Ghana Awards" },
  { year: "2023", title: "Green Key Certification", org: "Foundation for Environmental Education" },
];

export default function AwardsPage() {
  return (
    <>
      <Hero
        title="Awards & Recognition"
        subtitle="A Record of Quiet Excellence"
        image="/images/ghana/hero-night.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHeader
            eyebrow="Honours"
            title={`${siteConfig.name} Distinctions`}
            subtitle="Recognition from the industry, our guests and the communities we serve."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {awards.map((a) => (
              <div
                key={a.year + a.title}
                className="flex gap-5 rounded bg-surface-muted p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col items-center justify-between">
                  <div className="font-display text-3xl text-brand-gold">
                    {a.year}
                  </div>
                  <div className="h-full min-h-[2rem] w-px bg-brand-gold/20" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-brand-gold font-semibold">
                    {a.org}
                  </div>
                  <h3 className="mt-1 font-display text-xl text-brand-navy leading-snug">
                    {a.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h3 className="font-display text-3xl text-brand-navy">
            A Note on Our Awards
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            We&apos;re proudest of the trust of our guests — awards are a happy
            by-product of doing the basics beautifully, every single day.
          </p>
        </div>
      </section>
    </>
  );
}