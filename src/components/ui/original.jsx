// src/components/ui/original.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FluidTabs — a pill tab bar whose active background fluidly slides between
 * tabs (shared layout) while the active label expands open from its icon.
 */
export function FluidTabs({ tabs, defaultTab, activeTab, onSelect }) {
  const [internal, setInternal] = useState(defaultTab ?? tabs[0]?.id);
  // Controlled when `activeTab` is provided (e.g. driven by scrollspy).
  const active = activeTab ?? internal;

  return (
    <div className="flex items-center gap-3">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setInternal(tab.id);
              onSelect?.(tab.id);
            }}
            aria-pressed={isActive}
            className={`relative flex items-center rounded-full px-5 py-2.5 outline-none transition-colors duration-300 ${
              isActive ? "text-neutral-900" : "text-neutral-600 hover:text-neutral-800"
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
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default FluidTabs;
