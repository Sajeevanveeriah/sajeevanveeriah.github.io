import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="not-found shell">
      <p className="section-index">404</p>
      <h1>This route is no longer part of the concise portfolio.</h1>
      <p>The current site keeps the professional identity, systems map and three flagship engineering records in one clear path.</p>
      <Link className="button button-primary" href="/">Open the portfolio ↗</Link>
    </section>
  )
}
