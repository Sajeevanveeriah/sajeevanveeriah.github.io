import type { EvidenceTier } from '../tiers'

/**
 * The engineering ecosystem schema.
 *
 * This layer answers a different question from the rest of `src/content/`.
 * Everything else on this site describes what Saj has done. This describes
 * the field he works in: a broad, declared-scope sweep of the tools,
 * hardware, protocols, standards and methods that make up mechatronics,
 * robotics, controls, embedded, AI/ML and industrial automation.
 *
 * The two must never be confused, so the separation is enforced by the type
 * system rather than by convention:
 *
 *   - `coverageKind: 'ecosystem-reference'` is a neutral catalogue entry. It
 *     is a fact about the field, not a claim about Saj. It carries no
 *     evidence tier and can never render as a personal usage or expertise
 *     claim (e.g. "Sajeevan uses" or "his expertise").
 *   - `coverageKind: 'profile'` additionally carries a `profile` block, and
 *     that block is the only place an evidence tier may appear.
 *
 * The relationship is orthogonal to the entity: a profile is a statement
 * about the person-to-entity edge, not a property of the tool. Membership of
 * a domain Saj has delivered in never promotes a tool inside that domain,
 * because domain-level evidence does not cascade. See `validate.ts`, which
 * fails the build on any entry that breaks these rules.
 */

/**
 * Whether an entry is a neutral catalogue reference or additionally carries
 * a personal relationship. New catalogue entries default to
 * `ecosystem-reference`; nothing is ever defaulted to a tier.
 */
export type CoverageKind = 'profile' | 'ecosystem-reference'

/**
 * Where a thing sits in its own life, as published by whoever owns it.
 *
 * `unknown` is a first-class, honest answer and the required fallback: if
 * current status cannot be confirmed against a primary source, the entry
 * says `unknown` and the copy stays neutral rather than guessing.
 */
export type Lifecycle =
  | 'current'
  | 'maintained'
  | 'preview'
  | 'research'
  | 'legacy'
  | 'deprecated'
  | 'discontinued'
  | 'retired'
  | 'unknown'

export const LIFECYCLE_LABEL: Record<Lifecycle, string> = {
  current: 'Current',
  maintained: 'Maintained',
  preview: 'Preview',
  research: 'Research',
  legacy: 'Legacy',
  deprecated: 'Deprecated',
  discontinued: 'Discontinued',
  retired: 'Retired',
  unknown: 'Status not verified',
}

/**
 * One-line definitions, rendered as the lifecycle legend. Written so a
 * reader can tell a maintained release from a research artefact without
 * having to infer it from a colour.
 */
export const LIFECYCLE_DEFINITION: Record<Lifecycle, string> = {
  current: 'Actively sold or released, and the generation the owner leads with.',
  maintained: 'Still supported and receiving updates, though not the newest generation.',
  preview: 'Announced, in beta, or shipping to early access rather than general availability.',
  research: 'A research artefact or reference model, not a supported product.',
  legacy: 'Superseded by a newer generation but still in service and documented.',
  deprecated: 'Formally marked for removal, with migration guidance published.',
  discontinued: 'No longer manufactured or sold.',
  retired: 'Shut down or withdrawn, with the service no longer operating.',
  unknown: 'Current status not verified against a primary source at the review date.',
}

/** Ordering for legends and grouped views: living things first. */
export const LIFECYCLE_ORDER: readonly Lifecycle[] = [
  'current',
  'maintained',
  'preview',
  'research',
  'legacy',
  'deprecated',
  'discontinued',
  'retired',
  'unknown',
] as const

/**
 * What kind of thing an entry is. Deliberately finer than "tool", because a
 * board, a bus specification and a published standard behave nothing alike
 * and should not filter as one category.
 */
export type EntityKind =
  | 'hardware-family'
  | 'hardware-model'
  | 'component'
  | 'material'
  | 'software'
  | 'framework'
  | 'library'
  | 'language'
  | 'os'
  | 'rtos'
  | 'protocol'
  | 'standard'
  | 'algorithm'
  | 'method'
  | 'test-equipment'
  | 'cloud-service'
  | 'data-platform'
  | 'vendor-platform'

export const KIND_LABEL: Record<EntityKind, string> = {
  'hardware-family': 'Hardware family',
  'hardware-model': 'Hardware model',
  component: 'Component',
  material: 'Material',
  software: 'Software',
  framework: 'Framework',
  library: 'Library',
  language: 'Language',
  os: 'Operating system',
  rtos: 'RTOS',
  protocol: 'Protocol or interface',
  standard: 'Standard or regulation',
  algorithm: 'Algorithm',
  method: 'Engineering method',
  'test-equipment': 'Test and measurement',
  'cloud-service': 'Cloud service',
  'data-platform': 'Data or MLOps platform',
  'vendor-platform': 'Vendor platform',
}

export const KIND_ORDER: readonly EntityKind[] = [
  'hardware-family',
  'hardware-model',
  'component',
  'material',
  'test-equipment',
  'language',
  'os',
  'rtos',
  'software',
  'framework',
  'library',
  'protocol',
  'standard',
  'algorithm',
  'method',
  'cloud-service',
  'data-platform',
  'vendor-platform',
] as const

/**
 * A citable source. Every `current`, `preview` or `maintained` claim must
 * point at one of these, and every record carries the date it was read, so a
 * lifecycle statement can always be re-checked against what was actually
 * seen rather than against memory.
 */
export interface SourceRecord {
  readonly id: string
  readonly title: string
  readonly url: string
  readonly sourceType: 'official' | 'standards-body' | 'repository' | 'portfolio-evidence' | 'secondary'
  /** ISO date the source was read. */
  readonly reviewedAt: string
}

/**
 * A named model, generation or variant inside a family.
 *
 * Model-level detail lives here rather than as a top-level entity, so the
 * catalogue keeps every specific board the scope names without turning the
 * page into hundreds of near-identical cards.
 */
export interface EntityModel {
  readonly name: string
  readonly aliases?: readonly string[]
  readonly lifecycle: Lifecycle
  /** ISO date the lifecycle above was checked. */
  readonly lifecycleAsOf?: string
  readonly note?: string
}

/**
 * The person-to-entity relationship. Present only where Saj has explicitly
 * assigned it.
 *
 * `assignedBySaj` is a literal `true` rather than a boolean so that no entry
 * can be authored with the flag turned off and still typecheck: the only
 * legal value is the affirmative one, which makes an unassigned profile a
 * compile error instead of a silent falsehood.
 */
export interface EntityProfile {
  readonly evidenceTier: EvidenceTier
  /** Routes or records that carry the evidence. Never empty. */
  readonly evidenceRefs: readonly string[]
  /** The honest limit of the claim, as stated by Saj. */
  readonly scopeNote: string
  readonly assignedBySaj: true
}

export interface EcosystemEntity {
  readonly id: string
  readonly slug: string
  readonly name: string
  /** Former names, vendor spellings and the way the scope list wrote it. */
  readonly aliases: readonly string[]
  readonly kind: EntityKind
  readonly vendorOrOwner?: string
  /** Parent family, where this entry is a member of one. */
  readonly familyId?: string
  readonly pillarIds: readonly string[]
  readonly domainIds: readonly string[]
  readonly categoryIds: readonly string[]
  readonly summary: string
  readonly useCases: readonly string[]
  readonly lifecycle: Lifecycle
  /** ISO date the lifecycle was checked against a source. */
  readonly lifecycleAsOf?: string
  readonly successorIds?: readonly string[]
  readonly officialSourceIds: readonly string[]
  readonly coverageKind: CoverageKind
  readonly profile?: EntityProfile
  readonly models?: readonly EntityModel[]
  readonly keywords: readonly string[]
}

/**
 * One supplied term, and what it resolved to.
 *
 * This is the completeness contract. Every term in the supplied scope gets a
 * row, including the ones that turned out to be duplicates, former names or
 * corrections, so coverage is a derived number rather than an assertion.
 */
export interface ScopeMapping {
  /** Exactly as supplied, including the original spelling. */
  readonly suppliedTerm: string
  readonly canonicalEntityId: string
  readonly resolution:
    | 'canonical'
    | 'alias'
    | 'model'
    | 'former-name'
    | 'lifecycle-note'
    | 'correction'
  /** Why the term resolved this way, where that is not self-evident. */
  readonly note?: string
}

export interface EcosystemDomain {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly pillarId: string
  readonly summary: string
  /** Position in the mandated 1 to 31 ordering; the baseline uses 0. */
  readonly order: number
}

export interface EcosystemPillar {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly shortName: string
  readonly summary: string
  /** What this pillar contributes to a working system, in one line. */
  readonly purpose: string
  readonly order: number
}

/** The classification axis required across the whole catalogue. */
export interface EcosystemCategory {
  readonly id: string
  readonly name: string
}
