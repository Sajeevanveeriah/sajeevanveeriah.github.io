import Link from 'next/link'
import { ArrowUpRight } from './icons'
import { ThemeSelect } from './Theme'
import { site } from '@/content/site'

export function ContactBand() {
  return (
    <section className="contact-band" id="contact" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <div>
          <h2 id="contact-title">Have a system to work through?</h2>
          <p>Talk to me about an engineering problem, a project or a role.</p>
        </div>
        <div className="contact-actions">
          <a className="btn btn-primary" href={`mailto:${site.email}`}>Email Saj <ArrowUpRight /></a>
          <a className="btn btn-secondary" href={site.resume}>Resume (PDF)</a>
        </div>
        <div className="services" id="services" role="region" aria-labelledby="services-title">
          <span id="services-title">Need technical help?</span>
          <a href={site.serviceDesk}>Request a service <ArrowUpRight /></a>
          <Link href="/notes/" prefetch={false}>Learning resources <ArrowUpRight /></Link>
        </div>
      </div>
    </section>
  )
}

export function SiteFooter({ contact = true }: { contact?: boolean }) {
  return (
    <>
      {contact && <ContactBand />}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link prefetch={false} className="footer-name" href="/">{site.name}</Link>
            <p>{site.jobTitle}</p>
          </div>
          <nav className="footer-links" aria-label="Professional links">
            <a href={site.github}>GitHub</a>
            <a href={site.resume} download>Resume PDF</a>
            <Link prefetch={false} href="/blog/feed.xml">RSS</Link>
            <a href={site.support.url} target="_blank" rel="noopener noreferrer">{site.support.label}</a>
          </nav>
          <div className="footer-meta">
            <ThemeSelect />
            <p>© {new Date(site.updated).getFullYear()} {site.name}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
