import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { morePages } from "@/data/experiences";

export const metadata: Metadata = { title: "Hotelia Boutique" };

export default function BoutiquePage() {
  const { boutique } = morePages;
  return (
    <>
      <Hero
        title={boutique.title}
        subtitle={boutique.description}
        image={boutique.image}
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Curated Pieces of Ghana"
            title="Take a Slice of Accra Home"
            subtitle="A considered edit of hand-woven cloth, symbols and scents — each chosen with the makers who craft it."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {boutique.items.map((item) => (
              <div
                key={item.name}
                className="group flex flex-col overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl text-brand-navy">
                    {item.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                    {item.detail}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand-gold">
                    In the boutique &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Gift with a Story
          </div>
          <h3 className="font-display text-3xl text-brand-navy">
            Every Piece Gives Back
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Profits from the boutique fund apprenticeship training for Accra
            artisans. When you shop with us, you are investing in the hands
            behind Ghana&apos;s making traditions.
          </p>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-goldBright">
            Off the Lobby &middot; Open Daily
          </div>
          <h3 className="font-display text-3xl text-white">
            Your Personal Shopping Appointment
          </h3>
          <p className="mt-3 text-gray-200 leading-relaxed">
            Ask our team to arrange a private viewing, a styling session or a
            curated gift from Boutique Hotelia — arranged before you even
            arrive.
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
              className="inline-block rounded border border-brand-goldBright px-8 py-3 font-semibold text-brand-goldBright no-underline transition-colors hover:bg-brand-goldBright hover:text-brand-navy"
            >
              Book an Appointment
            </a>
          </div>
        </div>
      </section>
    </>
  );
}