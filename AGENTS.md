# AGENTS.md

Operating guide for this repository. Read this before editing. It is derived
from the Robotics Portfolio Redesign specification and is binding.

This is a GitHub user Pages site served directly from the default branch root.
The stack is buildless: plain HTML, CSS and a small amount of vanilla JS. Keep
it buildless. Do not add a framework, bundler, package manager, build step or
GitHub Actions deploy. The final site must have zero runtime third party
requests, so all fonts and assets are self hosted.

Write in Australian and UK spelling. Do not use em dashes or en dashes anywhere,
use commas, colons or full stops. Write date ranges as "Jan 2026 to Jun 2026".
Never use the word "Present" for a role.

## Design system

Palette

- Background `#F4F1EA`. Ink text `#16150F`. Muted text `#6B6A60`.
- Hairlines `rgba(22,21,15,0.12)`.
- Single accent `#E8542B`, used sparingly for links, active states and key marks.
- Dark mode via `prefers-color-scheme`: background `#0E0E0C`, text `#ECE9E0`,
  same accent.

Typography (self hosted woff2 in `assets/fonts/`)

- Display headings: Space Grotesk.
- Body and UI: Hanken Grotesk.
- Mono for metadata, section numbers, dates and labels: IBM Plex Mono.
- Declare with `@font-face` and `font-display: swap`. Preload display and body
  fonts. No Google Fonts at runtime. No Font Awesome.
- Tight negative letter spacing on large display headings, comfortable body line
  height, tabular figures for dates and numbers.

Layout

- Left aligned editorial layout, content width about 1080 to 1180 px with
  generous gutters. No centred floating card.
- Sticky minimal top nav: SV monogram left, anchor links right (Work,
  Experience, Skills, Contact), thin bottom hairline, faint near solid bar (no
  heavy glassmorphism), active section indicator.
- Hero near full height, large left aligned robotics led headline, one line
  subhead, mono metadata strip, two calls to action (Email, Resume). One subtle
  signature visual behind content that honours `prefers-reduced-motion`.
- Section pattern: mono section number (01, 02, 03), label, large heading,
  content, hairline dividers, ample whitespace.
- Skills as a structured capabilities block with mono category labels. No per
  skill icon. Chips, if any, are hairline outlined, not filled pills.
- Experience as a clean typographic list or restrained vertical timeline: role
  in display type, company, location and dates in mono with tabular figures,
  tight bullets, hairline separators, subtle outline tags.
- Footer: SV monogram, contact, links, a short honest line, the year, hairline
  top border.

Motion

- Subtle scroll reveal (opacity plus 8 to 16 px translateY) via
  IntersectionObserver, staggered, disabled under `prefers-reduced-motion`.
- Thin animated link underline on hover, clear `:focus-visible` rings, smooth
  anchor scrolling with `scroll-margin-top` for the sticky nav.
- No parallax overkill, no bouncing, no autoplay.
- Radius scale 0 to 6 px. Prefer hairlines over heavy shadows.

## Hard bans

- No purple, violet or indigo gradients or blobs. No `#667eea` to `#764ba2`
  gradient.
- No gradient filled text. No glassmorphism blur and translucency stacks.
- No Font Awesome. No emoji anywhere, including the favicon.
- No centred white rounded card on a coloured page. No "Hi, I'm ..." hero. No
  stock taglines, fake testimonials or placeholder logos.
- Inter or Roboto must not be the only typeface. Avoid uniform large radius
  corners and heavy shadows everywhere.
- Do not fabricate metrics, employers, certifications, dates or claims. The
  resume `assets/Resume_Sajeevan_Veeriah.pdf` is the source of truth. If a site
  claim conflicts with the resume, prefer the resume and add an HTML comment
  `<!-- TODO: verify against resume -->`.

## Preserve list (do not rename or delete)

- `robots.txt`
- `sitemap.xml` (keep canonical `https://sajeevanveeriah.github.io/`)
- `BingSiteAuth.xml`
- `googlebcce96f6b520ab1f.html`
- `assets/Resume_Sajeevan_Veeriah.pdf`
- Keep and upgrade the JSON-LD `Person` schema. `jobTitle` is "Mechatronics,
  Robotics, Automation and AI/ML Engineer" (broad complete-package positioning,
  per the July 2026 redesign direction). Do not claim current employment via
  `worksFor`. Keep `sameAs`, `alumniOf` Deakin, the Geelong and Highton VIC AU
  address and email.

## Evidence tiers (site-wide honesty system)

Capability claims use five tiers, rendered with `.tier` badges and used in the
Domain Atlas (`assets/js/domain-atlas.js`), Systems Stack, Skills and project
details: Delivered (professional or project delivery evidence), Hands-on
(built, tested, configured or used directly), Working knowledge (credible
study or coursework), Adjacent (transferable exposure from nearby systems),
Target (strategic growth domain). Never promote a claim above its evidence.
Ford must only ever appear as "Ford Motor Company via Invenio contract
placement", never as direct Ford employment.
