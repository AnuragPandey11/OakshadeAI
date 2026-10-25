// src/components/ui/our-work.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedTabs } from "./animated-tabs";
import SectionHeading from "./section-heading";
import ShaderImage from "./shader-image";
import BrowserMockup from "./browser-mockup";
import RollLabel from "./roll-label";
import { ClipReveal } from "./reveal";
import { projectGroups } from "../../utils/projectsData";

// Text half of a project entry (the image is rendered by ProjectSlider so it
// can persist across entries and wipe between them).
function ProjectText({ title, description, link, category, status, meta, blurb, tags }) {
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {category && (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            {category}
          </span>
        )}
        {status && (
          <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/70">
            {status}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
      {blurb && (
        <p className="text-sm font-medium text-white/90">
          {blurb}
        </p>
      )}
      <p className="text-sm leading-relaxed text-gray-300">{description}</p>
      {tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/75"
            >
              {t}
            </span>
          ))}
        </div>
      ) : (
        meta && <p className="text-xs text-white/50">{meta}</p>
      )}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
        >
          <RollLabel>Visit Project</RollLabel>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      ) : (
        <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/70">
          Enterprise Fleet CMS
        </span>
      )}
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
      {/* Card — image 70% (WebGL wipe between entries), text 30% (slides) */}
      <div className="grid flex-1 grid-cols-1 items-stretch gap-6 md:grid-cols-[7fr_3fr]">
        <ClipReveal className="h-64 w-full md:h-[420px]">
          {/* The image opens the project too (same link as "Visit Project");
              hovering it shows the "View" cursor. */}
          <a
            href={current.link || undefined}
            target={current.link ? "_blank" : undefined}
            rel={current.link ? "noopener noreferrer" : undefined}
            data-cursor="View"
            aria-label={current.link ? `Visit ${current.title}` : current.title}
            className="relative block h-full w-full overflow-hidden rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.2)]"
          >
            <ShaderImage
              src={current.image}
              alt={current.title}
              direction={dir}
              className="h-full w-full"
            />
            <AnimatePresence mode="wait">
              {current.video && (
                <motion.div
                  key={`video-${current.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0 h-full w-full overflow-hidden rounded-lg"
                >
                  <BrowserMockup
                    video={current.video}
                    videoMp4={current.videoMp4}
                    poster={current.image}
                    title={current.title}
                    autoPlay={true}
                    hoverPlay={false}
                    className="h-full w-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </a>
        </ClipReveal>
        <div className="relative">
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
              <ProjectText {...current} />
            </motion.div>
          </AnimatePresence>
        </div>
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
    // A near-black sheet with a curved top that slides over the end of the
    // Process section (-mt), giving the image wipe a dark stage.
    <section
      id="work"
      className="relative z-10 -mt-14 w-full scroll-mt-24 rounded-t-[2.5rem] bg-neutral-950 md:-mt-20 md:rounded-t-[4rem]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {/* Left: heading — Right: all-work button */}
        <SectionHeading
          eyebrow="Our Work"
          title="Products we've designed, built, and *shipped*."
          ctaLabel="All our work"
          ctaTo="/work"
          tone="dark"
        />

        <AnimatedTabs tabs={tabs} className="mx-auto max-w-5xl" />
      </div>
    </section>
  );
}
