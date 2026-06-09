// src/components/ui/our-services.jsx
import CardFlip from "./flip-card";

const services = [
  {
    title: "Lorem ipsum dolor",
    subtitle: "Consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    features: ["Lorem ipsum", "Dolor sit amet", "Consectetur", "Adipiscing elit"],
    color: "#171717",
  },
  {
    title: "Sed do eiusmod",
    subtitle: "Tempor incididunt ut labore",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    features: ["Tempor incididunt", "Ut labore", "Magna aliqua", "Enim ad minim"],
    color: "#2b2b2b",
  },
  {
    title: "Ut enim ad minim",
    subtitle: "Quis nostrud exercitation",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    features: ["Quis nostrud", "Ullamco laboris", "Ex ea commodo", "Consequat duis"],
    color: "#171717",
  },
];

export default function OurServices() {
  return (
    <section id="services" className="w-full scroll-mt-24 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Our Services
        </p>
        <h2 className="mb-14 text-center text-3xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          Lorem ipsum dolor sit amet
        </h2>

        <div className="grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <CardFlip key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
