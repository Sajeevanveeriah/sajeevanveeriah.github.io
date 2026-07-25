'use client'

import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Framer Motion is loaded through LazyMotion with the domAnimation feature
 * set only. The full `motion` bundle would spend roughly twice the
 * JavaScript for features this site does not use (layout projection, drag,
 * 3D), and the total budget is 180 KB gzipped including everything else.
 *
 * MotionConfig reducedMotion="user" makes every animation below respect the
 * OS setting without each component re-checking it.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
