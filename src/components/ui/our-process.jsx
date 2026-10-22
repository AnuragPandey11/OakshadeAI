// src/components/ui/our-process.jsx
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ProductHighlightCard } from "./product-card";
import Carousel from "./carousel";
import SectionHeading from "./section-heading";
import { EASE_OUT } from "./reveal";
import { Search, PenTool, Code2, CheckCircle2, Rocket, Users } from "lucide-react";
import { processSteps } from "../../utils/processData";

// lucide icon per step, keyed by the step's `iconName` in processData.
const iconMap = { Search, PenTool, Code2, CheckCircle2, Rocket, Users };

// Each card uses its own step icon twice: small beside the "Step 0N" label, and
// oversized as the corner watermark (this replaced the brand mark, which was
// identical on all six cards). The per-step photos in processData are used by
// the FeatureCarousel on the service pages.
function ProcessCard(s) {
  const Icon = iconMap[s.iconName] ?? Search;
  return (
    <ProductHighlightCard
      key={s.id}
      category={s.name}
      categoryIcon={<Icon className="h-5 w-5" />}
      title={s.title}
      description={s.description}
      media={<Icon className="h-44 w-44 text-neutral-900/[0.14]" strokeWidth={1.25} />}
    />
  );
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
// Entrance lives on a wrapper — the card itself owns rotateX/Y for its tilt.
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

// One node on the rail: fills in once scroll progress reaches its step.
function RailNode({ progress, index, count, step }) {
  const at = index / (count - 1);
  const fill = useTransform(progress, [at - 0.04, at], [0, 1]);
  const label = useTransform(progress, [at - 0.04, at], [0.45, 1]);
  return (
    <div
      className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
      style={{ left: `${at * 100}%` }}
    >
      <span className="relative flex h-3 w-3 items-center justify-center rounded-full border border-neutral-400 bg-neutral-200">
        <motion.span style={{ scale: fill }} className="h-2 w-2 rounded-full bg-neutral-900" />
      </span>
      <motion.span
        style={{ opacity: label }}
        className="mt-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-900"
      >
        {String(index + 1).padStart(2, "0")}
        <span className="hidden lg:inline"> · {step.title}</span>
      </motion.span>
    </div>
  );
}

// Timeline above the grid; the line draws itself as the cards scroll past.
function ProcessRail({ progress }) {
  return (
    <div className="sticky top-28 z-10 mb-10 hidden rounded-full bg-neutral-200/80 px-10 pb-8 pt-4 backdrop-blur-md sm:block lg:px-16">
      <div className="relative h-3">
        <div className="absolute inset-x-0 top-[5px] h-[2px] bg-neutral-300" />
        <motion.div
          style={{ scaleX: progress }}
          className="absolute inset-x-0 top-[5px] h-[2px] origin-left bg-neutral-900"
        />
        {processSteps.map((step, i) => (
          <RailNode key={step.id} progress={progress} index={i} count={processSteps.length} step={step} />
        ))}
      </div>
    </div>
  );
}

export default function OurProcess() {
  const gridRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start 75%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    // White fades into the grey over the first 160px, so the section edge
    // isn't a hard line. The extra bottom padding sits under the Work
    // section's curved sheet, which overlaps it.
    <section
      id="process"
      className="w-full scroll-mt-24"
      style={{ background: "linear-gradient(to bottom, #ffffff 0, #e5e5e5 160px)" }}
    >
      <div className="mx-auto max-w-6xl px-6 pb-32 pt-20 md:pb-44 md:pt-28">
        <SectionHeading eyebrow="Our Process" title="From first brief to *live* product" align="center" />

        {/* Tablet / desktop: rail + staggered grid */}
        <ProcessRail progress={progress} />
        <motion.div
          ref={gridRef}
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="hidden justify-items-center gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3"
        >
          {processSteps.map((s) => (
            <motion.div key={s.id} variants={cardVariants} className="flex w-full justify-center">
              {ProcessCard(s)}
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile: swipeable slider */}
        <div className="sm:hidden">
          <Carousel itemClassName="w-[85%]">{processSteps.map(ProcessCard)}</Carousel>
        </div>
      </div>
    </section>
  );
}
