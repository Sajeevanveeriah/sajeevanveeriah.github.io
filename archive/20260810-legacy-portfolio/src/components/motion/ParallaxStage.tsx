'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { registerParallaxStage } from './parallax'

/**
 * Layered depth composition driven by scroll position.
 *
 * The stage is a container of stacked or sequenced layers, each of which
 * moves at its own rate as the stage crosses the viewport. It exists twice on
 * this site: the homepage hero graphic, split into its ground, obstacle and
 * route planes, and the lead selected-work record, where the photograph plate
 * and the signature diagram travel at different depths.
 *
 * Three things are deliberate:
 *
 *   - The stage renders complete and static on the server. `--p` is only ever
 *     written by the shared tick in parallax.ts, and the transform that reads
 *     it is scoped to `html[data-js]`, so without JavaScript every layer sits
 *     exactly where the document put it.
 *   - Under `prefers-reduced-motion: reduce` the stage never registers, so no
 *     scroll work happens at all, and globals.css additionally resets the
 *     layer transform. Both halves are needed: the reset alone would still
 *     leave a listener reading layout on every frame.
 *   - Decorative layers carry `alt=""` or `aria-hidden`, and the stage itself
 *     carries the one description of the whole composition. Describing each
 *     plane separately would announce one picture three times.
 */
export function ParallaxStage({
  children,
  label,
  role = 'img',
  className,
}: {
  children: ReactNode
  /** The single description of the composition as a whole. */
  label: string
  /**
   * `img` where the layers are purely decorative and the composition is the
   * content. `group` where the layers carry their own described content, so
   * that content stays reachable.
   */
  role?: 'img' | 'group'
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    return registerParallaxStage(el)
  }, [])

  return (
    <div
      ref={ref}
      className={`stage ${className ?? ''}`}
      data-parallax=""
      role={role}
      aria-label={label}
    >
      {children}
    </div>
  )
}

/**
 * One depth plane. `depth` is a multiplier on `--parallax-travel`: 0 is
 * pinned to the page, 1 travels the full 148px across a stage traverse.
 *
 * Wrap only elements whose box is already sized by the layout. A layer that
 * collapses to zero height before its image loads would move a hole around.
 */
export function ParallaxLayer({
  children,
  depth,
  className,
}: {
  children: ReactNode
  depth: number
  className?: string
}) {
  return (
    <div
      className={`stage__layer ${className ?? ''}`}
      style={{ '--depth': depth } as CSSProperties}
    >
      {children}
    </div>
  )
}
