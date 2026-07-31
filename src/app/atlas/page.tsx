import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend } from '@/components/ui/TierIndicator'
import { AtlasIndex } from '@/components/atlas/AtlasIndex'
import { atlas } from '@/content/atlas'
import { discoverableProjects } from '@/content/projects'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Engineering Atlas',
  description:
    'My engineering capability atlas covers nineteen domains, each tiered honestly by evidence and filterable by cluster or evidence tier.',
  alternates: { canonical: '/atlas/' },
  openGraph: {
    title: 'Engineering Atlas',
    url: '/atlas/',
    images: [
      { url: '/assets/og/atlas.png', width: 1200, height: 630, alt: 'Engineering Atlas' },
    ],
  },
}

export default function AtlasPage() {
  /* Slug-to-title lookup for the evidence links on each domain card. Built
     here, on the server, so the client index never imports the full record
     prose; and built from the discoverable set only, so a suppressed record
     is never advertised from the atlas. Domains whose relatedProjects list
     is empty simply show no evidence links: the mapping is derived from
     existing content cross-references, never invented. */
  const recordTitles: Record<string, string> = {}
  for (const p of discoverableProjects) recordTitles[p.slug] = p.title

  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader
          signature="lattice"
          kicker="Engineering Atlas"
          title="My capability landscape, tiered honestly by evidence."
          lede="Nineteen domains in one index. Search it, filter it, and open any domain for its subdomains, tools, proof and growth targets. Nothing here is claimed beyond its evidence."
          aside={
            <>
              <div className={s.railBlock}>
                <p className="label">Evidence tiers</p>
                <TierLegend />
              </div>
              <div className={s.railBlock}>
                <p className="label">Wider field</p>
                <p className={s.railNote}>
                  These nineteen domains are cut by what I can evidence. The{' '}
                  <Link href="/ecosystem/" className={s.link}>
                    ecosystem catalogue
                  </Link>{' '}
                  maps the field itself across eight pillars, as a neutral reference rather than a
                  claim.
                </p>
              </div>
            </>
          }
        />
        <AtlasIndex domains={atlas} recordTitles={recordTitles} />
      </div>
    </section>
  )
}
