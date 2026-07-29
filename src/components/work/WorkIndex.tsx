'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { TIER_ORDER, TIERS, byTierStrength, type EvidenceTier } from '@/content/tiers'
import type { Project } from '@/content/projects'
import { ProjectImage } from '@/components/ui/ProjectImage'
import s from '@/components/ui/shared.module.css'

const ALL = 'all'

/**
 * Filtering is entirely client-side over the static array shipped in the
 * bundle: no API, no fetch.
 */
export function WorkIndex({
  projects,
  domains,
  disciplines,
}: {
  projects: readonly Project[]
  domains: readonly string[]
  disciplines: readonly string[]
}) {
  const [domain, setDomain] = useState<string>(ALL)
  const [discipline, setDiscipline] = useState<string>(ALL)
  const [tier, setTier] = useState<string>(ALL)

  const shown = useMemo(
    () =>
      projects
        .filter((p) => (domain === ALL ? true : p.domain === domain))
        .filter((p) => (discipline === ALL ? true : p.disciplines.includes(discipline)))
        .filter((p) => (tier === ALL ? true : p.evidenceTier === tier))
        .slice()
        .sort(byTierStrength),
    [projects, domain, discipline, tier],
  )

  const curated = projects.filter((p) => ['engineering-mastery-lab','autonomous-navigation-rover','ataxia-assessment-device','iot-monitoring-platform'].includes(p.slug))

  return (
    <>
      <div className={s.workCurated}>
        {curated.map((p,index)=><article className={index === 0 ? s.workLead : s.workSupport} key={p.slug}>
          {p.images?.[0] ? <div className={s.workMedia}><ProjectImage image={p.images[0]} priority={index===0}/></div>:null}
          <div><p className="mono-label">{p.domain}</p><h2><Link href={`/work/${p.slug}/`}>{p.title}</Link></h2><p>{p.summary}</p><Link className={s.link} href={`/work/${p.slug}/`}>Read case study</Link></div>
        </article>)}
      </div>

      <div className={s.filterBar} aria-label="Filter project archive">
        <label>Domain<select value={domain} onChange={e=>setDomain(e.target.value)}><option value={ALL}>All domains</option>{domains.map(d=><option key={d}>{d}</option>)}</select></label>
        <label>Discipline<select value={discipline} onChange={e=>setDiscipline(e.target.value)}><option value={ALL}>All disciplines</option>{disciplines.map(d=><option key={d}>{d}</option>)}</select></label>
        <label>Evidence<select value={tier} onChange={e=>setTier(e.target.value)}><option value={ALL}>All tiers</option>{TIER_ORDER.map(t=><option key={t} value={t}>{TIERS[t as EvidenceTier].label}</option>)}</select></label>
      </div>

      <p className={s.count} aria-live="polite">
        {shown.length} of {projects.length} records shown
      </p>

      <div className={s.workArchive}>
        {shown.map((p) => (
          <article key={p.slug}>
            <div className={s.meta}>
              <span className={s.cat}>{p.category}</span>
              <TierIndicator tier={p.evidenceTier} />
            </div>
            <h2 className={s.cardTitle} style={{ fontSize: 'var(--text-lg)' }}>
              <Link href={`/work/${p.slug}/`}>{p.title}</Link>
            </h2>
            <p className={s.body}>{p.summary}</p>
          </article>
        ))}
      </div>
    </>
  )
}
