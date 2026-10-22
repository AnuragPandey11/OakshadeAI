// src/pages/AllWork.jsx
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { allProjects, projectCategories } from "../utils/projectsData";
import { pageHeroes } from "../utils/heroData";
import PageHero from "../components/ui/page-hero";
import { ClipReveal } from "../components/ui/reveal";
import { Spotlight, trackSpotlight } from "../components/ui/spotlight";

export default function AllWork() {
  const [category, setCategory] = useState("All");

  const filtered = useMemo(
    () =>
      category === "All"
        ? allProjects
        : allProjects.filter((p) => p.category === category),
    [category]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <PageHero {...pageHeroes.work} className="pb-14 md:pb-16" />

      {/* Filter */}
      <section className="pt-12">
        <div data-lenis-prevent-horizontal className="mx-auto flex max-w-6xl flex-nowrap items-center gap-2 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`relative shrink-0 whitespace-nowrap rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                category === cat
                  ? "border-transparent text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
              }`}
            >
              {/* The dark pill slides between filters (shared layout). */}
              {category === cat && (
                <motion.span
                  layoutId="work-filter-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-neutral-900"
                />
              )}
              <span className="relative">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 py-14 md:py-16">
        <motion.div
          layout
          className="mx-auto grid max-w-6xl gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                // Lift via whileHover: Framer's inline transform on this motion
                // element overrode the old Tailwind hover:-translate-y-1.
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onPointerMove={trackSpotlight}
                className="group relative flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                <Spotlight />
                <div data-cursor="View" className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
                  <ClipReveal className="h-full w-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </ClipReveal>
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                  {project.status && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur-sm">
                      In development
                    </span>
                  )}
                </div>
                <div className="relative flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-neutral-900">
                    {project.title}
                  </h3>
                  <p className="mb-2 text-sm leading-relaxed text-neutral-500">
                    {project.description}
                  </p>
                  <p className="mb-4 flex-1 text-xs text-neutral-400">
                    {project.meta ?? project.status ?? ""}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]">
                    <span className="link-underline">View project</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-neutral-400">
            No projects in this category yet.
          </p>
        )}
      </section>
    </div>
  );
}
