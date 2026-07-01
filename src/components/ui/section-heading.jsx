// src/components/ui/section-heading.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * SectionHeading — eyebrow + title on the left, an optional CTA button on the
 * right (stacks on mobile). Shared by the home "Our Services" and "Our Work"
 * sections.
 */
export default function SectionHeading({ eyebrow, title, ctaLabel, ctaTo }) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          {title}
        </h2>
      </div>

      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
