'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { TIER_ORDER, TIERS, type EvidenceTier } from '@/content/tiers'
import { CLUSTER_LABEL, type AtlasDomain, type AtlasCluster } from '@/content/atlas'
import s from '@/components/ui/shared.module.css'

const ALL = 'all'

const CLUSTER_ORDER: readonly AtlasCluster[] = [
  'systems',
  'physical',
  'embedded',
  'controls',
  'software',
  'sectors',
  'assurance',
]

/**
 * The atlas as a searchable ruled index grouped by cluster.
 *
 * Search and filters are progressive enhancement: the server-rendered first
 * state is the complete, grouped list of every domain.
 */
export function AtlasIndex({
  domains,
  recordTitles = {},
}: {
  domains: readonly AtlasDomain[]
  /** Slug-to-title lookup for the evidence links, built by the server page. */
  recordTitles?: Readonly<Record<string, string>>
}) {
  const [query, setQuery] = useState('')
  const [cluster, setCluster] = useState<string>(ALL)
  const [tier, setTier] = useState<string>(ALL)

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return domains
      .filter((d) => (cluster === ALL ? true : d.cluster === cluster))
      .filter((d) => (tier === ALL ? true : d.evidenceTier === tier))
      .filter((d) =>
        q
          ? [d.name, d.summary, ...d.subdomains, ...d.platforms]
              .join(' ')
              .toLowerCase()
              .includes(q)
          : true,
      )
  }, [domains, query, cluster, tier])

  const grouped = CLUSTER_ORDER.map((c) => ({
    cluster: c,
    items: shown.filter((d) => d.cluster === c),
  })).filter((g) => g.items.length > 0)

  return (
    <>
      <div className={s.filterBar}>
        <label className="visually-hidden" htmlFor="atlas-search">
          Search the atlas
        </label>
        <input
          id="atlas-search"
          className={s.search}
          type="search"
          placeholder="Search domains, subdomains and tools"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className={s.filterRow}>
          <span className={s.filterLabel} id="atlas-cluster">
            Cluster
          </span>
          <div className={s.filterRow} role="group" aria-labelledby="atlas-cluster">
            <button
              type="button"
              className={`${s.pill} ${cluster === ALL ? s.pillActive : ''}`}
              aria-pressed={cluster === ALL}
              onClick={() => setCluster(ALL)}
            >
              All
            </button>
            {CLUSTER_ORDER.map((c) => (
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
        </div>

        <div className={s.filterRow}>
          <span className={s.filterLabel} id="atlas-tier">
            Evidence
          </span>
          <div className={s.filterRow} role="group" aria-labelledby="atlas-tier">
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
          Showing {shown.length} of {domains.length} domains
        </p>
      </div>

      {grouped.map((g) => (
        <section key={g.cluster} className={s.atlasGroup}>
          <h2 className={s.atlasGroupTitle}>{CLUSTER_LABEL[g.cluster]}</h2>
          <div className={s.rows}>
            {g.items.map((d) => (
              <article key={d.slug} className={s.row}>
                <div className={s.rowHead}>
                  <h3 className={s.rowTitle}>
                    <Link href={`/atlas/${d.slug}/`}>{d.name}</Link>
                  </h3>
                  <div className={s.rowMeta}>
                    <TierIndicator tier={d.evidenceTier} />
                  </div>
                </div>
                <p className={s.rowSummary}>{d.summary}</p>
                {d.relatedProjects.length > 0 ? (
                  <p className={s.rowEvidence}>
                    <span className={s.rowEvidenceLabel}>Evidenced by</span>
                    {d.relatedProjects
                      .filter((slug) => recordTitles[slug])
                      .map((slug, i, arr) => (
                        <span key={slug}>
                          <Link
                            href={`/work/${slug}/`}
                            className={s.rowEvidenceLink}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {recordTitles[slug]}
                          </Link>
                          {i < arr.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                  </p>
                ) : null}
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
        </section>
      ))}

      {grouped.length === 0 ? (
        <p className={s.count}>No domain matches that search. Clear the filters to see all.</p>
      ) : null}
    </>
  )
}
