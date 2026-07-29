# AGENTS.md

Operating guide for this repository. Read this before editing. It reflects the
July 2026 light-first editorial redesign and is binding.

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

## Design system: editorial, light first

Use a calm, light-first engineering editorial system. The default canvas is near
`#F7F7F8`, surfaces are white, primary text is near `#161617`, secondary text
is near `#68686D` and the only interactive accent is deep engineering blue near
`#1D5FBF`. Author selected robotics and technical story stages in graphite with
off-white text. There is no global theme control.

Keep navigation minimal, headings large but controlled, copy concise and stages
spacious. Do not add grids, grain, terminal chrome, telemetry labels, gold or
category colour coding, glass effects, gradients, glow, stock illustrations or
dashboard decoration. Motion is limited to short reveal and interaction feedback,
with complete reduced-motion and no-JavaScript fallbacks.

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
filters and restrained reveal motion are progressive enhancement only.

Keep the preserve list intact: `robots.txt`, `sitemap.xml`, `BingSiteAuth.xml`,
`googlebcce96f6b520ab1f.html`, the resume PDF, project images and fonts.
