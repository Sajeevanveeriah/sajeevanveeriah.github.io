'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Gate for all tier 3 ambient motion.
 *
 * Returns a ref to attach to the ambient element and a boolean that is true
 * only when every condition for animating holds:
 *   - the user has not asked for reduced motion
 *   - the element is intersecting the viewport
 *   - the tab is visible
 *   - the device is not obviously low-end
 *
 * Ambient components must not run a rAF loop unless this returns true, so
 * ambient motion can never burn frames off-screen or in a background tab.
 */
export function useAmbient<T extends Element>() {
  const ref = useRef<T>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Low-end heuristic. The threshold is deliberately conservative: 4 cores
    // is an ordinary laptop or mid-range phone and must still get the ambient
    // layer, so only 2 or fewer counts as low-end.
    const cores = navigator.hardwareConcurrency ?? 8
    type Conn = { saveData?: boolean; effectiveType?: string }
    const conn = (navigator as Navigator & { connection?: Conn }).connection
    const lowEnd =
      cores <= 2 || conn?.saveData === true || /(^|-)2g$/.test(conn?.effectiveType ?? '')

    let visible = false

    const evaluate = () => {
      setActive(
        !motionQuery.matches && !lowEnd && visible && document.visibilityState === 'visible',
      )
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false
        evaluate()
      },
      { threshold: 0 },
    )
    observer.observe(node)

    document.addEventListener('visibilitychange', evaluate)
    motionQuery.addEventListener('change', evaluate)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', evaluate)
      motionQuery.removeEventListener('change', evaluate)
      setActive(false)
    }
  }, [])

  return { ref, active }
}

/** True once the user has asked for reduced motion. Static after mount. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true) // safe default before hydration
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setReduced(q.matches)
    set()
    q.addEventListener('change', set)
    return () => q.removeEventListener('change', set)
  }, [])
  return reduced
}
