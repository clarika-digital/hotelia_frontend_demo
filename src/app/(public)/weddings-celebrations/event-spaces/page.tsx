import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";

export const metadata: Metadata = { title: "Wedding Event Spaces" };

const spaces = [
  {
    name: "Hotelia Ballroom",
    detail: "The grand ballroom for up to 400 guests, gala style.",
    image: "/images/ghana/room-deluxe.jpg",
    href: "/meetings-events/hotelia-ballroom/",
  },
  {
    name: "The Pavilion",
    detail: "A glass-wrapped venue opening onto the terrace and garden beside the pool.",
    image: "/images/ghana/offer-pool.jpg",
    href: "/meetings-events/the-pavilion/",
  },
  {
    name: "Poolside Terrace",
    detail: "Open-air celebrations under the Accra sky.",
    image: "/images/ghana/hero-beach.jpg",
    href: "/meetings-events/the-pavilion/",
  },
];

export default function WeddingEventSpacesPage() {
  return (
    <>
      <Hero
        title="Event Spaces"
        subtitle="Spaces for Every Size of Celebration"
        image="/images/ghana/offer-pool.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Choose Your Setting"
            title="Three Ways to Celebrate"
            subtitle="From the head-of-table grandeur of the Ballroom to a barefoot terrace underneath the stars — every one backed by our in-house kitchens and events team."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <Link
                key={space.name}
                href={space.href}
                className="group flex flex-col overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                  <img
                    src={space.image}
                    alt={space.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl text-brand-navy">
                    {space.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                    {space.detail}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand-gold">
                    See the venue &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Let&apos;s Walk the Room
          </div>
          <h3 className="font-display text-3xl text-brand-navy">
            Visit Before You Decide
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Arrange a private viewing with our weddings team to see each space
            dressed and sized for your celebration.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:clarikadigital@gmail.com"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              Arrange a Viewing
            </a>
            <a
              href="tel:+233240258378"
              className="inline-block rounded border border-brand-gold px-8 py-3 font-semibold text-brand-gold no-underline transition-colors hover:bg-brand-gold hover:text-white"
            >
              +233 24 025 8378
            </a>
          </div>
        </div>
      </section>
    </>
  );
}