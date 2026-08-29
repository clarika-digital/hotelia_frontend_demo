import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { weddingServices } from "@/data/experiences";

export const metadata: Metadata = { title: "Weddings & Celebrations" };

const celebrationStats = [
  { value: "400", label: "Guests in the grand ballroom" },
  { value: "4", label: "Indoor & open-air venues" },
  { value: "1", label: "Dedicated planner for your day" },
];

export default function WeddingsPage() {
  return (
    <>
      <Hero
        title="Weddings & Celebrations"
        subtitle="Say I Do, the Accra Way"
        image="/images/ghana/offer-pool.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Our Services"
            title="A Day That's Yours, a Team That's Yours"
            subtitle="From the courtyard rites to the last dance, we craft celebrations that honour Ghanaian tradition and hospitality alike."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {weddingServices.map((service) => (
              <Link
                key={service.title}
                href={service.href ?? "/weddings-celebrations/"}
                className="group flex flex-col overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl text-brand-navy">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand-gold">
                    Learn more &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {celebrationStats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl text-brand-goldBright md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm uppercase tracking-widest text-gray-300">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Tradition &amp; Modernity, Together
          </div>
          <h3 className="font-display text-3xl text-brand-navy">
            Every Wedding Is Unique
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Whether you&apos;re honouring the customs of the engagement
            ceremony, hosting the traditional rites or dancing into the night,
            we blend Ghanaian celebration with seamless modern service.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/meetings-events/"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              Explore Event Spaces
            </Link>
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