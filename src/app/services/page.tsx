import Link from 'next/link'
import { Masthead } from '@/components/Masthead'
import { SiteFooter } from '@/components/SiteFooter'
import { ContactForm } from '@/components/ContactForm'
import { VoltwynLockup } from '@/components/VoltwynLockup'
import { ArrowUpRight } from '@/components/icons'
import { getProject, projectIndex } from '@/content/projects'
import { site } from '@/content/site'
import { pageMetadata } from '@/content/seo'
import { servicesPage, areas, notListed, fit, phases, supportNote, rateCard, enquiry } from '@/content/services'

export const metadata = pageMetadata({
  title: 'Services and rates',
  description: servicesPage.description,
  path: '/services/',
})

/** A case-study slug links to its record; an index title links to the catalogue search, as the home page does. */
function resolveProof(ref: string) {
  const project = getProject(ref)
  if (project) return { title: project.title, href: `/work/${project.slug}/`, note: project.status }
  const item = projectIndex.flatMap((group) => group.items).find((entry) => entry.title === ref)
  if (!item) throw new Error(`Services proof "${ref}" is not a case study or project-index title`)
  return { title: item.title, href: `/work/?q=${encodeURIComponent(item.title)}`, note: item.summary }
}

export default function Services() {
  return (
    <>
      <Masthead current="services" />
      <main id="main">
        <div className="container">
          <header className="page-head services-head">
            <VoltwynLockup />
            <p className="eyebrow">{servicesPage.tagline}</p>
            <h1>{servicesPage.title}</h1>
            <p>{servicesPage.lede}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#enquire">Start with a Define phase</a>
              <Link className="btn btn-secondary" href="/work/" prefetch={false}>See the work</Link>
            </div>
            <ul className="hero-credentials">
              <li>{servicesPage.location}</li>
              {site.credentials.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </header>
        </div>

        <section className="section container" id="areas" aria-labelledby="areas-title">
          <div className="section-head"><div><p className="eyebrow">Service areas</p><h2 id="areas-title">Six areas, one way of working.</h2><p>Each area starts with a paid Define phase and ends with a tested system and the records behind it. Each links to work already on this site, with its own description of what it covers.</p></div></div>
          <div className="service-areas">
            {areas.map((area) => (
              <article className="panel service-area" id={area.id} key={area.id} aria-labelledby={`${area.id}-title`}>
                <h3 id={`${area.id}-title`}>{area.title}</h3>
                <p className="area-scope">{area.scope}</p>
                <p>{area.detail}</p>
                <p className="build"><strong>Start with:</strong> {area.start}</p>
                <div className="area-proof">
                  <p className="card-kicker">Proof on this site</p>
                  <ul>
                    {area.proof.map((ref) => {
                      const proof = resolveProof(ref)
                      return (
                        <li key={ref}>
                          <Link className="text-link" href={proof.href} prefetch={false}>{proof.title} <ArrowUpRight /></Link>
                          <span>{proof.note}</span>
                        </li>
                      )
                    })}
                  </ul>
                  {area.boundary && <p className="area-boundary">{area.boundary}</p>}
                </div>
              </article>
            ))}
          </div>
          <p className="section-note not-listed">{notListed} <a className="text-link" href="#enquire">Go to the enquiry form</a></p>
          <div className="split fit">
            <div><h3>{fit.forWhom.title}</h3><p>{fit.forWhom.detail}</p></div>
            <div><h3>{fit.outside.title}</h3><p>{fit.outside.detail}</p></div>
          </div>
        </section>

        <section className="section container" id="phases" aria-labelledby="phases-title">
          <div className="section-head"><div><p className="eyebrow">How it runs</p><h2 id="phases-title">A short Define phase first. Then fixed-price design work.</h2><p>Each phase ends with something you keep, and the next phase is quoted from it.</p></div></div>
          <ol className="roadmap">
            {phases.map((p) => (
              <li key={p.title}>
                <p className="phase">{p.label}</p>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.detail}</p>
                  <p className="build"><strong>You receive:</strong> {p.deliver}</p>
                  <p className="build"><strong>Basis:</strong> {p.basis}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="section-note">{supportNote}</p>
        </section>

        <section className="section container" id="rates" aria-labelledby="rates-title">
          <div className="section-head"><div><p className="eyebrow">Rate basis</p><h2 id="rates-title">Fixed price where the scope is fixed. Hourly, and capped, where it is not.</h2><p>Australian dollars, excluding GST. Every quote states the basis, the cap and what you receive.</p></div></div>
          <dl className="rate-card">
            {rateCard.map((r) => <div key={r.item}><dt>{r.item}</dt><dd>{r.basis}</dd></div>)}
          </dl>
        </section>

        <section className="contact-band" id="enquire" aria-labelledby="enquire-title">
          <div className="container contact-inner">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 id="enquire-title">{enquiry.title}</h2>
              <p>{enquiry.detail}</p>
            </div>
            <ContactForm defaultTopic={enquiry.topic} />
          </div>
        </section>
      </main>
      <SiteFooter contact={false} />
    </>
  )
}
