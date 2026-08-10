import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, projects } from '@/content/projects'

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.system,
    alternates: { canonical: `/work/${project.slug}/` },
    openGraph: {
      title: project.title,
      description: project.system,
      images: [{ url: project.image.src, width: project.image.width, height: project.image.height, alt: project.image.alt }],
    },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug)
  if (!project) notFound()

  return (
    <article className="record shell">
      <Link className="back-link" href="/#work">← Selected work</Link>
      <header className="record-header">
        <p>{project.evidence}</p>
        <h1>{project.title}</h1>
        <p>{project.system}</p>
      </header>
      <div className="record-image">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          priority
          sizes="(max-width: 900px) 100vw, 1120px"
        />
      </div>
      <div className="record-grid">
        <aside>
          <p className="proof-label">Engineering boundary</p>
          <p>{project.ownership}</p>
          <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
        </aside>
        <div className="record-body">
          <section><h2>Problem</h2><p>{project.problem}</p></section>
          <section><h2>Engineered system</h2><p>{project.system}</p></section>
          <section><h2>Decisions</h2><ul>{project.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ul></section>
          <section><h2>Verification</h2><p>{project.verification}</p></section>
          <section><h2>Outcome</h2><p>{project.outcome}</p></section>
          <section className="boundary"><h2>Evidence boundary</h2><p>{project.boundary}</p></section>
        </div>
      </div>
    </article>
  )
}
