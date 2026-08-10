import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/motion/Reveal'
import { labs, labsIndex } from '@/content/labs'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Lab',
  description:
    'Four deterministic interactive demonstrations: A* path planning, PID tuning, Kalman filtering and occupancy-grid mapping, each seeded and complete without JavaScript.',
  alternates: { canonical: '/lab/' },
  openGraph: { title: 'Lab', url: '/lab/' },
}

export default function LabIndexPage() {
  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader kicker={labsIndex.kicker} title={labsIndex.title} lede={labsIndex.lede} />

        <div className={s.rows}>
          {labs.map((lab) => (
            <Reveal as="article" key={lab.slug} className={s.row}>
              <div className={s.rowHead}>
                <h2 className={s.rowTitle}>
                  <Link href={`/lab/${lab.slug}/`}>{lab.title}</Link>
                </h2>
                <div className={s.rowMeta}>
                  <span className={s.cat}>{lab.kicker}</span>
                </div>
              </div>
              <p className={s.rowSummary}>{lab.summary}</p>
              <svg
                className={s.rowArrow}
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Reveal>
          ))}
        </div>

        <p className={s.count}>{labsIndex.note}</p>
      </div>
    </section>
  )
}
