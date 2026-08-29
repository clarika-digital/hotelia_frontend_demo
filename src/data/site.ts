import type {
  ContactInfo,
  FooterSection,
  HeroSlide,
  MegaNavItem,
} from "./types";

export const siteConfig = {
  name: "Hotelia Accra",
  brandShort: "Hotelia",
  tagline: "A Tranquil Retreat in the Heart of Accra",
  description:
    "Experience luxury at Hotelia Accra in Airport Residential Area, a tranquil retreat with spacious rooms, Ghanaian dining, wellness and warm hospitality.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+233 240 258 378",
  email: "clarikadigital@gmail.com",
};

export const contactInfo: ContactInfo = {
  address: "12 Jensen Road, Airport Residential Area, Accra",
  phone: "+233 240 258 378",
  email: "clarikadigital@gmail.com",
  mapDirections: "/about/map-directions/",
};

export const heroSlides: HeroSlide[] = [
  {
    title: "Hotelia Accra",
    subtitle: "A Tranquil Retreat in the Heart of Accra",
    image: "/images/ghana/banner-entrance.jpg",
    href: "/offers/",
    cta: "Learn More",
  },
  {
    title: "Rooms & Suites",
    subtitle: "Spacious, Contemporary Rooms in the Heart of Accra",
    image: "/images/ghana/room-garden.jpg",
    href: "/rooms-suites/",
    cta: "Learn More",
  },
  {
    title: "Hotelia Boutique",
    subtitle: "Bring the Spirit of Ghana Home",
    image: "/images/ghana/banner-kente.jpg",
    href: "/more/boutique/",
    cta: "Discover More",
  },
  {
    title: "Dining Experience",
    subtitle: "Discover a Range of Carefully Crafted Culinary Delights in Accra",
    image: "/images/ghana/hero-dining.jpg",
    href: "/dining/",
    cta: "Learn More",
  },
  {
    title: "Beachfront Serenity",
    subtitle: "Golden sands and warm Atlantic breezes await",
    image: "/images/ghana/hero-beach2.jpg",
    href: "/about/local-guide/",
    cta: "Discover More",
  },
  {
    title: "Vibrant Accra Markets",
    subtitle: "Explore the colours and energy of Makola",
    image: "/images/ghana/hero-market2.jpg",
    href: "/about/local-guide/",
    cta: "Explore Accra",
  },
];

export const megaNav: MegaNavItem[] = [
  {
    label: "About",
    columns: [
      {
        title: "About The Hotel",
        links: [
          { label: "Overview", href: "/about/" },
          { label: "Explore Accra", href: "/about/local-guide/" },
          { label: "Services & Facilities", href: "/about/services-facilities/" },
          { label: "Map & Directions", href: "/about/map-directions/" },
          { label: "Awards", href: "/about/awards/" },
          { label: "Sustainability", href: "/about/corporate-social-responsibility/" },
        ],
      },
    ],
  },
  {
    label: "Rooms & Suites",
    columns: [
      {
        title: "Rooms",
        links: [
          { label: "Deluxe Room", href: "/rooms-suites/rooms/deluxe/" },
          { label: "Deluxe Imperial Garden View Room", href: "/rooms-suites/rooms/deluxe-imperial-garden-view/" },
          { label: "Premier Room", href: "/rooms-suites/rooms/premier-room/" },
        ],
      },
      {
        title: "Horizon Club",
        links: [
          { label: "Horizon Club Deluxe Room", href: "/rooms-suites/horizon-club/horizon-deluxe-room/" },
          { label: "Horizon Club Deluxe Imperial Garden View", href: "/rooms-suites/horizon-club/horizon-deluxe-imperial-garden-view/" },
          { label: "Horizon Club Premier Room", href: "/rooms-suites/horizon-club/horizon-premier-room/" },
        ],
      },
      {
        title: "Suites",
        links: [
          { label: "Executive Suite", href: "/rooms-suites/suites/executive-suite/" },
          { label: "Premier Suite", href: "/rooms-suites/suites/premier-suite/" },
          { label: "Hotelia Suite", href: "/rooms-suites/suites/hotelia-suite/" },
          { label: "Presidential Suite", href: "/rooms-suites/suites/presidential-suite/" },
        ],
      },
      {
        title: "Connecting Rooms",
        links: [
          { label: "Two Deluxe Rooms Inter-Connecting", href: "/rooms-suites/connecting/two-deluxe-rooms-inter-connecting/" },
        ],
      },
    ],
    overview: { label: "Rooms & Suites Overview", href: "/rooms-suites/" },
  },
  {
    label: "Dining",
    columns: [
      {
        title: "Restaurants",
        links: [
          { label: "Gold Coast Grill", href: "/dining/restaurants/gold-coast-grill/" },
          { label: "Akwaaba Kitchen", href: "/dining/restaurants/akwaaba-kitchen/" },
        ],
      },
      {
        title: "Bars & Lounges",
        links: [
          { label: "Ohene Bar", href: "/dining/bars-lounges/ohene-bar/" },
          { label: "The Lobby Lounge", href: "/dining/bars-lounges/lobby-lounge/" },
        ],
      },
    ],
    overview: { label: "Dining Overview", href: "/dining/" },
  },
  {
    label: "Experience",
    columns: [
      {
        title: "Local Experiences",
        links: [
          { label: "Overview", href: "/sports-recreation/" },
          { label: "Ghanaian Cooking Class", href: "/sports-recreation/cooking-class/" },
          { label: "Accra City & Culture Tour", href: "/sports-recreation/city-tour/" },
          { label: "The Jollof Masterclass", href: "/sports-recreation/jollof-masterclass/" },
        ],
      },
      {
        title: "Health & Leisure",
        links: [
          { label: "Overview", href: "/health-leisure/" },
          { label: "Chi, The Spa", href: "/health-leisure/chi-the-spa/" },
          { label: "Health Club", href: "/health-leisure/health-club/" },
        ],
      },
    ],
  },
  {
    label: "Events",
    columns: [
      {
        title: "Meetings & Events",
        links: [
          { label: "Overview", href: "/meetings-events/" },
          { label: "Hotelia Ballroom", href: "/meetings-events/hotelia-ballroom/" },
          { label: "Conway Rooms", href: "/meetings-events/conway-rooms/" },
          { label: "The Pavilion", href: "/meetings-events/the-pavilion/" },
          { label: "Event Spaces", href: "/meetings-events/event-spaces/" },
        ],
      },
      {
        title: "Weddings",
        links: [
          { label: "Overview", href: "/weddings-celebrations/" },
          { label: "Wedding Planning", href: "/weddings-celebrations/wedding-planning/" },
          { label: "Wedding Fair", href: "/weddings-celebrations/wedding-fair/" },
          { label: "Event Spaces", href: "/weddings-celebrations/event-spaces/" },
        ],
      },
    ],
  },
  { label: "Gallery", href: "/gallery/" },
  { label: "Offers", href: "/offers/" },
  {
    label: "More",
    columns: [
      {
        title: "Hotelia Boutique",
        links: [{ label: "Shop Ghanaian Treasures", href: "/more/boutique/" }],
      },
      {
        title: "Sustainable Development",
        links: [{ label: "Our Planet & People", href: "/more/sustainability/" }],
      },
      {
        title: "Stories",
        links: [{ label: "News & Life in Accra", href: "/stories/" }],
      },
    ],
  },
];

export const footerSections: FooterSection[] = [
  {
    title: "The Hotel",
    lists: [
      { name: "Our Rooms", url: "/rooms-suites/" },
      { name: "Dining", url: "/dining/" },
      { name: "Offers", url: "/offers/" },
      { name: "Meetings & Events", url: "/meetings-events/" },
      { name: "About Us", url: "/about/" },
    ],
  },
  {
    title: "Discover",
    lists: [
      { name: "Gallery", url: "/gallery/" },
      { name: "News & Life in Accra", url: "/stories/" },
      { name: "Hotelia Boutique", url: "/more/boutique/" },
      { name: "Sustainability", url: "/more/sustainability/" },
      { name: "Map & Directions", url: "/about/map-directions/" },
    ],
  },
  {
    title: "Contact",
    lists: [
      { name: "Address", url: "/about/map-directions/" },
      { name: "Email", url: "mailto:clarikadigital@gmail.com", external: true },
      { name: "Phone", url: "tel:+233240258378", external: true },
    ],
  },
];

export const bottomLinks: { name: string; url: string }[] = [
  { name: "Privacy Policy", url: "/privacy-policy/" },
  { name: "Terms & Conditions", url: "/terms-conditions/" },
  { name: "Safety & Security", url: "/safety-security/" },
  { name: "Cyber Security", url: "/cyber-security/" },
];

export const poweredBy = {
  label: "Teva Clarika Digital",
  url: "https://www.clarikadigital.net/",
};

export function buildFooterSections(): FooterSection[] {
  return footerSections;
}
