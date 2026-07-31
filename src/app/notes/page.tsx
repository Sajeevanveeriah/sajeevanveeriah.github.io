import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { notes, notesCopy } from '@/content/notes'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Field Notes',
  description: 'Engineering field notes by Sajeevan Veeriah.',
  alternates: { canonical: '/notes/' },
  /* The index stays unindexed while the entry list is empty; publishing the
     first note in notes.ts lifts this automatically. */
  ...(notes.length === 0 ? { robots: { index: false, follow: true } } : {}),
  openGraph: { title: 'Field Notes', url: '/notes/' },
}

export default function NotesPage() {
  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader kicker={notesCopy.kicker} title={notesCopy.title} lede={notesCopy.lede} />
        {notes.length === 0 ? (
          <p className={s.count}>{notesCopy.emptyState}</p>
        ) : (
          <div className={s.rows}>
            {notes.map((note) => (
              <article key={note.slug} className={s.row}>
                <div className={s.rowHead}>
                  <h2 className={s.rowTitle}>
                    <Link href={`/notes/${note.slug}/`}>{note.title}</Link>
                  </h2>
                  <div className={s.rowMeta}>
                    <span className={s.cat}>{note.date}</span>
                  </div>
                </div>
                <p className={s.rowSummary}>{note.summary}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
