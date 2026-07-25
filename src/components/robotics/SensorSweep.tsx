'use client'

import { useAmbient } from '@/hooks/useAmbient'
import styles from './robotics.module.css'

/**
 * Rotating arc suggesting a LIDAR scan. Low opacity, and never more than one
 * visible at a time: the hero mounts one, and a section divider may mount
 * one where no hero is present.
 *
 * Driven by a CSS animation rather than rAF, and the animation only runs
 * while the element has the active class, so it stops off-screen. The global
 * reduced-motion rule in globals.css removes it outright.
 */
export function SensorSweep() {
  const { ref, active } = useAmbient<SVGSVGElement>()

  return (
    <svg
      ref={ref}
      className={`${styles.sweep} ${active ? styles.sweepActive : ''}`}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="sweep-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="88" className={styles.sweepRing} />
      <circle cx="100" cy="100" r="58" className={styles.sweepRing} />
      <circle cx="100" cy="100" r="28" className={styles.sweepRing} />
      <g className={styles.sweepArm}>
        <path d="M100 100 L188 100 A88 88 0 0 0 162 38 Z" fill="url(#sweep-fade)" />
        <line x1="100" y1="100" x2="188" y2="100" className={styles.sweepLine} />
      </g>
    </svg>
  )
}
