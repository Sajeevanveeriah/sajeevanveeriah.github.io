import type { EvidenceTier } from './tiers'
import { TIERS, TIER_ORDER } from './tiers'
import { employers, type Employer } from './employers'

/**
 * Career record, derived. This file authors nothing.
 *
 * It used to carry its own copy of the same seven roles that
 * `employers.ts` describes, and the two copies had drifted: the copy here
 * was the thin one, and it was the only one a visitor could reach, so the
 * rich layer was never read. Everything this file used to author was
 * migrated into `employers.ts`, which is now the single source of truth.
 * What survives here is the `Role` shape and the projection onto it, so the
 * career spine, the nav panel, the sitemap and the work records keep
 * consuming the same interface they always did.
 *
 * Binding rules carried over from AGENTS.md, all now enforced upstream in
 * `employers.ts`:
 *   - Ford appears only as "Ford Motor Company via Invenio contract
 *     placement", never as direct Ford employment.
 *   - JAG Process Solutions is Jan 2026 to Jun 2026. No role uses "Present".
 *   - The previous site carried no dates for IDL, Carbon Revolution or
 *     Thornton Engineering. They stay null rather than being reconstructed.
 *   - No locations, ever. `Employer.location` is deliberately not projected.
 */

export interface Role {
  readonly slug: string
  readonly company: string
  readonly title: string
  /** null where the previous site carried no date range. */
  readonly period: string | null
  readonly summary: string
  readonly domains: readonly string[]
  readonly tools: readonly string[]
  /** Label used above the tools line: "Representative tools" or context. */
  readonly toolsLabel: string
  readonly achievements: readonly string[]
  readonly relevance: string
  readonly transferable: string
  readonly evidenceTiers: readonly EvidenceTier[]
  readonly group: 'recent' | 'foundation'
  /**
   * Withheld from every discovery surface: nav panels, the career spine and
   * the sitemap. The route still builds and resolves at its original URL,
   * deliberately, and the page carries `noindex`. Suppression is not
   * deletion: the role stays in the record and no history is rewritten.
   */
  readonly suppressed?: true
  /** Work records covering the same employer. */
  readonly relatedProjects: readonly string[]
}

export const experienceGroups = {
  recent: {
    period: 'Feb 2024 to Jun 2026',
    kicker: 'Automation, validation, compliance and IoT',
    heading: 'Recent engineering roles',
  },
  foundation: {
    // Resume Rev09 dates the foundation block "2018 - 2024" and this already
    // matched, so it is left alone.
    period: '2018 to 2024',
    kicker: 'Manufacturing, QA and the production floor',
    heading: 'Foundation: manufacturing, quality and production',
  },
} as const

/**
 * Spine order, stated rather than inherited.
 *
 * `employers.ts` is ordered for the employers index, which runs most recent
 * first inside each band and puts Thornton before Carbon Revolution. The
 * career spine has always shown the foundation years in the opposite order.
 * Pinning the order here keeps the About page identical to what it rendered
 * before the two layers were reconciled, instead of silently reordering a
 * page nobody asked to change. A slug missing from this list still appears,
 * appended in `employers.ts` order, so adding an employer cannot drop it.
 */
const SPINE_ORDER: readonly string[] = [
  'jag-process-solutions',
  'ford-via-invenio',
  'abmarc',
  'duxtel',
  'idl',
  'carbon-revolution',
  'thornton-engineering',
]

/** Strongest evidence first, so a claim list reads down from its best proof. */
function byStrength(a: EvidenceTier, b: EvidenceTier): number {
  return TIERS[b].strength - TIERS[a].strength
}

/**
 * The two strongest distinct tiers an employer's claims actually carry.
 *
 * The retired file assigned this by hand and was inconsistent about it: some
 * roles carried one badge, some two, and IDL carried Delivered without a
 * single delivered claim beneath it. Deriving it means the badge can never
 * again outrun the evidence on the page. Two is the cap because the spine
 * row has room for a period and a couple of indicators, not for five.
 */
function tiersFor(e: Employer): readonly EvidenceTier[] {
  const present = new Set(e.claims.map((c) => c.tier))
  return TIER_ORDER.filter((t) => present.has(t)).slice(0, 2)
}

function toRole(e: Employer): Role {
  return {
    slug: e.slug,
    company: e.company,
    // Every employer in the record has a title. The `Employer.title` field is
    // nullable for the employers page, which prints "Title not published"
    // rather than inventing one, so the fallback is spelled out here too.
    title: e.title ?? 'Title not published',
    period: e.period,
    summary: e.summary,
    domains: e.domains,
    tools: e.tools,
    toolsLabel: e.toolsLabel,
    achievements: [...e.claims].sort((a, b) => byStrength(a.tier, b.tier)).map((c) => c.body),
    relevance: e.relevance,
    transferable: e.transferable,
    evidenceTiers: tiersFor(e),
    group: e.group,
    ...(e.suppressed ? { suppressed: e.suppressed } : {}),
    relatedProjects: e.relatedProjects,
  }
}

export const experience: readonly Role[] = [...employers]
  .sort((a, b) => {
    const ia = SPINE_ORDER.indexOf(a.slug)
    const ib = SPINE_ORDER.indexOf(b.slug)
    // An unlisted slug sorts after every listed one rather than to the front.
    return (ia === -1 ? SPINE_ORDER.length : ia) - (ib === -1 ? SPINE_ORDER.length : ib)
  })
  .map(toRole)

/**
 * What may be advertised. Suppressed roles still build and still resolve at
 * their own URL; they are simply never linked or listed. Every discovery
 * surface reads this list, never `experience`.
 */
export const discoverableExperience: readonly Role[] = experience.filter((r) => !r.suppressed)

export function getRole(slug: string): Role | undefined {
  return experience.find((r) => r.slug === slug)
}
