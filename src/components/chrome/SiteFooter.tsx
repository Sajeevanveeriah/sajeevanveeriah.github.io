import Link from 'next/link'
import { navigation, site } from '@/content/site'
import styles from './SiteFooter.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap-wide ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Link className={styles.brand} href="/">
            {site.name}
          </Link>
          <p className={styles.tagline}>{site.tagline}</p>
        </div>

        <nav className={styles.col} aria-label="Footer">
          <p className="label">Sections</p>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
          <Link href="/atlas/" className={styles.link}>
            Engineering Atlas
          </Link>
        </nav>

        <div className={styles.col}>
          <p className="label">Connect</p>
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

      <div className={`wrap-wide ${styles.bottom}`}>
        <p className={styles.copyright}>&copy; 2026 {site.name}</p>
        <p className={styles.credential}>{site.credentials.join('  ·  ')}</p>
      </div>
    </footer>
  )
}
