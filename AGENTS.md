# AGENTS.md

Operating guide for this repository. Read this before editing. It reflects the
July 2026 "Systems Engineer Interface" redesign direction and is binding.

This is a GitHub user Pages site served directly from the default branch root.
The stack is buildless: plain HTML, CSS and a small amount of vanilla JS. Keep
it buildless. Do not add a framework, bundler, package manager, build step or
GitHub Actions deploy. The final site must have zero runtime third party
requests, so all fonts and assets are self hosted.

Write in Australian and UK spelling. Do not use em dashes or en dashes anywhere,
use commas, colons or full stops. Write date ranges as "Jan 2026 to Jun 2026".
Never use the word "Present" for a role.

## Design system: "Systems Engineer Interface"

This is a premium dark technical portfolio, not a paper resume page. Do not
revert it to a light beige theme, paper-grid background or orange accent.

Palette (tokens at the top of `styles.css`)

- Background `#0B0E13` graphite, raised surfaces via the `--card` gradient.
- Text `#E9EDF3`, muted `#9AA6B6`, hairlines `rgba(146,172,210,0.14)`.
- Single accent: signal cyan `#41C9E4` (bright `#7FE0F2`), used for links,
  active states, tier-delivered badges, kickers and glows. No purple, no
  multi-colour gradients, no orange.

Typography (self hosted woff2 in `assets/fonts/`)

- Display: Space Grotesk, large and confident (hero name up to ~6.4rem,
  tight negative tracking).
- Body and UI: Hanken Grotesk. Mono (IBM Plex Mono) is reserved for small
  system labels, kickers, dates and tier badges only; never body copy.
- `@font-face` with `font-display: swap`, preload display and body fonts.
  No Google Fonts at runtime. No Font Awesome.

Layout and components

- 1200 px wrap, tall section rhythm, numbered mono kickers.
- Cards carry depth: gradient surface, 1 px border, 14 px radius, soft
  shadow, cyan border glow on hover. No flat hairline-only cards.
- Hero: near full height, name as h1, positioning line, four CTAs, and the
  interactive 14-node capability map panel (`assets/js/competency-map.js`).
- Systems Stack renders as a staircase ladder with a glowing spine.
- Domain Atlas is a two-column grid of expandable cards with search, tier
  filter and cluster filter (`assets/js/domain-atlas.js`).
- Chips are roomy body-face pills, used sparingly; avoid dense mono chip walls.
- Motion: IntersectionObserver reveals, subtle hovers, all disabled under
  `prefers-reduced-motion`. Visible `:focus-visible` rings everywhere.

## Evidence tiers (site-wide honesty system)

Capability claims use five tiers, rendered with `.tier` badges and used in the
Domain Atlas (`assets/js/domain-atlas.js`), Systems Stack, Skills and project
details: Delivered (professional or project delivery evidence), Hands-on
(built, tested, configured or used directly), Working knowledge (credible
study or coursework), Adjacent (transferable exposure from nearby systems),
Target (strategic growth domain). Never promote a claim above its evidence.
Ford must only ever appear as "Ford Motor Company via Invenio contract
placement", never as direct Ford employment. No role uses "Present".

## Hard bans

- No purple, violet or indigo gradients. No gradient filled text.
- No beige/paper light theme, no visible grid-paper or spreadsheet texture.
- No Font Awesome. No emoji anywhere, including the favicon.
- No "Hi, I'm ..." hero, stock taglines, fake testimonials or placeholder logos.
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
