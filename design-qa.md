# Design QA - corrective portfolio rebuild

## Comparison target

- Source: approved combined editorial/constellation portfolio concept and the selected dark and light concept boards.
- Implementation: local homepage and `/work/` route at `http://terminal.local:4173/`.
- Desktop viewport: 1363 x 936 CSS pixels in the cloud browser.
- Mobile viewport: 390 x 844 CSS pixels through a same-origin responsive frame.

## Findings and fixes

| Severity | Earlier mismatch | Corrective implementation | Post-fix evidence |
| --- | --- | --- | --- |
| P0 | The homepage carried the full project archive, creating a very long, database-like page. | The homepage now previews three projects; the complete 16-project archive lives on `/work/`. | `/work/` exposes the full archive and the homepage returns to the compact concept rhythm. |
| P1 | Experience and learning expanded into tall two-column blocks with large dead zones. | Experience is limited to four concise professional records; the roadmap is a six-column progression. | Desktop capture shows both sections in one deliberate viewport-height composition. |
| P1 | Hero typography and image composition drifted from the concepts. | Restored the two-line serif name, restrained sans role, labelled engineering system portrait and singular CTA hierarchy. | Light and dark browser captures match the source hierarchy and asymmetrical split. |
| P1 | PDF output exposed the skip link and produced poor page breaks. | Added print-only header, section and break rules; the skip link and theme controls are excluded from print. | CSS print inspection and production build pass. |
| P2 | The portfolio identity changed between the homepage and Work page. | Removed the unrelated graphical logo from the global masthead and retained the typographic Sajeevan Veeriah identity. | Homepage and Work route now share the same name-led navigation identity. |

## Required fidelity surfaces

- Fonts and typography: passed. Editorial serif hierarchy, compact uppercase labels and restrained sans body copy are consistent with the concept boards.
- Spacing and layout rhythm: passed. Homepage sections are compact, aligned to one grid and no longer contain archive-driven dead zones.
- Colours and tokens: passed. The same structure supports the approved light editorial and dark constellation presentations.
- Image quality and asset fidelity: passed. Authentic portfolio imagery is retained and treated consistently; no placeholders or improvised icon art remain.
- Copy and content: passed. Sajeevan's robotics, mechatronics, AI/ML, automation, professional experience and learning roadmap remain accurate and visible.
- Responsiveness: passed. The 390 px responsive hero preserves hierarchy, actions and the system visual without horizontal overflow.
- Interaction and accessibility: passed. Theme selection, navigation and project links were exercised in the cloud browser; focus treatments and reduced-motion handling remain present.

## Remaining P3 polish

- A purpose-made transparent robot-arm line illustration would more exactly match the concept art than the current authentic factory-system image, but it is not required for layout fidelity.

## Implementation checklist

- [x] Compact homepage architecture
- [x] Complete project archive moved to Work
- [x] Work-history summary retained
- [x] Six-month learning roadmap retained
- [x] Light and dark presentations checked
- [x] Desktop and mobile layouts checked
- [x] Typecheck, lint and production build passed

**final result: passed**
