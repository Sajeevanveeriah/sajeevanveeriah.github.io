import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { Reveal } from '@/components/motion/Reveal'
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

  // Tier drives ordering: strong evidence leads with proof, growth targets
  // lead where the tier is aspirational.
  const proofFirst = d.evidenceTier === 'delivered' || d.evidenceTier === 'hands-on'
  const targetLed = d.evidenceTier === 'target'

  const proofBlocks = [
    { title: 'My project proof', body: d.projectProof },
    { title: 'My experience proof', body: d.experienceProof },
  ]
  const logicBlock = { title: 'My transferable logic', body: d.transferableLogic }

  const chapters = (
    targetLed || !proofFirst ? [logicBlock, ...proofBlocks] : [...proofBlocks, logicBlock]
  ).filter((c) => Boolean(c.body))

  return (
    <article className="section">
      <div className="wrap-wide">
        <BackLink href="/atlas/">Full atlas</BackLink>

        <PageHeader
          kicker={CLUSTER_LABEL[d.cluster]}
          title={d.name}
          lede={d.summary}
          longTitle
          aside={
            <>
              <div className={s.railBlock}>
                <p className="label">Evidence</p>
                <TierIndicator tier={d.evidenceTier} />
              </div>
              <div className={s.railBlock}>
                <p className="label">Delivery context</p>
                <ul className={s.chips}>
                  {d.contexts.map((c) => (
                    <li key={c} className={s.chip}>
                      {CONTEXT_LABEL[c]}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          }
        />

        <div className={s.detail}>
          <div className={s.narrative}>
            {chapters.map((c, i) => (
              <Reveal as="section" key={c.title} className={s.chapter}>
                <span className={s.chapterIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h2 className={s.chapterTitle}>{c.title}</h2>
                <div className={s.chapterBody}>
                  <p>{c.body}</p>
                </div>
              </Reveal>
            ))}

            <Reveal as="section" className={s.chapter}>
              <span className={s.chapterIndex}>{String(chapters.length + 1).padStart(2, '0')}</span>
              <h2 className={s.chapterTitle}>My growth targets</h2>
              <div className={s.chapterBody}>
                <ul className={s.bullets}>
                  {d.growthTargets.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <aside className={s.rail} aria-label="Domain details">
            <div className={s.railBlock}>
              <p className="label">Subdomains</p>
              <ul className={s.chips}>
                {d.subdomains.map((x) => (
                  <li key={x} className={s.chip}>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.railBlock}>
              <p className="label">Tools and software</p>
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
                <p className="label">Protocols</p>
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
                <p className="label">Related work</p>
                {related.map((p) => (
                  <Link key={p.slug} href={`/work/${p.slug}/`} className={s.link}>
                    {p.title}
                  </Link>
                ))}
              </div>
            ) : null}
            {layers.length ? (
              <div className={s.railBlock}>
                <p className="label">Systems layers</p>
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
