'use client'

import { useEffect, useRef } from 'react'
import { useAmbient } from '@/hooks/useAmbient'
import styles from './robotics.module.css'

/**
 * Sparse depth-faded particle field. Hero only, one instance per page.
 *
 * Hard particle cap, canvas rendering, single rAF loop, paused whenever
 * useAmbient() is false. No pointer tracking and no scroll listener, so it
 * cannot affect scroll performance.
 */
const MAX_PARTICLES = 46

interface P {
  x: number
  y: number
  z: number
  vx: number
  vy: number
}

export function PointCloud() {
  const { ref, active } = useAmbient<HTMLCanvasElement>()
  const particles = useRef<P[]>([])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !active) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Deterministic seeding: no Math.random dependence on first paint order.
    if (particles.current.length === 0) {
      for (let i = 0; i < MAX_PARTICLES; i += 1) {
        const a = (i * 2.399963) % (Math.PI * 2)
        const r = ((i * 37) % 100) / 100
        particles.current.push({
          x: (0.5 + Math.cos(a) * r * 0.5) * w,
          y: (0.5 + Math.sin(a) * r * 0.5) * h,
          z: 0.25 + (((i * 53) % 100) / 100) * 0.75,
          vx: (((i % 7) - 3) / 3) * 0.08,
          vy: (((i % 5) - 2) / 2) * 0.06,
        })
      }
    }

    const colour = getComputedStyle(canvas).getPropertyValue('color').trim() || '#8FB0CE'
    let frame = 0

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        // Depth fade: nearer points are larger and brighter.
        ctx.globalAlpha = 0.1 + p.z * 0.32
        ctx.fillStyle = colour
        ctx.beginPath()
        ctx.arc(p.x, p.y, 0.7 + p.z * 1.1, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [active, ref])

  return <canvas ref={ref} className={styles.cloud} aria-hidden="true" />
}
