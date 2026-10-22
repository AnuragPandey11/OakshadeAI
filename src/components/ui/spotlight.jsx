// src/components/ui/spotlight.jsx

/**
 * Spotlight — a soft glow on a card's border (plus a faint wash inside) that
 * follows the mouse while the card is hovered.
 *
 * Usage: give the card `relative group` + `onPointerMove={trackSpotlight}`,
 * and render <Spotlight /> as its first child. Pass the card's rounding via
 * `className` if it isn't rounded-2xl.
 */
export function trackSpotlight(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
  el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
}

// A 1px ring: the gradient fills the padding box, and the mask cuts out the
// content box, leaving only the border showing.
const ringStyle = {
  padding: 1,
  background:
    "radial-gradient(260px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(23,23,23,0.6), transparent 70%)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
};

const washStyle = {
  background:
    "radial-gradient(340px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(23,23,23,0.045), transparent 70%)",
};

export function Spotlight({ className = "rounded-2xl" }) {
  return (
    <>
      <span
        aria-hidden="true"
        style={washStyle}
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${className}`}
      />
      <span
        aria-hidden="true"
        style={ringStyle}
        className={`pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${className}`}
      />
    </>
  );
}
