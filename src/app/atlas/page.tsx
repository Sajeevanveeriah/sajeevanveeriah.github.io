import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend } from '@/components/ui/TierIndicator'
import { AtlasIndex } from '@/components/atlas/AtlasIndex'
import { atlas } from '@/content/atlas'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Engineering Atlas',
  description:
    "Sajeevan's engineering capability atlas covers nineteen domains, organised by the evidence he can show and filterable by cluster or evidence tier.",
  alternates: { canonical: '/atlas/' },
  openGraph: { title: 'Engineering Atlas', url: '/atlas/' },
}

export default function AtlasPage() {
  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader
          signature="lattice"
          kicker="Engineering Atlas"
          title="Sajeevan's engineering capability, mapped to evidence."
          lede="Explore nineteen domains by subdomain, tools, project evidence, professional experience and growth targets."
          aside={
            <>
              <div className={s.railBlock}>
                <p className="label">Evidence tiers</p>
                <TierLegend />
              </div>
              <div className={s.railBlock}>
                <p className="label">Wider field</p>
                <p className={s.railNote}>
                  These nineteen domains are cut by what Sajeevan can evidence. The{' '}
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
        <AtlasIndex domains={atlas} />
      </div>
    </section>
  )
}
