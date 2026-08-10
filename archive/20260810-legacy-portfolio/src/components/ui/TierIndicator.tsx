import { TIERS, TIER_ORDER, type EvidenceTier } from '@/content/tiers'
import styles from './TierIndicator.module.css'

/**
 * Evidence tier as a status-LED indicator.
 *
 * Accessibility rules, all mandatory:
 *   - Tier is never signalled by colour alone (WCAG 1.4.1). Each tier has a
 *     distinct dot geometry, a visible text label and an aria-label.
 *   - All five remain distinguishable in greyscale, because they differ in
 *     shape and fill, not hue.
 *   - `target` is structurally different, a dashed diamond rather than a
 *     circle, so a quick scan cannot mistake intent for delivered capability.
 *   - The dot never animates in a way that pulls attention off the content.
 */
export function TierIndicator({
  tier,
  note,
  className,
}: {
  tier: EvidenceTier | null
  note?: string
  className?: string
}) {
  // An entry with no assigned tier renders no indicator at all.
  if (!tier) return null

  const meta = TIERS[tier]
  const label = note ? `${meta.label}, ${note}` : meta.label

  return (
    <span className={`${styles.chip} ${className ?? ''}`}>
      <span
        className={`${styles.dot} ${styles[meta.dot]}`}
        aria-hidden="true"
        data-tier={tier}
      />
      <span aria-label={`Evidence tier: ${label}`}>{label}</span>
    </span>
  )
}

export function TierLegend({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`${styles.legend} ${compact ? styles.legendCompact : ''}`}>
      {TIER_ORDER.map((id) => {
        const meta = TIERS[id]
        return (
          <li key={id} className={styles.legendItem}>
            <span className={`${styles.dot} ${styles[meta.dot]}`} aria-hidden="true" data-tier={id} />
            <span>
              <strong className={styles.legendLabel}>{meta.label}</strong>{' '}
              <span className={styles.legendDef}>{meta.definition}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
