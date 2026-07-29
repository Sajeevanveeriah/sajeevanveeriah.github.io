# Sajeevan Veeriah Portfolio

A light-first editorial engineering portfolio for Sajeevan Veeriah, built with Next.js 15, React 19 and TypeScript and exported as static files for GitHub Pages.

## Experience and design

The homepage positions Saj as a Mechatronics, Robotics and AI/ML Engineer who owns systems across mechanics, electronics, sensing, embedded software, autonomy, controls, data and validation. A near-white canvas, white surfaces, deep engineering blue actions and deliberately authored graphite project stages create a calm product narrative. The hero cycles through real project evidence, pauses when it leaves the viewport and exposes direct project controls. There is no theme selector, control-room chrome, telemetry, technical grid or ambient animation.

## Architecture

Routes are implemented with the App Router under `src/app/`:

- `/`, `/work/`, `/skills/`, `/atlas/`, `/about/` and `/contact/`
- `/work/[slug]/`, `/atlas/[domain]/` and `/about/[role]/`, all generated statically
- `robots.ts`, `sitemap.ts` and `not-found.tsx`

Verified, typed copy lives in `src/content/`. The resume at `public/assets/Resume_Sajeevan_Veeriah.pdf` is the factual source of truth. The static export constraints in `next.config.ts` must remain intact.

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
npm run build
npx serve out
```

Inspect all routes at 390 x 844, 768 x 1024, 1440 x 900 and 1920 x 1080. Verify keyboard focus, reduced motion, JavaScript-disabled content, internal links, image bounds, console and network output, structured data, ASCII punctuation and privacy restrictions. The export must contain `index.html`, `404.html`, `.nojekyll`, verification files, `robots.txt`, `sitemap.xml` and assets.

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
