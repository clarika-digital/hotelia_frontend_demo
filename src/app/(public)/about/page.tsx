import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { aboutHighlights } from "@/data/experiences";
import { siteConfig, contactInfo } from "@/data/site";
import { rooms } from "@/data/rooms";
import { diningVenues } from "@/data/dining";
import { eventSpaces } from "@/data/events";
import { wellness } from "@/data/experiences";

export const metadata: Metadata = { title: "About" };

const stats = [
  { value: rooms.length, label: "Room & Suite Types" },
  { value: diningVenues.length, label: "Restaurants & Lounges" },
  { value: eventSpaces.length, label: "Event & Meeting Spaces" },
  { value: wellness.length, label: "Wellness Experiences" },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        title="Welcome to Hotelia Accra"
        subtitle="Contemporary comfort, Ghanaian soul"
        image="/images/ghana/banner-entrance.jpg"
      />

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="overflow-hidden rounded shadow-lg">
              <img
                src="/images/ghana/hero-accra-skyline.jpg"
                alt="Accra skyline near Hotelia Accra"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                {siteConfig.tagline}
              </div>
              <h2 className="font-display text-3xl text-brand-navy md:text-4xl">
                A Tranquil Retreat in the Heart of Accra
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {siteConfig.description}
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Minutes from Kotoka International Airport yet worlds away in
                feel, behind our doors the energy of Ghana&apos;s capital
                softens into something calm.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 text-brand-gold">&#10003;</span>
                  {contactInfo.address}
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 text-brand-gold">&#10003;</span>
                  Butler, concierge &amp; 24-hour essentials
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 text-brand-gold">&#10003;</span>
                  Free high-speed Wi-Fi throughout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="The Hotelia Difference"
            title="Why Guests Choose Hotelia"
            subtitle="Thoughtful comforts, Ghanaian warmth and a stay that stays with you."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {aboutHighlights.map((item) => (
              <Link
                key={item.title}
                href={item.href ?? "/about/"}
                className="group overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-brand-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-4xl text-brand-goldBright md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm uppercase tracking-widest text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h3 className="font-display text-3xl text-brand-navy">
            Come and See for Yourself
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Speak with our team about rooms, offers and special requests — or
            plan your journey to Airport Residential Area.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+233240258378"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              {siteConfig.phone}
            </a>
            <Link
              href="/about/map-directions/"
              className="inline-block rounded border border-brand-gold px-8 py-3 font-semibold text-brand-gold no-underline transition-colors hover:bg-brand-gold hover:text-white"
            >
              Map &amp; Directions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}