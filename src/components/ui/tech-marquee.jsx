// src/components/ui/tech-marquee.jsx
import {
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiTypescript,
  SiNodedotjs,
  SiSpringboot,
  SiOpenjdk,
  SiPython,
  SiGraphql,
  SiTailwindcss,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiPostgresql,
  SiRedis,
  SiMongodb,
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiOpenai,
  SiFigma,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { Eyebrow } from "./reveal";
import { techMarquee } from "../../utils/techStackData";

// Maps the string `iconName` from techStackData to a react-icons component.
const iconMap = {
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiTypescript,
  SiNodedotjs,
  SiSpringboot,
  SiOpenjdk,
  SiPython,
  SiGraphql,
  SiTailwindcss,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiPostgresql,
  SiRedis,
  SiMongodb,
  FaAws,
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiOpenai,
  SiFigma,
};

// `duplicate` marks the second copy of the list, which only exists to make
// the loop seamless — screen readers skip it.
function Chip({ name, iconName, color, duplicate }) {
  const Icon = iconMap[iconName];
  return (
    <span
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-900"
    >
      {Icon && <Icon className="h-4 w-4" style={{ color }} />}
      {name}
    </span>
  );
}

/* One endless row. The track holds the list twice and slides by exactly half
   its width (animate-marquee), so the loop point is invisible. Hovering
   pauses it; reduced-motion stops it. */
function MarqueeRow({ items, reverse }) {
  return (
    <div className="group flex overflow-hidden">
      <div
        className={`flex shrink-0 animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        {items.map((item) => (
          <Chip key={item.name} {...item} />
        ))}
        {items.map((item) => (
          <Chip key={`${item.name}-dup`} {...item} duplicate />
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section aria-label="Technologies we work with" className="w-full bg-white pb-2 pt-14 md:pt-20">
      <Eyebrow
        align="center"
        className="mb-8 px-6 text-[11px] tracking-[0.25em] text-neutral-400 sm:text-xs"
      >
        {techMarquee.label}
      </Eyebrow>
      {/* Edges fade out so chips glide in and out rather than being cut. */}
      <div className="space-y-3 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        {techMarquee.rows.map((row, i) => (
          <MarqueeRow key={i} items={row} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
