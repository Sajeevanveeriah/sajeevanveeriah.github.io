'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { videoLibrary } from '@/content/media'
import { LoopingVideo } from './LoopingVideo'

type LabMode = 'slam' | 'kinematics' | 'pid'

interface Vec2 {
  x: number
  y: number
}

interface ObstacleRect {
  x: number
  y: number
  w: number
  h: number
}

const MODES: readonly {
  readonly id: LabMode
  readonly label: string
  readonly title: string
  readonly detail: string
}[] = [
  {
    id: 'slam',
    label: 'ROS 2 SLAM',
    title: 'Differential-drive kinematics, 36-ray LiDAR and 2D EKF covariance.',
    detail: 'Click, tap or set X/Y in the 10.0 m x 6.0 m arena; tangential avoidance and 2D covariance update live.',
  },
  {
    id: 'kinematics',
    label: '3-DOF Arm',
    title: 'Planar 3-link inverse kinematics within a 0.96 m reach envelope.',
    detail: 'Move pointer or tap inside the workspace to inspect joint angles q1, q2 and q3.',
  },
  {
    id: 'pid',
    label: 'PID Scope',
    title: 'Closed-loop second-order servo response with actuator limits.',
    detail: 'Adjust Kp, Ki and Kd gains to inspect overshoot, settling time and damping regime.',
  },
] as const

const ARENA_W = 10.0
const ARENA_H = 6.0
const OBSTACLES: readonly ObstacleRect[] = [
  { x: 2.35, y: 1.15, w: 1.05, h: 1.45 },
  { x: 4.55, y: 3.15, w: 1.25, h: 1.35 },
  { x: 6.75, y: 1.1, w: 0.9, h: 1.65 },
  { x: 6.9, y: 4.05, w: 1.45, h: 0.85 },
]

const SLAM_WAYPOINTS: readonly { readonly label: string; readonly x: number; readonly y: number }[] = [
  { label: 'WP-1', x: 8.6, y: 2.2 },
  { label: 'WP-2', x: 4.9, y: 1.2 },
  { label: 'WP-3', x: 2.0, y: 4.6 },
]

const ARM_L1 = 0.42
const ARM_L2 = 0.34
const ARM_L3 = 0.20
const ARM_MAX = ARM_L1 + ARM_L2 + ARM_L3
const ARM_MIN = 0.14

const ARM_PRESETS: readonly { readonly label: string; readonly x: number; readonly y: number }[] = [
  { label: 'Home', x: 0.56, y: 0.42 },
  { label: 'Inspect', x: -0.44, y: 0.58 },
  { label: 'Extend', x: 0.82, y: 0.24 },
]

interface PidSample {
  t: number
  y: number
  u: number
}

interface PidMetrics {
  samples: PidSample[]
  overshootPct: number
  settlingMs: number
  settled: boolean
  steadyErrorPct: number
  regime: 'Underdamped' | 'Critically damped' | 'Overdamped' | 'Steady-state offset' | 'Unstable'
}

const ARM_INIT_ANGLES = solveCcd([0.6, 0.35, -0.25], 0.56, 0.42)
const ARM_INIT_PTS = fkPoints(ARM_INIT_ANGLES)

function solvePidStep(kp: number, ki: number, kd: number): PidMetrics {
  const dt = 0.004
  const totalTime = 4.0
  const steps = Math.round(totalTime / dt)
  const uMax = 30.0
  const setpoint = 1.0

  let y = 0.0
  let v = 0.0
  let integral = 0.0
  let prevError = setpoint - y
  let derivFiltered = 0.0
  const samples: PidSample[] = []
  let maxY = 0.0

  for (let i = 0; i <= steps; i += 1) {
    const t = i * dt
    const error = setpoint - y
    const rawDeriv = (error - prevError) / dt
    derivFiltered = derivFiltered * 0.82 + rawDeriv * 0.18
    prevError = error

    const uUnsat = kp * error + ki * integral + kd * derivFiltered
    const u = Math.max(-uMax, Math.min(uMax, uUnsat))

    const saturatedHigh = uUnsat > uMax && error > 0
    const saturatedLow = uUnsat < -uMax && error < 0
    if (!saturatedHigh && !saturatedLow) {
      integral += error * dt
    }

    const k1y = v
    const k1v = -1.8 * v - 1.0 * y + u
    const y2 = y + 0.5 * dt * k1y
    const v2 = v + 0.5 * dt * k1v
    const k2y = v2
    const k2v = -1.8 * v2 - 1.0 * y2 + u
    const y3 = y + 0.5 * dt * k2y
    const v3 = v + 0.5 * dt * k2v
    const k3y = v3
    const k3v = -1.8 * v3 - 1.0 * y3 + u
    const y4 = y + dt * k3y
    const v4 = v + dt * k3v
    const k4y = v4
    const k4v = -1.8 * v4 - 1.0 * y4 + u

    y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y)
    v += (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v)

    if (y > maxY) maxY = y
    if (i % 4 === 0) {
      samples.push({ t, y, u })
    }
  }

  const last = samples[samples.length - 1]?.y ?? y
  const overshootPct = Math.max(0, (maxY - setpoint) * 100)
  const steadyErrorPct = Math.abs(setpoint - last) * 100

  let lastOutOfBandIdx = -1
  for (let i = samples.length - 1; i >= 0; i -= 1) {
    if (Math.abs(samples[i]!.y - setpoint) > 0.02) {
      lastOutOfBandIdx = i
      break
    }
  }
  const settledSample = lastOutOfBandIdx < 0 ? samples[0] : samples[lastOutOfBandIdx + 1]
  const settled = Boolean(settledSample && lastOutOfBandIdx < samples.length - 8 && steadyErrorPct <= 2.5)
  const settlingMs = settled && settledSample ? Math.round(settledSample.t * 1000) : Math.round(totalTime * 1000)

  const tailSwing =
    Math.max(...samples.slice(-40).map((s) => s.y)) -
    Math.min(...samples.slice(-40).map((s) => s.y))

  let regime: PidMetrics['regime'] = 'Overdamped'
  if (tailSwing > 0.12 || Math.abs(last) > 3.5) {
    regime = 'Unstable'
  } else if (steadyErrorPct > 5.0 && tailSwing <= 0.03) {
    regime = 'Steady-state offset'
  } else if (overshootPct > 1.5) {
    regime = 'Underdamped'
  } else if (overshootPct <= 1.5 && settled && settlingMs <= 2200) {
    regime = 'Critically damped'
  } else {
    regime = 'Overdamped'
  }

  return { samples, overshootPct, settlingMs, settled, steadyErrorPct, regime }
}

function buildSegments(): readonly [Vec2, Vec2][] {
  const segs: [Vec2, Vec2][] = [
    [{ x: 0, y: 0 }, { x: ARENA_W, y: 0 }],
    [{ x: ARENA_W, y: 0 }, { x: ARENA_W, y: ARENA_H }],
    [{ x: ARENA_W, y: ARENA_H }, { x: 0, y: ARENA_H }],
    [{ x: 0, y: ARENA_H }, { x: 0, y: 0 }],
  ]
  for (const o of OBSTACLES) {
    segs.push([{ x: o.x, y: o.y }, { x: o.x + o.w, y: o.y }])
    segs.push([{ x: o.x + o.w, y: o.y }, { x: o.x + o.w, y: o.y + o.h }])
    segs.push([{ x: o.x + o.w, y: o.y + o.h }, { x: o.x, y: o.y + o.h }])
    segs.push([{ x: o.x, y: o.y + o.h }, { x: o.x, y: o.y }])
  }
  return segs
}

const ARENA_SEGMENTS = buildSegments()

function rayIntersect(ox: number, oy: number, dx: number, dy: number, maxRange: number): number {
  let closest = maxRange
  for (const [a, b] of ARENA_SEGMENTS) {
    const sx = b.x - a.x
    const sy = b.y - a.y
    const denom = dx * sy - dy * sx
    if (Math.abs(denom) < 1e-7) continue
    const qpx = a.x - ox
    const qpy = a.y - oy
    const t = (qpx * sy - qpy * sx) / denom
    const u = (qpx * dy - qpy * dx) / denom
    if (t >= 0 && t < closest && u >= 0 && u <= 1) {
      closest = t
    }
  }
  return closest
}

function clampWaypoint(x: number, y: number): Vec2 {
  let cx = Math.max(0.55, Math.min(ARENA_W - 0.55, x))
  let cy = Math.max(0.55, Math.min(ARENA_H - 0.55, y))
  for (const o of OBSTACLES) {
    const pad = 0.42
    if (cx > o.x - pad && cx < o.x + o.w + pad && cy > o.y - pad && cy < o.y + o.h + pad) {
      const left = Math.abs(cx - (o.x - pad))
      const right = Math.abs(o.x + o.w + pad - cx)
      const top = Math.abs(cy - (o.y - pad))
      const bottom = Math.abs(o.y + o.h + pad - cy)
      const minD = Math.min(left, right, top, bottom)
      if (minD === left) cx = o.x - pad
      else if (minD === right) cx = o.x + o.w + pad
      else if (minD === top) cy = o.y - pad
      else cy = o.y + o.h + pad
    }
  }
  return { x: cx, y: cy }
}

function planArenaPath(sx: number, sy: number, gx: number, gy: number): Vec2[] {
  const step = 0.25
  const cols = Math.floor(ARENA_W / step)
  const rows = Math.floor(ARENA_H / step)
  const blocked = (c: number, r: number) => {
    const x = (c + 0.5) * step
    const y = (r + 0.5) * step
    if (x < 0.35 || x > ARENA_W - 0.35 || y < 0.35 || y > ARENA_H - 0.35) return true
    return OBSTACLES.some((o) => x > o.x - 0.42 && x < o.x + o.w + 0.42 && y > o.y - 0.42 && y < o.y + o.h + 0.42)
  }
  const nearestFree = (tx: number, ty: number): [number, number] => {
    const sc = Math.max(0, Math.min(cols - 1, Math.floor(tx / step)))
    const sr = Math.max(0, Math.min(rows - 1, Math.floor(ty / step)))
    if (!blocked(sc, sr)) return [sc, sr]
    for (let rad = 1; rad < 12; rad += 1) {
      for (let dr = -rad; dr <= rad; dr += 1) {
        for (let dc = -rad; dc <= rad; dc += 1) {
          const nc = sc + dc
          const nr = sr + dr
          if (nc >= 0 && nc < cols && nr >= 0 && nr < rows && !blocked(nc, nr)) return [nc, nr]
        }
      }
    }
    return [sc, sr]
  }
  const [sc, sr] = nearestFree(sx, sy)
  const [gc, gr] = nearestFree(gx, gy)
  const key = (c: number, r: number) => r * cols + c
  const dist = new Float32Array(cols * rows).fill(1e9)
  const prev = new Int32Array(cols * rows).fill(-1)
  const startKey = key(sc, sr)
  const goalKey = key(gc, gr)
  const queue: number[] = [startKey]
  dist[startKey] = 0
  const dirs = [
    [1, 0, 1],
    [-1, 0, 1],
    [0, 1, 1],
    [0, -1, 1],
    [1, 1, 1.414],
    [-1, 1, 1.414],
    [1, -1, 1.414],
    [-1, -1, 1.414],
  ] as const
  while (queue.length) {
    let bestIdx = 0
    for (let i = 1; i < queue.length; i += 1) {
      if (dist[queue[i]!]! < dist[queue[bestIdx]!]!) bestIdx = i
    }
    const u = queue.splice(bestIdx, 1)[0]!
    if (u === goalKey) break
    const uc = u % cols
    const ur = Math.floor(u / cols)
    for (const [dc, dr, w] of dirs) {
      const nc = uc + dc
      const nr = ur + dr
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows || blocked(nc, nr)) continue
      if (dc !== 0 && dr !== 0 && (blocked(uc + dc, ur) || blocked(uc, ur + dr))) continue
      const v = key(nc, nr)
      const nd = dist[u]! + w
      if (nd < dist[v]!) {
        dist[v] = nd
        prev[v] = u
        queue.push(v)
      }
    }
  }
  const path: Vec2[] = []
  let cur = goalKey
  while (cur !== -1) {
    path.push({ x: ((cur % cols) + 0.5) * step, y: (Math.floor(cur / cols) + 0.5) * step })
    if (cur === startKey) break
    cur = prev[cur]!
  }
  path.reverse()
  path.push({ x: gx, y: gy })
  return path
}

function solveCcd(
  angles: [number, number, number],
  tx: number,
  ty: number,
): [number, number, number] {
  const lengths = [ARM_L1, ARM_L2, ARM_L3] as const
  const next: [number, number, number] = [...angles]
  const fk = (q: [number, number, number]) => {
    const pts: Vec2[] = [{ x: 0, y: 0 }]
    let acc = 0
    for (let i = 0; i < 3; i += 1) {
      acc += q[i]!
      const prev = pts[pts.length - 1]!
      pts.push({
        x: prev.x + lengths[i]! * Math.cos(acc),
        y: prev.y + lengths[i]! * Math.sin(acc),
      })
    }
    return pts
  }

  for (let iter = 0; iter < 12; iter += 1) {
    for (let j = 2; j >= 0; j -= 1) {
      const pts = fk(next)
      const joint = pts[j]!
      const end = pts[3]!
      const toEndAngle = Math.atan2(end.y - joint.y, end.x - joint.x)
      const toTargetAngle = Math.atan2(ty - joint.y, tx - joint.x)
      let delta = toTargetAngle - toEndAngle
      while (delta > Math.PI) delta -= Math.PI * 2
      while (delta < -Math.PI) delta += Math.PI * 2
      next[j] = next[j]! + delta * 0.55
      if (j === 0) {
        next[0] = Math.max(-0.25, Math.min(Math.PI + 0.25, next[0]))
      } else {
        next[j] = Math.max(-2.55, Math.min(2.55, next[j]!))
      }
    }
  }
  return next
}

function fkPoints(q: readonly [number, number, number]): [Vec2, Vec2, Vec2, Vec2] {
  const p0 = { x: 0, y: 0 }
  const a1 = q[0]
  const p1 = { x: ARM_L1 * Math.cos(a1), y: ARM_L1 * Math.sin(a1) }
  const a2 = a1 + q[1]
  const p2 = { x: p1.x + ARM_L2 * Math.cos(a2), y: p1.y + ARM_L2 * Math.sin(a2) }
  const a3 = a2 + q[2]
  const p3 = { x: p2.x + ARM_L3 * Math.cos(a3), y: p2.y + ARM_L3 * Math.sin(a3) }
  return [p0, p1, p2, p3]
}

function readThemePalette() {
  if (typeof document === 'undefined') {
    return {
      dark: true,
      bg: '#091320',
      grid: 'rgba(140, 165, 198, 0.14)',
      gridStrong: 'rgba(140, 165, 198, 0.28)',
      ink: '#eef1f6',
      muted: '#94a7c0',
      wallFill: '#15253d',
      wallStroke: '#38527a',
      amber: '#f5b700',
      amberSoft: 'rgba(245, 183, 0, 0.18)',
      cyan: '#5ac8fa',
      cyanSoft: 'rgba(90, 200, 250, 0.16)',
      linkStroke: '#c5d2e3',
    }
  }
  const dark = document.documentElement.dataset.theme === 'dark'
  if (dark) {
    return {
      dark: true,
      bg: '#091320',
      grid: 'rgba(140, 165, 198, 0.14)',
      gridStrong: 'rgba(140, 165, 198, 0.28)',
      ink: '#eef1f6',
      muted: '#9cb0c9',
      wallFill: '#15253d',
      wallStroke: '#3c5780',
      amber: '#f5b700',
      amberSoft: 'rgba(245, 183, 0, 0.18)',
      cyan: '#5ac8fa',
      cyanSoft: 'rgba(90, 200, 250, 0.18)',
      linkStroke: '#d5dfec',
    }
  }
  return {
    dark: false,
    bg: '#f8fafc',
    grid: 'rgba(15, 30, 51, 0.08)',
    gridStrong: 'rgba(15, 30, 51, 0.18)',
    ink: '#0f1e33',
    muted: '#465871',
    wallFill: '#dce4ef',
    wallStroke: '#7f92ab',
    amber: '#c48300',
    amberSoft: 'rgba(245, 183, 0, 0.26)',
    cyan: '#0f5c99',
    cyanSoft: 'rgba(15, 92, 153, 0.14)',
    linkStroke: '#0f1e33',
  }
}

export function EngineeringLab({
  initialMode = 'slam',
}: {
  readonly initialMode?: LabMode
}) {
  const [mode, setMode] = useState<LabMode>(initialMode)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [themeKey, setThemeKey] = useState(0)

  const [kp, setKp] = useState(9.0)
  const [ki, setKi] = useState(3.0)
  const [kd, setKd] = useState(2.4)

  const [slamReadout, setSlamReadout] = useState({
    x: 1.4,
    y: 4.5,
    yawDeg: (-0.24 * 180) / Math.PI,
    v: 0.0,
    omega: 0.0,
    ekfMm: Math.round(Math.hypot(0.085, 0.055) * 1000),
    state: 'TRACKING' as 'TRACKING' | 'REACHED',
  })

  const [slamTarget, setSlamTarget] = useState({ x: 8.6, y: 2.2 })
  const [armTarget, setArmTarget] = useState({ x: 0.56, y: 0.42 })

  const [armReadout, setArmReadout] = useState(() => {
    const end = ARM_INIT_PTS[3]!
    return {
      x: end.x,
      y: end.y,
      q1: (ARM_INIT_ANGLES[0] * 180) / Math.PI,
      q2: (ARM_INIT_ANGLES[1] * 180) / Math.PI,
      q3: (ARM_INIT_ANGLES[2] * 180) / Math.PI,
      reach: Math.hypot(end.x, end.y),
      clamped: false,
    }
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const slamState = useRef({
    x: 1.4,
    y: 4.5,
    yaw: -0.24,
    v: 0.0,
    omega: 0.0,
    wx: 8.6,
    wy: 2.2,
    path: planArenaPath(1.4, 4.5, 8.6, 2.2),
    pathIdx: 0,
    ekfA: 0.085,
    ekfB: 0.055,
    trail: [{ x: 1.4, y: 4.5 }] as Vec2[],
    cloud: [] as Vec2[],
    frameTick: 0,
  })

  const armState = useRef({
    targetX: 0.56,
    targetY: 0.42,
    clamped: false,
    angles: [...ARM_INIT_ANGLES] as [number, number, number],
    trail: [] as Vec2[],
    frameTick: 0,
  })

  const pidCursor = useRef({ t: 0 })

  const pidMetrics = useMemo(() => solvePidStep(kp, ki, kd), [kp, ki, kd])

  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const bump = () => setThemeKey((k) => k + 1)
    const obs = new MutationObserver(bump)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    addEventListener('sv-theme-change', bump)
    return () => {
      obs.disconnect()
      removeEventListener('sv-theme-change', bump)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.08 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const drawFrame = useCallback(
    (advancePhysics: boolean, dt: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const targetW = Math.round(rect.width * dpr)
      const targetH = Math.round(rect.height * dpr)
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW
        canvas.height = targetH
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.save()
      ctx.scale(dpr, dpr)
      const W = rect.width
      const H = rect.height
      const pal = readThemePalette()

      ctx.fillStyle = pal.bg
      ctx.fillRect(0, 0, W, H)

      if (mode === 'slam') {
        const s = slamState.current
        const pad = 18
        const scale = Math.min((W - pad * 2) / ARENA_W, (H - pad * 2) / ARENA_H)
        const ox = (W - ARENA_W * scale) / 2
        const oy = (H - ARENA_H * scale) / 2
        const toPx = (mx: number, my: number): Vec2 => ({ x: ox + mx * scale, y: oy + my * scale })

        if (advancePhysics) {
          const dx = s.wx - s.x
          const dy = s.wy - s.y
          const dist = Math.hypot(dx, dy)
          while (s.pathIdx < s.path.length - 1 && Math.hypot(s.path[s.pathIdx]!.x - s.x, s.path[s.pathIdx]!.y - s.y) < 0.35) {
            s.pathIdx += 1
          }
          const tgt = s.path[s.pathIdx] ?? { x: s.wx, y: s.wy }
          const steerAngle = Math.atan2(tgt.y - s.y, tgt.x - s.x)

          let lidarHits = 0
          for (let i = 0; i < 36; i += 1) {
            const ang = s.yaw + (i / 36) * Math.PI * 2
            const r = rayIntersect(s.x, s.y, Math.cos(ang), Math.sin(ang), 4.5)
            if (r < 4.45) lidarHits += 1
          }

          let errAngle = steerAngle - s.yaw
          while (errAngle > Math.PI) errAngle -= Math.PI * 2
          while (errAngle < -Math.PI) errAngle += Math.PI * 2

          const targetV = dist < 0.14 ? 0 : Math.min(0.85, 0.35 + dist * 0.28) * Math.max(0.25, Math.cos(errAngle * 0.6))
          s.v += (targetV - s.v) * Math.min(1, dt * 6)
          s.omega = Math.max(-2.2, Math.min(2.2, errAngle * 3.1))
          s.yaw += s.omega * dt
          while (s.yaw > Math.PI) s.yaw -= Math.PI * 2
          while (s.yaw < -Math.PI) s.yaw += Math.PI * 2

          const nx = s.x + s.v * Math.cos(s.yaw) * dt
          const ny = s.y + s.v * Math.sin(s.yaw) * dt
          const clamped = clampWaypoint(nx, ny)
          s.x = clamped.x
          s.y = clamped.y

          // 2D EKF covariance propagation (process noise from wheel slip) + LiDAR range-scan information update
          let varX = s.ekfA * s.ekfA + (0.012 + 0.045 * Math.abs(s.v)) * dt
          let varY = s.ekfB * s.ekfB + (0.010 + 0.032 * Math.abs(s.omega)) * dt
          const measInfo = (lidarHits / 36) * 1.45 * dt
          const kx = varX / (varX + 0.08)
          const ky = varY / (varY + 0.06)
          varX = Math.max(0.0012, Math.min(0.045, varX * (1 - kx * measInfo)))
          varY = Math.max(0.0009, Math.min(0.032, varY * (1 - ky * measInfo)))
          s.ekfA = Math.sqrt(varX)
          s.ekfB = Math.sqrt(varY)

          s.frameTick += 1
          if (s.frameTick % 4 === 0) {
            const prev = s.trail[s.trail.length - 1]
            if (!prev || Math.hypot(s.x - prev.x, s.y - prev.y) > 0.08) {
              s.trail.push({ x: s.x, y: s.y })
              if (s.trail.length > 140) s.trail.shift()
            }
            for (let i = 0; i < 36; i += 3) {
              const ang = s.yaw + (i / 36) * Math.PI * 2
              const r = rayIntersect(s.x, s.y, Math.cos(ang), Math.sin(ang), 4.5)
              if (r < 4.45) {
                s.cloud.push({ x: s.x + r * Math.cos(ang), y: s.y + r * Math.sin(ang) })
              }
            }
            if (s.cloud.length > 260) s.cloud.splice(0, s.cloud.length - 260)
          }

          if (s.frameTick % 6 === 1) {
            setSlamReadout({
              x: s.x,
              y: s.y,
              yawDeg: (s.yaw * 180) / Math.PI,
              v: s.v,
              omega: s.omega,
              ekfMm: Math.round(Math.hypot(s.ekfA, s.ekfB) * 1000),
              state: dist < 0.16 ? 'REACHED' : 'TRACKING',
            })
          }
        }

        // Draw metric grid
        ctx.strokeStyle = pal.grid
        ctx.lineWidth = 1
        for (let gx = 0; gx <= ARENA_W; gx += 1) {
          const p = toPx(gx, 0)
          ctx.beginPath()
          ctx.moveTo(p.x, oy)
          ctx.lineTo(p.x, oy + ARENA_H * scale)
          ctx.stroke()
        }
        for (let gy = 0; gy <= ARENA_H; gy += 1) {
          const p = toPx(0, gy)
          ctx.beginPath()
          ctx.moveTo(ox, p.y)
          ctx.lineTo(ox + ARENA_W * scale, p.y)
          ctx.stroke()
        }
        ctx.strokeStyle = pal.gridStrong
        ctx.strokeRect(ox, oy, ARENA_W * scale, ARENA_H * scale)

        // Obstacles
        for (const o of OBSTACLES) {
          const p = toPx(o.x, o.y)
          ctx.fillStyle = pal.wallFill
          ctx.strokeStyle = pal.wallStroke
          ctx.lineWidth = 1.5
          ctx.fillRect(p.x, p.y, o.w * scale, o.h * scale)
          ctx.strokeRect(p.x, p.y, o.w * scale, o.h * scale)
        }

        // Accumulated SLAM map hits
        ctx.fillStyle = pal.dark ? 'rgba(245, 183, 0, 0.35)' : 'rgba(196, 131, 0, 0.32)'
        for (const pt of s.cloud) {
          const px = toPx(pt.x, pt.y)
          ctx.fillRect(px.x - 1, px.y - 1, 2.2, 2.2)
        }

        // 36-ray LiDAR fan
        const roverPx = toPx(s.x, s.y)
        for (let i = 0; i < 36; i += 1) {
          const ang = s.yaw + (i / 36) * Math.PI * 2
          const r = rayIntersect(s.x, s.y, Math.cos(ang), Math.sin(ang), 4.6)
          const hx = s.x + r * Math.cos(ang)
          const hy = s.y + r * Math.sin(ang)
          const hitPx = toPx(hx, hy)

          ctx.strokeStyle = pal.dark ? 'rgba(245, 183, 0, 0.14)' : 'rgba(196, 131, 0, 0.18)'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(roverPx.x, roverPx.y)
          ctx.lineTo(hitPx.x, hitPx.y)
          ctx.stroke()

          if (r < 4.55) {
            ctx.fillStyle = pal.amber
            ctx.beginPath()
            ctx.arc(hitPx.x, hitPx.y, 2.4, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        // Breadcrumb trajectory
        if (s.trail.length > 1) {
          ctx.strokeStyle = pal.cyan
          ctx.lineWidth = 1.75
          ctx.beginPath()
          s.trail.forEach((pt, idx) => {
            const p = toPx(pt.x, pt.y)
            if (idx === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          })
          ctx.stroke()
        }

        // Planned path & waypoint crosshair
        const wpPx = toPx(s.wx, s.wy)
        ctx.save()
        ctx.setLineDash([5, 5])
        ctx.strokeStyle = pal.amber
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(roverPx.x, roverPx.y)
        for (let idx = s.pathIdx; idx < s.path.length; idx += 1) {
          const p = toPx(s.path[idx]!.x, s.path[idx]!.y)
          ctx.lineTo(p.x, p.y)
        }
        ctx.lineTo(wpPx.x, wpPx.y)
        ctx.stroke()
        ctx.restore()

        ctx.strokeStyle = pal.amber
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(wpPx.x, wpPx.y, 8, 0, Math.PI * 2)
        ctx.moveTo(wpPx.x - 13, wpPx.y)
        ctx.lineTo(wpPx.x + 13, wpPx.y)
        ctx.moveTo(wpPx.x, wpPx.y - 13)
        ctx.lineTo(wpPx.x, wpPx.y + 13)
        ctx.stroke()

        // EKF 2-sigma Covariance Ellipse
        ctx.save()
        ctx.translate(roverPx.x, roverPx.y)
        ctx.rotate(s.yaw)
        ctx.fillStyle = pal.cyanSoft
        ctx.strokeStyle = pal.cyan
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 3])
        ctx.beginPath()
        ctx.ellipse(0, 0, s.ekfA * scale * 2.2, s.ekfB * scale * 2.2, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.setLineDash([])

        // Rover chassis
        const rw = 0.36 * scale
        const rh = 0.26 * scale
        ctx.fillStyle = '#0f1e33'
        ctx.strokeStyle = pal.ink
        ctx.lineWidth = 1.8
        ctx.fillRect(-rw / 2, -rh / 2, rw, rh)
        ctx.strokeRect(-rw / 2, -rh / 2, rw, rh)
        ctx.fillStyle = pal.amber
        ctx.beginPath()
        ctx.arc(rw * 0.18, 0, Math.max(3.5, scale * 0.055), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Scale label in corner
        ctx.fillStyle = pal.muted
        ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText('1.0 m grid | 36-ray LiDAR | Nav2', ox + 8, oy + ARENA_H * scale - 8)
      } else if (mode === 'kinematics') {
        const a = armState.current
        const scale = Math.min(W / 2.25, H / 1.38)
        const basePx = { x: W * 0.5, y: H * 0.82 }
        const toPx = (mx: number, my: number): Vec2 => ({
          x: basePx.x + mx * scale,
          y: basePx.y - my * scale,
        })

        if (advancePhysics) {
          const solved = solveCcd(a.angles, a.targetX, a.targetY)
          const blend = Math.min(1, dt * 11)
          a.angles = [
            a.angles[0] + (solved[0] - a.angles[0]) * blend,
            a.angles[1] + (solved[1] - a.angles[1]) * blend,
            a.angles[2] + (solved[2] - a.angles[2]) * blend,
          ]
          const pts = fkPoints(a.angles)
          const end = pts[3]!
          a.frameTick += 1
          if (a.frameTick % 2 === 0) {
            const prev = a.trail[a.trail.length - 1]
            if (!prev || Math.hypot(end.x - prev.x, end.y - prev.y) > 0.015) {
              a.trail.push({ x: end.x, y: end.y })
              if (a.trail.length > 75) a.trail.shift()
            }
          }
          if (a.frameTick % 4 === 0) {
            setArmReadout({
              x: end.x,
              y: end.y,
              q1: (a.angles[0] * 180) / Math.PI,
              q2: (a.angles[1] * 180) / Math.PI,
              q3: (a.angles[2] * 180) / Math.PI,
              reach: Math.hypot(end.x, end.y),
              clamped: a.clamped,
            })
          }
        }

        // Cartesian grid every 0.25 m
        ctx.strokeStyle = pal.grid
        ctx.lineWidth = 1
        for (let gx = -1.0; gx <= 1.05; gx += 0.25) {
          const p = toPx(gx, 0)
          ctx.beginPath()
          ctx.moveTo(p.x, 0)
          ctx.lineTo(p.x, H)
          ctx.stroke()
        }
        for (let gy = -0.25; gy <= 1.25; gy += 0.25) {
          const p = toPx(0, gy)
          ctx.beginPath()
          ctx.moveTo(0, p.y)
          ctx.lineTo(W, p.y)
          ctx.stroke()
        }

        // Reach envelope circles
        ctx.save()
        ctx.setLineDash([6, 5])
        ctx.strokeStyle = pal.gridStrong
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(basePx.x, basePx.y, ARM_MAX * scale, Math.PI, 0, false)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(basePx.x, basePx.y, ARM_MIN * scale, Math.PI, 0, false)
        ctx.stroke()
        ctx.restore()

        const pts = fkPoints(a.angles).map((p) => toPx(p.x, p.y))

        // Breadcrumb trail
        if (a.trail.length > 1) {
          ctx.strokeStyle = pal.amberSoft
          ctx.lineWidth = 2
          ctx.beginPath()
          a.trail.forEach((p, idx) => {
            const px = toPx(p.x, p.y)
            if (idx === 0) ctx.moveTo(px.x, px.y)
            else ctx.lineTo(px.x, px.y)
          })
          ctx.stroke()
        }

        // Joint angle arcs (q1, q2, q3)
        const absAngles = [
          a.angles[0],
          a.angles[0] + a.angles[1],
          a.angles[0] + a.angles[1] + a.angles[2],
        ]
        const refAngles = [0, a.angles[0], a.angles[0] + a.angles[1]]
        for (let j = 0; j < 3; j += 1) {
          const jp = pts[j]!
          const rArc = Math.max(16, 26 - j * 4)
          const startC = -refAngles[j]!
          const endC = -absAngles[j]!
          ctx.fillStyle = pal.amberSoft
          ctx.strokeStyle = pal.amber
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(jp.x, jp.y)
          ctx.arc(jp.x, jp.y, rArc, startC, endC, a.angles[j]! > 0)
          ctx.closePath()
          ctx.fill()
          ctx.beginPath()
          ctx.arc(jp.x, jp.y, rArc, startC, endC, a.angles[j]! > 0)
          ctx.stroke()
        }

        // Base plinth
        ctx.fillStyle = pal.wallFill
        ctx.strokeStyle = pal.wallStroke
        ctx.lineWidth = 2
        ctx.fillRect(basePx.x - 26, basePx.y - 6, 52, 18)
        ctx.strokeRect(basePx.x - 26, basePx.y - 6, 52, 18)

        // Links
        const widths = [11, 8, 6] as const
        for (let i = 0; i < 3; i += 1) {
          const pA = pts[i]!
          const pB = pts[i + 1]!
          ctx.strokeStyle = pal.linkStroke
          ctx.lineCap = 'round'
          ctx.lineWidth = widths[i]!
          ctx.beginPath()
          ctx.moveTo(pA.x, pA.y)
          ctx.lineTo(pB.x, pB.y)
          ctx.stroke()
        }

        // Joints
        for (let i = 0; i < 3; i += 1) {
          const jp = pts[i]!
          ctx.fillStyle = '#0f1e33'
          ctx.strokeStyle = pal.amber
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(jp.x, jp.y, 6, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        }

        // End effector & target crosshair
        const eff = pts[3]!
        ctx.fillStyle = pal.amber
        ctx.beginPath()
        ctx.arc(eff.x, eff.y, 5, 0, Math.PI * 2)
        ctx.fill()

        const tgtPx = toPx(a.targetX, a.targetY)
        ctx.strokeStyle = pal.cyan
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.arc(tgtPx.x, tgtPx.y, 7, 0, Math.PI * 2)
        ctx.moveTo(tgtPx.x - 11, tgtPx.y)
        ctx.lineTo(tgtPx.x + 11, tgtPx.y)
        ctx.moveTo(tgtPx.x, tgtPx.y - 11)
        ctx.lineTo(tgtPx.x, tgtPx.y + 11)
        ctx.stroke()

        ctx.fillStyle = pal.muted
        ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.fillText(W < 340 ? 'Rmax = 0.96 m (3-DOF)' : 'Rmax = 0.96 m | L1 0.42 / L2 0.34 / L3 0.20 m', 14, H - 12)
      } else {
        // PID Step-Response Oscilloscope (auto-scaled vertical axis)
        const padL = 48
        const padR = 18
        const padT = 20
        const padB = 34
        const plotW = W - padL - padR
        const plotH = H - padT - padB
        const maxT = 4.0
        const samples = pidMetrics.samples
        const minSample = Math.min(0, ...samples.map((s) => s.y))
        const maxSample = Math.max(1.5, ...samples.map((s) => s.y))
        const minY = minSample < -0.1 ? Math.floor(minSample * 4) / 4 : -0.05
        const maxY = maxSample > 1.55 ? Math.ceil(maxSample * 4) / 4 : 1.55
        const spanY = maxY - minY

        const toPx = (t: number, yVal: number): Vec2 => ({
          x: padL + (t / maxT) * plotW,
          y: padT + plotH - ((yVal - minY) / spanY) * plotH,
        })

        // Graticule
        ctx.strokeStyle = pal.grid
        ctx.lineWidth = 1
        for (let t = 0; t <= maxT; t += 0.5) {
          const p = toPx(t, minY)
          ctx.beginPath()
          ctx.moveTo(p.x, padT)
          ctx.lineTo(p.x, padT + plotH)
          ctx.stroke()
        }
        const tickStep = spanY > 3.2 ? 1.0 : spanY > 2.0 ? 0.5 : 0.25
        const firstTick = Math.ceil(minY / tickStep) * tickStep
        for (let yTick = firstTick; yTick <= maxY + 1e-6; yTick += tickStep) {
          const p = toPx(0, yTick)
          ctx.beginPath()
          ctx.moveTo(padL, p.y)
          ctx.lineTo(padL + plotW, p.y)
          ctx.stroke()
        }

        // +/- 2% settling band
        const bandTop = toPx(0, 1.02).y
        const bandBot = toPx(0, 0.98).y
        ctx.fillStyle = pal.cyanSoft
        ctx.fillRect(padL, bandTop, plotW, bandBot - bandTop)

        // Setpoint dashed line r = 1.0
        const spY = toPx(0, 1.0).y
        ctx.save()
        ctx.setLineDash([6, 4])
        ctx.strokeStyle = pal.cyan
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(padL, spY)
        ctx.lineTo(padL + plotW, spY)
        ctx.stroke()
        ctx.restore()

        // Response curve y(t)
        ctx.strokeStyle = pal.amber
        ctx.lineWidth = 2.6
        ctx.beginPath()
        samples.forEach((pt, idx) => {
          const p = toPx(pt.t, pt.y)
          if (idx === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        })
        ctx.stroke()

        // Animated scope sweep cursor
        if (advancePhysics) {
          pidCursor.current.t = (pidCursor.current.t + dt * 1.15) % maxT
        }
        const curT = pidCursor.current.t
        const nearest = samples.reduce((best, s) =>
          Math.abs(s.t - curT) < Math.abs(best.t - curT) ? s : best,
        )
        const curPx = toPx(nearest.t, nearest.y)
        ctx.strokeStyle = pal.gridStrong
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(curPx.x, padT)
        ctx.lineTo(curPx.x, padT + plotH)
        ctx.stroke()
        ctx.fillStyle = pal.amber
        ctx.beginPath()
        ctx.arc(curPx.x, curPx.y, 4.5, 0, Math.PI * 2)
        ctx.fill()

        // Axes labels
        ctx.fillStyle = pal.muted
        ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace'
        for (let t = 0; t <= maxT; t += 1.0) {
          const p = toPx(t, minY)
          ctx.textAlign = t === maxT ? 'right' : t === 0 ? 'left' : 'center'
          ctx.fillText(`${Math.round(t * 1000)}ms`, p.x, padT + plotH + 18)
        }
        ctx.textAlign = 'left'
        ctx.fillText('1.0', 8, spY + 4)
        ctx.fillText(minY.toFixed(1), 8, toPx(0, minY).y - 2)
        ctx.fillText(maxY.toFixed(1), 8, padT + 10)
        ctx.fillText('Setpoint r=1.0 | +/-2% band', padL + 8, padT + 14)
      }

      ctx.restore()
    },
    [mode, pidMetrics],
  )

  useEffect(() => {
    drawFrame(false, 0)
  }, [drawFrame, themeKey, mode, pidMetrics])

  useEffect(() => {
    if (paused || reducedMotion || !inView) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!document.hidden) {
        drawFrame(true, dt)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [paused, reducedMotion, inView, drawFrame])

  function applySlamWaypoint(targetX: number, targetY: number) {
    const wp = clampWaypoint(targetX, targetY)
    const s = slamState.current
    s.wx = wp.x
    s.wy = wp.y
    s.path = planArenaPath(s.x, s.y, wp.x, wp.y)
    s.pathIdx = 0
    setSlamTarget({ x: Number(wp.x.toFixed(1)), y: Number(wp.y.toFixed(1)) })
    drawFrame(true, 0.05)
    setSlamReadout({
      x: s.x,
      y: s.y,
      yawDeg: (s.yaw * 180) / Math.PI,
      v: s.v,
      omega: s.omega,
      ekfMm: Math.round(Math.hypot(s.ekfA, s.ekfB) * 1000),
      state: Math.hypot(wp.x - s.x, wp.y - s.y) < 0.16 ? 'REACHED' : 'TRACKING',
    })
  }

  function handleCanvasClick(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const px = event.clientX - rect.left
    const py = event.clientY - rect.top
    const W = rect.width
    const H = rect.height

    if (mode === 'slam') {
      const pad = 18
      const scale = Math.min((W - pad * 2) / ARENA_W, (H - pad * 2) / ARENA_H)
      const ox = (W - ARENA_W * scale) / 2
      const oy = (H - ARENA_H * scale) / 2
      const mx = (px - ox) / scale
      const my = (py - oy) / scale
      applySlamWaypoint(mx, my)
    } else if (mode === 'kinematics') {
      updateArmTarget(px, py, W, H)
    }
  }

  function applyArmCoordinates(targetX: number, targetY: number) {
    let mx = targetX
    let my = targetY < -0.05 ? -0.05 : targetY
    const r = Math.hypot(mx, my)
    let clamped = false
    if (r > ARM_MAX) {
      mx = (mx / r) * ARM_MAX
      my = (my / r) * ARM_MAX
      clamped = true
    } else if (r < ARM_MIN && r > 1e-4) {
      mx = (mx / r) * ARM_MIN
      my = (my / r) * ARM_MIN
      clamped = true
    }
    armState.current.targetX = mx
    armState.current.targetY = my
    armState.current.clamped = clamped
    setArmTarget({ x: Number(mx.toFixed(2)), y: Number(my.toFixed(2)) })
    if (reducedMotion || paused) {
      armState.current.angles = solveCcd(armState.current.angles, mx, my)
      const pts = fkPoints(armState.current.angles)
      const end = pts[3]!
      setArmReadout({
        x: end.x,
        y: end.y,
        q1: (armState.current.angles[0] * 180) / Math.PI,
        q2: (armState.current.angles[1] * 180) / Math.PI,
        q3: (armState.current.angles[2] * 180) / Math.PI,
        reach: Math.hypot(end.x, end.y),
        clamped,
      })
    }
    drawFrame(false, 0)
  }

  function updateArmTarget(px: number, py: number, W: number, H: number) {
    const scale = Math.min(W / 2.25, H / 1.38)
    const basePx = { x: W * 0.5, y: H * 0.82 }
    const mx = (px - basePx.x) / scale
    const my = (basePx.y - py) / scale
    applyArmCoordinates(mx, my)
  }

  function handleCanvasMove(event: PointerEvent<HTMLCanvasElement>) {
    if (mode !== 'kinematics') return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    updateArmTarget(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height)
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % MODES.length
        : event.key === 'ArrowLeft'
          ? (index + MODES.length - 1) % MODES.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? MODES.length - 1
              : null
    if (next === null) return
    event.preventDefault()
    setMode(MODES[next]!.id)
    tabRefs.current[next]?.focus()
  }

  const activeMeta = MODES.find((m) => m.id === mode) ?? MODES[0]!

  return (
    <div ref={containerRef} className="eng-lab" data-lab-mode={mode}>
      <div className="eng-lab-header">
        <div className="robotics-tabs" role="tablist" aria-label="Interactive engineering modes">
          {MODES.map((item, idx) => (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[idx] = node
              }}
              id={`lab-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              aria-controls="eng-lab-panel"
              tabIndex={mode === item.id ? 0 : -1}
              onClick={() => setMode(item.id)}
              onKeyDown={(e) => onTabKey(e, idx)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="eng-lab-pause"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>

      <div
        id="eng-lab-panel"
        role="tabpanel"
        aria-labelledby={`lab-tab-${mode}`}
        className="eng-lab-viewport"
      >
        <div className="eng-lab-canvas-wrap">
          <canvas
            ref={canvasRef}
            className="eng-lab-canvas"
            aria-label={activeMeta.title}
            onPointerDown={handleCanvasClick}
            onPointerMove={handleCanvasMove}
          />
        </div>

        {mode === 'slam' && (
          <div className="eng-lab-controls" aria-label="Target waypoint controls">
            <div className="pid-sliders">
              <label>
                <span>Waypoint X: <strong>{slamTarget.x.toFixed(1)} m</strong></span>
                <input
                  type="range"
                  min={0.6}
                  max={9.4}
                  step={0.1}
                  value={slamTarget.x}
                  onChange={(e) => applySlamWaypoint(Number(e.target.value), slamTarget.y)}
                />
              </label>
              <label>
                <span>Waypoint Y: <strong>{slamTarget.y.toFixed(1)} m</strong></span>
                <input
                  type="range"
                  min={0.6}
                  max={5.4}
                  step={0.1}
                  value={slamTarget.y}
                  onChange={(e) => applySlamWaypoint(slamTarget.x, Number(e.target.value))}
                />
              </label>
            </div>
            <div className="eng-lab-presets">
              {SLAM_WAYPOINTS.map((wp) => (
                <button
                  key={wp.label}
                  type="button"
                  className="preset-btn"
                  onClick={() => applySlamWaypoint(wp.x, wp.y)}
                >
                  {wp.label} ({wp.x.toFixed(1)} m, {wp.y.toFixed(1)} m)
                </button>
              ))}
            </div>
            <dl className="eng-telemetry" data-testid="slam-telemetry">
              <div>
                <dt>Pose (x, y)</dt>
                <dd>{slamReadout.x.toFixed(2)} m, {slamReadout.y.toFixed(2)} m</dd>
              </div>
              <div>
                <dt>Heading / Rate</dt>
                <dd>{slamReadout.yawDeg.toFixed(1)} deg | {slamReadout.v.toFixed(2)} m/s</dd>
              </div>
              <div>
                <dt>LiDAR / EKF 2s</dt>
                <dd>36 rays | {slamReadout.ekfMm} mm</dd>
              </div>
              <div>
                <dt>Goal state</dt>
                <dd>{slamReadout.state}</dd>
              </div>
            </dl>
          </div>
        )}

        {mode === 'kinematics' && (
          <div className="eng-lab-controls" aria-label="3-DOF arm controls">
            <div className="pid-sliders">
              <label>
                <span>Target X: <strong>{armTarget.x.toFixed(2)} m</strong></span>
                <input
                  type="range"
                  min={-0.96}
                  max={0.96}
                  step={0.02}
                  value={armTarget.x}
                  onChange={(e) => applyArmCoordinates(Number(e.target.value), armTarget.y)}
                />
              </label>
              <label>
                <span>Target Y: <strong>{armTarget.y.toFixed(2)} m</strong></span>
                <input
                  type="range"
                  min={-0.05}
                  max={0.96}
                  step={0.02}
                  value={armTarget.y}
                  onChange={(e) => applyArmCoordinates(armTarget.x, Number(e.target.value))}
                />
              </label>
            </div>
            <div className="eng-lab-presets">
              {ARM_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="preset-btn"
                  onClick={() => applyArmCoordinates(p.x, p.y)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <dl className="eng-telemetry" data-testid="kinematics-telemetry">
              <div>
                <dt>Tip (x, y)</dt>
                <dd>{armReadout.x.toFixed(2)} m, {armReadout.y.toFixed(2)} m</dd>
              </div>
              <div>
                <dt>Joint angles</dt>
                <dd>q1 {armReadout.q1.toFixed(1)} | q2 {armReadout.q2.toFixed(1)} | q3 {armReadout.q3.toFixed(1)} deg</dd>
              </div>
              <div>
                <dt>Reach</dt>
                <dd>{armReadout.reach.toFixed(2)} / {ARM_MAX.toFixed(2)} m</dd>
              </div>
              <div>
                <dt>Envelope</dt>
                <dd>{armReadout.clamped ? 'CLAMPED' : 'IN REACH'}</dd>
              </div>
            </dl>
          </div>
        )}

        {mode === 'pid' && (
          <div className="eng-lab-controls" aria-label="PID controller gains">
            <div className="pid-sliders">
              <label>
                <span>Kp: <strong>{kp.toFixed(1)}</strong></span>
                <input
                  type="range"
                  aria-label="Proportional gain Kp"
                  min={0.5}
                  max={20.0}
                  step={0.5}
                  value={kp}
                  onChange={(e) => setKp(Number(e.target.value))}
                />
              </label>
              <label>
                <span>Ki: <strong>{ki.toFixed(1)}</strong></span>
                <input
                  type="range"
                  aria-label="Integral gain Ki"
                  min={0.0}
                  max={12.0}
                  step={0.2}
                  value={ki}
                  onChange={(e) => setKi(Number(e.target.value))}
                />
              </label>
              <label>
                <span>Kd: <strong>{kd.toFixed(1)}</strong></span>
                <input
                  type="range"
                  aria-label="Derivative gain Kd"
                  min={0.0}
                  max={8.0}
                  step={0.1}
                  value={kd}
                  onChange={(e) => setKd(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="eng-lab-presets">
              <button type="button" className="preset-btn" onClick={() => { setKp(15.0); setKi(7.0); setKd(0.8) }}>Underdamped</button>
              <button type="button" className="preset-btn" onClick={() => { setKp(9.0); setKi(3.0); setKd(2.4) }}>Balanced</button>
              <button type="button" className="preset-btn" onClick={() => { setKp(4.0); setKi(0.8); setKd(4.4) }}>Overdamped</button>
            </div>
            <dl className="eng-telemetry" data-testid="pid-telemetry">
              <div>
                <dt>Overshoot</dt>
                <dd data-testid="pid-overshoot">{pidMetrics.overshootPct.toFixed(1)}%</dd>
              </div>
              <div>
                <dt>Settling (2%)</dt>
                <dd data-testid="pid-settling">{pidMetrics.settled ? `${pidMetrics.settlingMs} ms` : '> 4000 ms'}</dd>
              </div>
              <div>
                <dt>Error at 4.0 s</dt>
                <dd data-testid="pid-error">{pidMetrics.steadyErrorPct.toFixed(2)}%</dd>
              </div>
              <div>
                <dt>Damping regime</dt>
                <dd data-testid="pid-regime">{pidMetrics.regime}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="eng-lab-caption">
        <strong>{activeMeta.title}</strong>
        <p>{activeMeta.detail}</p>
      </div>

      <div className="eng-lab-reel">
        <LoopingVideo video={videoLibrary.heroLaunch} priority compact />
      </div>
    </div>
  )
}
