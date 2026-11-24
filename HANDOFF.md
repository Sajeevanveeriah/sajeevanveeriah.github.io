# sajeevanveeriah.github.io handoff

Maintain the engineering portfolio, journal and contact relay.

## Work at 24 November 2026 - Next.js security update

- Raised `next` and `eslint-config-next` from 15.5.28 to 15.5.29 (`package.json`, `package-lock.json`) to clear the GitHub security alert for next 15.0.0 to 15.5.28. This replaces Dependabot pull request 155.
- Follow-up the same day: `npm audit fix` raised the `@typescript-eslint` packages from 8.65.0 to 8.74.0 and their minimatch from 10.2.5 to 11.0.9 (`package-lock.json` only), clearing GHSA-g3hv-75wg-m249. `npm audit` reports 0.
- At Saj's request the Portfolio quality workflow was renamed from `.github/workflows/quality.yml` to `.github/workflows/portfolio-quality.yml` so that GitHub registers it as a new, active workflow. The old entry had been manually disabled in the Actions settings since 29 October 2026, so it did not run on pull requests; its run history stays under the old, disabled entry.

## Work at 20 November 2026 - Hardware-grade robotics redesign and media pipeline

- Redesigned the portfolio around interactive engineering subsystems while preserving verified project records, monogram/brand assets, Night Navy (`#0F1E33`), deep dark canvas (`#091320`), Volt Amber (`#F5B700`) and both Light/Dark themes (defaulting initial visits to `system` in `src/app/layout.tsx` and `src/components/Theme.tsx`, synced between the header toggle and footer selector).
- Added interactive components:
  - `src/components/EngineeringLab.tsx`: 60 FPS hero lab with 3 switchable modes (`ROS 2 SLAM` 36-ray LiDAR + EKF covariance + Nav2 waypoints; `3-DOF Arm` planar IK + joint angle arcs + reach envelope; `PID Scope` live `Kp`/`Ki`/`Kd` sliders calculating overshoot %, 2% settling time ms, steady-state error % and damping regime) plus the hero launch reel.
  - `src/components/SystemsBus.tsx`: animated 6-layer systems architecture bus (`01 Physical System` through `06 Verification`) linking interfaces, toolchains, proof metrics and matching projects.
  - `src/components/ProjectShowcaseGrid.tsx` and `src/components/ProjectDossierDrawer.tsx`: filterable grid covering all 26 verified projects (11 case studies + 15 index records) with slide-over dossier drawers (`Escape`, backdrop click and focus return).
  - `src/components/QueueSimulator.tsx`: interactive Little's Law M/M/1 queue model (50% to 95% utilisation checkpoints `1.0 min`, `4.0 min`, `19.0 min`) on `/` and journal articles (`/blog/automation-queues-and-flow-time/`, `/blog/`).
  - `src/components/InteractiveRoadmap.tsx`: clickable 6-month robotics roadmap on `/` and `/notes/`.
- Built the 16:9 image and silent looping video pipeline:
  - Added `src/content/media.ts`, `src/components/PictureMedia.tsx` and `src/components/LoopingVideo.tsx` (`IntersectionObserver` off-screen pause, `prefers-reduced-motion: reduce` static poster fallback, `preload="none"`, HTTP 206 range support via `worker/index.ts`).
  - Generated and optimised 21 x `1280x720` stems (`public/assets/media/20261120-Voltwyn-*-Rev00.{avif,webp,jpg}`) and 5 silent `< 1.5 MB` H.264/VP9 loops (`public/assets/video/20261120-Voltwyn-*-Loop-Rev00.{mp4,webm}`).
- Updated QA (`scripts/qa-browser.mjs`, `scripts/verify-export.mjs`, `scripts/lighthouse.mjs`) to verify all media assets, interactive widgets, default `system` theme, Light/Dark toggles, range requests and mobile Lighthouse thresholds.

## Work at 19 November 2026 - project instructions

Claude Code loads the project instructions through the `@AGENTS.md` import in CLAUDE.md. A fresh session identified a project-specific rule from AGENTS.md with tools disabled. Maintain shared project instructions in AGENTS.md.

## Work at 17 November 2026: Farm Frites title and description

- Farm Frites Australia role retitled Industrial IT/OT/IIoT & Systems Engineer at Saj's request; description rewritten to lead with industrial IT, OT and IIoT systems (MES, MES-ERP, SCADA, PLC interfaces, historians, OT networks, cyber security, backup and DR, commissioning). Headline identity unchanged.
- Changed: src/content/site.ts, src/app/page.tsx, scripts/build-portfolio-resume.py, public/assets/Resume_Sajeevan_Veeriah.pdf (two pages, validated), AGENTS.md.
- Checks: tsc, eslint, next build, verify-export (47 routes, 59 files), qa-browser (658 checks passed).
- OneDrive: 20261117-Personal-Sajeevan-Veeriah-Resume-Rev03 (DOCX, PDF) and 20261117-Personal-Sajeevan-Veeriah-LinkedIn-SEEK-Facebook-Rev06 (DOCX, PDF) in 01-Resume-Main/01-Documents.
- Open: LinkedIn, SEEK and Facebook live edits need Saj signed in on his PC; paste-ready copy is in the Rev06 document.

## Work at 14 November 2026: whole-site redesign

Branch `saj/great-wozniak-h3k6ed`: a new look across every page, chosen by Saj as "whole site, new look, you decide". Light-first and quiet: white canvas, navy ink, amber as a sparing highlight, soft rounded cards in place of the hairline grid, no drafting rails, registration crosses or monospace labels. `src/app/globals.css` and `src/app/robotics.css` were rewritten and `src/app/figures.css` adjusted; the page structure, routes, content, contact relay and resume are unchanged. A first visit now opens in the light theme (`Theme.tsx`, the inline script in `layout.tsx`, and the matching browser QA assertion). The home headline reads Robotics. Mechatronics. Controls., and the third selected project is the Dooen Plant Process Model. `TraceBackdrop` and the pointer spotlight were removed. Checks run and results are recorded in the pull request.

## Work at 14 November 2026: positioning

Branch `saj/great-wozniak-h3k6ed`: positioning now leads with robotics, mechatronics, controls and automation. `src/content/site.ts` (profile line, Farm Frites role description and tags, review date), the Person schema topics in `src/app/layout.tsx`, and the resume content in `scripts/build-portfolio-resume.py` (focus line, profile, strengths, skills order, Farm Frites bullets) were reordered; no employer, date, tool or result was added. `public/assets/Resume_Sajeevan_Veeriah.pdf` was rebuilt and validated with `scripts/generate-public-resume.py` (two pages, no contact details). Checks run and results are recorded in the pull request.

Outside the repository: resume Rev02 (DOCX, PDF) and LinkedIn and SEEK profile copy Rev05 (DOCX, PDF), all dated 20261114, are in OneDrive under `2026_Employment-Files/01-Resume-Main/01-Documents`. The live LinkedIn and SEEK profiles were not changed; that needs a signed-in browser.

## Work at 10 November 2026

Branch `saj/lucid-ride-ormfwg`: portfolio redesign around informative figures. A diagram kit (`src/components/figures/`) draws inline SVG figures from short specifications; every case study, project-index entry, service area and image-less journal post now has one, and the home page hero, career, learning and six-layer sections each lead with a figure. The decorative hero and feature renders in `public/assets/image/redesign/` and the October SVG project diagrams are no longer shown on project cards or record pages (journal posts still use four of the SVGs). Work catalogue and home cards are two-up so figure text is readable. Browser QA changes: the home band holds 4 cards, and the ataxia record is checked for its inline figure instead of a full-size SVG link. Checks run and results are recorded in the pull request.

## Work at 8 November 2026

Merged as #147 (0a416ad): adds the Dooen Plant Process Model case study (`/work/dooen-plant-process-model/`) with a 2 min 57 s walkthrough video in `public/assets/video` (9.5 MB, H.264, no audio). `ProjectVideo` renders an optional `video` on a case-study section; it does not autoplay and preloads nothing until played. Browser QA counts moved from 25 to 26 projects and from 10 to 11 case studies, and the "potato" search now returns 2 projects. Local checks: typecheck, lint, build, qa:export (47 routes) and qa:browser (658 checks) passed; the video played in a local browser.

Follow-up branch `work/video-range-requests`: live static assets answered a byte-range request with 200 and the whole file, which stops Safari on iPhone and iPad playing video. `wrangler.jsonc` now runs the Worker first for `/assets/video/*`, and `worker/index.ts` serves single byte ranges with 206, suffix ranges, 416 for unsatisfiable ranges and HEAD. Tested with `wrangler dev`: full GET 200, `bytes=0-1`, `bytes=0-`, `bytes=-500` and an end beyond the file all 206 with correct lengths; a start beyond the file 416; a missing video 404. Safari itself was not tested; no Apple device is available here.

## Work at 5 November 2026

Source baseline: [main at 56bda9ab](https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io/commit/56bda9ab05361450b50e3c1eac8c15db3b690985). Use the linked revision to distinguish these changes from later work.

- Add a second source to the integrator windup article (#145) ([56bda9ab](https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io/commit/56bda9ab05361450b50e3c1eac8c15db3b690985), 30 Oct 2026).
- Publish five journal articles on robotics, control, mechatronics, AI and engineering practice (#144) ([9c74c970](https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io/commit/9c74c9702f83494f001acc5ac0e66ff5ce50fcd9), 30 Oct 2026).

## Resume here

Check the affected page on the primary Cloudflare site and the GitHub Pages mirror where applicable. Contact relay behaviour is specific to the primary deployment.

GitHub showed no open pull requests or issues at this revision. Check the [work queue](https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io/pulls) and any local changes before choosing a task.

## Files and checks

[README.md](README.md), [TASKS.md](TASKS.md), [package.json](package.json).

Local commands declared in [package.json](package.json): `npm run typecheck`, `npm run lint`, `npm run build`. Record the command and result against the revision tested.

Start with [.github/workflows/deploy.yml](.github/workflows/deploy.yml) for hosted check definitions. Confirm the run belongs to the commit under review.

At the source revision, GitHub reported success across 5 check or status entries. [View checks](https://github.com/Sajeevanveeriah/sajeevanveeriah.github.io/commit/56bda9ab05361450b50e3c1eac8c15db3b690985/checks).

## Next handoff

When pausing, replace the dated snapshot with the active branch or revision, what changed, the checks actually run and their results, and the first unfinished action. Record any blocker or decision the next person needs. Keep private data and credentials out of this file.
