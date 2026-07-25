'use client'

import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import styles from './toolpath.module.css'

/**
 * Route transition: a short bezier trace between waypoints, like a
 * programmed tool path, plus a fast fade of the incoming route.
 *
 * 380ms total, inside the 400ms ceiling. The trace is decorative and
 * aria-hidden; the page content itself only fades, so it is never withheld
 * while the trace draws. Removed entirely under reduced motion, where the
 * route simply swaps.
 */
const EASE_SERVO = [0.33, 0, 0.2, 1] as const

export function ToolPath({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  if (reduced) return <>{children}</>

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, ease: EASE_SERVO }}
        >
          {children}
        </m.div>
      </AnimatePresence>

      <AnimatePresence>
        <m.svg
          key={pathname}
          className={styles.trace}
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <m.path
            d="M0 2 C 26 2, 30 0.4, 50 0.4 S 74 2, 100 2"
            className={styles.path}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.38, ease: EASE_SERVO }}
          />
        </m.svg>
      </AnimatePresence>
    </>
  )
}
