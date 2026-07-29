import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { publishedProjects, getProject } from '@/content/projects'
import { experience } from '@/content/experience'
import { site } from '@/content/site'
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
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'CreativeWork', '@id': `${site.url}/work/${p.slug}/#project`, name: p.title, description: p.summary, url: `${site.url}/work/${p.slug}/`, creator: { '@id': `${site.url}/#person` }, image: image ? `${site.url}${image.src}` : undefined },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Work', item: `${site.url}/work/` },
        { '@type': 'ListItem', position: 3, name: p.title, item: `${site.url}/work/${p.slug}/` },
      ] },
    ],
  }

  return (
    <article className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
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

        <div className={s.caseStudy}>
          <section className={s.caseLead}><p className="mono-label">Problem and constraints</p><h2>The engineering problem</h2><p>{p.problem}</p><p>{p.context}</p></section>
          <section className={s.caseArchitecture}><p className="mono-label">Whole-system architecture</p><h2>How the system works</h2><p>{p.approach[0]}</p></section>
          <section className={s.caseSplit}><div><p className="mono-label">Responsibility and ownership</p><h2>What I owned</h2><p>{p.demonstrates}</p></div><div><p className="mono-label">Decisions and trade-offs</p><h2>Why I built it this way</h2><p>{p.approach[1]}</p></div></section>
          <section className={s.caseImplementation}><p className="mono-label">Implementation</p><h2>Across the relevant disciplines</h2><p>{p.toolsNote}</p></section>
          <section className={s.caseValidation}><div><p className="mono-label">Testing and validation</p><h2>How I checked the work</h2><p>{p.validation}</p></div><div><p className="mono-label">Verified result</p><h2>What I delivered</h2><p>{p.outcome}</p></div></section>
          <section className={s.caseLimit}><p className="mono-label">Limitations and honest scope</p><h2>What the evidence supports</h2><p>{p.evidenceNote}</p></section>

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
