# Sajeevan Veeriah - Engineering Portfolio

A static Next.js portfolio for robotics, embedded mechatronics, industrial automation and engineering software.

- Production: https://sv.sajeevanveeriah.workers.dev/ (Cloudflare Worker `sv`: static assets plus the `/api/contact` relay)
- Mirror: https://sajeevanveeriah.github.io/ redirects every page to the same path on the Worker

## Site map

| Route | Content |
| --- | --- |
| `/` | Identity and the sense, think and act loop figure, three featured projects, a four-project band, research, career and learning, the six-layer stack, foundation, recent writing, contact, complete project index |
| `/work/` | All 26 projects: eleven case studies and the delivery list, each with a figure or screenshot, with category filters, search and shareable URLs |
| `/work/<slug>/` | Case studies: contribution, architecture, decisions, verification, previous and next |
| `/services/` | Voltwyn services: six service areas with proof links, the Define phase, the rate basis and an enquiry form |
| `/about/` | Full career timeline, education, community and life beyond work |
| `/notes/` | Six-month robotics roadmap with builds, resources and the DOCX download |
| `/blog/` | Journal with topic filters (`?topic=`), individual articles and an RSS feed at `/blog/feed.xml` |

The design uses a shared stylesheet (`src/app/globals.css`, with `robotics.css` for the home page and `figures.css` for diagrams) built on Voltwyn colour tokens (Night Navy `#0F1E33`, Volt Amber `#F5B700`, Cloud `#F4F6F9`) for light and dark themes, self-hosted Archivo and the existing monogram. The 14 November 2026 redesign is light-first and quiet: a white canvas, navy ink, amber as a sparing highlight under navy text, and content in soft rounded cards separated by space. A first visit opens in the light theme. Motion is local and decorative: the signal travelling the hero loop, scroll reveals (`Motion`) and a small lift on cards under the pointer; all of it stops under reduced motion. The header toggles light and dark and opens a site search (Ctrl+K, Cmd+K or `/`) across pages, projects, services and journal posts; the footer offers Light, System and Dark. Journal articles show a reading-progress bar and a share button.

## Contact form

The form posts to `/api/contact` on the `sv` Worker (`worker/index.ts`), which validates the message, drops obvious bots (an off-screen field that only bots fill) and relays it through Resend with the visitor as Reply-To. The inbox address is never in the page or bundle. Delivery needs three Worker secrets:

```sh
npx wrangler secret put RESEND_API_KEY   # Resend key with sending access
npx wrangler secret put CONTACT_TO       # inbox that receives enquiries
npx wrangler secret put CONTACT_FROM     # e.g. "Portfolio <forms@your-verified-domain>"
```

`GET /api/contact/status` reports only whether the three values are present; post-deploy verification warns while they are missing (set `REQUIRE_CONTACT_DELIVERY=1` to make it fail instead). The relay also limits each visitor IP to three submissions a minute with a Cloudflare rate-limiting binding, and fails closed with a 503 if that binding is missing. It only accepts requests whose `Origin` is the Worker or the GitHub Pages mirror, and refuses a message sent less than three seconds after the form appeared. For local development, `wrangler dev --var CONTACT_DEV:true` also accepts `http://localhost` and `http://127.0.0.1` origins; never set `CONTACT_DEV` on the deployed Worker. There is no CAPTCHA: adding Cloudflare Turnstile needs a site key and secret created in the Cloudflare dashboard.

Until they are set the endpoint answers 503 and the form tells the visitor to try again later, keeping their message in the form. No address is ever sent to the browser.

Project cards identify the evidence stage, from simulation and prototypes to client work. The home page curates four supporting projects and links to both independent research reports. New process-simulation and service-desk entries are grounded in their public repositories; they do not imply a connected factory or a deployed business backend.

The November 2026 redesign gives every piece of work a figure. Figures are inline SVG diagrams built from a small kit (`src/components/figures/kit.tsx`): a grid of labelled boxes and arrows that takes the page typeface and both colour themes. Each figure is a short specification in `src/components/figures/specs.tsx`, keyed by case-study slug, project-index title or post slug, and its labels and numbers restate the record it sits beside. The kit fails the build if a label does not fit its box, so text is never cut. The hero is a closed sense, think and act loop; the career section draws roles to scale from their dates; the six layers are an exploded stack. Screenshots and CAD renders that show real work stay as images. Styles for figures are in `src/app/figures.css`.

The October 2026 image refresh replaced conceptual hardware scenes with original SVG engineering diagrams. The industrial display controller graphic embeds the actual PCB CAD render. Existing analytical chart values, archive CAD and attributed research figures are preserved. SVG journal covers have matching PNG files for social previews. The logo is unchanged.

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

## Project handoff

Read the [project handoff](HANDOFF.md) for current work, checks and the next step.
