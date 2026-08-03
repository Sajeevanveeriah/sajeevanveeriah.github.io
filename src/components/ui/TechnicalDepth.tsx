'use client'

import { useEffect, useState, type ReactNode } from 'react'
import s from './TechnicalDepth.module.css'

/**
 * Disclosure for technical depth treatments.
 *
 * A native <details> element, so the summary is a real keyboard-operable
 * control with no scripting required. It renders open in the server HTML
 * and is collapsed once JavaScript mounts: without JavaScript every
 * treatment is fully readable in place, and with it the page stays
 * scannable with the depth one interaction away. Toggling is left entirely
 * to the browser; React only tracks the state it set.
 */
export function TechnicalDepth({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(false)
  }, [])

  return (
    <details
      className={s.root}
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className={s.summary}>
        <span className={s.title}>{title}</span>
        <span className={s.mark} aria-hidden="true" />
      </summary>
      <div className={s.body}>{children}</div>
    </details>
  )
}
