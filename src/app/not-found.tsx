import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The requested page does not exist on this site.',
  robots: { index: false, follow: true },
}

/**
 * Exported by `output: 'export'` as out/404.html, which GitHub Pages serves
 * for any unmatched path. Without this file a hard refresh on a deep link
 * would land on the default Pages 404 instead of the site's own chrome.
 */
export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap">
        <p className="mono-label">Error 404</p>
        <h1>Page not found</h1>
        <p style={{ color: 'var(--text-muted)', marginBlock: 'var(--space-3)' }}>
          That route does not exist. The link may be out of date, or the page may have moved.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            color: 'var(--accent-text)',
            borderBottom: '1px solid var(--accent-fill)',
          }}
        >
          Return to the home page
        </Link>
      </div>
    </section>
  )
}
