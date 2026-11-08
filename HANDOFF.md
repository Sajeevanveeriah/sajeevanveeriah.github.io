# sajeevanveeriah.github.io handoff

Maintain the engineering portfolio, journal and contact relay.

## Work at 8 November 2026

Branch `work/dooen-plant-showcase`: adds the Dooen Plant Process Model case study (`/work/dooen-plant-process-model/`) with a 2 min 57 s walkthrough video in `public/assets/video` (9.5 MB, H.264, no audio). `ProjectVideo` renders an optional `video` on a case-study section; it does not autoplay and preloads nothing until played. Browser QA counts moved from 25 to 26 projects and from 10 to 11 case studies, and the "potato" search now returns 2 projects. Local checks: typecheck, lint, build, qa:export (47 routes) and qa:browser (658 checks) passed; the video played in a local browser.

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
