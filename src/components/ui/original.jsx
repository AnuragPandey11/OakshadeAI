// src/components/ui/original.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * FluidTabs — a pill tab bar whose active background fluidly slides between
 * tabs (shared layout) while the active label expands open from its icon.
 *
 * A tab may carry an optional `dropdown` array of items:
 *   { label, onSelect, primary? }
 * When present, the tab opens a dropdown panel on hover AND on click, and a
 * click does NOT fire the tab's own `onSelect` (so it won't scroll away).
 */
export function FluidTabs({ tabs, defaultTab, activeTab, onSelect }) {
  const [internal, setInternal] = useState(defaultTab ?? tabs[0]?.id);
  // Controlled when `activeTab` is provided (e.g. driven by scrollspy).
  const active = activeTab ?? internal;

  // id of the tab whose dropdown is currently open (only one at a time).
  const [openId, setOpenId] = useState(null);

  // Close the open dropdown on Escape or a click outside it.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e) => e.key === "Escape" && setOpenId(null);
    const onDown = (e) => {
      if (!e.target.closest?.("[data-fluid-dropdown]")) setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [openId]);

  return (
    <div className="flex items-center gap-3">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const hasDropdown =
          Array.isArray(tab.dropdown) && tab.dropdown.length > 0;
        const isOpen = openId === tab.id;

        const button = (
          <button
            type="button"
            onClick={() => {
              if (hasDropdown) {
                // Open the dropdown — never scroll to the section.
                setOpenId(tab.id);
                return;
              }
              setInternal(tab.id);
              onSelect?.(tab.id);
            }}
            aria-pressed={isActive}
            aria-expanded={hasDropdown ? isOpen : undefined}
            className={`relative flex items-center rounded-full px-5 py-2.5 outline-none transition-colors duration-300 ${
              isActive
                ? "text-neutral-900"
                : "text-neutral-600 hover:text-neutral-800"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="fluid-pill"
                className="absolute inset-0 rounded-full border border-white/60 bg-white/50 shadow-sm shadow-black/10 backdrop-blur-md"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-2">
              <span className="shrink-0">{tab.icon}</span>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    key="label"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="overflow-hidden whitespace-nowrap text-sm font-semibold tracking-tight"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {hasDropdown && (
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </span>
          </button>
        );

        if (!hasDropdown) {
          return <div key={tab.id}>{button}</div>;
        }

        return (
          <div
            key={tab.id}
            data-fluid-dropdown
            className="relative"
            onMouseEnter={() => setOpenId(tab.id)}
            onMouseLeave={() => setOpenId(null)}
          >
            {button}

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, x: "-50%" }}
                  animate={{ opacity: 1, y: 0, x: "-50%" }}
                  exit={{ opacity: 0, y: 8, x: "-50%" }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  // Centered under the tab via x:-50% — kept inside the motion
                  // values so Framer's inline transform doesn't clobber it (a
                  // Tailwind -translate-x-1/2 class would be overridden). pt-3
                  // is an invisible bridge so the pointer can reach the panel.
                  className="absolute left-1/2 top-full z-50 pt-3"
                >
                  <div className="w-72 overflow-hidden rounded-2xl border border-white/60 bg-white/90 p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl">
                    {tab.dropdown.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          item.onSelect?.();
                          setOpenId(null);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                          item.primary
                            ? "mb-1 border-b border-neutral-200 font-semibold text-neutral-900 hover:bg-neutral-100"
                            : "font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                        }`}
                      >
                        {item.icon && (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                            {item.icon}
                          </span>
                        )}
                        <span className="flex-1">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default FluidTabs;
