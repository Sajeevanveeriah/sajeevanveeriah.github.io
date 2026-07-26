import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { experience, getRole } from '@/content/experience'
import { getProject } from '@/content/projects'
import s from '@/components/ui/shared.module.css'

export function generateStaticParams() {
  return experience.map((r) => ({ role: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>
}): Promise<Metadata> {
  const { role } = await params
  const r = getRole(role)
  if (!r) return {}
  return {
    title: `${r.title}, ${r.company}`,
    description: r.summary,
    alternates: { canonical: `/about/${r.slug}/` },
    openGraph: { title: `${r.title}, ${r.company}`, description: r.summary, url: `/about/${r.slug}/` },
  }
}

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const r = getRole(role)
  if (!r) notFound()

  const related = r.relatedProjects.map(getProject).filter((p) => p !== undefined)

  return (
    <article className="section">
      <div className="wrap">
        <p style={{ marginBottom: 'var(--space-2)' }}>
          <Link href="/about/" className={s.backLink}>
            Back to about
          </Link>
        </p>

        <PageHeader kicker={r.title} title={r.company} lede={r.summary}>
          <div className={s.meta}>
            {r.period ? (
              <span className={s.cat}>{r.period}</span>
            ) : (
              // The previous site carried no dates for this role and none are
              // invented here.
              <span className={s.cat} style={{ color: 'var(--text-faint)' }}>
                Dates not published
              </span>
            )}
            {r.evidenceTiers.map((t) => (
              <TierIndicator key={t} tier={t} />
            ))}
          </div>
        </PageHeader>

        <div className={s.split}>
          <dl className={s.dl}>
            <div>
              <dt className={s.dt}>What I did</dt>
              <dd className={s.dd}>
                <ul style={{ display: 'grid', gap: 'var(--space-1)', paddingLeft: '1.1rem', listStyle: 'square' }}>
                  {r.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className={s.dt}>My engineering relevance</dt>
              <dd className={s.dd}>
                <p>{r.relevance}</p>
              </dd>
            </div>
            <div>
              <dt className={s.dt}>My transferable capability</dt>
              <dd className={s.dd}>
                <p>{r.transferable}</p>
              </dd>
            </div>
          </dl>

          <aside className={s.rail}>
            <div className={s.railBlock}>
              <p className="mono-label">Capability domains</p>
              <ul className={s.chips}>
                {r.domains.map((d) => (
                  <li key={d} className={s.chip}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.railBlock}>
              <p className="mono-label">{r.toolsLabel}</p>
              <ul className={s.chips}>
                {r.tools.map((t) => (
                  <li key={t} className={s.chip}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            {related.length ? (
              <div className={s.railBlock}>
                <p className="mono-label">Related work records</p>
                {related.map((p) => (
                  <Link key={p.slug} href={`/work/${p.slug}/`} className={s.link}>
                    {p.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </article>
  )
}
