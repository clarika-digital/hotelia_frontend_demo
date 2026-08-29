import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";

export const metadata: Metadata = { title: "Chi, The Spa" };

const treatments = [
  {
    name: "The Shea Cocoon",
    detail: "A full-body wrap and massage using whipped shea and warm coconut.",
  },
  {
    name: "Moringa Radiance Facial",
    detail: "A brightening facial built on Ghanaian botanicals.",
  },
  {
    name: "Golden Hour Couples' Ritual",
    detail: "Side-by-side treatments for two at golden hour.",
  },
  {
    name: "The Deep Reset",
    detail: "A full reset of massage, facial and scalp treatment.",
  },
];

const botanicals = [
  "Shea butter",
  "Moringa",
  "Hibiscus",
  "Locally harvested coconut",
];

export default function ChiTheSpaPage() {
  return (
    <>
      <Hero
        title="Chi, The Spa"
        subtitle="Stillness, Scent & Renewal"
        image="/images/ghana/wellness-spa.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Signature Rituals"
            title="Wholesome, Tailored & Unhurried"
            subtitle="Our rituals pair modern skincare with Ghanaian botanicals — shea butter, moringa, hibiscus and locally harvested coconut — in softly lit treatment rooms above the rush of Accra."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {treatments.map((treatment) => (
              <div key={treatment.name} className="rounded bg-surface-muted p-6">
                <div className="h-1 w-8 rounded bg-brand-gold" />
                <h3 className="mt-4 font-display text-lg text-brand-navy">
                  {treatment.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {treatment.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 text-center sm:grid-cols-4">
            {botanicals.map((b) => (
              <div key={b} className="font-display text-lg text-brand-goldBright">
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Let the Day Fall Away
          </div>
          <h3 className="font-display text-3xl text-brand-navy">
            Book by the Hour or as a Retreat
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Chi is a pocket of calm above the rush of Accra. Book single
            rituals, an afternoon of treatments or a longer retreat — with
            therapists who tailor every session to you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:clarikadigital@gmail.com"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              Book a Treatment
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