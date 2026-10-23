import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from './icons'
import { ThemeSelect } from './Theme'
import { ContactForm } from './ContactForm'
import { site } from '@/content/site'

export function ContactBand() {
  return (
    <section className="contact-band" id="contact" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <div className="contact-intro">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Let&apos;s make the next system work.</h2>
          <p>Discuss an engineering role, a project or a research collaboration. Tell me what you are building, where it gets difficult and what a useful result would look like.</p>
          <ol className="contact-steps" aria-label="What happens next">
            <li><span aria-hidden="true">01</span><div><strong>Send the form</strong><small>It is sent from this page, without publishing my email address.</small></div></li>
            <li><span aria-hidden="true">02</span><div><strong>I reply to you</strong><small>To the address you give, with questions or a next step.</small></div></li>
            <li><span aria-hidden="true">03</span><div><strong>Project work starts with Define</strong><small>A short, fixed-fee phase that sets the scope and the tests.</small></div></li>
          </ol>
        </div>
        <ContactForm />
        <div className="services" id="services" role="region" aria-labelledby="services-title">
          <span id="services-title">Need technical help?</span>
          <Link href="/services/" prefetch={false}>Request a service <ArrowUpRight /></Link>
          <Link href="/notes/" prefetch={false}>Learning resources <ArrowUpRight /></Link>
        </div>
      </div>
    </section>
  )
}

const explore = [
  ['/work/', 'Work'],
  ['/services/', 'Services'],
  ['/about/', 'About'],
  ['/blog/', 'Journal'],
  ['/notes/', 'Notes'],
] as const

export function SiteFooter({ contact = true }: { contact?: boolean }) {
  return (
    <>
      {contact && <ContactBand />}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link prefetch={false} className="footer-name" href="/">
              <Image src={site.logo} alt="" width={36} height={36} />
              <span>{site.name}</span>
            </Link>
            <p>{site.jobTitle}</p>
            <p>{site.location}</p>
          </div>
          <nav className="footer-links" aria-label="Site">
            <h2>Explore</h2>
            {explore.map(([href, label]) => <Link prefetch={false} key={href} href={href}>{label}</Link>)}
          </nav>
          <nav className="footer-links" aria-label="Professional links">
            <h2>Elsewhere</h2>
            <a href={site.github}>GitHub</a>
            <a href={site.resume} download>Resume PDF</a>
            <Link prefetch={false} href="/blog/feed.xml">RSS</Link>
            <a href={site.support.url} target="_blank" rel="noopener noreferrer">{site.support.label}</a>
          </nav>
          <div className="footer-meta">
            <ThemeSelect />
            <p>© {new Date(site.updated).getFullYear()} {site.name}. Voltwyn is my engineering practice.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
