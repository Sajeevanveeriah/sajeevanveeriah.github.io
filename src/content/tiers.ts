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

/* ============================================================
   Evidence states
   ============================================================ */

/**
 * What a record's evidence actually is, stated per record.
 *
 * The five tiers above answer "how strong is this claim". They are kept,
 * because the atlas and the archive filter are built on them. This second
 * vocabulary answers a different and more useful question for a reader
 * looking at one project: what kind of thing exists, and where can it be
 * seen. "Delivered" was the same word on a client robot in daily use, a
 * simulation-validated stack and an assessed university prototype, and that
 * flattening is what this replaces.
 *
 * Assigned record by record from the evidence already published in
 * `projects.ts`. No state is inferred from a category, a tier or a title,
 * and no record shares a state simply because it shares a client.
 */
export type EvidenceState =
  | 'Active client deployment'
  | 'Deployed physical system'
  | 'Deployed software system'
  | 'Simulation-validated autonomy stack'
  | 'Assessed embedded prototype'
  | 'Hands-on professional integration'
  | 'Locally deployed private system'
  | 'Concept development'

export const EVIDENCE_STATE_DEFINITION: Record<EvidenceState, string> = {
  'Active client deployment':
    'Delivered to a client, deployed, and in active use by its end-users.',
  'Deployed physical system': 'A physical system built, deployed and in use.',
  'Deployed software system': 'Software built, released and reachable at a public address.',
  'Simulation-validated autonomy stack':
    'A complete autonomy stack exercised and re-run deterministically in simulation. Field deployment is not claimed.',
  'Assessed embedded prototype':
    'Embedded hardware and firmware built and assessed, with measurements checked against references. Certification is not claimed.',
  'Hands-on professional integration':
    'Delivered inside a professional engineering environment, with the client evidence retained by the client.',
  'Locally deployed private system':
    'Built and running on personally owned hardware. There is no public endpoint to inspect.',
  'Concept development':
    'Developed and exercised against simulated inputs. Connection to live equipment is a later step.',
} as const

/** Sort strongest evidence first. */
export function byTierStrength(
  a: { evidenceTier: EvidenceTier | null },
  b: { evidenceTier: EvidenceTier | null },
): number {
  const s = (t: EvidenceTier | null) => (t ? TIERS[t].strength : 0)
  return s(b.evidenceTier) - s(a.evidenceTier)
}
