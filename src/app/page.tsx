import Image from 'next/image'
import Link from 'next/link'
import { Masthead } from '@/components/Masthead'
import { SiteFooter } from '@/components/SiteFooter'
import { experience, foundation, practiceDomains, site, systemLayers } from '@/content/site'
import { featuredProjects } from '@/content/projects'

const [panelogramProject, swlProject, snailRaceProject] = featuredProjects

export default function HomePage() {
  return (
    <>
      <Masthead />
      <main id="main">
        <section className="atlas-hero shell" id="overview" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Engineering boundary</p>
            <h1 id="hero-title"><span>Sajeevan</span><span>Veeriah</span></h1>
            <p className="hero-role">{site.jobTitle}</p>
            <p className="hero-summary">{site.proposition}</p>
            <p className="hero-profile">{site.profile}</p>
            <ul className="hero-meta" aria-label="Professional foundation"><li>{site.location}</li><li>Member, Engineers Australia</li></ul>
            <div className="hero-actions"><a className="button button-primary" href={`mailto:${site.email}`}>Email Sajeevan</a><a className="button button-secondary" href={site.github}>GitHub</a></div>
          </div>
          <div className="hero-mosaic" aria-label="Screenshots rendered from the three flagship project builds">
            <figure className="mosaic-main"><Image src={panelogramProject.image.src} alt={panelogramProject.image.alt} width={panelogramProject.image.width} height={panelogramProject.image.height} priority sizes="(max-width: 900px) 100vw, 44vw" /><figcaption>01 / Panelogram, rendered build</figcaption></figure>
            <figure><Image src={swlProject.image.src} alt={swlProject.image.alt} width={swlProject.image.width} height={swlProject.image.height} priority sizes="(max-width: 900px) 50vw, 22vw" /><figcaption>02 / SWL pricing, rendered build</figcaption></figure>
            <figure><Image src={snailRaceProject.image.src} alt={snailRaceProject.image.alt} width={snailRaceProject.image.width} height={snailRaceProject.image.height} priority sizes="(max-width: 900px) 50vw, 22vw" /><figcaption>03 / Snail Race, rendered build</figcaption></figure>
          </div>
        </section>

        <section className="system-band" id="systems" aria-labelledby="systems-title"><div className="shell">
          <div className="section-intro compact"><p className="eyebrow">How I engineer a machine</p><h2 id="systems-title">One connected system path.</h2></div>
          <ol className="system-rail">{systemLayers.map((layer) => <li key={layer.index}><span className="rail-node" aria-hidden="true">{layer.index}</span><h3>{layer.title}</h3><p>{layer.detail}</p></li>)}</ol>
          <p className="sr-only">The system path runs from the physical system through sensing, embedded intelligence, autonomy and data to validation and deployment.</p>
        </div></section>

        <section className="experience-section shell" id="experience" aria-labelledby="experience-title">
          <div className="section-intro sticky-intro"><p className="eyebrow">Experience</p><h2 id="experience-title">Systems delivered in real-world environments.</h2><p>Seven roles across process automation, vehicle development, mobility testing, IoT, manufacturing and quality engineering.</p><a className="text-action" href={site.resume}>Download the complete PDF resume</a></div>
          <ol className="timeline">{experience.map((item, index) => <li key={`${item.period}-${item.role}`}><span className="timeline-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div className="timeline-period">{item.period}</div><div className="timeline-body"><h3>{item.role}</h3><p className="timeline-org">{item.organisation}</p><p className="timeline-context">{item.context}</p><p>{item.detail}</p><ul className="tag-row" aria-label={`${item.role} capabilities`}>{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div></li>)}</ol>
        </section>

        <section className="project-section" id="work" aria-labelledby="work-title"><div className="shell">
          <div className="section-heading atlas-heading"><div><p className="eyebrow">Project atlas</p><h2 id="work-title">Systems built, tested and deployed.</h2></div><Link className="text-action" href="/work/">View all engineering records</Link></div>
          <div className="atlas-records">{featuredProjects.map((project, index) => <article className="atlas-record" key={project.slug}>
            <figure><Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 800px) 100vw, 34vw" /><figcaption>{String(index + 1).padStart(2, '0')} / {project.evidence}</figcaption></figure>
            <div className="atlas-record-copy"><div className="record-title-row"><p className="record-index">{String(index + 1).padStart(2, '0')}</p><h3>{project.title}</h3></div><dl className="record-facts"><div><dt>Problem</dt><dd>{project.problem}</dd></div><div><dt>System boundary</dt><dd>{project.system}</dd></div><div><dt>Verification</dt><dd>{project.verification}</dd></div><div><dt>Current readiness</dt><dd>{project.readiness}</dd></div></dl><ul className="stack-row" aria-label={`${project.title} technology stack`}>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul><div className="record-actions"><Link className="button button-secondary" href={`/work/${project.slug}/`}>Open engineering record</Link><a className="text-action" href={project.repo}>Repository on GitHub</a></div></div>
          </article>)}</div>
        </div></section>

        <section className="capability-section shell" id="practice" aria-labelledby="capability-title">
          <div className="section-heading atlas-heading"><div><p className="eyebrow">Capability atlas</p><h2 id="capability-title">The tools behind the system.</h2></div><p>Organised by engineering responsibility, not keyword volume.</p></div>
          <ol className="capability-grid">{practiceDomains.map((domain, index) => <li key={domain.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{domain.title}</h3><p>{domain.detail}</p></li>)}</ol>
        </section>

        <section className="foundation-section" id="credentials" aria-labelledby="credentials-title"><div className="shell">
          <div className="section-intro compact"><p className="eyebrow">Credentials and foundation</p><h2 id="credentials-title">Engineering depth, built on practical delivery.</h2></div>
          <div className="foundation-grid"><section><p className="foundation-number">01</p><h3>Education</h3><ul>{foundation.education.map((item) => <li key={item}>{item}</li>)}</ul></section><section><p className="foundation-number">02</p><h3>Professional</h3><ul>{foundation.professional.map((item) => <li key={item}>{item}</li>)}</ul></section><section><p className="foundation-number">03</p><h3>Training</h3><ul>{foundation.training.map((item) => <li key={item}>{item}</li>)}</ul></section><section><p className="foundation-number">04</p><h3>Languages</h3><ul>{foundation.languages.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
        </div></section>

        <section className="contact-strip" id="contact" aria-labelledby="contact-title"><div className="shell contact-grid">
          <div><p className="eyebrow">Let&apos;s build intelligent systems</p><h2 id="contact-title">Available for engineering conversations in Geelong and beyond.</h2></div>
          <address className="contact-links"><a href={`mailto:${site.email}`}><span>Email</span>{site.email}</a><a href={`tel:${site.phone.replace(/\s/g, '')}`}><span>Phone</span>{site.phone}</a><a href={site.github}><span>GitHub</span>Sajeevanveeriah</a><a href={site.resume}><span>Resume</span>Download PDF</a><a className="support-link" href={site.support.url} target="_blank" rel="noopener noreferrer"><span>Optional support</span>Support my work with PayPal<span className="sr-only">(opens in a new tab)</span></a></address>
        </div></section>
      </main>
      <SiteFooter />
    </>
  )
}
