# AGENTS.md

Operating guide for this repository. Read this before editing. It reflects the
July 2026 "Precision Graphite" redesign (implemented from the supplied Claude
Design Rev00 source) and is binding.

This is a GitHub user Pages site served directly from the default branch root.
The stack is buildless: plain HTML, CSS and a small amount of vanilla JS. Keep
it buildless. Do not add a framework, bundler, package manager, build step or
GitHub Actions deploy. The final site must have zero runtime third party
requests, so all fonts and assets are self hosted. Never ship design-tool
runtime files (`support.js`, `x-dc` components, `.dc.html` pages, Cloudflare
email-decode scripts): translate design sources into static HTML, CSS and JS.

Write in Australian and UK spelling. Do not use em dashes or en dashes anywhere,
use commas, colons or full stops. Write date ranges as "Jan 2026 to Jun 2026".
Never use the word "Present" for a role.

## Design system: "Precision Graphite"

This is a premium dark technical portfolio, not a paper resume page. Do not
revert it to a light beige theme, paper-grid background, spreadsheet texture
or a generic AI-portfolio look.

Palette (tokens at the top of `styles.css`)

- Background `#121110` warm graphite, surfaces `#1A1713` and `#211D17`.
- Text `#F3EFE7`, muted `#ACA79D`, faint `#726D64`, hairlines
  `rgba(243,239,231,0.10)` and `rgba(243,239,231,0.22)`.
- Single accent: warm amber `#E2A24B` (`--on-accent: #241505`), used for
  kickers, tier-delivered dots, dates, active states and hovers. No purple,
  no cyan, no multi-colour gradients.

Typography (self hosted woff2 in `assets/fonts/`)

- Display: Space Grotesk, large and confident (hero name up to ~6.6rem,
  tight negative tracking, 0.96 line height).
- Body and UI: Hanken Grotesk. Mono (IBM Plex Mono) is reserved for small
  system labels, kickers, dates, tier chips and tags only; never body copy.
- `@font-face` with `font-display: swap`, preload display and body fonts.
  No Google Fonts at runtime. No Font Awesome.

Layout and components

- 1280 px wrap, tall section rhythm, numbered mono kickers, 3 px radii.
- Hairline editorial style: sections and cards are separated by 1 px lines
  (`--line`, `--line-strong`), not boxed gradient panels or glows.
- Hero: near full height, huge h1, amber positioning line, primary button
  plus arrow link, mono metadata strip, stats row and the static
  14-domain "Engineering capability index" panel.
- Experience is a card grid (1 px gaps over `--line`) in two groups, each
  card with a line-art SVG icon, mono progression line, amber dates, tier
  dots, context and story copy, a native `details` "Role detail" disclosure
  and one calm dot-separated tag strip. Never collapse it back to a plain
  timeline or resume list.
- Evidence tiers render as dots: delivered solid amber, hands-on outlined,
  working faded, adjacent dashed, target dashed amber.
- Domain Atlas and case studies are static `details` disclosures in
  `index.html`; `main.js` only adds search/filter behaviour on top. Keep
  everything readable with JavaScript disabled.
- Chips and tags are dot-separated inline text (`.dot-strip`), not pill
  walls. Avoid chip soup.
- Motion: hero fadeUp and the marquee only, both disabled under
  `prefers-reduced-motion`. Visible `:focus-visible` rings everywhere.

## Evidence tiers (site-wide honesty system)

Capability claims use five tiers, rendered with tier dots and used in the
Domain Atlas, Systems Stack, Skills, case studies and experience cards:
Delivered (professional or project delivery evidence), Hands-on (built,
tested, configured or used directly), Working knowledge (credible study or
coursework), Adjacent (transferable exposure from nearby systems), Target
(strategic growth domain). Never promote a claim above its evidence.
Ford must only ever appear as "Ford Motor Company via Invenio contract
placement", never as direct Ford employment. No role uses "Present".

## Hard bans

- No purple, violet, indigo or cyan accents. No gradient filled text.
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
