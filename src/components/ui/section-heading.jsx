// src/components/ui/section-heading.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { MaskedText, FadeIn, Eyebrow } from "./reveal";
import Magnetic from "./magnetic";
import RollLabel from "./roll-label";

/**
 * SectionHeading — eyebrow + title on the left, an optional CTA button on the
 * right (stacks on mobile). `align="center"` centres the eyebrow + title (used
 * without a CTA); `tone="dark"` is for headings on a dark section. Titles may
 * use *asterisk* serif accents. Reveals itself on scroll. Shared by the home
 * Services, Process and Work sections.
 */
export default function SectionHeading({ eyebrow, title, ctaLabel, ctaTo, align = "left", tone = "light" }) {
  const centered = align === "center";
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-14",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      )}
    >
      <div>
        <Eyebrow
          align={align}
          className={cn("mb-3 text-sm tracking-[0.2em]", dark ? "text-neutral-500" : "text-neutral-400")}
        >
          {eyebrow}
        </Eyebrow>
        <MaskedText
          text={title}
          delay={0.1}
          className={cn(
            "text-3xl font-bold tracking-tight md:text-5xl",
            dark ? "text-white" : "text-neutral-900"
          )}
        />
      </div>

      {ctaLabel && ctaTo && (
        <FadeIn delay={0.3} className="w-fit shrink-0">
          <Magnetic>
            <Link
              to={ctaTo}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors",
                dark
                  ? "bg-white text-neutral-900 hover:bg-neutral-200"
                  : "bg-neutral-900 text-white hover:bg-neutral-700"
              )}
            >
              <RollLabel>{ctaLabel}</RollLabel>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
        </FadeIn>
      )}
    </div>
  );
}
