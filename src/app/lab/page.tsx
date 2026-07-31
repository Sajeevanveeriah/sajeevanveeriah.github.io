import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/motion/Reveal'
import { labs, labIndexCopy, LAB_FRAMING } from '@/content/lab'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Concept Lab',
  description:
    'Three interactive engineering demonstrations: A* path planning, PID tuning and Kalman filtering, each running entirely in the browser.',
  alternates: { canonical: '/lab/' },
  openGraph: {
    title: 'Concept Lab',
    url: '/lab/',
    images: [{ url: '/assets/og/lab.png', width: 1200, height: 630, alt: 'Concept Lab' }],
  },
}

export default function LabIndexPage() {
  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader
          kicker={labIndexCopy.kicker}
          title={labIndexCopy.title}
          lede={labIndexCopy.lede}
          aside={
            <div className={s.railBlock}>
              <p className="label">Honest framing</p>
              <p className={s.railNote}>{LAB_FRAMING}</p>
            </div>
          }
        />

        <div className={s.rows}>
          {labs.map((lab) => (
            <Reveal as="article" key={lab.slug} className={s.row}>
              <div className={s.rowHead}>
                <h2 className={s.rowTitle}>
                  <Link href={`/lab/${lab.slug}/`}>{lab.title}</Link>
                </h2>
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
      </div>
    </section>
  )
}
