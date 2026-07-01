// src/components/ui/our-process.jsx
import { ProductHighlightCard } from "./product-card";
import Carousel from "./carousel";
import { Search, PenTool, Code2, CheckCircle2, Rocket, LifeBuoy } from "lucide-react";
import { processSteps } from "../../utils/processData";

// lucide icon per step, keyed by the step's `iconName` in processData.
const iconMap = { Search, PenTool, Code2, CheckCircle2, Rocket, LifeBuoy };

// The home cards use the brand mark as their decorative corner image; the
// per-step photos in processData are used by the FeatureCarousel on the
// service pages.
const CARD_IMAGE = "/media/logo.png";

function ProcessCard(s) {
  const Icon = iconMap[s.iconName] ?? Search;
  return (
    <ProductHighlightCard
      key={s.id}
      category={s.name}
      categoryIcon={<Icon className="h-5 w-5" />}
      title={s.title}
      description={s.description}
      imageSrc={CARD_IMAGE}
      imageAlt={s.title}
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
          Lorem ipsum dolor sit amet
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
