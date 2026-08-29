import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";

export const metadata: Metadata = { title: "Wedding Fair" };

const vendors = [
  {
    name: "Florals & Styling",
    detail:
      "Meet the florists and stylists behind Accra's favourite celebrations — centrepieces, arches and tablescape ideas to touch and taste.",
  },
  {
    name: "Photography & Film",
    detail:
      "Portfolios, prints and films from the photographers who'll capture your day, with booked dates and packages available on the spot.",
  },
  {
    name: "Culinary & Cakes",
    detail:
      "Our chefs present tasting tables of ceremony fare and evening menus, while patissiers showcase the cakes that will anchor your reception.",
  },
  {
    name: "Music & Production",
    detail:
      "DJs, live bands and production teams demo their sound — from the highlife during cocktails to the floor-packer that ends the night.",
  },
  {
    name: "Fashion & Beauty",
    detail:
      "Designers and stylists for the traditional attire and the white dress, plus beauty studios offering trial sessions and day-of bookings.",
  },
  {
    name: "Planning & Stationery",
    detail:
      "Planners, calligraphers and stationery studios to hold the schedule together — invitations, place cards and the ever-important timeline.",
  },
];

const highlights = [
  "Tasting tables from our own kitchens",
  "Trusted suppliers, met face to face",
  "Day-of packages and exclusive fair savings",
  "A dedicated planner at your side all evening",
];

export default function WeddingFairPage() {
  return (
    <>
      <Hero
        title="Wedding Fair"
        subtitle="Meet the City's Best Vendors"
        image="/images/ghana/hero-beach.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Meet, Taste, Decide"
            title="The City's Best Vendors, Under One Roof"
            subtitle="Florists, photographers, bakers and our culinary team — a single evening of inspiration, tasting and trusted introductions."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <div
                key={vendor.name}
                className="flex flex-col rounded bg-surface-muted p-6"
              >
                <h3 className="font-display text-lg text-brand-navy">
                  {vendor.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                  {vendor.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 text-center sm:grid-cols-4">
            {highlights.map((h) => (
              <div key={h} className="text-sm text-gray-200 leading-relaxed">
                <div className="mx-auto mb-3 h-1 w-8 rounded bg-brand-gold" />
                {h}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Coming Soon &amp; Full Calendar
          </div>
          <h3 className="font-display text-3xl text-brand-navy">
            Reserve Your Evening
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Wedding Fairs are held in the Hotelia Ballroom through the year.
            Let us know you&apos;re attending and we&apos;ll plan your evening —
            a private tasting, a planner at your side and introductions with the
            vendors who match your theme.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:clarikadigital@gmail.com"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              Reserve Your Place
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