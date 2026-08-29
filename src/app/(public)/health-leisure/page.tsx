import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { wellness } from "@/data/experiences";

export const metadata: Metadata = { title: "Health & Leisure" };

const amenities = [
  { label: "Rooftop pool & terrace", detail: "Laps, cool downs and golden hour" },
  { label: "Fitness floor", detail: "Cardio, strength & functional zones" },
  { label: "Chi, The Spa", detail: "Ghanaian botanical rituals & facials" },
  { label: "Personal training", detail: "Plans shaped around your goals" },
];

export default function HealthLeisurePage() {
  return (
    <>
      <Hero
        title="Health & Leisure"
        subtitle="Recharge Body & Mind"
        image="/images/ghana/wellness-gym.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Wellness at Hotelia Accra"
            title="Train, Swim & Unwind"
            subtitle="A rooftop pool and terrace, a modern fitness floor and a spa built on Ghanaian botanicals — all under one roof."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {wellness.map((item) => (
              <Link
                key={item.title}
                href={item.href ?? "/health-leisure/"}
                className="group flex flex-col overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl text-brand-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand-gold">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {amenities.map((a) => (
              <div key={a.label}>
                <div className="font-display text-lg text-brand-goldBright">
                  {a.label}
                </div>
                <div className="mt-2 text-sm uppercase tracking-widest text-gray-300">
                  {a.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Wellness Without the Wait
          </div>
          <h3 className="font-display text-3xl text-brand-navy">
            Every Stay Includes the Essentials
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Access to the rooftop pool and health club comes with every stay.
            Spa treatments can be booked by the hour or as part of longer
            retreats, with therapists who tailor each session to you.
          </p>
        </div>
      </section>
    </>
  );
}