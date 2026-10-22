// src/components/ui/magnetic.jsx
import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

const spring = { stiffness: 220, damping: 15, mass: 0.4 };

/**
 * Magnetic — wraps a button/link so it leans toward the mouse while hovered and
 * springs back on leave. Mouse only (touch and pen are ignored), and inert
 * under prefers-reduced-motion. Put layout classes (w-fit, shrink-0) on the
 * wrapper via `className`.
 */
export default function Magnetic({ children, className, strength = 0.3 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  if (reduce) return <div className={cn("inline-block", className)}>{children}</div>;

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
