import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend } from '@/components/ui/TierIndicator'
import { Stagger } from '@/components/motion/Reveal'
import { publishedEmployers } from '@/content/employers'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Employers',
  description:
    'Every employer on the record, each with the verified facts about the place, the work graded by evidence tier, and what it bought.',
  alternates: { canonical: '/employers/' },
  openGraph: { title: 'Employers', url: '/employers/' },
}

export default function EmployersPage() {
  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader
          kicker="Employers"
          title="Where the work happened, and what it proves."
          lede="Each page separates three things that usually get blurred together: verified facts about the employer, the work I can personally evidence, and the argument the role supports. Nothing is claimed beyond its tier."
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
