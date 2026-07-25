'use client'

import { useEffect } from 'react'
import { useAmbient } from '@/hooks/useAmbient'
import styles from './robotics.module.css'

/**
 * Faint coordinate grid background layer, permitted site-wide at very low
 * opacity. Contrast is unaffected because the grid colour is a dedicated
 * --grid-line token at roughly 3% alpha in both themes.
 *
 * Parallax is applied by writing a CSS custom property from a scroll handler
 * that is itself throttled to one write per animation frame, and it is only
 * bound while useAmbient() is true.
 */
export function CoordinateGrid() {
  const { ref, active } = useAmbient<HTMLDivElement>()

  useEffect(() => {
    const node = ref.current
    if (!node || !active) return

    let frame = 0
    let queued = false

    const apply = () => {
      queued = false
      node.style.setProperty('--parallax', `${window.scrollY * 0.045}px`)
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      frame = requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      node.style.removeProperty('--parallax')
    }
  }, [active, ref])

  return <div ref={ref} className={styles.grid} aria-hidden="true" />
}
