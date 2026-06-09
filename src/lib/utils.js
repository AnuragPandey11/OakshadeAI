// src/lib/utils.js
// Minimal classnames joiner (stand-in for the shadcn `cn` helper).
// Flattens, drops falsy values, and joins with spaces.
export function cn(...inputs) {
  return inputs.flat(Infinity).filter(Boolean).join(" ");
}
