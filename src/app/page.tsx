import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/content/projects'
import { practiceDomains, site, systemLayers } from '@/content/site'

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

export default function HomePage() {
  return (
    <>
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">{site.name}</h1>
          <p className="identity">{site.jobTitle}</p>
          <p className="proposition">{site.proposition}</p>
          <div className="actions" aria-label="Primary professional links">
            <a className="button button-primary" href={site.resume}>Resume <Arrow /></a>
            <a className="button" href={site.github}>GitHub <Arrow /></a>
            <a className="button" href={site.linkedin}>LinkedIn <Arrow /></a>
          </div>
        </div>
        <div className="hero-proof" aria-label="Professional foundation">
          <p className="proof-label">Engineering boundary</p>
          <p className="proof-statement">From physical behaviour to deployed intelligence.</p>
          <ul>
            <li>Robotics and autonomous systems</li>
            <li>Embedded sensing and control</li>
            <li>System integration and verification</li>
          </ul>
          <div className="credential-rail">
            {site.credentials.map((credential) => <span key={credential}>{credential}</span>)}
          </div>
        </div>
      </section>

      <section className="systems-section" aria-labelledby="systems-title">
        <div className="shell">
          <div className="section-heading systems-heading">
            <p className="section-index">01</p>
            <div>
              <h2 id="systems-title">One system, across every boundary.</h2>
              <p>Each layer is designed against the next, then verified as a complete machine.</p>
            </div>
          </div>
          <ol className="systems-map" aria-describedby="systems-text">
            {systemLayers.map((layer) => (
              <li key={layer.index}>
                <span className="layer-index">{layer.index}</span>
                <h3>{layer.title}</h3>
                <p>{layer.detail}</p>
              </li>
            ))}
          </ol>
          <p id="systems-text" className="sr-only">
            The engineering sequence runs from the physical system through sensing, embedded intelligence,
            robotics and autonomy, AI and data, then validation and deployment.
          </p>
        </div>
      </section>

      <section className="work-section shell" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="section-index">02</p>
          <div>
            <h2 id="work-title">Three systems. Three kinds of proof.</h2>
            <p>Client deployment, simulation-validated autonomy and assessed embedded engineering.</p>
          </div>
        </div>
        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project-row" key={project.slug}>
              <div className="project-image">
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  width={project.image.width}
                  height={project.image.height}
                  loading="eager"
                  sizes="(max-width: 760px) 100vw, 48vw"
                />
                <span>{String(index + 1).padStart(2, '0')} / {project.evidence}</span>
              </div>
              <div className="project-copy">
                <h3><Link href={`/work/${project.slug}/`}>{project.title}</Link></h3>
                <dl>
                  <div><dt>Problem</dt><dd>{project.problem}</dd></div>
                  <div><dt>Engineered system</dt><dd>{project.system}</dd></div>
                  <div><dt>Evidence</dt><dd>{project.outcome}</dd></div>
                </dl>
                <Link className="text-link" href={`/work/${project.slug}/`}>Read the engineering record <Arrow /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="practice-section" aria-labelledby="practice-title">
        <div className="shell">
          <div className="section-heading">
            <p className="section-index">03</p>
            <div>
              <h2 id="practice-title">A coherent engineering practice.</h2>
              <p>Technologies support these system capabilities. They do not define the identity.</p>
            </div>
          </div>
          <ul className="domain-list">
            {practiceDomains.map((domain, index) => (
              <li key={domain.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{domain.title}</h3><p>{domain.detail}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="iep-section" id="practice" aria-labelledby="iep-title">
        <div className="shell iep-grid">
          <div>
            <p className="section-index">04</p>
            <h2 id="iep-title">Independent Engineering Practice</h2>
          </div>
          <div>
            <p>Commercial engineering delivery, kept distinct from the personal professional record.</p>
            <a className="button button-inverse" href={site.iepLinkedin}>Visit the company page <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="contact-section shell" id="contact" aria-labelledby="contact-title">
        <p className="section-index">05</p>
        <h2 id="contact-title">Have a system that has to move, sense or decide?</h2>
        <div className="contact-row">
          <a className="button button-primary" href={`mailto:${site.email}`}>Email Sajeevan <Arrow /></a>
          <a className="text-link" href={site.linkedin}>Connect on LinkedIn <Arrow /></a>
        </div>
      </section>
    </>
  )
}
