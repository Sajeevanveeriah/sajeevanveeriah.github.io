import Image from 'next/image'
import Link from 'next/link'
import { EngineeringField } from '@/components/EngineeringField'
import { Masthead } from '@/components/Masthead'
import { SiteFooter } from '@/components/SiteFooter'
import { featuredProjects } from '@/content/projects'
import { humanNote, professionalProof, roleLenses, site, systemLayers, workingStyle } from '@/content/site'

const proofItems = [
  'Member, Engineers Australia',
  'Mechatronics Engineering (Honours), Distinction, 2025',
  'Robotics / Industrial Systems / Engineering Software',
] as const

export default function HomePage() {
  return (
    <>
      <Masthead />
      <main className="premium-systems" id="main">
        <section className="portfolio-hero" id="overview" aria-labelledby="hero-title">
          <div className="shell hero-layout">
            <div className="hero-copy">
              <p className="hero-location">Geelong, Victoria, Australia</p>
              <h1 id="hero-title"><span>Sajeevan</span><span>Veeriah</span></h1>
              <p className="hero-role">{site.jobTitle}</p>
              <h2 className="hero-statement">Machines. Intelligence. Dependable operation.</h2>
              <p className="hero-summary">{site.proposition}</p>
              <p className="hero-profile">{site.profile}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#proof">View selected work</a>
                <a className="button button-secondary" href={site.resume}>Download resume</a>
                <a className="button button-secondary" href={`mailto:${site.email}`}>Email me</a>
              </div>
            </div>
            <EngineeringField />
            <ul className="trust-proof" aria-label="Professional proof">
              {proofItems.map((item) => (
                <li key={item}><span aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="proof-rail" id="proof" aria-labelledby="proof-title">
          <h2 className="sr-only" id="proof-title">Immediate project proof</h2>
          <div className="shell proof-rail-grid">
            {featuredProjects.map((project, index) => (
              <article className="proof-rail-item" key={project.slug}>
                <p className="proof-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</p>
                <h3>{project.title}</h3>
                <p className="proof-evidence">{project.evidence}</p>
                <p>{project.proof}</p>
                <Link href={`/work/${project.slug}/`}>Open record <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </section>

        <section className="role-lenses-section shell" id="role-lenses" aria-labelledby="role-lenses-title">
          <div className="role-lenses-intro">
            <h2 id="role-lenses-title">One engineering practice. Three operating domains.</h2>
            <p>Start with the boundary closest to your brief. The evidence remains connected across the complete system.</p>
          </div>
          <div className="role-lenses">
            {roleLenses.map((lens, index) => (
              <article className="role-lens" data-featured={index === 0 ? 'true' : undefined} key={lens.title}>
                <p className="role-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</p>
                <h3>{lens.title}</h3>
                <p>{lens.detail}</p>
                <Link href={lens.href}>{lens.action} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </section>

        <section className="systems-band" id="systems" aria-labelledby="systems-title">
          <div className="shell systems-layout">
            <div className="systems-intro">
              <h2 id="systems-title">A complete system is more than the machine.</h2>
              <p>I connect physical behaviour, control, industrial information and verification so the whole system can operate as intended.</p>
            </div>
            <ol className="systems-path">
              {systemLayers.map((layer) => (
                <li key={layer.index}>
                  <span aria-hidden="true">{layer.index}</span>
                  <h3>{layer.title}</h3>
                  <p>{layer.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="work-section" id="work" aria-labelledby="work-title">
          <div className="shell section-heading editorial-heading">
            <div>
              <p className="kicker">Selected work</p>
              <h2 id="work-title">Proof, not a catalogue.</h2>
            </div>
            <p>Three records show the system, my contribution, the verification path and the exact boundary of each claim.</p>
          </div>
          <div className="selected-systems">
            {featuredProjects.map((project, index) => (
              <article className="selected-system" data-tone={index === 1 ? 'dark' : 'light'} key={project.slug}>
                <div className="shell selected-system-grid">
                  <div className="selected-copy">
                    <p className="selected-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</p>
                    <h3>{project.title}</h3>
                    <p className="selected-evidence">{project.evidence}</p>
                    <dl className="selected-details">
                      <div><dt>Contribution</dt><dd>{project.ownership}</dd></div>
                      <div><dt>Verification</dt><dd>{project.verification}</dd></div>
                      <div><dt>Boundary</dt><dd>{project.boundary}</dd></div>
                    </dl>
                    <Link className="button button-record" href={`/work/${project.slug}/`}>Open engineering record <span aria-hidden="true">→</span></Link>
                  </div>
                  {project.image ? (
                    <figure className="selected-visual">
                      <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 900px) 100vw, 56vw" />
                      <figcaption>{project.image.kind}</figcaption>
                    </figure>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <div className="shell work-index-action"><Link className="text-action" href="/work/">View the three-record work index <span aria-hidden="true">→</span></Link></div>
        </section>

        <section className="practice-section" id="practice" aria-labelledby="practice-title">
          <div className="shell practice-layout">
            <div className="practice-intro">
              <p className="kicker">Practice</p>
              <h2 id="practice-title">Engineering that survives contact with reality.</h2>
              <p>{workingStyle}</p>
            </div>
            <ol className="practice-list">
              {professionalProof.map((item, index) => (
                <li key={item.title}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{item.title}</h3><p>{item.detail}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div className="human-note">
            <div className="shell human-note-grid">
              <div><p className="kicker">Human note</p><h2>The engineer behind the evidence.</h2></div>
              <p>{humanNote}</p>
              <div className="human-linework" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="contact-terminal" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-layout">
            <h2 id="contact-title">Build the system. Prove the operation.</h2>
            <p>I work across robotics, industrial automation, industrial IT/OT, embedded systems, AI/ML and engineering software - from requirements through integration, verification and handover.</p>
            <address className="contact-actions">
              <a href={`mailto:${site.email}`}>Email me <span aria-hidden="true">→</span></a>
              <a href={site.github}>View GitHub <span aria-hidden="true">→</span></a>
              <a href={site.resume}>Download resume <span aria-hidden="true">→</span></a>
            </address>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
