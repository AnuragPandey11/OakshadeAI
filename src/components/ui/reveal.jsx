// src/components/ui/reveal.jsx
import { Fragment, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../lib/utils";

export const EASE_OUT = [0.22, 1, 0.36, 1];
const EASE_IN_OUT = [0.76, 0, 0.24, 1];

// Serif italic for *accented* words in headlines (Playfair against Inter).
export const ACCENT_CLASS = "font-serif font-medium italic tracking-normal";

/**
 * Splits copy into words, honouring *asterisk* accents — a single word
 * ("*moves*") or a run ("*built to last*"). Punctuation after the closing
 * asterisk stays upright: "*shipped*." → { text: "shipped", trail: "." }.
 */
export function parseAccents(text) {
  let on = false;
  return text.split(" ").map((raw) => {
    let word = raw;
    if (word.startsWith("*")) {
      on = true;
      word = word.slice(1);
    }
    const accent = on;
    let trail = "";
    const close = word.match(/^(.*?)\*([^*]*)$/);
    if (close) {
      word = close[1];
      trail = close[2];
      on = false;
    }
    return { text: word, trail, accent };
  });
}

/** Renders one parsed word (accent styling + upright trailing punctuation). */
export function AccentWord({ word }) {
  return (
    <>
      {word.accent ? <span className={ACCENT_CLASS}>{word.text}</span> : word.text}
      {word.trail}
    </>
  );
}

// Plays on mount (`trigger="mount"`, for heroes) or once scrolled into view.
function triggerProps(trigger) {
  return trigger === "mount"
    ? { initial: "hidden", animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 } };
}

const wordVariants = {
  hidden: { y: "110%" },
  visible: (delay) => ({ y: "0%", transition: { duration: 0.9, ease: EASE_OUT, delay } }),
};

/**
 * MaskedText — a headline whose words each slide up out of their own mask, in
 * a quick stagger. Masking per word (not per line) keeps natural wrapping at
 * every screen width. Supports *accent* words (see parseAccents).
 *
 * The trigger sits on an untransformed wrapper, not the sliding words: a word
 * parked below its overflow-hidden mask never "intersects", so whileInView on
 * it would never fire. The pb/-mb pair gives descenders room inside the mask.
 */
export function MaskedText({ text, as: Tag = "h2", className, delay = 0, stagger = 0.04, trigger = "view" }) {
  const words = parseAccents(text);
  return (
    <Tag className={className}>
      <motion.span className="block" {...triggerProps(trigger)}>
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] pr-[0.06em] align-top">
              <motion.span className="inline-block" variants={wordVariants} custom={delay + i * stagger}>
                <AccentWord word={word} />
              </motion.span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

const fadeVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT, delay } }),
};

/** FadeIn — fade + small rise. `as` picks the element ("p", "div", …). */
export function FadeIn({ as = "div", children, className, delay = 0, trigger = "view" }) {
  const Component = motion[as];
  return (
    <Component className={className} variants={fadeVariants} custom={delay} {...triggerProps(trigger)}>
      {children}
    </Component>
  );
}

const ruleVariants = {
  hidden: { scaleX: 0 },
  visible: (delay) => ({ scaleX: 1, transition: { duration: 0.7, ease: EASE_OUT, delay } }),
};

/**
 * Eyebrow — the small uppercase label above a heading, led by a hairline rule
 * that draws in before the text fades up. Centred eyebrows get a rule on both
 * sides, growing outward. Pass size / tracking / colour / margin via className.
 */
export function Eyebrow({ children, className, align = "left", delay = 0, trigger = "view" }) {
  const centered = align === "center";
  return (
    <motion.p
      className={cn("flex items-center gap-3 font-semibold uppercase", centered && "justify-center", className)}
      {...triggerProps(trigger)}
    >
      <motion.span
        aria-hidden="true"
        variants={ruleVariants}
        custom={delay}
        className={cn("h-px w-8 bg-current", centered ? "origin-right" : "origin-left")}
      />
      <motion.span variants={fadeVariants} custom={delay + 0.2}>
        {children}
      </motion.span>
      {centered && (
        <motion.span
          aria-hidden="true"
          variants={ruleVariants}
          custom={delay}
          className="h-px w-8 origin-left bg-current"
        />
      )}
    </motion.p>
  );
}

/**
 * ClipReveal — unmasks its content with a clip-path curtain: rising from the
 * bottom (default) or dropping from the top (`from="top"`). Size it via
 * className like the element it wraps.
 *
 * Visibility is watched on an unclipped outer wrapper: an element clipped to
 * nothing never counts as "in view", so whileInView on the clipped layer
 * itself would never fire.
 */
export function ClipReveal({ children, className, delay = 0, from = "bottom", trigger = "view" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const show = trigger === "mount" || inView;
  const variants = {
    hidden: { clipPath: from === "top" ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration: 1.1, ease: EASE_IN_OUT, delay },
    },
  };
  return (
    <div ref={ref} className={className}>
      <motion.div
        className="relative h-full w-full"
        variants={variants}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    </div>
  );
}
