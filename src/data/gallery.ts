import type { GalleryImage } from "./types";

export const galleryImages: GalleryImage[] = [
  { src: "/images/ghana/banner-exterior.jpg", caption: "Jamestown, Accra", category: "Accra" },
  { src: "/images/ghana/banner-entrance.jpg", caption: "Welcome to Hotelia Accra", category: "Hotel" },
  { src: "/images/ghana/hero-accra-skyline.jpg", caption: "Accra Skyline", category: "Accra" },
  { src: "/images/ghana/hero-nkrumah.jpg", caption: "Kwame Nkrumah Memorial Park", category: "Accra" },
  { src: "/images/ghana/hero-independence.jpg", caption: "Independence Square", category: "Accra" },
  { src: "/images/ghana/hero-market.jpg", caption: "Makola Market", category: "Accra" },
  { src: "/images/ghana/hero-beach.jpg", caption: "Labadi Beach", category: "Accra" },
  { src: "/images/ghana/hero-night.jpg", caption: "Accra After Dark", category: "Accra" },
  { src: "/images/ghana/banner-dining.jpg", caption: "The Gold Coast Grill", category: "Dining" },
  { src: "/images/ghana/banner-kente.jpg", caption: "Kente Textiles", category: "Detail" },
  { src: "/images/ghana/offer-jollof.jpg", caption: "House Jollof", category: "Dining" },
  { src: "/images/ghana/offer-cocoa.jpg", caption: "Ghanaian Cocoa", category: "Dining" },
  { src: "/images/ghana/offer-pool.jpg", caption: "Rooftop Pool", category: "Hotel" },
  { src: "/images/ghana/room-garden.jpg", caption: "Deluxe Room", category: "Rooms" },
  { src: "/images/ghana/room-premier.jpg", caption: "Premier Room", category: "Rooms" },
  { src: "/images/ghana/room-wide.jpg", caption: "Suite Living", category: "Rooms" },
  { src: "/images/ghana/room-amenity.jpg", caption: "In-Room Breakfast", category: "Rooms" },
  { src: "/images/ghana/badge-art.jpg", caption: "Adinkra Detail", category: "Detail" },
];

export function getGalleryCategories(): string[] {
  return ["All", ...Array.from(new Set(galleryImages.map((g) => g.category)))];
}

export function getGalleryByCategory(category: string): GalleryImage[] {
  if (category === "All") return galleryImages;
  return galleryImages.filter((g) => g.category === category);
}
