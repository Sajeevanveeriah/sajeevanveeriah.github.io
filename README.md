# Sajeevan Veeriah portfolio

A static-first personal engineering portfolio for:

**Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer**

The active site is a concise Next.js 15 App Router export. It contains one
primary page, three evidence-led project records, intentional light and dark
themes, a deterministic systems map, static SEO metadata, and no backend.

## Local commands

    npm ci
    npm run typecheck
    npm run lint
    npm run build
    npm run qa:browser
    npm run dev

The export is written to out/ for GitHub Pages. Browser QA serves that export
locally and requires Playwright Chromium to be installed. A managed runner can
set `PLAYWRIGHT_EXECUTABLE_PATH` to an existing Chromium-compatible binary.

## Archive

The complete pre-rebuild implementation is preserved at:

archive/20260810-legacy-portfolio/

Restore by copying the archived files back to the repository root after first
preserving any newer work.
