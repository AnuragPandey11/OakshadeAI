// src/components/ui/our-process.jsx
import { useRef } from "react";
import { motion } from "framer-motion";
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

export default function OurProcess() {
  const gridRef = useRef(null);

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

        {/* Tablet / desktop: staggered grid */}
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
