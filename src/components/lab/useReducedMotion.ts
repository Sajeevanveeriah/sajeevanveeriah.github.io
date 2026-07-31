'use client'

import { useEffect, useState } from 'react'

/**
 * Live `prefers-reduced-motion` state.
 *
 * Defaults to `true` until the media query has actually been read, so the
 * first client render can never start an animation the visitor asked not to
 * see; the animated path is opted into, never out of.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}
