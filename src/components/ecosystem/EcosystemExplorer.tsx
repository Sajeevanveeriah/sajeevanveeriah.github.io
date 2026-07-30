'use client'

import { useMemo, useState, useId } from 'react'
import Link from 'next/link'
import s from '@/components/ui/shared.module.css'
import e from './ecosystem.module.css'

/**
 * The catalogue index as a searchable, filterable list.
 *
 * Progressive enhancement, on the same terms as the atlas index: the server
 * renders the complete grouped list of every entry, and this component only
 * narrows it. With JavaScript disabled the reader still sees all of it, and
 * every row still links to the full record on its pillar page.
 *
 * Only a compact projection of each entity reaches the client. The full
 * summaries, models, sources and lifecycle notes live on the pillar pages,
 * which is what keeps this route off the heaviest-bundle list while still
 * making the whole catalogue searchable from one place.
 */

export interface ExplorerRow {
  readonly id: string
  readonly name: string
  readonly vendor: string
  readonly pillarId: string
  readonly pillarSlug: string
  readonly pillarName: string
  readonly domainNames: readonly string[]
  readonly kind: string
  readonly kindLabel: string
  readonly lifecycle: string
  readonly lifecycleLabel: string
  readonly slug: string
  /** Everything the search matches on, pre-lowercased at build time. */
  readonly haystack: string
}

export interface FacetOption {
  readonly value: string
  readonly label: string
}

const ALL = 'all'

export function EcosystemExplorer({
  rows,
  pillars,
  kinds,
  lifecycles,
}: {
  rows: readonly ExplorerRow[]
  pillars: readonly FacetOption[]
  kinds: readonly FacetOption[]
  lifecycles: readonly FacetOption[]
}) {
  const [query, setQuery] = useState('')
  const [pillar, setPillar] = useState<string>(ALL)
  const [kind, setKind] = useState<string>(ALL)
  const [lifecycle, setLifecycle] = useState<string>(ALL)
  const searchId = useId()

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter((r) => (pillar === ALL ? true : r.pillarId === pillar))
      .filter((r) => (kind === ALL ? true : r.kind === kind))
      .filter((r) => (lifecycle === ALL ? true : r.lifecycle === lifecycle))
      .filter((r) => (q ? r.haystack.includes(q) : true))
  }, [rows, query, pillar, kind, lifecycle])

  const grouped = pillars
    .map((p) => ({ pillar: p, items: shown.filter((r) => r.pillarId === p.value) }))
    .filter((g) => g.items.length > 0)

  const filtered = query.trim() !== '' || pillar !== ALL || kind !== ALL || lifecycle !== ALL

  const clear = () => {
    setQuery('')
    setPillar(ALL)
    setKind(ALL)
    setLifecycle(ALL)
  }

  return (
    <>
      <div className={s.filterBar}>
        <label className="visually-hidden" htmlFor={searchId}>
          Search the ecosystem catalogue
        </label>
        <input
          id={searchId}
          className={s.search}
          type="search"
          placeholder="Search names, former names, vendors, models and keywords"
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
        />

        <Facet label="Pillar" options={pillars} value={pillar} onChange={setPillar} />
        <Facet label="Kind" options={kinds} value={kind} onChange={setKind} />
        <Facet label="Lifecycle" options={lifecycles} value={lifecycle} onChange={setLifecycle} />

        <div className={e.countRow}>
          <p className={s.count} aria-live="polite">
            Showing {shown.length} of {rows.length} entries
          </p>
          {filtered ? (
            <button type="button" className={e.clearButton} onClick={clear}>
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {grouped.map((g) => (
        <section key={g.pillar.value} className={s.atlasGroup}>
          <h3 className={s.atlasGroupTitle}>
            <Link href={`/ecosystem/${g.items[0]?.pillarSlug ?? ''}/`}>{g.pillar.label}</Link>
            <span className={e.groupCount}>{g.items.length}</span>
          </h3>
          <ul className={e.entryList}>
            {g.items.map((r) => (
              <li key={r.id} className={e.entry}>
                <Link href={`/ecosystem/${r.pillarSlug}/#${r.slug}`} className={e.entryLink}>
                  <span className={e.entryName}>{r.name}</span>
                </Link>
                <span className={e.entryMeta}>
                  {r.vendor ? <span className={e.entryVendor}>{r.vendor}</span> : null}
                  <span className={e.entryTag}>{r.kindLabel}</span>
                  <span className={e.entryTag}>{r.lifecycleLabel}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {grouped.length === 0 ? (
        <div className={e.empty}>
          <p className={e.emptyTitle}>Nothing in the catalogue matches that.</p>
          <p className={e.emptyBody}>
            This sweep is complete within its declared scope, not a record of every engineering
            product that exists. Try a vendor, a former name or a broader term, or clear the filters
            to see all {rows.length} entries.
          </p>
          <button type="button" className={e.clearButton} onClick={clear}>
            Clear filters
          </button>
        </div>
      ) : null}
    </>
  )
}

function Facet({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly FacetOption[]
  value: string
  onChange: (v: string) => void
}) {
  const id = useId()
  return (
    <div className={s.filterRow}>
      <span className={s.filterLabel} id={id}>
        {label}
      </span>
      <div className={s.filterRow} role="group" aria-labelledby={id}>
        <button
          type="button"
          className={`${s.pill} ${value === ALL ? s.pillActive : ''}`}
          aria-pressed={value === ALL}
          onClick={() => onChange(ALL)}
        >
          All
        </button>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`${s.pill} ${value === o.value ? s.pillActive : ''}`}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
