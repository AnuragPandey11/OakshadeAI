// src/components/ui/header.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FluidTabs } from "./original";
import {
  FaHome,
  FaCogs,
  FaProjectDiagram,
  FaBriefcase,
  FaUsers,
  FaEnvelope,
} from "react-icons/fa";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import {
  Rocket,
  Smartphone,
  Globe,
  BrainCircuit,
  Cloud,
  PenTool,
  LayoutGrid,
} from "lucide-react";
import { services } from "../../utils/servicesData";

// Maps a service's string `iconName` to its lucide icon component.
const serviceIconMap = { Rocket, Smartphone, Globe, BrainCircuit, Cloud, PenTool };

// Section tabs that live on the home page (scroll targets).
const baseTabs = [
  { id: "home", label: "Home", icon: <FaHome size={22} /> },
  { id: "services", label: "Our Services", icon: <FaCogs size={22} /> },
  { id: "process", label: "Our Process", icon: <FaProjectDiagram size={22} /> },
  { id: "work", label: "Our Work", icon: <FaBriefcase size={22} /> },
  { id: "team", label: "Core Team", icon: <FaUsers size={22} /> },
  { id: "contact", label: "Contact", icon: <FaEnvelope size={22} /> },
];

function Logo({ className = "h-14" }) {
  return (
    <img
      src="/media/oakshade-logo.png"
      alt="Oakshade AI"
      className={`${className} w-auto`}
    />
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [open, setOpen] = useState(false); // mobile menu
  const [servicesOpen, setServicesOpen] = useState(false); // mobile services accordion
  const [scrollActive, setScrollActive] = useState("home"); // scrollspy result

  // On a services / work page, force that nav item active; otherwise defer to
  // the scrollspy result from the home page.
  const routeActive = pathname.startsWith("/services")
    ? "services"
    : pathname.startsWith("/work")
    ? "work"
    : null;
  const active = routeActive ?? scrollActive;

  // Scroll to a home section — navigating home first if we're on another page.
  const goToSection = (id) => {
    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Dropdown items for the "Our Services" tab (built from the data file).
  const serviceDropdown = [
    {
      label: "All services",
      primary: true,
      icon: <LayoutGrid size={16} />,
      onSelect: () => navigate("/services"),
    },
    ...services.map((s) => {
      const Icon = serviceIconMap[s.iconName] ?? Rocket;
      return {
        label: s.navLabel,
        icon: <Icon size={16} />,
        onSelect: () => navigate(`/services/${s.slug}`),
      };
    }),
  ];

  const tabs = baseTabs.map((t) =>
    t.id === "services" ? { ...t, dropdown: serviceDropdown } : t
  );

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Scrollspy — only relevant on the home page (the sections only exist there).
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = baseTabs
      .map((t) => document.getElementById(t.id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setScrollActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      {/* ---- Desktop: logo + fluid tabs together inside one glass pill ---- */}
      <header className="fixed inset-x-0 top-10 z-50 hidden justify-center lg:flex">
        <div className="flex items-center gap-4 rounded-full border border-white/40 bg-white/25 py-1.5 pl-6 pr-6 shadow-xl shadow-black/10 backdrop-blur-xl backdrop-saturate-150">
          <button type="button" onClick={() => goToSection("home")} aria-label="Home" className="shrink-0">
            {/* Cap the layout height to the tab row so the pill doesn't grow, but
                render the logo larger with scale (transform-only, no layout impact). */}
            <Logo className="h-11 origin-left scale-[1.6]" />
          </button>
          <span className="ml-6 h-7 w-px bg-neutral-500/30" />
          <FluidTabs tabs={tabs} activeTab={active} onSelect={goToSection} />
        </div>
      </header>

      {/* ---- Mobile: top bar with logo + hamburger (aligned) ---- */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-3 lg:hidden">
        <button type="button" onClick={() => goToSection("home")} aria-label="Home" className="shrink-0">
          <Logo className="h-14 sm:h-16" />
        </button>
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
            <div className="flex items-center justify-between px-5 py-3">
              <Logo className="h-14 sm:h-16" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-900 active:scale-95"
              >
                <FiX size={28} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto py-8">
              {tabs.map((t, i) => {
                const isServices = t.id === "services";
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    {isServices ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setServicesOpen((v) => !v)}
                          className={`flex items-center gap-2 text-3xl font-extrabold uppercase tracking-wide transition-colors ${
                            active === t.id ? "text-neutral-900" : "text-neutral-400"
                          }`}
                        >
                          {t.label}
                          <FiChevronDown
                            size={22}
                            className={`transition-transform duration-300 ${
                              servicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {servicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="mt-4 flex flex-col items-center gap-3 overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setOpen(false);
                                  navigate("/services");
                                }}
                                className="text-base font-bold uppercase tracking-wide text-neutral-900"
                              >
                                All services
                              </button>
                              {services.map((s) => (
                                <button
                                  key={s.slug}
                                  type="button"
                                  onClick={() => {
                                    setOpen(false);
                                    navigate(`/services/${s.slug}`);
                                  }}
                                  className="max-w-xs text-center text-sm font-medium text-neutral-500"
                                >
                                  {s.navLabel}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          goToSection(t.id);
                        }}
                        className={`text-3xl font-extrabold uppercase tracking-wide transition-colors ${
                          active === t.id ? "text-neutral-900" : "text-neutral-400"
                        }`}
                      >
                        {t.label}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            <div className="px-6 pb-10">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  goToSection("contact");
                }}
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
