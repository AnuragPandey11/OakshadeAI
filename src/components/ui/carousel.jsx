// src/components/ui/carousel.jsx
import { Children, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carousel — a horizontal, scroll-snap track with arrow controls and a dot
 * indicator. Responsive by design: on desktop several slides show at once and
 * on mobile it becomes a one-at-a-time swipeable slider.
 *
 * Control slide width via `itemClassName` (e.g. "w-[85%] sm:w-[300px]").
 */
export default function Carousel({ children, itemClassName = "" }) {
  const slides = Children.toArray(children);
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  const [active, setActive] = useState(0);

  const scrollToIndex = (i) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    itemRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  // Track which slide is most in view (drives the active dot).
  useEffect(() => {
    const root = trackRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemRefs.current.indexOf(entry.target);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { root, threshold: 0.6 }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  const atStart = active === 0;
  const atEnd = active === slides.length - 1;

  return (
    <div className="relative">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((child, i) => (
          <div
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            className={`flex shrink-0 snap-center justify-center ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Arrows (hidden on the smallest screens — swipe + dots take over) */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollToIndex(active - 1)}
        disabled={atStart}
        className="absolute -left-3 top-[42%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-md transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollToIndex(active + 1)}
        disabled={atEnd}
        className="absolute -right-3 top-[42%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-md transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`h-2 rounded-full transition-all ${
              active === i ? "w-6 bg-neutral-900" : "w-2 bg-neutral-300 hover:bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
