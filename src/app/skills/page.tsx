import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierIndicator, TierLegend } from '@/components/ui/TierIndicator'
import { StackLadder } from '@/components/skills/StackLadder'
import { disciplines } from '@/content/skills'
import { atlas, type AtlasDomain } from '@/content/atlas'
import { systemsStack } from '@/content/systemsStack'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Skills',
  description:
    'One coherent toolchain across six engineering territories, plus the ten-layer Systems Stack linking every layer to its Atlas domains.',
  alternates: { canonical: '/skills/' },
  openGraph: { title: 'Skills', url: '/skills/' },
}

export default function SkillsPage() {
  const domainsByCluster = atlas.reduce<Record<string, AtlasDomain[]>>((acc, d) => {
    ;(acc[d.cluster] ??= []).push(d)
    return acc
  }, {})

  return (
    <>
      <section className="section">
        <div className="wrap">
          <PageHeader
            kicker="03 / Skill Library"
            title="One coherent toolchain across six engineering territories."
            lede="Anchor platforms are shown with the context they were used in; the supporting toolset sits underneath. Everything listed is verified by the resume, a case study or a role on this site."
          >
            <div className={s.railBlock}>
              <TierLegend compact />
            </div>
          </PageHeader>

          <div className={`${s.grid} ${s.grid3}`}>
            {disciplines.map((d) => (
              <article key={d.slug} className={s.card}>
                <div className={s.meta}>
                  <TierIndicator tier={d.evidenceTier} note={d.tierNote} />
                </div>
                <h2 className={s.cardTitle} style={{ fontSize: 'var(--text-lg)' }}>
                  {d.name}
                </h2>
                <ul className={s.chips} aria-label="Anchor platforms">
                  {d.platforms.map((p) => (
                    <li key={p} className={s.chip}>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className={s.body}>{d.summary}</p>
                {d.protocols?.length ? (
                  <p className={s.body} style={{ color: 'var(--text-faint)' }}>
                    {d.protocols.join(' / ')}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="stack-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className={s.header}>
            <p className="mono-label">04 / Systems Stack</p>
            <h2 id="stack-title">One integrated capability, from the physical layer to the intelligence layer.</h2>
            <p className={s.lede}>
              Ten layers, each exercised through real work. Select a layer to see the Atlas domains
              operating there.
            </p>
          </div>
          <StackLadder layers={systemsStack} domainsByCluster={domainsByCluster} />
        </div>
      </section>
    </>
  )
}
