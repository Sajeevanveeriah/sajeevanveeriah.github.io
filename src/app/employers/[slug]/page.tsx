import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { Reveal } from '@/components/motion/Reveal'
import { publishedEmployers, getEmployer, DISCIPLINES } from '@/content/employers'
import { getProject } from '@/content/projects'
import { TIERS } from '@/content/tiers'
import s from '@/components/ui/shared.module.css'
import e from './employer.module.css'

export function generateStaticParams() {
  // Suppressed employers are absent from `publishedEmployers`, so no route is
  // emitted for them here at all. Their `/about/[slug]/` URL still resolves.
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
  // The summary is the page's own lede, so it is the honest description.
  // `closing` is the argument the page ends on, not a description of it.
  const description = x.summary
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

  // Suppressed records are never advertised from a related-work module.
  const related = x.relatedProjects
    .map(getProject)
    .filter((p) => p !== undefined)
    .filter((p) => !p.suppressed)

  // Two axes. Discipline is the visible grouping; every claim keeps its own
  // tier, rendered as a badge on the item itself. The vocabulary order is
  // fixed across all pages, so a reader comparing employers meets the
  // disciplines in the same sequence every time. A discipline with no claims
  // for this employer renders nothing at all.
  //
  // Within a discipline, claims sort by tier strength, so a group always
  // reads down from its strongest proof. Sorting here rather than trusting
  // authoring order means a claim appended to the content file lands in the
  // right place instead of below a weaker one.
  const groups = DISCIPLINES.map((discipline) => ({
    discipline,
    items: x.claims
      .filter((c) => c.discipline === discipline)
      .slice()
      .sort((a, b) => TIERS[b.tier].strength - TIERS[a.tier].strength),
  })).filter((g) => g.items.length > 0)

  // Chapter numbers are assigned to the chapters that actually render, so an
  // employer with no verified company facts opens at 01 rather than on a gap.
  let chapter = 0
  const nextIndex = () => String(++chapter).padStart(2, '0')

  return (
    <article className="section">
      <div className="wrap-wide">
        <BackLink href="/employers/">All employers</BackLink>

        <PageHeader
          kicker={x.title ?? x.company}
          title={x.company}
          lede={x.summary}
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
            </>
          }
        />

        <div className={s.detail}>
          <div className={s.narrative}>
            {x.companyFacts.length ? (
              <Reveal as="section" className={s.chapter} aria-labelledby="the-place">
                <span className={s.chapterIndex}>{nextIndex()}</span>
                <h2 id="the-place" className={s.chapterTitle}>
                  About the employer
                </h2>
                <div className={s.chapterBody}>
                  <p className={e.factNote}>
                    Company background, checked against the source shown for each item.
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
              <span className={s.chapterIndex}>{nextIndex()}</span>
              {/* Chapter titles recast agentless per the owner's 7 August 2026 direction. */}
              <h2 id="the-work" className={s.chapterTitle}>
                What was done
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
            </Reveal>

            <Reveal as="section" className={s.chapter} aria-labelledby="the-relevance">
              <span className={s.chapterIndex}>{nextIndex()}</span>
              <h2 id="the-relevance" className={s.chapterTitle}>
                Engineering relevance
              </h2>
              <div className={s.chapterBody}>
                <p>{x.relevance}</p>
              </div>
            </Reveal>

            <Reveal as="section" className={s.chapter} aria-labelledby="the-transfer">
              <span className={s.chapterIndex}>{nextIndex()}</span>
              <h2 id="the-transfer" className={s.chapterTitle}>
                What was carried forward
              </h2>
              <div className={s.chapterBody}>
                <p>{x.transferable}</p>
              </div>
            </Reveal>

            {x.closing ? (
              <Reveal as="section" className={s.chapter} aria-labelledby="the-argument">
                <span className={s.chapterIndex}>{nextIndex()}</span>
                <h2 id="the-argument" className={s.chapterTitle}>
                  What was learned
                </h2>
                <p className={e.closing}>{x.closing}</p>
              </Reveal>
            ) : null}
          </div>

          <aside className={s.rail} aria-label="Role details">
            <div className={s.railBlock}>
              <p className="label">Capability domains</p>
              <ul className={s.chips}>
                {x.domains.map((d) => (
                  <li key={d} className={s.chip}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.railBlock}>
              <p className="label">{x.toolsLabel}</p>
              <ul className={s.chips}>
                {x.tools.map((t) => (
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
