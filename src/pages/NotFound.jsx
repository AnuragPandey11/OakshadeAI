// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ShaderCanvas from "../components/ui/shader-canvas";
import Magnetic from "../components/ui/magnetic";
import RollLabel from "../components/ui/roll-label";
import { Eyebrow, FadeIn, MaskedText, EASE_OUT } from "../components/ui/reveal";
import { smokeShader } from "../lib/shaders";
import { notFoundHero } from "../utils/heroData";

// Same grey + smoke as the home hero, so a wrong turn still feels on-brand.
const SMOKE = { u_base: 0.737, u_amp: 0.05 };

/**
 * NotFound — the 404 page, for any unknown URL (catch-all route) and for an
 * unknown /services/:slug. Copy lives in `notFoundHero` (utils/heroData.js).
 */
export default function NotFound() {
  const { eyebrow, headline, body, primaryCta, secondaryCta } = notFoundHero;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#bcbcbc] px-6 pb-20 pt-32">
      <ShaderCanvas fragment={smokeShader} uniforms={SMOKE} />

      {/* Giant "404" watermark. The centring translate sits on a plain div;
          the rise-in animates the inner span (Framer's inline transform would
          otherwise wipe out Tailwind's -translate-y-1/2). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none">
        <motion.span
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
          className="block text-center text-[40vw] font-bold leading-none tracking-tighter text-white/25 lg:text-[32vw]"
        >
          404
        </motion.span>
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Eyebrow
          align="center"
          trigger="mount"
          className="mb-4 text-xs tracking-[0.25em] text-neutral-600 sm:text-sm"
        >
          {eyebrow}
        </Eyebrow>
        <MaskedText
          as="h1"
          trigger="mount"
          delay={0.15}
          text={headline}
          className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight text-neutral-900 [text-wrap:balance] md:text-6xl"
        />
        <FadeIn
          as="p"
          trigger="mount"
          delay={0.45}
          className="mx-auto max-w-md text-base leading-relaxed text-neutral-700 md:text-lg"
        >
          {body}
        </FadeIn>

        <FadeIn trigger="mount" delay={0.65} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <Link
              to={primaryCta.to}
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-neutral-700"
            >
              <RollLabel>{primaryCta.label}</RollLabel>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              to={secondaryCta.to}
              className="group inline-flex items-center rounded-full border border-neutral-900/15 bg-white/40 px-7 py-3.5 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition-colors hover:bg-white/70"
            >
              <RollLabel>{secondaryCta.label}</RollLabel>
            </Link>
          </Magnetic>
        </FadeIn>
      </div>
    </section>
  );
}
