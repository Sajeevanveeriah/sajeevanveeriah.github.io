import Link from 'next/link'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { discoverableProjects } from '@/content/projects'
import { atlas, atlasClusters, CLUSTER_LABEL } from '@/content/atlas'
import { TIER_ORDER, TIERS } from '@/content/tiers'
import { systemsStack } from '@/content/systemsStack'
import { signalMap } from '@/content/signalMap'
import s from './SignalMap.module.css'

/**
 * The homepage Signal Map: the whole site in a single calm panel.
 *
 * A server component built from plain links, so it renders completely and
 * stays fully navigable without JavaScript. Every figure is derived at build
 * time from the same content files the destination pages read, which is what
 * keeps the map incapable of disagreeing with the pages it points at.
 *
 * Hierarchy is carried by structure, type and rule weight alone: no gauges,
 * no telemetry readouts and no category colour, per AGENTS.md.
 *
 * The cluster, tier and layer links target the filtered Atlas views; the
 * layer link pre-selects the cluster its evidence lives in, reproducing the
 * existing Systems Stack to Atlas mapping in systemsStack.ts.
 */
export function SignalMap() {
  const records = discoverableProjects
  const clusters = atlasClusters.map((c) => ({
    id: c,
    label: CLUSTER_LABEL[c],
    count: atlas.filter((d) => d.cluster === c).length,
  }))
  const tiers = TIER_ORDER.map((t) => ({
    id: t,
    label: TIERS[t].label,
    count: atlas.filter((d) => d.evidenceTier === t).length,
  }))

  return (
    <section className="section-sm" aria-labelledby="signal-map-title">
      <div className="wrap-wide">
        <div className={s.head}>
          <div>
            <p className="label label-accent">{signalMap.eyebrow}</p>
            <h2 id="signal-map-title">{signalMap.title}</h2>
          </div>
          <p className="lede">{signalMap.lede}</p>
        </div>

        {/* Accessible text equivalent: the same counts and groupings as an
            ordered summary, before the visual panel in reading order. */}
        <div className="visually-hidden">
          <h3>{signalMap.summaryHeading}</h3>
          <ol>
            <li>
              {records.length} {signalMap.recordsHeading.toLowerCase()}.
            </li>
            <li>
              {atlas.length} atlas domains in {clusters.length} clusters:{' '}
              {clusters.map((c) => `${c.label} (${c.count})`).join(', ')}.
            </li>
            <li>
              Evidence tiers across the atlas:{' '}
              {tiers.map((t) => `${t.label} (${t.count})`).join(', ')}.
            </li>
            <li>
              {systemsStack.length} capability layers:{' '}
              {systemsStack.map((l) => l.name).join(', ')}.
            </li>
          </ol>
        </div>

        <nav className={s.routes} aria-label="Reader routes">
          {signalMap.routes.map((r) => (
            <Link key={r.href} href={r.href} className={s.route}>
              <span className={s.routeLabel}>
                {r.label}
                <Arrow />
              </span>
              <span className={s.routeNote}>{r.description}</span>
            </Link>
          ))}
        </nav>

        <div className={s.grid}>
          <div className={s.cell}>
            <h3 className={s.cellHead}>{signalMap.recordsHeading}</h3>
            <p className={s.figure}>{records.length}</p>
            <p className={s.cellNote}>{signalMap.recordsNote}</p>
            <ArrowLink href="/work/" className={s.cellLink}>
              {signalMap.recordsLink}
            </ArrowLink>
          </div>

          <div className={s.cell}>
            <h3 className={s.cellHead}>
              {signalMap.clustersHeading}
              <span className={s.cellCount}>{atlas.length}</span>
            </h3>
            <ul className={s.list}>
              {clusters.map((c) => (
                <li key={c.id}>
                  <Link href="/atlas/" className={s.item}>
                    <span>{c.label}</span>
                    <span className={s.itemCount}>{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.cell}>
            <h3 className={s.cellHead}>{signalMap.tiersHeading}</h3>
            <ul className={s.list}>
              {tiers.map((t) => (
                <li key={t.id}>
                  <Link href="/atlas/" className={s.item}>
                    <TierIndicator tier={t.id} />
                    <span className={s.itemCount}>{t.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.cell}>
            <h3 className={s.cellHead}>
              {signalMap.layersHeading}
              <span className={s.cellCount}>{systemsStack.length}</span>
            </h3>
            <ol className={s.list}>
              {systemsStack.map((l) => (
                <li key={l.slug}>
                  <Link href="/atlas/" className={s.item}>
                    <span>{l.name}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
