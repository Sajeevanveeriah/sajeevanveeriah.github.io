import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/motion/Reveal'
import { EcosystemExplorer, type ExplorerRow, type FacetOption } from '@/components/ecosystem/EcosystemExplorer'
import {
  entities,
  pillars,
  baselinePillar,
  allPillars,
  domainsInPillar,
  entitiesInPillar,
  counts,
  getPillarById,
  getDomain,
  ecosystemUpdatedAt,
  KIND_LABEL,
  KIND_ORDER,
  LIFECYCLE_LABEL,
  LIFECYCLE_DEFINITION,
  LIFECYCLE_ORDER,
  type EntityKind,
  type Lifecycle,
} from '@/content/ecosystem'
import s from '@/components/ui/shared.module.css'
import e from '@/components/ecosystem/ecosystem.module.css'

const DESCRIPTION =
  'A reference catalogue covering eight engineering pillars, 31 domains, and the hardware, software, protocols, standards and methods within them.'

export const metadata: Metadata = {
  title: 'Ecosystem',
  description: DESCRIPTION,
  alternates: { canonical: '/ecosystem/' },
  openGraph: { title: 'Ecosystem', description: DESCRIPTION, url: '/ecosystem/' },
}

/** Only what search needs travels to the client; detail stays on pillar pages. */
function toRow(entity: (typeof entities)[number]): ExplorerRow | null {
  const pillarId = entity.pillarIds[0]
  if (!pillarId) return null
  const pillar = getPillarById(pillarId)
  if (!pillar) return null

  const haystack = [
    entity.name,
    ...entity.aliases,
    entity.vendorOrOwner ?? '',
    entity.summary,
    ...entity.keywords,
    ...(entity.models ?? []).flatMap((m) => [m.name, ...(m.aliases ?? [])]),
  ]
    .join('   ')
    .toLowerCase()

  return {
    id: entity.id,
    name: entity.name,
    vendor: entity.vendorOrOwner ?? '',
    pillarId: pillar.id,
    pillarSlug: pillar.slug,
    pillarName: pillar.shortName,
    domainNames: entity.domainIds.map((d) => getDomain(d)?.name ?? d).filter(Boolean),
    kind: entity.kind,
    kindLabel: KIND_LABEL[entity.kind],
    lifecycle: entity.lifecycle,
    lifecycleLabel: LIFECYCLE_LABEL[entity.lifecycle],
    slug: entity.slug,
    haystack,
  }
}

export default function EcosystemPage() {
  const rows = entities.map(toRow).filter((r): r is ExplorerRow => r !== null)

  const pillarFacets: readonly FacetOption[] = allPillars.map((p) => ({
    value: p.id,
    label: p.shortName,
  }))

  const usedKinds = new Set(entities.map((x) => x.kind))
  const kindFacets: readonly FacetOption[] = KIND_ORDER.filter((k) => usedKinds.has(k)).map((k) => ({
    value: k,
    label: KIND_LABEL[k as EntityKind],
  }))

  const usedLifecycles = new Set(entities.map((x) => x.lifecycle))
  const lifecycleFacets: readonly FacetOption[] = LIFECYCLE_ORDER.filter((l) =>
    usedLifecycles.has(l),
  ).map((l) => ({ value: l, label: LIFECYCLE_LABEL[l as Lifecycle] }))

  return (
    <>
      <section className="section">
        <div className="wrap-wide">
          <PageHeader
            kicker="Ecosystem"
            title="The field, mapped."
            lede="Explore eight engineering pillars and 31 domains spanning mechatronics, robotics, controls, embedded systems, AI and industrial automation."
            aside={
              <div className={s.railBlock}>
                <p className="label">What this is</p>
                <p className={e.noticeBody}>
                  A reference catalogue of the field, kept separate from{' '}
                  <Link href="/skills/" className={s.link}>
                    Sajeevan&apos;s documented experience
                  </Link>
                  .
                </p>
              </div>
            }
          />

          <Reveal className={e.notice} as="div">
            <p className={e.noticeTitle}>How to read this catalogue.</p>
            <p className={e.noticeBody}>
              Entries describe technologies and methods in the wider engineering field. Sajeevan&apos;s
              own applied experience is documented separately in{' '}
              <Link href="/skills/" className={s.link}>
                Expertise
              </Link>
              ,{' '}
              <Link href="/atlas/" className={s.link}>
                the Atlas
              </Link>{' '}
              and <Link href="/work/" className={s.link}>Work</Link>.
            </p>
            <p className={e.reviewed}>
              Catalogue updated {ecosystemUpdatedAt}; individual source records retain their own review dates.
            </p>
          </Reveal>

          <Reveal as="div">
            <dl className={e.figures}>
            <div className={e.figure}>
              <dt className={e.figureLabel} style={{ order: 2 }}>
                Catalogue entries, each grouping a family and its models
              </dt>
              <dd className={e.figureValue} style={{ order: 1, margin: 0 }}>
                {counts.entities}
              </dd>
            </div>
            <div className={e.figure}>
              <dt className={e.figureLabel} style={{ order: 2 }}>
                Named models, generations and variants inside those families
              </dt>
              <dd className={e.figureValue} style={{ order: 1, margin: 0 }}>
                {counts.models}
              </dd>
            </div>
            <div className={e.figure}>
              <dt className={e.figureLabel} style={{ order: 2 }}>
                Terms in the declared scope, every one resolved to an entry
              </dt>
              <dd className={e.figureValue} style={{ order: 1, margin: 0 }}>
                {counts.suppliedTerms}
              </dd>
            </div>
            <div className={e.figure}>
              <dt className={e.figureLabel} style={{ order: 2 }}>
                Official and standards-body sources behind the status claims
              </dt>
              <dd className={e.figureValue} style={{ order: 1, margin: 0 }}>
                {counts.sources}
              </dd>
            </div>
          </dl>
          </Reveal>
        </div>
      </section>

      <section className="section stage-tint" aria-labelledby="pillars-title">
        <div className="wrap-wide">
          <Reveal>
            <p className="label label-accent">Eight pillars</p>
            <h2 id="pillars-title">How the field divides, from structure through to safety.</h2>
            <p className="lede">
              The order is the order a signal travels: material and structure first, then power and
              transduction, compute, control and perception, learned judgement, the factory, the
              network, and the safety layer that bounds all of it.
            </p>
          </Reveal>

          <div className={e.pillarGrid}>
            {pillars.map((p) => {
              const domains = domainsInPillar(p.id)
              return (
                <Reveal as="article" key={p.id} className={e.pillarCard} variant="lift">
                  <span className={e.pillarIndex}>
                    {String(p.order).padStart(2, '0')}
                  </span>
                  <h3 className={e.pillarName}>
                    <Link href={`/ecosystem/${p.slug}/`}>{p.name}</Link>
                  </h3>
                  <p className={e.pillarSummary}>{p.summary}</p>
                  <ul className={e.pillarDomains}>
                    {domains.map((d) => (
                      <li key={d.id}>{d.name}</li>
                    ))}
                  </ul>
                  <span className={e.pillarCount}>
                    {entitiesInPillar(p.id).length} entries across {domains.length}{' '}
                    {domains.length === 1 ? 'domain' : 'domains'}
                  </span>
                </Reveal>
              )
            })}

            <Reveal as="article" className={e.pillarCard} variant="lift">
              <span className={e.pillarIndex}>BASE</span>
              <h3 className={e.pillarName}>
                <Link href={`/ecosystem/${baselinePillar.slug}/`}>{baselinePillar.name}</Link>
              </h3>
              <p className={e.pillarSummary}>{baselinePillar.summary}</p>
              <span className={e.pillarCount}>
                {entitiesInPillar(baselinePillar.id).length} entries, shared across all eight pillars
              </span>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="browse-title">
        <div className="wrap-wide">
          <Reveal>
            <p className="label label-accent">Every entry</p>
            <h2 id="browse-title">Search the whole catalogue.</h2>
            <p className="lede">
              Search matches canonical names, former names, vendor spellings, model numbers and
              keywords, so an entry is findable by whatever it used to be called. Every result links
              to its full record, with sources and lifecycle detail, on its pillar page.
            </p>
          </Reveal>

          <EcosystemExplorer
            rows={rows}
            pillars={pillarFacets}
            kinds={kindFacets}
            lifecycles={lifecycleFacets}
          />
        </div>
      </section>

      <section className="section stage-tint" aria-labelledby="legend-title">
        <div className="wrap-wide">
          <Reveal>
            <p className="label label-accent">Lifecycle</p>
            <h2 id="legend-title">What each status means.</h2>
            <p className="lede">
              Status is stated in words, never by colour alone. Where a status could not be
              confirmed against a primary source it says so, rather than guessing.
            </p>
          </Reveal>
          <Reveal as="div">
            <dl className={e.legend}>
            {LIFECYCLE_ORDER.map((l) => (
              <div key={l}>
                <dt className={e.legendTerm}>{LIFECYCLE_LABEL[l]}</dt>
                <dd className={e.legendDef}>{LIFECYCLE_DEFINITION[l]}</dd>
              </div>
            ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  )
}
