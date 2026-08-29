import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Corporate Social Responsibility" };

const pillars = [
  {
    title: "Community First",
    image: "/images/ghana/hero-market.jpg",
    paragraphs: [
      "We source 80% of our produce within Ghana, partner with Makola Market women cooperatives, and fund hospitality apprenticeships for Accra youth through our training kitchen.",
      "Our Team Member Volunteer Days support local schools in the Airport Residential neighbourhood each term.",
    ],
  },
  {
    title: "Sustainability",
    image: "/images/ghana/offer-cocoa.jpg",
    paragraphs: [
      "Solar-assisted water heating, zero single-use plastics since 2024, and a rooftop garden supplying our kitchen with herbs and greens year-round.",
      "Water reclamation and locally made amenities keep every stay light on the land we call home.",
    ],
  },
  {
    title: "Culture & Craft",
    image: "/images/ghana/badge-art.jpg",
    paragraphs: [
      "From kente-weaving residencies in our lobby to Adinkra stamping workshops for guests, we celebrate and compensate living Ghanaian craft traditions — fairly and by name.",
    ],
  },
];

const impactStats = [
  { value: "80%", label: "Produce sourced in Ghana" },
  { value: "0", label: "Single-use plastics since 2024" },
  { value: "2", label: "Community programmes funded" },
];

export default function CsrPage() {
  return (
    <>
      <Hero
        title="Corporate Social Responsibility"
        subtitle="Rooted in Community, Growing Together"
        image="/images/ghana/banner-entrance.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Our Commitments"
            title="Doing Well by Doing Good"
            subtitle="Three pillars guide how we operate — community, sustainability and the craft that makes Ghana distinct."
          />
          <div className="space-y-14">
            {pillars.map((p, idx) => (
              <div
                key={p.title}
                className="grid items-center gap-8 md:grid-cols-2"
              >
                <div
                  className={cn(
                    "overflow-hidden rounded shadow-lg",
                    idx % 2 === 1 && "md:order-2"
                  )}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className={cn(idx % 2 === 1 && "md:order-1")}>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                    Pillar {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-2xl text-brand-navy md:text-3xl">
                    {p.title}
                  </h3>
                  {p.paragraphs.map((para, i) => (
                    <p key={i} className="mt-4 text-gray-600 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {impactStats.map((s) => (
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
    </>
  );
}