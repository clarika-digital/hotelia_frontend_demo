"use client";

import { useCallback, useEffect, useState } from "react";
import { Hero } from "@/global/components/layout/Hero";
import { getGalleryByCategory, getGalleryCategories } from "@/data/gallery";
import { cn } from "@/lib/cn";

export default function GalleryPage() {
  const categories = getGalleryCategories();
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const images = getGalleryByCategory(active);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((current) =>
        current === null
          ? current
          : (current + dir + images.length) % images.length
      );
    },
    [images.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <>
      <Hero
        title="Gallery"
        subtitle="Hotelia Accra & the City"
        image="/images/ghana/hero-accra-skyline.jpg"
      />
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? images.length
                  : getGalleryByCategory(cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActive(cat);
                    setLightbox(null);
                  }}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                    active === cat
                      ? "border-brand-gold bg-brand-gold text-white shadow-md shadow-brand-gold/30"
                      : "border-transparent bg-surface-muted text-brand-navy hover:border-brand-gold/40 hover:bg-brand-gold/10"
                  )}
                >
                  {cat}
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      active === cat ? "text-white/80" : "text-gray-400"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            key={active}
            className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]"
          >
            {images.map((img, idx) => (
              <figure
                key={img.src + img.caption}
                onClick={() => setLightbox(idx)}
                className="group relative mb-4 cursor-zoom-in overflow-hidden rounded break-inside-avoid shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-goldBright">
                    {img.category}
                  </div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {img.caption}
                  </div>
                </figcaption>
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M18 8a6 6 0 1 0-11.3 3.3L3 15.6A1 1 0 0 0 4.4 17l4.3-3.7A6 6 0 1 0 18 8Zm-5 0a1 1 0 0 1-1 1H9v1h3a1 1 0 1 1 0 2H9v1h2a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2v1H8v2h4a1 1 0 0 1 1 1Z" />
                  </svg>
                </span>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && images[lightbox] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <figure
            className="animate-gallery-fade relative max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightbox].src}
              alt={images[lightbox].caption}
              className="max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-goldBright">
                {images[lightbox].category}
              </div>
              <div className="mt-1 text-lg text-white">
                {images[lightbox].caption}
              </div>
              <div className="mt-1 text-xs text-gray-300">
                {lightbox + 1} of {images.length}
              </div>
            </figcaption>
          </figure>

          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Close gallery"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 0 1 .02 1.06L8.832 10l3.978 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.21a.75.75 0 0 1 0-1.08l4.5-4.21a.75.75 0 0 1 1.06.02Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.19 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.21a.75.75 0 0 1 0 1.08l-4.5 4.21a.75.75 0 0 1-1.06-.02Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}