'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Scroll reveal that cannot hide content.
 *
 * The server renders the element in its finished, visible state with no
 * inline opacity. The hidden starting state is applied by CSS only under
 * `html[data-js]`, a flag set by a blocking inline script in the document
 * head, so a visitor without JavaScript sees the complete page rather than a
 * column of invisible blocks. An IntersectionObserver then sets `data-shown`
 * once, which is what the transition runs on.
 *
 * This deliberately avoids framer-motion's whileInView: that ships
 * `opacity: 0` in the server HTML, which is exactly the failure mode above.
 * Reduced motion is handled globally in globals.css.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
}: {
  children: ReactNode
  as?: 'div' | 'section' | 'article' | 'li'
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-shown', '')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-shown', '')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const props = {
    ref: ref as React.Ref<never>,
    className: `reveal ${className ?? ''}`,
    style: delay ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined,
  }

  return <Tag {...props}>{children}</Tag>
}
