// src/pages/AllServices.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rocket,
  Smartphone,
  Globe,
  BrainCircuit,
  Cloud,
  PenTool,
  ArrowRight,
} from "lucide-react";
import { services } from "../utils/servicesData";

// Maps the string `iconName` from the data file to a lucide icon component.
const iconMap = { Rocket, Smartphone, Globe, BrainCircuit, Cloud, PenTool };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function AllServices() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[var(--color-neutral-cream)] px-6 pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
            What we do
          </p>
          <h1 className="mb-5 font-bold tracking-tight text-4xl leading-tight text-neutral-900 md:text-6xl">
            Our Services
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-500 md:text-lg">
            End-to-end product, engineering, and design services — pick a
            capability below to explore how we can help.
          </p>
        </div>
      </section>

      {/* Cards grid */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = iconMap[s.iconName] ?? Rocket;
            return (
              <motion.div
                key={s.slug}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Link
                  to={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-cream)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </div>

                  <h3 className="mb-2 text-xl font-bold tracking-tight text-neutral-900">
                    {s.title}
                  </h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-500">
                    {s.description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
