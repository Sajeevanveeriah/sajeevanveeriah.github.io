'use client'

import { m } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Tier 1 content reveal. Always runs, 200 to 400ms, scroll triggered once.
 *
 * Tier 1 must never wait on tier 3, so this is driven purely by the
 * element's own viewport intersection and has no dependency on any ambient
 * component. Under reduced motion, MotionConfig reduces it to an opacity
 * change with no travel.
 */

const EASE_SERVO = [0.33, 0, 0.2, 1] as const

export function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
  className?: string
}) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.32, ease: EASE_SERVO, delay }}
    >
      {children}
    </Tag>
  )
}

/** Staggered group: children reveal in sequence rather than all at once. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </m.div>
  )
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
}) {
  const Tag = m[as]
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 14 },
        shown: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_SERVO } },
      }}
    >
      {children}
    </Tag>
  )
}
