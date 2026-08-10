'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type ReactElement,
  type ReactNode,
} from 'react'
import { observeReveal } from './reveal-observer'

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
/**
 * Which movement a block arrives on. Chosen per stage so a heading, a list,
 * a wide plate and an image do not all enter identically. The behaviours
 * live in globals.css under `[data-reveal]`.
 */
export type RevealVariant = 'rise' | 'lift' | 'edge' | 'wipe'

/**
 * Sets `data-shown` the first time the element intersects, once.
 *
 * The observer itself lives in `reveal-observer.ts` and is shared by every
 * caller on the page. This hook only registers and deregisters; the threshold,
 * the root margin, the taller-than-viewport case and the `will-change`
 * lifecycle are all decided there, in one place.
 */
function useRevealOnce() {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => observeReveal(ref.current), [])

  return ref
}

export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  variant,
}: {
  children: ReactNode
  as?: 'div' | 'section' | 'article' | 'li'
  className?: string
  delay?: number
  variant?: RevealVariant
}) {
  const ref = useRevealOnce()

  const props = {
    ref: ref as React.Ref<never>,
    className: `reveal ${className ?? ''}`,
    // 'rise' is the stylesheet default, so it needs no attribute.
    'data-reveal': variant && variant !== 'rise' ? variant : undefined,
    style: delay ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined,
  }

  return <Tag {...props}>{children}</Tag>
}

/**
 * A group whose children resolve in reading order rather than snapping in
 * together.
 *
 * The cascade is CSS transition delay driven off an inline `--i` per child,
 * for the same reason `Reveal` avoids framer-motion's whileInView: the server
 * must render the finished, visible state, and the offset state may only
 * exist once `html[data-js]` is set. Children are cloned rather than wrapped
 * so the group's own grid or flex layout is not disturbed by an extra box.
 */
export function Stagger({
  children,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode
  as?: 'div' | 'ul' | 'ol' | 'section'
  className?: string
}) {
  const ref = useRevealOnce()

  return (
    <Tag ref={ref as React.Ref<never>} className={`stagger ${className ?? ''}`}>
      {Children.map(children, (child, i) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<{ style?: React.CSSProperties }>, {
              style: {
                ...(child.props as { style?: React.CSSProperties }).style,
                ['--i' as string]: i,
              } as React.CSSProperties,
            })
          : child,
      )}
    </Tag>
  )
}
