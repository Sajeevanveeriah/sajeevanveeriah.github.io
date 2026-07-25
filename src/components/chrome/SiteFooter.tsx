import Link from 'next/link'
import { navigation, site } from '@/content/site'
import { TelemetryStrip } from './TelemetryStrip'
import styles from './SiteFooter.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Link className={styles.brand} href="/">
            <span className={styles.mark} aria-hidden="true">
              {site.initials}
            </span>
            <span className={styles.brandText}>{site.name}</span>
          </Link>
          <p className={styles.tagline}>{site.tagline}</p>
        </div>

        <nav className={styles.col} aria-label="Footer">
          <p className="mono-label">Sections</p>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.col}>
          <p className="mono-label">Connect</p>
          <a className={styles.link} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          {site.socials.map((s) => (
            <a key={s.href} className={styles.link} href={s.href} rel="me noopener">
              {s.label}
            </a>
          ))}
          <a className={styles.link} href={site.resumePath} download>
            Download resume
          </a>
        </div>
      </div>

      <div className={`wrap ${styles.bottom}`}>
        <TelemetryStrip variant="footer" />
        <p className={styles.copyright}>&copy; 2026 {site.name}.</p>
      </div>
    </footer>
  )
}
