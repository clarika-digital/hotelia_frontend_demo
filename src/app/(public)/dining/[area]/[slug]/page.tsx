import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/global/components/layout/Hero";
import { DiningCard } from "@/global/components/ui/cards";
import { diningAreaLabels, diningVenues, getDiningHref } from "@/data/dining";

export function generateStaticParams() {
  return diningVenues.map((v) => {
    const area = getDiningHref(v).replace("/dining/", "").split("/")[0];
    return { area, slug: v.slug };
  });
}

export async function generateMetadata({
  params,
}: {
  params: { area: string; slug: string };
}): Promise<Metadata> {
  const venue = diningVenues.find((v) => v.slug === params.slug);
  return { title: venue?.title ?? "Dining" };
}

export default function DiningDetailPage({
  params,
}: {
  params: { area: string; slug: string };
}) {
  const venue = diningVenues.find((v) => v.slug === params.slug);

  if (!venue || getDiningHref(venue) !== `/dining/${params.area}/${params.slug}/`) {
    notFound();
  }

  const areaLabel = diningAreaLabels[params.area] ?? params.area;
  const related = diningVenues.filter(
    (v) => v.slug !== venue.slug && v.type === venue.type
  );

  return (
    <>
      <Hero
        title={venue.title}
        subtitle={venue.cuisine}
        image={venue.image}
        height="h-[380px]"
      />
      <div className="mx-auto max-w-5xl px-5 py-14">
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/dining/" className="no-underline hover:text-brand-gold">
            Dining
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="capitalize text-brand-navy">{areaLabel}</span>
        </nav>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600">
          {venue.description}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded border border-surface-muted p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Hours
            </div>
            <div className="mt-2 text-brand-navy">{venue.hours ?? "All Day"}</div>
          </div>
          <div className="rounded border border-surface-muted p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Setting
            </div>
            <div className="mt-2 text-brand-navy">{areaLabel}</div>
          </div>
          <div className="rounded border border-surface-muted p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Location
            </div>
            <div className="mt-2 text-brand-navy">On-site at Hotelia Accra</div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-6 rounded bg-brand-navy p-8 sm:flex-row sm:items-center">
          <div>
            <div className="font-display text-2xl text-white">
              Reserve a Table
            </div>
            <p className="mt-1 text-sm text-gray-300">
              Call our dining team to book your evening.
            </p>
          </div>
          <a
            href="tel:+233240258378"
            className="rounded bg-brand-gold px-6 py-3 text-center text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
          >
            +233 240 258 378
          </a>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-brand-navy">
                Explore More Dining
              </h2>
              <Link
                href="/dining/"
                className="text-sm font-semibold text-brand-gold no-underline hover:underline"
              >
                View All Dining &rarr;
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((v) => (
                <DiningCard key={v.slug} venue={v} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}