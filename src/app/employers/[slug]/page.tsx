import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { SourceNote } from '@/components/ui/SourceNote'
import { Reveal } from '@/components/motion/Reveal'
import { publishedEmployers, getEmployer } from '@/content/employers'
import { TIER_ORDER, TIERS } from '@/content/tiers'
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

  // Grouped by evidence tier, which is the only grouping the source brief
  // supplies. A discipline grouping would have to be invented, and inventing
  // one would put a claim in a bucket Saj never assigned it to.
  const groups = TIER_ORDER.map((tier) => ({
    tier,
    items: x.claims.filter((c) => c.tier === tier),
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
                <div key={g.tier} className={e.tierGroup}>
                  <div className={e.tierHead}>
                    <TierIndicator tier={g.tier} />
                    <span className={e.tierDef}>{TIERS[g.tier].definition}</span>
                  </div>
                  <ul className={s.bullets}>
                    {g.items.map((c, i) => (
                      <li key={i}>{c.body}</li>
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
