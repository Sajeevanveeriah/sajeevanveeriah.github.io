import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal, Stagger } from '@/components/motion/Reveal'
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
              {/* eslint-disable-next-line @next/next/no-img-element -- static
                  export; next/image is a pass-through here (see ProjectImage). */}
              <img
                className={p.logo}
                src={practice.logo.src}
                alt={practice.logo.alt}
                width={practice.logo.width}
                height={practice.logo.height}
                loading="eager"
                decoding="async"
              />
            </div>
          </Reveal>

          <Reveal>
            <p className="lede">{practice.summary}</p>
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
          <h2 id="services-title">Services</h2>
          <Stagger>
            <div className={p.grid}>
              {practice.services.map((sv) => (
                <div key={sv.title} className={p.cell}>
                  <h3>{sv.title}</h3>
                  <p>{sv.body}</p>
                </div>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      <section className="section" aria-labelledby="delivered-title">
        <div className="wrap-wide">
          <p className="label label-accent">Evidence</p>
          <h2 id="delivered-title">Completed and deployed practice work</h2>
          <ul className={p.records}>
            {delivered.map((pr) => (
              <li key={pr.slug}>
                <Link className="textlink" href={`/work/${pr.slug}/`}>
                  {pr.title}
                </Link>
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
