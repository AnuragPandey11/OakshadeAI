// src/components/ui/oakshade-hero.jsx
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import ShaderCanvas from "./shader-canvas";
import Magnetic from "./magnetic";
import RollLabel from "./roll-label";
import { MaskedText, FadeIn, EASE_OUT } from "./reveal";
import { smokeShader } from "../../lib/shaders";
import { INTRO_HERO_DELAY, introPending } from "../../lib/intro";
import { scrollToSection } from "../../lib/smooth-scroll";
import { homeHero } from "../../utils/heroData";

// Feather the video's rectangular edges so it melts into the section
// background instead of showing a hard box. Horizontal + vertical gradients
// composited together fade all four edges.
// Each edge stays fully transparent for its first 2%: starting the fade at
// exactly 0% let the video's outermost pixel column leak through as a 1px
// hairline once the box is scaled (lg:scale-[1.12]).
const FEATHER =
  "linear-gradient(to right, transparent 0%, transparent 2%, #000 12%, #000 88%, transparent 98%), " +
  "linear-gradient(to bottom, transparent 0%, transparent 2%, #000 13%, #000 87%, transparent 98%)";

const featherStyle = {
  WebkitMaskImage: FEATHER,
  maskImage: FEATHER,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

// #bcbcbc as luminance — the smoke drifts a few percent either side of the
// section's flat grey, so the feathered video edges still blend into it.
const SMOKE = { u_base: 0.737, u_amp: 0.05 };


export function OakshadeHero() {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  // On the first visit the logo intro covers the hero — hold every reveal
  // until its curtain lifts. Read once, so later visits to Home don't wait.
  const [wait] = useState(() => (introPending() ? INTRO_HERO_DELAY : 0));

  // Scroll-out parallax: the video sinks and shrinks, the copy drifts up.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#bcbcbc] lg:h-screen"
    >
      <ShaderCanvas fragment={smokeShader} uniforms={SMOKE} />
      {/* Soft seam: the grey dissolves into the white section below rather
          than ending on a hard line. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white md:h-40" />

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col items-center gap-5 px-6 pb-12 pt-24 lg:h-full lg:flex-row lg:items-center lg:gap-10 lg:pb-0 lg:pt-0">
        {/* Left — text */}
        {/* Left padding on lg+ only — keeps the copy off the viewport edge on
            wide screens without narrowing the centered mobile layout. */}
        <motion.div
          style={reduce ? undefined : { y: textY, opacity: fade }}
          className="order-2 w-full text-center lg:order-1 lg:w-[48%] lg:pl-10 lg:text-left xl:pl-16"
        >
          <FadeIn
            as="p"
            trigger="mount"
            delay={wait + 0.1}
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-600 sm:text-xs"
          >
            {homeHero.eyebrow}
          </FadeIn>
          <MaskedText
            as="h1"
            trigger="mount"
            delay={wait + 0.2}
            text={homeHero.headline}
            className="mb-5 text-3xl font-bold leading-[1.08] tracking-tight text-neutral-900 sm:text-4xl md:text-5xl xl:text-6xl"
          />
          <FadeIn
            as="p"
            trigger="mount"
            delay={wait + 0.55}
            className="mx-auto max-w-md text-base leading-relaxed text-neutral-700 md:text-lg lg:mx-0"
          >
            {homeHero.body}
          </FadeIn>
          <FadeIn
            trigger="mount"
            delay={wait + 0.8}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToSection(homeHero.primaryCta.target)}
                className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-neutral-700"
              >
                <RollLabel>{homeHero.primaryCta.label}</RollLabel>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => scrollToSection(homeHero.secondaryCta.target)}
                className="group inline-flex items-center rounded-full border border-neutral-900/15 bg-white/40 px-7 py-3.5 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition-colors hover:bg-white/70"
              >
                <RollLabel>{homeHero.secondaryCta.label}</RollLabel>
              </button>
            </Magnetic>
          </FadeIn>
        </motion.div>

        {/* Right — video, cropped (4:3) + enlarged to fill the space; feathered
            to blend. Three layers on purpose: Framer's inline transform would
            override Tailwind's lg:scale-[1.12], so the parallax and the intro
            each get their own wrapper and the scaled box stays transform-free. */}
        <motion.div
          style={reduce ? undefined : { y: videoY, scale: videoScale, opacity: fade }}
          className="order-1 flex w-full justify-center lg:order-2 lg:w-[52%]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: wait }}
            className="w-full"
          >
            {/* No overflow-hidden here: the video already fits the box
                (object-cover), and clipping a scaled layer left a 1px
                compositing seam along its left edge. */}
            <div className="relative aspect-[4/3] w-full lg:scale-[1.12]">
              <video
                className="absolute inset-0 h-full w-full object-cover object-center"
                style={featherStyle}
                src="/media/oakshade-hero.mp4"
                poster="/media/oakshade-hero-poster.jpg"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default OakshadeHero;
