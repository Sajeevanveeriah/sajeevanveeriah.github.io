'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { CLUSTER_LABEL, type AtlasDomain } from '@/content/atlas'
import type { SystemsLayer } from '@/content/systemsStack'
import styles from './StackLadder.module.css'

/**
 * The Systems Stack ladder: the navigation spine between /skills and /atlas.
 *
 * Selecting a rung reveals the Atlas domains operating at that layer, each
 * linking to /atlas/[domain]. This reproduces the previous site's behaviour,
 * where choosing a stack layer pre-filtered the Atlas by cluster.
 *
 * Rendered as a real list of buttons so it is fully keyboard operable. With
 * JavaScript off every rung and its layer detail is still present in the
 * markup; only the reveal interaction is lost.
 */
export function StackLadder({
  layers,
  domainsByCluster,
}: {
  layers: readonly SystemsLayer[]
  domainsByCluster: Record<string, readonly AtlasDomain[]>
}) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <ol className={styles.ladder}>
      {layers.map((layer) => {
        const open = active === layer.slug
        const domains = domainsByCluster[layer.cluster] ?? []
        const panelId = `layer-${layer.slug}`
        return (
          <li key={layer.slug} className={`${styles.rung} ${open ? styles.rungOpen : ''}`}>
            <button
              type="button"
              className={styles.rungButton}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setActive(open ? null : layer.slug)}
            >
              <span className={styles.index} aria-hidden="true">
                {String(layer.order).padStart(2, '0')}
              </span>
              <span className={styles.body}>
                <span className={styles.name}>{layer.name}</span>
                <span className={styles.desc}>{layer.description}</span>
                <span className={styles.tools}>{layer.tools.join(' / ')}</span>
              </span>
              <TierIndicator tier={layer.evidenceTier} note={layer.tierNote} />
            </button>
            <div id={panelId} className={styles.panel} hidden={!open}>
              <p className="mono-label">
                {CLUSTER_LABEL[layer.cluster]}, {domains.length} atlas domains at this layer
              </p>
              <ul className={styles.domainList}>
                {domains.map((d) => (
                  <li key={d.slug}>
                    <Link href={`/atlas/${d.slug}/`} className={styles.domainLink}>
                      {d.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
