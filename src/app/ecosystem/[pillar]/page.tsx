import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/motion/Reveal'
import {
  allPillars,
  getPillar,
  domainsInPillar,
  entitiesInDomain,
  entitiesInPillar,
  getSource,
  ecosystemReviewedAt,
  KIND_LABEL,
  LIFECYCLE_LABEL,
  type EcosystemEntity,
} from '@/content/ecosystem'
import s from '@/components/ui/shared.module.css'
import e from '@/components/ecosystem/ecosystem.module.css'

export function generateStaticParams() {
  return allPillars.map((p) => ({ pillar: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>
}): Promise<Metadata> {
  const { pillar } = await params
  const p = getPillar(pillar)
  if (!p) return {}
  const description = `${p.summary} Part of the engineering ecosystem reference catalogue.`
  return {
    title: p.name,
    description,
    alternates: { canonical: `/ecosystem/${p.slug}/` },
    openGraph: { title: p.name, description, url: `/ecosystem/${p.slug}/` },
  }
}

export default async function PillarPage({ params }: { params: Promise<{ pillar: string }> }) {
  const { pillar } = await params
  const p = getPillar(pillar)
  if (!p) notFound()

  const domains = domainsInPillar(p.id)
  const total = entitiesInPillar(p.id).length
  const others = allPillars.filter((x) => x.id !== p.id)

  return (
    <article className="section">
      <div className="wrap-wide">
        <BackLink href="/ecosystem/">Full ecosystem</BackLink>

        <PageHeader
          kicker="Ecosystem pillar"
          title={p.name}
          lede={p.summary}
          longTitle
          aside={
            <>
              <div className={s.railBlock}>
                <p className="label">In the pipeline</p>
                <p className={e.noticeBody}>{p.purpose}</p>
              </div>
              <div className={s.railBlock}>
                <p className="label">Scale</p>
                <p className={e.noticeBody}>
                  {total} {total === 1 ? 'entry' : 'entries'} across {domains.length}{' '}
                  {domains.length === 1 ? 'domain' : 'domains'}.
                </p>
              </div>
              <div className={s.railBlock}>
                <p className="label">Reviewed</p>
                <p className={e.noticeBody}>{ecosystemReviewedAt}</p>
              </div>
            </>
          }
        />

        <aside className={e.notice}>
          <p className={e.noticeTitle}>About this reference</p>
          <p className={e.noticeBody}>
            These entries describe the wider engineering field. My applied experience is documented
            separately in <Link href="/skills/" className={s.link}>Expertise</Link> and{' '}
            <Link href="/work/" className={s.link}>Work</Link>.
          </p>
        </aside>

        {domains.map((d) => {
          const records = entitiesInDomain(d.id)
          if (records.length === 0) return null
          return (
            <section key={d.id} id={d.slug} className={e.domainBlock} aria-labelledby={`h-${d.id}`}>
              <div className={e.domainHead}>
                <h2 id={`h-${d.id}`} className={e.domainName}>
                  {d.name}
                </h2>
                <p className={e.domainSummary}>{d.summary}</p>
              </div>
              <div className={e.records}>
                {records.map((entity) => (
                  <EntityRecord key={entity.id} entity={entity} />
                ))}
              </div>
            </section>
          )
        })}

        <Reveal as="div" className={e.domainBlock}>
          <nav aria-label="Other ecosystem pillars">
          <p className="label label-accent">Continue</p>
          <ul className={e.pillarNav}>
            {others.map((x) => (
              <li key={x.id}>
                <Link href={`/ecosystem/${x.slug}/`}>{x.shortName}</Link>
              </li>
            ))}
          </ul>
          </nav>
        </Reveal>
      </div>
    </article>
  )
}

/**
 * One catalogue record.
 *
 * The anchor is the entity slug, which is what the index links to, so a
 * search result lands on the record itself rather than the top of the page.
 * Model history and sources sit inside `<details>`: native disclosure, so
 * the content is present and reachable with JavaScript disabled, and the
 * page is not a wall of tables on first paint.
 */
function EntityRecord({ entity }: { entity: EcosystemEntity }) {
  const sources = entity.officialSourceIds.map(getSource).filter((x) => x !== undefined)
  const models = entity.models ?? []
  const aliases = entity.aliases.filter((a) => a.toLowerCase() !== entity.name.toLowerCase())

  return (
    <article id={entity.slug} className={e.record}>
      <div className={e.recordHead}>
        <h3 className={e.recordName}>{entity.name}</h3>
        <ul className={e.recordTags}>
          <li className={e.tag}>{KIND_LABEL[entity.kind]}</li>
          <li className={`${e.tag} ${e.tagLifecycle}`}>{LIFECYCLE_LABEL[entity.lifecycle]}</li>
        </ul>
      </div>

      {entity.vendorOrOwner ? <p className={e.recordVendor}>{entity.vendorOrOwner}</p> : null}

      <p className={e.recordSummary}>{entity.summary}</p>

      {entity.useCases.length ? (
        <ul className={e.recordUseCases}>
          {entity.useCases.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      ) : null}

      {aliases.length ? (
        <p className={e.aliasLine}>
          <span className="label">Also known as</span> {aliases.join(', ')}
        </p>
      ) : null}

      {models.length ? (
        <details className={e.disclosure}>
          <summary>
            {models.length} {models.length === 1 ? 'model and generation' : 'models and generations'}
          </summary>
          <div className={e.tableScroll}>
            <table className={e.modelTable}>
              <caption>
                Named models, generations and variants, each with the status recorded for it and the
                date that status was checked.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Status</th>
                  <th scope="col">Notes</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.name}>
                    <th scope="row">
                      {m.name}
                      {m.aliases?.length ? (
                        <span className={e.sourceType}>({m.aliases.join(', ')})</span>
                      ) : null}
                    </th>
                    <td>
                      {LIFECYCLE_LABEL[m.lifecycle]}
                      {m.lifecycleAsOf ? (
                        <span className={e.sourceType}>as at {m.lifecycleAsOf}</span>
                      ) : null}
                    </td>
                    <td>{m.note ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}

      {sources.length ? (
        <details className={e.disclosure}>
          <summary>
            {sources.length} {sources.length === 1 ? 'source' : 'sources'}
          </summary>
          <ul className={e.sourceList}>
            {sources.map((src) => (
              <li key={src.id}>
                <a href={src.url} rel="noopener noreferrer nofollow" target="_blank">
                  {src.title}
                </a>
                <span className={e.sourceType}>
                  {src.sourceType === 'secondary' ? 'secondary source' : src.sourceType} · read{' '}
                  {src.reviewedAt}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </article>
  )
}
