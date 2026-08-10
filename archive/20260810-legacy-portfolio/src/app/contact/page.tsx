import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { site } from '@/content/site'
import { contactIntro } from '@/content/about'
import s from '@/components/ui/shared.module.css'
import c from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Discuss an autonomous mobile robotics or embedded intelligent systems project by email, LinkedIn or GitHub, and download the resume for the full professional record.',
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
      <div className="wrap-wide">
        <PageHeader
          signature="converge"
          kicker="Contact"
          title="Start a conversation."
          lede={contactIntro}
        />

        <div className={s.split}>
          <address className={c.channels}>
            <a href={`mailto:${site.email}`} className={c.email}>
              {site.email}
            </a>

            <ul className={c.links}>
              {site.socials.map((so) => (
                <li key={so.href}>
                  <a href={so.href} rel="me noopener" className={c.channel}>
                    <span className={c.channelLabel}>{so.label}</span>
                    <span className={c.channelHandle}>{so.handle}</span>
                    <svg
                      className={c.channelArrow}
                      width="18"
                      height="18"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </address>

          <aside className={s.rail}>
            <div className={s.railBlock}>
              <p className="label">Resume</p>
              <a href={site.resumePath} download className="btn btn-primary">
                Download resume
              </a>
              <a href={site.resumePath} target="_blank" rel="noopener" className={s.link}>
                Open in a new tab
              </a>
            </div>
            <div className={s.railBlock}>
              <p className="label">Membership</p>
              <p className={s.rowSummary}>Member, Engineers Australia</p>
            </div>
            <div className={s.railBlock}>
              <p className="label">Education</p>
              <p className={s.rowSummary}>
                Bachelor of Mechatronics Engineering (Honours), Deakin University, Distinction, 2025
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
