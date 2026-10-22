# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Serve the production build locally
```

There is no test runner and no linter configured in this project. After changes,
verify with `npm run build` (Rollup errors on missing/renamed imports, which is
the main way breakages surface here).

## Stack

Vite + React 18 SPA. Tailwind CSS v3, `react-router-dom` v7 (BrowserRouter),
`framer-motion` for animation, raw WebGL1 for shaders (no three.js — see "Motion &
shaders"), and icons from **two** libraries: `lucide-react`
(most UI) and `react-icons` (nav tab icons + brand/social icons that lucide
dropped, e.g. `FaInstagram`, `FaFacebookF`, `FaWhatsapp`). No TypeScript, no SSR.

## Content lives in `src/utils/` (core convention)

All editable site content is data, not JSX. Never hardcode content arrays inside
components — add/edit it in the relevant `src/utils/*.js` file:

- **`servicesData.js`** — the `services` array is the single source that drives the
  header "Our Services" dropdown, the home Services carousel, the `/services` card
  grid, **and** each `/services/:slug` detail page (via `getServiceBySlug`). Each
  service has a `slug`, card copy, a `detail` block, and an `iconName`.
- **`projectsData.js`** — `projectGroups` (tabs for the home "Our Work" slider,
  each group holding multiple entries) plus derived `allProjects` and
  `projectCategories` (used by the `/work` grid + single category filter).
- **`contactData.js`** / **`brandConfig.js`** — contact section copy + assets, and
  global brand details (name, email, socials) reused by the footer and contact.
- **`heroData.js`** — home hero copy + CTA buttons (`homeHero`) and the
  `/services` + `/work` page headers (`pageHeroes`). Headlines are plain
  sentences; they animate word by word.
- **`aboutData.js`** — the home "Why Oakshade" manifesto line + count-up stats.
  **Placeholder copy/numbers** — replace before launch.
- **`techStackData.js`** — the two-row tech marquee under the hero
  (placeholder stack; icons mapped in `tech-marquee.jsx`).
- **Serif accents:** in any headline string, `*word*` (or `*a few words*`)
  renders in Playfair italic via `parseAccents` in `reveal.jsx`. Used in hero,
  page, section, contact and manifesto headings.

Icons are stored as **string** `iconName` values and mapped to components locally
in each consumer (the `iconMap` / `serviceIconMap` pattern). Keep data files free
of JSX so they stay easy to edit.

## Routing & navigation

- `main.jsx` wraps `<App/>` in `<MotionConfig reducedMotion="user">` +
  `<BrowserRouter>`. `App.jsx` holds the `<Routes>` and a `Layout` (Header +
  routed page + Footer, shared by every page). Pages are in `src/pages/`
  (`Home`, `AllServices`, `ServiceDetail`, `AllWork`).
- **Page transitions:** `Layout` renders `useOutlet()` inside
  `<AnimatePresence mode="wait">` keyed by pathname. The scroll-to-top happens
  in `onExitComplete` (after the old page has faded out), and is skipped when
  `state.scrollTo` is present. Because the new page mounts only after the exit,
  the header scrollspy retries for ~2s until Home's sections exist.
- **Smooth scrolling (Lenis)** starts in `main.jsx`. It owns the scroll
  position, so a raw `window.scrollTo` / `scrollIntoView` gets overridden.
  **Always** use the helpers in `src/lib/smooth-scroll.js`: `scrollToSection(id)`,
  `resetScroll()`, `lockScroll()` / `unlockScroll()`. Horizontal scrollers
  (carousels, tab strips) carry `data-lenis-prevent-horizontal`; inner vertical
  scrollers carry `data-lenis-prevent`. Off under reduced motion.
- **First-visit intro** (`intro.jsx` + `src/lib/intro.js`): plays once per
  browser session, only when landing on `/`, never under reduced motion. The
  hero reads `introPending()` to delay its reveal until the curtain lifts.
- **"View" cursor** (`view-cursor.jsx`): add `data-cursor="View"` to any
  element to show the trailing disc over it (mouse/trackpad only).
- `<main>` uses `overflow-x-clip`, **not** `overflow-hidden` — `hidden` makes it
  a scroll container and silently breaks every `position: sticky` inside.
- **Home is a single scroll page.** Its sections carry the ids `home`, `services`,
  `process`, `work`, `team`, `contact`. The header's scrollspy
  (`IntersectionObserver`) highlights the active section.
- **Cross-page section links** work via router state: navigate with
  `navigate("/", { state: { scrollTo: "contact" } })` (or `<Link state=...>`), and
  `Home` reads `location.state.scrollTo` on mount to smooth-scroll there.
- The header computes the active tab from the route (`/services*` → services,
  `/work` → work) and otherwise defers to the scrollspy result.
- **Deployment gotcha:** BrowserRouter needs the host to rewrite unknown paths to
  `index.html`, or refreshing `/services` etc. 404s.

## Header dropdown (`components/ui/original.jsx` = `FluidTabs`)

The desktop nav is an animated pill bar. A tab may carry a `dropdown` array
(`{ label, icon, onSelect, primary }`); the "Our Services" tab uses it. Such a tab
opens on **hover and click**, and clicking does **not** fire the tab's scroll
action. `header.jsx` builds the dropdown items (with icons) from `servicesData`.

**Framer Motion gotcha:** Framer sets an inline `transform` when animating (e.g.
`y`), which **overrides Tailwind transform utilities** like `-translate-x-1/2`.
The dropdown is centered by putting `x: "-50%"` in the motion values, not a
Tailwind class. Watch for this whenever positioning an animated element.

## Theming

Monochrome neutral palette (Tailwind `neutral-*`, black/white). Section headings
use `font-bold tracking-tight`. Conventions:

- CSS variables `--color-*` are defined in `src/index.css` and used by the
  `/services` and `/work` pages — change them there to re-theme those pages in one
  place. They are currently set to neutral values.
- Tailwind config: `font-sans` = Inter, `font-serif` = Playfair Display (imported
  in `index.css`). The `primary` Tailwind color is driven by an inline `--primary`
  hex var set per flip card.
- `cn(...)` in `src/lib/utils.js` is the classnames joiner.

## Reusable UI primitives

- **`carousel.jsx`** — scroll-snap track with dots + arrows, responsive (multi-up
  on desktop, one-at-a-time swipe on mobile). Used by the Services carousel and the
  Our Process **mobile-only** slider (`sm:hidden`, grid stays for `sm`+).
- **`section-heading.jsx`** — left title/eyebrow + optional right CTA button; shared
  by the home Services and Work sections.
- **`animated-tabs.jsx`** — the tab bar used inside the home "Our Work" section,
  where each tab renders a `ProjectSlider` (the "N of M" entry slider).
- **`page-hero.jsx`** — the centred hero for `/services` and `/work`.

## Motion & shaders

- **`reveal.jsx`** — `MaskedText` (words slide up out of masks) and `FadeIn`.
  `trigger="mount"` for heroes, default plays once on scroll into view. Put
  `whileInView` on an untransformed wrapper, never on an element that starts
  translated out of an `overflow-hidden` mask — it never "intersects".
  Also `Eyebrow` (label led by a hairline rule that draws in) and
  `ClipReveal` (clip-path curtain for images; it watches visibility on an
  unclipped wrapper because a fully clipped element never counts as in view).
- **`magnetic.jsx`** — wrap pill CTAs so they lean toward the mouse.
- **`spotlight.jsx`** — mouse-following glow on a card's border
  (`/services` + `/work` cards).
- Home section seams: the hero fades into white at its bottom, Process fades
  in from white, and Work is a near-black sheet with a curved top that
  overlaps Process (`-mt` + `rounded-t`). The footer has the same curved top
  and an oversized wordmark (`brandConfig.wordmark`).
- Don't put Tailwind `hover:-translate-*` on a motion element — Framer's
  inline transform wins. Use `whileHover={{ y: -4 }}` instead.
- **`shader-canvas.jsx`** — animated fragment-shader background that fills its
  positioned parent (give the parent a matching CSS bg as the fallback). Pauses
  offscreen; single still frame under reduced motion. Built-in uniforms:
  `u_time`, `u_resolution`, `u_dpr`, `u_mouse`, `u_hover`.
- **`shader-image.jsx`** — `<img>` replacement that liquid-wipes between `src`
  values (Our Work slider). Remote images need CORS headers to become textures
  (Unsplash and same-origin are fine); otherwise the plain `<img>` underneath
  shows.
- GLSL lives in `src/lib/shaders.js` (`smokeShader`, `halftoneShader`,
  `imageTransitionShader`); WebGL plumbing in `src/lib/webgl.js`. Keep shaders
  monochrome. Used by: home hero + page heroes (smoke), footer + service CTA
  (halftone).
- Film grain is a `body::after` overlay in `index.css`.
- The header hides on scroll-down / returns on scroll-up and draws a scroll
  progress hairline at the top.

## Assets & known gaps

- Static assets live in `public/media/`. The header logo is
  `/media/oakshade-logo.png` (a transparent-background version generated from
  `AI LOGO 2.png`).
- The contact form has **no backend** — `handleSubmit` simulates success. Wire it
  to a real endpoint/email service where the `// TODO` comment is in
  `contact-section.jsx`.
