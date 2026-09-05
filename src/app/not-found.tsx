import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from '@/components/icons'
import { Masthead } from '@/components/Masthead'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <Masthead reduced />
      <main id="main">
        <section className="not-found shell" aria-labelledby="not-found-title">
          <span className="not-found-number" aria-hidden="true">404</span>
          <h1 id="not-found-title">This route is no longer part of the portfolio.</h1>
          <p>Explore the project catalogue or return to the homepage.</p>
          <Link className="button button-primary" href="/">Open the portfolio<ArrowUpRight /></Link>
        <Link className="text-link" href="/work/">Browse engineering work</Link></section>
      </main>
      <SiteFooter />
    </>
  )
}
