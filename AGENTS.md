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

## Design system: Midnight Command (do not revert)

One committed premium dark identity driven by the tokens at the top of
`styles.css`. There is no light theme and no theme switcher; do not add one.

- Background `#0B0D12` midnight carbon; surfaces `#10131A` and `#151923`.
- Text `#ECE9E1` ivory, muted `#A6AAB3`, faint `#83878F`; hairlines
  `rgba(236,233,225,0.08)` and `0.22`.
- Primary accent: champagne gold `#D0B274` (kickers, CTAs, delivered dots,
  dates, active states). Secondary accent: steel blue `#8FB0CE` (category
  labels, hands-on dots, in-copy links). Keep both restrained.
- Numbered mono section kickers, hairline panels, 4 to 6 px radii, the faint
  hero grid, the closed-loop signal panel and the ten-layer Systems Stack are
  the visual signature. Keep them.

Hard bans: orange as the dominant accent, beige or worksheet backgrounds,
purple, violet or indigo, gradient-filled text, glassmorphism, glowing cards,
emoji, Font Awesome, skill percentage bars, fabricated charts, fake logos,
fake screenshots, marquees or continuous animation, chip walls ("chip soup"),
"Hi, I'm ..." heroes and stock taglines.

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
  disclosures in `index.html`; `main.js` only adds search, filters, counts
  and the motion-safe reveal on top. Everything must stay readable with
  JavaScript disabled and under `prefers-reduced-motion`.
- Keep the preserve list intact: `robots.txt`, `sitemap.xml` (canonical
  `https://sajeevanveeriah.github.io/`), `BingSiteAuth.xml`,
  `googlebcce96f6b520ab1f.html`, the resume PDF, project images and fonts.
- Content update recipes, the validation checklist and the rollback path are
  in README.md; run the checklist before every commit.
