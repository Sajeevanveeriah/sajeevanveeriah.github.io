import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader, BackLink } from '@/components/ui/PageHeader'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { TechnicalDepth } from '@/components/ui/TechnicalDepth'
import { LabMount } from '@/components/lab/LabMount'
import { StaticLab } from '@/components/lab/StaticLab'
import { labs, getLab } from '@/content/labs'
import { getTechnique } from '@/content/techniques'
import labCss from '@/components/lab/lab.module.css'
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
    title: `${lab.title} | Lab`,
    description: lab.summary,
    alternates: { canonical: `/lab/${lab.slug}/` },
    openGraph: { title: lab.title, description: lab.summary, url: `/lab/${lab.slug}/` },
  }
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lab = getLab(slug)
  if (!lab) notFound()

  const depth = lab.techniques
    .map(getTechnique)
    .filter((t): t is NonNullable<typeof t> => t !== undefined)

  return (
    <article className="section">
      <div className="wrap-wide">
        <BackLink href="/lab/">All labs</BackLink>

        <PageHeader kicker={lab.kicker} title={lab.title} lede={lab.summary} longTitle />

        <div className={s.detail}>
          <div className={labCss.labBody}>
            <div className={labCss.labIntro}>
              {lab.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className={labCss.embed}>
              <LabMount slug={lab.slug}>
                <StaticLab slug={lab.slug} />
              </LabMount>
              <p className={labCss.figureNote}>{lab.figureNote}</p>
            </div>

            {depth.length ? (
              <div>
                <p className="label label-accent">Technique deep dives</p>
                {depth.map((t) => (
                  <TechnicalDepth key={t.id} title={t.name}>
                    {t.paragraphs.map((para, k) => (
                      <p key={k}>{para}</p>
                    ))}
                  </TechnicalDepth>
                ))}
              </div>
            ) : null}
          </div>

          <aside className={s.rail} aria-label="Lab details">
            <div className={s.railBlock}>
              <p className="label">Applied in</p>
              <Link href={`/work/${lab.recordSlug}/`} className={s.link}>
                {lab.recordLabel}
              </Link>
            </div>
            <div className={s.railBlock}>
              <p className="label">All labs</p>
              {labs
                .filter((l) => l.slug !== lab.slug)
                .map((l) => (
                  <Link key={l.slug} href={`/lab/${l.slug}/`} className={s.link}>
                    {l.title}
                  </Link>
                ))}
            </div>
          </aside>
        </div>

        <div className={s.nextRecord}>
          <p className="label label-accent">The record behind this technique</p>
          <h2 className={s.nextTitle}>
            <Link href={`/work/${lab.recordSlug}/`}>{lab.recordLabel}</Link>
          </h2>
          <ArrowLink href={`/work/${lab.recordSlug}/`}>Read the case study</ArrowLink>
        </div>
      </div>
    </article>
  )
}
