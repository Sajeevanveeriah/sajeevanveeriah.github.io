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
      <Masthead />
      <main id="main" className="container">
        <section className="not-found" aria-labelledby="not-found-title">
          <p className="eyebrow">Error 404</p>
          <h1 id="not-found-title">This page is no longer part of the portfolio.</h1>
          <p>The project catalogue and journal hold everything that is currently published.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/work/" prefetch={false}>Browse my work <ArrowUpRight /></Link>
            <Link className="btn btn-secondary" href="/" prefetch={false}>Go to the home page</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
