'use client'

import { useEffect, useRef } from 'react'
import { useAmbient } from '@/hooks/useAmbient'
import styles from './robotics.module.css'

/**
 * Abstract multi-joint kinematic chain, hero only.
 *
 * Forward kinematics on three revolute joints, each easing between hold
 * poses with a servo profile: no overshoot, no elastic return. Deliberately
 * geometric rather than a literal robot illustration.
 *
 * Tier 3: runs on requestAnimationFrame, only while useAmbient() is true.
 * Fully decorative, so the whole SVG is aria-hidden and the page reads
 * identically without it.
 */

const L1 = 78
const L2 = 62
const L3 = 34

// Hold poses in degrees for the three joints. The chain eases between them
// and pauses at each, the way a taught pendant programme steps waypoints.
const POSES: readonly (readonly [number, number, number])[] = [
  [-62, 44, 18],
  [-28, 68, -22],
  [-84, 30, 34],
  [-46, 82, 6],
]

const SEGMENT_MS = 2600
const HOLD_MS = 900

/** Servo profile: symmetric ease, monotonic, never exceeds the target. */
function servo(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function KinematicChain() {
  const { ref, active } = useAmbient<SVGSVGElement>()
  const parts = useRef<(SVGElement | null)[]>([])

  useEffect(() => {
    if (!active) return
    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const cycle = SEGMENT_MS + HOLD_MS
      const elapsed = (now - start) % (cycle * POSES.length)
      const index = Math.floor(elapsed / cycle)
      const withinSegment = Math.min((elapsed % cycle) / SEGMENT_MS, 1)

      const from = POSES[index] ?? POSES[0]!
      const to = POSES[(index + 1) % POSES.length] ?? POSES[0]!
      const k = servo(withinSegment)

      const a1 = from[0] + (to[0] - from[0]) * k
      const a2 = from[1] + (to[1] - from[1]) * k
      const a3 = from[2] + (to[2] - from[2]) * k

      // Each joint rotates in its parent's frame, so the chain is nested
      // rather than solved in world coordinates.
      parts.current[0]?.setAttribute('transform', `rotate(${a1.toFixed(2)})`)
      parts.current[1]?.setAttribute('transform', `translate(${L1} 0) rotate(${a2.toFixed(2)})`)
      parts.current[2]?.setAttribute('transform', `translate(${L2} 0) rotate(${a3.toFixed(2)})`)

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active])

  return (
    <svg
      ref={ref}
      className={styles.chain}
      viewBox="0 0 260 220"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(46 168)">
        {/* Base */}
        <line x1="-26" y1="0" x2="26" y2="0" className={styles.chainBase} />
        <circle r="5" className={styles.chainJoint} />

        <g ref={(el) => { parts.current[0] = el }} transform="rotate(-62)">
          <line x1="0" y1="0" x2={L1} y2="0" className={styles.chainLink} />
          <g ref={(el) => { parts.current[1] = el }} transform={`translate(${L1} 0) rotate(44)`}>
            <circle r="4" className={styles.chainJoint} />
            <line x1="0" y1="0" x2={L2} y2="0" className={styles.chainLink} />
            <g ref={(el) => { parts.current[2] = el }} transform={`translate(${L2} 0) rotate(18)`}>
              <circle r="3.5" className={styles.chainJoint} />
              <line x1="0" y1="0" x2={L3} y2="0" className={styles.chainLink} />
              {/* End effector */}
              <g transform={`translate(${L3} 0)`}>
                <line x1="0" y1="-7" x2="0" y2="7" className={styles.chainTool} />
                <line x1="0" y1="-7" x2="9" y2="-7" className={styles.chainTool} />
                <line x1="0" y1="7" x2="9" y2="7" className={styles.chainTool} />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
