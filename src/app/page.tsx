import Image from 'next/image'
import Link from 'next/link'
import { Masthead } from '@/components/Masthead'
import { SiteFooter } from '@/components/SiteFooter'
import { SystemEvidence } from '@/components/SystemEvidence'
import { foundation, practiceDomains, site, systemLayers } from '@/content/site'
import { featuredProjects } from '@/content/projects'

const heroPath = [
  { label: 'Physical', detail: 'Mechanisms and sensing' },
  { label: 'Embedded', detail: 'Firmware and control' },
  { label: 'Autonomy', detail: 'Estimation and planning' },
  { label: 'Delivery', detail: 'Verification and handover' },
] as const

export default function HomePage() {
  return (
    <>
      <Masthead />
      <main id="main">
        <section className="atlas-hero shell" id="overview" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title"><span>Sajeevan</span><span>Veeriah</span></h1>
            <p className="hero-role">{site.jobTitle}</p>
            <p className="hero-summary">{site.proposition}</p>
            <p className="hero-profile">{site.profile}</p>
            <div className="hero-actions"><a className="button button-primary" href="#work">View selected systems</a><a className="button button-secondary" href={site.resume}>Download resume</a><a className="text-action" href={`mailto:${site.email}`}>Email Saj</a></div>
          </div>
          <SystemEvidence eyebrow="Engineering operating range" title="One connected delivery path." steps={heroPath} />
        </section>

        <section className="system-band" id="systems" aria-labelledby="systems-title"><div className="shell">
          <div className="section-intro compact"><p className="eyebrow">Systems thinking</p><h2 id="systems-title">From physical behaviour to dependable operation.</h2><p>Each layer is engineered in context, with clear interfaces and evidence at the boundaries.</p></div>
          <ol className="system-rail">{systemLayers.map((layer) => <li key={layer.index}><span className="rail-node" aria-hidden="true">{layer.index}</span><h3>{layer.title}</h3><p>{layer.detail}</p></li>)}</ol>
        </div></section>

        <section className="project-section" id="work" aria-labelledby="work-title"><div className="shell">
          <div className="section-heading"><div><p className="eyebrow">Selected engineering records</p><h2 id="work-title">Three systems. Three kinds of proof.</h2></div><Link className="text-action" href="/work/">View the complete work index</Link></div>
          <div className="selected-systems">{featuredProjects.map((project, index) => (
            <article className="selected-system" key={project.slug}>
              <div className="selected-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
              <div className="selected-heading"><p>{project.evidence}</p><h3>{project.title}</h3></div>
              <div className="selected-proof"><p><strong>System</strong>{project.system}</p><p><strong>Verification</strong>{project.verification}</p><ul aria-label={`${project.title} technology stack`}>{project.stack.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul><Link className="button button-secondary" href={`/work/${project.slug}/`}>Open engineering record</Link></div>
              {project.image ? <figure className="selected-visual"><Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 900px) 100vw, 28vw" /><figcaption>Real interface screenshot</figcaption></figure> : <SystemEvidence eyebrow="Verified system path" title={project.title} steps={project.systemPath} compact />}
            </article>
          ))}</div>
        </div></section>

        <section className="capability-section shell" id="practice" aria-labelledby="capability-title">
          <div className="section-heading"><div><p className="eyebrow">Engineering practice</p><h2 id="capability-title">Capability organised by responsibility.</h2></div><p>Tools matter when they connect disciplines, expose assumptions and make a system easier to verify.</p></div>
          <ol className="capability-grid">{practiceDomains.map((domain, index) => <li key={domain.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{domain.title}</h3><p>{domain.detail}</p></li>)}</ol>
        </section>

        <section className="foundation-section" id="credentials" aria-labelledby="credentials-title"><div className="shell">
          <div className="proof-strip"><p><span>Base</span>{site.location}</p>{site.credentials.map((credential) => <p key={credential}><span>Credential</span>{credential}</p>)}</div>
          <div className="section-intro compact"><p className="eyebrow">Foundation</p><h2 id="credentials-title">Practical delivery backed by engineering depth.</h2></div>
          <div className="foundation-grid"><section><p className="foundation-number">01</p><h3>Education</h3><ul>{foundation.education.map((item) => <li key={item}>{item}</li>)}</ul></section><section><p className="foundation-number">02</p><h3>Professional</h3><ul>{foundation.professional.map((item) => <li key={item}>{item}</li>)}</ul></section><section><p className="foundation-number">03</p><h3>Training</h3><ul>{foundation.training.map((item) => <li key={item}>{item}</li>)}</ul></section><section><p className="foundation-number">04</p><h3>Languages</h3><ul>{foundation.languages.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
        </div></section>

        <section className="contact-strip" id="contact" aria-labelledby="contact-title"><div className="shell contact-grid"><div><p className="eyebrow">Build the next dependable system</p><h2 id="contact-title">Open to engineering conversations in Geelong and beyond.</h2></div><address className="contact-links"><a href={`mailto:${site.email}`}><span>Email</span>{site.email}</a><a href={site.github}><span>GitHub</span>Sajeevanveeriah</a><a href={site.resume}><span>Resume</span>Download PDF</a></address></div></section>
      </main>
      <SiteFooter />
    </>
  )
}
