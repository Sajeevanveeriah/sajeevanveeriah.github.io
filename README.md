# Sajeevan Veeriah - Engineering Portfolio

A static Next.js portfolio for robotics, embedded mechatronics, industrial automation and engineering software.

- Production: https://sv.sajeevanveeriah.workers.dev/ (Cloudflare Worker `sv`: static assets plus the `/api/contact` relay)
- Mirror: https://sajeevanveeriah.github.io/ redirects every page to the same path on the Worker

## Site map

| Route | Content |
| --- | --- |
| `/` | Identity, six-layer systems visual, featured project, project band, career and learning, foundation, recent writing, contact, complete project index |
| `/work/` | All 23 projects: eight case studies and the delivery list, with category filters, search and shareable URLs |
| `/work/<slug>/` | Case studies: contribution, architecture, decisions, verification, previous and next |
| `/services/` | Voltwyn services: six service areas with proof links, the Define phase, the rate basis and an enquiry form |
| `/about/` | Full career timeline, education, community and life beyond work |
| `/notes/` | Six-month robotics roadmap with builds, resources and the DOCX download |
| `/blog/` | Journal with topic filters (`?topic=`), individual articles and an RSS feed at `/blog/feed.xml` |

The design uses one stylesheet (`src/app/globals.css`) built on Voltwyn colour tokens (Night Navy `#0F1E33`, Volt Amber `#F5B700`) for light and dark themes, self-hosted Archivo, a system monospace for sheet labels, and the existing monogram. Pages are drawn like an engineering sheet: two hairline rails frame the page, section boundaries carry registration crosses and content sits in square hairline cells. A first visit opens in the dark theme. Motion is local and decorative: a canvas LiDAR-style sweep in the hero (`ScanField`), a signal pulse through the six layers, scroll reveals and pointer spotlights (`Motion`) and circuit traces above the contact band; all of it stops under reduced motion and pauses off screen. The header toggles light and dark and opens a site search (Ctrl+K, Cmd+K or `/`) across pages, projects, services and journal posts; the footer offers Light, System and Dark. Journal articles show a reading-progress bar and a share button.

## Contact form

The form posts to `/api/contact` on the `sv` Worker (`worker/index.ts`), which validates the message, drops obvious bots (an off-screen field that only bots fill) and relays it through Resend with the visitor as Reply-To. The inbox address is never in the page or bundle. Delivery needs three Worker secrets:

```sh
npx wrangler secret put RESEND_API_KEY   # Resend key with sending access
npx wrangler secret put CONTACT_TO       # inbox that receives enquiries
npx wrangler secret put CONTACT_FROM     # e.g. "Portfolio <forms@your-verified-domain>"
```

`GET /api/contact/status` reports only whether the three values are present; post-deploy verification warns while they are missing (set `REQUIRE_CONTACT_DELIVERY=1` to make it fail instead). The relay also limits each visitor IP to three submissions a minute with a Cloudflare rate-limiting binding, and fails closed with a 503 if that binding is missing. It only accepts requests whose `Origin` is the Worker or the GitHub Pages mirror, and refuses a message sent less than three seconds after the form appeared. For local development, `wrangler dev --var CONTACT_DEV:true` also accepts `http://localhost` and `http://127.0.0.1` origins; never set `CONTACT_DEV` on the deployed Worker. There is no CAPTCHA: adding Cloudflare Turnstile needs a site key and secret created in the Cloudflare dashboard.

Until they are set the endpoint answers 503 and the form tells the visitor to try again later, keeping their message in the form. No address is ever sent to the browser.

Project cards identify the evidence stage, from simulation and prototypes to client work. The home page curates three supporting projects and links to both independent research reports. New process-simulation and service-desk entries are grounded in their public repositories; they do not imply a connected factory or a deployed business backend.

The October 2026 image refresh replaces conceptual hardware scenes with original SVG engineering diagrams. The industrial display controller graphic embeds the actual PCB CAD render. Existing analytical chart values, archive CAD and attributed research figures are preserved. SVG journal covers have matching PNG files for social previews. The logo is unchanged.

## Development and checks

Node.js 22 and npm. On Windows, put the existing Git for Windows `usr/bin` directory on the shell's PATH for the `unzip` archive check.

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

The earlier portfolio was removed from the tree on 15 October 2026 and remains available in git history.
