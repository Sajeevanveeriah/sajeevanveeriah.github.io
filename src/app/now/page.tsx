import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { nowCopy, nowSections, nowHasPlaceholders } from '@/content/now'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Now',
  description: 'What Sajeevan Veeriah is focused on at the moment.',
  alternates: { canonical: '/now/' },
  /* Scaffold rule: while any section still carries a TODO placeholder this
     page must not be indexed. Removing the placeholders in now.ts lifts the
     noindex automatically. */
  ...(nowHasPlaceholders() ? { robots: { index: false, follow: true } } : {}),
  openGraph: { title: 'Now', url: '/now/' },
}

export default function NowPage() {
  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader
          kicker={nowCopy.kicker}
          title={nowCopy.title}
          lede={nowCopy.lede}
          aside={
            <div className={s.railBlock}>
              <p className="label">Updated</p>
              <p className={s.railNote}>{nowCopy.updated}</p>
            </div>
          }
        />
        <div className={s.detail}>
          <div className={s.narrative}>
            {nowSections.map((section, i) => (
              <section key={section.title} className={s.chapter}>
                <span className={s.chapterIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h2 className={s.chapterTitle}>{section.title}</h2>
                <div className={s.chapterBody}>
                  <p>{section.body}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
