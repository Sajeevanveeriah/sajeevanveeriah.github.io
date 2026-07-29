import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { Reveal } from '@/components/motion/Reveal'
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
    openGraph: {
      title: `${r.title}, ${r.company}`,
      description: r.summary,
      url: `/about/${r.slug}/`,
    },
  }
}

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const r = getRole(role)
  if (!r) notFound()

  const related = r.relatedProjects.map(getProject).filter((p) => p !== undefined)

  const chapters = [
    { title: 'What I did', bullets: r.achievements },
    { title: 'My engineering relevance', body: r.relevance },
    { title: 'My transferable capability', body: r.transferable },
  ]

  return (
    <article className="section">
      <div className="wrap-wide">
        <BackLink href="/about/">All roles</BackLink>

        <PageHeader
          kicker={r.title}
          title={r.company}
          lede={r.summary}
          longTitle
          aside={
            <>
              <div className={s.railBlock}>
                <p className="label">Period</p>
                <p className={s.rowSummary}>
                  {/* The previous site carried no dates for this role and none
                      are invented here. */}
                  {r.period ?? 'Dates not published'}
                </p>
              </div>
              <div className={s.railBlock}>
                <p className="label">Evidence</p>
                <div className={s.meta}>
                  {r.evidenceTiers.map((t) => (
                    <TierIndicator key={t} tier={t} />
                  ))}
                </div>
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
                  {c.bullets ? (
                    <ul className={s.bullets}>
                      {c.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{c.body}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <aside className={s.rail} aria-label="Role details">
            <div className={s.railBlock}>
              <p className="label">Capability domains</p>
              <ul className={s.chips}>
                {r.domains.map((d) => (
                  <li key={d} className={s.chip}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.railBlock}>
              <p className="label">{r.toolsLabel}</p>
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
                <p className="label">Related work records</p>
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
