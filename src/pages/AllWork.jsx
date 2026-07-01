// src/pages/AllWork.jsx
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { allProjects, projectCategories } from "../utils/projectsData";

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
      <section className="bg-[var(--color-neutral-cream)] px-6 pb-14 pt-32 md:pb-16 md:pt-40">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
            Our Work
          </p>
          <h1 className="mb-5 font-bold tracking-tight text-4xl leading-tight text-neutral-900 md:text-6xl">
            Selected projects
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">
            A look at the products, platforms, and experiences we've helped bring
            to life across industries.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="px-6 pt-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
              }`}
            >
              {cat}
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
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-neutral-900">
                    {project.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-neutral-500">
                    {project.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]">
                    View project
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
