/**
 * Field notes: a writing section scaffold.
 *
 * The entry list is deliberately empty. Entries are added here by Saj, each
 * with its own slug, title, summary and date; nothing is ghost-written for
 * him. While the list is empty the index renders an honest holding state and
 * carries `noindex`.
 */

export interface FieldNote {
  readonly slug: string
  readonly title: string
  readonly summary: string
  /** Written as "12 Mar 2026"; never a range with dashes. */
  readonly date: string
}

export const notesCopy = {
  kicker: 'Field notes',
  title: 'Notes from the workbench.',
  lede: 'TODO: Saj to supply a one-sentence framing of what this section will carry.',
  emptyState:
    'Notes are being drafted. Until the first one is published, the work records carry the detailed writing on this site.',
} as const

export const notes: readonly FieldNote[] = [] as const
