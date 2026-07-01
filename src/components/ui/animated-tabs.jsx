// src/components/ui/animated-tabs.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function AnimatedTabs({ tabs = [], defaultTab, className }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  if (!tabs?.length) return null;

  return (
    <div className={cn("flex w-full flex-col gap-y-3", className)}>
      <div className="flex max-w-full flex-nowrap gap-2 self-center overflow-x-auto rounded-xl bg-[#11111198] bg-opacity-50 p-1 backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
