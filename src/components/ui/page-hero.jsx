// src/components/ui/page-hero.jsx
import ShaderCanvas from "./shader-canvas";
import { MaskedText, FadeIn, Eyebrow } from "./reveal";
import { smokeShader } from "../../lib/shaders";
import { cn } from "../../lib/utils";

// --color-neutral-cream (#f5f5f5) as luminance, with a lighter touch than the
// home hero so the header copy stays crisp.
const CREAM_SMOKE = { u_base: 0.961, u_amp: 0.025 };

/**
 * PageHero — the centred eyebrow / headline / intro block that opens the
 * /services and /work pages, over a soft smoke shader. Copy comes from
 * `pageHeroes` in utils/heroData.js. Pass bottom padding via `className`.
 */
export default function PageHero({ eyebrow, headline, body, className }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[var(--color-neutral-cream)] px-6 pt-32 md:pt-40",
        className
      )}
    >
      <ShaderCanvas fragment={smokeShader} uniforms={CREAM_SMOKE} />
      <div className="relative mx-auto max-w-6xl text-center">
        <Eyebrow
          align="center"
          trigger="mount"
          className="mb-3 text-sm tracking-[0.2em] text-[var(--color-secondary)]"
        >
          {eyebrow}
        </Eyebrow>
        <MaskedText
          as="h1"
          trigger="mount"
          delay={0.1}
          text={headline}
          className="mb-5 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-6xl"
        />
        <FadeIn
          as="p"
          trigger="mount"
          delay={0.35}
          className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg"
        >
          {body}
        </FadeIn>
      </div>
    </section>
  );
}
