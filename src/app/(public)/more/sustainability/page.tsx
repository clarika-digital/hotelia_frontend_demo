import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { morePages } from "@/data/experiences";

export const metadata: Metadata = { title: "Sustainable Development" };

const impactStats = [
  { value: "80%", label: "Produce sourced in Ghana" },
  { value: "0", label: "Single-use plastics since 2024" },
  { value: "100%", label: "Refillable guest amenities" },
];

export default function SustainabilityPage() {
  const { sustainability } = morePages;
  return (
    <>
      <Hero
        title={sustainability.title}
        subtitle={sustainability.description}
        image={sustainability.image}
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Growing Responsibly"
            title="Built to Last, Made to Give Back"
            subtitle="From rooftop gardens to refillable amenity pumps, every detail is chosen to lighten our footprint and deepen our roots in Accra."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sustainability.items.map((item) => (
              <div
                key={item.name}
                className="group flex flex-col overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl text-brand-navy">
                    {item.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {impactStats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl text-brand-goldBright md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm uppercase tracking-widest text-gray-300">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Our Responsibility
          </div>
          <h3 className="font-display text-3xl text-brand-navy">
            See How We Give Back
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Sustainability is one pillar of a wider promise. Discover the
            community programmes and craft heritage we support across Accra.
          </p>
          <div className="mt-8">
            <Link
              href="/about/corporate-social-responsibility/"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              Our Community Commitments
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}