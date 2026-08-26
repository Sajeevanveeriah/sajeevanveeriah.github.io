import Link from 'next/link'
import { site } from '@/content/site'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="footer-name" href="/">{site.name}</Link>
          <p>{site.jobTitle}</p>
        </div>
        <div className="footer-links" aria-label="Professional links">
          <a href={site.github}>GitHub</a>
          <a href={site.resume}>Resume</a>
          <a href={site.support.url} target="_blank" rel="noopener noreferrer">{site.support.label}</a>
        </div>
        <p className="copyright">© 2026 {site.name}</p>
      </div>
    </footer>
  )
}
