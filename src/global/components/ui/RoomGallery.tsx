"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface RoomGalleryProps {
  images: string[];
  title: string;
}

export function RoomGallery({ images, title }: RoomGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

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
    <div>
      <button
        type="button"
        onClick={() => setLightbox(active)}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded bg-surface-muted p-0"
        aria-label={`Expand ${title} image ${active + 1}`}
      >
        <img
          key={active}
          src={images[active]}
          alt={`${title} — image ${active + 1} of ${images.length}`}
          className="animate-gallery-fade aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-brand-navy backdrop-blur">
          {active + 1} / {images.length} &middot; Click to expand
        </span>
      </button>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={img + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${title} image ${i + 1}`}
            aria-pressed={i === active}
            className={cn(
              "overflow-hidden rounded bg-surface-muted transition-all duration-200",
              i === active
                ? "ring-2 ring-brand-gold ring-offset-2"
                : "opacity-70 hover:opacity-100"
            )}
          >
            <img
              src={img}
              alt=""
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image lightbox`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <figure
            className="animate-gallery-fade relative max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightbox]}
              alt={`${title} — image ${lightbox + 1} of ${images.length}`}
              className="max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center text-sm text-gray-300">
              {lightbox + 1} of {images.length}
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
    </div>
  );
}
