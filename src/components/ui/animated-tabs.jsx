// src/components/ui/animated-tabs.jsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function AnimatedTabs({ tabs = [], defaultTab, className }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const scrollRef = useRef(null);
  const tabRefs = useRef({});

  /* Centre a tab inside its own horizontal strip WITHOUT touching the page
     scroll. `scrollIntoView` walks every scrollable ancestor including the
     document, so on mount it yanked the visitor down to this section — the
     page opened at "Our Work" instead of the hero. Scrolling the track
     directly keeps the effect local to the tab strip. */
  const centerTab = (id, behavior = "smooth") => {
    const track = scrollRef.current;
    const el = tabRefs.current[id];
    if (!track || !el) return;
    const trackBox = track.getBoundingClientRect();
    const elBox = el.getBoundingClientRect();
    const left =
      track.scrollLeft +
      (elBox.left - trackBox.left) -
      (trackBox.width - elBox.width) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior });
  };

  const selectTab = (id) => {
    setActiveTab(id);
    centerTab(id);
  };

  // Keep the active tab in view on mount / when tabs change.
  useEffect(() => {
    centerTab(activeTab, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  if (!tabs?.length) return null;

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className={cn("flex w-full flex-col gap-y-3", className)}>
      <div className="self-center max-w-full">
        <div
          ref={scrollRef}
          data-lenis-prevent-horizontal
          className="flex max-w-full flex-nowrap gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              onClick={() => selectTab(tab.id)}
              className={cn(
                "relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium outline-none transition-colors duration-300",
                activeTab === tab.id ? "text-neutral-900" : "text-white/60 hover:text-white"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-full bg-white"
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
                  i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/25"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-full min-h-[460px] rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white md:p-8">
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
