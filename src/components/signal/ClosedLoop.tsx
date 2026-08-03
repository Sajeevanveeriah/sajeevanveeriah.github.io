'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { m, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion'
import { closedLoop } from '@/content/about'
import { TechnicalDepth } from '@/components/ui/TechnicalDepth'
import s from './ClosedLoop.module.css'

/**
 * Scroll-driven closed-loop narrative.
 *
 * Scroll position across the section drives one shared progress value. The
 * connector fills, and each stage latches as the fill reaches it, so the
 * reader steps through the loop rather than watching a decoration.
 *
 * The section is a normal-height block, not a sticky scroll trap, which is
 * why it never strands an empty viewport behind it. Under reduced motion the
 * connector renders complete and every stage renders active on the first
 * frame, so nothing depends on scrolling to become readable.
 */
export function ClosedLoop() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    // The stage row is short, so the read window is widened well past it:
    // a narrower offset would saturate the fill within a single scroll flick.
    offset: ['start 92%', 'end 52%'],
  })

  const count = closedLoop.nodes.length

  return (
    <div className={s.root} ref={ref} data-static={reduced ? '' : undefined}>
      {/* Two fills so each orientation scales on its own axis only: a shared
          element would squash the 1px cross axis to nothing. */}
      <span className={s.connector} aria-hidden="true">
        <m.span
          className={`${s.connectorFill} ${s.fillY}`}
          style={reduced ? undefined : { scaleY: scrollYProgress }}
        />
        <m.span
          className={`${s.connectorFill} ${s.fillX}`}
          style={reduced ? undefined : { scaleX: scrollYProgress }}
        />
      </span>

      <ol className={s.stages}>
        {closedLoop.nodes.map((node, i) => (
          <Stage
            key={node.name}
            node={node}
            progress={scrollYProgress}
            start={i / count}
            reduced={Boolean(reduced)}
          />
        ))}
      </ol>
    </div>
  )
}

function Stage({
  node,
  progress,
  start,
  reduced,
}: {
  node: (typeof closedLoop.nodes)[number]
  progress: MotionValue<number>
  start: number
  reduced: boolean
}) {
  // Latches just before the fill physically reaches the marker.
  const active = useTransform(progress, [Math.max(0, start - 0.05), start + 0.05], [0, 1])

  return (
    <m.li className={s.stage} style={reduced ? undefined : ({ '--active': active } as never)}>
      <span className={s.marker} aria-hidden="true">
        <span className={s.markerCore} />
      </span>
      <span className={s.index}>{node.index}</span>
      <h3 className={s.name}>{node.name}</h3>
      <p className={s.detail}>{node.detail}</p>
      {/* Collapsed, the stage row keeps its original shape; the depth is
          one interaction away, and fully readable without JavaScript. */}
      <div className={s.depth}>
        <TechnicalDepth title={closedLoop.expandLabel}>
          {node.depth.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p className={s.depthRecords}>
            {node.records.map((r, i) => (
              <span key={r.href}>
                {i > 0 ? ' / ' : 'Evidence: '}
                <Link href={r.href}>{r.label}</Link>
              </span>
            ))}
          </p>
        </TechnicalDepth>
      </div>
    </m.li>
  )
}
