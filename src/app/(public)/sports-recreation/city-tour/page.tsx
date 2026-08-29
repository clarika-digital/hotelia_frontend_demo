import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";

export const metadata: Metadata = { title: "Accra City & Culture Tour" };

const themes = [
  { name: "Heritage", detail: "Independence Square, Kwame Nkrumah Memorial and the city's storied past." },
  { name: "Art & Style", detail: "Osu's murals, galleries and kente workshops." },
  { name: "Food", detail: "Tastings through Makola and a stop at a beloved chop bar." },
  { name: "Music", detail: "Highlife clubs and live afrobeats as the sun goes down." },
];

export default function CityTourPage() {
  return (
    <>
      <Hero
        title="Accra City & Culture Tour"
        subtitle="The Stories, Streets & Sounds"
        image="/images/ghana/hero-independence.jpg"
      />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-lg text-gray-600 leading-relaxed">
          Join our Accra-born guides for a half-day voyage through a city that
          moves to its own beat. Stand beneath Independence Arch, wander the
          murals and markets of Osu, and follow the rhythm of Makola.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Tours are relaxed, private and shaped around your interests —
          history, art, food or music — with plenty of stories along the way.
        </p>
        <h2 className="mt-8 font-display text-2xl text-brand-navy">Themes</h2>
        <div className="mt-4 space-y-3">
          {themes.map((t) => (
            <div key={t.name} className="rounded bg-surface-muted p-4">
              <div className="font-semibold text-brand-navy">{t.name}</div>
              <div className="mt-1 text-sm text-gray-600">{t.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
