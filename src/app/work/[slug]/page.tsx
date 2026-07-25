import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { publishedProjects, getProject } from '@/content/projects'
import { experience } from '@/content/experience'
import s from '@/components/ui/shared.module.css'

/** Every published slug is emitted at build time. Required for the export. */
export function generateStaticParams() {
  return publishedProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) return {}
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}/` },
    openGraph: {
      title: p.title,
      description: p.summary,
      url: `/work/${p.slug}/`,
      images: p.images?.[0] ? [{ url: p.images[0].src, alt: p.images[0].alt }] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p || p.evidenceTier === null) notFound()

  const roles = experience.filter((r) => r.relatedProjects.includes(p.slug))
  const image = p.images?.[0]

  const facts: readonly (readonly [string, string | readonly string[]])[] = [
    ['Problem', p.problem],
    ['Context', p.context],
    ['Approach', p.approach],
    ['Tools and technologies', p.toolsNote],
    ['Validation method', p.validation],
    ['Output', p.outcome],
    ['Evidence level', p.evidenceNote],
    ['What it demonstrates', p.demonstrates],
  ]

  return (
    <article className="section">
      <div className="wrap">
        <p style={{ marginBottom: 'var(--space-2)' }}>
          <Link href="/work/" className={s.backLink}>
            Back to work
          </Link>
        </p>

        <PageHeader kicker={`${p.category} / ${p.domain}`} title={p.title} lede={p.summary}>
          <div className={s.meta}>
            <TierIndicator tier={p.evidenceTier} />
            {p.period ? <span className={s.cat}>{p.period}</span> : null}
          </div>
        </PageHeader>

        {image ? (
          <div className={s.media} style={{ marginBottom: 'var(--space-5)' }}>
            <ProjectImage image={image} priority />
          </div>
        ) : null}

        <div className={s.split}>
          <dl className={s.dl}>
            {facts
              .filter(([, v]) => (Array.isArray(v) ? v.length > 0 : String(v).length > 0))
              .map(([label, value]) => (
                <div key={label}>
                  <dt className={s.dt}>{label}</dt>
                  <dd className={s.dd}>
                    {Array.isArray(value) ? (
                      value.map((para, i) => <p key={i}>{para}</p>)
                    ) : (
                      <p>{value as string}</p>
                    )}
                  </dd>
                </div>
              ))}
          </dl>

          <aside className={s.rail}>
            <div className={s.railBlock}>
              <p className="mono-label">Disciplines</p>
              <ul className={s.chips}>
                {p.disciplines.map((d) => (
                  <li key={d} className={s.chip}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            {p.stack.length ? (
              <div className={s.railBlock}>
                <p className="mono-label">Key tools</p>
                <ul className={s.chips}>
                  {p.stack.map((t) => (
                    <li key={t} className={s.chip}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {roles.length ? (
              <div className={s.railBlock}>
                <p className="mono-label">Related role</p>
                {roles.map((r) => (
                  <Link key={r.slug} href={`/about/${r.slug}/`} className={s.link}>
                    {r.company}
                  </Link>
                ))}
              </div>
            ) : null}
            {p.links?.length ? (
              <div className={s.railBlock}>
                <p className="mono-label">Links</p>
                {p.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    className={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            ) : null}
            {p.deepDives?.length ? (
              <div className={s.railBlock}>
                <p className="mono-label">Deep dives</p>
                {p.deepDives.map((l) => (
                  <Link key={l.url} href={l.url} className={s.link}>
                    {l.label}
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
