import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { SystemDiagram, diagramFor } from '@/components/signal/SystemDiagram'
import { Reveal } from '@/components/motion/Reveal'
import { Lightbox } from '@/components/ui/Lightbox'
import { LabBlock } from '@/components/lab/LabBlock'
import type { LabWidgetId } from '@/components/lab/LabMount'
import { labEmbeds, getLab, LAB_FRAMING } from '@/content/lab'
import { publishedProjects, discoverableProjects, getProject } from '@/content/projects'
import { discoverableExperience } from '@/content/experience'
import { site } from '@/content/site'
import s from '@/components/ui/shared.module.css'

/** Every published slug is emitted at build time. Required for the export. */
export function generateStaticParams() {
  // Deliberately the published set, not the discoverable one: a suppressed
  // record must keep building and keep resolving at its own URL. Suppression
  // removes it from discovery, never from the export.
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
    // A suppressed record stays reachable by direct URL but is not indexed.
    // `follow: true` so its outbound links still carry, matching not-found.tsx.
    ...(p.suppressed ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: p.title,
      description: p.summary,
      url: `/work/${p.slug}/`,
      /* The generated card leads; the record's own image follows for
         consumers that prefer a photograph. */
      images: [
        { url: `/assets/og/work-${p.slug}.png`, width: 1200, height: 630, alt: p.title },
        ...(p.images?.[0] ? [{ url: p.images[0].src, alt: p.images[0].alt }] : []),
      ],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p || p.evidenceTier === null) notFound()

  // A suppressed role is never advertised, including from a record it worked on.
  const roles = discoverableExperience.filter((r) => r.relatedProjects.includes(p.slug))
  const image = p.images?.[0]
  const variant = diagramFor(p.slug)

  // Pagination walks the discoverable set, so it can neither land on nor
  // advertise a suppressed record. A suppressed record is absent from the
  // list, so `index` is -1 and neither pagination link renders on it at all.
  const index = discoverableProjects.findIndex((x) => x.slug === p.slug)
  const next = index === -1 ? null : discoverableProjects[(index + 1) % discoverableProjects.length]
  const prev =
    index === -1
      ? null
      : discoverableProjects[(index - 1 + discoverableProjects.length) % discoverableProjects.length]

  // Compact concept labs, only on the records whose own text names the
  // concept. The mapping lives in content, never here.
  const embeds = (labEmbeds[p.slug] ?? [])
    .map((slug) => getLab(slug))
    .filter((l) => l !== undefined)

  /**
   * The case study reads as one continuous argument: the problem, the system
   * that answers it, the part of that system I personally owned, the
   * decisions behind it, how it was checked and what the evidence actually
   * supports. Empty fields drop out rather than rendering a blank chapter.
   */
  const chapters = [
    { title: 'The engineering problem', body: [p.problem, p.context] },
    { title: 'How the system works', body: [p.approach[0] ?? ''] },
    { title: 'What I owned', body: [p.demonstrates] },
    { title: 'Why I built it this way', body: [p.approach[1] ?? ''] },
    { title: 'Across the relevant disciplines', body: [p.toolsNote] },
    { title: 'How I checked the work', body: [p.validation] },
    { title: 'What I delivered', body: [p.outcome] },
    { title: 'What the evidence supports', body: [p.evidenceNote] },
  ]
    .map((c) => ({ ...c, body: c.body.filter(Boolean) }))
    .filter((c) => c.body.length > 0)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${site.url}/work/${p.slug}/#project`,
        name: p.title,
        description: p.summary,
        url: `${site.url}/work/${p.slug}/`,
        creator: { '@id': `${site.url}/#person` },
        image: image ? `${site.url}${image.src}` : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${site.url}/work/` },
          {
            '@type': 'ListItem',
            position: 3,
            name: p.title,
            item: `${site.url}/work/${p.slug}/`,
          },
        ],
      },
    ],
  }

  return (
    <article className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="wrap-wide">
        <BackLink href="/work/">All work</BackLink>

        <PageHeader
          kicker={`${p.category} / ${p.domain}`}
          title={p.title}
          lede={p.summary}
          longTitle
          aside={
            <>
              <div className={s.railBlock}>
                <p className="label">Evidence</p>
                <TierIndicator tier={p.evidenceTier} />
              </div>
              {p.role && !p.role.startsWith('TODO') ? (
                <div className={s.railBlock}>
                  <p className="label">Role</p>
                  <p className={s.rowSummary}>{p.role}</p>
                </div>
              ) : null}
              {p.period ? (
                <div className={s.railBlock}>
                  <p className="label">Period</p>
                  <p className={s.rowSummary}>{p.period}</p>
                </div>
              ) : null}
            </>
          }
        />

        {image ? (
          <Reveal className={`media-frame ${s.mediaHero}`}>
            <Lightbox src={image.src} alt={image.alt} caption={image.caption}>
              <ProjectImage image={image} priority />
            </Lightbox>
          </Reveal>
        ) : null}

        <div className={s.detail}>
          <div className={s.narrative}>
            {chapters.map((c, i) => (
              <Reveal as="section" key={c.title} className={s.chapter}>
                <span id={`chapter-${i + 1}`} className={s.chapterIndex}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className={s.chapterTitle}>{c.title}</h2>
                <div className={s.chapterBody}>
                  {c.body.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                  {/* The signature diagram sits directly under the
                      architecture chapter, where it shows what the prose
                      has just described. */}
                  {i === 1 && variant ? <SystemDiagram variant={variant} /> : null}
                </div>
              </Reveal>
            ))}
          </div>

          <aside className={s.rail} aria-label="Record details">
            <nav className={s.railBlock} aria-label="On this page">
              <p className="label">On this page</p>
              <ol className={s.toc}>
                {chapters.map((c, i) => (
                  <li key={c.title}>
                    <a href={`#chapter-${i + 1}`}>
                      <span className={s.tocIndex}>{String(i + 1).padStart(2, '0')}</span>
                      {c.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className={s.railBlock}>
              <p className="label">Disciplines</p>
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
                <p className="label">Key tools</p>
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
                <p className="label">Related employer</p>
                {roles.map((r) => (
                  <Link key={r.slug} href={`/employers/${r.slug}/`} className={s.link}>
                    {r.company}
                  </Link>
                ))}
              </div>
            ) : null}
            {p.links?.length ? (
              <div className={s.railBlock}>
                <p className="label">Links</p>
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
                <p className="label">Deep dives</p>
                {p.deepDives.map((l) => (
                  <Link key={l.url} href={l.url} className={s.link}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </aside>
        </div>

        {embeds.length > 0 ? (
          <section className={s.labEmbed} aria-label="Concept labs">
            <div className={s.labEmbedHead}>
              <h2 className={s.labEmbedTitle}>Try the concepts</h2>
              <p className={s.labEmbedNote}>{LAB_FRAMING}</p>
            </div>
            {embeds.map((lab) => (
              <div key={lab.slug}>
                <div className={s.labEmbedHead}>
                  <p className="label label-accent">{lab.title}</p>
                  <ArrowLink href={`/lab/${lab.slug}/`}>Open the full lab</ArrowLink>
                </div>
                <LabBlock lab={lab.slug as LabWidgetId} compact />
              </div>
            ))}
          </section>
        ) : null}

        {next && next.slug !== p.slug ? (
          <div className={s.nextRecord}>
            <p className="label label-accent">Next record</p>
            <h2 className={s.nextTitle}>
              <Link href={`/work/${next.slug}/`}>{next.title}</Link>
            </h2>
            <ArrowLink href={`/work/${next.slug}/`}>Read the case study</ArrowLink>
          </div>
        ) : null}

        {prev && next && prev.slug !== p.slug ? (
          <nav className={s.pager} aria-label="Record pagination">
            <Link href={`/work/${prev.slug}/`} className={s.pagerLink}>
              <span className="label">Previous record</span>
              <span className={s.pagerTitle}>{prev.title}</span>
            </Link>
            <Link href={`/work/${next.slug}/`} className={`${s.pagerLink} ${s.pagerNext}`}>
              <span className="label">Next record</span>
              <span className={s.pagerTitle}>{next.title}</span>
            </Link>
          </nav>
        ) : null}
      </div>
    </article>
  )
}
