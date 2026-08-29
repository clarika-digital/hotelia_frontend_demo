import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsConditionsPage() {
  return (
    <>
      <Hero title="Terms & Conditions" image="/images/ghana/hero-accra-skyline.jpg" height="h-[300px]" />
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-600 leading-relaxed">
            These terms govern your use of the Hotelia Accra website and your
            reservations with the hotel. Please read them carefully before
            booking.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Rates, availability and amenities are subject to change. Special
            terms apply to packages and prepaid offers. For assistance, contact
            our team at{" "}
            <a href="mailto:clarikadigital@gmail.com" className="text-brand-gold">
              clarikadigital@gmail.com
            </a>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
