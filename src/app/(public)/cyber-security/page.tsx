import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";

export const metadata: Metadata = { title: "Cyber Security" };

export default function CyberSecurityPage() {
  return (
    <>
      <Hero title="Cyber Security" image="/images/ghana/hero-accra-skyline.jpg" height="h-[300px]" />
      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-600 leading-relaxed">
            We take the protection of your personal and payment information
            seriously. This site uses secure connections, and we follow
            industry best practices to safeguard your data.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            If you suspect any suspicious activity, contact us immediately at{" "}
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
