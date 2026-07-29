# AGENTS.md

Operating guide for this repository. Read this before editing. It reflects the
July 2026 "Signal Path" white-first redesign and is binding.

This is a GitHub user Pages site served at the domain root. The stack is
Next.js 15 with the App Router, TypeScript in strict mode and Tailwind CSS v4,
compiled to a fully static export (`output: 'export'`) and published to Pages
by GitHub Actions from the `out/` directory. There is no server, no API route,
no database, no runtime environment variable and no client-side data fetching.

Keep it static. The export must keep working, so these are binding:
`trailingSlash: true`; `images: { unoptimized: true }`; `public/.nojekyll` so
Jekyll does not strip `_next`; a `generateStaticParams` on every dynamic route
returning all slugs; a `not-found.tsx` so the export emits `404.html`; and no
`basePath` or `assetPrefix`, because a user site is served from `/` and either
would break every asset path. Confirm against the absence of a CNAME file
before changing this.

The site must make zero runtime third-party requests: all fonts and assets are
self-hosted, Next.js telemetry is disabled, and no analytics or tracking of any
kind may be added. Content lives in a typed layer under `src/content/`; no copy
is hard-coded in a component.

Write in Australian and UK spelling. Do not use em dashes or en dashes anywhere,
use commas, colons or full stops. Write date ranges as "Jan 2026 to Jun 2026".
Never use the word "Present" for a role.

## Design system: "Signal Path", white first

The canvas is white. `--tint` (`#F6F6F8`) is the only banding colour and is
used full bleed, never as a floating slab. Primary text is `#0D0D0F`, secondary
`#4E4E57`, tertiary `#5F5F68`; every step clears 4.5:1 on white. The single
interactive accent is deep engineering blue `#0B5CD5`. There is no global theme
control, no dark slab stage and no second hue.

Type is a two-face pairing: Space Grotesk for display (`--font-display`),
Hanken Grotesk for body and UI (`--font-body`). The `next/font` variables live
on `<html>`, because the family tokens are declared on `:root` and a `var()`
inside a custom property resolves where that property is declared. Moving them
to `<body>` silently drops the whole site to the system stack.

Keep navigation minimal, headings large but held to a short measure so they
break where they were written to break, copy concise and stages spacious. Do
not add grain, terminal chrome, telemetry readouts, gold or category colour
coding, glass effects, glow, stock illustrations or dashboard decoration.

### Motion

Motion carries meaning: it explains sensing, planning, transport, verification
and progression. It is built from three parts, all in `src/components/signal/`
plus `src/components/motion/Reveal.tsx`:

- `SignalHero`: the homepage graphic. Pure SVG and CSS keyframes, no
  JavaScript. The travelling pulse is a dash segment sweeping the same path the
  route is drawn on, so route and pulse stay in register at every size.
- `SystemDiagram`: eight per-record signature diagrams, one per published work
  record, keyed by slug in `BY_SLUG`. A record gets the diagram of the idea it
  is actually about; never reuse one reveal across records.
- `ClosedLoop`, `StackSpine`, `CareerSpine`: scroll-linked fills via
  framer-motion `useScroll`. These are normal-height blocks, never sticky
  scroll traps, so they cannot strand an empty viewport.
- `Reveal`: CSS-driven, not framer-motion `whileInView`. The server renders the
  visible state; the hidden state applies only under `html[data-js]`, set by
  the inline script in `layout.tsx`. This is binding: `whileInView` ships
  `opacity: 0` in the static HTML and blanks the page without JavaScript.

Every diagram must settle on a complete, readable state under
`prefers-reduced-motion: reduce`, and content must never be gated on an
animation. The first authored state must remain complete without JavaScript.

SVG text scales with the viewBox, so a width-driven diagram renders its labels
at roughly 22px in a wide container and 7px on a phone. `SystemDiagram` is
sized by height instead and its plate scrolls horizontally on narrow screens.
Never give the diagram `width: 100%`.

Accessibility: never signal state by dimming text opacity. Fading copy to mark
an inactive stage drops it below 4.5:1; shift between two passing colours
instead, as `ClosedLoop` does with its stage index.

Project images use the typed presentation fields in `src/content/projects.ts` and
the central `ProjectImage` component. Informative diagrams and screenshots use
`contain`. Use `cover` only for a verified safe photographic crop. Preserve explicit
dimensions, responsive `sizes`, aspect ratio and optional mobile art direction.

## Truthful career representation (binding)

- The resume `assets/Resume_Sajeevan_Veeriah.pdf` is the source of truth. Do
  not edit the PDF. If site copy conflicts with it, prefer the resume and add
  `<!-- TODO: verify against resume -->`.
- Five evidence tiers: Delivered, Hands-on, Working knowledge, Adjacent,
  Target. Never promote a claim above its evidence.
- Ford must only ever appear as "Ford Motor Company via Invenio contract
  placement", never as direct Ford employment.
- JAG Process Solutions is Jan 2026 to Jun 2026. No role uses "Present".
- Never invent employers, dates, roles, clients, metrics, certifications,
  licences, work rights, citizenship, clearances, testimonials or awards.
  Never imply a personal concept was a production deployment.

## Contact and privacy (binding)

Exactly three personal channels are permitted, and only these: the email
`sajeevanveeriah@gmail.com`, `https://www.linkedin.com/in/sajeevan-veeriah/`
and `https://github.com/Sajeevanveeriah`, plus the resume download. Never add
telephone numbers, street or suburb addresses, personal or role locations,
visa, work-rights or availability statements, `geo.*` metadata, or JSON-LD
`telephone` or `address`. Legal company names containing geographic words
(for example "Thornton Engineering Australia Pty Ltd") are fine.

## Structure and behaviour

The current implementation is a static Next.js App Router site. Routes live under
`src/app/`: home, Work and project details, Atlas and domain details, Skills,
About and role details, Contact and the static 404. Typed content lives under
`src/content/`. Keep every critical route and link server rendered. Interactive
filters and reveal motion are progressive enhancement only: the work archive
and the atlas index render complete and unfiltered without JavaScript.

Work records are case studies, not cards. `/work/[slug]` renders a numbered
narrative (problem, system, ownership, decisions, implementation, validation,
outcome, honest scope) beside a sticky meta rail, with the record's signature
diagram under the architecture chapter. Empty content fields drop their chapter
rather than rendering a blank one.

Keep the preserve list intact: `robots.txt`, `sitemap.xml`, `BingSiteAuth.xml`,
`googlebcce96f6b520ab1f.html`, the resume PDF, project images and fonts.
