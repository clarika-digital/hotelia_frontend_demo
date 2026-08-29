import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/global/components/layout/Hero";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { getEventSpaceBySlug } from "@/data/events";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const space = getEventSpaceBySlug(params.slug);
  return { title: space?.title ?? "Event Space" };
}

export default function EventSpaceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const space = getEventSpaceBySlug(params.slug);

  if (!space) notFound();

  return (
    <>
      <Hero title={space.title} image={space.image} />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Venue Details"
            title={space.title}
            subtitle={space.description}
          />
          <div className="grid gap-10 md:grid-cols-5">
            <div className="md:col-span-3">
              <h3 className="font-display text-xl text-brand-navy">
                What&apos;s Included
              </h3>
              <ul className="mt-4 space-y-3">
                {space.features?.map((feature) => (
                  <li
                    key={feature}
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
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="md:col-span-2">
              <div className="rounded bg-brand-navy p-6 text-white">
                {space.capacity && (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gray-300">
                      Capacity
                    </div>
                    <div className="mt-1 font-display text-2xl text-brand-goldBright">
                      {space.capacity}
                    </div>
                  </div>
                )}
                {space.location && (
                  <div className="mt-5">
                    <div className="text-xs uppercase tracking-widest text-gray-300">
                      Location
                    </div>
                    <div className="mt-1 text-gray-200">{space.location}</div>
                  </div>
                )}
                <div className="mt-6 border-t border-white/20 pt-5 text-sm text-gray-300">
                  Request a proposal and our planners will shape the space, menu
                  and schedule around your event.
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href="mailto:clarikadigital@gmail.com"
                  className="inline-block rounded bg-brand-gold px-6 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
                >
                  Request a Proposal
                </a>
                <a
                  href="tel:+233240258378"
                  className="inline-block rounded border border-brand-gold px-6 py-3 font-semibold text-brand-gold no-underline transition-colors hover:bg-brand-gold hover:text-white"
                >
                  +233 24 025 8378
                </a>
              </div>
            </aside>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/meetings-events/"
              className="text-sm font-semibold text-brand-gold no-underline hover:underline"
            >
              &larr; Back to Meetings &amp; Events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}