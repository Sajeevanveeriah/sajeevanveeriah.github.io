'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { projects, projectIndex } from '@/content/projects'
import { getIndexedProjectMedia, getProjectMedia } from '@/content/media'
import { ArrowUpRight } from './icons'
import { PictureMedia } from './PictureMedia'
import { LoopingVideo } from './LoopingVideo'
import { ProjectDossierDrawer, type DossierEntry } from './ProjectDossierDrawer'

const CATEGORIES = ['All', 'Robotics', 'Embedded', 'Industrial', 'Software'] as const
type Category = (typeof CATEGORIES)[number]

const INDEX_GROUP_CATEGORIES: Record<string, Category> = {
  'Robotics and physical systems': 'Robotics',
  'Software and AI platforms': 'Software',
  'Industrial and automotive delivery': 'Industrial',
}

export function buildAllProjectDossiers(): readonly DossierEntry[] {
  const caseEntries: DossierEntry[] = projects.map((project) => {
    const media = getProjectMedia(project.slug)
    return {
      id: project.slug,
      kind: 'case-study',
      title: project.title,
      category: project.category,
      status: project.status,
      summary: project.proof,
      media: media.image,
      video: media.video,
      href: `/work/${project.slug}/`,
      project,
    }
  })

  const indexEntries: DossierEntry[] = projectIndex.flatMap((group) => {
    const category = INDEX_GROUP_CATEGORIES[group.group] ?? 'Industrial'
    return group.items.map((item) => ({
      id: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      kind: 'indexed' as const,
      title: item.title,
      category: category === 'All' ? 'Industrial' : category,
      status: group.group,
      summary: item.summary,
      media: getIndexedProjectMedia(item.title),
      href: item.href ?? `/work/?q=${encodeURIComponent(item.title)}`,
    }))
  })

  return [...caseEntries, ...indexEntries]
}

export function ProjectShowcaseGrid() {
  const allEntries = useMemo(() => buildAllProjectDossiers(), [])
  const [category, setCategory] = useState<Category>('All')
  const [scope, setScope] = useState<'case-studies' | 'all'>('case-studies')
  const [activeDossier, setActiveDossier] = useState<DossierEntry | null>(null)

  const filtered = useMemo(
    () =>
      allEntries.filter((item) => {
        if (scope === 'case-studies' && item.kind !== 'case-study') return false
        return category === 'All' || item.category === category
      }),
    [allEntries, category, scope],
  )

  return (
    <div className="project-showcase">
      <div className="showcase-controls">
        <div className="segmented" role="group" aria-label="Filter home projects by discipline">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="segmented" role="group" aria-label="Filter by project depth">
          <button
            type="button"
            aria-pressed={scope === 'case-studies'}
            onClick={() => setScope('case-studies')}
          >
            Case studies ({projects.length})
          </button>
          <button
            type="button"
            aria-pressed={scope === 'all'}
            onClick={() => setScope('all')}
          >
            All verified ({allEntries.length})
          </button>
        </div>
      </div>

      <p className="result-count" role="status">
        Showing {filtered.length} of {allEntries.length} verified engineering records
      </p>

      <div className="card-grid compact" data-testid="showcase-grid">
        {filtered.map((entry) => (
          <article className="project-card showcase-card" key={entry.id} data-project={entry.id}>
            <div className="media-frame">
              {entry.video && scope === 'case-studies' ? (
                <LoopingVideo video={entry.video} showCaption={false} />
              ) : (
                <PictureMedia media={entry.media} />
              )}
            </div>
            <div className="project-card-body">
              <div className="card-meta-row">
                <span className="card-kicker">{entry.category}</span>
                <span className="evidence-tag">{entry.kind === 'case-study' ? 'Case study' : 'Index record'}</span>
              </div>
              <h3>
                {entry.project ? (
                  <Link href={`/work/${entry.project.slug}/`} prefetch={false}>
                    {entry.title}
                  </Link>
                ) : entry.href?.startsWith('http') ? (
                  <a href={entry.href} target="_blank" rel="noopener noreferrer">
                    {entry.title}
                  </a>
                ) : (
                  <Link href={entry.href ?? `/work/?q=${encodeURIComponent(entry.title)}`} prefetch={false}>
                    {entry.title}
                  </Link>
                )}
              </h3>
              <p>{entry.summary}</p>
              <p className="project-status">{entry.status}</p>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-small js-only"
                  onClick={() => setActiveDossier(entry)}
                >
                  Inspect dossier
                </button>
                {entry.project && (
                  <Link className="text-link" href={`/work/${entry.project.slug}/`} prefetch={false}>
                    Full record <ArrowUpRight />
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <ProjectDossierDrawer entry={activeDossier} onClose={() => setActiveDossier(null)} />
    </div>
  )
}
