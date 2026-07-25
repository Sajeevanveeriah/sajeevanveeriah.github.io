'use client'

import { useEffect } from 'react'

/**
 * First-load instrument initialisation.
 *
 * Sets data-boot="play" on <html> for the duration of the sequence and
 * removes it afterwards. It deliberately renders no DOM of its own: an
 * earlier version wrapped the header in a div, which silently broke
 * position: sticky because a sticky element cannot travel outside its
 * parent's box.
 *
 * Runs once per session, not on every navigation. It only fades in
 * decorative layers; all copy is server-rendered and readable from the first
 * paint, so content is never gated behind it. Total 1000ms, inside the 1.2s
 * ceiling. Removed entirely under reduced motion.
 */
const KEY = 'boot-sequence-played'
const TOTAL_MS = 1000

export function BootSequence() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return
      sessionStorage.setItem(KEY, '1')
    } catch {
      return // Blocked storage means the sequence simply does not run.
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    root.setAttribute('data-boot', 'play')
    const timer = setTimeout(() => root.removeAttribute('data-boot'), TOTAL_MS)
    return () => {
      clearTimeout(timer)
      root.removeAttribute('data-boot')
    }
  }, [])

  return null
}
