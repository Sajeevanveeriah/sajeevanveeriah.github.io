import { ArrowUpRight } from '@/components/icons'
import { site } from '@/content/site'

export function ContactPoster() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <span className="contact-label">04 / Contact</span>
        <h2 id="contact-title">Have a system that has to move, sense or decide?</h2>
        <div className="contact-actions" aria-label="Contact and support links">
          <a className="button button-poster" href={`mailto:${site.email}`}>Email Sajeevan<ArrowUpRight /></a>
          <a
            className="button button-poster-secondary"
            href={site.support.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.support.label} using PayPal`}
          >
            {site.support.label}<ArrowUpRight />
          </a>
        </div>
        <p className="support-note">{site.support.description}</p>
      </div>
    </section>
  )
}
