import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <Hero title="Privacy Policy" image="/images/ghana/hero-accra-skyline.jpg" height="h-[300px]" />
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-600 leading-relaxed">
            Hotelia Accra respects your privacy. This policy explains the
            personal information we collect when you visit this site or stay
            with us, how we use it, and the choices you have.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            For any privacy enquiries, please contact{" "}
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
