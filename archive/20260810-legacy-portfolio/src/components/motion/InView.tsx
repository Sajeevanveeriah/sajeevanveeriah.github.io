'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Marks a subtree as on-screen so its motion can run, and off-screen so it
 * stops.
 *
 * The signature diagrams used to run eight independent seven second loops
 * forever, whether or not anyone could see them. That reads as restless
 * rather than composed, and it burns compositing work on a graphic that is
 * three screens away. This wrapper sets `data-inview` while the element is
 * intersecting and removes it when it leaves, and the stylesheets pause every
 * ambient animation that is not marked.
 *
 * The server renders without the attribute and the paused state is scoped to
 * `html[data-js]`, so a visitor without JavaScript gets the running animation
 * rather than a frozen first frame. `once` keeps the attribute after the
 * first entry, which is what a one-shot sequence wants.
 */
export function InView({
  children,
  as: Tag = 'div',
  className,
  once = false,
  amount = 0.25,
}: {
  children: ReactNode
  as?: 'div' | 'figure' | 'section' | 'article'
  className?: string
  once?: boolean
  amount?: number
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-inview', '')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-inview', '')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.removeAttribute('data-inview')
          }
        }
      },
      { threshold: amount },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, amount])

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  )
}
