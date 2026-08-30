# Sajeevan Veeriah - Engineering Portfolio

A concise, evidence-led portfolio for Sajeevan Veeriah:

`Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer`

The recruiter-first path is deliberately short:

1. Exact identity and engineering proposition.
2. Immediate proof from three flagship records.
3. Optional role lenses for robotics, automation and engineering software.
4. A six-layer complete-systems method.
5. Three evidence-bounded case studies.
6. Selected professional practice, working style and contact.

The three public engineering records cover ROS 2 autonomous navigation, an
ESP32 movement-assessment prototype, and a client-commissioned pricing and
inventory-control application. Each record separates contribution,
verification, current readiness and evidence boundaries.

The visual system uses oversized editorial typography, a restrained
near-monochrome palette, one clay accent, hard-edged evidence panels and
alternating light and dark bands. It retains the site's engineering-field
motif, light/dark theme control, responsive reflow and reduced-motion support.

The implementation is a Next.js 15 App Router static export for GitHub Pages.
It has no backend, analytics, trackers or runtime third-party requests.

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

## Production hosting

The same static `out/` directory is compatible with GitHub Pages and
Cloudflare Workers Static Assets.

- Build command: `npm run build`
- Output directory: `out`
- Cloudflare Worker configuration: `wrangler.jsonc`
- Cloudflare deployment: `wrangler deploy --config wrangler.jsonc`

## Archive

The pre-rebuild implementation remains under
`archive/20260810-legacy-portfolio/` for reference. It is not part of the
active website routes or navigation.
