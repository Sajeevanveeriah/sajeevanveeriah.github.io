import { EVIDENCE_STATE_DEFINITION, type EvidenceState as State } from '@/content/tiers'
import s from './EvidenceState.module.css'

/**
 * A record's evidence state, shown as written words first.
 *
 * The five-tier indicator answers "how strong is the claim" and is kept
 * where the archive filters on it. This answers the question a reader
 * looking at one project actually has: what exists, and where can it be
 * seen. `Delivered` said the same thing about a client robot in daily use, a
 * simulation-validated stack and an assessed university prototype.
 *
 * The state text is always rendered. The disc is a second channel carrying
 * the same distinction so it survives greyscale, and the `title` carries the
 * definition for a reader who wants it. Colour is never the only signal.
 */
const KIND: Record<State, 'deployed' | 'validated' | 'professional' | 'development'> = {
  'Active client deployment': 'deployed',
  'Deployed physical system': 'deployed',
  'Deployed software system': 'deployed',
  'Simulation-validated autonomy stack': 'validated',
  'Assessed embedded prototype': 'validated',
  'Hands-on professional integration': 'professional',
  'Locally deployed private system': 'deployed',
  'Concept development': 'development',
}

/** Whether the thing is running in the world, or exercised in a controlled setting. */
const LIVE: Record<State, boolean> = {
  'Active client deployment': true,
  'Deployed physical system': true,
  'Deployed software system': true,
  'Simulation-validated autonomy stack': false,
  'Assessed embedded prototype': false,
  'Hands-on professional integration': true,
  'Locally deployed private system': true,
  'Concept development': false,
}

export function EvidenceStateChip({
  state,
  className,
}: {
  state: State | null
  className?: string
}) {
  if (!state) return null
  return (
    <span
      className={`${s.state} ${className ?? ''}`}
      data-kind={KIND[state]}
      data-live={String(LIVE[state])}
      title={EVIDENCE_STATE_DEFINITION[state]}
    >
      <span className={s.mark} aria-hidden="true" />
      {state}
    </span>
  )
}

/** The disclosure boundary that goes with a state, where a record has one. */
export function EvidenceNote({ note }: { note?: string }) {
  if (!note) return null
  return <span className={s.note}>{note}</span>
}
