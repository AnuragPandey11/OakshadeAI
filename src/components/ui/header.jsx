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
import { FiMenu, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
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
import { lockScroll, scrollToSection, unlockScroll } from "../../lib/smooth-scroll";

// Maps a service's string `iconName` to its lucide icon component.
const serviceIconMap = { Rocket, Smartphone, Globe, BrainCircuit, Cloud, PenTool };

// Section tabs that live on the home page (scroll targets).
const baseTabs = [
  { id: "home", label: "Home", icon: <FaHome size={22} /> },
  { id: "services", label: "Our Services", icon: <FaCogs size={22} /> },
  { id: "process", label: "Our Process", icon: <FaProjectDiagram size={22} /> },
  { id: "work", label: "Our Work", icon: <FaBriefcase size={22} /> },
  // Core Team is hidden for now (the section isn't rendered on Home) —
  // uncomment to bring the tab back alongside the section.
  // { id: "team", label: "Core Team", icon: <FaUsers size={22} /> },
  { id: "contact", label: "Contact", icon: <FaEnvelope size={22} /> },
];

// Horizontal lockup: the tree mark beside live text, rather than the stacked
// oakshade-logo.png. That PNG is ~45% transparent margin and bakes the wordmark
// in at 3.5% of its height, so inside a nav pill the mark stayed small and the
// wordmark rendered as an illegible smudge. Splitting them lets the mark fill
// the pill and keeps "OAKSHADE AI" readable as real text.
function Logo({ markClassName = "h-12", textClassName = "text-[13px]" }) {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/media/oakshade-mark.png" alt="" className={`${markClassName} w-auto`} />
      <span
        className={`${textClassName} whitespace-nowrap font-bold tracking-[0.2em] text-neutral-900`}
      >
        OAKSHADE AI
      </span>
    </span>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [open, setOpen] = useState(false); // mobile menu
  const [servicesOpen, setServicesOpen] = useState(false); // mobile services accordion
  const [scrollActive, setScrollActive] = useState("home"); // scrollspy result

  // Hide the nav while scrolling down, bring it back on any scroll up. Once
  // past the top it also tucks up and turns more opaque.
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - (scrollY.getPrevious() ?? 0);
    setScrolled(latest > 40);
    if (latest < 160) setHidden(false);
    else if (delta > 6) setHidden(true);
    else if (delta < -6) setHidden(false);
  });
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const barTransition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };
  const pillTone = scrolled ? "bg-white/60" : "bg-white/25";

  // On a services / work page, force that nav item active; otherwise defer to
  // the scrollspy result from the home page.
  const routeActive = pathname.startsWith("/services")
    ? "services"
    : pathname.startsWith("/work")
    ? "work"
    : null;
  const active = routeActive ?? scrollActive;

  // Scroll to a home section — navigating home first if we're on another page.
  // "Our Work" is an exception: it routes to the dedicated /work page instead.
  const goToSection = (id) => {
    if (id === "work") {
      navigate("/work");
      return;
    }
    if (pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    scrollToSection(id);
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
    if (!open) return;
    lockScroll();
    return unlockScroll;
  }, [open]);

  // Scrollspy — only relevant on the home page (the sections only exist there).
  // Page transitions mount Home only after the previous page has faded out,
  // so keep looking for its sections for a moment (~2s of frames).
  useEffect(() => {
    if (pathname !== "/") return;
    let observer;
    let raf = 0;

    const attach = (tries = 0) => {
      const sections = baseTabs
        .map((t) => document.getElementById(t.id))
        .filter(Boolean);
      if (!sections.length) {
        if (tries < 120) raf = requestAnimationFrame(() => attach(tries + 1));
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setScrollActive(entry.target.id);
          });
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      sections.forEach((s) => observer.observe(s));
    };
    attach();

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [pathname]);

  return (
    <>
      {/* ---- Scroll progress — hairline across the very top ---- */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-neutral-900"
      />

      {/* ---- Desktop: logo + fluid tabs together inside one glass pill ---- */}
      <motion.header
        animate={{ y: hidden ? -140 : scrolled ? -20 : 0 }}
        transition={barTransition}
        className="fixed inset-x-0 top-10 z-50 hidden justify-center lg:flex"
      >
        <div className={`flex items-center gap-4 rounded-full border border-white/40 ${pillTone} py-1.5 pl-6 pr-6 shadow-xl shadow-black/10 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300`}>
          <button type="button" onClick={() => goToSection("home")} aria-label="Home" className="shrink-0">
            {/* h-12 is the tallest mark the pill fits without growing it. */}
            <Logo markClassName="h-12" />
          </button>
          <span className="ml-6 h-7 w-px bg-neutral-500/30" />
          <FluidTabs tabs={tabs} activeTab={active} onSelect={goToSection} />
        </div>
      </motion.header>

      {/* ---- Mobile: logo + hamburger together inside one glass pill ---- */}
      <motion.div
        animate={{ y: hidden && !open ? "-120%" : 0 }}
        transition={barTransition}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-3 lg:hidden"
      >
        <div className={`flex items-center justify-between gap-3 rounded-full border border-white/40 ${pillTone} py-2 pl-4 pr-2 shadow-xl shadow-black/10 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300`}>
          <button type="button" onClick={() => goToSection("home")} aria-label="Home" className="shrink-0">
            <Logo markClassName="h-10" textClassName="text-[11px]" />
          </button>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/40 text-neutral-900 shadow-sm shadow-black/10 active:scale-95"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </motion.div>

      {/* ---- Mobile: full-screen overlay menu (monochrome) ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-neutral-50 font-sans antialiased lg:hidden"
          >
            {/* Padding matches the glass pill's outer offsets so the logo and
                button don't jump when the menu opens. */}
            <div className="flex items-center justify-between py-5 pl-8 pr-6">
              <Logo markClassName="h-12" textClassName="text-[15px]" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md shadow-black/10 active:scale-95"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Left-aligned row list: label on the left, a round chevron button
                on the right, hairline dividers between rows. */}
            <nav data-lenis-prevent className="flex-1 overflow-y-auto px-8 pt-10">
              {tabs.map((t, i) => {
                const isServices = t.id === "services";
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                    className="border-b border-neutral-200 last:border-b-0"
                  >
                    <button
                      type="button"
                      aria-expanded={isServices ? servicesOpen : undefined}
                      onClick={() => {
                        if (isServices) {
                          setServicesOpen((v) => !v);
                          return;
                        }
                        setOpen(false);
                        goToSection(t.id);
                      }}
                      className="flex w-full items-center justify-between gap-4 py-6 text-left"
                    >
                      <span
                        className={`font-sans text-3xl font-medium normal-case tracking-tight transition-colors ${
                          active === t.id ? "text-neutral-900" : "text-neutral-500"
                        }`}
                      >
                        {t.label}
                      </span>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm shadow-black/10">
                        {isServices ? (
                          <FiChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${
                              servicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        ) : (
                          <FiChevronRight size={20} />
                        )}
                      </span>
                    </button>

                    {isServices && (
                      <AnimatePresence>
                        {servicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col items-start gap-4 pb-6">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpen(false);
                                  navigate("/services");
                                }}
                                className="text-left font-sans text-lg font-semibold normal-case tracking-tight text-neutral-900"
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
                                  className="text-left font-sans text-base font-medium normal-case tracking-tight text-neutral-500"
                                >
                                  {s.navLabel}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            <div className="px-8 pb-10">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  goToSection("contact");
                }}
                className="w-full rounded-2xl bg-neutral-900 py-5 text-base font-semibold tracking-tight text-white shadow-lg shadow-black/20 transition-colors hover:bg-neutral-800 active:scale-[0.99]"
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
