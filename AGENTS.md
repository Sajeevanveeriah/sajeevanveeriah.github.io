# AGENTS.md

Operating guide for this repository. Read this before editing. It reflects the
July 2026 adaptive two-theme redesign and is binding.

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

## Design system: adaptive two-theme

The site ships two designed themes driven by CSS custom-property tokens at the
top of `styles.css`. Component rules are written once against the tokens; only
the token blocks differ per theme. Do not fork component rules per theme.

Dark, "Precision Graphite" (the base `:root` block)

- Background `#121110` warm graphite, surfaces `#1A1713` and `#211D17`.
- Text `#F3EFE7`, muted `#ACA79D`, faint `#8A847A`, hairlines
  `rgba(243,239,231,0.10)` and `rgba(243,239,231,0.24)`.
- Single accent: warm amber `#E2A24B`, used for kickers, tier-delivered dots,
  dates, active states and hovers.

Light, "Precision Porcelain" (media-query and `[data-theme="light"]` blocks)

- Background `#F4F2ED` cool porcelain, surfaces `#FFFFFF` and `#FAF8F3`.
- Text `#211D18` near black, muted `#5C564C`, faint `#6F695E`.
- Accent: burnt ochre `#B26A0B` for graphics, `#8A5106` for accent text
  (`--accent-ink`), verified for contrast on porcelain.
- Controlled shadows (`--card-shadow`) only where depth aids comprehension.

Both themes share the same typography, grid, spacing and evidence system.
No purple, violet, indigo or cyan. No gradient text, glassmorphism, glowing
cards, paper or grid textures, emoji, skill bars or fabricated charts.

## Theme behaviour (Auto, Light, Dark)

- Default is Auto: the page follows `prefers-color-scheme` with no attribute
  on `<html>` and nothing in storage.
- The header theme control (three radio buttons: Auto, Light, Dark) sets a
  manual override as `data-theme="light|dark"` on `<html>` and persists only
  a manual override in `localStorage` under the key `theme`. Choosing Auto
  removes both.
- An inline script in `<head>` applies any stored override before the
  stylesheet paints (no wrong-theme flash) and adds the `js` class that
  reveals the control. Without JavaScript the control stays hidden and the
  site behaves as Auto.
- `<meta name="color-scheme" content="light dark">` plus two
  `<meta name="theme-color">` tags (one per scheme) are kept in sync by
  `main.js`. `color-scheme` on `:root` makes form controls and scrollbars
  match the active theme.
- Colour transitions are enabled only after first paint via the
  `theme-anim` class.

Typography (self hosted woff2 in `assets/fonts/`)

- Display: Space Grotesk, large and confident (hero name up to ~6.4rem,
  tight negative tracking, 0.96 line height).
- Body and UI: Hanken Grotesk. Mono (IBM Plex Mono) is reserved for small
  system labels, kickers, dates, tier chips and tags only; never body copy.
- `@font-face` with `font-display: swap`, preload display and body fonts.
  No Google Fonts at runtime. No Font Awesome.

Layout and components

- 1280 px wrap, tall section rhythm, numbered mono kickers, 3 px radii.
- Hairline editorial style: sections and cards are separated by 1 px lines
  (`--line`, `--line-strong`), not boxed gradient panels or glows.
- Hero: huge h1, amber positioning line, primary button, resume link,
  verified portfolio stats and the Engineering System Map panel.
- The Engineering System Map (`.system-map`) is the visual signature: seven
  keyboard-focusable layers from Physical system to Validation and delivery,
  each an anchor that pre-filters the Capability Explorer. Its list is real
  text, so it stays readable without JavaScript and on small screens it is
  simply a vertical flow.
- Section order: Work (`#work`), Capability Explorer (`#capability`),
  Experience (`#experience`), Toolchain (`#toolchain`), Education
  (`#education`), Beyond Engineering (`#beyond`), Resume (`#resume`).
- Case studies and capability entries are static `details` disclosures in
  `index.html`; `main.js` only adds search and filter behaviour on top. Keep
  everything readable with JavaScript disabled.
- Chips and tags are dot-separated inline text (`.dot-strip`), not pill
  walls. Tool groups use `.tool-anchors` for a small set of anchor platforms
  plus one supporting dot-strip. Avoid chip soup.
- Evidence tiers render as dots: delivered solid amber, hands-on outlined,
  working faded, adjacent dashed, target dashed amber.
- Motion: one coordinated hero entrance, subtle card and map responses and
  filter transitions only, all disabled under `prefers-reduced-motion`.
  No marquees or continuous animation. Visible `:focus-visible` rings
  everywhere; sticky-header offset via `scroll-margin-top`.

## Privacy rules (binding)

The website must not contain, in HTML, CSS, JS, metadata, structured data or
rendered text:

- Email addresses, `mailto:` links, telephone numbers.
- Personal location of any kind: city, suburb, state or country used as a
  personal or role location, `geo.region`, `geo.placename`, JSON-LD
  `address`, employer or education location labels.
- Visa or work-rights status, availability statements.
- LinkedIn or other personal-profile links, contact sections, contact forms,
  "get in touch" calls to action, contact navigation or footer columns.

The downloadable resume (`assets/Resume_Sajeevan_Veeriah.pdf`) is the only
personal-contact pathway and may contain its own contact details. Never edit
or redact the PDF. Legal company names that contain a geographic word (for
example "Thornton Engineering Australia Pty Ltd", "Engineers Australia") are
allowed. After content edits, run the privacy grep in README.md and review
every hit manually.

## Evidence tiers (site-wide honesty system)

Capability claims use five tiers, rendered with tier dots and used in the
Capability Explorer, case studies, toolchain and experience cards:
Delivered (professional or project delivery evidence), Hands-on (built,
tested, configured or used directly), Working knowledge (credible study or
coursework), Adjacent (transferable exposure from nearby systems), Target
(strategic growth domain). Never promote a claim above its evidence.
Ford must only ever appear as "Ford Motor Company via Invenio contract
placement", never as direct Ford employment. No role uses "Present".
Never imply a personal concept was a production deployment.

## Hard bans

- No contact data, location data, visa or availability text (see Privacy).
- No purple, violet, indigo or cyan accents. No gradient filled text.
- No Font Awesome. No emoji anywhere, including the favicon.
- No "Hi, I'm ..." hero, stock taglines, fake testimonials or placeholder logos.
- No skill percentage bars, proficiency gauges or decorative charts with
  fabricated values.
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
- Project images in `assets/image/` and fonts in `assets/fonts/`
- Keep the JSON-LD `Person` schema minimal: name, alternateName, url,
  jobTitle "Mechatronics, Robotics, Automation and AI/ML Engineer",
  description, `alumniOf` (Deakin, Cardiff Metropolitan), `memberOf`
  (Engineers Australia) and verified `knowsAbout` entries only. Never add
  email, telephone, address, geo metadata or personal-profile `sameAs`
  links. Do not claim current employment via `worksFor`.

## How to add content

- A capability: copy a `details.cap-entry` block in `#capability`, set
  `data-cluster`, `data-tier` and `data-context` to match the filter
  controls, give it a stable `id` (`cap-...`) and fill in Subdomains, Tools
  and software, Project proof, Experience proof, Transferable logic and
  Growth targets at the honest tier.
- A project: add an `article.project-card` with `data-project` and
  `data-domains` (space separated filter keys), an image in `assets/image/`
  with explicit `width`/`height`, and a matching `details.case-study` with
  the Problem, Context, System architecture, Engineering decisions, Tools,
  Validation method, Output, Evidence level and What it demonstrates fields.
  Update the hero case-study count if it changes.
- A role: copy an `article.role-card` in `#experience`. Role, company, dates
  and tier first, then context, capability domains, representative tools and
  the `details.role-detail` disclosure. No locations.

## Validation before committing

1. `node --check main.js`
2. Serve locally (`python3 -m http.server 8000`), open with the console
   open: zero errors, zero external requests in the Network tab.
3. Check both themes (Auto, Light, Dark), desktop and a 390 px viewport:
   no horizontal scroll, nav opens and closes, theme persists on reload,
   Auto follows the OS.
4. Click every nav anchor and project card; confirm the resume opens and
   downloads.
5. Validate the JSON-LD block parses.
6. `grep -nP "\x{2013}|\x{2014}" index.html README.md AGENTS.md styles.css main.js`
   must return nothing (no en/em dashes).
7. Run the privacy grep from README.md and review every hit.
8. Confirm no claim was promoted above its evidence tier and Ford is still
   "via Invenio contract placement".
