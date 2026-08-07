import Link from 'next/link'
import {
  ENGINEERING_AREA_IDS,
  ENGINEERING_AREA_LABEL,
  ENGINEERING_STATUS_LABEL,
  type EngineeringItemStatus,
  type ProjectEngineeringItem,
  type ProjectEngineeringProfile,
} from '@/content/projectEngineering'
import { getEntity, getPillarById } from '@/content/ecosystem'
import s from './ProjectEngineering.module.css'

const STATUS_ORDER: readonly EngineeringItemStatus[] = [
  'documented',
  'inferred',
  'applied',
  'reference',
  'performed',
  'recommended',
  'not-applicable',
]

export function ProjectEngineering({ profile }: { profile: ProjectEngineeringProfile }) {
  const usedStatuses = new Set(
    ENGINEERING_AREA_IDS.flatMap((areaId) => profile.areas[areaId].items.map((entry) => entry.status)),
  )

  return (
    <div className={s.root}>
      <aside className={s.legend} aria-labelledby="engineering-status-key">
        <p id="engineering-status-key" className={s.legendTitle}>Evidence key</p>
        <ul className={s.legendList}>
          {STATUS_ORDER.filter((status) => usedStatuses.has(status)).map((status) => (
            <li key={status}>
              <span className={s.status}>{ENGINEERING_STATUS_LABEL[status]}</span>
            </li>
          ))}
        </ul>
      </aside>

      <figure className={s.map} aria-labelledby="engineering-domain-map">
        <div className={s.mapHead}>
          <h3 id="engineering-domain-map" className={s.mapTitle}>Engineering domain mind map</h3>
          <p className={s.mapIntro}>Each row shows a source domain, the relationship and the domain it affects.</p>
        </div>
        <ol className={s.mapList}>
          {profile.connections.map((connection, index) => (
            <li key={connection.from + connection.relation + connection.to + index} className={s.mapRow}>
              <span className={s.mapNode}>{ENGINEERING_AREA_LABEL[connection.from]}</span>
              <span className={s.mapRelation}>
                <span aria-hidden="true" className={s.arrow}>→</span>
                {connection.relation}
              </span>
              <span className={s.mapNode}>{ENGINEERING_AREA_LABEL[connection.to]}</span>
            </li>
          ))}
        </ol>
        <figcaption className={s.caption}>
          Text equivalent: the ordered rows above name every displayed source, relationship and destination.
        </figcaption>
      </figure>

      <dl className={s.areas}>
        {ENGINEERING_AREA_IDS.map((areaId) => {
          const area = profile.areas[areaId]
          return (
            <div key={areaId} className={s.area}>
              <dt className={s.areaName}>{ENGINEERING_AREA_LABEL[areaId]}</dt>
              <dd className={s.areaBody}>
                <p className={s.areaSummary}>{area.summary}</p>
                <ul className={s.itemList}>
                  {area.items.map((entry, index) => (
                    <EngineeringEntry
                      key={entry.name + entry.status + index}
                      entry={entry}
                    />
                  ))}
                </ul>
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

function EngineeringEntry({ entry }: { entry: ProjectEngineeringItem }) {
  const reference = entry.ecosystemEntityId
    ? resolveEcosystemReference(entry.ecosystemEntityId)
    : null

  return (
    <li className={s.item}>
      <div className={s.itemHead}>
        <strong className={s.itemName}>{entry.name}</strong>
        <span className={s.status}>{ENGINEERING_STATUS_LABEL[entry.status]}</span>
      </div>
      <p className={s.itemRole}>{entry.role}</p>
      {entry.rationale ? (
        <p className={s.rationale}>
          <span className={s.rationaleLabel}>Selection basis</span> {entry.rationale}
        </p>
      ) : null}
      {reference ? (
        <Link className={s.referenceLink} href={reference.href}>
          Ecosystem reference: {reference.name}
        </Link>
      ) : null}
    </li>
  )
}

function resolveEcosystemReference(entityId: string): { href: string; name: string } {
  const entity = getEntity(entityId)
  if (!entity) throw new Error('Unknown ecosystem entity in project engineering: ' + entityId)

  const pillarId = entity.pillarIds[0]
  if (!pillarId) throw new Error('Ecosystem entity has no pillar: ' + entityId)

  const pillar = getPillarById(pillarId)
  if (!pillar) throw new Error('Ecosystem entity has no resolvable pillar: ' + entityId)

  return {
    href: '/ecosystem/' + pillar.slug + '/#' + entity.slug,
    name: entity.name,
  }
}
