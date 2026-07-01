// src/utils/servicesData.js
// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for every service on the site.
// Add / edit a service here and it automatically appears in:
//   • the header "Our Services" dropdown
//   • the home "Our Services" carousel
//   • the /services page (card grid)
//   • its own detail page at /services/<slug>
//
// `iconName` is a string that maps to a lucide-react icon inside the
// components (see the `iconMap` in all-services / service-detail).
// `color` drives the flip-card accent on the home carousel.
// ─────────────────────────────────────────────────────────────────────────

export const services = [
  {
    slug: "digital-transformation",
    navLabel: "Digital Transformation / IT Consultation",
    title: "Digital Transformation & IT Consultation",
    subtitle: "Modernise, automate, and scale",
    iconName: "Rocket",
    color: "#171717",
    // Short copy for cards / carousel
    description:
      "We help you rethink legacy systems and processes, mapping a pragmatic roadmap that turns technology into a growth engine.",
    features: [
      "Technology audits",
      "Process automation",
      "Legacy modernisation",
      "IT strategy & roadmaps",
    ],
    // Long-form content for the /services/<slug> detail page
    detail: {
      eyebrow: "Digital Transformation",
      heading: "Turn technology into your competitive advantage",
      intro:
        "From strategy to execution, we partner with you to modernise operations, unlock data, and build the digital foundations your business needs to scale with confidence.",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
      sections: [
        {
          title: "Assess",
          body: "A deep audit of your systems, workflows, and tech stack to surface bottlenecks and opportunities.",
        },
        {
          title: "Design",
          body: "A clear, prioritised roadmap that aligns technology investment with measurable business outcomes.",
        },
        {
          title: "Deliver",
          body: "Hands-on implementation and change management so transformation actually sticks across your teams.",
        },
      ],
      capabilities: [
        "Technology & security audits",
        "Cloud & infrastructure strategy",
        "Workflow & process automation",
        "Legacy system modernisation",
        "Data & analytics enablement",
        "Fractional CTO / IT advisory",
      ],
    },
  },
  {
    slug: "mobile-app-development",
    navLabel: "Mobile App Development",
    title: "Mobile App Development",
    subtitle: "iOS, Android & cross-platform",
    iconName: "Smartphone",
    color: "#2b2b2b",
    description:
      "Native and cross-platform apps engineered for performance, delightful UX, and effortless scale across every device.",
    features: [
      "iOS & Android",
      "React Native / Flutter",
      "App store launch",
      "Ongoing support",
    ],
    detail: {
      eyebrow: "Mobile App Development",
      heading: "Apps your users reach for every day",
      intro:
        "We design and build mobile experiences that feel fast, look beautiful, and hold up under real-world scale — from MVP to millions of users.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1600&auto=format&fit=crop",
      sections: [
        {
          title: "Native performance",
          body: "Buttery-smooth interfaces built with Swift, Kotlin, React Native, or Flutter depending on your needs.",
        },
        {
          title: "Product thinking",
          body: "We obsess over onboarding, retention, and the small interactions that keep people coming back.",
        },
        {
          title: "Launch & grow",
          body: "App store submission, analytics, crash monitoring, and a roadmap for continuous improvement.",
        },
      ],
      capabilities: [
        "Native iOS (Swift) & Android (Kotlin)",
        "Cross-platform (React Native, Flutter)",
        "Offline-first architecture",
        "Push notifications & deep linking",
        "App store optimisation & release",
        "Analytics, monitoring & maintenance",
      ],
    },
  },
  {
    slug: "website-development",
    navLabel: "Website Development",
    title: "Website Development",
    subtitle: "Fast, modern, conversion-ready",
    iconName: "Globe",
    color: "#171717",
    description:
      "High-performance marketing sites and web apps built with modern frameworks, optimised for speed, SEO, and conversion.",
    features: [
      "Marketing sites",
      "Web applications",
      "SEO & performance",
      "CMS integration",
    ],
    detail: {
      eyebrow: "Website Development",
      heading: "Websites that load fast and convert faster",
      intro:
        "Whether it's a pixel-perfect marketing site or a complex web application, we build responsive, accessible, and blazing-fast experiences on the modern web.",
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1600&auto=format&fit=crop",
      sections: [
        {
          title: "Design-led",
          body: "Clean, on-brand interfaces that build trust and guide visitors toward the actions that matter.",
        },
        {
          title: "Engineered right",
          body: "Modern stacks (React, Next.js, Vite) with Core Web Vitals, accessibility, and SEO baked in.",
        },
        {
          title: "Easy to manage",
          body: "Headless CMS integration so your team can update content without touching code.",
        },
      ],
      capabilities: [
        "Marketing & landing pages",
        "Full-stack web applications",
        "Headless CMS integration",
        "SEO & Core Web Vitals tuning",
        "E-commerce experiences",
        "Accessibility (WCAG) compliance",
      ],
    },
  },
  {
    slug: "ai-ml",
    navLabel: "AI / ML",
    title: "AI & Machine Learning",
    subtitle: "Intelligent products & automation",
    iconName: "BrainCircuit",
    color: "#2b2b2b",
    description:
      "From LLM-powered features to custom models, we help you ship AI that solves real problems and delights your users.",
    features: [
      "LLM & GenAI apps",
      "Custom models",
      "Data pipelines",
      "MLOps",
    ],
    detail: {
      eyebrow: "AI / ML",
      heading: "Ship AI that actually moves the needle",
      intro:
        "We cut through the hype to build practical, production-grade AI — from generative features and chat assistants to bespoke models trained on your data.",
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
      sections: [
        {
          title: "Strategy",
          body: "We identify where AI creates real leverage — and, just as importantly, where it doesn't.",
        },
        {
          title: "Build",
          body: "Generative AI features, RAG pipelines, and custom models integrated cleanly into your product.",
        },
        {
          title: "Operate",
          body: "Evaluation, guardrails, and MLOps so your models stay reliable, safe, and cost-effective.",
        },
      ],
      capabilities: [
        "LLM & generative AI features",
        "Retrieval-augmented generation (RAG)",
        "Custom model training & fine-tuning",
        "Computer vision & NLP",
        "Data pipelines & feature stores",
        "Evaluation, guardrails & MLOps",
      ],
    },
  },
  {
    slug: "cloud-devops",
    navLabel: "Cloud & DevOps Solutions",
    title: "Cloud & DevOps Solutions",
    subtitle: "Reliable, scalable infrastructure",
    iconName: "Cloud",
    color: "#171717",
    description:
      "We architect and automate cloud infrastructure so your teams ship faster with confidence — resilient, secure, and cost-aware.",
    features: [
      "Cloud architecture",
      "CI/CD pipelines",
      "Kubernetes",
      "Observability",
    ],
    detail: {
      eyebrow: "Cloud & DevOps",
      heading: "Infrastructure that scales while you sleep",
      intro:
        "We design cloud-native systems and automate the path from commit to production, so your team can ship more often with far less risk.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
      sections: [
        {
          title: "Architect",
          body: "Well-architected cloud foundations on AWS, GCP, or Azure — secure, resilient, and cost-optimised.",
        },
        {
          title: "Automate",
          body: "Infrastructure-as-code and CI/CD pipelines that make deployments boring and repeatable.",
        },
        {
          title: "Observe",
          body: "Monitoring, alerting, and incident tooling so you catch issues before your customers do.",
        },
      ],
      capabilities: [
        "Cloud architecture (AWS / GCP / Azure)",
        "Infrastructure-as-code (Terraform)",
        "CI/CD pipeline automation",
        "Kubernetes & containerisation",
        "Observability & incident response",
        "Cost optimisation & FinOps",
      ],
    },
  },
  {
    slug: "product-design",
    navLabel: "Product Design",
    title: "Product Design",
    subtitle: "UX, UI & design systems",
    iconName: "PenTool",
    color: "#2b2b2b",
    description:
      "Research-driven product design that turns complex problems into intuitive, beautiful, and cohesive user experiences.",
    features: [
      "UX research",
      "UI design",
      "Prototyping",
      "Design systems",
    ],
    detail: {
      eyebrow: "Product Design",
      heading: "Design that makes complex feel effortless",
      intro:
        "We combine research, strategy, and craft to design products people love — from first sketch to a scalable design system your team can build on.",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1600&auto=format&fit=crop",
      sections: [
        {
          title: "Discover",
          body: "User research and stakeholder interviews to ground every decision in real evidence.",
        },
        {
          title: "Design",
          body: "Wireframes, high-fidelity UI, and interactive prototypes tested with real users.",
        },
        {
          title: "Systemise",
          body: "A documented design system that keeps your product consistent as it grows.",
        },
      ],
      capabilities: [
        "UX research & discovery",
        "Information architecture",
        "UI design & visual identity",
        "Interactive prototyping",
        "Usability testing",
        "Design systems & handoff",
      ],
    },
  },
];

// Helper: look up a single service by its slug (used by the detail page).
export const getServiceBySlug = (slug) =>
  services.find((s) => s.slug === slug);
