import type { Metadata } from 'next'
import Link from 'next/link'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { site } from '@/content/site'
import { narrative, closedLoop, homeStory } from '@/content/about'
import { publishedProjects } from '@/content/projects'
import { systemsStack } from '@/content/systemsStack'
import { atlas } from '@/content/atlas'
import s from '@/components/ui/shared.module.css'
import home from './home.module.css'
import { KinematicChain } from '@/components/robotics/KinematicChain'
import { PointCloud } from '@/components/robotics/PointCloud'
import { SensorSweep } from '@/components/robotics/SensorSweep'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal'
import { MagneticLink } from '@/components/motion/MagneticLink'
import { ProjectImage } from '@/components/ui/ProjectImage'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { title: `${site.name} | Robotics, Mechatronics and Automation Portfolio`, url: '/' },
}

/** JSON-LD Person graph, carried over from the previous site's @graph. */
function PersonSchema() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        description:
          'I work across robotics, mechatronics, automation and AI/ML engineering, from physical systems and embedded electronics to controls, software and validation.',
        publisher: { '@id': `${site.url}/#person` },
        inLanguage: site.lang,
      },
      {
        '@type': 'ProfilePage',
        '@id': `${site.url}/#profile`,
        url: `${site.url}/`,
        name: 'Sajeevan Veeriah engineering portfolio',
        description:
          'I present my work across mechatronics, robotics, automation, embedded systems, IoT telemetry, AI/ML and validation.',
        isPartOf: { '@id': `${site.url}/#website` },
        mainEntity: { '@id': `${site.url}/#person` },
        inLanguage: site.lang,
      },
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: site.name,
        alternateName: 'Saj Veeriah',
        url: `${site.url}/`,
        email: `mailto:${site.email}`,
        jobTitle: site.jobTitle,
        description:
          'Mechatronics, Robotics, Automation and AI/ML Engineer working across mechanical, electrical, electronics, embedded firmware, control systems, industrial automation, ROS 2 robotics, IoT, software, data and validation.',
        sameAs: site.socials.map((x) => x.href),
        alumniOf: [
          { '@type': 'EducationalOrganization', name: 'Deakin University' },
          { '@type': 'EducationalOrganization', name: 'Cardiff Metropolitan University' },
        ],
        memberOf: [{ '@type': 'Organization', name: 'Engineers Australia' }],
        knowsAbout: [
          'Mechatronics',
          'Robotics',
          'Industrial automation',
          'Control systems',
          'Embedded systems',
          'Electronics and PCB design',
          'CAN telemetry',
          'GPS and GNSS systems',
          'Linux integration',
          'IoT and edge telemetry',
          'AI and ML',
          'Vehicle validation',
          'Commissioning and handover',
        ],
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

export default function HomePage() {
  const featured = publishedProjects.filter((p) => p.featured).slice(0, 3)

  return (
    <>
      <PersonSchema />

      {/* Hero. Asymmetric two-column grid, never a centred stack. */}
      <section className={`section ${home.hero}`} aria-labelledby="hero-title">
        {/* Tier 3 ambient, hero only. All three are decorative, aria-hidden,
            paused off-screen and removed under reduced motion. */}
        <PointCloud />
        <div className={home.sweepAnchor} aria-hidden="true">
          <SensorSweep />
        </div>
        <div className={`wrap ${home.heroGrid}`}>
          <div className={home.heroCopy}>
            <p className="mono-label">{homeStory.kicker}</p>
            <h1 id="hero-title" className={home.heroTitle}>
              {homeStory.headline}
            </h1>
            <p className={home.positioning}>{site.name}</p>
            <p className={home.lede}>{narrative}</p>
            <div className={home.actions}>
              <MagneticLink href="/work/" className={home.primary}>
                View work
              </MagneticLink>
              <a href={site.resumePath} download className={home.secondary}>
                Download resume
              </a>
            </div>
            <ul className={home.credentials}>
              {site.credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Closed-loop signal panel: the discipline behind every record. */}
          <div className={home.signal}>
            <p className="mono-label">{closedLoop.title}</p>
            <p className={home.signalSummary}>{closedLoop.summary}</p>
            <div className={home.chainSlot}>
              <KinematicChain />
            </div>
            <ol className={home.signalFlow}>
              {closedLoop.nodes.map((n) => (
                <li key={n.index} className={home.signalNode}>
                  <span className={home.signalDot} aria-hidden="true" />
                  <span>
                    <span className={home.signalName}>
                      <span className={home.signalIdx} aria-hidden="true">
                        {n.index}
                      </span>
                      {n.name}
                    </span>
                    <span className={home.signalDetail}>{n.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={`section ${home.proof}`} aria-labelledby="proof-title">
        <div className={`wrap ${home.proofGrid}`}>
          <p className="mono-label">{homeStory.proofKicker}</p>
          <div>
            <h2 id="proof-title">{homeStory.proofTitle}</h2>
            <p className={home.proofSummary}>{homeStory.proofSummary}</p>
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="section" aria-labelledby="featured-title">
        <div className="wrap">
          <div className={s.header}>
            <p className="mono-label">02 / {homeStory.featuredKicker}</p>
            <h2 id="featured-title">{homeStory.featuredTitle}</h2>
          </div>
          <RevealGroup className={home.stories}>
            {featured.map((p, index) => (
              <RevealItem key={p.slug} as="article" className={home.story}>
                <div className={home.storyMedia}>
                  {p.images?.[0] && <ProjectImage image={p.images[0]} />}
                </div>
                <div className={home.storyCopy}>
                  <div className={s.meta}>
                    <span className={s.cat}>{String(index + 1).padStart(2, '0')} / {p.domain}</span>
                    <TierIndicator tier={p.evidenceTier} />
                  </div>
                  <h3 className={home.storyTitle}>{p.title}</h3>
                  <p className={home.storySummary}>{p.problem}</p>
                  <dl className={home.storyEvidence}>
                    <div><dt>{homeStory.responseLabel}</dt><dd>{p.approach[1]}</dd></div>
                    <div><dt>{homeStory.outputLabel}</dt><dd>{p.outcome}</dd></div>
                  </dl>
                  <Link href={`/work/${p.slug}/`} className={s.link}>
                    {homeStory.recordLinkLabel}
                  </Link>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className={s.linkRow}>
            <Link href="/work/" className={s.link}>
              All {publishedProjects.length} work records
            </Link>
          </p>
        </div>
      </section>

      {/* Capability strip */}
      <section className="section" aria-labelledby="capability-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className={s.header}>
            <p className="mono-label">03 / {homeStory.capabilityKicker}</p>
            <h2 id="capability-title">{homeStory.capabilityTitle}</h2>
            <p className={s.lede}>Ten systems layers and {atlas.length} atlas domains, with every claim tiered by evidence.</p>
          </div>
          <Reveal as="div"><ul className={home.strip}>
            {systemsStack.map((l) => (
              <li key={l.slug} className={home.stripItem}>
                <span className={home.stripIdx} aria-hidden="true">
                  {String(l.order).padStart(2, '0')}
                </span>
                {l.name}
              </li>
            ))}
          </ul></Reveal>
          <p className={s.linkRow}>
            <Link href="/skills/" className={s.link}>
              Open the systems stack
            </Link>
            <Link href="/atlas/" className={s.link}>
              Open the engineering atlas
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section" aria-labelledby="cta-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className={home.cta}>
            <h2 id="cta-title" style={{ fontSize: 'var(--text-2xl)' }}>
              Explore the evidence, then start a conversation.
            </h2>
            <div className={home.actions}>
              <MagneticLink href="/contact/" className={home.primary}>
                Contact
              </MagneticLink>
              <MagneticLink href={site.resumePath} download className={home.secondary}>
                Download resume
              </MagneticLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
