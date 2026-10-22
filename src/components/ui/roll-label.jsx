// src/components/ui/roll-label.jsx

// Shared curve with the clip-path reveals, so hovers feel like the same system.
const ROLL = "transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]";

/**
 * RollLabel — a button label that rolls up on hover: the text slides out the
 * top while an identical copy rises from below. Pure CSS, driven by the
 * parent's `group` class, so the button itself must carry `group`.
 *
 * Plain spans with Tailwind transforms (no Framer) — safe inside motion
 * buttons and Magnetic wrappers without transform clashes.
 */
export default function RollLabel({ children }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className={`${ROLL} group-hover:-translate-y-full`}>{children}</span>
      <span aria-hidden="true" className={`absolute inset-0 translate-y-full ${ROLL} group-hover:translate-y-0`}>
        {children}
      </span>
    </span>
  );
}
