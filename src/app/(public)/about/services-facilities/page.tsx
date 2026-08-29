import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";

export const metadata: Metadata = { title: "Services & Facilities" };

const facilities = [
  {
    title: "Rooftop Pool & Terrace",
    image: "/images/ghana/offer-pool.jpg",
    detail: "Heated infinity pool overlooking the city, cabanas and golden-hour views.",
  },
  {
    title: "Signature Dining",
    image: "/images/ghana/banner-dining.jpg",
    detail: "Ghanaian and continental dining — jollof tasting menus and grill nights.",
  },
  {
    title: "In-Room Dining",
    image: "/images/ghana/room-amenity.jpg",
    detail: "Breakfast trays, late-night plates and Ghanaian coffee, around the clock.",
  },
  {
    title: "Suites & Club Floors",
    image: "/images/ghana/room-garden.jpg",
    detail: "Canopy suites, club lounge privileges and dedicated service.",
  },
  {
    title: "Adinkra Spa",
    image: "/images/ghana/badge-art.jpg",
    detail: "Shea-butter rituals, kente-inspired treatment rooms and a hammam.",
  },
  {
    title: "Events & Excursions",
    image: "/images/ghana/hero-beach.jpg",
    detail: "Ballroom for 400, boardrooms with city views, and curated city excursions.",
  },
];

export default function ServicesFacilitiesPage() {
  return (
    <>
      <Hero
        title="Services & Facilities"
        subtitle="Everything, Thoughtfully Arranged"
        image="/images/ghana/offer-pool.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Hotel Amenities"
            title="Everything You Need, Under One Roof"
            subtitle="Considered extras that make a stay effortless — from sunrise swims to late-night room service."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f) => (
              <div
                key={f.title}
                className="group overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                  <img
                    src={f.image}
                    alt={f.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-brand-navy">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {f.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Around the Clock
          </div>
          <h3 className="font-display text-3xl text-brand-navy">
            24-Hour Availability
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Reception, in-room dining, laundry and security are available at
            any hour — so your schedule never has to bend to ours.
          </p>
        </div>
      </section>
    </>
  );
}