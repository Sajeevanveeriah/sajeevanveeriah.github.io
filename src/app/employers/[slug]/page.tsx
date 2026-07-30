import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { SourceNote } from '@/components/ui/SourceNote'
import { Reveal } from '@/components/motion/Reveal'
import { publishedEmployers, getEmployer, DISCIPLINES } from '@/content/employers'
import s from '@/components/ui/shared.module.css'
import e from './employer.module.css'

export function generateStaticParams() {
  // Draft employers are absent from `publishedEmployers`, so no route is
  // emitted for them at all.
  return publishedEmployers.map((x) => ({ slug: x.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const x = getEmployer(slug)
  if (!x) return {}
  const description = x.closing ?? `${x.title ?? 'Role'} at ${x.company}.`
  return {
    title: x.title ? `${x.title}, ${x.company}` : x.company,
    description,
    alternates: { canonical: `/employers/${x.slug}/` },
    openGraph: {
      title: x.title ? `${x.title}, ${x.company}` : x.company,
      description,
      url: `/employers/${x.slug}/`,
    },
  }
}

export default async function EmployerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const x = getEmployer(slug)
  if (!x) notFound()

  // Two axes. Discipline is the visible grouping; every claim keeps the tier
  // the source brief gave it, rendered as a badge on the item itself. The
  // vocabulary order is fixed across all six pages, so a reader comparing
  // employers meets the disciplines in the same sequence every time. A
  // discipline with no claims for this employer renders nothing at all.
  const groups = DISCIPLINES.map((discipline) => ({
    discipline,
    items: x.claims.filter((c) => c.discipline === discipline),
  })).filter((g) => g.items.length > 0)

  return (
    <article className="section">
      <div className="wrap-wide">
        <BackLink href="/employers/">All employers</BackLink>

        <PageHeader
          kicker={x.title ?? x.company}
          title={x.company}
          longTitle
          aside={
            <>
              <div className={s.railBlock}>
                <p className="label">Period</p>
                <p className={s.rowSummary}>
                  {/* No dates are reconstructed where the source supplies none. */}
                  {x.period ?? 'Dates not published'}
                </p>
              </div>
              <div className={s.railBlock}>
                <p className="label">Location</p>
                <p className={s.rowSummary}>{x.location ?? 'Not published'}</p>
              </div>
            </>
          }
        />

        <div className={s.narrative}>
          {x.companyFacts.length ? (
            <Reveal as="section" className={s.chapter} aria-labelledby="the-place">
              <span className={s.chapterIndex}>01</span>
              <h2 id="the-place" className={s.chapterTitle}>
                The place
              </h2>
              <div className={s.chapterBody}>
                <p className={e.factNote}>
                  Verified facts about the employer, not claims about my work. Each carries the
                  primary source it was checked against.
                </p>
                <ul className={e.facts}>
                  {x.companyFacts.map((f, i) => (
                    <li key={i} className={e.fact}>
                      <p className={e.factBody}>{f.body}</p>
                      <p className={e.factSource}>
                        <span className="label">Source</span> {f.source}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}

          <Reveal as="section" className={s.chapter} aria-labelledby="the-work">
            <span className={s.chapterIndex}>{x.companyFacts.length ? '02' : '01'}</span>
            <h2 id="the-work" className={s.chapterTitle}>
              What the title says, and what the work was
            </h2>
            <div className={s.chapterBody}>
              {groups.map((g) => (
                <div key={g.discipline} className={e.tierGroup}>
                  <h3 className={e.disciplineHead}>{g.discipline}</h3>
                  <ul className={e.claims}>
                    {g.items.map((c, i) => (
                      <li key={i} className={e.claim}>
                        <TierIndicator tier={c.tier} className={e.claimTier} />
                        <span className={e.claimBody}>{c.body}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <SourceNote label={x.company} notes={x.todoConfirm} />
          </Reveal>

          {x.closing ? (
            <Reveal as="section" className={s.chapter} aria-labelledby="the-argument">
              <span className={s.chapterIndex}>{x.companyFacts.length ? '03' : '02'}</span>
              <h2 id="the-argument" className={s.chapterTitle}>
                What it bought
              </h2>
              <p className={e.closing}>{x.closing}</p>
            </Reveal>
          ) : null}
        </div>
      </div>
    </article>
  )
}
