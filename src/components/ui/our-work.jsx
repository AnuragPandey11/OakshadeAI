// src/components/ui/our-work.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedTabs } from "./animated-tabs";
import SectionHeading from "./section-heading";
import { projectGroups } from "../../utils/projectsData";

// A single project card (shared structure across every entry).
function ProjectContent({ title, description, image, link, category }) {
  return (
    <div className="grid h-full grid-cols-1 items-stretch gap-6 md:grid-cols-[7fr_3fr]">
      {/* Image — 70% */}
      <img
        src={image}
        alt={title}
        className="h-64 w-full rounded-lg border-none object-cover shadow-[0_0_20px_rgba(0,0,0,0.2)] md:h-[420px]"
      />

      {/* Text — 30% */}
      <div className="flex flex-col justify-center gap-3">
        {category && (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            {category}
          </span>
        )}
        <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-300">{description}</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
        >
          Visit Project <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

// Slider over one tab's entries — "1 of N" with dots + arrows.
function ProjectSlider({ entries }) {
  const [[index, dir], setState] = useState([0, 0]);
  const count = entries.length;
  const current = entries[index];

  const go = (d) => setState(([i]) => [(i + d + count) % count, d]);
  const jump = (i) => setState(([cur]) => [i, i > cur ? 1 : -1]);

  return (
    <div className="flex h-full flex-col">
      {/* Card */}
      <div className="relative flex-1">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="h-full"
          >
            <ProjectContent {...current} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls — only when a tab holds more than one entry */}
      {count > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => go(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => go(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {entries.map((entry, i) => (
                <button
                  key={entry.id}
                  type="button"
                  aria-label={`Go to project ${i + 1}`}
                  onClick={() => jump(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium tabular-nums text-white/60">
              {String(index + 1).padStart(2, "0")}
              <span className="text-white/30"> / {String(count).padStart(2, "0")}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const tabs = projectGroups.map((group) => ({
  id: group.id,
  label: group.label,
  content: <ProjectSlider entries={group.entries} />,
}));

export default function OurWork() {
  return (
    <section id="work" className="w-full scroll-mt-24 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Left: heading — Right: all-work button */}
        <SectionHeading
          eyebrow="Our Work"
          title="Lorem ipsum dolor sit amet"
          ctaLabel="All our work"
          ctaTo="/work"
        />

        <AnimatedTabs tabs={tabs} className="mx-auto max-w-5xl" />
      </div>
    </section>
  );
}
