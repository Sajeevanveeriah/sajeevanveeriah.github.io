import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { TierIndicator, TierLegend } from '@/components/ui/TierIndicator'
import { PrintButton } from './PrintButton'
import { atlas, CLUSTER_LABEL, type AtlasCluster } from '@/content/atlas'
import { site } from '@/content/site'
import s from './matrix.module.css'
import shared from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Capability Matrix',
  description:
    'A one-page printable matrix of all nineteen atlas domains against the five evidence tiers.',
  alternates: { canonical: '/capability-matrix/' },
  openGraph: { title: 'Capability Matrix', url: '/capability-matrix/' },
}

const CLUSTER_ORDER: readonly AtlasCluster[] = [
  'systems',
  'physical',
  'embedded',
  'controls',
  'software',
  'sectors',
  'assurance',
]

/**
 * The whole atlas as one printable page: every domain, its cluster and its
 * evidence tier, with no interactivity required. The screen view shares the
 * exact same markup; print styles strip the chrome and hold the table to a
 * single A4 page.
 */
export default function CapabilityMatrixPage() {
  const grouped = CLUSTER_ORDER.map((c) => ({
    cluster: c,
    items: atlas.filter((d) => d.cluster === c),
  })).filter((g) => g.items.length > 0)

  return (
    <section className={`section ${s.page}`}>
      <div className="wrap-wide">
        <div className={s.screenOnly}>
          <PageHeader
            kicker="Capability matrix"
            title="Nineteen domains, five evidence tiers, one page."
            lede="The full atlas condensed to a printable matrix. Every domain links back to its detailed page, and every claim carries the same evidence tier it carries everywhere else on this site."
            aside={
              <>
                <div className={shared.railBlock}>
                  <p className="label">Evidence tiers</p>
                  <TierLegend />
                </div>
                <div className={shared.railBlock}>
                  <PrintButton />
                  <p className={shared.railNote}>
                    Or use the browser print menu; the page carries its own print layout.
                  </p>
                </div>
              </>
            }
          />
        </div>

        {/* Print-only letterhead, so the sheet identifies itself. */}
        <header className={s.printHead} aria-hidden="true">
          <p className={s.printName}>{site.name}</p>
          <p className={s.printRole}>{site.jobTitle}</p>
          <p className={s.printUrl}>{site.url.replace('https://', '')}</p>
        </header>

        <table className={s.matrix}>
          <caption className="visually-hidden">
            All nineteen atlas domains with their cluster and evidence tier
          </caption>
          <thead>
            <tr>
              <th scope="col">Domain</th>
              <th scope="col">Evidence tier</th>
            </tr>
          </thead>
          {grouped.map((g) => (
            <tbody key={g.cluster}>
              <tr className={s.clusterRow}>
                <th scope="rowgroup" colSpan={2}>
                  {CLUSTER_LABEL[g.cluster]}
                </th>
              </tr>
              {g.items.map((d) => (
                <tr key={d.slug}>
                  <td className={s.domainCell}>
                    <a href={`/atlas/${d.slug}/`}>{d.name}</a>
                  </td>
                  <td className={s.tierCell}>
                    <TierIndicator tier={d.evidenceTier} />
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>

        <footer className={s.printFoot} aria-hidden="true">
          <p>
            Evidence tiers: Delivered, professional or project delivery evidence exists. Hands-on,
            built, tested, configured, analysed or used directly. Working knowledge, credible study,
            coursework or self-directed learning. Adjacent, transferable exposure from nearby
            systems. Target, strategic growth domain.
          </p>
        </footer>
      </div>
    </section>
  )
}
