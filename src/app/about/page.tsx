import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { narrative, credentials, beyond, beyondHeading } from '@/content/about'
import { experience, experienceGroups } from '@/content/experience'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Career timeline, formal qualifications, professional membership, community involvement and life beyond the workbench.',
  alternates: { canonical: '/about/' },
  openGraph: { title: 'About', url: '/about/' },
}

export default function AboutPage() {
  const groups = ['recent', 'foundation'] as const

  return (
    <>
      <section className="section">
        <div className="wrap">
          <PageHeader kicker="05 / About" title="A factual record that proves systems thinking across industries." lede={narrative} />

          {groups.map((g) => (
            <div key={g} style={{ marginBottom: 'var(--space-6)' }}>
              <div className={s.header} style={{ marginBottom: 'var(--space-3)' }}>
                <p className="mono-label">
                  {experienceGroups[g].period} / {experienceGroups[g].kicker}
                </p>
                <h2 style={{ fontSize: 'var(--text-xl)' }}>{experienceGroups[g].heading}</h2>
              </div>
              <div className={`${s.grid} ${s.grid3}`}>
                {experience
                  .filter((r) => r.group === g)
                  .map((r) => (
                    <article key={r.slug} className={s.card}>
                      <div className={s.meta}>
                        {r.period ? <span className={s.cat}>{r.period}</span> : null}
                        {r.evidenceTiers.map((t) => (
                          <TierIndicator key={t} tier={t} />
                        ))}
                      </div>
                      <h3 className={s.cardTitle} style={{ fontSize: 'var(--text-lg)' }}>
                        <Link href={`/about/${r.slug}/`}>{r.company}</Link>
                      </h3>
                      <p className={s.cat} style={{ color: 'var(--text-faint)' }}>{r.title}</p>
                      <p className={s.body}>{r.summary}</p>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="creds-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className={s.header}>
            <p className="mono-label">06 / Education, membership and community</p>
            <h2 id="creds-title">Formal qualifications, professional membership and the communities around them.</h2>
          </div>
          <div className={`${s.grid} ${s.grid3}`}>
            {credentials.map((c) => (
              <article key={c.label} className={s.card}>
                <p className="mono-label">{c.label}</p>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 'var(--space-2)' }}>
                  {c.items.map((item, i) => (
                    <li key={i} className={s.body}>
                      {item.title ? (
                        <strong style={{ color: 'var(--text)', display: 'block' }}>{item.title}</strong>
                      ) : null}
                      {item.detail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="beyond-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className={s.header}>
            <p className="mono-label">07 / Beyond engineering</p>
            <h2 id="beyond-title">{beyondHeading.title}</h2>
            <p className={s.lede}>{beyondHeading.summary}</p>
          </div>
          <div className={`${s.grid} ${s.grid3}`}>
            {beyond.map((b) => (
              <article key={b.title} className={s.card}>
                <h3 style={{ fontSize: 'var(--text-lg)' }}>{b.title}</h3>
                <p className={s.body}>{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
