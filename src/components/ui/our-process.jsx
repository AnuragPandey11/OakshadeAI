// src/components/ui/our-process.jsx
import { ProductHighlightCard } from "./product-card";
import Carousel from "./carousel";
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

export default function OurProcess() {
  return (
    <section id="process" className="w-full scroll-mt-24 bg-neutral-200">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Our Process
        </p>
        <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          From first brief to live product
        </h2>

        {/* Tablet / desktop: static grid (unchanged) */}
        <div className="hidden justify-items-center gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map(ProcessCard)}
        </div>

        {/* Mobile: swipeable slider */}
        <div className="sm:hidden">
          <Carousel itemClassName="w-[85%]">{processSteps.map(ProcessCard)}</Carousel>
        </div>
      </div>
    </section>
  );
}
