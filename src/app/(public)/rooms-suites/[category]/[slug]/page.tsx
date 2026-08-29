import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/global/components/layout/Hero";
import { getAllRooms } from "@/data";
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

  return (
    <>
      <Hero title={room.title} image={room.image} height="h-[380px]" />
      <div className="mx-auto max-w-4xl px-5 py-14">
        <p className="text-lg text-gray-600 leading-relaxed">
          {room.description}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 text-sm">
          {room.size && (
            <div className="rounded border border-surface-muted p-4">
              <div className="text-xs uppercase text-brand-gold">Size</div>
              <div className="mt-1 font-medium">{room.size}</div>
            </div>
          )}
          {room.bed && (
            <div className="rounded border border-surface-muted p-4">
              <div className="text-xs uppercase text-brand-gold">Bed</div>
              <div className="mt-1 font-medium">{room.bed}</div>
            </div>
          )}
          {room.occupancy && (
            <div className="rounded border border-surface-muted p-4">
              <div className="text-xs uppercase text-brand-gold">Occupancy</div>
              <div className="mt-1 font-medium">{room.occupancy}</div>
            </div>
          )}
        </div>

        {room.rate && (
          <div className="mt-8 rounded bg-surface-muted p-6 text-center">
            <div className="text-sm text-gray-500">
              Average per night from
            </div>
            <div className="mt-1 font-display text-3xl text-brand-navy">
              {formatMoney(room.rate, "GHS")}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="font-display text-2xl text-brand-navy">Amenities</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {room.amenities.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 text-brand-gold">&#10003;</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
