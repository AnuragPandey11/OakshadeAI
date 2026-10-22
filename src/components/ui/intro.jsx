// src/components/ui/intro.jsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "./reveal";
import { finishIntro, introPending, markIntroSeen } from "../../lib/intro";
import { lockScroll, unlockScroll } from "../../lib/smooth-scroll";
import { brandConfig } from "../../utils/brandConfig";

// How long the logo holds before the curtain lifts (ms).
const HOLD = 950;
const CURTAIN = { duration: 0.75, ease: [0.76, 0, 0.24, 1] };

/**
 * Intro — the first-visit logo beat. The tree mark eases in out of a blur,
 * the name rises letter by letter over a hairline that fills, then the whole
 * panel lifts like a curtain to reveal the hero underneath (same grey, so the
 * hand-off is seamless). See lib/intro.js for when it plays.
 */
export default function Intro() {
  const [show, setShow] = useState(introPending);

  useEffect(() => {
    if (!show) return;
    markIntroSeen();
    lockScroll();
    const timer = setTimeout(() => setShow(false), HOLD);
    return () => {
      clearTimeout(timer);
      unlockScroll();
    };
  }, [show]);

  const letters = brandConfig.name.toUpperCase().split("");

  return (
    <AnimatePresence onExitComplete={finishIntro}>
      {show && (
        <motion.div
          key="intro"
          aria-hidden="true"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={CURTAIN}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#bcbcbc]"
        >
          <motion.div
            exit={{ y: -60, opacity: 0 }}
            transition={CURTAIN}
            className="flex flex-col items-center"
          >
            <motion.img
              src="/media/oakshade-mark.png"
              alt=""
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
              className="h-24 w-auto md:h-28"
            />

            {/* -mr cancels the trailing letter-spacing after the last letter,
                which would otherwise nudge the name off-centre. */}
            <div className="-mr-[0.35em] mt-5 flex overflow-hidden text-sm font-bold tracking-[0.35em] text-neutral-900 md:text-base">
              {letters.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.2 + i * 0.03 }}
                  className="inline-block whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <div className="mt-6 h-px w-40 overflow-hidden bg-neutral-900/15">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD / 1000, ease: [0.65, 0, 0.35, 1] }}
                className="h-full origin-left bg-neutral-900"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
