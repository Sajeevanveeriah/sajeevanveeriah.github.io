import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { Reveal } from '@/components/motion/Reveal'
import { experience, getRole } from '@/content/experience'
import { getEmployerRecord } from '@/content/employers'
import { getProject } from '@/content/projects'
import s from '@/components/ui/shared.module.css'

/**
 * The former role detail route, kept because its URLs resolve.
 *
 * Employer content is authored once, in `employers.ts`, and rendered once, at
 * `/employers/[slug]/`. Every one of these seven URLs resolved before that
 * reconciliation and every one still resolves, but nothing links here any
 * more: the nav panel, the career spine, the employers index and the work
 * records all point at the employer page directly.
 *
 * Two behaviours, and which one applies is decided by the record, not by a
 * list kept in step by hand:
 *
 *   - A published employer has a page of its own, so this URL renders a short
 *     signpost to it and carries a canonical pointing there. No redirect is
 *     emitted. A static export cannot issue a 301, and a meta refresh would
 *     move a reader who followed an old bookmark before they could see why,
 *     so the page says what happened and gives them the link.
 *   - A suppressed employer has no employer page to point at, so this URL
 *     keeps rendering the full record exactly as it did before, unlinked and
 *     noindexed. Suppression is not deletion.
 */
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

  const employer = getEmployerRecord(role)
  const moved = Boolean(employer && !employer.suppressed)

  return {
    title: `${r.title}, ${r.company}`,
    description: r.summary,
    // A signpost is not the canonical home of this content, so it points at
    // the page that is. A suppressed record has no other home and keeps its
    // own canonical.
    alternates: { canonical: moved ? `/employers/${role}/` : `/about/${r.slug}/` },
    // Neither shape belongs in an index: a signpost has nothing of its own to
    // rank, and a suppressed role is withheld deliberately.
    robots: { index: false, follow: true },
    openGraph: {
      title: `${r.title}, ${r.company}`,
      description: r.summary,
      url: moved ? `/employers/${role}/` : `/about/${r.slug}/`,
    },
  }
}

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const r = getRole(role)
  if (!r) notFound()

  const employer = getEmployerRecord(role)

  if (employer && !employer.suppressed) {
    return (
      <article className="section">
        <div className="wrap-wide">
          <BackLink href="/employers/">All employers</BackLink>

          <PageHeader
            kicker="This page moved"
            title={r.company}
            lede={`The record for this role now lives on the employer page, where the work is graded by evidence tier and the verified facts about the employer are kept separate from the claimed contributions.`}
          >
            <p className={s.rowSummary}>
              <Link href={`/employers/${role}/`} className={s.link}>
                Read the {r.company} record
              </Link>
            </p>
          </PageHeader>
        </div>
      </article>
    )
  }

  // Suppressed records are never advertised from a related-work module.
  const related = r.relatedProjects
    .map(getProject)
    .filter((p) => p !== undefined)
    .filter((p) => !p.suppressed)

  const chapters = [
    // Recast agentless per the owner's 7 August 2026 direction.
    { title: 'What was done', bullets: r.achievements },
    { title: 'Engineering relevance', body: r.relevance },
    { title: 'Transferable capability', body: r.transferable },
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
