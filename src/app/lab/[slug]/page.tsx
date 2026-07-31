import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { LabBlock } from '@/components/lab/LabBlock'
import type { LabWidgetId } from '@/components/lab/LabMount'
import { getLab, labs, LAB_FRAMING } from '@/content/lab'
import { site } from '@/content/site'
import s from '@/components/ui/shared.module.css'

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const lab = getLab(slug)
  if (!lab) return {}
  return {
    title: lab.title,
    description: lab.summary,
    alternates: { canonical: `/lab/${lab.slug}/` },
    openGraph: {
      title: lab.title,
      description: lab.summary,
      url: `/lab/${lab.slug}/`,
      images: [
        { url: `/assets/og/lab-${lab.slug}.png`, width: 1200, height: 630, alt: lab.title },
      ],
    },
  }
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lab = getLab(slug)
  if (!lab) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${site.url}/lab/${lab.slug}/#lab`,
    name: lab.title,
    description: lab.summary,
    url: `${site.url}/lab/${lab.slug}/`,
    creator: { '@id': `${site.url}/#person` },
  }

  return (
    <article className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="wrap-wide">
        <BackLink href="/lab/">All labs</BackLink>

        <PageHeader
          kicker={lab.kicker}
          title={lab.title}
          lede={lab.summary}
          aside={
            <>
              <div className={s.railBlock}>
                <p className="label">Try this</p>
                <p className={s.railNote}>{lab.tryThis}</p>
              </div>
              {lab.relatedRecord ? (
                <div className={s.railBlock}>
                  <p className="label">Named in</p>
                  <Link href={`/work/${lab.relatedRecord.slug}/`} className={s.link}>
                    {lab.relatedRecord.title}
                  </Link>
                </div>
              ) : null}
            </>
          }
        />

        <LabBlock lab={lab.slug as LabWidgetId} />

        <div className={s.detail} style={{ marginTop: 'var(--space-6)' }}>
          <div className={s.narrative}>
            <section className={s.chapter}>
              <h2 className={s.chapterTitle}>What this demonstrates</h2>
              <div className={s.chapterBody}>
                {lab.explanation.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <p>{LAB_FRAMING}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  )
}
