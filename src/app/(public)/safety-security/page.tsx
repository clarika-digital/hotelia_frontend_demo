import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";

export const metadata: Metadata = { title: "Safety & Security" };

export default function SafetySecurityPage() {
  return (
    <>
      <Hero title="Safety & Security" image="/images/ghana/hero-night.jpg" height="h-[300px]" />
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-600 leading-relaxed">
            The safety of our guests and team is our highest priority. Hotelia
            Accra maintains rigorous security, health and emergency procedures
            across the property, day and night.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Should you need assistance at any time, our front desk and security
            team are available around the clock.
          </p>
        </div>
      </Section>
    </>
  );
}
