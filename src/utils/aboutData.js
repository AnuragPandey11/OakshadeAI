// src/utils/aboutData.js
// ─────────────────────────────────────────────────────────────────────────
// Drives the home "Why Oakshade" section: a manifesto line that darkens word
// by word as you scroll, then a row of count-up stats.
//
// Products shipped and industries served are real figures. ⚠ The last two
// stats are still PLACEHOLDERS: replace them before launch.
//
// In `statement`, wrap words in *asterisks* to set them in the serif italic
// accent (a run of words works too: "*keeps working*").
// ─────────────────────────────────────────────────────────────────────────

export const manifesto = {
  eyebrow: "Why Oakshade",
  statement:
    "No account managers, no handoffs. You talk directly to the people designing and building your product, get timelines you can actually plan around, and end up with software that *keeps working* long after launch.",
};

// `value` counts up from 0; `suffix` is appended as-is.
export const stats = [
  { value: 20, suffix: "+", label: "Products shipped" },
  { value: 5, suffix: "+", label: "Industries served" },
  { value: 98, suffix: "%", label: "Clients who come back" },
  { value: 24, suffix: "h", label: "Average reply time" },
];
