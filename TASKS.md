# Portfolio redesign - 29 October 2026

- [x] Inspect current repository and approved combined visual.
- [x] Confirm Farm Frites as current from Saj's instruction.
- [x] Create and integrate original website image assets.
- [x] Implement responsive robotics hero, interactions and project presentation.
- [x] Update project copy and career status across the site.
- [x] Run typecheck, lint, build, export and rendered accessibility checks.
- [x] Compare rendered desktop and mobile design with approved visual.
- [x] Commit, push, open PR and complete local quality gates.

Release follow-through (merge, deploy and verify both live targets) is tracked in PR #141.

Base: 71e99e5e65051f297d1720ab99ee7a524c92f447.
Approved direction: bold robotics headline, exploded rover, Sense / Think / Act, navy and amber, original monogram.
Keep the existing static architecture, contact relay, full catalogue and career history.

## Heading clipping correction

- [x] Reproduce the 2560px clipped Mechatronics heading and measure its text bounds.
- [x] Constrain font sizing to the available text column.
- [x] Add a regression assertion for text hidden inside the line wrapper.
- [x] Pass typecheck, lint, build and targeted homepage/axe checks at 12 widths in both themes.
- Release and live verification are tracked in the correction PR.
