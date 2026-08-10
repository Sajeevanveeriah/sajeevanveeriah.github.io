import type { EcosystemEntity, EcosystemPillar, EcosystemDomain, Lifecycle, EntityKind, CoverageKind } from './types'
import { allPillars, pillars, domains, categories, BASELINE_PILLAR_ID } from './taxonomy'
import { sources, CATALOGUE_UPDATED_AT } from './sources'
import { computeBoardEntities } from './entities/compute-boards'
import { siliconEntities } from './entities/silicon'
import { hardwareComponentEntities } from './entities/hardware-components'
import { testEquipmentEntities } from './entities/test-equipment'
import { designSoftwareEntities } from './entities/software-design'
import { embeddedSoftwareEntities } from './entities/software-embedded'
import { roboticsSoftwareEntities } from './entities/software-robotics'
import { aiSoftwareEntities } from './entities/software-ai'
import { industrialSoftwareEntities } from './entities/software-industrial'
import { assuranceSoftwareEntities } from './entities/software-assurance'
import { standardsEntities } from './entities/standards'
import { algorithmEntities } from './entities/algorithms'
import { baselineEntities } from './entities/baseline'
import { scopeMappings, suppliedTerms } from './scope'
import { matchesQuery } from './validate'

export * from './types'
export { allPillars, pillars, baselinePillar, domains, categories, BASELINE_PILLAR_ID } from './taxonomy'
export { sources, REVIEWED_AT, CATALOGUE_UPDATED_AT } from './sources'
export { scopeMappings, suppliedTerms } from './scope'
export { matchesQuery, validateEcosystem } from './validate'
export type { EcosystemData, Problem } from './validate'

/**
 * The full catalogue, assembled from the per-area files.
 *
 * Order here is presentation order within a pillar page, so hardware leads
 * and methods trail. Nothing is sorted at render time, which keeps the
 * server output and any client-filtered view in the same sequence.
 */
export const entities: readonly EcosystemEntity[] = [
  ...computeBoardEntities,
  ...siliconEntities,
  ...hardwareComponentEntities,
  ...testEquipmentEntities,
  ...designSoftwareEntities,
  ...embeddedSoftwareEntities,
  ...roboticsSoftwareEntities,
  ...aiSoftwareEntities,
  ...industrialSoftwareEntities,
  ...assuranceSoftwareEntities,
  ...standardsEntities,
  ...algorithmEntities,
  ...baselineEntities,
]

/**
 * The named items the scope requires a reader to be able to find.
 *
 * These are asserted by the validator through the same predicate the
 * interface search uses, so "findable" means findable in the product, not
 * merely present in a data file.
 */
export const REQUIRED_SEARCH_TERMS: readonly string[] = [
  'Raspberry Pi',
  'Arduino',
  'Particle',
  'NVIDIA Jetson',
  'Orange Pi',
  'ODROID',
  'ASUS Tinker Board',
  'Banana Pi',
  'Libre Computer Le Potato',
  'BBC micro:bit',
  'Adafruit Feather',
  'MATLAB',
  'Simulink',
  'ROS 2',
  'FPGA',
  'EtherCAT',
  'OPC UA',
  'ISO 13849',
]

// ---- Lookups ------------------------------------------------------------

const byId = new Map(entities.map((e) => [e.id, e]))
const bySlug = new Map(entities.map((e) => [e.slug, e]))
const pillarBySlug = new Map(allPillars.map((p) => [p.slug, p]))
const pillarById = new Map(allPillars.map((p) => [p.id, p]))
const domainById = new Map(domains.map((d) => [d.id, d]))
const sourceById = new Map(sources.map((s) => [s.id, s]))

export function getEntity(id: string): EcosystemEntity | undefined {
  return byId.get(id)
}
export function getEntityBySlug(slug: string): EcosystemEntity | undefined {
  return bySlug.get(slug)
}
export function getPillar(slug: string): EcosystemPillar | undefined {
  return pillarBySlug.get(slug)
}
export function getPillarById(id: string): EcosystemPillar | undefined {
  return pillarById.get(id)
}
export function getDomain(id: string): EcosystemDomain | undefined {
  return domainById.get(id)
}
export function getSource(id: string) {
  return sourceById.get(id)
}

/** Domains belonging to a pillar, in the mandated 1 to 31 order. */
export function domainsInPillar(pillarId: string): readonly EcosystemDomain[] {
  return domains.filter((d) => d.pillarId === pillarId).sort((a, b) => a.order - b.order)
}

/** Entities that claim a given domain, in catalogue order. */
export function entitiesInDomain(domainId: string): readonly EcosystemEntity[] {
  return entities.filter((e) => e.domainIds.includes(domainId))
}

/** Entities that claim a given pillar, deduplicated across its domains. */
export function entitiesInPillar(pillarId: string): readonly EcosystemEntity[] {
  return entities.filter((e) => e.pillarIds.includes(pillarId))
}

// ---- Derived counts ------------------------------------------------------

function tally<T extends string>(values: readonly T[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const v of values) out[v] = (out[v] ?? 0) + 1
  return out
}

export const counts = {
  entities: entities.length,
  pillars: pillars.length,
  domains: domains.filter((d) => d.pillarId !== BASELINE_PILLAR_ID).length,
  sources: sources.length,
  suppliedTerms: suppliedTerms.length,
  scopeMappings: scopeMappings.length,
  /** Model, generation and variant rows carried inside families. */
  models: entities.reduce((n, e) => n + (e.models?.length ?? 0), 0),
  /** Every distinct string the search will match a name or alias on. */
  searchableNames: entities.reduce(
    (n, e) => n + 1 + e.aliases.length + (e.models?.flatMap((m) => [m.name, ...(m.aliases ?? [])]).length ?? 0),
    0,
  ),
  byLifecycle: tally(entities.map((e) => e.lifecycle as Lifecycle)),
  byKind: tally(entities.map((e) => e.kind as EntityKind)),
  byCoverageKind: tally(entities.map((e) => e.coverageKind as CoverageKind)),
  byPillar: Object.fromEntries(allPillars.map((p) => [p.id, entitiesInPillar(p.id).length])),
  byDomain: Object.fromEntries(domains.map((d) => [d.id, entitiesInDomain(d.id).length])),
} as const

/**
 * Ecosystem entries are never person claims, so nothing here may reach the
 * Person JSON-LD, a resume statement or a personal skill total. This is the
 * single exported list of entries that carry a Saj-assigned relationship,
 * and it is currently empty by design: the catalogue was authored as a
 * field sweep, and every personal tier on this site continues to live in
 * `skills.ts`, `atlas.ts`, `employers.ts` and `projects.ts` where Saj set it.
 */
export const profiledEntities: readonly EcosystemEntity[] = entities.filter(
  (e) => e.coverageKind === 'profile',
)

/** The dataset shape the validator consumes. */
export const ecosystemData = {
  pillars: allPillars,
  domains,
  categories,
  entities,
  sources,
  scope: scopeMappings,
  requiredTerms: REQUIRED_SEARCH_TERMS,
} as const

/** Search over canonical names, aliases, models, vendor, summary and keywords. */
export function searchEntities(query: string, pool: readonly EcosystemEntity[] = entities) {
  return pool.filter((e) => matchesQuery(e, query))
}

export { CATALOGUE_UPDATED_AT as ecosystemUpdatedAt }
