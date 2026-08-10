/**
 * Occupancy-grid mapping from a simulated LiDAR, fully seeded.
 *
 * A robot follows a fixed waypoint route through a fixed floorplan. Rays are
 * cast from the TRUE pose against the true wall geometry with seeded range
 * noise, but the map is written from the ODOMETRY pose, which accumulates
 * seeded drift. The map therefore smears exactly the way a dead-reckoned
 * map smears, and the drift slider makes the mechanism visible.
 *
 * Log-odds update per ray: cells along the beam get the free decrement, the
 * endpoint cell gets the occupied increment, both clamped, which is the
 * standard inverse sensor model in its scalar form.
 */

import { mulberry32, gaussian } from './rand'

export const OCC_W = 64
export const OCC_H = 40
const MAX_RANGE = 22
const L_OCC = 0.85
const L_FREE = -0.4
const L_CLAMP = 4

export interface OccupancyParams {
  /** Number of scans taken along the route. */
  readonly scans: number
  /** Beams per scan. */
  readonly beams: number
  /** Range noise sigma in cells. */
  readonly rangeNoise: number
  /** Per-step heading drift in radians applied to the odometry pose. */
  readonly drift: number
}

export interface Pose {
  readonly x: number
  readonly y: number
  readonly th: number
}

export interface OccupancyResult {
  /** Log-odds grid at the final scan. */
  readonly logOdds: readonly number[]
  readonly truePath: readonly Pose[]
  readonly odomPath: readonly Pose[]
  /** Per-scan grids are not stored; stateAt() recomputes to a scan index. */
  readonly scansApplied: number
  readonly cellsObserved: number
  readonly occupiedCells: number
  /** Final separation of true and odometry poses, in cells. */
  readonly finalDrift: number
}

/** Axis-aligned wall rectangles: outer shell, two rooms and a doorway gap. */
const WALLS: readonly (readonly [number, number, number, number])[] = [
  [0, 0, 64, 1], [0, 39, 64, 1], [0, 0, 1, 40], [63, 0, 1, 40],
  [20, 0, 1, 16], [20, 22, 1, 18],
  [40, 12, 24, 1],
  [40, 12, 1, 10], [40, 28, 1, 12],
  [8, 26, 6, 1], [30, 4, 1, 8],
]

function isWall(x: number, y: number): boolean {
  for (const [wx, wy, ww, wh] of WALLS) {
    if (x >= wx && x < wx + ww && y >= wy && y < wy + wh) return true
  }
  return false
}

/** Fixed route through the free space, interpolated per scan. */
const ROUTE: readonly (readonly [number, number])[] = [
  [6, 8], [14, 8], [14, 32], [28, 32], [28, 18], [34, 18], [34, 32],
  [52, 32], [52, 20], [46, 20], [46, 6], [26, 6],
]

function poseAt(t: number): Pose {
  // t in [0, 1] along the whole route, heading along the segment.
  const segs = ROUTE.length - 1
  const s = Math.min(t * segs, segs - 1e-9)
  const i = Math.floor(s)
  const f = s - i
  const [ax, ay] = ROUTE[i]!
  const [bx, by] = ROUTE[i + 1]!
  return { x: ax + (bx - ax) * f, y: ay + (by - ay) * f, th: Math.atan2(by - ay, bx - ax) }
}

/** March a ray in small steps until it hits a wall or runs out of range. */
function castRay(x: number, y: number, th: number): number {
  const step = 0.25
  for (let d = step; d <= MAX_RANGE; d += step) {
    const cx = Math.floor(x + d * Math.cos(th))
    const cy = Math.floor(y + d * Math.sin(th))
    if (cx < 0 || cx >= OCC_W || cy < 0 || cy >= OCC_H) return d
    if (isWall(cx, cy)) return d
  }
  return MAX_RANGE
}

export function runOccupancy(p: OccupancyParams, uptoScan?: number): OccupancyResult {
  const rand = gaussian(mulberry32(7))
  const logOdds = new Array<number>(OCC_W * OCC_H).fill(0)
  const truePath: Pose[] = []
  const odomPath: Pose[] = []
  const limit = uptoScan === undefined ? p.scans : Math.min(uptoScan, p.scans)

  let headingBias = 0
  for (let s = 0; s < p.scans; s++) {
    const truePose = poseAt(p.scans === 1 ? 0 : s / (p.scans - 1))
    // Odometry drift: heading bias integrates a constant plus seeded noise,
    // and the position error integrates the heading error along the path.
    headingBias += p.drift * (1 + 0.3 * rand())
    const prev = odomPath[odomPath.length - 1]
    const prevTrue = truePath[truePath.length - 1]
    let odom: Pose
    if (!prev || !prevTrue) {
      odom = truePose
    } else {
      const dx = truePose.x - prevTrue.x
      const dy = truePose.y - prevTrue.y
      const c = Math.cos(headingBias)
      const sn = Math.sin(headingBias)
      odom = {
        x: prev.x + dx * c - dy * sn,
        y: prev.y + dx * sn + dy * c,
        th: truePose.th + headingBias,
      }
    }
    truePath.push(truePose)
    odomPath.push(odom)

    if (s >= limit) continue

    for (let b = 0; b < p.beams; b++) {
      const angTrue = truePose.th + (b / p.beams) * 2 * Math.PI
      const angOdom = odom.th + (b / p.beams) * 2 * Math.PI
      const trueRange = castRay(truePose.x, truePose.y, angTrue)
      const measured = Math.max(0.5, trueRange + p.rangeNoise * rand())
      const hit = trueRange < MAX_RANGE - 0.5

      // Write the beam into the map from the odometry pose.
      const step = 0.5
      for (let d = step; d < measured - 0.5; d += step) {
        const cx = Math.floor(odom.x + d * Math.cos(angOdom))
        const cy = Math.floor(odom.y + d * Math.sin(angOdom))
        if (cx < 0 || cx >= OCC_W || cy < 0 || cy >= OCC_H) break
        const i = cy * OCC_W + cx
        logOdds[i] = Math.max(-L_CLAMP, (logOdds[i] ?? 0) + L_FREE)
      }
      if (hit) {
        const cx = Math.floor(odom.x + measured * Math.cos(angOdom))
        const cy = Math.floor(odom.y + measured * Math.sin(angOdom))
        if (cx >= 0 && cx < OCC_W && cy >= 0 && cy < OCC_H) {
          const i = cy * OCC_W + cx
          logOdds[i] = Math.min(L_CLAMP, (logOdds[i] ?? 0) + L_OCC)
        }
      }
    }
  }

  const cellsObserved = logOdds.filter((v) => v !== 0).length
  const occupiedCells = logOdds.filter((v) => v > 0.6).length
  const lastTrue = truePath[Math.max(0, limit - 1)]
  const lastOdom = odomPath[Math.max(0, limit - 1)]
  const finalDrift =
    lastTrue && lastOdom ? Math.hypot(lastTrue.x - lastOdom.x, lastTrue.y - lastOdom.y) : 0

  return {
    logOdds,
    truePath: truePath.slice(0, limit),
    odomPath: odomPath.slice(0, limit),
    scansApplied: limit,
    cellsObserved,
    occupiedCells,
    finalDrift: Number(finalDrift.toFixed(2)),
  }
}

export const OCC_PRESETS = [
  { id: 'clean', label: 'Clean odometry', values: { scans: 40, beams: 72, rangeNoise: 0.1, drift: 0 } },
  { id: 'field', label: 'Field conditions', values: { scans: 40, beams: 72, rangeNoise: 0.3, drift: 0.004 } },
  { id: 'drift', label: 'Heavy drift', values: { scans: 40, beams: 72, rangeNoise: 0.2, drift: 0.012 } },
] as const

/** The default the lab opens on: field conditions with visible drift. */
export const OCC_DEFAULTS: OccupancyParams = OCC_PRESETS[1].values
