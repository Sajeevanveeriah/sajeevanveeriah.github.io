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
On 26 October 2026 Saj asked to add his incoming Farm Frites Australia role
(IT/OT and Systems Engineer, Dooen). Its scope follows the position
description. Saj confirmed on 29 October 2026 that this is his current role.
Do not infer undisclosed technology, client details, metrics,
certification or outcomes. Project evidence boundaries are part of the claim.

The /services/ page offers six service areas: robotics and autonomy,
mechatronic design and prototypes, embedded electronics, automation and
controls, AI/ML, vision and data, and software, test and validation, plus a
"Not listed?" line for other domains. Each area links to work already on the
site: a case-study record with its evidence stage, or a project-index entry
through the catalogue search. Saj set the pricing on 21 October 2026: A$140 per hour and a
A$1,400 fixed Define phase fee per system or prototype, amounts excluding GST,
invoiced by Sajeevan Veeriah, sole trader, ABN 17 630 081 594. Change these
figures only on his instruction. No business name is registered for Voltwyn
yet, so invoices name him, not Voltwyn. Clients stay unnamed there as
everywhere else, including the clients of former employers.

Keep the site static-first. No runtime data fetching, database,
authentication, analytics, tracking or third-party runtime requests from the
browser. The one exception is the contact relay: on 23 October 2026 Saj asked
for the contact form to work without exposing his email address, so the `sv`
Worker (worker/index.ts) answers POST /api/contact and relays the message
through Resend. The inbox address and API key live only in Worker secrets
(RESEND_API_KEY, CONTACT_TO, CONTACT_FROM); never put them in the repository,
the page or the bundle. Every other path is served as static assets. Do not add
further API routes unless a later verified requirement changes the system
boundary.

The visual system follows the Voltwyn palette: Night Navy #0F1E33 and Volt
Amber #F5B700. Amber is a fill paired with navy text; it is never small text on
a light surface. Keep the monogram and lockup unchanged.

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
