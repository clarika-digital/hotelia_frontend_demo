"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlides } from "@/data/site";
import { cn } from "@/lib/cn";

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const count = heroSlides.length;

  useEffect(() => {
    const t = setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, 6000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <div className="hero-slider">
      <div className="hero-viewport">
        <div
          className="hero-track"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {heroSlides.map((slide, i) => (
            <div className="hero-slide" key={slide.image}>
              <div
                className="hero-bg"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="hero-shade" />
              <div className="hero-inner">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-sub">{slide.subtitle}</p>
                <Link href={slide.href} className="hero-link">
                  {slide.cta ?? "Learn More"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="hero-arrow hero-prev"
        aria-label="Previous"
        onClick={() => setActive((i) => (i - 1 + count) % count)}
      >
        &#8249;
      </button>
      <button
        className="hero-arrow hero-next"
        aria-label="Next"
        onClick={() => setActive((i) => (i + 1) % count)}
      >
        &#8250;
      </button>
      <div className="hero-dots">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={cn("hero-dot", i === active && "active")}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  );
}
