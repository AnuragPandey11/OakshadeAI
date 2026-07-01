// src/components/ui/animated-tabs.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function AnimatedTabs({ tabs = [], defaultTab, className }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const scrollRef = useRef(null);
  const tabRefs = useRef({});

  const selectTab = (id) => {
    setActiveTab(id);
    tabRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  // Keep the active tab in view on mount / when tabs change.
  useEffect(() => {
    tabRefs.current[activeTab]?.scrollIntoView({ inline: "center", block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  if (!tabs?.length) return null;

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className={cn("flex w-full flex-col gap-y-3", className)}>
      <div className="self-center max-w-full">
        <div
          ref={scrollRef}
          className="flex max-w-full flex-nowrap gap-2 overflow-x-auto rounded-xl bg-[#11111198] bg-opacity-50 p-1 backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              onClick={() => selectTab(tab.id)}
              className="relative shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-white outline-none transition-colors"
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-lg bg-[#111111d1] bg-opacity-50 shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile-only dots — signal there are more tabs to swipe through */}
        {tabs.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5 sm:hidden">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                type="button"
                aria-label={`Show ${tab.label}`}
                onClick={() => selectTab(tab.id)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === activeIndex ? "w-5 bg-neutral-800" : "w-1.5 bg-neutral-300"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-full min-h-[460px] rounded-xl border border-white/10 bg-[#11111198] bg-opacity-50 p-6 text-white shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm md:p-8">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, scale: 0.95, x: -10, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: "circInOut", type: "spring" }}
                className="h-full"
              >
                {tab.content}
              </motion.div>
            )
        )}
      </div>
    </div>
  );
}
