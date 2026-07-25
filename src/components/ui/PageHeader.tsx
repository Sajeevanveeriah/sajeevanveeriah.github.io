import type { ReactNode } from 'react'
import s from './shared.module.css'

/** One h1 per page, always. Sub-copy is optional and holds the prose measure. */
export function PageHeader({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string
  title: string
  lede?: string
  children?: ReactNode
}) {
  return (
    <div className={s.header}>
      <p className={`mono-label ${s.kicker}`}>{kicker}</p>
      <h1>{title}</h1>
      {lede ? <p className={s.lede}>{lede}</p> : null}
      {children}
    </div>
  )
}
