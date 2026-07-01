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
    title: "Lorem ipsum",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Step 02",
    iconName: "PenTool",
    title: "Dolor sit",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Step 03",
    iconName: "Code2",
    title: "Consectetur",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Step 04",
    iconName: "CheckCircle2",
    title: "Adipiscing",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Step 05",
    iconName: "Rocket",
    title: "Sed eiusmod",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium dolor.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Step 06",
    iconName: "LifeBuoy",
    title: "Tempor",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed.",
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop",
  },
];
