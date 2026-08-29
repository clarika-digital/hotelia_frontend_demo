import type { EventSpace } from "./types";

export const eventSpaces: EventSpace[] = [
  {
    slug: "hotelia-ballroom",
    title: "Hotelia Ballroom",
    image: "/images/ghana/room-deluxe.jpg",
    capacity: "Up to 400 guests",
    location: "Ground floor, main wing",
    description:
      "Our signature space for conferences, galas and grand occasions — high ceilings, warm light and room for the whole celebration.",
    features: [
      "Clear, pillarless floor with built-in stage",
      "High ceilings and theatrical warm lighting",
      "Orchestra-level AV, screens and microphones",
      "Theatre, banquet and round-table layouts",
      "Pre-function room for registration and receptions",
    ],
  },
  {
    slug: "conway-rooms",
    title: "Conway Rooms",
    image: "/images/ghana/banner-entrance.jpg",
    capacity: "10 - 40 delegates",
    location: "First floor, quieter wing",
    description:
      "Private, flexible meeting rooms with natural light and full AV — ideal for workshops, briefings and executive sessions.",
    features: [
      "Natural light with full blackout blinds",
      "Dedicated screens, mics and conferencing kit",
      "Whiteboards, flip charts and clickers",
      "Boardroom, classroom and U-shape layouts",
      "Tea and coffee service alongside",
    ],
  },
  {
    slug: "the-pavilion",
    title: "The Pavilion",
    image: "/images/ghana/offer-pool.jpg",
    capacity: "Up to 150 guests",
    location: "Ground floor, beside the pool",
    description:
      "A glass-wrapped venue for receptions and dinners, opening onto our terrace and garden beside the pool.",
    features: [
      "Floor-to-ceiling glass with natural light",
      "Opens onto terrace and garden beside the pool",
      "Flexible social tables for dinners and receptions",
      "Catering drawn from our own kitchens",
      "Outdoor ceremony and cocktail options",
    ],
  },
  {
    slug: "event-spaces",
    title: "Event Spaces",
    image: "/images/ghana/hero-accra-skyline.jpg",
    capacity: "Varies by space",
    location: "Across the hotel",
    description:
      "A complete overview of every meeting and event venue at Hotelia Accra, with capacities at a glance.",
    features: [
      "Gala ballroom for up to 400 guests",
      "Private meeting rooms for 10 - 40 delegates",
      "Glass-wrapped pavilion for up to 150 guests",
      "Full AV, staging and in-house catering",
      "Dedicated events team from first enquiry to close",
    ],
  },
];

export function getAllEventSpaces(): EventSpace[] {
  return eventSpaces;
}

export function getEventSpaceBySlug(slug: string): EventSpace | undefined {
  return eventSpaces.find((s) => s.slug === slug);
}