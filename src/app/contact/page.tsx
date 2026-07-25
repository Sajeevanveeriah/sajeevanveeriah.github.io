import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { site } from '@/content/site'
import { contactIntro } from '@/content/about'
import s from '@/components/ui/shared.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Sajeevan Veeriah by email, LinkedIn or GitHub, and download the resume carrying the full professional record.',
  alternates: { canonical: '/contact/' },
  openGraph: { title: 'Contact', url: '/contact/' },
}

/**
 * The contact model is closed and binding: exactly three personal channels
 * plus the resume. No telephone, address, location, visa, work-rights or
 * availability statement may ever appear here.
 */
export default function ContactPage() {
  return (
    <section className="section">
      <div className="wrap">
        <PageHeader
          kicker="08 / Contact"
          title="Explore the engineering evidence, then start a conversation."
          lede={contactIntro}
        />

        <div className={s.split}>
          <address style={{ fontStyle: 'normal', display: 'grid', gap: 'var(--space-2)' }}>
            <a
              href={`mailto:${site.email}`}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                color: 'var(--accent-text)',
                letterSpacing: 'var(--tracking-snug)',
              }}
            >
              {site.email}
            </a>
            {site.socials.map((so) => (
              <a key={so.href} href={so.href} rel="me noopener" className={s.link} style={{ justifySelf: 'start' }}>
                {so.handle}
              </a>
            ))}
            <span className={s.cat}>Member, Engineers Australia</span>
          </address>

          <aside className={s.rail}>
            <div className={s.railBlock}>
              <p className="mono-label">Resume</p>
              <a href={site.resumePath} download className={s.link} style={{ justifySelf: 'start' }}>
                Download resume
              </a>
              <a
                href={site.resumePath}
                target="_blank"
                rel="noopener"
                className={s.link}
                style={{ justifySelf: 'start' }}
              >
                View resume
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
