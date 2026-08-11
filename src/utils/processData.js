// src/utils/processData.js
// ─────────────────────────────────────────────────────────────────────────
// The 6 "Our Process" steps. Single source of truth shared by:
//   • the home "Our Process" section (card grid / mobile slider)
//   • the animated FeatureCarousel shown on every service detail page
//
// `iconName` maps to a lucide icon in the home cards (see our-process.jsx).
// `image` is used by the FeatureCarousel on the service pages.
// ─────────────────────────────────────────────────────────────────────────

export const processSteps = [
  {
    id: "1",
    name: "Step 01",
    iconName: "Search",
    title: "Discover",
    description:
      "We start with your goals, users, and constraints — then agree on what success actually looks like.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Step 02",
    iconName: "PenTool",
    title: "Design",
    description:
      "Wireframes to polished UI, so you can see and react to the product long before a line of code is written.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Step 03",
    iconName: "Code2",
    title: "Build",
    description:
      "Development in short, visible cycles on a modern stack — you see working software every week, not just status updates.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Step 04",
    iconName: "CheckCircle2",
    title: "Test",
    description:
      "Real-device testing, performance and accessibility checks, and your own review round before anything goes near production.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Step 05",
    iconName: "Rocket",
    title: "Launch",
    description:
      "Deployment, domains, analytics, and app store submission handled end to end — a launch day without surprises.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Step 06",
    iconName: "Users",
    title: "Support",
    description:
      "We stay on after launch: monitoring, fixes, and a roadmap for the next set of improvements.",
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop",
  },
];
