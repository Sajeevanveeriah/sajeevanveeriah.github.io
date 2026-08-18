import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from '@/components/icons'
import type { Project } from '@/content/projects'

export function RecordRow({ project, index }: { readonly project: Project; readonly index: number }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <article className="project-row">
      <div className="project-number">
        <p className="record-number">{number}</p>
        <p className="record-label">Record</p>
      </div>
      <figure className="plate">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          loading="eager"
          sizes="(max-width: 700px) 100vw, 480px"
        />
        <figcaption><span className="caption-index">{number} / </span>{project.evidence}</figcaption>
      </figure>
      <div className="project-copy">
        <h3><Link href={`/work/${project.slug}/`}>{project.title}</Link></h3>
        <dl>
          <div><dt>Problem</dt><dd>{project.problem}</dd></div>
          <div className="dl-system"><dt>System</dt><dd>{project.system}</dd></div>
          <div><dt>Evidence</dt><dd>{project.outcome}</dd></div>
        </dl>
        <Link className="text-link" href={`/work/${project.slug}/`}>
          Read the engineering record<ArrowUpRight />
        </Link>
      </div>
    </article>
  )
}
