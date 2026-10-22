// src/lib/intro.js
// Decides — once, at page load — whether the first-visit logo intro plays,
// and shares that with the hero so its reveal waits for the curtain to lift.
//
// It plays only when: the visitor lands on the home page, hasn't seen it yet
// this browser session, and hasn't asked for reduced motion. Deep links
// (/services/…, /work) never get it.
import { prefersReducedMotion } from "./webgl";

const KEY = "oakshade-intro-seen";

// Seconds from page load until the hero should start revealing itself (the
// intro's ~0.9s beat plus part of the curtain lift).
export const INTRO_HERO_DELAY = 1.15;

let pending = (() => {
  try {
    if (window.location.pathname !== "/") return false;
    if (prefersReducedMotion()) return false;
    return !window.sessionStorage.getItem(KEY);
  } catch {
    return false; // storage blocked (private mode etc.) — just skip the intro
  }
})();

/** True until the intro has finished (only ever on the first page load). */
export const introPending = () => pending;

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    /* storage unavailable — the intro may replay next load, which is fine */
  }
}

export function finishIntro() {
  pending = false;
}
