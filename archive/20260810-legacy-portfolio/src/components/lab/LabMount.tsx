'use client'

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'

type LabClientType = ComponentType<{ slug: string }>

/**
 * Progressive upgrade for a lab module.
 *
 * The children are the server-rendered static lab: the engine's real final
 * state, complete without JavaScript. The interactive module is imported
 * only after mount, so it never blocks first paint and never ships to a
 * reader whose scripting is off; once it arrives it replaces the static
 * state in place, opening on exactly the same defaults.
 */
export function LabMount({ slug, children }: { slug: string; children: ReactNode }) {
  const [Interactive, setInteractive] = useState<LabClientType | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let live = true
    const load = () =>
      import('./LabClient').then((m) => {
        if (live) setInteractive(() => m.LabClient)
      })
    // Deferred until the module approaches the viewport, so a record
    // carrying several embeds pays no script or engine cost during load.
    // Measured on the rover record this held total blocking time at the
    // pre-lab level instead of tripling it.
    const el = ref.current
    if (el && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect()
            void load()
          }
        },
        { rootMargin: '400px 0px' },
      )
      io.observe(el)
      return () => {
        live = false
        io.disconnect()
      }
    }
    void load()
    return () => {
      live = false
    }
  }, [])

  return <div ref={ref}>{Interactive ? <Interactive slug={slug} /> : children}</div>
}
