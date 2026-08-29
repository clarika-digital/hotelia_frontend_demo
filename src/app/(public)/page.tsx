import Link from "next/link";
import { HeroSlider } from "@/global/components/ui/HeroSlider";
import { SearchWidget } from "@/global/components/ui/SearchWidget";
import { SectionHeader } from "@/global/components/ui/SectionHeader";
import { OfferCard, RoomCard } from "@/global/components/ui/cards";
import { rooms, localExperiences } from "@/data";
import { getFeaturedOffers } from "@/data/offers";

export default function HomePage() {
  const featuredRooms = rooms.slice(0, 3);
  const featuredOffers = getFeaturedOffers().slice(0, 3);

  return (
    <>
      <div className="relative hero-search-wrap">
        <HeroSlider />
        <div className="hero-search-anchor">
          <SearchWidget />
        </div>
      </div>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Curated Packages"
            title="Offers"
            subtitle="Hand-picked stays, dining and escapes across Accra — with direct booking perks."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredOffers.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/offers/"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              View All Offers
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Stay with Us"
            title="Recommended Room Types"
            subtitle="Spacious, contemporary rooms in the heart of Accra — from garden views to skyline suites."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRooms.map((room) => (
              <RoomCard key={room.slug} room={room} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/rooms-suites/"
              className="inline-block rounded border border-brand-gold px-8 py-3 font-semibold text-brand-gold no-underline transition-colors hover:bg-brand-gold hover:text-white"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeader
            eyebrow="Live Accra"
            title="Experiences"
            subtitle="Moments beyond the lobby — cook the Ghanaian table, tour the streets and master the city's pride."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {localExperiences.map((exp) => (
              <Link
                key={exp.title}
                href={exp.href ?? "/health-leisure/"}
                className="group overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-brand-navy">
                    {exp.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">{exp.description}</p>
                  <span className="mt-3 inline-block text-sm text-brand-gold font-semibold">
                    Learn More &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/sports-recreation/"
              className="inline-block rounded bg-brand-gold px-8 py-3 font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
            >
              Explore Experiences
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}