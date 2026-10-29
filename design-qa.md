# Robotics portfolio design QA - 29 October 2026

Approved target: combined options 1 and 3, navy and amber, original monogram, bold three-line discipline headline and exploded rover.

Reviewed the rendered homepage at 1440 x 1000 and 390 x 844. Desktop preserves the asymmetric type/image composition; mobile stacks the hero and project rows without horizontal overflow. The original logo, full catalogue, career timeline, learning pathway and contact form remain. Four compressed WebP illustrations total 634 KB.

Sense / Think / Act changes the image and supporting explanation. Arrow-key navigation switches tabs and moves focus. Motion has a pause control and respects reduced-motion preferences. Both colour themes retain accessible hero contrast.

Typecheck, lint, production build and static export passed. The rendered sweep passed all 41 routes at seven widths in both themes, including axe accessibility checks. A catalogue-search regression found by the final interaction checks was corrected by retaining ataxia in the MazeTrack summary; the complete interaction portion then passed on the rebuilt output. Lighthouse passed all 41 routes (homepage: performance 90, accessibility 100, best practices 100, SEO 100). Wrangler dry run and Pages mirror generation passed.

The PR quality workflow is manually disabled. Repository rules prohibit deletion and force-push but do not require status checks. Its checks were run locally; the active production workflow repeats them before deploying. No repository settings were changed.

Final design result: passed. Release and live verification are tracked in PR #141.

## Heading correction

The initial page-overflow check missed content clipped inside the animated headline wrapper. At a 2560px viewport, Mechatronics measured 599.66px inside a 566px column. The headline now uses a column-relative cap: its measured width is 553.38px at that viewport. A new assertion compares every headline span against its wrapper. Focused homepage checks passed at 320, 390, 768, 800, 801, 1024, 1025, 1440, 1536, 1920, 2560 and 3440px in light and dark themes. Chrome visual review at 2560px confirms the complete word and full stop are visible.
