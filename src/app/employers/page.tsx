import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend } from '@/components/ui/TierIndicator'
import { Stagger } from '@/components/motion/Reveal'
import { publishedEmployers } from '@/content/employers'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Employers',
  // Recast agentless per the owner's 7 August 2026 direction.
  description:
    'An employment record with company context, the work completed and the capability carried forward.',
  alternates: { canonical: '/employers/' },
  openGraph: { title: 'Employers', url: '/employers/' },
}

export default function EmployersPage() {
  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader
          kicker="Employers"
          title="Where the work was done and what was delivered."
          lede="Each page separates company background from the responsibilities, results and transferable engineering capability."
          aside={
            <div className={s.railBlock}>
              <p className="label">Evidence tiers</p>
              <TierLegend />
            </div>
          }
        >
          <p className={s.rowSummary}>
            <Link href="/versatility/" className={s.link}>
              Six titles, one method
            </Link>
          </p>
        </PageHeader>

        <Stagger className={s.rows}>
          {publishedEmployers.map((x) => (
            <article key={x.slug} className={s.row}>
              <h2 className={s.rowTitle}>
                <Link href={`/employers/${x.slug}/`}>{x.company}</Link>
              </h2>
              <p className={s.rowSummary}>{x.title ?? 'Title not published'}</p>
              <p className={s.rowMeta}>
                {[x.period ?? 'Dates not published', x.location].filter(Boolean).join('  ·  ')}
              </p>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
