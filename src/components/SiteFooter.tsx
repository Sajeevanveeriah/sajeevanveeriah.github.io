import Link from 'next/link'
import { resumeFiles } from '@/content/resume'
import { site } from '@/content/site'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="footer-name" href="/">{site.name}</Link>
          <p>{site.jobTitle}</p>
        </div>
        <nav className="footer-links" aria-label="Professional links">
          <a href={site.github}>GitHub</a>
          <a href={resumeFiles.pdf} download>Resume PDF</a>
          <a href={resumeFiles.docx} download>Resume DOCX</a>
          <a href={site.support.url} target="_blank" rel="noopener noreferrer">{site.support.label}</a>
        </nav>
        <p className="copyright">© 2026 {site.name}</p>
      </div>
    </footer>
  )
}
