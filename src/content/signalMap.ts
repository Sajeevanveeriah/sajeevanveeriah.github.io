/**
 * Homepage Signal Map copy.
 *
 * The map itself is derived at build time from the other content files:
 * record counts from projects.ts, domain clusters and tiers from atlas.ts
 * and the ten layers from systemsStack.ts. Nothing here restates a number,
 * so the panel can never drift from the content it summarises. What lives
 * here is only the wording, because no copy belongs in a component.
 */

export interface ReaderRoute {
  readonly label: string
  readonly description: string
  readonly href: string
}

export interface SignalMapCopy {
  readonly eyebrow: string
  readonly title: string
  readonly lede: string
  /** Heading for the visually hidden ordered summary. */
  readonly summaryHeading: string
  readonly recordsHeading: string
  readonly recordsNote: string
  readonly recordsLink: string
  readonly clustersHeading: string
  readonly tiersHeading: string
  readonly layersHeading: string
  readonly routes: readonly ReaderRoute[]
}

export const signalMap: SignalMapCopy = {
  eyebrow: 'Signal map',
  title: 'The whole site, one view.',
  lede: 'Sajeevan attaches every claim on this site to its evidence. This map counts what is here, and every line in it is a path to that evidence.',
  summaryHeading: 'Site summary',
  recordsHeading: 'Work records',
  recordsNote: 'Case studies stating what Sajeevan owned, how he checked it and what he delivered.',
  recordsLink: 'Open every record',
  clustersHeading: 'Atlas domains',
  tiersHeading: 'Evidence tiers',
  layersHeading: 'Capability layers',
  routes: [
    {
      label: 'See something working',
      description: 'Interactive demonstrations Sajeevan wrote to make his core techniques legible.',
      href: '/lab/',
    },
    {
      label: 'Read the deepest record',
      description: 'The autonomous rover: sensing, estimation, planning and control as one system.',
      href: '/work/autonomous-navigation-rover/',
    },
    {
      label: 'Inspect all evidence',
      description: 'Every domain Sajeevan claims, held at the tier its evidence supports.',
      href: '/atlas/',
    },
  ],
} as const
