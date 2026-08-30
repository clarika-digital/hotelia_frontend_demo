import type { DiningVenue } from "./types";

export const diningVenues: DiningVenue[] = [
  {
    slug: "gold-coast-grill",
    title: "Gold Coast Grill",
    type: "restaurant",
    image: "/images/ghana/banner-dining.jpg",
    cuisine: "Grill & Ghanaian Seafood",
    description:
      "Flame-grilled tilapia, suya-spiced meats and rich groundnut stews served straight from the gridiron to your table.",
    hours: "Breakfast, Lunch & Dinner",
  },
  {
    slug: "akwaaba-kitchen",
    title: "Akwaaba Kitchen",
    type: "restaurant",
    image: "/images/ghana/offer-jollof.jpg",
    cuisine: "Ghanaian Home Cooking",
    description:
      "Warm Ghanaian home cooking — fufu and light-soup, red-red, banku and a house jollof to be proud of.",
    hours: "All Day",
  },
  {
    slug: "ohene-bar",
    title: "Ohene Bar",
    type: "bar",
    image: "/images/ghana/hero-night.jpg",
    cuisine: "Cocktails & Palm Wine",
    description:
      "A refined cocktail room where fresh palm wine and craft rum meet Accra's late-night highlife.",
    hours: "Late Night",
  },
  {
    slug: "lobby-lounge",
    title: "The Lobby Lounge",
    type: "lounge",
    image: "/images/ghana/banner-entrance.jpg",
    cuisine: "Coffee, Tea & Sunsets",
    description:
      "Afternoon tea, single-origin Ghanaian coffee and sunset cocktails at the heart of the hotel.",
    hours: "Morning to Evening",
  },
];

export function getDiningVenueBySlug(slug: string): DiningVenue | undefined {
  return diningVenues.find((v) => v.slug === slug);
}

export function getDiningByType(type: DiningVenue["type"]): DiningVenue[] {
  return diningVenues.filter((v) => v.type === type);
}

export function getDiningHref(venue: DiningVenue): string {
  const area = venue.type === "restaurant" ? "restaurants" : "bars-lounges";
  return `/dining/${area}/${venue.slug}/`;
}

export const diningAreaLabels: Record<string, string> = {
  restaurants: "Restaurants",
  "bars-lounges": "Bars & Lounges",
};
