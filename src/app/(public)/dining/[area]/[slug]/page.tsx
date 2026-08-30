import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";
import { DiningCard } from "@/global/components/ui/cards";
import {
  diningVenues,
  getDiningArea,
  getDiningVenueBySlug,
} from "@/data/dining";
import { contactInfo, siteConfig } from "@/data/site";

export function generateStaticParams() {
  return diningVenues.map((venue) => ({
    area: getDiningArea(venue.type),
    slug: venue.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { area: string; slug: string };
}): Promise<Metadata> {
  const venue = getDiningVenueBySlug(params.slug);
  return { title: venue?.title ?? "Dining" };
}

export default function DiningDetailPage({
  params,
}: {
  params: { area: string; slug: string };
}) {
  const venue = getDiningVenueBySlug(params.slug);

  if (!venue || getDiningArea(venue.type) !== params.area) notFound();

  const otherVenues = diningVenues.filter((v) => v.slug !== venue.slug);

  return (
    <>
      <Hero
        title={venue.title}
        subtitle={venue.cuisine}
        image={venue.image}
        height="h-[380px]"
      />

      <div className="mx-auto max-w-4xl px-5 py-14">
        <p className="text-lg text-gray-600 leading-relaxed">
          {venue.description}
        </p>

        <div className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
          {venue.hours && (
            <div className="rounded border border-surface-muted p-4">
              <div className="text-xs uppercase text-brand-gold">Hours</div>
              <div className="mt-1 font-medium">{venue.hours}</div>
            </div>
          )}
          <div className="rounded border border-surface-muted p-4">
            <div className="text-xs uppercase text-brand-gold">Setting</div>
            <div className="mt-1 font-medium capitalize">{venue.type}</div>
          </div>
          <div className="rounded border border-surface-muted p-4">
            <div className="text-xs uppercase text-brand-gold">Location</div>
            <div className="mt-1 font-medium">{contactInfo.address}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
            className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline hover:bg-brand-goldLight"
          >
            Reserve a Table
          </a>
          <Link
            href="/dining/"
            className="inline-block rounded border border-brand-gold px-8 py-3 font-semibold text-brand-gold no-underline hover:bg-brand-gold hover:text-white"
          >
            View All Dining
          </Link>
        </div>
      </div>

      <Section title="Explore More Dining" className="bg-surface-muted">
        <div className="grid gap-6 sm:grid-cols-2">
          {otherVenues.map((other) => (
            <DiningCard key={other.slug} venue={other} />
          ))}
        </div>
      </Section>
    </>
  );
}
