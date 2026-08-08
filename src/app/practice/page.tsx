import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal, Stagger } from '@/components/motion/Reveal'
import { PracticeMark } from '@/components/ui/PracticeMark'
import { EvidenceStateChip } from '@/components/ui/EvidenceState'
import { site } from '@/content/site'
import { practice } from '@/content/practice'
import { getProject } from '@/content/projects'
import p from './practice.module.css'

export const metadata: Metadata = {
  title: practice.name,
  description: practice.summary,
  alternates: { canonical: practice.path },
  openGraph: { title: practice.name, url: practice.path },
}

const enquiryHref = `mailto:${site.email}?subject=${encodeURIComponent(practice.enquirySubject)}`

/**
 * Organization JSON-LD so search engines connect the practice, its logo and
 * its LinkedIn page to this site. This is the only structured data the page
 * emits and every value is drawn from `practice.ts`.
 */
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: practice.name,
  url: `${site.url}${practice.path}`,
  logo: `${site.url}${practice.logo.src}`,
  sameAs: [practice.linkedin.href],
  founder: { '@type': 'Person', name: site.name, url: site.url },
  email: site.email,
}

export default function PracticePage() {
  const delivered = practice.deliveredSlugs
    .map((slug) => getProject(slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <section className="section">
        <div className="wrap-wide">
          <PageHeader
            kicker="The practice"
            title={practice.name}
            lede={practice.tagline}
          />

          <Reveal>
            <div className={p.logoBand}>
              <PracticeMark className={p.logo} />
            </div>
          </Reveal>

          <Reveal>
            <p className="lede">{practice.summary}</p>
            <p className={p.secondary}>{practice.secondary}</p>
            <div className={p.meta}>
              <p className="label">{practice.since}</p>
              {site.credentials.map((c) => (
                <p key={c} className="label">
                  {c}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section stage-tint" aria-labelledby="services-title">
        <div className="wrap-wide">
          <p className="label label-accent">What the practice delivers</p>
          <h2 id="services-title">Services, in order.</h2>
          {/* Ranked rather than gridded. Five equal cards said the practice
              does five unrelated things; a numbered list says the first is
              what it is for and the last is what it does around it. */}
          <Stagger as="ol" className={p.services}>
            {practice.services.map((sv, i) => (
              <li key={sv.title} className={p.service}>
                <span className={p.serviceIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={p.serviceTitle}>{sv.title}</h3>
                <p className={p.serviceBody}>{sv.body}</p>
              </li>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section" aria-labelledby="delivered-title">
        <div className="wrap-wide">
          <p className="label label-accent">Evidence</p>
          <h2 id="delivered-title">Completed and deployed practice work</h2>
          <ul className={p.records}>
            {delivered.map((pr) => (
              <li key={pr.slug} className={p.record}>
                <Link className="textlink" href={`/work/${pr.slug}/`}>
                  {pr.title}
                </Link>
                <EvidenceStateChip state={pr.evidenceState} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section stage-tint" aria-labelledby="engage-title">
        <div className="wrap-wide">
          <div className={p.band}>
            <p className="label label-accent">{practice.engage.kicker}</p>
            <h2 id="engage-title">{practice.engage.title}</h2>
            <p className="lede">{practice.engage.body}</p>
            <div className={p.channels}>
              <a href={enquiryHref} className="btn btn-primary">
                Start a project enquiry
              </a>
              <a
                href={practice.linkedin.href}
                className="btn btn-secondary"
                rel="me noopener"
              >
                Follow on LinkedIn
              </a>
            </div>
            <p className={p.handle}>{practice.linkedin.handle}</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="support-title">
        <div className="wrap-wide">
          <div className={p.band}>
            <p className="label label-accent">{practice.support.kicker}</p>
            <h2 id="support-title">{practice.support.title}</h2>
            <p className="lede">{practice.support.body}</p>
            <div className={p.channels}>
              <a href={practice.paypal.href} className="btn btn-secondary" rel="noopener">
                {practice.paypal.label}
              </a>
            </div>
            <p className={p.handle}>{practice.paypal.handle}</p>
          </div>
        </div>
      </section>
    </>
  )
}
