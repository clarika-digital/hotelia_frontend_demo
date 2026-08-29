import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";

export const metadata: Metadata = { title: "Health Club" };

const zones = [
  {
    name: "Cardio & Strength",
    detail:
      "Treadmills, bikes, free weights and functional rigs for a complete workout.",
  },
  {
    name: "Stretch & Flow",
    detail: "Dedicated mat space for yoga, mobility and cool-down work.",
  },
  {
    name: "Recover",
    detail: "Cool laps in the rooftop pool and a sauna to unwind.",
  },
];

const extras = [
  "Personal trainers on hand to shape a plan around your goals",
  "Towels, water and fresh fruit throughout your session",
  "Rooftop pool and terrace for laps, recovery and fresh air",
  "Open from early morning to late evening every day",
];

export default function HealthClubPage() {
  return (
    <>
      <Hero
        title="Health Club"
        subtitle="Train, Swim & Recover"
        image="/images/ghana/wellness-gym.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Training Zones"
            title="Three Spaces, One Complete Workout"
            subtitle="A full fitness floor with cardio, strength and functional zones — plus a rooftop pool and terrace for laps, recovery and fresh air."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {zones.map((zone, idx) => (
              <div key={zone.name} className="rounded bg-surface-muted p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  Zone {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 font-display text-lg text-brand-navy">
                  {zone.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {zone.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {extras.map((e) => (
              <div key={e} className="text-sm text-gray-200 leading-relaxed">
                <div className="mx-auto mb-3 h-1 w-8 rounded bg-brand-gold" />
                {e}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            With Every Stay
          </div>
          <h3 className="font-display text-3xl text-brand-navy">
            Hope In, Any Hour of the Day
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Train through the morning, run in the dark or cool off in the pool
            at golden hour — the doors are open from early to late, and towels,
            water and fresh fruit are never far away.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="tel:+233240258378"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              +233 24 025 8378
            </a>
            <a
              href="mailto:clarikadigital@gmail.com"
              className="inline-block rounded border border-brand-gold px-8 py-3 font-semibold text-brand-gold no-underline transition-colors hover:bg-brand-gold hover:text-white"
            >
              Ask About Personal Training
            </a>
          </div>
        </div>
      </section>
    </>
  );
}