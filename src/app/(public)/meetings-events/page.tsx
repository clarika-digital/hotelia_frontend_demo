import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";
import Link from "next/link";
import { getAllEventSpaces } from "@/data/events";

export const metadata: Metadata = { title: "Meetings & Events" };

const overviewSpaces = getAllEventSpaces().filter((s) => s.slug !== "event-spaces");

export default function MeetingsEventsPage() {
  return (
    <>
      <Hero
        title="Meetings & Events"
        subtitle="Gather, Celebrate & Create"
        image="/images/ghana/banner-entrance.jpg"
      />
      <Section
        title="Venues"
        subtitle="Three signature spaces, one dedicated team"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {overviewSpaces.map((space) => (
            <Link
              key={space.slug}
              href={`/meetings-events/${space.slug}/`}
              className="group overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
            >
              <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                <img
                  src={space.image}
                  alt={space.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl text-brand-navy">{space.title}</h3>
                {space.capacity && (
                  <div className="mt-1 text-xs uppercase tracking-wide text-brand-gold font-semibold">
                    {space.capacity}
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">{space.description}</p>
              </div>
            </Link>
          ))}

          <Link
            href="/meetings-events/event-spaces/"
            className="group flex flex-col justify-between rounded bg-surface-muted p-6 no-underline hover:shadow-lg transition-shadow"
          >
            <div>
              <div className="text-xs uppercase tracking-wide text-brand-gold font-semibold">
                Compare Spaces
              </div>
              <h3 className="mt-1 font-display text-xl text-brand-navy">Event Spaces at a Glance</h3>
              <p className="mt-2 text-sm text-gray-500">
                Capacities, layouts and settings for every venue across the hotel.
              </p>
            </div>
            <span className="mt-4 text-sm font-semibold text-brand-gold">
              View all venues &rarr;
            </span>
          </Link>
        </div>
      </Section>
      <Section className="bg-surface-muted">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="font-display text-2xl text-brand-navy">Flawless Behind the Scenes</h3>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Our events team handles every detail — from AV and staging to
            catering drawn from our own kitchens. Business or celebration, we
            deliver with the warmth and precision Accra hotels are becoming
            known for.
          </p>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Request a proposal and our planners will shape the space, menu and
            schedule around your event.
          </p>
          <a
            href="mailto:clarikadigital@gmail.com"
            className="mt-5 inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline hover:bg-brand-goldLight"
          >
            Request a Proposal
          </a>
        </div>
      </Section>
    </>
  );
}