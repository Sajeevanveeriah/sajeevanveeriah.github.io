# Sajeevan Veeriah Portfolio

A light-first editorial engineering portfolio for Sajeevan Veeriah, built with Next.js 15, React 19 and TypeScript and exported as static files for GitHub Pages.

## Experience and design

The homepage positions Saj as a Mechatronics, Robotics and AI/ML Engineer who owns systems across mechanics, electronics, sensing, embedded software, autonomy, controls, data and validation. A near-white canvas, white surfaces, deep engineering blue actions and deliberately authored graphite project stages create a calm product narrative. The hero cycles through real project evidence, pauses when it leaves the viewport and exposes direct project controls. There is no theme selector, control-room chrome, telemetry, technical grid or ambient animation.

## Architecture

Routes are implemented with the App Router under `src/app/`:

- `/`, `/work/`, `/skills/`, `/atlas/`, `/employers/`, `/ecosystem/`, `/about/` and `/contact/`
- `/work/[slug]/`, `/atlas/[domain]/`, `/employers/[slug]/`, `/ecosystem/[pillar]/` and `/about/[role]/`, all generated statically
- `robots.ts`, `sitemap.ts` and `not-found.tsx`

Verified, typed copy lives in `src/content/`. The resume at `public/assets/Resume_Sajeevan_Veeriah.pdf` is the factual source of truth. The static export constraints in `next.config.ts` must remain intact.

### Two content layers, kept apart on purpose

The site carries two kinds of statement, and they must never blur together.

**Evidence about Saj** lives in `skills.ts`, `atlas.ts`, `employers.ts`, `experience.ts` and `projects.ts`. Every claim carries one of the five evidence tiers in `tiers.ts`, and Saj assigns every one of them. Nothing infers a tier from a domain, a vendor, a job title or a similar technology.

**Reference about the field** lives in `src/content/ecosystem/`. It is a broad engineering sweep across eight pillars and 31 domains: hardware families and their models, software, protocols, standards, algorithms and methods. Inclusion there is a fact about the field, never a claim about Saj.

The separation is enforced by the type system and by `scripts/check-ecosystem.mjs` rather than by convention:

- `coverageKind: 'ecosystem-reference'` is neutral. It carries no evidence tier, and the validator fails the build if its copy reads as a personal claim ("I use", "my expertise", "proficient").
- `coverageKind: 'profile'` is the only shape that may carry a tier, and it additionally requires publishable evidence references and a scope note. There are currently zero of them: the catalogue was authored as a field sweep, and it does not feed Person JSON-LD, resume claims or any skill total.
- A `current`, `maintained` or `preview` status needs an official source and a review date. Where status could not be confirmed the record says `unknown` and the copy stays neutral. Undated words like "latest" fail validation.
- `scope.ts` is the completeness contract: every supplied term is recorded in its original spelling and resolved to a canonical entity, alias, model, former name, lifecycle note or correction. Coverage is therefore derived, not asserted.

Run `npm run ecosystem` to validate it. That script first runs the validator against deliberately defective in-memory fixtures and confirms each one is caught, then validates the real catalogue and prints coverage. It is wired into `npm run build`, so the export cannot succeed on a broken catalogue.

## Image art direction

Every project image record can specify `displayMode`, `aspectRatio`, `objectPosition`, `background`, `sizes` and an optional `mobileSrc`. `ProjectImage` applies that metadata centrally with explicit intrinsic dimensions and local AVIF and WebP sources. Use `contain` for diagrams, UI and screenshots where every edge matters. Use `cover` only for photographs with a verified safe focal point. The wide Engineering Mastery Lab image retains its native 1435:660 stage.

## Content updates

1. Update typed records in `src/content/`, preserving evidence tiers and verified scope.
2. Add local source media and AVIF and WebP derivatives under `public/assets/image/`.
3. Record presentation metadata in the project image record.
4. Ensure each dynamic record is published by its existing `generateStaticParams` path.
5. Run the complete validation checklist before commit.

Ford must only appear as "Ford Motor Company via Invenio contract placement". JAG Process Solutions is Jan 2026 to Jun 2026. Do not add locations, telephone numbers, availability, work rights or claims not supported by the resume.

## Local development and validation

```sh
npm run typecheck
npm run lint
npm run contrast
npm run ecosystem
npm run build
node scripts/check-budget.mjs
node scripts/verify-motion.mjs
node scripts/audit.mjs
npx serve out
```

The browser-driven scripts (`audit`, `verify-motion`, `lighthouse`) need a Chromium. They honour `BROWSER_EXECUTABLE_PATH`, which is how to point them at a preinstalled browser when the bundled Playwright download is unavailable:

```sh
BROWSER_EXECUTABLE_PATH=/path/to/chromium node scripts/audit.mjs
```

`audit.mjs` gates on accessibility violations and horizontal overflow. It also measures and prints page height, but does not fail on it: the work records are deliberately long numbered narratives, and the old fixed viewport-height ceiling was failing half the site while telling nobody anything. Stranding a reader in empty scroll is prevented structurally instead, because no component here is a sticky scroll trap.

Inspect all routes at 320, 375, 768, 1024, 1440 and 1920 px. Verify keyboard focus, reduced motion, JavaScript-disabled content, internal links, image bounds, console and network output, structured data, ASCII punctuation and privacy restrictions. The export must contain `index.html`, `404.html`, `.nojekyll`, verification files, `robots.txt`, `sitemap.xml` and assets.

## SEO maintenance after publication

- Confirm Google Search Console and Bing ownership without changing site privacy.
- Submit `https://sajeevanveeriah.github.io/sitemap.xml`.
- Inspect the home, Work, Atlas and priority project URLs.
- Run Rich Results Test and PageSpeed Insights on the home page and a project page.
- Review qualified queries, impressions, clicks and average position after 28 and 90 days.
- Keep route titles, descriptions, canonicals and JSON-LD unique, accurate and aligned with visible content.

These are post-publication checks. They are not automated submissions and make no ranking promise.

## Rollback

Do not edit generated `out/` files. Revert a committed redesign with `git revert <commit-sha>`, which preserves later unrelated history. For an uncommitted local patch, restore only the listed redesign files from the starting commit with `git restore --source <starting-sha> -- <paths>` after first preserving any concurrent changes.
