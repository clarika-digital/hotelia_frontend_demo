"use client";

import { useEffect, useState } from "react";
import type { Room } from "@/data/types";
import { cn } from "@/lib/cn";

interface RoomGalleryProps {
  room: Room;
}

export function RoomGallery({ room }: RoomGalleryProps) {
  const images = room.gallery?.length
    ? room.gallery
    : [room.image, room.image, room.image];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + images.length) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, images.length]);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded bg-surface-muted">
        <button
          type="button"
          onClick={() => {
            setLightboxIndex(active);
            setLightbox(true);
          }}
          className="group block h-full w-full cursor-zoom-in"
          aria-label={`Open ${room.title} gallery`}
        >
          <img
            src={images[active]}
            alt={room.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-brand-navy/70 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
            1&ndash;{images.length} of {images.length} photos
          </span>
        </button>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View photo ${i + 1}`}
            className={cn(
              "aspect-[16/10] overflow-hidden rounded bg-surface-muted ring-brand-gold transition-shadow",
              active === i && "ring-2"
            )}
          >
            <img
              src={src}
              alt={`${room.title} photo ${i + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-navyDark/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${room.title} photo viewer`}
          onClick={() => setLightbox(false)}
        >
          <div
            className="animate-gallery-fade relative max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex]}
              alt={`${room.title} photo ${lightboxIndex + 1}`}
              className="max-h-[80vh] w-full rounded object-contain"
            />
            <div className="mt-3 flex items-center justify-between text-sm text-gray-200">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (i) => (i - 1 + images.length) % images.length
                  )
                }
                className="rounded bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
              >
                &larr; Previous
              </button>
              <span>
                {lightboxIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((i) => (i + 1) % images.length)
                }
                className="rounded bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
              >
                Next &rarr;
              </button>
            </div>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute -top-4 right-0 rounded bg-white/10 px-3 py-1.5 text-white hover:bg-white/20"
              aria-label="Close viewer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}