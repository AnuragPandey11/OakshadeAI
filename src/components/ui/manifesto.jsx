// src/components/ui/manifesto.jsx
import { Fragment, useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { AccentWord, Eyebrow, EASE_OUT, parseAccents } from "./reveal";
import { manifesto, stats } from "../../utils/aboutData";

// One word of the statement: dim until scroll progress reaches its slot.
function ScrollWord({ word, progress, range, still }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={still ? undefined : { opacity }}>
      <AccentWord word={word} />
    </motion.span>
  );
}

// Counts from 0 to `value` the first time it scrolls into view. Writes the
// text directly (no re-render per frame).
function CountUp({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      ref.current.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

/**
 * Manifesto — "Why Oakshade": a large statement that darkens word by word as
 * it scrolls through the viewport, then a row of count-up stats. Copy and
 * numbers live in utils/aboutData.js.
 */
export default function Manifesto() {
  const textRef = useRef(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: textRef, offset: ["start 85%", "end 45%"] });
  const words = parseAccents(manifesto.statement);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Eyebrow className="mb-8 text-sm tracking-[0.2em] text-neutral-400">
          {manifesto.eyebrow}
        </Eyebrow>

        <p
          ref={textRef}
          className="max-w-5xl text-3xl font-semibold leading-[1.2] tracking-tight text-neutral-900 md:text-5xl md:leading-[1.15]"
        >
          {words.map((word, i) => (
            <Fragment key={i}>
              <ScrollWord
                word={word}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1) / words.length]}
                still={still}
              />
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
        </p>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-24 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label}>
              {/* Hairline that draws across before the number counts up. */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.1 }}
                className="mb-5 h-px origin-left bg-neutral-300"
              />
              <p className="text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
