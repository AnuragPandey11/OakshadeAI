// src/utils/projectsData.js
// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for the portfolio / "Our Work".
//
// `projectGroups` powers the home "Our Work" section: each group is a TAB,
// and a tab can hold MANY entries. On the home section those entries are
// shown one at a time with a "1 of N" slider (dots + arrows).
//
// Every entry also carries a `category`, which powers the single category
// filter on the /work page. Add a project by dropping an entry into a group
// (and add a new group object to create a new tab).
// ─────────────────────────────────────────────────────────────────────────

export const projectGroups = [
  {
    id: "featured",
    label: "Featured",
    entries: [
      {
        id: "aurora-fintech",
        title: "Aurora — Fintech Dashboard",
        category: "Web Development",
        description:
          "A real-time analytics dashboard for a fast-growing fintech, unifying millions of transactions into a single, elegant view.",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
      {
        id: "nomad-travel",
        title: "Nomad — Travel Companion App",
        category: "Mobile Apps",
        description:
          "A cross-platform travel app with offline maps and smart itineraries, launched to 4.8 stars across both app stores.",
        image:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
      {
        id: "helix-ai",
        title: "Helix — AI Support Assistant",
        category: "AI/ML",
        description:
          "An LLM-powered assistant that deflects 60% of support tickets while keeping a human-in-the-loop for edge cases.",
        image:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
    ],
  },
  {
    id: "web-mobile",
    label: "Web & Mobile",
    entries: [
      {
        id: "meridian-store",
        title: "Meridian — Headless Commerce",
        category: "Web Development",
        description:
          "A blazing-fast headless storefront that cut page load times by 70% and lifted conversion by 22%.",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
      {
        id: "pulse-fitness",
        title: "Pulse — Fitness Tracking App",
        category: "Mobile Apps",
        description:
          "A wearables-integrated fitness app with live coaching, streak tracking, and social challenges.",
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
    ],
  },
  {
    id: "ai-cloud",
    label: "AI & Cloud",
    entries: [
      {
        id: "atlas-mlops",
        title: "Atlas — MLOps Platform",
        category: "Cloud & DevOps",
        description:
          "A self-service ML platform on Kubernetes that took model deployment from weeks to minutes.",
        image:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
      {
        id: "vision-inspect",
        title: "Vision — Quality Inspection",
        category: "AI/ML",
        description:
          "A computer-vision system that flags manufacturing defects in real time with 99.2% precision.",
        image:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
      {
        id: "cirrus-infra",
        title: "Cirrus — Cloud Migration",
        category: "Cloud & DevOps",
        description:
          "A zero-downtime migration of a legacy monolith to a resilient, auto-scaling cloud architecture.",
        image:
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    entries: [
      {
        id: "canvas-ds",
        title: "Canvas — Design System",
        category: "Product Design",
        description:
          "A cohesive, documented design system that unified six product teams under one visual language.",
        image:
          "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
      {
        id: "bloom-rebrand",
        title: "Bloom — Product Redesign",
        category: "Product Design",
        description:
          "An end-to-end UX overhaul that simplified onboarding and doubled activation in the first month.",
        image:
          "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=1600&auto=format&fit=crop",
        link: "#",
      },
    ],
  },
];

// Flattened list of every project (used by the /work page grid).
export const allProjects = projectGroups.flatMap((group) => group.entries);

// Unique category list for the /work filter, with "All" first.
export const projectCategories = [
  "All",
  ...Array.from(new Set(allProjects.map((p) => p.category))),
];
