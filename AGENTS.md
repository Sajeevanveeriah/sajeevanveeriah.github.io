# AGENTS.md

This repository is Sajeevan Veeriah's personal engineering portfolio.

The active product is a deliberately concise static Next.js 15 site. It is
exported with the App Router and deployed to
https://sv.sajeevanveeriah.workers.dev/, the only primary domain. GitHub Pages
(sajeevanveeriah.github.io) is a redirect mirror built by
scripts/build-pages-mirror.mjs. Keep output: 'export', trailingSlash: true,
images.unoptimized: true, public/.nojekyll, public/_headers, the static robots,
sitemap and RSS routes, and the generated 404.html path working.

Merging to main deploys both targets automatically, so a merge is a release.
Route lists for QA, Lighthouse and deployment checks come from the exported
sitemap (scripts/routes.mjs); do not hard-code them again.

The public identity is exactly:

Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer

The home-page information path is:

identity -> integrated systems visual -> featured project -> compact project
band -> complete career timeline and learning pathway -> professional
foundation -> recent journal posts -> contact -> complete project index.

Keep the detailed project index and career timeline in the active product.
Do not recreate the legacy route tree, skills directory or legacy visual
system. The previous implementation was removed from the tree on 15 October
2026; it remains in git history (last changed in commit c814e20).

Saj explicitly approved naming JAG Process Solutions and Ford Motor Company via
Invenio in the public portfolio and resume on 21 September 2026.
Do not infer undisclosed technology, client details, metrics,
certification or outcomes. Project evidence boundaries are part of the claim.

The /services/ page is Voltwyn's single offer. Saj set its pricing on 21 October
2026: A$140 per hour, a A$1,400 fixed Define phase fee per board, amounts
excluding GST, invoiced by Sajeevan Veeriah, sole trader, ABN 17 630 081 594.
Change these figures only on his instruction. No business name is registered
for Voltwyn yet, so invoices name him, not Voltwyn. Clients stay unnamed there
as everywhere else.

Keep the site static-first. No API routes, runtime data fetching, database,
authentication, analytics, tracking or third-party runtime requests. A backend
is not applicable unless a later verified requirement changes the system
boundary.

Use semantic HTML, WCAG 2.2 AA contrast, visible focus, 44px touch targets,
reduced-motion support, responsive reflow from 320px to ultrawide, and no
colour-only meaning. Every engineering visual must have a text equivalent.

Use Australian and UK spelling. Use only ASCII hyphens, never Unicode en or em
dashes. Keep copy factual, concise and in first person where Saj is speaking.

Saj's standing authority (17 October 2026): when a task changes this repository,
commit, push, open the PR, merge once required checks pass, let the deploy run and
verify the live site without asking. The task is complete only when the live
deployment is verified. This does not cover force-pushing, bypassing checks or
branch protection, or changing repository settings or secrets.
