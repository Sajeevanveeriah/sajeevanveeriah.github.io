import Image from 'next/image'
import Link from 'next/link'
import { ExperienceTimeline } from '@/components/ExperienceTimeline'
import { LearningRoadmap } from '@/components/LearningRoadmap'
import { Masthead } from '@/components/Masthead'
import { ProjectIndex } from '@/components/ProjectIndex'
import { SiteFooter } from '@/components/SiteFooter'
import { featuredProjects } from '@/content/projects'
import { resumeFiles } from '@/content/resume'
import { foundation, humanNote, site } from '@/content/site'
import './reference-fidelity.css'

const heroNodes = [
  ['01', 'Physical system', 'Mechanisms & actuation'],
  ['02', 'Sensing', 'Perception & world model'],
  ['03', 'Control', 'Real-time & safety'],
  ['04', 'Autonomy', 'Planning & decisioning'],
  ['05', 'Industrial IT/AI', 'Data, integration & intelligence'],
  ['06', 'Verification', 'Validation & reliability'],
] as const

const projectCards = [
  { title: 'Autonomous Navigation Rover', tags: ['ROS 2', 'Nav2', 'SLAM'], image: '/assets/image/Autonomous_Navigation_ROS2_Robotics_Rev00.webp', href: '/work/autonomous-navigation-rover/' },
  { title: 'Embedded Ataxia Assessment Device', tags: ['ESP32', 'Sensors', 'MATLAB'], image: '/assets/image/Embedded_Clinical_Ataxia_Assessment_Rev00.webp', href: '/work/ataxia-assessment-device/' },
  { title: 'Pricing and Inventory Control', tags: ['TypeScript', 'Tauri', 'Verification'], image: '/assets/image/20260826-SWL-Pricing-Run-Rev00.png', href: '/work/swl-pricing-inventory-control/' },
] as const

export default function HomePage() {
  const featured = featuredProjects[0]

  return (
    <div className="reference-home">
      <Masthead />
      <main id="main">
        <div className="reference-dark">
          <section className="reference-hero" id="overview" aria-labelledby="hero-title">
            <div className="reference-shell reference-hero-grid">
              <div className="reference-hero-copy">
                <p className="reference-kicker">Robotics. Intelligence. Automation.</p>
                <h1 id="hero-title"><span>Sajeevan</span><span>Veeriah</span></h1>
                <p className="reference-role">{site.jobTitle}</p>
                <p className="reference-summary">{site.proposition}</p>
                <div className="reference-actions">
                  <a className="reference-primary" href="#work">View selected work <span aria-hidden="true">→</span></a>
                  <a className="reference-link" href={resumeFiles.pdf} download>Download resume <span aria-hidden="true">↓</span></a>
                </div>
                <p className="reference-member">Member, Engineers Australia</p>
              </div>

              <figure className="reference-system-map" aria-labelledby="reference-map-caption">
                <div className="reference-orbit" aria-hidden="true" />
                <Image src="/assets/image/Smart_Factory_Process_Visualisation_Rev00.webp" alt="Illustrative integrated automation system with production equipment, control and operational data layers." width={1448} height={1086} priority sizes="(max-width: 820px) 100vw, 56vw" />
                <ol>{heroNodes.map(([number, title, detail], index) => <li className={`reference-node reference-node-${index + 1}`} key={number}><span>{number}</span><strong>{title}</strong><small>{detail}</small></li>)}</ol>
                <figcaption id="reference-map-caption">One connected practice across physical systems, intelligence, automation and verification.</figcaption>
              </figure>
            </div>
          </section>
        </div>

      <section className="reference-feature" id="work" aria-labelledby="work-title">
        <div className="reference-shell reference-feature-grid">
          <div className="reference-section-intro">
            <p className="reference-index">01 <span>Selected work</span></p>
            <h2 id="work-title">Systems that solve real problems.</h2>
            <p>From autonomous robots to production automation - engineering that delivers reliability, safety and scale.</p>
            <Link href="/work/">View all projects <span aria-hidden="true">→</span></Link>
          </div>
          <article className="reference-feature-card">
            <div className="reference-feature-copy">
              <p className="reference-kicker">Featured project</p>
              <h3>{featured.title.replace(' on ROS 2', ' - ROS 2')}</h3>
              <p>{featured.system}</p>
              <ul>{featured.stack.slice(0, 5).map((tag) => <li key={tag}>{tag}</li>)}</ul>
              <Link href={`/work/${featured.slug}/`}>View project case study <span aria-hidden="true">→</span></Link>
            </div>
            <figure>
              <Image src={featured.image!.src} alt={featured.image!.alt} width={featured.image!.width} height={featured.image!.height} sizes="(max-width: 820px) 100vw, 42vw" />
              <figcaption><strong>Engineering evidence</strong>{featured.verification}</figcaption>
            </figure>
          </article>
        </div>
      </section>

      <section className="reference-projects" id="projects" aria-labelledby="projects-title">
        <div className="reference-shell reference-projects-grid">
          <div className="reference-section-intro">
            <p className="reference-index">02 <span>Project index</span></p>
            <h2 id="projects-title">Complete projects. Deeper by design.</h2>
            <p>End-to-end case studies with architecture, system diagrams, code insights and results.</p>
            <a href="#complete-projects">Browse all case studies <span aria-hidden="true">→</span></a>
          </div>
          <div className="reference-card-row">
            {projectCards.map((project) => <article key={project.title}><Image src={project.image} alt="" width={720} height={480} sizes="(max-width: 760px) 100vw, 24vw" /><div><h3>{project.title}</h3><ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><Link href={project.href} aria-label={`Open ${project.title}`}>→</Link></div></article>)}
          </div>
        </div>
      </section>

      <section className="reference-experience-learning" aria-label="Experience and learning">
        <div className="reference-shell reference-split">
          <section id="experience" aria-labelledby="experience-title">
            <div className="reference-section-intro">
              <p className="reference-index">03 <span>Experience</span></p>
              <h2 id="experience-title">A timeline of impact.</h2>
              <p>Engineering roles across manufacturing, quality, automotive validation, field telemetry and automation.</p>
            </div>
            <ExperienceTimeline />
          </section>
          <div className="reference-learning-wrap"><LearningRoadmap /></div>
        </div>
      </section>

      <section className="reference-foundation" id="practice" aria-labelledby="foundation-title">
        <div className="reference-shell reference-foundation-grid">
          <div><p className="reference-index">05 <span>Foundation</span></p><h2 id="foundation-title">Education and professional foundation.</h2><ul>{foundation.education.map((item) => <li key={item}>{item}</li>)}<li>{foundation.professional[0]}</li></ul></div>
          <div><p className="reference-index">06 <span>Human note</span></p><h2>Engineer. Problem solver. Systems builder.</h2><p>{humanNote}</p></div>
          <div id="contact"><p className="reference-index">07 <span>Contact</span></p><h2>Let&apos;s build something reliable together.</h2><ul className="reference-contact-list"><li><a href={`mailto:${site.email}`}>{site.email}</a></li><li><a href={site.github}>github.com/Sajeevanveeriah</a></li><li>{site.location}</li></ul></div>
        </div>
      </section>

      <section className="reference-complete-index" id="complete-projects" aria-labelledby="complete-projects-title"><div className="reference-shell"><ProjectIndex headingId="complete-projects-title" /></div></section>
      </main>
      <SiteFooter />
    </div>
  )
}
