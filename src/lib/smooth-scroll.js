// src/lib/smooth-scroll.js
// Site-wide smooth (eased) wheel scrolling via Lenis, plus the helpers every
// programmatic scroll and scroll-lock must go through. While Lenis is running
// it owns the scroll position: a plain window.scrollTo / scrollIntoView gets
// overridden by its next animated frame, so always use these functions.
//
// Lenis only eases mouse-wheel / trackpad input — touch scrolling stays native
// — and it's never started under prefers-reduced-motion. When it isn't
// running, every helper falls back to the native equivalent.
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { prefersReducedMotion } from "./webgl";

let lenis = null;

/** Starts Lenis. Called once from main.jsx, before React mounts. */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return;
  lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
}

/**
 * Scrolls to a home section by id ("home" = the very top), honouring the
 * section's scroll-margin-top. `immediate` jumps without animating.
 */
export function scrollToSection(id, { immediate = false } = {}) {
  const target = id === "home" ? 0 : document.getElementById(id);
  if (target === null) return;

  if (lenis) {
    lenis.scrollTo(target, { immediate, duration: 1.4, easing: easeOutExpo });
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
  } else {
    target.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  }
}

/** Jumps to the top instantly (used between page transitions). */
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

/** Freezes page scrolling (mobile menu, intro) / releases it again. */
export function lockScroll() {
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}
export function unlockScroll() {
  document.documentElement.style.overflow = "";
  lenis?.start();
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
