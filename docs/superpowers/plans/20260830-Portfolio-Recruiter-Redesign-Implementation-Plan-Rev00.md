# Portfolio Recruiter Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static portfolio into a concise recruiter-first systems-engineering narrative that combines an immediate proof rail, three optional role lenses, three evidence-bounded records and a compliant public resume.

**Architecture:** Preserve the Next.js static-export architecture and existing engineering motifs, then reinterpret the visual system through the supplied Hyer Aviation reference: architectural type, a near-monochrome palette, one clay accent, pill actions and alternating light/dark bands. Restructure compile-time content and Server Components, retain only the theme selector as essential homepage client state, and update existing browser QA to enforce the new content contract.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.9, CSS, Playwright, Axe, Lighthouse and GitHub Actions.

**Spec:** `docs/superpowers/specs/20260830-Portfolio-Recruiter-Redesign-Rev00.md`

## Global Constraints

- Exact public identity: `Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer`.
- Do not include Ford, Ford Motor Company, Invenio or JAG Process Solutions in public content.
- Keep `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`, `public/.nojekyll`, robots, sitemap and static 404 behavior.
- No API routes, runtime fetching, database, authentication, analytics, tracking or third-party runtime requests.
- Use Australian and UK spelling with ASCII hyphens only.
- Preserve evidence boundaries and do not invent metrics, tools, ownership or outcomes.
- Maintain WCAG 2.2 AA, visible focus, 44 px touch targets, reduced motion, text equivalents and responsive reflow from 320 px to ultrawide.
- Do not commit, push, merge or deploy without a later current target-specific approval.

---

### Task 1: Isolate the work and establish the failing content contract

**Files:**
- Modify: `scripts/qa-browser.mjs`

**Interfaces:**
- Consumes: current static homepage and work routes.
- Produces: assertions for the exact identity, eight-stage homepage order, immediate proof rail, role lenses, three flagship records, removed catalogue content, working anchors and limited PayPal exposure.

- [ ] **Step 1: Create an isolated worktree and implementation branch**

Use `superpowers:using-git-worktrees` and create a branch named `redesign/recruiter-first-portfolio-20260830` without changing `main`.

- [ ] **Step 2: Install the existing locked dependencies**

Run `npm ci` in the isolated worktree. Do not change `package.json` or `package-lock.json`.

- [ ] **Step 3: Replace obsolete browser assertions with the approved contract**

Add assertions for:

```js
await expect(page.getByText('Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer', { exact: true })).toBeVisible()
await expect(page.locator('#proof .proof-rail-item')).toHaveCount(3)
await expect(page.locator('#role-lenses .role-lens')).toHaveCount(3)
await expect(page.locator('#systems')).toHaveCount(1)
await expect(page.locator('#work .selected-system')).toHaveCount(3)
await expect(page.locator('#practice')).toHaveCount(1)
await expect(page.locator('#contact')).toHaveCount(1)
await expect(page.getByText('Nineteen connected capability domains.')).toHaveCount(0)
await expect(page.getByText('16 further engineering projects.')).toHaveCount(0)
await expect(page.getByText('Complete work history')).toHaveCount(0)
await expect(page.locator('a[href*="paypal.me"]')).toHaveCount(1)
```

Use equivalent supported assertions if the existing QA harness is not Playwright Test syntax.

- [ ] **Step 4: Run the browser contract against the current export and prove failure**

Run `npm run build` and `npm run qa:browser`.

Expected: browser QA fails on the exact identity and obsolete homepage sections.

- [ ] **Step 5: Record the checkpoint without committing**

Review `git diff -- scripts/qa-browser.mjs`. Do not commit.

### Task 2: Centralise recruiter-facing content

**Files:**
- Modify: `src/content/site.ts`
- Modify: `src/content/projects.ts`

**Interfaces:**
- Consumes: existing evidence-bounded project and experience records.
- Produces: `site`, `roleLenses`, `systemLayers`, `practiceDomains`, concise professional proof and human-note data consumed by the homepage and metadata.

- [ ] **Step 1: Write the exact identity and concise proposition**

Set `site.jobTitle` exactly and replace the hero proposition/profile with concise first-person copy grounded in the spec.

- [ ] **Step 2: Replace catalogue-era content exports**

Keep `systemLayers`. Reduce `practiceDomains` to the approved professional proof areas and add one concise working-style/human note. Remove exports used only by the homepage catalogue after their imports are removed.

- [ ] **Step 3: Tighten project preview fields**

Ensure each flagship record exposes a short outcome, personal contribution, verification and evidence label without changing factual boundaries.

- [ ] **Step 4: Run static validation**

Run `npm run typecheck`.

Expected: failures are limited to consumers not yet updated in later tasks.

- [ ] **Step 5: Review content diff for prohibited or unsupported claims**

Run:

```bash
rg --pcre2 -n "Ford|Ford Motor Company|Invenio|JAG Process Solutions|\\x{2013}|\\x{2014}" src public --glob '!public/assets/Resume_Sajeevan_Veeriah.pdf'
```

Expected: no matches in active text sources.

### Task 3: Recompose the homepage and navigation

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/Masthead.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/components/EngineeringField.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: content exports from Task 2 and existing `featuredProjects`.
- Produces: sections `overview`, `proof`, `role-lenses`, `systems`, `work`, `practice` and `contact`, plus matching navigation anchors.

- [ ] **Step 1: Remove catalogue components from the homepage render path**

Remove `AtlasExplorer`, `ProjectIndex`, `ExperienceTimeline`, the standalone brand artwork, foundation grid and lifestyle catalogue from `src/app/page.tsx`.

- [ ] **Step 2: Build the approved hybrid homepage**

Compose the hero, trust proof, immediate three-project proof rail, three static role lenses, six-layer systems rail, three full flagship previews, professional-practice proof and contact section using semantic sections and logical headings. The proof rail stays compact; role lenses link into shared evidence and never filter or hide it.

- [ ] **Step 3: Align the masthead and footer**

Use four navigation anchors: Systems, Work, Practice and Contact. Replace the Atlas subtitle and keep Resume, theme controls and the mobile disclosure. Keep PayPal only in the footer.

- [ ] **Step 4: Refine the Hyer-inspired visual system and interaction sizing**

Preserve the EngineeringField identity but reduce decorative dominance. Use oversized tightly tracked Archivo display type, deep ink/white/ash/pebble surfaces, one clay focal accent, alternating light/dark bands, pill actions and hard-edged evidence panels. Raise theme choices and all relevant controls to at least 44 px.

- [ ] **Step 5: Prune obsolete CSS and preserve tokens**

Remove selectors used only by removed sections after confirming zero remaining references. Consolidate the old multi-colour emphasis into the approved restrained palette while preserving accessible dark mode, responsive breakpoints, print and reduced-motion rules. Use hairlines and surface changes, not drop shadows; retain only the approved pale atmospheric hero gradient.

- [ ] **Step 6: Run type, lint and content-contract checks**

Run:

```bash
npm run typecheck
npm run lint
npm run build
npm run qa:browser
```

Expected: exact identity and homepage structure assertions pass; later route assertions may still fail until Task 4.

### Task 4: Curate the work index and strengthen record conversion

**Files:**
- Modify: `src/app/work/page.tsx`
- Modify: `src/app/work/[slug]/page.tsx`
- Modify: `src/components/RecordArticle.tsx`
- Modify: `src/content/projects.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `scripts/qa-browser.mjs`

**Interfaces:**
- Consumes: three `featuredProjects` and static route generation.
- Produces: a three-record work index, scannable project evidence and next-action links.

- [ ] **Step 1: Remove the secondary catalogue from `/work/`**

Render only the three flagship records with outcome, contribution, verification and descriptive links.

- [ ] **Step 2: Add evidence-oriented record sections**

Restructure each record to expose mission, contribution, boundary, engineering decision, implementation and verification while preserving existing facts.

- [ ] **Step 3: Add record conversion links**

Add Email Saj, Resume and deterministic previous/next project links. Ensure link names identify their destination.

- [ ] **Step 4: Keep sitemap and static generation deterministic**

Confirm only the homepage, curated work index and three records are emitted as primary portfolio routes.

- [ ] **Step 5: Extend browser QA**

Assert each record has evidence-boundary text, contact/resume actions, one next-project link and no public catalogue.

- [ ] **Step 6: Run route checks**

Run `npm run build` and `npm run qa:browser`.

Expected: homepage, work index, three records, representative redirects and 404 checks pass.

### Task 5: Align metadata and build the compliant public resume

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `public/assets/Resume_Sajeevan_Veeriah.pdf`
- Modify: `README.md`
- Create only if required for reproducibility: `scripts/generate-public-resume.mjs`
- Modify only if the generator is retained: `package.json`

**Interfaces:**
- Consumes: exact identity and verified content in `src/content/site.ts`.
- Produces: aligned metadata, structured data and a two-page public resume at the protected existing URL.

- [ ] **Step 1: Align metadata and schema**

Update title, description, Open Graph alt text and Person `jobTitle`/`knowsAbout` to the approved positioning.

- [ ] **Step 2: Create the public resume source**

Build a two-page A4, single-column resume using only verified repository facts and functional employer descriptions. Do not include prohibited names, a photo, icons, gradients or skill bars.

- [ ] **Step 3: Generate and inspect the PDF**

Generate selectable text at `public/assets/Resume_Sajeevan_Veeriah.pdf`. Inspect both pages for clipping, overlap, page count, links, reading order and prohibited names.

- [ ] **Step 4: Verify the protected URL and file content**

Run:

```bash
pdfinfo public/assets/Resume_Sajeevan_Veeriah.pdf
pdftotext public/assets/Resume_Sajeevan_Veeriah.pdf - | rg --pcre2 -n "Ford|Ford Motor Company|Invenio|JAG Process Solutions|\\x{2013}|\\x{2014}"
```

Expected: exactly two A4 pages and no matches.

- [ ] **Step 5: Reconcile README**

Describe the concise recruiter-first product, static architecture and current validation commands without Atlas-era counts.

### Task 6: Complete regression, accessibility and release-readiness verification

**Files:**
- Modify if defects are found: affected files from Tasks 1 to 5.
- Do not create unrequested audit or handover files.

**Interfaces:**
- Consumes: the complete redesigned worktree.
- Produces: fresh terminal and rendered evidence for release readiness.

- [ ] **Step 1: Run all static gates**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

- [ ] **Step 2: Run full browser and Axe QA**

Run `npm run qa:browser` at 320, 390, 768, 1440 and 1920 px in required theme and reduced-motion states.

- [ ] **Step 3: Run Lighthouse**

Run `npm run qa:lighthouse` for the homepage, work index and all three record routes.

- [ ] **Step 4: Inspect rendered states manually**

Inspect desktop and mobile screenshots, light/dark themes, 200 percent zoom, keyboard focus, no-JavaScript content, reduced motion, 404 and representative redirects. Verify no clipping, overlap, unreadable text, broken images or hidden content.

- [ ] **Step 5: Audit runtime requests and console output**

Confirm no third-party runtime requests, console errors or hydration errors.

- [ ] **Step 6: Run final content and repository scans**

Run:

```bash
rg --pcre2 -n "Ford|Ford Motor Company|Invenio|JAG Process Solutions|\\x{2013}|\\x{2014}" src public README.md
git status --short
git diff --check
git diff --stat
git diff
```

- [ ] **Step 7: Repair and rerun affected gates**

For each defect, make the smallest scoped correction and rerun the original failing check plus the final static gates.

- [ ] **Step 8: Stop at the release boundary**

Present the verified files, checks and residual risks. Do not commit, push, merge or deploy until Saj grants current target-specific approval for those exact actions.
