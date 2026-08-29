import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/global/components/layout/Hero";
import { getAllOffers } from "@/data/offers";

export function generateStaticParams() {
  return getAllOffers().map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const offer = getOfferBySlugSafe(params.slug);
  return { title: offer?.title ?? "Offer" };
}

export default function OfferDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const offer = getOfferBySlugSafe(params.slug);

  if (!offer) notFound();

  return (
    <>
      <Hero title={offer.title} image={offer.image} height="h-[380px]" />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-surface-muted px-4 py-1.5 text-brand-navy">
            {offer.type}
          </span>
        </div>
        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          {offer.description}
        </p>
        {offer.price && (
          <div className="mt-8 rounded bg-surface-muted p-6">
            <div className="text-sm text-gray-500">Price</div>
            <div className="mt-1 font-display text-3xl text-brand-navy">
              {offer.price}
            </div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="tel:+233240258378"
            className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline hover:bg-brand-goldLight"
          >
            Book This Offer
          </a>
          <Link
            href="/offers/"
            className="inline-block rounded border border-brand-gold px-8 py-3 font-semibold text-brand-gold no-underline hover:bg-brand-gold hover:text-white"
          >
            View All Offers
          </Link>
        </div>
      </div>
    </>
  );
}

function getOfferBySlugSafe(slug: string) {
  return getAllOffers().find((o) => o.slug === slug);
}