import { ArrowUpRight } from '@/components/icons'
import { site } from '@/content/site'

export function ContactPoster() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <span className="contact-label">04 / Contact</span>
        <h2 id="contact-title">Have a system that has to move, sense or decide?</h2>
        <a className="button button-poster" href={`mailto:${site.email}`}>Email Sajeevan<ArrowUpRight /></a>
      </div>
    </section>
  )
}
