export interface LinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavSection {
  title: string;
  links: LinkItem[];
}

export interface FooterSection {
  title: string;
  lists: { name: string; url: string; external?: boolean }[];
}

export interface NavColumn {
  title: string;
  links: LinkItem[];
}

export interface MegaNavItem {
  label: string;
  href?: string;
  columns?: NavColumn[];
  overview?: { label: string; href: string };
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  cta?: string;
}

export interface Room {
  slug: string;
  title: string;
  category: "rooms" | "suites" | "horizon-club" | "connecting";
  subtitle?: string;
  image: string;
  description: string;
  size?: string;
  occupancy?: string;
  bed?: string;
  rate?: number;
  amenities: string[];
}

export interface DiningVenue {
  slug: string;
  title: string;
  type: "restaurant" | "bar" | "lounge";
  image: string;
  description: string;
  cuisine?: string;
  hours?: string;
}

export interface Offer {
  slug: string;
  title: string;
  type: string;
  image: string;
  description: string;
  price?: string;
  featured?: boolean;
}

export interface Story {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  tag?: string;
  readTime?: string;
  body: string[];
}

export interface EventSpace {
  slug: string;
  title: string;
  image: string;
  capacity?: string;
  description: string;
  location?: string;
  features?: string[];
}

export interface Amenity {
  title: string;
  description: string;
  icon?: string;
  href?: string;
  image?: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
  category: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  mapDirections: string;
}
