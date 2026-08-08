import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierIndicator, TierLegend } from '@/components/ui/TierIndicator'
import { StackSpine } from '@/components/signal/StackSpine'
import { ClosedLoop } from '@/components/signal/ClosedLoop'
import { SystemBoundary } from '@/components/signal/SystemBoundary'
import { Reveal } from '@/components/motion/Reveal'
import { disciplines } from '@/content/skills'
import { systemsStack } from '@/content/systemsStack'
import { pillars, supportingFoundation } from '@/content/specialism'
import { closedLoop } from '@/content/about'
import { ecosystemLibrary } from '@/content/library'
import s from '@/components/ui/shared.module.css'
import k from './skills.module.css'

export const metadata: Metadata = {
  title: 'Expertise',
  description:
    'Three specialist pillars: autonomous robotic systems, embedded mechatronic systems, and integration and verification, each held to the evidence behind it.',
  alternates: { canonical: '/skills/' },
  openGraph: { title: 'Expertise', url: '/skills/' },
}

/**
 * `Reveal` forwards `className` only, so the pillar hue travels as a class
 * rather than as a `data-layer` attribute. Keyed by the same ids the tokens
 * and the boundary layers use, so the three surfaces stay in step.
 */
const LAYER_CLASS: Record<string, string> = {
  autonomy: k.layerAutonomy ?? '',
  control: k.layerControl ?? '',
  verify: k.layerVerify ?? '',
}

export default function SkillsPage() {
  return (
    <>
      <section className="section">
        <div className="wrap-wide">
          <PageHeader
            signature="strata"
            kicker="Expertise"
            title="Three pillars, one specialism."
            lede="Autonomous mobile robotics and embedded intelligent systems, and the two capability groups that make one deliverable rather than demonstrable."
            aside={
              <div className={s.railBlock}>
                <p className="label">Evidence tiers</p>
                <TierLegend compact />
              </div>
            }
          />

          <div className={k.pillars}>
            {pillars.map((pillar) => (
              <Reveal
                as="article"
                key={pillar.id}
                className={`${k.pillar} ${LAYER_CLASS[pillar.id] ?? ''}`}
              >
                <div className={k.pillarHead}>
                  <span className={k.pillarIndex} aria-hidden="true">
                    {pillar.index}
                  </span>
                  <h2 className={k.pillarName} id={pillar.id}>
                    {pillar.name}
                  </h2>
                </div>

                <p className={k.pillarSummary}>{pillar.summary}</p>

                <div className={k.pillarBody}>
                  <div className={k.pillarBlock}>
                    <p className="label">Verified capability</p>
                    <ul className={k.capabilities}>
                      {pillar.capabilities.map((c) => (
                        <li key={c} className={k.capability}>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={k.pillarBlock}>
                    <p className="label">Evidence boundary</p>
                    <p className={k.boundary}>{pillar.boundary}</p>
                  </div>

                  <div className={k.pillarBlock}>
                    <p className="label">Records</p>
                    <ul className={k.records}>
                      {pillar.records.map((r) => (
                        <li key={r.href}>
                          <Link className="textlink" href={r.href}>
                            {r.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The system-boundary model, repeated here because this is the page
          where a reader is deciding whether the breadth is real. It is the
          same component and the same content as the home page, so the two
          cannot say different things. */}
      <section className="section stage-tint" aria-labelledby="expertise-boundary-title">
        <div className="wrap-wide">
          <Reveal>
            <SystemBoundary headingId="expertise-boundary-title" />
          </Reveal>
        </div>
      </section>

      {/* Closed-loop engineering. Moved here from the home page on the
          6 August 2026 repositioning: it is a capability argument rather
          than a conversion step, and it belongs beside the pillars it
          explains. The component and its content are unchanged. */}
      <section className="section" aria-labelledby="loop-title">
        <div className="wrap-wide">
          <Reveal className={k.stackHead}>
            <div>
              <p className="label label-accent">How the work is done</p>
              <h2 id="loop-title">{closedLoop.title}</h2>
            </div>
            <p className="lede">{closedLoop.summary}</p>
          </Reveal>
          <ClosedLoop />
        </div>
      </section>

      <section className="section stage-tint" aria-labelledby="stack-title">
        <div className="wrap-wide">
          <Reveal className={k.stackHead}>
            <div>
              <p className="label label-accent">{supportingFoundation.kicker}</p>
              <h2 id="stack-title">{supportingFoundation.title}</h2>
            </div>
            <p className="lede">{supportingFoundation.body}</p>
          </Reveal>
          <StackSpine layers={systemsStack} />
        </div>
      </section>

      {/* The detailed matrix, kept for recruiters and technical readers and
          placed behind progressive disclosure so it supports the specialist
          story rather than competing with it. It renders complete without
          JavaScript: `<details>` is native. */}
      <section className="section" aria-labelledby="matrix-title">
        <div className="wrap-wide">
          <Reveal>
            <p className="label label-accent">Detailed capability</p>
            <h2 id="matrix-title" className={k.matrixTitle}>
              The full toolchain, for searching.
            </h2>

            <details className={k.matrix}>
              <summary className={k.matrixSummary}>
                Show every tool territory
                <span className={k.matrixChevron} aria-hidden="true" />
              </summary>

              <div className={k.territories}>
                {disciplines.map((d, i) => (
                  <article key={d.slug} className={k.territory}>
                    <div className={k.territoryHead}>
                      <span className={k.territoryIndex}>{String(i + 1).padStart(2, '0')}</span>
                      <h3 className={k.territoryName}>{d.name}</h3>
                      <TierIndicator tier={d.evidenceTier} note={d.tierNote} />
                    </div>

                    <div className={k.territoryBody}>
                      <p className={k.territorySummary}>{d.summary}</p>

                      <div className={k.platformBlock}>
                        <p className="label">Anchor platforms</p>
                        <ul className={k.platforms}>
                          {d.platforms.map((p) => (
                            <li key={p} className={k.platform}>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {d.protocols?.length ? (
                        <div className={k.platformBlock}>
                          <p className="label">Supporting toolset</p>
                          <p className={k.protocols}>{d.protocols.join('  ·  ')}</p>
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </details>

            <p className={k.ecosystemLink}>
              The <Link href="/ecosystem/">{ecosystemLibrary.name}</Link> maps the wider field.{' '}
              {ecosystemLibrary.disclaimer}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
