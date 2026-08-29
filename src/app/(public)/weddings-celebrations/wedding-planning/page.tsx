import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";

export const metadata: Metadata = { title: "Wedding Planning" };

const steps = [
  {
    title: "The First Chat",
    detail:
      "We sit down — over coffee or on video call — to hear your story, your family's customs and the day you're imagining.",
  },
  {
    title: "Menus & Details",
    detail:
      "Together we shape the menu, d\u00e9cor, guest flow and schedule. Our culinary team presents tastings drawn from our own kitchens.",
  },
  {
    title: "The Day Itself",
    detail:
      "From morning rites to evening dance, your planner orchestrates every moment quietly behind the scenes — so you can simply be present.",
  },
  {
    title: "After the Party",
    detail:
      "Breakfasts for guests, wrap-up of returns and a gentle send-off — we keep looking after the details long after the last toast.",
  },
];

const handled = [
  "Engagement ceremony & traditional rites",
  "Menu design & tasting sessions",
  "D\u00e9cor, florals & table styling",
  "AV, staging & the dance floor",
  "Guest list, seating & transport logistics",
  "Overnight rooms for family & friends",
];

export default function WeddingPlanningPage() {
  return (
    <>
      <Hero
        title="Wedding Planning"
        subtitle="A Dedicated Planner for Your Day"
        image="/images/ghana/hero-night.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="From First Chat to Final Dance"
            title="How We Plan Together"
            subtitle="One planner. One point of contact. One calm, beautifully organised lead-up to your day."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {steps.map((step, idx) => (
              <div key={step.title} className="rounded bg-surface-muted p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  Step {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 font-display text-xl text-brand-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-muted py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Handled Quietly Behind the Scenes
              </div>
              <h3 className="mt-2 font-display text-2xl text-brand-navy md:text-3xl">
                Everything in Good Hands
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Whether you&apos;re honouring the customs of the engagement
                ceremony, hosting the traditional rites or dancing into the
                night, our team blends Ghanaian celebration with seamless modern
                service.
              </p>
            </div>
            <ul className="space-y-3">
              {handled.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-gray-600 leading-relaxed"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mt-1 h-5 w-5 shrink-0 text-brand-gold"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-3.5-3.5a.75.75 0 0 1 1.06-1.06l2.894 2.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-brand-navy py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-goldBright">
            Start Planning Today
          </div>
          <h3 className="font-display text-3xl text-white">
            Receive Your Wedding Proposal
          </h3>
          <p className="mt-3 text-gray-200 leading-relaxed">
            Tell us your date, your guest count and your vision — we&apos;ll
            shape the space, menu and schedule around you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:clarikadigital@gmail.com"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              Request a Proposal
            </a>
            <a
              href="tel:+233240258378"
              className="inline-block rounded border border-brand-goldBright px-8 py-3 font-semibold text-brand-goldBright no-underline transition-colors hover:bg-brand-goldBright hover:text-brand-navy"
            >
              +233 24 025 8378
            </a>
          </div>
        </div>
      </section>
    </>
  );
}