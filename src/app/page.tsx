import { ContactPoster } from '@/components/ContactPoster'
import { Hero } from '@/components/Hero'
import { Masthead } from '@/components/Masthead'
import { PracticeGrid } from '@/components/PracticeGrid'
import { RecordRow } from '@/components/RecordRow'
import { SiteFooter } from '@/components/SiteFooter'
import { SystemsMap } from '@/components/SystemsMap'
import { projects } from '@/content/projects'

export default function HomePage() {
  return (
    <>
      <Masthead />
      <main id="main">
        <Hero />
        <SystemsMap />
        <section className="plain-band work-section" id="work" aria-labelledby="work-title">
          <div className="shell">
            <div className="section-heading">
              <p className="section-index">02</p>
              <div>
                <h2 id="work-title">Three systems. Three kinds of proof.</h2>
                <p>Client deployment, simulation-validated autonomy and assessed embedded engineering.</p>
              </div>
            </div>
            {projects.map((project, index) => (
              <RecordRow key={project.slug} project={project} index={index} />
            ))}
          </div>
        </section>
        <PracticeGrid />
        <ContactPoster />
      </main>
      <SiteFooter />
    </>
  )
}
