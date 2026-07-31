import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend, TierIndicator } from '@/components/ui/TierIndicator'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { SystemDiagram, diagramFor } from '@/components/signal/SystemDiagram'
import { Reveal } from '@/components/motion/Reveal'
import { WorkArchive } from '@/components/work/WorkArchive'
import { discoverableProjects, projectDisciplines } from '@/content/projects'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected engineering work across robotics, embedded sensing, intelligent automation, software and validation, with an honest evidence tier for every record.',
  alternates: { canonical: '/work/' },
  openGraph: {
    title: 'Work',
    url: '/work/',
    images: [{ url: '/assets/og/work.png', width: 1200, height: 630, alt: 'Work' }],
  },
}

const FEATURED = [
  'autonomous-navigation-rover',
  'engineering-mastery-lab',
  'iot-monitoring-platform',
] as const

export default function WorkPage() {
  const featured = FEATURED.map((slug) =>
    discoverableProjects.find((p) => p.slug === slug),
  ).filter((p) => p !== undefined)

  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader
          signature="route"
          kicker="Work"
          title="Systems built, integrated and validated."
          lede="Four records lead, then the full archive. Every entry carries the evidence tier it can actually support, and nothing is promoted above it."
          aside={
            <div className={s.railBlock}>
              <p className="label">Evidence tiers</p>
              <TierLegend compact />
            </div>
          }
        />

        <div className={s.featured}>
          {featured.map((p, i) => {
            const image = p.images?.[0]
            const variant = diagramFor(p.slug)
            return (
              <Reveal
                as="article"
                key={p.slug}
                className={`${s.feature} ${i % 2 === 1 ? s.featureFlip : ''}`}
              >
                {image ? (
                  <div className="media-frame">
                    <ProjectImage image={image} priority={i === 0} />
                  </div>
                ) : variant ? (
                  <SystemDiagram variant={variant} />
                ) : null}

                <div className={s.featureCopy}>
                  <div className={s.rowMeta}>
                    <span className={s.cat}>{p.domain}</span>
                    <TierIndicator tier={p.evidenceTier} />
                  </div>
                  <h2 className={s.featureTitle}>
                    <Link href={`/work/${p.slug}/`}>{p.title}</Link>
                  </h2>
                  <p className="prose">{p.summary}</p>
                  <p className={s.cat}>{p.disciplines.join('  ·  ')}</p>
                  <ArrowLink href={`/work/${p.slug}/`}>Read the case study</ArrowLink>
                </div>
              </Reveal>
            )
          })}
        </div>

        <div className={s.archiveHead}>
          <p className="label label-accent">Full archive</p>
          <h2>Every published record.</h2>
          <p className="lede">
            Professional delivery, contract work, university and personal builds, filterable by
            discipline and by the strength of the evidence behind each one.
          </p>
        </div>

        <WorkArchive projects={discoverableProjects} disciplines={projectDisciplines} />
      </div>
    </section>
  )
}
