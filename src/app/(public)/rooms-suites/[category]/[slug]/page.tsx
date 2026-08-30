import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/global/components/layout/Hero";
import { RoomGallery } from "@/global/components/ui/RoomGallery";
import { getAllRooms } from "@/data";
import { getRoomHref, roomCategoryLabels } from "@/data/rooms";
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

  if (!room || !(room.category in roomCategoryLabels)) notFound();

  const categoryLabel = roomCategoryLabels[room.category];
  const siblings = getAllRooms().filter(
    (r) => r.category === room.category && r.slug !== room.slug
  );
  const related = (siblings.length ? siblings : getAllRooms().filter((r) => r.slug !== room.slug)).slice(0, 3);

  return (
    <>
      <Hero
        title={room.title}
        subtitle={categoryLabel}
        image={room.image}
        height="h-[340px]"
      />
      <div className="mx-auto max-w-6xl px-5 py-12">
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/rooms-suites/" className="no-underline hover:text-brand-gold">
            Rooms &amp; Suites
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <Link
            href={`/rooms-suites/#${room.category}`}
            className="no-underline hover:text-brand-gold"
          >
            {categoryLabel}
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="text-brand-navy">{room.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <RoomGallery room={room} />

            <p className="mt-8 text-lg leading-relaxed text-gray-600">
              {room.description}
            </p>

            <div className="mt-8">
              <h2 className="font-display text-2xl text-brand-navy">
                Amenities &amp; Inclusions
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
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded border border-surface-muted bg-surface-muted/40 p-6">
              <div className="text-sm text-gray-500">Average per night from</div>
              <div className="mt-1 font-display text-3xl text-brand-navy">
                {room.rate ? formatMoney(room.rate, "GHS") : "On request"}
              </div>

              <dl className="mt-5 space-y-3 border-t border-surface-muted pt-5 text-sm">
                {room.size && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Size</dt>
                    <dd className="font-medium text-brand-navy">{room.size}</dd>
                  </div>
                )}
                {room.bed && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Bed</dt>
                    <dd className="font-medium text-brand-navy">{room.bed}</dd>
                  </div>
                )}
                {room.occupancy && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Occupancy</dt>
                    <dd className="font-medium text-brand-navy">
                      {room.occupancy}
                    </dd>
                  </div>
                )}
              </dl>

              <a
                href="tel:+233240258378"
                className="mt-6 block rounded bg-brand-gold py-3 text-center text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-goldLight"
              >
                Reserve by Phone
              </a>
              <Link
                href="/rooms-suites/"
                className="mt-3 block py-2 text-center text-sm font-semibold text-brand-gold no-underline hover:underline"
              >
                View All Rooms
              </Link>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-brand-navy">
                Explore More Rooms
              </h2>
              <Link
                href="/rooms-suites/"
                className="text-sm font-semibold text-brand-gold no-underline hover:underline"
              >
                View All Rooms &rarr;
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const heading =
                  r.category in roomCategoryLabels
                    ? roomCategoryLabels[r.category]
                    : r.category;
                return (
                  <Link
                    key={r.slug}
                    href={getRoomHref(r)}
                    className="group overflow-hidden rounded bg-white shadow transition-shadow hover:shadow-lg no-underline"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-surface-muted">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-xs uppercase tracking-wide text-brand-gold">
                        {heading}
                      </div>
                      <h3 className="mt-1 font-display text-lg text-brand-navy">
                        {r.title}
                      </h3>
                      {r.rate && (
                        <div className="mt-2 text-sm font-semibold text-brand-gold">
                          From {formatMoney(r.rate, "GHS")}{" "}
                          <span className="font-normal text-gray-400">
                            per night
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}