'use client'

import { m, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useRef } from 'react'

/**
 * Tier 2 magnetic attraction on a primary call to action.
 *
 * Deliberately restrained: travel is capped at 6px and the spring is
 * critically damped so the control settles without overshoot, matching the
 * servo easing used everywhere else. Disabled outright under reduced motion
 * and on coarse pointers, where there is no cursor to attract to.
 */
const MAX = 6

export function MagneticLink({
  href,
  children,
  className,
  download,
}: {
  href: string
  children: ReactNode
  className?: string
  download?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // damping high enough that the spring never crosses its target.
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.4 })

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    x.set(Math.max(-MAX, Math.min(MAX, dx * 0.3)))
    y.set(Math.max(-MAX, Math.min(MAX, dy * 0.3)))
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const isExternal = href.startsWith('http') || download

  if (isExternal) {
    return (
      <m.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        download={download}
        className={className}
        style={{ x: sx, y: sy, display: 'inline-block' }}
        onMouseMove={onMove}
        onMouseLeave={reset}
        onBlur={reset}
      >
        {children}
      </m.a>
    )
  }

  return (
    <m.span
      ref={ref as React.Ref<HTMLSpanElement>}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlur={reset}
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </m.span>
  )
}
