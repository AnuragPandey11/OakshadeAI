// src/components/ui/our-work.jsx
import { ArrowUpRight } from "lucide-react";
import { AnimatedTabs } from "./animated-tabs";

// Edit `link` to point each project at its live app/website.
// Swap `image` with your own asset (drop it in /public and use "/your-shot.jpg").
const projects = [
  {
    id: "p1",
    label: "Project 1",
    title: "Project 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image:
      "https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?q=80&w=1600&auto=format&fit=crop",
    link: "#",
  },
  {
    id: "p2",
    label: "Project 2",
    title: "Project 2",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image:
      "https://images.unsplash.com/photo-1506543730435-e2c1d4553a84?q=80&w=1600&auto=format&fit=crop",
    link: "#",
  },
  {
    id: "p3",
    label: "Project 3",
    title: "Project 3",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image:
      "https://images.unsplash.com/photo-1522428938647-2baa7c899f2f?q=80&w=1600&auto=format&fit=crop",
    link: "#",
  },
];

function ProjectContent({ title, description, image, link }) {
  return (
    <div className="grid h-full grid-cols-1 items-stretch gap-6 md:grid-cols-[7fr_3fr]">
      {/* Image — 70% */}
      <img
        src={image}
        alt={title}
        className="h-64 w-full rounded-lg border-none object-cover shadow-[0_0_20px_rgba(0,0,0,0.2)] md:h-[420px]"
      />

      {/* Text — 30% (with editable link) */}
      <div className="flex flex-col justify-center gap-3">
        <h3 className="text-2xl font-bold tracking-tight text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-300">{description}</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
        >
          Visit Project <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

const tabs = projects.map((p) => ({
  id: p.id,
  label: p.label,
  content: <ProjectContent {...p} />,
}));

export default function OurWork() {
  return (
    <section id="work" className="w-full scroll-mt-24 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Our Work
        </p>
        <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          Lorem ipsum dolor sit amet
        </h2>

        <AnimatedTabs tabs={tabs} className="mx-auto max-w-5xl" />
      </div>
    </section>
  );
}
