import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";
import { localExperiences } from "@/data/experiences";

export const metadata: Metadata = { title: "Local Experiences" };

export default function LocalExperiencesPage() {
  return (
    <>
      <Hero
        title="Local Experiences"
        subtitle="Live Accra Like a Local"
        image="/images/ghana/hero-beach.jpg"
      />
      <Section title="Moments Beyond the Lobby">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {localExperiences.map((item) => (
            <div key={item.title} className="rounded bg-surface-muted p-6">
              <h3 className="font-display text-xl text-brand-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section className="bg-surface-muted">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="font-display text-2xl text-brand-navy">Ephemeral &amp; Always Local</h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Experiences change with the season and the calendar — from festive
            seasons and food festivals to coastal escapes when the tide is
            right. Our concierge arranges private tours tailored to you.
          </p>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Ask our team and we will shape an Accra that feels like yours alone.
          </p>
        </div>
      </Section>
    </>
  );
}
