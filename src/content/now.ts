/**
 * The /now/ page scaffold.
 *
 * Structure only: every prose value below is a clearly marked TODO for Saj
 * to fill in his own words. Nothing here may be invented on his behalf, so
 * the page carries `noindex` until the placeholders are replaced, and each
 * placeholder renders visibly as awaiting content rather than pretending to
 * be a statement.
 */

export interface NowSection {
  readonly title: string
  /** TODO placeholder until Saj supplies the real copy. */
  readonly body: string
}

/** True while any body below still starts with TODO; drives the noindex. */
export function nowHasPlaceholders(): boolean {
  return nowSections.some((s) => s.body.startsWith('TODO'))
}

export const nowCopy = {
  kicker: 'Now',
  title: 'What I am focused on at the moment.',
  lede: 'TODO: Saj to supply a one-sentence framing of this page.',
  updated: 'TODO: Saj to supply the as-of date.',
} as const

export const nowSections: readonly NowSection[] = [
  {
    title: 'Current focus',
    body: 'TODO: Saj to describe the engineering work currently in front of him.',
  },
  {
    title: 'Learning',
    body: 'TODO: Saj to describe what he is currently studying or practising.',
  },
  {
    title: 'Building',
    body: 'TODO: Saj to describe what he is currently building.',
  },
] as const
