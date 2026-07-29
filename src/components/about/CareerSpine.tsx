'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { m, useScroll, useReducedMotion } from 'framer-motion'
import { TierIndicator } from '@/components/ui/TierIndicator'
import type { Role } from '@/content/experience'
import c from './CareerSpine.module.css'

/**
 * The career record as a single drawn timeline.
 *
 * The spine fills with scroll position, which is what makes a set of roles
 * read as one continuous progression rather than a grid of unrelated cards.
 * Roles with no published dates say so rather than carrying an invented range.
 */
export function CareerSpine({ roles }: { roles: readonly Role[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 72%'],
  })

  return (
    <ol className={c.list} ref={ref}>
      <span className={c.spine} aria-hidden="true">
        <m.span
          className={c.spineFill}
          style={reduced ? { transform: 'none' } : { scaleY: scrollYProgress }}
        />
      </span>

      {roles.map((r) => (
        <li key={r.slug} className={c.role}>
          <span className={c.node} aria-hidden="true" />
          <div className={c.period}>
            <span className={c.periodValue}>{r.period ?? 'Dates not published'}</span>
            {r.evidenceTiers.map((t) => (
              <TierIndicator key={t} tier={t} />
            ))}
          </div>
          <div className={c.body}>
            <h3 className={c.company}>
              <Link href={`/about/${r.slug}/`}>{r.company}</Link>
            </h3>
            <p className={c.title}>{r.title}</p>
            <p className={c.summary}>{r.summary}</p>
            <ul className={c.domains}>
              {r.domains.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}
