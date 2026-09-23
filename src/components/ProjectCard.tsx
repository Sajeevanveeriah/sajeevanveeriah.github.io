import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/content/projects'

export function ProjectCard({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article className="project-card" data-project={project.slug}>
      {project.image && (
        <div className="media-frame">
          <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 720px) 92vw, (max-width: 1200px) 45vw, 380px" />
        </div>
      )}
      <div className="project-card-body">
        <p className="card-kicker">{project.category}</p>
        <Heading><Link prefetch={false} href={`/work/${project.slug}/`}>{project.title}</Link></Heading>
        <p>{project.proof}</p>
      </div>
    </article>
  )
}
