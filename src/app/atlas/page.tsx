import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend } from '@/components/ui/TierIndicator'
import { AtlasIndex } from '@/components/atlas/AtlasIndex'
import { atlas } from '@/content/atlas'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Engineering Atlas',
  description:
    'My engineering capability atlas covers nineteen domains, each tiered honestly by evidence and filterable by cluster or evidence tier.',
  alternates: { canonical: '/atlas/' },
  openGraph: { title: 'Engineering Atlas', url: '/atlas/' },
}

export default function AtlasPage() {
  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader
          kicker="Engineering Atlas"
          title="My capability landscape, tiered honestly by evidence."
          lede="Nineteen domains in one index. Search it, filter it, and open any domain for its subdomains, tools, proof and growth targets. Nothing here is claimed beyond its evidence."
          aside={
            <div className={s.railBlock}>
              <p className="label">Evidence tiers</p>
              <TierLegend />
            </div>
          }
        />
        <AtlasIndex domains={atlas} />
      </div>
    </section>
  )
}
