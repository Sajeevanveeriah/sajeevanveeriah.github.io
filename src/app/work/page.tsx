import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from '@/components/icons'
import { Masthead } from '@/components/Masthead'
import { ProjectIndex } from '@/components/ProjectIndex'
import { SiteFooter } from '@/components/SiteFooter'
import { featuredProjects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Selected engineering work',
  description: 'Three evidence-bounded engineering records across robotics, embedded mechatronics and production software.',
  alternates: { canonical: '/work/' },
  openGraph: {
    type: 'website',
    url: '/work/',
    title: 'Selected engineering work | Sajeevan Veeriah',
    description: 'Three evidence-bounded engineering records across robotics, embedded mechatronics and production software.',
  },
}

export default function WorkPage() {
  return (
    <>
      <Masthead current="work" />
      <main id="main">
        <section className="record-index shell" aria-labelledby="index-title">
          <p className="kicker">Selected work</p>
          <h1 id="index-title">Three systems. Clear evidence.</h1>
          <p className="index-intro">Each record shows the problem, my contribution, the engineering decisions, how the system was checked and where the public claim stops.</p>
          <ul className="index-list">
            {featuredProjects.map((project, index) => (
              <li key={project.slug}>
                <div className="work-index-copy">
                  <span className="index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <p className="index-evidence">{project.evidence}</p>
                  <h2><Link href={`/work/${project.slug}/`}>{project.title}</Link></h2>
                  <p>{project.readiness}</p>
                  <dl>
                    <div><dt>Contribution</dt><dd>{project.ownership}</dd></div>
                    <div><dt>Verification</dt><dd>{project.verification}</dd></div>
                  </dl>
                  <Link className="button button-secondary" href={`/work/${project.slug}/`}>Open engineering record <span aria-hidden="true">→</span></Link>
                </div>
                {project.image ? (
                  <figure className="work-index-media">
                    <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 900px) 100vw, 54vw" />
                    <figcaption>{project.image.kind}</figcaption>
                  </figure>
                ) : null}
              </li>
            ))}
          </ul>
          <section className="complete-work-index" aria-labelledby="complete-work-title">
            <ProjectIndex headingId="complete-work-title" />
          </section>
          <Link className="text-link" href="/#work"><ArrowLeft />Return to homepage work</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
