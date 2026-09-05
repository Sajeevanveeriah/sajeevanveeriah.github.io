# Sajeevan Veeriah - Engineering Portfolio

A static Next.js portfolio presenting robotics, embedded mechatronics, engineering software and professional experience.

## Experience

- Home: introduction, selected projects, engineering approach, experience summary and contact.
- Work: all 19 records, category filters, search, shareable filter URLs and reset.
- Case studies: contribution, architecture, decisions, verification and scope.
- About: the complete seven-entry career timeline and education.
- Notes: the existing six-month learning roadmap and download.

The shared design uses locally hosted Archivo, a soft white canvas, charcoal text, blue accents and original-colour media. The existing monogram and download URLs are retained. Full-size image links preserve engineering detail. Light is the initial theme; System and Dark are explicit persistent choices.

## Development and verification

Node.js 22, npm, Python 3.12 for the existing resume generator.

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npx playwright install --with-deps chromium
npm run qa:browser
npm run qa:lighthouse
```

Browser QA checks seven routes at seven widths in both themes, axe accessibility, filters, search recovery, URL persistence, keyboard navigation, mobile menu, downloads/media links, legacy routes and the no-JavaScript catalogue. Lighthouse checks every active content route in mobile emulation. QA screenshots are CI artifacts, not application files.

## Deployment

The existing GitHub Pages workflow publishes the static `out/` directory after verification. No backend, tracking, database or runtime third-party requests are needed. About is excluded from the legacy redirect generator so the built page cannot be overwritten.

The earlier portfolio remains under `archive/20260810-legacy-portfolio/`. Unused previous style files are retained but are not imported by the active application.
