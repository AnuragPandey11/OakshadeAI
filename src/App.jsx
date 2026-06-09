// src/App.jsx
import Header from "./components/ui/header.jsx";
import { OakshadeHero } from "./components/ui/oakshade-hero.jsx";
import OurServices from "./components/ui/our-services.jsx";
import OurProcess from "./components/ui/our-process.jsx";
import OurWork from "./components/ui/our-work.jsx";
import CoreTeam from "./components/ui/core-team.jsx";

/* Alternating grey / white section wrapper. */
function Section({ tone = "white", className = "", children }) {
  const bg = tone === "grey" ? "bg-neutral-200" : "bg-white";
  return (
    <section className={`w-full ${bg} ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">{children}</div>
    </section>
  );
}

export default function App() {
  return (
    <main className="w-full overflow-hidden bg-white font-sans text-neutral-800 antialiased">
      {/* Centered glassmorphism header */}
      <Header />

      {/* HERO (grey) — 100vh, 40/60 text / video */}
      <OakshadeHero />

      {/* OUR SERVICES (white) — flip cards */}
      <OurServices />

      {/* OUR PROCESS (grey) — 3D tilt product cards */}
      <OurProcess />

      {/* OUR WORK (white) — animated project tabs */}
      <OurWork />

      {/* CORE TEAM (grey) — profile carousel */}
      <CoreTeam />

      {/* SECTION 5 (white) — CTA */}
      <Section tone="white">
        <div className="rounded-3xl bg-neutral-900 px-8 py-16 text-center md:px-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Lorem ipsum dolor sit amet
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-neutral-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="w-full rounded-lg bg-white px-8 py-4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-200 sm:w-auto">
              Lorem Ipsum
            </button>
            <button className="w-full rounded-lg border border-neutral-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-neutral-800 sm:w-auto">
              Dolor Sit Amet
            </button>
          </div>
        </div>
      </Section>

      {/* FOOTER (grey) */}
      <footer className="w-full bg-neutral-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-neutral-500 md:flex-row">
          <span className="font-semibold text-neutral-700">Oakshade AI</span>
          <span>Lorem ipsum dolor sit amet © {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-800">Lorem</a>
            <a href="#" className="hover:text-neutral-800">Ipsum</a>
            <a href="#" className="hover:text-neutral-800">Dolor</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
