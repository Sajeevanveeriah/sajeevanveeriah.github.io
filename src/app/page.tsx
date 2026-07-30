import type { Metadata } from 'next'
import Link from 'next/link'
import { ProjectImage } from '@/components/ui/ProjectImage'
import { SignalHero } from '@/components/signal/SignalHero'
import { ClosedLoop } from '@/components/signal/ClosedLoop'
import { StackSpine } from '@/components/signal/StackSpine'
import { SystemDiagram, diagramFor } from '@/components/signal/SystemDiagram'
import { Reveal, Stagger } from '@/components/motion/Reveal'
import { ParallaxStage, ParallaxLayer } from '@/components/motion/ParallaxStage'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { site } from '@/content/site'
import { narrative, closedLoop } from '@/content/about'
import { discoverableProjects } from '@/content/projects'
import { systemsStack } from '@/content/systemsStack'
import home from './home.module.css'

export const metadata: Metadata = {
  title: 'Sajeevan Veeriah | Mechatronics, Robotics and AI/ML Engineer',
  description:
    'Sajeevan Veeriah builds complete robotics, embedded and intelligent automation systems across mechanics, electronics, software, autonomy, controls and validation.',
  alternates: { canonical: '/' },
}

function PersonSchema() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        inLanguage: site.lang,
      },
      {
        '@type': 'ProfilePage',
        '@id': `${site.url}/#profile`,
        url: `${site.url}/`,
        name: 'Sajeevan Veeriah engineering portfolio',
        isPartOf: { '@id': `${site.url}/#website` },
        mainEntity: { '@id': `${site.url}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: site.name,
        alternateName: 'Saj Veeriah',
        url: `${site.url}/`,
        email: `mailto:${site.email}`,
        jobTitle: site.jobTitle,
        sameAs: site.socials.map((x) => x.href),
        alumniOf: { '@type': 'EducationalOrganization', name: 'Deakin University' },
        memberOf: { '@type': 'Organization', name: 'Engineers Australia' },
      },
    ],
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
  )
}

/**
 * Four selected records, chosen to span the disciplines rather than to
 * repeat one: autonomy, engineering software, field electronics and
 * regulated industrial automation.
 */
const SELECTED = [
  'autonomous-navigation-rover',
  'engineering-mastery-lab',
  'iot-monitoring-platform',
  'jag-smart-factory',
] as const

const PROOF = [
  { value: 'Engineers Australia', note: 'Professional membership' },
  { value: 'Honours, Distinction', note: 'Bachelor of Mechatronics Engineering, Deakin, 2025' },
  { value: 'Architecture to validation', note: 'Complete systems, not isolated components' },
  { value: 'Four evidence sources', note: 'Professional, contract, university and open source' },
] as const

const PROBLEMS = [
  [
    'Autonomous systems',
    'Sensing, localisation, planning and control integrated as one testable system.',
  ],
  [
    'Cyber-physical products',
    'Mechanics, electronics, firmware and interfaces developed around the real operating problem.',
  ],
  [
    'Intelligent automation',
    'Controls, data and AI/ML joined without losing engineering traceability.',
  ],
  [
    'Verification',
    'Simulation, testing, field evidence and defensible documentation used to close the loop.',
  ],
] as const

export default function HomePage() {
  const selected = SELECTED.map((slug) =>
    discoverableProjects.find((p) => p.slug === slug),
  ).filter((p) => p !== undefined)

  return (
    <>
      <PersonSchema />

      {/* ---------- Hero ---------- */}
      <section className={home.hero} aria-labelledby="hero-title">
        {/* Three blocks rather than two, so on a phone the animation lands
            between the headline and the supporting copy instead of a full
            screen below it. On desktop the grid areas put it back in the
            right-hand column spanning both rows. */}
        <div className={`wrap-wide ${home.heroGrid}`}>
          <div className={home.heroIntro}>
            <p className={home.heroName}>{site.name}</p>
            <h1 id="hero-title" className={home.heroTitle}>
              I build intelligent systems that move, sense and decide.
            </h1>
            <p className={home.heroRole}>Mechatronics, Robotics and AI/ML Engineer</p>
          </div>

          <div className={home.heroFigure}>
            <SignalHero />
          </div>

          <div className={home.heroOutro}>
            <p className={home.heroLede}>{narrative}</p>
            <div className={home.heroActions}>
              <Link href="/work/" className="btn btn-primary">
                View selected work
              </Link>
              <a href={site.resumePath} download className="btn btn-secondary">
                Download resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Credibility ---------- */}
      <section className={home.proof} aria-label="Credentials and evidence">
        <Stagger className={`wrap-wide ${home.proofGrid}`}>
          {PROOF.map((item) => (
            <div key={item.value} className={home.proofItem}>
              <span className={home.proofValue}>{item.value}</span>
              <span className={home.proofNote}>{item.note}</span>
            </div>
          ))}
        </Stagger>
      </section>

      {/* ---------- Problems I solve ---------- */}
      <section className="section" aria-labelledby="problems-title">
        <div className="wrap-wide">
          <Reveal className={home.stageHeadSplit}>
            <div>
              <p className="label label-accent">Problems I solve</p>
              <h2 id="problems-title">Across boundaries, not inside silos.</h2>
            </div>
            <p className="lede">
              Most of the hard problems I am given sit between disciplines. I identify which
              engineering layer the problem actually lives in, then work across the layers required
              to resolve it.
            </p>
          </Reveal>

          <Stagger as="ul" className={home.problemList}>
            {PROBLEMS.map(([title, body], i) => (
              <li key={title} className={home.problem}>
                <span className={home.problemIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={home.problemTitle}>{title}</h3>
                <p className={home.problemBody}>{body}</p>
              </li>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- Closed loop ---------- */}
      <section className="section stage-tint" aria-labelledby="loop-title">
        <div className="wrap-wide">
          <Reveal className={home.stageHeadSplit}>
            <div>
              <p className="label label-accent">How I work</p>
              <h2 id="loop-title">{closedLoop.title}</h2>
            </div>
            <p className="lede">{closedLoop.summary}</p>
          </Reveal>
          <ClosedLoop />
        </div>
      </section>

      {/* ---------- Selected work ----------
          The one sticky scroll stage on the site. The heading holds in the
          left column while the four records pass it, so the reader always
          knows which stage they are inside. It is a rail rather than a
          pinned full-height graphic on purpose: a sticky column beside a
          scrolling column always has readable content on screen, where a
          pinned diagram can strand a viewport containing nothing else. */}
      <section className="section section-lg" aria-labelledby="work-title">
        <div className="wrap-wide">
          <div className={home.workStage}>
            <Reveal className={`sticky-rail ${home.workRail}`}>
              <p className="label label-accent">Selected work</p>
              <h2 id="work-title">Evidence of complete-system ownership.</h2>
              <p className="lede">
                Four records that span autonomy, engineering software, field electronics and regulated
                industrial automation. Each one states the problem, what I personally owned and what
                the evidence supports.
              </p>
            </Reveal>

            <div className={home.entries}>
              {selected.map((p, i) => {
                const variant = diagramFor(p.slug)
                const lead = i === 0
                const image = p.images?.[0]
                // The lead record is the second use of the layered parallax
                // stage. It has both a photograph plate and a signature
                // diagram, which is what gives the stage two real planes to
                // separate; the other three records have one asset each and
                // stay in ordinary flow.
                const showcase = lead && image !== undefined && variant != null
                return (
                  <Reveal
                    as="article"
                    variant="wipe"
                    key={p.slug}
                    className={`${home.entry} ${lead ? home.entryLead : ''} ${
                      i % 2 === 1 ? home.entryFlip : ''
                    }`}
                  >
                    <div className={home.entryHead}>
                      <p className={home.entryKicker}>
                        <span className={home.entryIndex}>{String(i + 1).padStart(2, '0')}</span>
                        <span className={home.entryDivider} aria-hidden="true">
                          /
                        </span>
                        <span>{p.domain}</span>
                        <span className={home.entryDivider} aria-hidden="true">
                          /
                        </span>
                        <span>{p.category}</span>
                      </p>
                      <h3 className={`${home.entryTitle} ${lead ? home.entryTitleLead : ''}`}>
                        <Link href={`/work/${p.slug}/`}>{p.title}</Link>
                      </h3>
                      <p className={home.entrySummary}>{p.summary}</p>
                    </div>

                    {showcase ? (
                      /* Sequenced rather than stacked: both planes carry
                         content that has to stay readable, so they travel at
                         different rates side by side instead of overlapping.
                         Each keeps its own description, and the stage names
                         the pairing once. */
                      <ParallaxStage
                        role="group"
                        label={`${p.title}: the delivered system alongside its signature diagram.`}
                        className={`stage-flow ${home.showcase}`}
                      >
                        <ParallaxLayer depth={0.2}>
                          <div className="media-frame">
                            {/* Not priority. The only thing above the fold on
                                this page is the hero, which is inline SVG and
                                costs no request; preloading a photograph three
                                screens down just took bandwidth off the fonts
                                the headline is waiting for. Measured on
                                throttled mobile: LCP 3.4s to 3.2s. */}
                            <ProjectImage image={image} />
                          </div>
                        </ParallaxLayer>
                        <ParallaxLayer depth={0.55}>
                          <SystemDiagram variant={variant} caption={diagramCaption(p.slug)} />
                        </ParallaxLayer>
                      </ParallaxStage>
                    ) : null}

                    <div className={home.entryBody}>
                      {showcase ? null : image ? (
                        <div className="media-frame">
                          <ProjectImage image={image} />
                        </div>
                      ) : variant ? (
                        <SystemDiagram variant={variant} />
                      ) : null}

                      <div className={home.entryDetail}>
                        <div className={home.fact}>
                          <span className={home.factLabel}>The problem</span>
                          <p className={home.factBody}>{p.problem}</p>
                        </div>
                        <div className={home.fact}>
                          <span className={home.factLabel}>What I owned</span>
                          <p className={home.factBody}>
                            {p.homeExcerpt?.ownership ?? p.demonstrates}
                          </p>
                        </div>
                        <div className={home.fact}>
                          <span className={home.factLabel}>Verified outcome</span>
                          <p className={home.factBody}>{p.homeExcerpt?.outcome ?? p.outcome}</p>
                        </div>
                        <div className={home.entryMeta}>
                          <span className={home.entryTags}>{p.disciplines.join('  ·  ')}</span>
                        </div>
                        <ArrowLink href={`/work/${p.slug}/`} className={home.entryLink}>
                          Read the case study
                        </ArrowLink>
                      </div>
                    </div>

                    {!showcase && image && variant ? (
                      <SystemDiagram
                        variant={variant}
                        caption={diagramCaption(p.slug)}
                      />
                    ) : null}
                  </Reveal>
                )
              })}
            </div>
          </div>

          <div className={home.entryFoot}>
            <ArrowLink href="/work/">See every record, including the archive</ArrowLink>
          </div>
        </div>
      </section>

      {/* ---------- Systems stack ---------- */}
      <section className="section stage-tint" aria-labelledby="stack-title">
        <div className="wrap-wide">
          <Reveal className={home.stageHeadSplit}>
            <div>
              <p className="label label-accent">End-to-end capability</p>
              <h2 id="stack-title">From physical architecture to verified behaviour.</h2>
            </div>
            <p className="lede">
              Ten layers I have exercised through real work. Explore the evidence behind each one
              rather than a proficiency score.
            </p>
          </Reveal>
          <StackSpine layers={systemsStack} />
        </div>
      </section>

      {/* ---------- Close ---------- */}
      <section className="section section-lg" aria-labelledby="cta-title">
        <div className={`wrap-wide ${home.cta}`}>
          <p className="label label-accent">Start a conversation</p>
          <h2 id="cta-title" className={home.ctaTitle}>
            Have an engineering problem that crosses disciplines?
          </h2>
          <p className="lede">
            Review the work, inspect the evidence behind it, or write to me directly.
          </p>
          <div className={home.ctaActions}>
            <a href={`mailto:${site.email}`} className="btn btn-primary">
              Send an email
            </a>
            <Link href="/work/" className="btn btn-secondary">
              Review selected work
            </Link>
            <Link href="/contact/" className="textlink">
              All contact channels
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/** One sentence naming what each signature diagram is showing. */
function diagramCaption(slug: string): string | undefined {
  switch (slug) {
    case 'autonomous-navigation-rover':
      return 'The planner at work: occupancy resolved from the LiDAR scan, then an obstacle-aware route committed across the map.'
    case 'engineering-mastery-lab':
      return 'Calculation, parametric CAD, guided labs and evidence workflows sharing one engineering core.'
    case 'iot-monitoring-platform':
      return 'The transport chain I built: equipment CAN and condition sensing, through a custom board and MikroTik edge connectivity, to a Linux server.'
    case 'jag-smart-factory':
      return 'The migration discipline: application content converted item by item, then verified against the existing validated system.'
    default:
      return undefined
  }
}
