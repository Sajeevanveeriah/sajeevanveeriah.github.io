import Image from 'next/image'
import Link from 'next/link'
import { Masthead } from '@/components/Masthead'
import { SiteFooter } from '@/components/SiteFooter'
import { ContactForm } from '@/components/ContactForm'
import { VoltwynLockup } from '@/components/VoltwynLockup'
import { ArrowUpRight } from '@/components/icons'
import { getProject } from '@/content/projects'
import { site } from '@/content/site'
import { pageMetadata } from '@/content/seo'
import { servicesPage, deliverables, fit, phases, supportNote, rateCard, enquiry } from '@/content/services'

export const metadata = pageMetadata({
  title: 'Services and rates',
  description: servicesPage.description,
  path: '/services/',
})

/** Undecided figures stay visible as [PLACEHOLDER] tokens until Saj sets them. */
function highlight(text: string) {
  return text.split(/(\[[A-Z ]+\])/).map((part, index) => (/^\[[A-Z ]+\]$/.test(part) ? <mark className="placeholder" key={index}>{part}</mark> : part))
}

export default function Services() {
  const proof = getProject(servicesPage.proofSlug)!
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
              <Link className="btn btn-secondary" href={`/work/${proof.slug}/`} prefetch={false}>See the latest board</Link>
            </div>
            <ul className="hero-credentials">
              <li>{servicesPage.location}</li>
              {site.credentials.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </header>
        </div>

        <section className="section container" id="offer" aria-labelledby="offer-title">
          <div className="section-head"><div><p className="eyebrow">The offer</p><h2 id="offer-title">One board, from schematic to verification pack.</h2><p>Every engagement covers the same five deliverables, so you know what you are buying before the Define phase starts.</p></div></div>
          <div className="about-grid">
            {deliverables.map((d) => <div className="panel" key={d.title}><h3>{d.title}</h3><p>{d.detail}</p></div>)}
          </div>
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
                  <p className="build"><strong>Basis:</strong> {highlight(p.basis)}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="section-note">{supportNote}</p>
        </section>

        <section className="section container" id="proof" aria-labelledby="proof-title">
          <div className="section-head"><div><p className="eyebrow">Proof</p><h2 id="proof-title">The latest board: an industrial display controller.</h2><p>Clients are not named on this site. Each record says what was done, what was checked and what the checks do and do not prove.</p></div></div>
          <article className="featured">
            {proof.image && <div className="media-frame"><Image src={proof.image.src} alt={proof.image.alt} width={proof.image.width} height={proof.image.height} sizes="(max-width: 1024px) 92vw, 620px" /></div>}
            <div>
              <p className="card-kicker">{proof.category}</p>
              <h3>{proof.title}</h3>
              <p>{proof.system}</p>
              <p>{proof.verification}</p>
              <ul className="chips">{proof.stack.slice(0, 5).map((s) => <li className="chip" key={s}>{s}</li>)}</ul>
              <div className="record-links">
                <Link className="text-link" href={`/work/${proof.slug}/`} prefetch={false}>Project record <ArrowUpRight /></Link>
                <Link className="text-link" href={servicesPage.proofStory} prefetch={false}>Design case study <ArrowUpRight /></Link>
              </div>
            </div>
          </article>
        </section>

        <section className="section container" id="rates" aria-labelledby="rates-title">
          <div className="section-head"><div><p className="eyebrow">Rate basis</p><h2 id="rates-title">Fixed price where the scope is fixed. Hourly, and capped, where it is not.</h2><p>Australian dollars, excluding GST. Every quote states the basis, the cap and what you receive.</p></div></div>
          <dl className="rate-card">
            {rateCard.map((r) => <div key={r.item}><dt>{r.item}</dt><dd>{highlight(r.basis)}</dd></div>)}
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
