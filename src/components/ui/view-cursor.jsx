// src/components/ui/view-cursor.jsx
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const follow = { stiffness: 450, damping: 38, mass: 0.5 };

/**
 * ViewCursor — a contextual cursor, not a site-wide replacement. Anything
 * marked `data-cursor="View"` shows a black "View ↗" disc that trails the
 * pointer (and hides the native cursor there, via index.css). Everywhere else
 * the normal cursor is untouched.
 *
 * Mouse/trackpad only: it never mounts its listeners on touch devices.
 */
export default function ViewCursor() {
  const [label, setLabel] = useState(null);
  const x = useSpring(0, follow);
  const y = useSpring(0, follow);
  const last = useRef({ x: 0, y: 0 });
  const labelRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const labelAt = (el) => el?.closest?.("[data-cursor]")?.dataset.cursor ?? null;
    const update = (next) => {
      labelRef.current = next;
      setLabel(next);
    };

    const onMove = (e) => {
      last.current = { x: e.clientX, y: e.clientY };
      // Jump (don't trail) when the disc is appearing, so it never flies in
      // from wherever it was last hidden.
      const next = labelAt(e.target);
      if (next && !labelRef.current) {
        x.jump(e.clientX);
        y.jump(e.clientY);
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
      }
      update(next);
    };
    // Scrolling moves content under a still pointer — re-check what's there.
    const onScroll = () => {
      const { x: px, y: py } = last.current;
      update(labelAt(document.elementFromPoint(px, py)));
    };
    const onLeave = (e) => !e.relatedTarget && update(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [x, y]);

  return (
    // Three layers on purpose: the outer follows the pointer (motion x/y),
    // the middle centres on it with Tailwind translate, and the inner scales.
    // Animating scale on the translated layer would wipe out the centring.
    <motion.div aria-hidden="true" style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[90]">
      <div className="-translate-x-1/2 -translate-y-1/2">
        <AnimatePresence>
          {label && (
            <motion.div
              key="view-cursor"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="flex h-20 w-20 items-center justify-center gap-1 rounded-full bg-neutral-900/90 text-xs font-semibold uppercase tracking-wider text-white shadow-xl shadow-black/20 backdrop-blur-sm"
            >
              {label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
