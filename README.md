# Sajeevan Veeriah Portfolio

Premium engineering portfolio for Sajeevan Veeriah, a Mechatronics, Robotics, Automation and AI/ML Engineer based in Geelong, Victoria. Static GitHub Pages site served from the repository root.

Live site: <https://sajeevanveeriah.github.io/>

## Purpose and positioning

The site presents Saj as a complete-package engineer across the full engineering landscape: physical systems, controls, embedded, robotics, software, data and validation. It is built as a "Systems Engineer Interface": a recruiter can scan the hero, projects and experience in minutes, while an engineering manager can go deep through the Domain Atlas, Systems Stack and case-study panels.

## Evidence-tier model

Every capability claim carries one of five tiers, rendered as `.tier` badges:

| Tier | Meaning |
| --- | --- |
| Delivered | Professional or project delivery evidence exists |
| Hands-on | Built, tested, configured, analysed or used directly |
| Working knowledge | Credible study, coursework or self-directed learning |
| Adjacent | Transferable exposure from nearby systems |
| Target | Strategic growth domain |

Domains are never omitted for being resume-light and never promoted above their evidence. The resume at `assets/Resume_Sajeevan_Veeriah.pdf` is the source of truth; if site copy conflicts with it, the resume wins. Ford must only ever appear as "Ford Motor Company via Invenio contract placement". No role uses "Present".

## Site structure

Single page, `index.html`, in section order:

1. Hero: name, positioning, CTAs, interactive 14-node capability map (`assets/js/competency-map.js`)
2. About and education
3. How I Work
4. Projects: seven evidence-tiered case studies with problem, system layers, domains, tools and output
5. Systems Stack: nine layers from mechanics to documentation, staircase diagram
6. Skills library: filterable toolkit cards with tier badges
7. Engineering Domain Atlas: 19 domains with search, tier filter, cluster filter and result count (`assets/js/domain-atlas.js`)
8. Experience: verified timeline
9. Leadership, What I Bring, Certifications, Writing, Contact

## Engineering domain coverage

The Atlas covers: mechatronics and systems engineering; mechanical, materials and thermofluids; electrical and power; electronics and PCB; embedded and firmware; control systems; industrial automation, PLC and SCADA; robotics and autonomy; AI, ML and data science; software engineering and DevOps; IoT and telemetry; automotive and validation; biomedical devices; manufacturing and QA; process, pharma and regulated manufacturing; civil and structural awareness; aerospace, space, marine, rail, defence, mining, agriculture and energy (adjacent or target only); safety, standards and cyber-physical security; and project delivery and commissioning.

## Design system

Dark graphite theme with a single signal-cyan accent (tokens at the top of `styles.css`). Space Grotesk display type, Hanken Grotesk body, IBM Plex Mono for small system labels. Layered cards with depth, 14 px radii, glow-on-hover borders. Do not reintroduce a light beige theme, paper-grid backgrounds or dense mono chip walls; see `AGENTS.md`.

## Technical constraints

- Plain HTML, CSS and vanilla JavaScript; no framework, bundler, package manager or build step
- Zero runtime third-party requests; all fonts are local WOFF2 in `assets/fonts/`
- Progressive enhancement: the hero map and Domain Atlas replace static fallback lists, so the page stays readable without JavaScript
- Accessibility: keyboard support throughout, visible focus states, aria-live filter feedback, reduced-motion support

## Local preview

```
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Updating content

- Domain Atlas data: edit the `DOMAINS` array in `assets/js/domain-atlas.js` (cluster, tier, subdomains with optional per-item tiers, tools, proof, transfer, targets)
- Hero map: edit the `DOMAINS` array in `assets/js/competency-map.js`; keep it to roughly 14 high-level nodes
- Projects: edit the `project-card` and `project-detail` articles in `index.html`; use real image assets in `assets/image/` only
- Skills: edit the `stack-card` sections in `index.html`
- Experience: edit the `timeline-item` articles; keep dates matching the resume

## Preserved files (do not rename or delete)

- `robots.txt`, `sitemap.xml`, `BingSiteAuth.xml`, `googlebcce96f6b520ab1f.html`
- `assets/Resume_Sajeevan_Veeriah.pdf`
- `assets/fonts/*`, `assets/image/*`

## Validation checklist

- Serve locally and open in a browser: no console errors, no external network requests
- Keyboard-only pass over nav, hero map, atlas cards and filters
- Mobile viewport: no horizontal scroll, nav overlay works
- All internal anchors resolve; resume download returns 200
- JSON-LD parses and contains no `worksFor`
- No em dash or en dash characters; UK/Australian spelling
- No claims above their evidence tier

## Deployment and rollback

GitHub Pages serves the default branch root directly; merging to `main` deploys. To roll back, revert the merge commit on `main` (or revert individual commits on the feature branch before merging). No build artefacts exist, so a revert is a complete rollback.

## Links

LinkedIn: <https://www.linkedin.com/in/sajeevan-veeriah/> · GitHub: <https://github.com/Sajeevanveeriah>
