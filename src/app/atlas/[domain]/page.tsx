import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { atlas, getDomain, CLUSTER_LABEL, CONTEXT_LABEL } from '@/content/atlas'
import { systemsStack } from '@/content/systemsStack'
import { getProject } from '@/content/projects'
import s from '@/components/ui/shared.module.css'

export function generateStaticParams() {
  return atlas.map((d) => ({ domain: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>
}): Promise<Metadata> {
  const { domain } = await params
  const d = getDomain(domain)
  if (!d) return {}
  return {
    title: d.name,
    description: d.summary,
    alternates: { canonical: `/atlas/${d.slug}/` },
    openGraph: { title: d.name, description: d.summary, url: `/atlas/${d.slug}/` },
  }
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params
  const d = getDomain(domain)
  if (!d) notFound()

  const layers = systemsStack.filter((l) => l.cluster === d.cluster)
  const related = d.relatedProjects.map(getProject).filter((p) => p !== undefined)

  // Tier drives field emphasis: strong evidence leads with proof, growth
  // targets lead where the tier is aspirational.
  const proofFirst = d.evidenceTier === 'delivered' || d.evidenceTier === 'hands-on'
  const targetLed = d.evidenceTier === 'target'

  const proofBlocks = [
    ['My project proof', d.projectProof],
    ['My experience proof', d.experienceProof],
  ] as const
  const logicBlock = ['My transferable logic', d.transferableLogic] as const

  const ordered: readonly (readonly [string, string])[] = targetLed
    ? [logicBlock, ...proofBlocks]
    : proofFirst
      ? [...proofBlocks, logicBlock]
      : [logicBlock, ...proofBlocks]

  return (
    <article className="section">
      <div className="wrap">
        <p style={{ marginBottom: 'var(--space-2)' }}>
          <Link href="/atlas/" className={s.backLink}>
            Back to the atlas
          </Link>
        </p>

        <PageHeader kicker={CLUSTER_LABEL[d.cluster]} title={d.name} lede={d.summary}>
          <div className={s.meta}>
            <TierIndicator tier={d.evidenceTier} />
            {d.contexts.map((c) => (
              <span key={c} className={s.cat}>
                {CONTEXT_LABEL[c]}
              </span>
            ))}
          </div>
        </PageHeader>

        <div className={s.split}>
          <dl className={s.dl}>
            {targetLed ? (
              <div>
                <dt className={s.dt}>My growth targets</dt>
                <dd className={s.dd}>
                  <ul className={s.chips}>
                    {d.growthTargets.map((g) => (
                      <li key={g} className={s.chip}>
                        {g}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}

            {ordered.map(([label, value]) => (
              <div key={label}>
                <dt className={s.dt}>{label}</dt>
                <dd className={s.dd}>
                  <p>{value}</p>
                </dd>
              </div>
            ))}

            {!targetLed ? (
              <div>
                <dt className={s.dt}>My growth targets</dt>
                <dd className={s.dd}>
                  <ul className={s.chips}>
                    {d.growthTargets.map((g) => (
                      <li key={g} className={s.chip}>
                        {g}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>

          <aside className={s.rail}>
            <div className={s.railBlock}>
              <p className="mono-label">Subdomains</p>
              <ul className={s.chips}>
                {d.subdomains.map((x) => (
                  <li key={x} className={s.chip}>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.railBlock}>
              <p className="mono-label">Tools and software</p>
              <ul className={s.chips}>
                {d.platforms.map((x) => (
                  <li key={x} className={s.chip}>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            {d.protocols?.length ? (
              <div className={s.railBlock}>
                <p className="mono-label">Protocols</p>
                <ul className={s.chips}>
                  {d.protocols.map((x) => (
                    <li key={x} className={s.chip}>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {related.length ? (
              <div className={s.railBlock}>
                <p className="mono-label">Related work</p>
                {related.map((p) => (
                  <Link key={p.slug} href={`/work/${p.slug}/`} className={s.link}>
                    {p.title}
                  </Link>
                ))}
              </div>
            ) : null}
            {layers.length ? (
              <div className={s.railBlock}>
                <p className="mono-label">Systems layers</p>
                <Link href="/skills/" className={s.link}>
                  {layers.map((l) => l.name).join(', ')}
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </article>
  )
}
