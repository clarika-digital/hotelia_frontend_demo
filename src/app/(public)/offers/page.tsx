import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { OfferCard } from "@/global/components/ui/cards";
import { offers } from "@/data/offers";

export const metadata: Metadata = { title: "Offers" };

export default function OffersPage() {
  return (
    <>
      <Hero
        title="Offers & Packages"
        subtitle="Unwind, explore and celebrate"
        image="/images/ghana/offer-pool.jpg"
      />
      <div className="mx-auto max-w-6xl px-5 py-14">
        <SectionHeader
          eyebrow="Curated Packages"
          title="Current Offers"
          subtitle="Stays, dining and escapes with direct booking perks."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} />
          ))}
        </div>
      </div>
      <Section className="bg-surface-muted">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="font-display text-2xl text-brand-navy">
            Direct Booking Perks
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Book direct and enjoy complimentary breakfast, room upgrade
            (subject to availability), late checkout until 2pm, and 500 bonus
            loyalty points.
          </p>
          <a
            href="tel:+233240258378"
            className="mt-5 inline-block rounded bg-brand-goldBright px-8 py-3 font-semibold text-brand-navy no-underline hover:bg-brand-gold hover:text-white"
          >
            Book Direct &amp; Save
          </a>
        </div>
      </Section>
    </>
  );
}