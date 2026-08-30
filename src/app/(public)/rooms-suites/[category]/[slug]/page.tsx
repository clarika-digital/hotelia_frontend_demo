import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/global/components/layout/Hero";
import { Section } from "@/global/components/ui/Section";
import { RoomGallery } from "@/global/components/ui/RoomGallery";
import { RoomCard } from "@/global/components/ui/cards";
import {
  getAllRooms,
  roomCategoryLabels,
} from "@/data/rooms";
import { siteConfig } from "@/data/site";
import { formatMoney } from "@/lib/formatters";

export function generateStaticParams() {
  return getAllRooms().map((room) => ({
    category: room.category,
    slug: room.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const room = getAllRooms().find(
    (r) => r.slug === params.slug && r.category === params.category
  );
  return { title: room?.title ?? "Room" };
}

export default function RoomDetailPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const room = getAllRooms().find(
    (r) => r.slug === params.slug && r.category === params.category
  );

  if (!room) notFound();

  const categoryLabel = roomCategoryLabels[room.category];
  const gallery = room.gallery?.length ? room.gallery : [room.image];

  const siblings = getAllRooms().filter(
    (r) => r.category === room.category && r.slug !== room.slug
  );
  const related = siblings.length
    ? siblings
    : getAllRooms().filter((r) => r.slug !== room.slug).slice(0, 3);

  return (
    <>
      <Hero
        title={room.title}
        subtitle={categoryLabel}
        image={room.image}
        height="h-[380px]"
      />

      <div className="mx-auto max-w-6xl px-5">
        <nav aria-label="Breadcrumb" className="py-5 text-xs text-gray-500">
          <Link href="/" className="no-underline hover:text-brand-gold">
            Home
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <Link href="/rooms-suites/" className="no-underline hover:text-brand-gold">
            Rooms &amp; Suites
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span>{categoryLabel}</span>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="font-medium text-brand-navy">{room.title}</span>
        </nav>

        <RoomGallery images={gallery} title={room.title} />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-lg text-gray-600 leading-relaxed">
              {room.description}
            </p>

            <h2 className="mt-10 font-display text-2xl text-brand-navy">
              Amenities
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {room.amenities.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-0.5 text-brand-gold">&#10003;</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <aside className="self-start lg:sticky lg:top-28">
            <div className="rounded border border-surface-muted bg-white p-6 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Average per night from
              </div>
              {room.rate && (
                <div className="mt-1 font-display text-3xl text-brand-navy">
                  {formatMoney(room.rate, "GHS")}
                </div>
              )}

              <div className="mt-5 space-y-3 border-t border-surface-muted pt-5 text-sm">
                {room.size && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Size</span>
                    <span className="font-medium text-brand-navy">
                      {room.size}
                    </span>
                  </div>
                )}
                {room.bed && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Bed</span>
                    <span className="font-medium text-brand-navy">
                      {room.bed}
                    </span>
                  </div>
                )}
                {room.occupancy && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Occupancy</span>
                    <span className="font-medium text-brand-navy">
                      {room.occupancy}
                    </span>
                  </div>
                )}
              </div>

              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="mt-6 block rounded bg-brand-gold px-6 py-3 text-center font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
              >
                Reserve by Phone
              </a>
              <Link
                href="/rooms-suites/"
                className="mt-3 block rounded border border-brand-gold px-6 py-3 text-center font-semibold text-brand-gold no-underline transition-colors hover:bg-brand-gold hover:text-white"
              >
                View All Rooms
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Section title="Explore More Rooms" className="bg-surface-muted">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <RoomCard key={r.slug} room={r} />
          ))}
        </div>
      </Section>
    </>
  );
}
