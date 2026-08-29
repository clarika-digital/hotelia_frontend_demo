import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { siteConfig, contactInfo } from "@/data/site";

export const metadata: Metadata = { title: "Explore Accra" };

const spots = [
  {
    name: "Independence Square",
    detail: "The grand Black Star Square, a monument to Ghana's sovereignty.",
    image: "/images/ghana/hero-independence.jpg",
    tag: "Landmark",
  },
  {
    name: "Makola Market",
    detail: "Accra's vibrant heart of commerce, colour and everyday life.",
    image: "/images/ghana/hero-market.jpg",
    tag: "Market",
  },
  {
    name: "Labadi Beach",
    detail: "Golden sands, live highlife and warm Atlantic breezes.",
    image: "/images/ghana/hero-beach.jpg",
    tag: "Beach",
  },
  {
    name: "Kwame Nkrumah Memorial Park",
    detail: "Honouring the vision of Ghana's first president.",
    image: "/images/ghana/hero-nkrumah.jpg",
    tag: "Heritage",
  },
  {
    name: "Osu & Oxford Street",
    detail: "Restaurants, galleries and the city's creative energy.",
    image: "/images/ghana/hero-night.jpg",
    tag: "Nightlife",
  },
  {
    name: "Jamestown",
    detail: "Historic lanes, the lighthouse and fishing harbour stories.",
    image: "/images/ghana/banner-exterior.jpg",
    tag: "History",
  },
];

export default function LocalGuidePage() {
  return (
    <>
      <Hero
        title="Explore Accra"
        subtitle="The city we call home"
        image="/images/ghana/hero-market.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Places to Discover"
            title="Curated by Our Concierge"
            subtitle="Six introductions to the city — and a concierge team happy to arrange the rest."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spots.map((spot) => (
              <div
                key={spot.name}
                className="group overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="text-xs uppercase tracking-wide text-brand-gold font-semibold">
                    {spot.tag}
                  </div>
                  <h3 className="mt-1 font-display text-xl text-brand-navy">
                    {spot.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{spot.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-goldBright">
            With Our Concierge
          </div>
          <h3 className="font-display text-3xl text-white">
            Let Us Show You Around
          </h3>
          <p className="mt-3 text-gray-200 leading-relaxed">
            Our team is delighted to arrange guided tours, transport and
            reservations across the city — from {siteConfig.name}&apos;s doorstep at{" "}
            {contactInfo.address}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+233240258378"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              {siteConfig.phone}
            </a>
            <a
              href="mailto:clarikadigital@gmail.com"
              className="inline-block rounded border border-brand-goldBright px-8 py-3 font-semibold text-brand-goldBright no-underline transition-colors hover:bg-brand-goldBright hover:text-brand-navy"
            >
              Email the Concierge
            </a>
          </div>
        </div>
      </section>
    </>
  );
}