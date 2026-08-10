'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { m, useScroll, useReducedMotion } from 'framer-motion'
import type { SystemsLayer } from '@/content/systemsStack'
import { TierIndicator } from '@/components/ui/TierIndicator'
import s from './StackSpine.module.css'

/**
 * The Systems Stack as a single continuous spine rather than ten cards.
 *
 * A vertical accent line fills as the reader scrolls the stack, which is what
 * makes the ten layers read as one integrated capability instead of a list.
 * Each row keeps its tools visible at all times: hover only raises emphasis,
 * so nothing is hidden behind an interaction.
 */
export function StackSpine({
  layers,
  showLink = true,
}: {
  layers: readonly SystemsLayer[]
  showLink?: boolean
}) {
  const ref = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 78%', 'end 70%'],
  })

  return (
    <ol className={s.list} ref={ref}>
      <span className={s.spine} aria-hidden="true">
        <m.span
          className={s.spineFill}
          style={reduced ? { transform: 'none' } : { scaleY: scrollYProgress }}
        />
      </span>

      {layers.map((layer) => (
        <li key={layer.slug} className={s.row}>
          <span className={s.node} aria-hidden="true" />
          <span className={s.order}>{String(layer.order).padStart(2, '0')}</span>
          <div className={s.body}>
            <div className={s.headline}>
              <h3 className={s.name}>{layer.name}</h3>
              <TierIndicator tier={layer.evidenceTier} note={layer.tierNote} className={s.tier} />
            </div>
            <p className={s.description}>{layer.description}</p>
            <p className={s.tools}>{layer.tools.join('  ·  ')}</p>
          </div>
        </li>
      ))}

      {showLink ? (
        <li className={s.tail}>
          <Link href="/atlas/" className="arrowlink">
            Open the full engineering atlas
            <Arrow />
          </Link>
        </li>
      ) : null}
    </ol>
  )
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
