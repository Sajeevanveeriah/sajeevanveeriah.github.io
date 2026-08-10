import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLink } from '@/components/ui/ArrowLink'
import n from './not-found.module.css'

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
      <div className="wrap-wide">
        <p className="label label-accent">Error 404</p>
        <h1 className={n.title}>That route does not resolve.</h1>
        <p className="lede">
          The link may be out of date, or the page may have moved. The planner below has the same
          problem, and the same answer: go back to a known point and re-plan.
        </p>

        <svg
          className={n.diagram}
          viewBox="0 0 640 120"
          role="img"
          aria-label="A route runs forward, reaches a dead end and turns back towards a known point."
        >
          <path
            className={n.deadEnd}
            d="M 16 60 H 420 M 452 34 L 500 82 M 452 82 L 500 34"
            pathLength={1}
          />
          <path className={n.returnPath} d="M 420 60 C 340 60 340 104 240 104" pathLength={1} />
          <circle className={n.origin} cx="16" cy="60" r="6" />
        </svg>

        <div className={n.actions}>
          <Link href="/" className="btn btn-primary">
            Return to the home page
          </Link>
          <ArrowLink href="/work/">Go to the work index</ArrowLink>
        </div>
      </div>
    </section>
  )
}
