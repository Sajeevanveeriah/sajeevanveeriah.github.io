'use client'

import { useEffect } from 'react'

/**
 * Magnetic primary buttons, as a whole-document enhancement.
 *
 * Event delegation on the document catches every `.btn-primary` on every
 * route with no per-button wiring and no hydration cost: the component
 * renders nothing. The pull is a few pixels of translate toward the
 * pointer, small enough to read as responsiveness rather than a trick.
 *
 * Gated three ways: it needs JavaScript by construction, it only arms on a
 * fine pointer that can hover (a touch tap gains nothing from magnetism),
 * and it stands down entirely under prefers-reduced-motion, live, so
 * flipping the OS setting mid-visit is honoured without a reload.
 */
const PULL = 0.16
const MAX_PX = 5

export function MagneticButtons() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    const onMove = (e: PointerEvent) => {
      if (!fine.matches || reduced.matches) return
      const btn = (e.target as Element | null)?.closest?.('.btn-primary')
      if (!(btn instanceof HTMLElement)) return
      const box = btn.getBoundingClientRect()
      const dx = e.clientX - (box.left + box.width / 2)
      const dy = e.clientY - (box.top + box.height / 2)
      const tx = Math.max(-MAX_PX, Math.min(MAX_PX, dx * PULL))
      const ty = Math.max(-MAX_PX, Math.min(MAX_PX, dy * PULL))
      btn.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`
    }

    const onOut = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest?.('.btn-primary')
      if (!(btn instanceof HTMLElement)) return
      /* Only reset when the pointer actually left the button, not when it
         moved between the button's own children. */
      if (e.relatedTarget instanceof Node && btn.contains(e.relatedTarget)) return
      btn.style.transform = ''
    }

    const disarm = () => {
      if (!reduced.matches) return
      document.querySelectorAll<HTMLElement>('.btn-primary').forEach((b) => {
        b.style.transform = ''
      })
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    reduced.addEventListener('change', disarm)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      reduced.removeEventListener('change', disarm)
    }
  }, [])

  return null
}
