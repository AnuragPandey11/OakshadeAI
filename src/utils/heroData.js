// src/utils/heroData.js
// ─────────────────────────────────────────────────────────────────────────
// Hero copy for the home page and the /services + /work page headers.
//
// Headlines animate word by word (each word slides up out of its own mask)
// and wrap naturally, so write them as plain sentences. Wrap a word in
// *asterisks* to set it in the serif italic accent.
// ─────────────────────────────────────────────────────────────────────────

export const homeHero = {
  eyebrow: "Oakshade AI",
  headline: "Software that *moves* your business forward.",
  body:
    "We design and build websites, mobile apps, and AI-powered platforms — from the first conversation through launch and everything after it. One team, from strategy to shipped product.",
  // `target` is the home section id each button scrolls to.
  primaryCta: { label: "Start a project", target: "contact" },
  secondaryCta: { label: "See our work", target: "work" },
};

export const pageHeroes = {
  services: {
    eyebrow: "What we do",
    headline: "Our *Services*",
    body:
      "End-to-end product, engineering, and design services — pick a capability below to explore how we can help.",
  },
  work: {
    eyebrow: "Our Work",
    headline: "Selected *projects*",
    body:
      "A look at the products, platforms, and experiences we've helped bring to life across industries.",
  },
};
