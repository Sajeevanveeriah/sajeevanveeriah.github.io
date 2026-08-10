import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend } from '@/components/ui/TierIndicator'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { EvidenceStateChip } from '@/components/ui/EvidenceState'
import { Reveal } from '@/components/motion/Reveal'
import { WorkArchive } from '@/components/work/WorkArchive'
import { discoverableProjects, projectDisciplines, type Project } from '@/content/projects'
import { workGroups } from '@/content/specialism'
import s from '@/components/ui/shared.module.css'
import w from './work.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Robotics-led engineering work: deployed mobile robots, a ROS 2 autonomy stack, embedded sensing devices, and the supporting software and validation behind them.',
  alternates: { canonical: '/work/' },
  openGraph: { title: 'Work', url: '/work/' },
}

/**
 * Records are grouped rather than ranked flat.
 *
 * The previous page led with four records chosen to span four different
 * disciplines, which is a reasonable way to show range and the wrong way to
 * show a specialism: a reader scanning the titles met four different people.
 * Grouping puts repeated depth in robotics first, keeps every other record
 * published at full length, and says plainly which is which.
 *
 * A slug with no matching record is skipped rather than rendered empty, so
 * the group definition can never invent a project.
 */
function recordsFor(slugs: readonly string[]): Project[] {
  return slugs
    .map((slug) => discoverableProjects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined)
}

export default function WorkPage() {
  const grouped = workGroups.map((g) => ({ ...g, records: recordsFor(g.slugs) }))
  const shown = new Set(grouped.flatMap((g) => g.records.map((r) => r.slug)))
  const remaining = discoverableProjects.filter((p) => !shown.has(p.slug)).length

  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader
          signature="route"
          kicker="Work"
          title="Robotic systems first, then everything that makes one work."
          lede="Grouped by what each record actually is. Every entry states the operating problem, the interfaces owned and the evidence state its claims are held to."
          aside={
            <div className={s.railBlock}>
              <p className="label">Evidence tiers</p>
              <TierLegend compact />
            </div>
          }
        />

        <div className={w.groups}>
          {grouped.map((group, gi) => (
            <div key={group.id} className={w.group} data-group={group.id}>
              <Reveal className={w.groupHead}>
                <p className="label">
                  <span className={w.groupIndex}>{String(gi + 1).padStart(2, '0')}</span>
                  {'  '}
                  {group.records.length} {group.records.length === 1 ? 'record' : 'records'}
                </p>
                <h2 className={w.groupTitle} id={group.id}>
                  {group.name}
                </h2>
                <p className={w.groupNote}>{group.note}</p>
              </Reveal>

              <ul className={w.records}>
                {group.records.map((p, i) => {
                  const image = p.images?.[0]
                  const lead = gi === 0 && i === 0
                  return (
                    <Reveal
                      as="li"
                      key={p.slug}
                      variant="lift"
                      className={`${w.record} ${lead ? w.recordLead : ''}`}
                    >
                      {image ? (
                        <div className={w.recordMedia}>
                          <ProjectImage image={image} priority={lead} />
                        </div>
                      ) : null}

                      <div className={w.recordCopy}>
                        <p className={w.recordMeta}>{p.domain}</p>
                        <h3 className={w.recordTitle}>
                          <Link href={`/work/${p.slug}/`}>{p.title}</Link>
                        </h3>
                        <EvidenceStateChip state={p.evidenceState} />
                        <p className={w.recordSummary}>{p.summary}</p>
                      </div>
                    </Reveal>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className={s.archiveHead}>
          <p className="label label-accent">Full archive</p>
          <h2>All published work.</h2>
          <p className="lede">
            Every record above, plus the manufacturing, quality and compliance foundation
            underneath them. Filterable by discipline and evidence tier.
          </p>
          {remaining > 0 ? (
            <p className={w.archiveNote}>
              {remaining} further {remaining === 1 ? 'record' : 'records'} sit only in the archive:
              the production, quality and compliance work the engineering above is built on.
            </p>
          ) : null}
        </div>

        <WorkArchive projects={discoverableProjects} disciplines={projectDisciplines} />
      </div>
    </section>
  )
}
