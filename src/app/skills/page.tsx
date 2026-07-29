import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierIndicator, TierLegend } from '@/components/ui/TierIndicator'
import { StackSpine } from '@/components/signal/StackSpine'
import { Reveal } from '@/components/motion/Reveal'
import { disciplines } from '@/content/skills'
import { systemsStack } from '@/content/systemsStack'
import s from '@/components/ui/shared.module.css'
import k from './skills.module.css'

export const metadata: Metadata = {
  title: 'Expertise',
  description:
    'My engineering toolchain across six territories, and the ten-layer systems stack that connects them from the physical layer to the intelligence layer.',
  alternates: { canonical: '/skills/' },
  openGraph: { title: 'Expertise', url: '/skills/' },
}

export default function SkillsPage() {
  return (
    <>
      <section className="section">
        <div className="wrap-wide">
          <PageHeader
          signature="strata"
            kicker="Expertise"
            title="My toolchain, shown in the context where I used it."
            lede="Six engineering territories. Each anchor platform is listed with the supporting toolset underneath it, and every capability here is backed by my resume, a case study or one of my roles."
            aside={
              <div className={s.railBlock}>
                <p className="label">Evidence tiers</p>
                <TierLegend compact />
              </div>
            }
          />

          <div className={k.territories}>
            {disciplines.map((d, i) => (
              <Reveal as="article" key={d.slug} className={k.territory}>
                <div className={k.territoryHead}>
                  <span className={k.territoryIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <h2 className={k.territoryName}>{d.name}</h2>
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section stage-tint" aria-labelledby="stack-title">
        <div className="wrap-wide">
          <Reveal className={k.stackHead}>
            <div>
              <p className="label label-accent">Systems stack</p>
              <h2 id="stack-title">
                One integrated capability, from the physical layer to the intelligence layer.
              </h2>
            </div>
            <p className="lede">
              I have exercised these ten layers through real work. They are listed as one spine
              rather than ten boxes, because that is how they actually behave.
            </p>
          </Reveal>
          <StackSpine layers={systemsStack} />
        </div>
      </section>
    </>
  )
}
