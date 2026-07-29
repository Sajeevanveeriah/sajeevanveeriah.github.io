import type { ReactNode } from 'react'
import Link from 'next/link'
import s from './shared.module.css'

/**
 * One h1 per page, always. The optional aside carries supporting matter (a
 * tier legend, a meta row) alongside the title on wide viewports and below it
 * on narrow ones, so the header never leaves a column empty.
 */
export function PageHeader({
  kicker,
  title,
  lede,
  longTitle = false,
  aside,
  children,
}: {
  kicker: string
  title: string
  lede?: string
  /** Set for record titles, which run longer than a page title. */
  longTitle?: boolean
  aside?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className={`${s.pageHead} ${aside ? s.pageHeadSplit : ''}`}>
      <div className={s.pageHeadMain}>
        <p className="label label-accent">{kicker}</p>
        <h1 className={longTitle ? s.pageHeadTitleLong : undefined}>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
        {children}
      </div>
      {aside ? <div className={s.pageHeadAside}>{aside}</div> : null}
    </header>
  )
}

/** Back affordance shared by every detail route. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={s.backLink}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M13 8H3M7 4L3 8l4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </Link>
  )
}
