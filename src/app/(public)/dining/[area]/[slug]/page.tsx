import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/global/components/layout/Hero";
import { getDiningVenueBySlug } from "@/data/dining";

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

  if (!venue) notFound();

  return (
    <>
      <Hero title={venue.title} image={venue.image} height="h-[380px]" />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-surface-muted px-4 py-1.5 text-brand-navy capitalize">
            {venue.type}
          </span>
          {venue.cuisine && (
            <span className="rounded-full bg-brand-gold/10 px-4 py-1.5 text-brand-gold">
              {venue.cuisine}
            </span>
          )}
          {venue.hours && (
            <span className="rounded-full bg-surface-muted px-4 py-1.5 text-brand-navy">
              {venue.hours}
            </span>
          )}
        </div>
        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          {venue.description}
        </p>
      </div>
    </>
  );
}
