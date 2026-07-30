'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { TierIndicator } from '@/components/ui/TierIndicator'
import { observeReveal } from '@/components/motion/reveal-observer'
import type { Role } from '@/content/experience'
import c from './CareerSpine.module.css'

/**
 * The career record as a single drawn timeline.
 *
 * The spine fills once, as the list arrives, which is what makes a set of
 * roles read as one continuous progression rather than a grid of unrelated
 * cards. It used to fill against scroll position through framer-motion's
 * `useScroll`, which meant a scroll-linked value recomputed on every frame
 * the list was anywhere near the viewport, and a second animation library
 * loaded on a page that otherwise needs none. The same reading comes from the
 * page's one IntersectionObserver and a single CSS transition: no scroll
 * listener, no per-frame work, nothing to throttle.
 *
 * Roles with no published dates say so rather than carrying an invented range.
 */
export function CareerSpine({ roles }: { roles: readonly Role[] }) {
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => observeReveal(ref.current), [])

  return (
    <ol className={c.list} ref={ref}>
      <span className={c.spine} aria-hidden="true">
        <span className={c.spineFill} />
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
              {/* The employer page, not the old role URL. Both resolve; only
                  one is authored. */}
              <Link href={`/employers/${r.slug}/`}>{r.company}</Link>
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
