import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierLegend } from '@/components/ui/TierIndicator'
import { AtlasIndex } from '@/components/atlas/AtlasIndex'
import { atlas } from '@/content/atlas'
import { systemsStack } from '@/content/systemsStack'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Engineering Atlas',
  description:
    'Nineteen engineering capability domains, tiered honestly by evidence. Search and filter by discipline, systems layer or evidence tier.',
  alternates: { canonical: '/atlas/' },
  openGraph: { title: 'Engineering Atlas', url: '/atlas/' },
}

export default function AtlasPage() {
  return (
    <section className="section">
      <div className="wrap">
        <PageHeader
          kicker="02 / Engineering Atlas"
          title="Nineteen capability domains, tiered honestly by evidence."
          lede="The full engineering landscape in one atlas: search it, filter it by discipline, systems layer or evidence tier, and open any domain for subdomains, tools, proof and growth targets. Nothing is claimed beyond its evidence."
        >
          <div className={s.railBlock}>
            <TierLegend compact />
          </div>
        </PageHeader>
        <AtlasIndex domains={atlas} layers={systemsStack} />
      </div>
    </section>
  )
}
