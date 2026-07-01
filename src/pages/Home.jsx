// src/pages/Home.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OakshadeHero } from "../components/ui/oakshade-hero.jsx";
import OurServices from "../components/ui/our-services.jsx";
import OurProcess from "../components/ui/our-process.jsx";
import OurWork from "../components/ui/our-work.jsx";
import CoreTeam from "../components/ui/core-team.jsx";
import ContactSection from "../components/ui/contact-section.jsx";

export default function Home() {
  const location = useLocation();

  // When another page links here with { state: { scrollTo: "work" } },
  // smooth-scroll to that section once the page has painted.
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const id = requestAnimationFrame(() => {
      if (target === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document
          .getElementById(target)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [location.state]);

  return (
    <>
      {/* HERO (grey) */}
      <OakshadeHero />

      {/* OUR SERVICES (white) — carousel */}
      <OurServices />

      {/* OUR PROCESS (grey) — 3D tilt product cards */}
      <OurProcess />

      {/* OUR WORK (white) — multi-entry project tabs */}
      <OurWork />

      {/* CORE TEAM (grey) — profile carousel */}
      <CoreTeam />

      {/* CONTACT (white) */}
      <ContactSection />
    </>
  );
}
