# Sajeevan Veeriah Portfolio

Engineering portfolio for Sajeevan Veeriah, a Mechatronics, Robotics, Automation and AI/ML Engineer. Static GitHub Pages site served from the repository root.

Live site: <https://sajeevanveeriah.github.io/>

## Purpose and positioning

The site presents Saj as a complete-package engineer across the full engineering landscape: physical systems, electronics, embedded firmware, controls, robotics and automation, software, data and AI/ML, and validation and delivery. A recruiter can scan the hero, the work records and the Systems Stack in minutes; an engineering manager can go deep through the Engineering Atlas, case-study disclosures and role details. The resume at `assets/Resume_Sajeevan_Veeriah.pdf` is the factual source of truth for every claim.

## Design direction: "Command", dual theme

A posh engineering command centre rendered in two committed themes that share one token contract, so the whole palette stays in lock step:

- **Midnight Command (dark):** midnight carbon background `#0B0D12` with layered panel surfaces `#10131A` and `#151923`, ivory typography `#ECE9E1` with muted `#A6AAB3` and faint `#83878F` support tones.
- **Daylight Command (light):** warm gallery-paper background `#F3F1EB` (deliberately not a beige worksheet) with surfaces `#FBFAF6` and `#FFFFFF`, deep ink text `#1A1C22` with muted `#4C515A` and faint `#767B84`.
- **Theme selection:** follows the operating system by default through `prefers-color-scheme`. A header control lets a visitor force System, Light or Dark; the choice is stored in `localStorage` (`theme`) and applied before first paint by a tiny inline script, so there is no flash. With JavaScript disabled the site still honours the system colour scheme.
- Champagne gold as the primary accent (kickers, CTAs, delivered dots, dates) and steel blue as the secondary accent (category labels, hands-on dots, in-copy links). Fill accents (`--gold`, `--steel`) are shared across themes; text accents (`--gold-text`, `--steel-text`) darken in the light theme to hold WCAG AA on paper.
- Precision hairlines, a faint technical grid behind the hero, numbered mono section kickers and 4 to 6 px radii.
- Typography: Space Grotesk (display), Hanken Grotesk (body), IBM Plex Mono (system labels), all self-hosted woff2.
- Expressive but disciplined, motion-safe motion: a capped pointer-reactive hero particle field (fine pointer only, paused off screen and when the tab is hidden) that shares its canvas with travelling signal packets on the links and a pointer-reactive two-segment robot arm solved with inverse kinematics (reaches its gripper toward the cursor, hands a packet off into the network on each reach, eases to a ready pose when idle, with a fainter companion arm beside it so the pair reads as a robotic cell), native scroll-driven media parallax on the compositor with a JS fallback, magnetic hero buttons, blur-and-scale scroll reveals, count-up stats and one-time hero choreography. No continuous, always-on animation; everything is gated behind `prefers-reduced-motion` and degrades to a complete static page.

Explicitly banned: orange as the dominant accent, beige worksheet backgrounds, purple gradients, glassmorphism overload, cyberpunk clutter, chip soup, skill bars, fake logos and fake screenshots.

## Technical constraints

- Static GitHub Pages only, served from the default branch root. No build step.
- Plain HTML, CSS and a small vanilla `main.js`. No framework, bundler or package manager.
- Zero runtime third-party requests: fonts (`assets/fonts/*.woff2`) and all images are self-hosted. No analytics or tracking.
- Australian and UK spelling. No em dashes or en dashes; date ranges are written "Jan 2026 to Jun 2026".
- The site must stay readable with JavaScript disabled: filters hide themselves, disclosures fall back to native `details` behaviour, the scroll reveal only arms itself when JS runs, and all content is server-rendered in the HTML.
- Accessibility target is WCAG 2.2 AA: semantic landmarks, one `h1`, skip link, full keyboard access, visible focus, live filter status, reduced-motion support and verified contrast on both the dark and light surfaces.
- Performance targets: LCP 2.5 s or less (text-first hero, preloaded display font), INP 200 ms or less (small vanilla JS), CLS 0.1 or less (explicit image dimensions, transform-only animation).

## Evidence-tier model

Every capability claim carries one of five tiers, rendered as tier dots (`.tier-dot-*`) with mono labels:

| Tier | Dot | Meaning |
| --- | --- | --- |
| Delivered | Solid champagne gold | Professional or project delivery evidence exists |
| Hands-on | Steel blue ring | Built, tested, configured, analysed or used directly |
| Working knowledge | Faded ivory | Credible study, coursework or self-directed learning |
| Adjacent | Dashed ivory ring | Transferable exposure from nearby systems |
| Target | Dashed gold ring | Strategic growth domain |

Domains are never omitted for being resume-light and never promoted above their evidence. If site copy conflicts with the resume, the resume wins. Ford must only ever appear as "Ford Motor Company via Invenio contract placement". No role uses "Present". Personal concepts are never presented as production deployments.

## Site structure

Single page, `index.html`, in section order:

1. Hero: name, positioning, complete-package lede, four actions (View work, Explore atlas, Download resume, Contact), verified stats and the closed-loop signal panel (Sense, Estimate, Control, Actuate, Verify)
2. Work (`#work`): nine proof-backed records: Engineering Mastery Lab as the featured engineering software build, the ROS 2 rover and six other project cards, plus a manufacturing and QA foundation record, with domain filtering, each opening a problem-to-output case study disclosure (Problem, Context, System architecture, Engineering decisions, Tools, Validation method, Output, Evidence level, What it demonstrates)
3. Engineering Atlas (`#atlas`): nineteen capability domains in a compact two-column card grid with search, domain filter, evidence-tier filter, delivery-context filter, a live result count and stable ids for deep linking
4. Systems Stack (`#stack`): ten layers from mechanical to AI/ML to validation and documentation; selecting a layer pre-filters the Atlas
5. Skill Library (`#skills`): six tool territories, each with anchor platforms, usage context and a supporting toolset
6. Experience (`#experience`): seven role cards in two groups (recent engineering roles; manufacturing, QA and production foundation), each with role, company, dates, tier, contribution summary, capability domains, representative tools and an expandable role detail
7. Education, Membership and Community (`#education`)
8. Beyond Engineering (`#beyond`)
9. Contact (`#contact`): email, LinkedIn, GitHub, Engineers Australia membership note and the resume view and download actions

## Contact and privacy model

The site carries exactly three personal channels, deliberately chosen: email (`sajeevanveeriah@gmail.com`), LinkedIn (`linkedin.com/in/sajeevan-veeriah`) and GitHub (`github.com/Sajeevanveeriah`), plus the resume download. Nothing else personal may appear: no telephone numbers, no street or suburb addresses, no personal or role locations, no visa, work-rights or availability statements, no `geo.*` metadata and no JSON-LD `telephone` or `address`. The resume PDF is exempt and must not be edited.

To verify nothing sensitive has returned:

```sh
grep -RniE 'visa|work rights|available immediately|telephone|\+61|addressLocality|addressRegion|addressCountry|geo\.region|geo\.placename' \
  --exclude-dir=.git --exclude='*.pdf' .
```

Review each hit manually; the only acceptable matches are this documentation itself.

## Key files and assets

| Path | Purpose |
| --- | --- |
| `index.html` | The whole site: content, markup, metadata and JSON-LD |
| `styles.css` | Midnight Command tokens and all component styles |
| `main.js` | Mobile nav, active nav, work filter, Atlas search and filters, Stack pre-filter, hash deep links, colour-theme controller, count-up stats, click-to-copy email, back-to-top, magnetic buttons, hero particle field, print expansion, scroll reveal |
| `favicon.svg` | SV monogram on the midnight plaque with the champagne underline |
| `assets/fonts/` | Self-hosted Space Grotesk, Hanken Grotesk, IBM Plex Mono |
| `assets/image/` | Project case study images (PNG, explicit dimensions) |
| `assets/Resume_Sajeevan_Veeriah.pdf` | Resume, source of truth for all claims |
| `sitemap.xml`, `robots.txt` | SEO plumbing, canonical `https://sajeevanveeriah.github.io/` |
| `BingSiteAuth.xml`, `googlebcce96f6b520ab1f.html` | Search engine verification files, do not remove |
| `AGENTS.md` | Binding editing rules for future changes |

## How to update content

### Experience cards

Edit `article.role-card` blocks in `#experience`. Keep the pattern: icon, role progression line, company `h4`, dates in gold mono (omit dates only where the resume does), tier chips, context summary, capability domains, representative tools, then the `details.role-detail` disclosure with What I did, Engineering relevance and Transferable capability. No locations. Only state facts verified against the resume. JAG is Jan 2026 to Jun 2026; Ford is always "Ford Motor Company via Invenio contract placement"; no role is "Present".

### Engineering Atlas

Edit `details.cap-entry` blocks in `#atlas`. Each needs `data-cluster`, `data-tier` and `data-context` attributes matching the filter controls, a stable `cap-*` id for deep linking, and the six body fields: Subdomains, Tools and software, Project proof, Experience proof, Transferable logic, Growth targets. The search index is built from rendered text automatically. Update the hero "Atlas domains" stat if the count changes.

### Projects and skills

- **Projects**: add an `article.project-card` (with `data-project` and space-separated `data-domains`) in `#work` plus a matching `details.case-study` (`slug-detail` id) containing the nine case-study fields. Put the image in `assets/image/` with explicit `width`/`height`; use an inline SVG panel (like the foundation record) rather than a fake screenshot when no real image exists. Update the hero "Work records" stat.
- **Skills**: edit `article.tool-group` blocks in `#skills`: anchor platforms in `.tool-anchors`, usage context, then one supporting `.dot-strip`. Avoid chip soup; keep the dot-separated strips.
- **Systems Stack**: edit `li.stack-layer` entries in `#stack`; keep `data-stack-cluster` pointing at a valid Atlas cluster value.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Validation checklist

Before committing changes:

1. `node --check main.js`
2. Serve locally and load with the browser console open: zero errors, zero external requests in the Network tab
3. Check desktop and a 390 px viewport: no horizontal scroll, nav opens and closes, filters and search update the live result counts
4. Click every nav anchor, work filter, Atlas filter, Stack layer and project link; confirm the resume opens and downloads and the mailto, LinkedIn and GitHub links are correct
5. Validate the JSON-LD block parses (paste into a JSON parser after stripping the script tags)
6. `grep -n $'\u2013\|\u2014' index.html README.md AGENTS.md styles.css main.js` must return nothing (no en/em dashes; the pattern uses bash unicode escapes so this file stays clean itself)
7. Run the privacy grep above and review every hit
8. Confirm no claim was promoted above its evidence tier and Ford is still "via Invenio contract placement"

## Deployment

GitHub user Pages serves the default branch root directly; merging to the default branch is the deployment. There is no build pipeline to run or invalidate.

## Rollback

Every change is a plain git commit. To roll back the redesign, revert the redesign commit(s) on the default branch (`git revert <sha>`), or restore the previous state with `git checkout <previous-sha> -- index.html styles.css main.js favicon.svg sitemap.xml` and commit. No caches or build artefacts are involved.
