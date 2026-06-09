// src/components/ui/our-process.jsx
import { ProductHighlightCard } from "./product-card";
import { Search, PenTool, Code2, CheckCircle2, Rocket, LifeBuoy } from "lucide-react";

// NOTE: `image` points at /public assets. Drop your own image/GIF in /public
// and swap the path (e.g. "/process-discover.gif") to use it inside a card.
const steps = [
  {
    category: "Step 01",
    icon: <Search className="h-5 w-5" />,
    title: "Lorem ipsum",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    image: "/media/logo.png",
  },
  {
    category: "Step 02",
    icon: <PenTool className="h-5 w-5" />,
    title: "Dolor sit",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    image: "/media/logo.png",
  },
  {
    category: "Step 03",
    icon: <Code2 className="h-5 w-5" />,
    title: "Consectetur",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.",
    image: "/media/logo.png",
  },
  {
    category: "Step 04",
    icon: <CheckCircle2 className="h-5 w-5" />,
    title: "Adipiscing",
    description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
    image: "/media/logo.png",
  },
  {
    category: "Step 05",
    icon: <Rocket className="h-5 w-5" />,
    title: "Sed eiusmod",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium dolor.",
    image: "/media/logo.png",
  },
  {
    category: "Step 06",
    icon: <LifeBuoy className="h-5 w-5" />,
    title: "Tempor",
    description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed.",
    image: "/media/logo.png",
  },
];

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

        <div className="grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <ProductHighlightCard
              key={s.category}
              category={s.category}
              categoryIcon={s.icon}
              title={s.title}
              description={s.description}
              imageSrc={s.image}
              imageAlt={s.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
