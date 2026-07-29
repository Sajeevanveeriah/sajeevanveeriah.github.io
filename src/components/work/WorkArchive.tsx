'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { TIER_ORDER, TIERS, byTierStrength, type EvidenceTier } from '@/content/tiers'
import type { Project } from '@/content/projects'
import s from '@/components/ui/shared.module.css'

const ALL = 'all'

/**
 * The full archive as a ruled list, not a card grid.
 *
 * Filtering runs entirely client-side over the static array already in the
 * bundle: no API, no fetch. The unfiltered list is the server-rendered first
 * state, so the archive is complete without JavaScript.
 */
export function WorkArchive({
  projects,
  disciplines,
}: {
  projects: readonly Project[]
  disciplines: readonly string[]
}) {
  const [discipline, setDiscipline] = useState<string>(ALL)
  const [tier, setTier] = useState<string>(ALL)

  const shown = useMemo(
    () =>
      projects
        .filter((p) => (discipline === ALL ? true : p.disciplines.includes(discipline)))
        .filter((p) => (tier === ALL ? true : p.evidenceTier === tier))
        .slice()
        .sort(byTierStrength),
    [projects, discipline, tier],
  )

  return (
    <>
      <div className={s.filterBar}>
        <div className={s.filterRow}>
          <span className={s.filterLabel} id="filter-discipline">
            Discipline
          </span>
          <div className={s.filterRow} role="group" aria-labelledby="filter-discipline">
            <button
              type="button"
              className={`${s.pill} ${discipline === ALL ? s.pillActive : ''}`}
              aria-pressed={discipline === ALL}
              onClick={() => setDiscipline(ALL)}
            >
              All
            </button>
            {disciplines.map((d) => (
              <button
                key={d}
                type="button"
                className={`${s.pill} ${discipline === d ? s.pillActive : ''}`}
                aria-pressed={discipline === d}
                onClick={() => setDiscipline(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className={s.filterRow}>
          <span className={s.filterLabel} id="filter-tier">
            Evidence
          </span>
          <div className={s.filterRow} role="group" aria-labelledby="filter-tier">
            <button
              type="button"
              className={`${s.pill} ${tier === ALL ? s.pillActive : ''}`}
              aria-pressed={tier === ALL}
              onClick={() => setTier(ALL)}
            >
              All
            </button>
            {TIER_ORDER.filter((t) => projects.some((p) => p.evidenceTier === t)).map((t) => (
              <button
                key={t}
                type="button"
                className={`${s.pill} ${tier === t ? s.pillActive : ''}`}
                aria-pressed={tier === t}
                onClick={() => setTier(t)}
              >
                {TIERS[t as EvidenceTier].label}
              </button>
            ))}
          </div>
        </div>

        <p className={s.count} aria-live="polite">
          Showing {shown.length} of {projects.length} records
        </p>
      </div>

      <div className={s.rows}>
        {shown.map((p) => (
          <article key={p.slug} className={s.row}>
            <div className={s.rowHead}>
              <h3 className={s.rowTitle}>
                <Link href={`/work/${p.slug}/`}>{p.title}</Link>
              </h3>
              <div className={s.rowMeta}>
                <span className={s.cat}>{p.category}</span>
                <TierIndicator tier={p.evidenceTier} />
                {p.period ? <span className={s.cat}>{p.period}</span> : null}
              </div>
            </div>
            <p className={s.rowSummary}>{p.summary}</p>
            <svg
              className={s.rowArrow}
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </article>
        ))}
      </div>
    </>
  )
}
