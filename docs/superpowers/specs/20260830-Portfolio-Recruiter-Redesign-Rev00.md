# Portfolio Recruiter Redesign Specification

## Purpose

Rebuild Sajeevan Veeriah's portfolio as a concise, recruiter-first case for hiring him while preserving the existing visual system and evidence boundaries. The approved direction integrates all three concepts: Direction A provides the narrative spine, Direction C brings project proof near the top, and Direction B adds optional in-page role lenses.

The exact public identity is:

`Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer`

The site must explain three things quickly:

1. Who Saj is.
2. What complete engineering problems he can solve.
3. What evidence proves it.

## Source of truth

- `AGENTS.md` governs public identity, confidentiality, static export, accessibility and release controls.
- `src/content/site.ts` and `src/content/projects.ts` contain the active verified public evidence.
- `public/assets/Resume_Sajeevan_Veeriah.pdf` is currently inconsistent with the public confidentiality rule and must be replaced with a compliant public edition before release.
- The existing light and dark visual language in `src/app/globals.css` is retained.

## Audience

Primary:

- Recruiters and hiring managers for robotics, autonomy, embedded, controls, industrial automation, AI/ML and systems-integration roles.

Secondary:

- Engineering leaders, technical collaborators, clients and community partners who need a fast, defensible picture of Saj's capability.

## Positioning

Saj is not presented as a catalogue of nineteen disciplines. He is presented as an engineer who connects cyber-physical layers and closes the loop from physical requirements through verification and handover.

The core proposition must communicate:

- cross-disciplinary systems ownership;
- strength at mechanical, electrical, embedded, control, network, data and software interfaces;
- practical evidence across lab, field, vehicle and production environments;
- verification, commissioning and handover discipline;
- clear boundaries between delivered, assessed, simulated, illustrative and confidential evidence.

## Information architecture

### Homepage

The homepage follows this exact path:

1. Identity and proposition.
2. Compact trust proof.
3. Immediate three-project proof rail.
4. Three optional role lenses.
5. Six-layer systems method.
6. Three full flagship engineering records.
7. Selected professional practice and working style.
8. Contact.

The first project proof must be visible within approximately 180 words and the first full flagship must be reachable within approximately 350 visible words. Total homepage copy should remain within approximately 650 to 900 visible words, excluding navigation and hidden mobile controls.

### Work index

`/work/` presents the three evidence-bounded flagship records only. It must not render the sixteen-item secondary catalogue.

### Engineering records

Each `/work/[slug]/` record must make the following scannable:

- problem or mission;
- Saj's contribution;
- system boundary;
- key engineering decision;
- implementation path;
- verification;
- evidence boundary;
- direct next action: next project, email or resume.

Existing factual content may be restructured but not inflated.

## Homepage content design

### Hero

Retain the stacked name, spectrum rule, Archivo typography, current palette and EngineeringField visual.

Required content:

- Geelong location context;
- exact professional identity;
- a short proposition about engineering complete systems from physical requirements to verified operation;
- one supporting paragraph focused on cross-disciplinary interfaces and delivery;
- actions for selected work, resume and email.

Remove from the hero:

- PayPal;
- portfolio inventory counts;
- the Living Systems Atlas label;
- claims that make breadth itself the product.

### Trust proof

Show compact factual proof:

- Member, Engineers Australia;
- Bachelor of Mechatronics Engineering (Honours), Distinction, 2025;
- Geelong, Victoria, Australia;
- lab, field, vehicle and production delivery contexts.

### Immediate project proof

Place a compact proof rail directly after the hero and trust proof. It repeats only:

- project title;
- evidence class;
- one bounded outcome line;
- a direct link to the record.

The rail must feature all three flagship records without duplicating their longer contribution and verification summaries.

### Role lenses

Offer three visible, optional in-page routes into the same evidence:

1. Robotics and Mechatronics.
2. Automation and Controls.
3. AI/ML and Engineering Software.

Each lens contains a concise value statement and links to relevant evidence already on the page or in the three engineering records. Lenses do not filter, hide or duplicate content, require client state, introduce separate landing pages or change the core narrative order.

### Systems method

Reuse the existing six layers:

1. Physical system.
2. Sensing and electronics.
3. Embedded intelligence.
4. Robotics and autonomy.
5. AI/ML and data.
6. Validation and deployment.

This is the only systems taxonomy on the homepage.

### Flagship records

Show exactly these existing routed records:

1. Autonomous Navigation Rover on ROS 2.
2. ESP32 Clinical Ataxia Assessment Device.
3. SWL Pricing and Inventory Control.

Each preview shows a bounded outcome, Saj's contribution, verification and one evidence label. Technology tags are secondary.

### Professional practice

Use three compact evidence areas based on existing verified experience:

- regulated automation and commissioning;
- field IoT and equipment telemetry;
- automotive validation and traceable test evidence.

Add one short working-style statement about crossing interfaces, finding faults and leaving clear evidence for handover.

Add one short human note covering community sport, mentoring and personal engineering builds. Do not use a lifestyle-card catalogue or generated portrait.

### Contact

Use one decisive close with:

- email;
- GitHub;
- resume.

PayPal may remain only as a visually subordinate footer link.

## Navigation and identity

Primary navigation contains four destinations:

- Systems.
- Work.
- Practice.
- Contact.

The header resume action remains.

The brand subtitle becomes a short systems-engineering descriptor and must not use `Living Systems Atlas`.

The exact professional identity must propagate to:

- hero;
- metadata title and description;
- Open Graph content;
- Person structured data;
- footer;
- compliant public resume.

## Visual system

Use the supplied Hyer Aviation reference as the stylistic layer, while keeping the portfolio's engineering identity and factual content. Borrow its typographic confidence and restraint, not its aircraft imagery, travel language or luxury-brand content.

Preserve:

- self-hosted Archivo typography as the available HelveticaNowDisplay substitute;
- oversized editorial name and headings;
- engineering-grid linework and numbered evidence motifs;
- the abstract EngineeringField as the hero object;
- visible focus, theme persistence, responsive reflow and reduced motion;
- evidence captions and contained media framing.

Adopt from the reference:

- a near-monochrome core of deep ink, pure white, cool ash and pebble;
- one restrained clay accent for a single focal treatment per viewport;
- alternating white and midnight full-width bands for vertical rhythm;
- architectural display type with very tight tracking and compact leading;
- 18 px body copy with generous leading;
- pill-shaped actions and hard-edged editorial panels;
- surface contrast and hairline rules instead of drop shadows;
- spacious layouts with a maximum content width around 1200 px.

Change only what improves hierarchy or compliance:

- demote the previous six-colour spectrum from the primary interface; do not use colour alone to distinguish system layers;
- simplify section density;
- raise theme controls to at least 44 px high;
- map requested font weights to loaded 400, 600 and 800 weights;
- lazy-load below-fold images;
- remove obsolete Atlas, catalogue, timeline and lifestyle styles after confirming they are unused;
- keep concept and illustrative media explicitly labelled;
- never introduce aircraft imagery, luxury-travel language, extra accent hues, glassmorphism or shadow-heavy cards; the pale sky-to-cream hero atmosphere is the only restrained gradient.

## Public resume

The downloadable public resume must remain useful while following `AGENTS.md`.

Requirements:

- two A4 pages;
- exact professional identity;
- no Ford, Ford Motor Company, Invenio or JAG Process Solutions names;
- truthful functional employer descriptions;
- factual responsibilities and evidence already present in the repository;
- no photo, icons, gradients or skill bars;
- accessible text and selectable content;
- email, portfolio and GitHub links;
- file remains `public/assets/Resume_Sajeevan_Veeriah.pdf` because it is a protected existing public path.

## Static and privacy boundary

Retain:

- Next.js static export;
- trailing slash routes;
- unoptimised local images;
- `.nojekyll`;
- robots, sitemap and generated 404 behavior;
- no API routes, database, authentication, analytics, trackers or runtime third-party requests.

## Accessibility

Required release behavior:

- semantic landmarks and logical headings;
- visible focus and unobscured focused elements;
- full keyboard operation;
- minimum 44 px project touch target policy;
- no colour-only meaning;
- meaningful alt text and adjacent text equivalents for engineering visuals;
- responsive reflow from 320 px to ultrawide;
- usable at 200 percent zoom;
- light, dark and system theme states;
- reduced-motion behavior;
- WCAG 2.2 AA automated checks with manual review.

## Quality and release criteria

Required local checks:

- content-contract assertions fail before implementation and pass after it;
- typecheck;
- lint;
- production build and static export;
- browser QA at 320, 390, 768, 1440 and 1920 px;
- Axe accessibility checks;
- light, dark and system theme state checks;
- keyboard and visible-focus checks;
- 200 percent zoom/reflow inspection;
- reduced-motion inspection;
- no-JavaScript content check;
- representative redirect and 404 checks;
- runtime request audit;
- Lighthouse on the homepage, work index and three record routes;
- forbidden-name and Unicode dash scans;
- final diff review.

Commit, push, merge and deployment are separate release actions and remain blocked until Saj grants current target-specific approval after reviewing the verified working tree.

## Rollback

Implementation occurs on an isolated local worktree and branch. Rollback is removal of that worktree or abandonment of its uncommitted branch. The existing `main` checkout and remote remain unchanged until a separately approved integration action.
