import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { contactInfo, siteConfig } from "@/data/site";

export const metadata: Metadata = { title: "Map & Directions" };

const mapSrc =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent("12 Jensen Road, Airport Residential Area, Accra, Ghana") +
  "&t=&z=15&ie=UTF8&iwloc=&output=embed";

export default function MapDirectionsPage() {
  return (
    <>
      <Hero
        title="Map & Directions"
        subtitle="In the Heart of Airport Residential Area"
        image="/images/ghana/hero-accra-skyline.jpg"
      />
      <section className="bg-white py-14 md:py-16">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHeader
            eyebrow="Getting Here"
            title="Find Us"
            subtitle={`${siteConfig.name}, minutes from Kotoka International Airport yet tucked into a tranquil, leafy neighbourhood.`}
          />
          <div className="overflow-hidden rounded shadow-lg">
            <iframe
              title={`Map to ${siteConfig.name}`}
              src={mapSrc}
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded bg-surface-muted p-5">
              <div className="text-xs uppercase tracking-wide text-brand-gold">Address</div>
              <div className="mt-2 text-sm text-gray-700">{contactInfo.address}</div>
            </div>
            <div className="rounded bg-surface-muted p-5">
              <div className="text-xs uppercase tracking-wide text-brand-gold">Contact</div>
              <div className="mt-2 text-sm text-gray-700">
                <a href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`} className="text-brand-navy hover:text-brand-gold">
                  {contactInfo.phone}
                </a>
                <a href={`mailto:${contactInfo.email}`} className="block mt-1 text-brand-navy hover:text-brand-gold">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div className="rounded bg-surface-muted p-5">
              <div className="text-xs uppercase tracking-wide text-brand-gold">Airport Transfer</div>
              <div className="mt-2 text-sm text-gray-700">
                Complimentary shuttle, arranged in advance — share your flight details with the concierge.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h3 className="font-display text-2xl text-white">
            From Kotoka International Airport
          </h3>
          <p className="mt-3 text-gray-200 leading-relaxed">
            A 15-minute drive. Our wheelchair-accessible shuttle can be booked
            ahead — just contact the concierge with your flight details.
          </p>
          <a
            href="tel:+233240258378"
            className="mt-6 inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
          >
            Book a Transfer
          </a>
        </div>
      </section>
    </>
  );
}