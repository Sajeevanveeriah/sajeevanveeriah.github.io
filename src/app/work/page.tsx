import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from '@/components/icons'
import { Masthead } from '@/components/Masthead'
import { SiteFooter } from '@/components/SiteFooter'
import { featuredProjects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Selected engineering work',
  description: 'Three engineering records covering deployed mobile robotics, simulation-validated autonomy and embedded sensing.',
  alternates: { canonical: '/#work' },
}

export default function WorkPage() {
  return (
    <>
      <Masthead current="work" />
      <main id="main">
        <section className="record-index shell" aria-labelledby="index-title">
          <p className="kicker">Selected work</p>
          <h1 id="index-title">Three systems. Three kinds of proof.</h1>
          <ul className="index-list">
            {featuredProjects.map((project, index) => (
              <li key={project.slug}>
                <span className="index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <Link href={`/work/${project.slug}/`}>{project.title}</Link>
                <span className="index-evidence">{project.evidence}</span>
              </li>
            ))}
          </ul>
          <Link className="text-link" href="/#work"><ArrowLeft />Return to the portfolio</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
