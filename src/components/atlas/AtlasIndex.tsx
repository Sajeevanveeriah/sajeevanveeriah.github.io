'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { TIER_ORDER, TIERS, type EvidenceTier } from '@/content/tiers'
import { CLUSTER_LABEL, type AtlasDomain, type AtlasCluster } from '@/content/atlas'
import type { SystemsLayer } from '@/content/systemsStack'
import { RevealGroup, RevealItem } from '@/components/motion/Reveal'
import s from '@/components/ui/shared.module.css'

const ALL = 'all'

/**
 * Index cards render name and summary only. The six narrative fields live on
 * /atlas/[domain] so this page never runs long. Search and both filters are
 * client-side over the static array.
 */
export function AtlasIndex({
  domains,
  layers,
}: {
  domains: readonly AtlasDomain[]
  layers: readonly SystemsLayer[]
}) {
  const [query, setQuery] = useState('')
  const [cluster, setCluster] = useState<string>(ALL)
  const [layer, setLayer] = useState<string>(ALL)
  const [tier, setTier] = useState<string>(ALL)

  const layerCluster = useMemo(
    () => new Map(layers.map((l) => [l.slug, l.cluster])),
    [layers],
  )

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return domains
      .filter((d) => (cluster === ALL ? true : d.cluster === cluster))
      .filter((d) => (tier === ALL ? true : d.evidenceTier === tier))
      .filter((d) => (layer === ALL ? true : d.cluster === layerCluster.get(layer)))
      .filter((d) =>
        q.length === 0
          ? true
          : `${d.name} ${d.summary} ${d.subdomains.join(' ')} ${d.platforms.join(' ')}`
              .toLowerCase()
              .includes(q),
      )
  }, [domains, query, cluster, tier, layer, layerCluster])

  return (
    <>
      <div className={s.filterBar}>
        <div className={s.filterRow}>
          <label className="mono-label" htmlFor="atlas-search">
            Search
          </label>
          <input
            id="atlas-search"
            type="search"
            className={s.search}
            placeholder="Search domains, subdomains and tools"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className={s.filterRow} role="group" aria-label="Filter by discipline">
          <span className="mono-label">Discipline</span>
          <button
            type="button"
            className={`${s.pill} ${cluster === ALL ? s.pillActive : ''}`}
            aria-pressed={cluster === ALL}
            onClick={() => setCluster(ALL)}
          >
            All
          </button>
          {(Object.keys(CLUSTER_LABEL) as AtlasCluster[])
            .filter((c) => domains.some((d) => d.cluster === c))
            .map((c) => (
              <button
                key={c}
                type="button"
                className={`${s.pill} ${cluster === c ? s.pillActive : ''}`}
                aria-pressed={cluster === c}
                onClick={() => setCluster(c)}
              >
                {CLUSTER_LABEL[c]}
              </button>
            ))}
        </div>

        <div className={s.filterRow} role="group" aria-label="Filter by systems layer">
          <span className="mono-label">Systems layer</span>
          <button
            type="button"
            className={`${s.pill} ${layer === ALL ? s.pillActive : ''}`}
            aria-pressed={layer === ALL}
            onClick={() => setLayer(ALL)}
          >
            All
          </button>
          {layers.map((l) => (
            <button
              key={l.slug}
              type="button"
              className={`${s.pill} ${layer === l.slug ? s.pillActive : ''}`}
              aria-pressed={layer === l.slug}
              onClick={() => setLayer(l.slug)}
            >
              {l.name}
            </button>
          ))}
        </div>

        <div className={s.filterRow} role="group" aria-label="Filter by evidence tier">
          <span className="mono-label">Evidence</span>
          <button
            type="button"
            className={`${s.pill} ${tier === ALL ? s.pillActive : ''}`}
            aria-pressed={tier === ALL}
            onClick={() => setTier(ALL)}
          >
            All
          </button>
          {TIER_ORDER.filter((t) => domains.some((d) => d.evidenceTier === t)).map((t) => (
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
        {shown.length} of {domains.length} domains shown
      </p>

      <RevealGroup className={`${s.grid} ${s.gridDense}`} stagger={0.03}>
        {shown.map((d) => (
          <RevealItem key={d.slug} as="article" className={s.card}>
            <div className={s.meta}>
              <span className={s.cat}>{CLUSTER_LABEL[d.cluster]}</span>
              <TierIndicator tier={d.evidenceTier} />
            </div>
            <h2 className={s.cardTitle} style={{ fontSize: 'var(--text-lg)' }}>
              <Link href={`/atlas/${d.slug}/`}>{d.name}</Link>
            </h2>
            <p className={s.body}>{d.summary}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  )
}
