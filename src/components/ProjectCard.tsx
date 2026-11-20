import Link from 'next/link'
import type { Project } from '@/content/projects'
import { getProjectMedia } from '@/content/media'
import { PictureMedia } from './PictureMedia'

export function ProjectCard({
  project,
  headingLevel = 3,
  onInspect,
}: {
  readonly project: Project
  readonly headingLevel?: 2 | 3
  readonly onInspect?: () => void
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const media = getProjectMedia(project.slug)
  return (
    <article className="project-card" data-project={project.slug}>
      <div className="media-frame">
        <PictureMedia media={media.image} />
      </div>
      <div className="project-card-body">
        <p className="card-kicker">{project.category}</p>
        <Heading>
          <Link prefetch={false} href={`/work/${project.slug}/`}>
            {project.title}
          </Link>
        </Heading>
        <p>{project.proof}</p>
        <p className="project-status">{project.status}</p>
        {onInspect && (
          <div className="card-actions js-only">
            <button type="button" className="btn btn-secondary btn-small" onClick={onInspect}>
              Inspect dossier
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
