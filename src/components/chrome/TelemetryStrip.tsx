'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './TelemetryStrip.module.css'

/**
 * Instrument readout for the header and footer.
 *
 * Privacy note, binding: the design brief asked for a location readout. The
 * contact and privacy lock in AGENTS.md forbids publishing any personal or
 * role location, so no location is shown and none may be added. The strip
 * reads the visitor's own clock instead, clearly labelled LOCAL, plus a
 * static system status and the current route as a node address. Nothing
 * here asserts anything about Saj.
 *
 * Motion tier 3: the seconds tick is decorative. It stops when the strip
 * scrolls out of view, when the tab is hidden, and entirely under
 * prefers-reduced-motion, where a single static timestamp is rendered.
 */

function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function TelemetryStrip({ variant = 'header' }: { variant?: 'header' | 'footer' }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const [clock, setClock] = useState<string | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setClock(formatClock(new Date()))

    // Under reduced motion the value is painted once and never animates.
    if (reduced) return

    let timer: ReturnType<typeof setInterval> | null = null

    const start = () => {
      if (timer !== null) return
      timer = setInterval(() => setClock(formatClock(new Date())), 1000)
    }
    const stop = () => {
      if (timer === null) return
      clearInterval(timer)
      timer = null
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && document.visibilityState === 'visible') start()
        else stop()
      },
      { threshold: 0 },
    )
    observer.observe(node)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') start()
      else stop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const node = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

  return (
    <div
      ref={ref}
      className={`${styles.strip} ${variant === 'footer' ? styles.footer : styles.header}`}
    >
      <p className={styles.readout}>
        <span className={styles.led} aria-hidden="true" />
        <span className={styles.key}>SYS</span>
        <span className={styles.value}>NOMINAL</span>
      </p>
      <p className={styles.readout}>
        <span className={styles.key}>LOCAL</span>
        {/* Rendered only after hydration: the server has no visitor clock.
            The reserved-width span holds layout so nothing shifts. */}
        <span className={`${styles.value} ${styles.clock}`}>
          {clock ?? <span className={styles.clockIdle} aria-hidden="true" />}
          {clock ? <span className="visually-hidden"> your local time</span> : null}
        </span>
      </p>
      <p className={`${styles.readout} ${styles.nodeReadout}`}>
        <span className={styles.key}>NODE</span>
        <span className={styles.value}>{node}</span>
      </p>
    </div>
  )
}
