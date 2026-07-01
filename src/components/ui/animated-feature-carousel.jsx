// src/components/ui/animated-feature-carousel.jsx
// Adapted from the shadcn "animated-feature-carousel" (TSX/Next.js) to this
// Vite + JSX app: monochrome theme, single image per step, and driven by the
// shared processData so it stays in sync with the home "Our Process" section.
import { forwardRef, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { processSteps } from "../../utils/processData";

const DEFAULT_INTERVAL = 5000;

const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
};

const stepVariants = {
  inactive: { scale: 0.9, opacity: 0.7 },
  active: { scale: 1, opacity: 1 },
};

// Auto-advance through the steps; a manual selection restarts the timer
// (the effect re-runs whenever `current` changes).
function useNumberCycler(totalSteps, interval = DEFAULT_INTERVAL) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const id = setTimeout(
      () => setCurrent((prev) => (prev + 1) % totalSteps),
      interval
    );
    return () => clearTimeout(id);
  }, [current, totalSteps, interval]);
  const setStep = useCallback(
    (index) => setCurrent(index % totalSteps),
    [totalSteps]
  );
  return { current, setStep };
}

const placeholderImage = (text = "Image") =>
  `https://placehold.co/600x400/1a1a1a/ffffff?text=${text}`;

const StepImage = forwardRef(({ src, alt, className, style, ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    src={src}
    className={className}
    style={{ position: "absolute", userSelect: "none", maxWidth: "unset", ...style }}
    onError={(e) => (e.currentTarget.src = placeholderImage(alt))}
    {...props}
  />
));
StepImage.displayName = "StepImage";

const MotionStepImage = motion.create(StepImage);

function StepsNav({ steps, current, onChange }) {
  return (
    <nav aria-label="Progress" className="flex justify-center px-4">
      <ol
        role="list"
        className="flex w-full flex-wrap items-center justify-center gap-2"
      >
        {steps.map((step, idx) => {
          const isCompleted = current > idx;
          const isCurrent = current === idx;
          return (
            <motion.li
              key={step.id ?? step.name}
              initial="inactive"
              animate={isCurrent ? "active" : "inactive"}
              variants={stepVariants}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <button
                type="button"
                onClick={() => onChange(idx)}
                className={cn(
                  "group flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                  isCurrent
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs transition-all duration-300",
                    isCurrent
                      ? "bg-white/25 text-white"
                      : isCompleted
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-200 text-neutral-700 group-hover:bg-neutral-300"
                  )}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </span>
                <span className="hidden sm:inline-block">{step.name}</span>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}

function FeatureCard({ step, steps }) {
  const active = steps[step];
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white">
      <div className="flex min-h-[380px] flex-col gap-8 p-6 md:min-h-[420px] md:flex-row md:items-center md:p-10">
        {/* Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="flex w-full flex-col gap-4 md:w-3/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
            >
              {active.name}
            </motion.div>
            <motion.h3
              className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {active.title}
            </motion.h3>
            <motion.p
              className="text-base leading-relaxed text-neutral-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              {active.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Image */}
        <div className="relative h-[220px] w-full md:h-[340px] md:w-2/5">
          <AnimatePresence mode="wait">
            <MotionStepImage
              key={step}
              alt={active.title}
              src={active.image}
              {...fadeInScale}
              className="inset-0 h-full w-full rounded-2xl border border-neutral-200 object-cover shadow-xl shadow-black/10"
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function FeatureCarousel({ steps = processSteps, interval = DEFAULT_INTERVAL }) {
  const { current, setStep } = useNumberCycler(steps.length, interval);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
      <FeatureCard step={current} steps={steps} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <StepsNav steps={steps} current={current} onChange={setStep} />
      </motion.div>
    </div>
  );
}

export default FeatureCarousel;
