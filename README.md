# Sajeevan Veeriah Portfolio

Engineering portfolio for Sajeevan Veeriah, a Mechatronics, Robotics, Automation and AI/ML Engineer. Static GitHub Pages site served from the repository root, with an adaptive light and dark theme system.

Live site: <https://sajeevanveeriah.github.io/>

## Purpose and positioning

The site presents Saj as a complete-package engineer across the full engineering landscape: physical systems, electronics, embedded firmware, controls, robotics and automation, software, data and AI/ML, and validation and delivery. A recruiter can scan the hero, the Engineering System Map and the work cards in minutes; an engineering manager can go deep through the Capability Explorer, case-study disclosures and role details.

The only personal action offered to a visitor is the resume (view or download). The site intentionally carries no contact details, no location, no availability and no personal-profile links; the downloadable resume at `assets/Resume_Sajeevan_Veeriah.pdf` is the single personal-contact pathway and the factual source of truth for every claim.

## Adaptive theme system

Two fully designed themes share one set of component rules through CSS custom-property tokens:

| Theme | Name | Character |
| --- | --- | --- |
| Dark | Precision Graphite | Warm graphite surfaces, off-white type, restrained amber accent, hairline editorial layout |
| Light | Precision Porcelain | Cool porcelain background, white raised surfaces, near-black type, burnt-ochre accent, controlled shadows |

Behaviour:

- **Auto** (default): follows the operating system through `prefers-color-scheme`; nothing is stored.
- **Light / Dark**: manual override, stored in `localStorage` (`theme`), applied as `data-theme` on `<html>` by an inline head script before first paint so there is no wrong-theme flash.
- Choosing Auto removes the override; while in Auto the site re-themes live when the OS preference changes.
- `color-scheme` and paired `theme-color` metas keep form controls, scrollbars and browser chrome in step. Without JavaScript the control is hidden and the site simply follows the OS.

## Evidence-tier model

Every capability claim carries one of five tiers, rendered as tier dots (`.tier-dot-*`) with mono labels:

| Tier | Dot | Meaning |
| --- | --- | --- |
| Delivered | Solid amber | Professional or project delivery evidence exists |
| Hands-on | Outlined ring | Built, tested, configured, analysed or used directly |
| Working knowledge | Faded solid | Credible study, coursework or self-directed learning |
| Adjacent | Dashed ring | Transferable exposure from nearby systems |
| Target | Dashed amber ring | Strategic growth domain |

Domains are never omitted for being resume-light and never promoted above their evidence. If site copy conflicts with the resume, the resume wins. Ford must only ever appear as "Ford Motor Company via Invenio contract placement". No role uses "Present". Personal concepts are never presented as production deployments.

## Site structure

Single page, `index.html`, in section order:

1. Hero: name, positioning, complete-package lede, explore and resume actions, verified portfolio stats and the Engineering System Map
2. Selected Engineering Work (`#work`): one featured build plus six project cards with domain filtering, each opening a problem-to-output case study disclosure (Problem, Context, System architecture, Engineering decisions, Tools, Validation method, Output, Evidence level, What it demonstrates)
3. Complete Engineering Capability Explorer (`#capability`): nineteen capability domains with search, domain filter, evidence-tier filter, delivery-context filter, a live result count and stable ids for deep linking
4. Professional Experience (`#experience`): seven role cards in two groups (recent engineering roles; manufacturing, QA and production foundation), each with role, company, dates, tier, contribution summary, capability domains, representative tools and an expandable role detail
5. Tools and Software Ecosystem (`#toolchain`): six tool territories, each with anchor platforms, usage context and a supporting toolset
6. Education, Membership and Community (`#education`)
7. Beyond Engineering (`#beyond`): club cricket, hockey, long drives, music and garage robotics
8. Resume (`#resume`): "Explore the engineering evidence, then review the complete resume." with View and Download actions

The Engineering System Map in the hero is the visual signature: seven keyboard-focusable layers (Physical system, Electronics, Embedded, Controls, Robotics and automation, Data and AI, Validation and delivery). Each layer shows its evidence inline and, when selected, pre-filters the Capability Explorer. It is an ordered list of real text, so it works without JavaScript and reads as a vertical system flow on small screens.

## Technical constraints

- Static GitHub Pages only, served from the default branch root. No build step.
- Plain HTML, CSS and a small vanilla `main.js`. No framework, bundler or package manager.
- Zero runtime third-party requests: fonts (`assets/fonts/*.woff2`) and all images are self-hosted. No analytics or tracking.
- Australian and UK spelling. No em dashes or en dashes; date ranges are written "Jan 2026 to Jun 2026".
- The site must stay readable with JavaScript disabled: filters hide themselves, disclosures fall back to native `details` behaviour, all content is server-rendered in the HTML.
- Accessibility target is WCAG 2.2 AA: semantic landmarks, one `h1`, skip link, full keyboard access, visible focus, live filter status, reduced-motion support, 24 px minimum targets (primary controls near 44 px) and verified contrast in both themes.

## Privacy model

No contact, location, visa, work-rights or availability information may appear anywhere in the website source or rendered page: no `mailto:`, telephone numbers, personal or role locations, `geo.*` metas, JSON-LD email, telephone, address or personal `sameAs` links, and no contact or connect sections. The resume PDF is exempt and must not be edited. Legal company names containing geographic words (for example "Thornton Engineering Australia Pty Ltd") are allowed.

To verify sensitive data has not returned:

```sh
grep -RniE 'visa|work rights|available immediately|Geelong|Highton|Victoria|mailto:|gmail|telephone|addressLocality|addressRegion|addressCountry|geo\.region|geo\.placename|linkedin\.com' \
  --exclude-dir=.git --exclude='*.pdf' .
```

Review each hit manually; the only acceptable matches are legal company names and this documentation itself.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Key files and assets

| Path | Purpose |
| --- | --- |
| `index.html` | The whole site: content, markup, metadata and JSON-LD |
| `styles.css` | Dual-theme tokens and all component styles |
| `main.js` | Theme controller, mobile nav, work filter, capability explorer, system map, active nav, hash deep links |
| `favicon.svg` | SV monogram, theme-aware via `prefers-color-scheme` |
| `assets/fonts/` | Self-hosted Space Grotesk, Hanken Grotesk, IBM Plex Mono |
| `assets/image/` | Project case study images (PNG, explicit dimensions) |
| `assets/Resume_Sajeevan_Veeriah.pdf` | Resume, the only personal action on the site |
| `sitemap.xml`, `robots.txt` | SEO plumbing, canonical `https://sajeevanveeriah.github.io/` |
| `BingSiteAuth.xml`, `googlebcce96f6b520ab1f.html` | Search engine verification files, do not remove |
| `AGENTS.md` | Binding editing rules for future changes |

## How to update content

- **Projects**: add an `article.project-card` (with `data-project` and space-separated `data-domains`) in `#work` plus a matching `details.case-study` (`slug-detail` id) containing the nine case-study fields. Put the image in `assets/image/` with explicit `width`/`height`. Update the hero case-study count.
- **Capability entries**: edit `details.cap-entry` blocks in `#capability`. Each needs `data-cluster`, `data-tier` and `data-context` attributes matching the filter controls and a stable `cap-*` id; the search index is built from rendered text automatically.
- **Experience**: edit `article.role-card` blocks in `#experience`. Keep the pattern: icon, role title, company `h4`, dates in amber mono, tier chips, context summary, capability domains, representative tools, `details.role-detail`. No locations. Only state facts verified against the resume.
- **Toolchain**: edit `article.tool-group` blocks in `#toolchain`: anchor platforms in `.tool-anchors`, usage context, then one supporting `.dot-strip`.

## Validation checklist

Before committing changes:

1. `node --check main.js`
2. Serve locally and load with the browser console open: zero errors, zero external requests in the Network tab
3. Check Auto, Light and Dark at desktop and 390 px: no horizontal scroll, no wrong-theme flash, manual choice persists on reload, Auto follows the OS setting
4. Click every nav anchor, work filter, capability filter and project link; confirm the live result counts update and the resume opens and downloads
5. Validate the JSON-LD block parses (paste into a JSON parser after stripping the script tags)
6. `grep -nP "\x{2013}|\x{2014}" index.html README.md AGENTS.md styles.css main.js` must return nothing (no en/em dashes)
7. Run the privacy grep above and review every hit
8. Confirm no claim was promoted above its evidence tier and Ford is still "via Invenio contract placement"

## Deployment

GitHub user Pages serves the default branch root directly; merging to the default branch is the deployment. There is no build pipeline to run or invalidate.

## Rollback

Every change is a plain git commit. To roll back the redesign, revert the redesign commit(s) on the default branch (`git revert <sha>`), or restore the previous state with `git checkout <previous-sha> -- index.html styles.css main.js favicon.svg` and commit. No caches or build artefacts are involved.
