'use client'

import { useMemo, useState } from 'react'
import { atlasDomains } from '@/content/atlas'

const clusters = ['All', 'Systems', 'Physical', 'Embedded', 'Controls', 'Software', 'Sectors', 'Assurance'] as const
type ClusterFilter = (typeof clusters)[number]

export function AtlasExplorer() {
  const [active, setActive] = useState<ClusterFilter>('All')
  const filtered = useMemo(
    () => active === 'All' ? atlasDomains : atlasDomains.filter((domain) => domain.cluster === active),
    [active],
  )

  return (
    <div className="atlas-explorer">
      <div className="atlas-filter" role="group" aria-label="Filter engineering atlas by discipline">
        {clusters.map((cluster) => (
          <button
            className="atlas-filter-button"
            data-active={active === cluster}
            key={cluster}
            onClick={() => setActive(cluster)}
            type="button"
          >
            {cluster}
          </button>
        ))}
      </div>

      <p className="atlas-result" aria-live="polite">
        Showing {filtered.length} of {atlasDomains.length} capability domains
      </p>

      <div className="atlas-grid">
        {filtered.map((domain, index) => (
          <article className="atlas-card" data-cluster={domain.cluster.toLowerCase()} key={domain.slug}>
            <header>
              <span className="atlas-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="evidence-badge">{domain.evidence}</span>
            </header>
            <p className="atlas-cluster">{domain.cluster}</p>
            <h3>{domain.name}</h3>
            <p className="atlas-summary">{domain.summary}</p>
            <div className="atlas-proof">
              <p className="meta-label">Evidence</p>
              <p>{domain.proof}</p>
            </div>
            <ul className="atlas-tools" aria-label={`${domain.name} tools and methods`}>
              {domain.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
            <details className="atlas-growth">
              <summary>Current growth edge</summary>
              <p>{domain.growth}</p>
            </details>
          </article>
        ))}
      </div>
    </div>
  )
}
