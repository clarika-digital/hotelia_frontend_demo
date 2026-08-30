import Link from "next/link";
import type { DiningVenue, Offer, Room, Story } from "@/data/types";
import { getDiningHref } from "@/data/dining";
import { getRoomHref } from "@/data/rooms";
import { formatDate, formatMoney } from "@/lib/formatters";

export function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      href={getRoomHref(room)}
      className="group overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
        <img
          src={room.image}
          alt={room.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-brand-navy">{room.title}</h3>
        <p className="mt-2 text-sm text-gray-500">{room.description}</p>
        {room.rate && (
          <div className="mt-3 text-sm text-brand-gold font-semibold">
            From {formatMoney(room.rate, "GHS")}{" "}
            <span className="text-gray-400 font-normal">per night</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function DiningCard({ venue }: { venue: DiningVenue }) {
  return (
    <Link
      href={getDiningHref(venue)}
      className="group overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
        <img
          src={venue.image}
          alt={venue.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-brand-navy">{venue.title}</h3>
        <p className="mt-2 text-sm text-gray-500">{venue.description}</p>
        {venue.cuisine && (
          <div className="mt-3 text-sm text-brand-gold font-semibold">
            {venue.cuisine}
          </div>
        )}
      </div>
    </Link>
  );
}

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Link
      href={`/offers/${offer.slug}/`}
      className="group flex flex-col overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
        <img
          src={offer.image}
          alt={offer.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="text-xs uppercase tracking-wide text-brand-gold font-semibold">
          {offer.type}
        </div>
        <h3 className="mt-1 font-display text-xl text-brand-navy">{offer.title}</h3>
        <p className="mt-2 text-sm text-gray-500">{offer.description}</p>
        {offer.price && (
          <div className="mt-4 flex items-end justify-between gap-2 pt-3 border-t border-surface-muted">
            <div className="text-sm font-semibold text-brand-navy">
              {offer.price}
            </div>
            <span className="inline-block text-sm text-brand-gold font-semibold">
              View Deal &rarr;
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.slug}/`}
      className="group flex flex-col overflow-hidden rounded bg-white shadow hover:shadow-lg transition-shadow no-underline"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        <img
          src={story.image}
          alt={story.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {story.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-navy/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
            {story.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{formatDate(story.date)}</span>
          {story.readTime && <span>&middot; {story.readTime}</span>}
        </div>
        <h3 className="mt-2 font-display text-xl text-brand-navy">
          {story.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-gray-500">{story.excerpt}</p>
        <span className="mt-4 inline-block text-sm font-semibold text-brand-gold">
          Read the story &rarr;
        </span>
      </div>
    </Link>
  );
}
