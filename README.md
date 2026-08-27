# Sajeevan Veeriah - Living Systems Atlas

A static, evidence-led engineering portfolio for Sajeevan Veeriah, a robotics,
mechatronics and automation engineer in Geelong, Australia.

The site combines:

- a 19-domain personal Engineering Atlas with explicit evidence levels;
- three detailed engineering records and 16 further project records;
- seven career chapters across manufacturing, IoT, automotive and automation;
- qualifications, community involvement, languages and interests;
- light and dark themes, responsive motion and reduced-motion support;
- a direct PayPal.me support link, with no payment data handled by the site.

The implementation is a Next.js 15 App Router static export. It has no backend,
analytics, trackers or runtime dependency on a paid service.

## Local commands

    npm ci
    npm run typecheck
    npm run lint
    npm run build
    npm run qa:browser
    npm run qa:lighthouse
    npm run dev

The export is written to `out/`. Browser QA serves that export locally and
requires Playwright Chromium. A managed runner can set
`PLAYWRIGHT_EXECUTABLE_PATH` to an existing Chromium-compatible binary.

## Free hosting

The same static `out/` directory is compatible with both GitHub Pages and
Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `out`
- Cloudflare configuration: `wrangler.toml`

## Archive

The pre-rebuild implementation remains under
`archive/20260810-legacy-portfolio/` for reference. It is not part of the active
website routes or navigation.
