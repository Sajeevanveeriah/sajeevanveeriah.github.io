import type {
  EcosystemEntity,
  EcosystemPillar,
  EcosystemDomain,
  EcosystemCategory,
  ScopeMapping,
  SourceRecord,
  Lifecycle,
} from './types'

/**
 * The completeness contract, expressed as executable checks.
 *
 * This is deliberately a pure function over a dataset rather than a script
 * that reads module globals. That shape is what lets the checker prove
 * itself: `scripts/check-ecosystem.mjs` runs it first against deliberately
 * defective in-memory fixtures, confirms each one is caught, and only then
 * runs it against the real catalogue. A validator nobody has seen fail is
 * not evidence of anything.
 */

export interface EcosystemData {
  readonly pillars: readonly EcosystemPillar[]
  readonly domains: readonly EcosystemDomain[]
  readonly categories: readonly EcosystemCategory[]
  readonly entities: readonly EcosystemEntity[]
  readonly sources: readonly SourceRecord[]
  readonly scope: readonly ScopeMapping[]
  readonly requiredTerms: readonly string[]
}

export interface Problem {
  readonly rule: string
  readonly detail: string
}

const LIFECYCLES: readonly Lifecycle[] = [
  'current',
  'maintained',
  'preview',
  'research',
  'legacy',
  'deprecated',
  'discontinued',
  'retired',
  'unknown',
]

/** Lifecycles that assert something is alive now, so they need a dated source. */
const CLAIMS_CURRENCY: readonly Lifecycle[] = ['current', 'maintained', 'preview']

/**
 * Wording that would turn a neutral catalogue entry into a personal claim.
 * Checked against the prose fields of every `ecosystem-reference`, because
 * the separation is only real if the copy respects it too.
 */
const PERSONAL_CLAIM_PATTERNS: readonly RegExp[] = [
  /\bi use\b/i,
  /\bi have used\b/i,
  /\bmy expertise\b/i,
  /\bmy experience with\b/i,
  /\bproficient\b/i,
  /\bexperienced in\b/i,
  /\bi am skilled\b/i,
  /\bmy toolchain\b/i,
  /\bi built\b/i,
  /\bi delivered\b/i,
]

/**
 * Temporal words that age badly. Permitted only where the sentence is
 * anchored by a dated source on the same record.
 */
const UNDATED_TEMPORAL = /\b(latest|newest|most recent|cutting[- ]edge|state of the art)\b/i

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function validateEcosystem(data: EcosystemData): Problem[] {
  const problems: Problem[] = []
  const add = (rule: string, detail: string) => problems.push({ rule, detail })

  const pillarIds = new Set(data.pillars.map((p) => p.id))
  const domainIds = new Set(data.domains.map((d) => d.id))
  const categoryIds = new Set(data.categories.map((c) => c.id))
  const sourceIds = new Set(data.sources.map((s) => s.id))
  const entityIds = new Set(data.entities.map((e) => e.id))

  // ---- Uniqueness -------------------------------------------------------
  const seenId = new Set<string>()
  const seenSlug = new Set<string>()
  for (const e of data.entities) {
    if (seenId.has(e.id)) add('duplicate-id', `Entity id "${e.id}" is used more than once.`)
    seenId.add(e.id)
    if (seenSlug.has(e.slug)) add('duplicate-slug', `Entity slug "${e.slug}" is used more than once.`)
    seenSlug.add(e.slug)
  }
  const seenPillarSlug = new Set<string>()
  for (const p of data.pillars) {
    if (seenPillarSlug.has(p.slug)) add('duplicate-slug', `Pillar slug "${p.slug}" is used more than once.`)
    seenPillarSlug.add(p.slug)
  }
  const seenSourceId = new Set<string>()
  for (const s of data.sources) {
    if (seenSourceId.has(s.id)) add('duplicate-id', `Source id "${s.id}" is used more than once.`)
    seenSourceId.add(s.id)
    if (!ISO_DATE.test(s.reviewedAt)) {
      add('source-review-date', `Source "${s.id}" has a review date that is not ISO yyyy-mm-dd.`)
    }
  }

  // ---- Canonical alias collisions ---------------------------------------
  // Two entities sharing an *alias* is legitimate and useful: "FLIR" should
  // find both the industrial camera range and the thermal imagers, and a
  // reader searching "Mali" is well served by the GPU entry and the Arm core
  // entry alike. Search is allowed to be generous.
  //
  // What is not allowed is an alias that collides with another entity's
  // canonical name, or two entities claiming the same canonical name. That
  // makes the term ambiguous at the point where it has to resolve to exactly
  // one thing: the scope mapping. This checks that narrower, real conflict.
  const canonicalOwner = new Map<string, string>()
  for (const e of data.entities) {
    const key = e.name.trim().toLowerCase()
    const existing = canonicalOwner.get(key)
    if (existing && existing !== e.id) {
      add('conflicting-alias', `Canonical name "${e.name}" is claimed by both "${existing}" and "${e.id}".`)
    }
    canonicalOwner.set(key, e.id)
  }
  for (const e of data.entities) {
    for (const raw of e.aliases) {
      const owner = canonicalOwner.get(raw.trim().toLowerCase())
      if (owner && owner !== e.id) {
        add(
          'conflicting-alias',
          `"${raw}" is an alias on "${e.id}" but the canonical name of "${owner}".`,
        )
      }
    }
  }

  // ---- Referential integrity -------------------------------------------
  for (const d of data.domains) {
    if (!pillarIds.has(d.pillarId)) {
      add('unresolved-pillar', `Domain "${d.id}" points at unknown pillar "${d.pillarId}".`)
    }
  }

  for (const e of data.entities) {
    if (e.pillarIds.length === 0) add('orphan-entity', `Entity "${e.id}" belongs to no pillar.`)
    if (e.domainIds.length === 0) add('orphan-entity', `Entity "${e.id}" belongs to no domain.`)
    if (e.categoryIds.length === 0) add('orphan-entity', `Entity "${e.id}" has no category.`)

    for (const p of e.pillarIds) {
      if (!pillarIds.has(p)) add('unresolved-pillar', `Entity "${e.id}" points at unknown pillar "${p}".`)
    }
    for (const d of e.domainIds) {
      if (!domainIds.has(d)) add('unresolved-domain', `Entity "${e.id}" points at unknown domain "${d}".`)
    }
    for (const c of e.categoryIds) {
      if (!categoryIds.has(c)) add('unresolved-category', `Entity "${e.id}" points at unknown category "${c}".`)
    }
    for (const s of e.officialSourceIds) {
      if (!sourceIds.has(s)) add('unresolved-source', `Entity "${e.id}" cites unknown source "${s}".`)
    }
    for (const s of e.successorIds ?? []) {
      if (!entityIds.has(s)) add('unresolved-successor', `Entity "${e.id}" names unknown successor "${s}".`)
    }
    if (e.familyId && !entityIds.has(e.familyId)) {
      add('unresolved-family', `Entity "${e.id}" names unknown family "${e.familyId}".`)
    }

    // A domain must actually sit under a pillar the entity claims, or the
    // entity will render under a pillar page that does not list its domain.
    for (const domainId of e.domainIds) {
      const domain = data.domains.find((d) => d.id === domainId)
      if (domain && !e.pillarIds.includes(domain.pillarId)) {
        add(
          'pillar-domain-mismatch',
          `Entity "${e.id}" claims domain "${domainId}" but not its pillar "${domain.pillarId}".`,
        )
      }
    }

    // ---- Required prose -------------------------------------------------
    if (!e.summary || e.summary.trim().length < 20) {
      add('empty-summary', `Entity "${e.id}" has no usable summary.`)
    }
    if (!e.name.trim()) add('empty-name', `Entity "${e.id}" has no name.`)

    // ---- Lifecycle ------------------------------------------------------
    if (!LIFECYCLES.includes(e.lifecycle)) {
      add('invalid-lifecycle', `Entity "${e.id}" has invalid lifecycle "${e.lifecycle}".`)
    }
    if (e.lifecycleAsOf && !ISO_DATE.test(e.lifecycleAsOf)) {
      add('invalid-lifecycle-date', `Entity "${e.id}" has a non-ISO lifecycleAsOf.`)
    }
    for (const m of e.models ?? []) {
      if (!LIFECYCLES.includes(m.lifecycle)) {
        add('invalid-lifecycle', `Model "${m.name}" on "${e.id}" has invalid lifecycle "${m.lifecycle}".`)
      }
    }

    // A currency claim needs a dated primary source. `unknown` is the
    // honest alternative and is deliberately exempt.
    if (CLAIMS_CURRENCY.includes(e.lifecycle)) {
      if (e.officialSourceIds.length === 0 && !e.lifecycleAsOf) {
        add(
          'unsourced-currency-claim',
          `Entity "${e.id}" claims "${e.lifecycle}" with neither an official source nor a review date.`,
        )
      }
    }

    // ---- Evidence separation --------------------------------------------
    if (e.coverageKind === 'profile') {
      if (!e.profile) {
        add('profile-without-block', `Entity "${e.id}" is a profile but carries no profile block.`)
      } else {
        if (!e.profile.evidenceTier) {
          add('profile-without-tier', `Entity "${e.id}" has a profile with no Saj-assigned evidence tier.`)
        }
        if (e.profile.evidenceRefs.length === 0) {
          add('tier-without-evidence', `Entity "${e.id}" has a personal tier with no evidence references.`)
        }
        if (!e.profile.scopeNote.trim()) {
          add('profile-without-scope-note', `Entity "${e.id}" has a profile with no scope note.`)
        }
      }
    } else {
      if (e.profile) {
        add(
          'ecosystem-reference-with-profile',
          `Entity "${e.id}" is an ecosystem reference but carries a profile block.`,
        )
      }
      const prose = [e.summary, ...e.useCases].join(' ')
      for (const pattern of PERSONAL_CLAIM_PATTERNS) {
        if (pattern.test(prose)) {
          add(
            'reference-rendered-as-personal-claim',
            `Entity "${e.id}" is an ecosystem reference but its copy reads as a personal claim (matched ${pattern}).`,
          )
        }
      }
    }

    // ---- Undated temporal wording ---------------------------------------
    const temporalProse = [e.summary, ...e.useCases, ...(e.models ?? []).map((m) => m.note ?? '')].join(' ')
    if (UNDATED_TEMPORAL.test(temporalProse) && !e.lifecycleAsOf) {
      add(
        'undated-currency-wording',
        `Entity "${e.id}" uses temporal wording with no dated review on the record.`,
      )
    }

    // ---- Standards need edition and status metadata ----------------------
    if (e.kind === 'standard') {
      const hasEdition = /\b(19|20)\d{2}\b/.test(`${e.name} ${e.summary}`)
      if (!hasEdition) {
        add(
          'standard-without-edition',
          `Standard "${e.id}" states no edition or publication year.`,
        )
      }
      if (!e.vendorOrOwner) {
        add('standard-without-owner', `Standard "${e.id}" names no owning body.`)
      }
      if (e.officialSourceIds.length === 0) {
        add('standard-without-source', `Standard "${e.id}" cites no official source.`)
      }
    }
  }

  // ---- Scope coverage ---------------------------------------------------
  // Exact-spelling comparison, deliberately case-sensitive. The contract is
  // over the original supplied spelling, and the supplied catalogue contains
  // real homonym pairs that differ only in case: "GaN" the wide-bandgap
  // semiconductor against "GAN" the generative adversarial network, and
  // "imc" the measurement vendor against "IMC" the control method. Folding
  // case would merge two genuinely different terms into one row.
  const seenTerm = new Set<string>()
  for (const m of data.scope) {
    const key = m.suppliedTerm.trim()
    if (seenTerm.has(key)) {
      add('duplicate-scope-term', `Supplied term "${m.suppliedTerm}" is mapped more than once.`)
    }
    seenTerm.add(key)
    if (!entityIds.has(m.canonicalEntityId)) {
      add(
        'unresolved-scope-mapping',
        `Supplied term "${m.suppliedTerm}" maps to unknown entity "${m.canonicalEntityId}".`,
      )
    }
  }

  // Every mandatory named item must be findable by the same search the
  // interface uses, not merely present somewhere in the data.
  for (const term of data.requiredTerms) {
    if (!findsTerm(data.entities, term)) {
      add('missing-required-term', `Required term "${term}" is not findable in the catalogue.`)
    }
  }

  return problems
}

/**
 * The search predicate, shared with the interface so a validation pass and
 * a user's search can never disagree about what is findable.
 */
export function matchesQuery(e: EcosystemEntity, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    e.name,
    ...e.aliases,
    e.vendorOrOwner ?? '',
    e.summary,
    ...e.keywords,
    ...(e.models ?? []).flatMap((m) => [m.name, ...(m.aliases ?? [])]),
  ]
    .join('   ')
    .toLowerCase()
  return haystack.includes(q)
}

export function findsTerm(entities: readonly EcosystemEntity[], term: string): boolean {
  return entities.some((e) => matchesQuery(e, term))
}
