import Image from 'next/image'
import Link from 'next/link'
import { AtlasExplorer } from '@/components/AtlasExplorer'
import { EngineeringField } from '@/components/EngineeringField'
import { ExperienceTimeline } from '@/components/ExperienceTimeline'
import { Masthead } from '@/components/Masthead'
import { ProjectIndex } from '@/components/ProjectIndex'
import { SiteFooter } from '@/components/SiteFooter'
import { featuredProjects, projectIndex } from '@/content/projects'
import { beyond, community, experience, foundation, site, systemLayers } from '@/content/site'

const projectTotal = featuredProjects.length + projectIndex.reduce((count, group) => count + group.items.length, 0)
const beyondColours = ['orange', 'yellow', 'teal', 'blue', 'violet'] as const

export default function HomePage() {
  return (
    <>
      <Masthead />
      <main id="main">
        <section className="atlas-hero shell" id="overview" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Geelong, Australia / Engineer across the complete system</p>
            <h1 id="hero-title"><span>Sajeevan</span>{' '}<span>Veeriah</span></h1>
            <p className="hero-role">{site.jobTitle}</p>
            <p className="hero-summary">{site.proposition}</p>
            <p className="hero-profile">{site.profile}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore my work</a>
              <a className="button button-secondary" href={site.resume}>Download resume</a>
              <a className="button button-coffee" href={site.support.url} target="_blank" rel="noopener noreferrer">Buy me a coffee</a>
            </div>
          </div>
          <EngineeringField />

          <dl className="hero-proof" aria-label="Portfolio scope">
            <div><dt>{projectTotal}</dt><dd>project records</dd></div>
            <div><dt>19</dt><dd>atlas domains</dd></div>
            <div><dt>{experience.length}</dt><dd>career chapters</dd></div>
            <div><dt>{systemLayers.length}</dt><dd>connected layers</dd></div>
          </dl>
        </section>

        <figure className="practice-visual shell">
          <Image
            src="/assets/image/20260827-Living-Systems-Atlas-Illustration-Rev00.webp"
            alt="Illustrative engineering atlas connecting a rover, sensing, embedded electronics, automation hardware and verification software through one signal path."
            width={1919}
            height={1200}
            priority
            sizes="(max-width: 1440px) 100vw, 1380px"
          />
          <figcaption>Illustrative practice map / brand artwork, not project evidence</figcaption>
        </figure>

        <section className="system-band" id="systems" aria-labelledby="systems-title">
          <div className="shell">
            <div className="section-intro compact">
              <p className="eyebrow">How I engineer</p>
              <h2 id="systems-title">From physical behaviour to dependable operation.</h2>
              <p>Each layer has clear interfaces, testable assumptions and evidence at the boundary.</p>
            </div>
            <ol className="system-rail">
              {systemLayers.map((layer) => (
                <li data-colour={layer.colour} key={layer.index}>
                  <span className="rail-node" aria-hidden="true">{layer.index}</span>
                  <h3>{layer.title}</h3>
                  <p>{layer.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="atlas-section shell" id="atlas" aria-labelledby="atlas-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">My Engineering Atlas</p>
              <h2 id="atlas-title">Nineteen connected capability domains.</h2>
            </div>
            <p>Evidence levels separate delivered work, hands-on practice, working knowledge and adjacent fields. The map shows what I can defend, not a catalogue of everything in engineering.</p>
          </div>
          <AtlasExplorer />
        </section>

        <section className="project-section" id="work" aria-labelledby="work-title">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Selected engineering records</p>
                <h2 id="work-title">Systems with evidence and boundaries.</h2>
              </div>
              <Link className="text-action" href="/work/">Open the dedicated work index</Link>
            </div>

            <div className="selected-systems">
              {featuredProjects.map((project, index) => (
                <article className="selected-system" key={project.slug}>
                  <div className="selected-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
                  <div className="selected-heading">
                    <p>{project.evidence}</p>
                    <h3>{project.title}</h3>
                  </div>
                  <div className="selected-proof">
                    <p><strong>System</strong>{project.system}</p>
                    <p><strong>Verification</strong>{project.verification}</p>
                    <ul aria-label={`${project.title} technology stack`}>
                      {project.stack.slice(0, 7).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <Link className="button button-secondary" href={`/work/${project.slug}/`}>Open engineering record</Link>
                  </div>
                  {project.image ? (
                    <figure className="selected-visual">
                      <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(max-width: 900px) 100vw, 29vw" />
                      <figcaption>{project.image.kind}</figcaption>
                    </figure>
                  ) : null}
                </article>
              ))}
            </div>

            <ProjectIndex headingId="complete-project-index" />
          </div>
        </section>

        <section className="experience-section" id="experience" aria-labelledby="experience-title">
          <div className="shell experience-layout">
            <div className="experience-intro">
              <p className="eyebrow">Complete work history</p>
              <h2 id="experience-title">Built on real production floors.</h2>
              <p>My career moves across structural steel, advanced composites, beverage production, IoT, automotive testing and regulated automation. The thread is the same: understand the system, find the fault and leave auditable evidence.</p>
              <p className="source-note">Organisation links describe employer context. Personal duties and tools remain bounded by my resume and project records.</p>
            </div>
            <ExperienceTimeline />
          </div>
        </section>

        <section className="foundation-section" id="credentials" aria-labelledby="credentials-title">
          <div className="shell">
            <div className="proof-strip">
              <p><span>Base</span>{site.location}</p>
              {site.credentials.map((credential) => <p key={credential}><span>Credential</span>{credential}</p>)}
            </div>
            <div className="section-intro compact">
              <p className="eyebrow">Foundation</p>
              <h2 id="credentials-title">Engineering depth with a practical bias.</h2>
              <p>Formal study, professional membership, short courses and multilingual communication support the delivery record.</p>
            </div>
            <div className="foundation-grid">
              <section><p className="foundation-number">01</p><h3>Education</h3><ul>{foundation.education.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><p className="foundation-number">02</p><h3>Professional</h3><ul>{foundation.professional.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><p className="foundation-number">03</p><h3>Training</h3><ul>{foundation.training.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><p className="foundation-number">04</p><h3>Languages</h3><ul>{foundation.languages.map((item) => <li key={item}>{item}</li>)}</ul></section>
            </div>
          </div>
        </section>

        <section className="beyond-section shell" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Beyond engineering</p>
              <h2 id="about-title">A life with teams, roads, music and unfinished robots.</h2>
            </div>
            <p>The portfolio is technical. The person behind it is powered by community sport, mentoring, good music and curiosity that follows me home.</p>
          </div>
          <div className="beyond-grid">
            {beyond.map((item, index) => (
              <article data-colour={beyondColours[index] ?? 'blue'} key={item.title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="community-grid">
            <div><p className="eyebrow">Community and university</p><h3>Engineering is a team sport too.</h3></div>
            <ul>{community.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.detail}</span></li>)}</ul>
          </div>
        </section>

        <section className="contact-strip" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-grid">
            <div>
              <p className="eyebrow">Build the next dependable system</p>
              <h2 id="contact-title">Open to engineering conversations in Geelong and beyond.</h2>
              <p>If my work helps you, the optional PayPal button supports more open engineering projects and learning resources.</p>
              <a className="button button-coffee" href={site.support.url} target="_blank" rel="noopener noreferrer">Buy me a coffee with PayPal</a>
            </div>
            <address className="contact-links">
              <a href={`mailto:${site.email}`}><span>Email</span>{site.email}</a>
              <a href={site.github} target="_blank" rel="noopener noreferrer"><span>GitHub</span>Sajeevanveeriah</a>
              <a href={site.resume}><span>Resume</span>Download PDF</a>
            </address>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
