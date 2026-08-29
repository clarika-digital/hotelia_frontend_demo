import type { Offer } from "./types";

export const offers: Offer[] = [
  {
    slug: "accra-weekend-retreat",
    title: "Accra Weekend Retreat",
    type: "Weekend",
    image: "/images/ghana/offer-pool.jpg",
    description:
      "Two nights in a Deluxe Suite, daily breakfast at The Gold Coast Grill, rooftop pool access, and complimentary airport transfer. Unwind in the city without leaving the city.",
    price: "GHS 2,800 / 2 nights",
    featured: true,
  },
  {
    slug: "jollof-and-wine-experience",
    title: "Jollof & Wine Experience",
    type: "Dining",
    image: "/images/ghana/banner-dining.jpg",
    description:
      "A five-course tasting menu paired with curated wines, hosted in our private dining room. Chef's choice, seasonal ingredients, unforgettable evening.",
    price: "GHS 450 / person",
    featured: true,
  },
  {
    slug: "kente-and-culture-package",
    title: "Kente & Culture Package",
    type: "Culture",
    image: "/images/ghana/banner-kente.jpg",
    description:
      "Two nights accommodation, guided Jamestown walking tour, private kente-weaving workshop, and Makola Market excursion with our concierge.",
    price: "GHS 3,200 / 2 nights",
  },
  {
    slug: "adinkra-spa-escape",
    title: "Adinkra Spa Escape",
    type: "Spa",
    image: "/images/ghana/badge-art.jpg",
    description:
      "Full-day spa access with signature shea-butter body wrap, aromatherapy massage, and lunch at the pool terrace. Arrive early, leave renewed.",
    price: "GHS 880 / person",
  },
  {
    slug: "labadi-beach-day-pass",
    title: "Labadi Beach Day Pass",
    type: "Beach",
    image: "/images/ghana/hero-beach.jpg",
    description:
      "Day pass including lounge chair, umbrella, lunch, two cocktails, and live highlife music every Saturday. Hotel shuttle included.",
    price: "GHS 320 / person",
    featured: true,
  },
  {
    slug: "corporate-rate",
    title: "Corporate Rate",
    type: "Business",
    image: "/images/ghana/hero-night.jpg",
    description:
      "Negotiable rates for business travellers staying 3+ nights. Includes high-speed Wi-Fi, breakfast, and access to our executive lounge.",
    price: "Enquire",
  },
  {
    slug: "palm-wine-hour",
    title: "The Lobby Lounge: Palm Wine Hour",
    type: "Culinary Delights",
    image: "/images/ghana/hero-night.jpg",
    description:
      "Golden-hour cocktails built on Ghanaian palm wine & local spirits.",
  },
  {
    slug: "gold-coast-grill-night",
    title: "Gold Coast Grill: Highlife Grill Night",
    type: "Culinary Delights",
    image: "/images/ghana/banner-dining.jpg",
    description: "Suya, grilled seafood & live highlife under the stars.",
  },
];

export function getAllOffers(): Offer[] {
  return offers;
}

export function getOfferBySlug(slug: string): Offer | undefined {
  return offers.find((o) => o.slug === slug);
}

export function getFeaturedOffers(): Offer[] {
  return offers.filter((o) => o.featured);
}
