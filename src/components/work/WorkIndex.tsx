'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { TIER_ORDER, TIERS, byTierStrength, type EvidenceTier } from '@/content/tiers'
import type { Project } from '@/content/projects'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'
import s from '@/components/ui/shared.module.css'

const ALL = 'all'

/**
 * Filtering is entirely client-side over the static array shipped in the
 * bundle: no API, no fetch.
 */
export function WorkIndex({
  projects,
  domains,
  disciplines,
}: {
  projects: readonly Project[]
  domains: readonly string[]
  disciplines: readonly string[]
}) {
  const [domain, setDomain] = useState<string>(ALL)
  const [discipline, setDiscipline] = useState<string>(ALL)
  const [tier, setTier] = useState<string>(ALL)

  const shown = useMemo(
    () =>
      projects
        .filter((p) => (domain === ALL ? true : p.domain === domain))
        .filter((p) => (discipline === ALL ? true : p.disciplines.includes(discipline)))
        .filter((p) => (tier === ALL ? true : p.evidenceTier === tier))
        .slice()
        .sort(byTierStrength),
    [projects, domain, discipline, tier],
  )

  const group = (
    label: string,
    value: string,
    set: (v: string) => void,
    options: readonly { id: string; label: string }[],
  ) => (
    <div className={s.filterRow} role="group" aria-label={`Filter work by ${label.toLowerCase()}`}>
      <span className="mono-label">{label}</span>
      <button
        type="button"
        className={`${s.pill} ${value === ALL ? s.pillActive : ''}`}
        aria-pressed={value === ALL}
        onClick={() => set(ALL)}
      >
        All
      </button>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`${s.pill} ${value === o.id ? s.pillActive : ''}`}
          aria-pressed={value === o.id}
          onClick={() => set(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <div className={s.filterBar}>
        {group(
          'Domain',
          domain,
          setDomain,
          domains.map((d) => ({ id: d, label: d })),
        )}
        {group(
          'Discipline',
          discipline,
          setDiscipline,
          disciplines.map((d) => ({ id: d, label: d })),
        )}
        {group(
          'Evidence',
          tier,
          setTier,
          TIER_ORDER.filter((t) => projects.some((p) => p.evidenceTier === t)).map((t) => ({
            id: t,
            label: TIERS[t as EvidenceTier].label,
          })),
        )}
      </div>

      <p className={s.count} aria-live="polite">
        {shown.length} of {projects.length} records shown
      </p>

      <RevealGroup className={`${s.grid} ${s.grid3}`} stagger={0.04}>
        {shown.map((p) => (
          <RevealItem key={p.slug} as="article" className={s.card}>
            <div className={s.meta}>
              <span className={s.cat}>{p.category}</span>
              <TierIndicator tier={p.evidenceTier} />
            </div>
            <h2 className={s.cardTitle} style={{ fontSize: 'var(--text-lg)' }}>
              <Link href={`/work/${p.slug}/`}>{p.title}</Link>
            </h2>
            <p className={s.body}>{p.summary}</p>
            <ul className={s.chips} aria-label="Key tools">
              {p.stack.slice(0, 4).map((t) => (
                <li key={t} className={s.chip}>
                  {t}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  )
}
