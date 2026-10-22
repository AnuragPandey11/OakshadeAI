// src/pages/ServiceDetail.jsx
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  Rocket,
  Smartphone,
  Globe,
  BrainCircuit,
  Cloud,
  PenTool,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { services, getServiceBySlug } from "../utils/servicesData";
import { FeatureCarousel } from "../components/ui/animated-feature-carousel";
import ShaderCanvas from "../components/ui/shader-canvas";
import Magnetic from "../components/ui/magnetic";
import { MaskedText, FadeIn, ClipReveal, EASE_OUT } from "../components/ui/reveal";
import { halftoneShader } from "../lib/shaders";

const iconMap = { Rocket, Smartphone, Globe, BrainCircuit, Cloud, PenTool };

// Dots on the neutral-900 CTA block.
const CTA_DOTS = { u_base: 0.09, u_ink: 0.24, u_cell: 14 };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  // Hero image drifts down slower than the page scrolls (parallax).
  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  // Unknown slug — graceful fallback.
  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-bold tracking-tight text-3xl text-neutral-900">Service not found</h1>
        <p className="text-neutral-500">
          The service you're looking for doesn't exist.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all services
        </Link>
      </div>
    );
  }

  const { detail } = service;
  const Icon = iconMap[service.iconName] ?? Rocket;
  const otherServices = services.filter((s) => s.slug !== service.slug);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[60vh] min-h-[420px] overflow-hidden bg-neutral-900">
        {/* The image drops in like a curtain over the dark base, then keeps
            easing out of a slow zoom. Oversized (-top-[10%] h-[120%]) so the
            parallax never reveals an edge. */}
        <ClipReveal from="top" trigger="mount" className="absolute inset-0">
          <motion.img
            src={detail.image}
            alt={service.title}
            style={reduce ? undefined : { y: imageY }}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: EASE_OUT }}
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover"
          />
        </ClipReveal>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-14 md:pb-20">
            <Link
              to="/services"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All services
            </Link>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
              <Icon className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <FadeIn
              as="p"
              trigger="mount"
              delay={0.2}
              className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-secondary)]"
            >
              {detail.eyebrow}
            </FadeIn>
            <MaskedText
              as="h1"
              trigger="mount"
              delay={0.3}
              text={detail.heading}
              className="max-w-3xl font-bold tracking-tight text-4xl leading-tight text-white md:text-6xl"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Main */}
          <div className="lg:col-span-8">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-lg leading-relaxed text-neutral-600 md:text-xl"
            >
              {detail.intro}
            </motion.p>

            {/* Approach / sections */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {detail.sections.map((sec, i) => (
                <motion.div
                  key={sec.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border border-neutral-200 bg-[var(--color-neutral-cream)] p-6"
                >
                  <span className="mb-3 inline-block text-sm font-bold text-[var(--color-primary)]">
                    0{i + 1}
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">
                    {sec.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {sec.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Capabilities */}
            <div className="mt-14">
              <h2 className="mb-6 font-bold tracking-tight text-2xl text-neutral-900 md:text-3xl">
                What's included
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {detail.capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-cream)] text-[var(--color-primary)]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-neutral-600">{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar — other services */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 rounded-2xl border border-neutral-200 p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-400">
                Other services
              </h3>
              <ul className="space-y-1">
                {otherServices.map((s) => {
                  const OtherIcon = iconMap[s.iconName] ?? Rocket;
                  return (
                    <li key={s.slug}>
                      <Link
                        to={`/services/${s.slug}`}
                        className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-neutral-100"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-cream)] text-[var(--color-primary)]">
                          <OtherIcon className="h-4 w-4" strokeWidth={1.6} />
                        </span>
                        <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                          {s.title}
                        </span>
                        <ArrowRight className="ml-auto h-4 w-4 text-neutral-300 transition-all group-hover:translate-x-1 group-hover:text-neutral-600" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Our Process — same 6 steps as the home page, animated carousel */}
      <section className="bg-neutral-100 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center md:mb-14">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Our Process
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              How we bring it to life
            </h2>
          </div>
          <FeatureCarousel />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 pt-4 md:pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-8 md:p-10">
            <ShaderCanvas fragment={halftoneShader} uniforms={CTA_DOTS} />
            <h2 className="relative mb-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Ready to get started?
            </h2>
            <p className="relative mb-6 max-w-lg text-neutral-300">
              Let's talk about your project and how {service.title.toLowerCase()} can
              move it forward.
            </p>
            <Magnetic className="relative">
              <Link
                to="/"
                state={{ scrollTo: "contact" }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
              >
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}
