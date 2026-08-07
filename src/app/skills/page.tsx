import type { Metadata } from 'next'
import Link from 'next/link'
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
    "Sajeevan's engineering toolchain across six territories and the ten-layer systems stack connecting physical systems, embedded intelligence, autonomy, software and validation.",
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
            title="Sajeevan's toolchain, connected to the work behind it."
            lede="Six engineering territories, each linked to the platforms, supporting tools and evidence behind his experience."
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
                One engineering practice, from physical architecture to embedded intelligence and validation.
              </h2>
            </div>
            <p className="lede">
              Sajeevan has applied these ten layers across professional, university and personal
              engineering work. They are shown as one connected stack because system behaviour
              depends on the interfaces between them.
            </p>
          </Reveal>
          <StackSpine layers={systemsStack} />

          <Reveal className={k.ecosystemLink}>
            <p>
              The <Link href="/ecosystem/">ecosystem catalogue</Link> maps the wider field across
              eight pillars and 31 domains. It is a reference library, separate from the experience
              shown here.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
