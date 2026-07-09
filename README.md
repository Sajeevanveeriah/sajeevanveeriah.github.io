# Sajeevan Veeriah Portfolio

Premium engineering portfolio for Sajeevan Veeriah, a Mechatronics, Robotics, Automation and AI/ML Engineer based in Geelong, Victoria. Static GitHub Pages site served from the repository root.

Live site: <https://sajeevanveeriah.github.io/>

## Purpose and positioning

The site presents Saj as a complete-package engineer across the full engineering landscape: physical systems, controls, embedded, robotics, software, data and validation. The July 2026 "Precision Graphite" redesign (implemented from a Claude Design source) gives it a premium dark technical look: warm graphite background, clear white typography, a single amber accent, hairline editorial layout and card-based experience storytelling. A recruiter can scan the hero, work and experience cards in minutes; an engineering manager can go deep through the Systems Stack, Skills library, Domain Atlas and role-detail disclosures.

## Evidence-tier model

Every capability claim carries one of five tiers, rendered as tier dots (`.tier-dot-*`) with mono labels:

| Tier | Dot | Meaning |
| --- | --- | --- |
| Delivered | Solid amber | Professional or project delivery evidence exists |
| Hands-on | Outlined ring | Built, tested, configured, analysed or used directly |
| Working knowledge | Faded solid | Credible study, coursework or self-directed learning |
| Adjacent | Dashed ring | Transferable exposure from nearby systems |
| Target | Dashed amber ring | Strategic growth domain |

Domains are never omitted for being resume-light and never promoted above their evidence. The resume at `assets/Resume_Sajeevan_Veeriah.pdf` is the source of truth; if site copy conflicts with it, the resume wins. Ford must only ever appear as "Ford Motor Company via Invenio contract placement". No role uses "Present".

## Site structure

Single page, `index.html`, in section order:

1. Hero: name, positioning, complete-package identity line, CTAs, status metadata, quick stats and the 14-domain Engineering capability index panel
2. Marquee: tools and methods ticker (pure CSS animation, disabled under reduced motion)
3. About (`#about`): narrative, capability strip and education
4. How I Work (`#approach`): four delivery-path steps
5. Work (`#portfolio`): one featured case study plus six project cards, all linking to in-page problem-to-output case study disclosures
6. Systems Stack (`#stack`): nine layers from mechanics to documentation, staircase layout with tier dots
7. Skills and Tools (`#skills`): six domain cards with a JS tab filter
8. Engineering Domain Atlas (`#atlas`): nineteen static domain disclosures with JS search, cluster filter, tier filter and a live result count
9. Experience (`#experience`): seven premium role cards in two groups (recent engineering roles; manufacturing, QA and production-floor foundation), each with icon, dates, location, tier badges, context, story, expandable "Role detail" and grouped tags
10. Leadership, What I Bring, Certifications, Writing, Contact (`#contact`)

## Engineering domain coverage

The Domain Atlas covers nineteen domains across seven clusters: Systems; Physical systems (mechanical, materials, thermofluids, electrical and power); Embedded and electronics (PCB, board bring-up, firmware); Controls and robotics (control systems, PLC and SCADA, ROS 2 autonomy); Software and intelligence (AI/ML and data science, software engineering and DevOps, IoT and telemetry); Sectors (automotive validation, biomedical, manufacturing and quality, process and pharma, civil and structural awareness, aerospace/space/marine/rail/defence/mining/agriculture/energy adjacencies); and Assurance and delivery (safety and standards, commissioning and handover). Each domain lists subdomains, tools, proof, transferable logic and growth targets at its honest tier.

## Technical constraints

- Static GitHub Pages only, served from the default branch root. No build step.
- Plain HTML, CSS and a small vanilla `main.js`. No framework, bundler or package manager.
- Zero runtime third-party requests: fonts (`assets/fonts/*.woff2`) and all images are self-hosted.
- No generated design-tool runtime in production: the Claude Design source (`support.js`, `x-dc` components, `.dc.html` pages) was translated into static HTML/CSS/JS, never shipped.
- Australian and UK spelling. No em dashes or en dashes; date ranges are written "Jan 2026 to Jun 2026".
- The site must stay readable with JavaScript disabled: filters hide themselves, disclosures fall back to native `details` behaviour, all content is server-rendered in the HTML.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Key files and assets

| Path | Purpose |
| --- | --- |
| `index.html` | The whole site: content, markup, metadata and JSON-LD |
| `styles.css` | Design system tokens and all component styles |
| `main.js` | Mobile nav, skills tab filter, Atlas search/filters, hash-open for case studies |
| `favicon.svg` | SV monogram in the graphite and amber palette |
| `assets/fonts/` | Self-hosted Space Grotesk, Hanken Grotesk, IBM Plex Mono |
| `assets/image/` | Project case study images (PNG) |
| `assets/Resume_Sajeevan_Veeriah.pdf` | Resume download, linked from nav, hero, footer |
| `sitemap.xml`, `robots.txt` | SEO plumbing, canonical `https://sajeevanveeriah.github.io/` |
| `BingSiteAuth.xml`, `googlebcce96f6b520ab1f.html` | Search engine verification files, do not remove |
| `AGENTS.md` | Binding editing rules for future changes |

## How to update content

- **Experience cards**: edit the `article.role-card` blocks inside `#experience` in `index.html`. Keep the pattern: icon, progression line, company `h4`, meta row (dates in amber mono, location, tier chips), context line, story paragraph, `details.role-detail` (What I did, Engineering relevance, Transferable capability) and a `p.role-tags` dot-strip. Only state facts verified against the resume.
- **Domain Atlas data**: edit the `details.atlas-domain` blocks inside `#atlas`. Each needs `data-cluster` and `data-tier` attributes matching the filter controls; the search index is built from the rendered text automatically.
- **Project cards**: edit the featured card and `a.project-card` entries in `#portfolio`, and the matching `details.case-study` disclosure (ids follow the `slug` and `slug-detail` pattern). Put the image in `assets/image/` and reference it with explicit `width`/`height`.
- **Skills**: edit the `section.skill-card` blocks in `#skills`. `data-domain` must match one of the tab ids (`robotics`, `automation`, `embedded`, `aiml`, `mech`).

## Validation checklist

Before committing changes:

1. `node --check main.js`
2. Serve locally and load with the browser console open: zero errors, zero external requests in the Network tab
3. Check desktop and a 390 px mobile viewport: no horizontal scroll, nav opens and closes, cards readable
4. Click every nav anchor and project card; confirm the resume link downloads
5. Validate the JSON-LD block parses (paste into a JSON parser after stripping the script tags)
6. `grep -nP "\x{2013}|\x{2014}" index.html README.md` must return nothing (no en/em dashes)
7. Confirm no claim was promoted above its evidence tier and Ford is still "via Invenio contract placement"

## Deployment

GitHub user Pages serves the default branch root directly; merging to the default branch is the deployment. There is no build pipeline to run or invalidate.

## Rollback

Every change is a plain git commit. To roll back the redesign, revert the redesign commit(s) on the default branch (`git revert <sha>`), or restore the previous state with `git checkout <previous-sha> -- index.html styles.css main.js favicon.svg` and commit. No caches or build artefacts are involved.
