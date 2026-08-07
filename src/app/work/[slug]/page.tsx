import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { SystemDiagram, diagramFor } from '@/components/signal/SystemDiagram'
import { TechnicalDepth } from '@/components/ui/TechnicalDepth'
import { ProjectEngineering } from '@/components/ui/ProjectEngineering'
import { Reveal } from '@/components/motion/Reveal'
import { LabMount } from '@/components/lab/LabMount'
import { StaticLab } from '@/components/lab/StaticLab'
import { publishedProjects, discoverableProjects, getProject } from '@/content/projects'
import { getProjectEngineering } from '@/content/projectEngineering'
import { projectTechniques, techniquesFor } from '@/content/techniques'
import { getLab, projectLabs, embedCopy } from '@/content/labs'
import labCss from '@/components/lab/lab.module.css'
import { TIERS } from '@/content/tiers'
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
      images: p.images?.[0] ? [{ url: p.images[0].src, alt: p.images[0].alt }] : undefined,
    },
  }
}

/**
 * One sentence naming what a record's signature diagram is showing, rendered
 * as the figure caption under the architecture chapter. Slugs without an
 * entry render the diagram uncaptioned, exactly as before.
 */
function diagramCaption(slug: string): string | undefined {
  switch (slug) {
    case 'upzy-supervised-routine-companion':
      return 'The supervised loop: an adult-defined routine prompts the child, a button press is recorded, and the adult reviews it, with the acknowledgement kept apart from any completion claim.'
    case 'swl-pricing-inventory-control':
      return 'The controlled workflow: supplier and ServiceM8 files mapped, compared deterministically, held at the operator approval gate, then written as candidate outputs.'
    case 'inventory-scanning-mobile-robot':
      return 'The operator-support cycle: move, observe, associate item and location, then operator review, where an uncertain observation stops instead of changing records.'
    case 'modular-education-testing-robot':
      return 'The repeatable test cycle: configure a module, exercise the subsystem, measure, review and iterate on the same platform.'
    default:
      return undefined
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
  // list, so `index` is -1 and no next link renders on it at all.
  const index = discoverableProjects.findIndex((x) => x.slug === p.slug)
  const next = discoverableProjects[(index + 1) % discoverableProjects.length]

  /**
   * The case study reads as one continuous argument: the problem, the system
   * that answers it, the part of that system Sajeevan personally owned, the
   * decisions behind it, how it was checked and what the evidence actually
   * supports. Empty fields drop out rather than rendering a blank chapter.
   */
  const depth = techniquesFor(projectTechniques, p.slug)
  const engineering = getProjectEngineering(p.slug)
  const embeds = (projectLabs[p.slug] ?? [])
    .map(getLab)
    .filter((l): l is NonNullable<typeof l> => l !== undefined)

  const chapters: {
    title: string
    body: string[]
    depth?: boolean
    labs?: boolean
    engineering?: boolean
  }[] = [
    { title: 'The engineering problem', body: [p.problem, p.context] },
    { title: 'How the system works', body: [p.approach[0] ?? ''] },
    {
      title: 'Engineering implementation',
      body: [engineering.basis],
      engineering: true,
    },
    { title: 'What Sajeevan owned', body: [p.demonstrates] },
    { title: 'Why he built it this way', body: [p.approach[1] ?? ''] },
    {
      title: 'Technique deep dives',
      body: depth.length
        ? ['Sajeevan wrote these treatments to make the techniques this record names legible in full: the mechanism, the choice, the tuning and the proof. Each one opens in place.']
        : [],
      depth: true,
    },
    {
      title: embedCopy.heading,
      body: embeds.length ? [embedCopy.intro] : [],
      labs: true,
    },
    { title: 'Tools and disciplines', body: [p.toolsNote] },
    { title: 'How he checked the work', body: [p.validation] },
    { title: 'What he delivered', body: [p.outcome] },
    { title: 'What this record proves', body: [p.proves] },
    { title: 'What it does not claim', body: [p.doesNotClaim] },
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
                {p.evidenceTier ? (
                  <p className={s.rowSummary}>{TIERS[p.evidenceTier].definition}</p>
                ) : null}
              </div>
              {p.role ? (
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
            <ProjectImage image={image} priority />
          </Reveal>
        ) : null}

        <div className={s.detail}>
          <div className={s.narrative}>
            {chapters.map((c, i) => (
              <Reveal as="section" key={c.title} className={s.chapter}>
                <span className={s.chapterIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h2 className={s.chapterTitle}>{c.title}</h2>
                <div className={s.chapterBody}>
                  {c.body.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                  {/* The signature diagram sits directly under the
                      architecture chapter, where it shows what the prose
                      has just described. */}
                  {c.title === 'How the system works' && variant ? (
                    <SystemDiagram variant={variant} caption={diagramCaption(p.slug)} />
                  ) : null}
                  {c.engineering ? <ProjectEngineering profile={engineering} /> : null}
                  {c.depth ? (
                    <div>
                      {depth.map((t) => (
                        <TechnicalDepth key={t.id} title={t.name}>
                          {t.paragraphs.map((para, k) => (
                            <p key={k}>{para}</p>
                          ))}
                        </TechnicalDepth>
                      ))}
                    </div>
                  ) : null}
                  {c.labs
                    ? embeds.map((lab) => (
                        <div key={lab.slug} className={labCss.embed}>
                          <div className={labCss.embedHead}>
                            <h3 className={labCss.embedTitle}>{lab.title}</h3>
                            <ArrowLink href={`/lab/${lab.slug}/`}>{embedCopy.open}</ArrowLink>
                          </div>
                          <LabMount slug={lab.slug}>
                            <StaticLab slug={lab.slug} />
                          </LabMount>
                        </div>
                      ))
                    : null}
                </div>
              </Reveal>
            ))}
          </div>

          <aside className={s.rail} aria-label="Record details">
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

        {next && next.slug !== p.slug ? (
          <div className={s.nextRecord}>
            <p className="label label-accent">Next record</p>
            <h2 className={s.nextTitle}>
              <Link href={`/work/${next.slug}/`}>{next.title}</Link>
            </h2>
            <ArrowLink href={`/work/${next.slug}/`}>Read the case study</ArrowLink>
          </div>
        ) : null}
      </div>
    </article>
  )
}
