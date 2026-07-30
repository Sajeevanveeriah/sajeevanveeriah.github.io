import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/motion/Reveal'
import { versatility } from '@/content/employers'
import v from './versatility.module.css'

export const metadata: Metadata = {
  title: 'Six titles, one method',
  description: versatility.body,
  alternates: { canonical: '/versatility/' },
  openGraph: { title: 'Six titles, one method', url: '/versatility/' },
}

export default function VersatilityPage() {
  return (
    <section className="section">
      <div className="wrap-wide">
        <PageHeader kicker="The through-line" title={versatility.heading} lede={versatility.body} />

        <Reveal>
          {/* A real table, because this is tabular data: three columns with
              headers that each cell depends on. The horizontal scroller is
              on the wrapper, so a long row scrolls inside its own box and
              the page body never scrolls sideways. */}
          <div className={v.tableWrap}>
            <table className={v.table}>
              <caption className={v.caption}>
                Each employer, the scope its title implied, and the scope the work actually covered.
              </caption>
              <thead>
                <tr>
                  {versatility.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {versatility.rows.map(([employer, implied, crossed]) => (
                  <tr key={employer}>
                    <th scope="row">{employer}</th>
                    <td>{implied}</td>
                    <td>{crossed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal variant="lift" as="section" className={v.closingStage} aria-labelledby="method">
          <h2 id="method" className="label label-accent">
            The method
          </h2>
          <p className={v.closing}>{versatility.closing}</p>
        </Reveal>
      </div>
    </section>
  )
}
