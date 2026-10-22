// src/pages/Home.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OakshadeHero } from "../components/ui/oakshade-hero.jsx";
import TechMarquee from "../components/ui/tech-marquee.jsx";
import OurServices from "../components/ui/our-services.jsx";
import Manifesto from "../components/ui/manifesto.jsx";
import OurProcess from "../components/ui/our-process.jsx";
import OurWork from "../components/ui/our-work.jsx";
// Core Team is intentionally not rendered for now — keep the import commented
// out (not deleted) so the section can be switched back on later.
// import CoreTeam from "../components/ui/core-team.jsx";
import ContactSection from "../components/ui/contact-section.jsx";
import { scrollToSection } from "../lib/smooth-scroll";

export default function Home() {
  const location = useLocation();

  // When another page links here with { state: { scrollTo: "work" } },
  // smooth-scroll to that section once the page has painted.
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const id = requestAnimationFrame(() => scrollToSection(target));
    return () => cancelAnimationFrame(id);
  }, [location.state]);

  return (
    <>
      {/* HERO (grey) */}
      <OakshadeHero />

      {/* TECH STACK (white) — two endless logo rows */}
      <TechMarquee />

      {/* OUR SERVICES (white) — carousel */}
      <OurServices />

      {/* WHY OAKSHADE (white) — scroll-lit statement + count-up stats */}
      <Manifesto />

      {/* OUR PROCESS (grey, fades in from white) — 3D tilt product cards */}
      <OurProcess />

      {/* OUR WORK (near-black, curved sheet overlapping Process) — project tabs */}
      <OurWork />

      {/* CORE TEAM (grey) — profile carousel. Hidden for now; re-enable by
          uncommenting this and the import above (plus the header nav tab). */}
      {/* <CoreTeam /> */}

      {/* CONTACT (white) */}
      <ContactSection />
    </>
  );
}
