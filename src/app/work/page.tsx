import type { Metadata } from 'next'
import Link from 'next/link'
import { projects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Selected engineering work',
  description: 'Three engineering records covering deployed mobile robotics, simulation-validated autonomy and embedded sensing.',
  alternates: { canonical: '/#work' },
}

export default function WorkPage() {
  return (
    <section className="record-index shell">
      <p className="section-index">Selected work</p>
      <h1>Three systems. Three kinds of proof.</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/work/${project.slug}/`}>{project.title}</Link>
            <span>{project.evidence}</span>
          </li>
        ))}
      </ul>
      <Link className="text-link" href="/#work">Return to the complete portfolio ↗</Link>
    </section>
  )
}
