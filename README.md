# Sajeevan Veeriah - Engineering Portfolio

A static Next.js portfolio for robotics, embedded mechatronics, industrial automation and engineering software.

- Production: https://sv.sajeevanveeriah.workers.dev/ (Cloudflare Worker `sv`, static assets)
- Mirror: https://sajeevanveeriah.github.io/ redirects every page to the same path on the Worker

## Site map

| Route | Content |
| --- | --- |
| `/` | Identity, six-layer systems visual, featured project, project band, career and learning, foundation, recent writing, contact, complete project index |
| `/work/` | All 21 projects: case-study cards and the delivery list, with category filters, search and shareable URLs |
| `/work/<slug>/` | Case studies: contribution, architecture, decisions, verification, previous and next |
| `/about/` | Full career timeline, education, community and life beyond work |
| `/notes/` | Six-month robotics roadmap with builds, resources and the DOCX download |
| `/blog/` | Journal with topic filters (`?topic=`), individual articles and an RSS feed at `/blog/feed.xml` |

The design uses one stylesheet (`src/app/globals.css`) built on colour tokens for light and dark themes, self-hosted Archivo and the existing monogram. The header toggles light and dark; the footer offers Light, System and Dark.

## Development and checks

Node.js 22 and npm.

```sh
npm ci
npm run typecheck
npm run lint
npm run build            # static export to out/
npm run qa:export        # required files, resume bytes, RSS and every sitemap route
npx playwright install --with-deps chromium
npm run qa:browser       # every sitemap route at 7 widths in both themes, axe WCAG 2.2 AA, flows
npm run qa:lighthouse    # every sitemap route, mobile emulation
npm run cloudflare:check # Wrangler dry run
```

All route lists come from `out/sitemap.xml` through `scripts/routes.mjs`, so adding a post or case study automatically adds it to every check. To use an already-installed Chromium, set `BROWSER_EXECUTABLE_PATH`.

## Deployment

Changes reach `main` through a reviewed pull request. Merging is the release:

1. **Deploy to Cloudflare** (`.github/workflows/cloudflare.yml`) re-runs every check, deploys with Wrangler and then runs `npm run verify:live`. This confirms every route, canonical URLs, security headers, the resume PDF, the RSS feed, the 404 behaviour and that the home page carries the deployed commit SHA.
2. **Deploy GitHub Pages mirror** (`.github/workflows/deploy.yml`) builds `out-pages/`, where each HTML page redirects to the Worker with a canonical link. It then confirms that every route redirects.

The Cloudflare workflow needs the repository secrets `CLOUDFLARE_API_TOKEN` (Workers Scripts Edit, scoped to the account) and `CLOUDFLARE_ACCOUNT_ID`. It can also be run manually from **Actions > Deploy to Cloudflare**.

Local deployment: `npm run cloudflare:login`, build, then `npm run cloudflare:deploy`.

`public/_headers` sets security headers and long-lived caching for hashed build files and fonts on the Worker.

## Publishing a journal post

Add an entry to one of the post files in `src/content/` (collected in `src/content/blog.ts`). Use a unique lowercase, hyphenated slug, an ISO date (`YYYY-MM-DD`), a title, a description, an introduction, sections, sources and a `category`. The category maps to one of the four journal topics in `blog.ts`; add a mapping when you introduce a new category. The index, home preview, sitemap, RSS feed and every QA route update from the same content.

The earlier portfolio remains under `archive/20260810-legacy-portfolio/` and is not part of the build.
