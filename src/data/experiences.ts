import type { Amenity } from "./types";

export const wellness: Amenity[] = [
  {
    title: "Chi, The Spa",
    description:
      "Calm, scent and silence. Body rituals and facials that pair modern skincare with the botanicals of Ghana — everything designed to melt the day away.",
    image: "/images/ghana/wellness-spa.jpg",
    href: "/health-leisure/chi-the-spa/",
  },
  {
    title: "Health Club",
    description:
      "A modern gym with full cardio and strength zones, plus a rooftop pool and terrace for laps and recovery in the open air.",
    image: "/images/ghana/wellness-gym.jpg",
    href: "/health-leisure/health-club/",
  },
];

export const localExperiences: Amenity[] = [
  {
    title: "Ghanaian Cooking Class",
    description:
      "Cook alongside our chefs and learn the recipes that define the Ghanaian table — from light-soup and fufu to roasted corn and spicy kelewele.",
    href: "/sports-recreation/cooking-class/",
    image: "/images/ghana/offer-jollof.jpg",
  },
  {
    title: "Accra City & Culture Tour",
    description:
      "Trace independence square, the murals of Osu and the rhythms of the Makola market on a half-day tour led by Accra-born guides.",
    href: "/sports-recreation/city-tour/",
    image: "/images/ghana/hero-independence.jpg",
  },
  {
    title: "The Jollof Masterclass",
    description:
      "The pride of the house. Master our celebrated jollof rice over open flame — and take home the recipe that every table argues over.",
    href: "/sports-recreation/jollof-masterclass/",
    image: "/images/ghana/banner-dining.jpg",
  },
];

export const weddingServices: Amenity[] = [
  {
    title: "Wedding Planning",
    description:
      "A dedicated planner to shape your day — from menu and d\u00e9cor to the dance floor, with everything handled behind the scenes.",
    image: "/images/ghana/hero-night.jpg",
    href: "/weddings-celebrations/wedding-planning/",
  },
  {
    title: "Wedding Fair",
    description:
      "Meet the city's best vendors under one roof — florists, photographers and our culinary team — and taste what your day could be.",
    image: "/images/ghana/banner-entrance.jpg",
    href: "/weddings-celebrations/wedding-fair/",
  },
  {
    title: "Event Spaces",
    description:
      "From the grand Hotelia Ballroom to the open-air Pavilion and poolside terrace — spaces that match every size of celebration.",
    image: "/images/ghana/room-deluxe.jpg",
    href: "/weddings-celebrations/event-spaces/",
  },
];

export const aboutHighlights: Amenity[] = [
  {
    title: "Our Story",
    description:
      "Hotelia Accra rises in the Airport Residential Area, minutes from Kotoka International Airport yet worlds away in feel. Behind our doors, the energy of Ghana's capital softens into something calm.",
    image: "/images/ghana/banner-entrance.jpg",
    href: "/about/",
  },
  {
    title: "Contemporary Comfort, Ghanaian Soul",
    description:
      "Rooms layer hand-woven textiles over crisp linens; corridors carry Adinkra motifs reimagined in brass and wood. Every stay pairs contemporary comfort with genuine Ghanaian welcome.",
    image: "/images/ghana/room-premier.jpg",
    href: "/about/services-facilities/",
  },
  {
    title: "Dining & Celebrations",
    description:
      "From the Gold Coast Grill's flame-kissed tilapia to grand galas in the Hotelia Ballroom — the flavours and gatherings of Accra, under one roof.",
    image: "/images/ghana/banner-dining.jpg",
    href: "/dining/",
  },
];

export const morePages = {
  boutique: {
    title: "Hotelia Boutique",
    image: "/images/ghana/banner-kente.jpg",
    description:
      "Bring the Spirit of Ghana Home. A curated collection of hand-woven kente, Adinkra prints, shea-butter bath rituals and artisanal pieces — each chosen to carry a piece of Accra back with you.",
    items: [
      {
        name: "Kente Textiles",
        detail: "Hand-woven by Accra artisans, each with its own colour story.",
        image: "/images/ghana/banner-kente.jpg",
      },
      {
        name: "Adinkra Prints",
        detail: "Symbols of wisdom and heritage on paper, fabric and brass.",
        image: "/images/ghana/badge-art.jpg",
      },
      {
        name: "Shea & Bath Rituals",
        detail: "Botanicals of Ghana, from shea butter to black soap.",
        image: "/images/ghana/offer-cocoa.jpg",
      },
      {
        name: "Local Art & Craft",
        detail: "Ceramics, baskets and art from independent Ghanaian makers.",
        image: "/images/ghana/hero-market.jpg",
      },
    ],
  },
  sustainability: {
    title: "Sustainable Development",
    image: "/images/ghana/offer-cocoa.jpg",
    description:
      "At Hotelia Accra, sustainability is woven into how we run. From sourcing local ingredients to reducing single-use plastics and supporting community craft, we grow responsibly.",
    items: [
      {
        name: "Local Sourcing",
        detail: "Produce, ingredients and crafts sourced from Ghanaian suppliers.",
        image: "/images/ghana/hero-market.jpg",
      },
      {
        name: "Reduce & Reuse",
        detail: "Refillable amenities, reduced plastics and thoughtful water use.",
        image: "/images/ghana/offer-pool.jpg",
      },
      {
        name: "Community Craft",
        detail: "Supporting weavers, makers and artisans across Accra.",
        image: "/images/ghana/badge-art.jpg",
      },
    ],
  },
};
