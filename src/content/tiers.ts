/**
 * The five-tier evidence model.
 *
 * Binding truthful-representation control, carried over from AGENTS.md.
 * Definitions are written in agentless capability voice (recast per the
 * owner's 7 August 2026 direction, meaning unchanged) and render wherever
 * the legend or an indicator explains a tier.
 *
 * Saj assigns every tier. No tier is ever inferred from a description, a
 * platform list, resume text or any other content. An entry with no
 * assignment carries `null` and renders no indicator at all.
 */

export type EvidenceTier =
  | 'delivered'
  | 'hands-on'
  | 'working-knowledge'
  | 'adjacent'
  | 'target'

export interface TierMeta {
  readonly id: EvidenceTier
  readonly label: string
  /** What the tier means, as defined by Saj. */
  readonly definition: string
  /**
   * Dot treatment. Never the sole signal: every indicator also renders its
   * visible text label and an aria-label, and all five remain
   * distinguishable in greyscale (WCAG 1.4.1).
   */
  readonly dot: 'solid' | 'half' | 'ringed' | 'hollow' | 'dashed'
  /** Descending strength, used for sorting within grouped views. */
  readonly strength: number
}

export const TIERS: Record<EvidenceTier, TierMeta> = {
  delivered: {
    id: 'delivered',
    label: 'Delivered',
    definition: 'Delivered in professional or assessed project work, and evidence of that delivery exists.',
    dot: 'solid',
    strength: 5,
  },
  'hands-on': {
    id: 'hands-on',
    label: 'Hands-on',
    definition: 'Built, tested, configured, analysed or used directly, first hand.',
    dot: 'half',
    strength: 4,
  },
  'working-knowledge': {
    id: 'working-knowledge',
    label: 'Working knowledge',
    definition: 'Known through credible study, coursework or self-directed learning.',
    dot: 'ringed',
    strength: 3,
  },
  adjacent: {
    id: 'adjacent',
    label: 'Adjacent',
    definition: 'Transferable exposure carried over from work on nearby systems.',
    dot: 'hollow',
    strength: 2,
  },
  target: {
    id: 'target',
    label: 'Target',
    definition: 'A growth domain being deliberately built toward.',
    dot: 'dashed',
    strength: 1,
  },
} as const

export const TIER_ORDER: readonly EvidenceTier[] = [
  'delivered',
  'hands-on',
  'working-knowledge',
  'adjacent',
  'target',
] as const

/** Sort strongest evidence first. */
export function byTierStrength(
  a: { evidenceTier: EvidenceTier | null },
  b: { evidenceTier: EvidenceTier | null },
): number {
  const s = (t: EvidenceTier | null) => (t ? TIERS[t].strength : 0)
  return s(b.evidenceTier) - s(a.evidenceTier)
}
