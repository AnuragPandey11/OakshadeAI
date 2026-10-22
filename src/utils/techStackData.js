// src/utils/techStackData.js
// ─────────────────────────────────────────────────────────────────────────
// ⚠ PLACEHOLDER CONTENT — edit to match the stack you actually use.
//
// The scrolling technology strip under the home hero. Each row scrolls in
// the opposite direction to the one above it. `iconName` maps to a react-icons
// component in tech-marquee.jsx (add new ones to its iconMap); `color` is the
// technology's official brand colour, applied to its icon.
// ─────────────────────────────────────────────────────────────────────────

export const techMarquee = {
  label: "Built with the tools behind the best products",
  rows: [
    [
      { name: "React", iconName: "SiReact", color: "#61DAFB" },
      { name: "Next.js", iconName: "SiNextdotjs", color: "#000000" },
      { name: "Angular", iconName: "SiAngular", color: "#DD0031" },
      { name: "TypeScript", iconName: "SiTypescript", color: "#3178C6" },
      { name: "Node.js", iconName: "SiNodedotjs", color: "#5FA04E" },
      { name: "Spring Boot", iconName: "SiSpringboot", color: "#6DB33F" },
      { name: "Java", iconName: "SiOpenjdk", color: "#E76F00" },
      { name: "Python", iconName: "SiPython", color: "#3776AB" },
      { name: "GraphQL", iconName: "SiGraphql", color: "#E10098" },
      { name: "Tailwind CSS", iconName: "SiTailwindcss", color: "#06B6D4" },
    ],
    [
      { name: "Flutter", iconName: "SiFlutter", color: "#02569B" },
      { name: "Swift", iconName: "SiSwift", color: "#F05138" },
      { name: "Kotlin", iconName: "SiKotlin", color: "#7F52FF" },
      { name: "PostgreSQL", iconName: "SiPostgresql", color: "#4169E1" },
      { name: "Redis", iconName: "SiRedis", color: "#FF4438" },
      { name: "MongoDB", iconName: "SiMongodb", color: "#47A248" },
      { name: "AWS", iconName: "FaAws", color: "#FF9900" },
      { name: "Google Cloud", iconName: "SiGooglecloud", color: "#4285F4" },
      { name: "Docker", iconName: "SiDocker", color: "#2496ED" },
      { name: "Kubernetes", iconName: "SiKubernetes", color: "#326CE5" },
      { name: "OpenAI", iconName: "SiOpenai", color: "#000000" },
      { name: "Figma", iconName: "SiFigma", color: "#F24E1E" },
    ],
  ],
};
