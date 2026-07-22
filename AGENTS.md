# AGENTS.md

Operating guide for this repository. Read this before editing. It reflects the
July 2026 "Midnight Command" redesign and is binding.

This is a GitHub user Pages site served directly from the default branch root.
The stack is buildless: plain HTML, CSS and a small amount of vanilla JS. Keep
it buildless. Do not add a framework, bundler, package manager, build step or
GitHub Actions deploy. The site must make zero runtime third-party requests:
all fonts and assets are self-hosted.

Write in Australian and UK spelling. Do not use em dashes or en dashes anywhere,
use commas, colons or full stops. Write date ranges as "Jan 2026 to Jun 2026".
Never use the word "Present" for a role.

## Design system: Command, dual theme (do not revert)

One premium identity rendered in two committed themes that share a single
token contract at the top of `styles.css`: Midnight Command (dark) and
Daylight Command (light). The active theme follows the operating system by
default via `prefers-color-scheme`, and the header control lets a visitor
force System, Light or Dark, stored in `localStorage` under `theme` and
applied before first paint by the inline script in the head. Keep this
system based default and keep both themes in lock step; the two light
token blocks in `styles.css` (the `:root[data-theme="light"]` block and
the `prefers-color-scheme: light` block) must stay byte for byte identical.

- Colour is driven entirely by custom properties. Fill accents (`--gold`,
  `--steel`: buttons, dots, borders) are shared; text accents
  (`--gold-text`, `--steel-text`: mono kickers, dates, in-copy links) are
  darkened in the light theme so they hold WCAG AA on a pale background. Do
  not hard-code colours in component rules; add a token and set it in every
  theme block.
- Midnight Command: background `#0B0D12`; surfaces `#10131A` and `#151923`;
  text `#ECE9E1` ivory, muted `#A6AAB3`, faint `#83878F`.
- Daylight Command: background `#F3F1EB` warm gallery paper (not a beige
  worksheet); surfaces `#FBFAF6` and `#FFFFFF`; text `#1A1C22`, muted
  `#4C515A`, faint `#767B84`; `--gold-text` deepens to `#7A5C1F` and
  `--steel-text` to `#33628F`.
- Primary accent: champagne gold (kickers, CTAs, delivered dots, dates,
  active states). Secondary accent: steel blue (category labels, hands-on
  dots, in-copy links). Keep both restrained.
- Numbered mono section kickers, hairline panels, 4 to 6 px radii, the faint
  hero grid, the closed-loop signal panel and the ten-layer Systems Stack are
  the visual signature. Keep them.

Motion is expressive but disciplined and always motion safe. The signature
motion pieces are the hero particle field (a capped, pointer-reactive
constellation that pauses off screen and when the tab is hidden, fine
pointer only, sharing its canvas with travelling signal packets on the
links and a pointer-reactive two segment robot arm solved with inverse
kinematics that reaches toward the cursor, hands a packet off on each
reach and eases to a ready pose when idle, with a fainter companion arm
beside it so the pair reads as a robotic cell), native scroll-driven
media parallax with a JS fallback, magnetic
hero buttons, blur and scale scroll reveals, and count-up stats.
Everything must be gated behind `prefers-reduced-motion: no-preference`,
stay off the main thread where possible, and degrade to a complete static
page. Do not add continuous, unpaused, always-on animation, autoplaying
video or marquees.

Hard bans: orange as the dominant accent, beige or worksheet backgrounds,
purple, violet or indigo, gradient-filled text, glassmorphism, glowing cards,
emoji, Font Awesome, skill percentage bars, fabricated charts, fake logos,
fake screenshots, chip walls ("chip soup"), "Hi, I'm ..." heroes and stock
taglines.

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

- Section order: Hero, Work (`#work`), Engineering Atlas (`#atlas`), Systems
  Stack (`#stack`), Skill Library (`#skills`), Experience (`#experience`),
  Education (`#education`), Beyond (`#beyond`), Contact (`#contact`).
- Case studies, Atlas entries and role details are static `details`
  disclosures in `index.html`; `main.js` adds search, filters, counts, the
  colour-theme controller, count-up stats, click-to-copy email, the
  back-to-top control, the hero particle field, magnetic buttons and the
  motion-safe reveal on top. Every one of these is progressive enhancement:
  the site must stay complete and readable with JavaScript disabled and
  under `prefers-reduced-motion`, and no-JS visitors still get the system
  colour scheme through the `prefers-color-scheme` blocks in the CSS.
- Keep the preserve list intact: `robots.txt`, `sitemap.xml` (canonical
  `https://sajeevanveeriah.github.io/`), `BingSiteAuth.xml`,
  `googlebcce96f6b520ab1f.html`, the resume PDF, project images and fonts.
- Content update recipes, the validation checklist and the rollback path are
  in README.md; run the checklist before every commit.
