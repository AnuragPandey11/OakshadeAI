// src/components/ui/header.jsx
import { useEffect, useState } from "react";
import { FluidTabs } from "./original";
import { FaHome, FaCogs, FaProjectDiagram, FaBriefcase, FaUsers, FaEnvelope } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const tabs = [
  { id: "home", label: "Home", icon: <FaHome size={22} /> },
  { id: "services", label: "Our Services", icon: <FaCogs size={22} /> },
  { id: "process", label: "Our Process", icon: <FaProjectDiagram size={22} /> },
  { id: "work", label: "Our Work", icon: <FaBriefcase size={22} /> },
  { id: "team", label: "Core Team", icon: <FaUsers size={22} /> },
  { id: "contact", label: "Contact", icon: <FaEnvelope size={22} /> },
];

function Logo({ className = "h-14" }) {
  return <img src="/logo.png" alt="Oakshade" className={`${className} w-auto`} />;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Smooth-scroll to a section by id ("home" goes to the top).
  const goTo = (id) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelect = (id) => {
    setActive(id);
    goTo(id);
  };

  // Scrollspy: highlight the section currently crossing the viewport center.
  useEffect(() => {
    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ---- Desktop: logo + fluid tabs together inside one glass pill ---- */}
      <header className="fixed inset-x-0 top-10 z-50 hidden justify-center lg:flex">
        <div className="flex items-center gap-4 rounded-full border border-white/40 bg-white/25 py-1.5 pl-6 pr-6 shadow-xl shadow-black/10 backdrop-blur-xl backdrop-saturate-150">
          <Logo className="h-9" />
          <span className="h-7 w-px bg-neutral-500/30" />
          <FluidTabs tabs={tabs} activeTab={active} onSelect={handleSelect} />
        </div>
      </header>

      {/* ---- Mobile: top bar with logo + hamburger (aligned) ---- */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 lg:hidden">
        <Logo className="h-16" />
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/50 bg-white/30 text-neutral-900 shadow-md backdrop-blur-xl backdrop-saturate-150 active:scale-95"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* ---- Mobile: full-screen overlay menu (monochrome) ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-900 active:scale-95"
              >
                <FiX size={28} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-8">
              {tabs.map((t, i) => (
                <motion.button
                  key={t.id}
                  type="button"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                  onClick={() => {
                    setActive(t.id);
                    setOpen(false);
                    goTo(t.id);
                  }}
                  className={`text-3xl font-extrabold uppercase tracking-wide transition-colors ${
                    active === t.id ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {t.label}
                </motion.button>
              ))}
            </nav>

            <div className="px-6 pb-10">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full rounded-2xl bg-neutral-900 py-5 text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-black/20 transition-colors hover:bg-neutral-800 active:scale-[0.99]"
              >
                Book Free Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
