import type { CSSProperties, ReactNode } from 'react'
import { GRID_W, GRID_H, type AstarParams, type AstarResult } from '@/lib/labs/astar'
import { PID_DT, U_MAX, type PidResult } from '@/lib/labs/pid'
import type { KalmanParams, KalmanResult } from '@/lib/labs/kalman'
import { OCC_W, OCC_H, type OccupancyResult } from '@/lib/labs/occupancy'
import s from './lab.module.css'

/**
 * Pure figure renderers, shared verbatim by the server and the client.
 *
 * The server renders each figure from the same engine that drives the
 * interactive module, so the no-JavaScript page shows the computation's real
 * final state rather than a picture of it. Every figure keeps to the site
 * palette: ink, the two tints and the single accent.
 */

export interface Readout {
  readonly label: string
  readonly value: string
}

export function ReadoutTable({ rows, caption }: { rows: readonly Readout[]; caption: string }) {
  return (
    <table className={s.readouts}>
      <caption className="visually-hidden">{caption}</caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <th scope="row">{r.label}</th>
            <td>{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ---------------- A* ---------------- */

export type AstarCellState =
  | 'free' | 'blocked' | 'inflated' | 'closed' | 'path' | 'start' | 'goal'

export function astarCellStates(
  params: AstarParams,
  result: AstarResult,
  frame: number | null,
): AstarCellState[] {
  const upto = frame === null ? result.expanded.length : frame
  const painted = new Set(params.obstacles)
  const closed = new Set(result.expanded.slice(0, upto))
  const done = upto >= result.expanded.length
  const path = new Set(done ? result.path : [])
  const states: AstarCellState[] = []
  for (let i = 0; i < GRID_W * GRID_H; i++) {
    if (i === params.start) states.push('start')
    else if (i === params.goal) states.push('goal')
    else if (painted.has(i)) states.push('blocked')
    else if (result.blocked.has(i)) states.push('inflated')
    else if (path.has(i)) states.push('path')
    else if (closed.has(i)) states.push('closed')
    else states.push('free')
  }
  return states
}

const CELL_LABEL: Record<AstarCellState, string> = {
  free: 'free',
  blocked: 'obstacle',
  inflated: 'inflated clearance',
  closed: 'expanded',
  path: 'on the committed path',
  start: 'start',
  goal: 'goal',
}

/**
 * The grid itself. Statically it is a labelled image of the final search
 * state; interactively the client upgrades it to a roving-tabindex ARIA grid
 * by supplying cellProps and rowProps.
 */
export function AstarGrid({
  states,
  gridProps,
  cellProps,
  describedBy,
}: {
  states: readonly AstarCellState[]
  gridProps?: Record<string, unknown>
  cellProps?: (i: number) => Record<string, unknown>
  describedBy?: string
}) {
  const interactive = cellProps !== undefined
  return (
    <div
      className={s.astarGrid}
      style={{ '--grid-w': GRID_W } as CSSProperties}
      {...(interactive
        ? { role: 'grid', 'aria-describedby': describedBy }
        : { role: 'img', 'aria-label': 'The final A* search state over the occupancy grid.' })}
      {...gridProps}
    >
      {Array.from({ length: GRID_H }, (_, y) => (
        <div key={y} className={s.astarRow} {...(interactive ? { role: 'row' } : {})}>
          {Array.from({ length: GRID_W }, (_, x) => {
            const i = y * GRID_W + x
            const st = states[i] ?? 'free'
            return (
              <div
                key={x}
                className={s.astarCell}
                data-state={st}
                {...(interactive
                  ? {
                      role: 'gridcell',
                      'aria-label': `Row ${y + 1}, column ${x + 1}: ${CELL_LABEL[st]}`,
                      ...cellProps(i),
                    }
                  : {})}
              >
                {st === 'start' ? 'S' : st === 'goal' ? 'G' : ''}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/**
 * The server-rendered A* figure: the same final state as the interactive
 * grid, drawn as one compact SVG. Cell runs are merged per row so the
 * static HTML stays small; the interactive module replaces this with the
 * operable ARIA grid on load.
 */
export function AstarStaticFigure({
  params,
  result,
}: {
  params: AstarParams
  result: AstarResult
}) {
  const C = 20
  const W = GRID_W * C
  const H = GRID_H * C
  const states = astarCellStates(params, result, null)
  const paths: Partial<Record<AstarCellState, string>> = {}
  for (let y = 0; y < GRID_H; y++) {
    let x = 0
    while (x < GRID_W) {
      const st = states[y * GRID_W + x] ?? 'free'
      let run = 1
      while (x + run < GRID_W && states[y * GRID_W + x + run] === st) run++
      if (st !== 'free') {
        paths[st] = (paths[st] ?? '') + `M${x * C} ${y * C}h${run * C}v${C}h${-run * C}z`
      }
      x += run
    }
  }
  const sx = params.start % GRID_W
  const sy = Math.floor(params.start / GRID_W)
  const gx = params.goal % GRID_W
  const gy = Math.floor(params.goal / GRID_W)
  return (
    <Plot w={W} h={H} label="The final A* search state over the occupancy grid.">
      <path d={paths.inflated ?? ''} className={s.svgInflated} />
      <path d={paths.closed ?? ''} className={s.svgClosed} />
      <path d={paths.path ?? ''} className={s.svgPath} />
      <path d={paths.blocked ?? ''} className={s.svgBlocked} />
      <rect x={sx * C + 1} y={sy * C + 1} width={C - 2} height={C - 2} className={s.plotMark} />
      <rect x={gx * C + 1} y={gy * C + 1} width={C - 2} height={C - 2} className={s.plotMark} />
      <text x={sx * C + C / 2} y={sy * C + C / 2 + 4} textAnchor="middle" className={s.svgCellText}>
        S
      </text>
      <text x={gx * C + C / 2} y={gy * C + C / 2 + 4} textAnchor="middle" className={s.svgCellText}>
        G
      </text>
    </Plot>
  )
}

export function astarReadouts(result: AstarResult, timeMs: number | null): Readout[] {
  return [
    { label: 'Nodes expanded', value: String(result.nodesExpanded) },
    { label: 'Path cost', value: result.found ? String(result.pathCost) : 'no path' },
    { label: 'Path length', value: result.found ? `${result.pathLength} cells` : 'no path' },
    { label: 'Planning time', value: timeMs === null ? 'measured on run' : `${timeMs.toFixed(2)} ms` },
    { label: 'Heuristic admissible', value: result.admissible ? 'yes' : 'no' },
  ]
}

/* ---------------- Shared SVG plot scaffolding ---------------- */

function Plot({
  w, h, children, label,
}: { w: number; h: number; children: ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={s.plot} role="img" aria-label={label}>
      <rect x="0" y="0" width={w} height={h} className={s.plotBg} />
      {children}
    </svg>
  )
}

function polyline(values: readonly number[], toX: (i: number) => number, toY: (v: number) => number): string {
  return values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
}

/* ---------------- PID ---------------- */

export function PidFigure({ result }: { result: PidResult }) {
  const W = 640
  const H = 300
  const yMin = -0.1
  const yMax = 2
  const toX = (i: number) => (i / (result.y.length - 1)) * (W - 16) + 8
  const toY = (v: number) => H - 24 - ((v - yMin) / (yMax - yMin)) * (H - 40)
  const toYu = (v: number) => H - 24 - ((v / U_MAX + 1) / 2) * (H - 40) * 0.35
  return (
    <Plot w={W} h={H} label="Closed-loop step response of the fixed second-order plant.">
      {/* Setpoint and the two-percent settling band. */}
      <rect x="8" y={toY(1.02)} width={W - 16} height={toY(0.98) - toY(1.02)} className={s.plotBand} />
      <line x1="8" x2={W - 8} y1={toY(1)} y2={toY(1)} className={s.plotRule} />
      <line x1="8" x2={W - 8} y1={toY(0)} y2={toY(0)} className={s.plotAxis} />
      <polyline points={polyline(result.u, toX, toYu)} className={s.plotFaint} />
      <polyline points={polyline(result.y, toX, toY)} className={s.plotMain} />
      <text x={W - 10} y={toY(1) - 6} textAnchor="end" className={s.plotText}>
        setpoint
      </text>
      <text x={W - 10} y={toYu(result.u[result.u.length - 1] ?? 0) - 6} textAnchor="end" className={s.plotText}>
        actuator
      </text>
    </Plot>
  )
}

export function pidReadouts(result: PidResult): Readout[] {
  return [
    { label: 'Overshoot', value: `${result.overshoot}%` },
    { label: 'Rise time, 10 to 90%', value: result.riseTime === null ? 'not reached' : `${result.riseTime} s` },
    {
      label: 'Settling time, 2% band',
      value: result.settlingTime === null ? `not settled in ${Math.round(result.y.length * PID_DT)} s` : `${result.settlingTime} s`,
    },
    { label: 'Steady-state error', value: String(result.steadyStateError) },
  ]
}

/* ---------------- Kalman ---------------- */

export function KalmanFigure({ params, result }: { params: KalmanParams; result: KalmanResult }) {
  const W = 640
  const H = 300
  const yMin = -8
  const yMax = 8
  const n = result.truth.length
  const toX = (i: number) => (i / (n - 1)) * (W - 16) + 8
  const toY = (v: number) => H - 20 - ((v - yMin) / (yMax - yMin)) * (H - 40)
  const band =
    result.estimate.map((v, i) => `${toX(i).toFixed(1)},${toY(v + 2 * (result.sigma[i] ?? 0)).toFixed(1)}`).join(' ') +
    ' ' +
    result.estimate.map((v, i) => `${toX(i).toFixed(1)},${toY(v - 2 * (result.sigma[i] ?? 0)).toFixed(1)}`).reverse().join(' ')
  return (
    <Plot
      w={W}
      h={H}
      label={
        params.mode === 'kf'
          ? 'Truth, noisy measurements, the Kalman estimate and its two-sigma band.'
          : 'Truth, the EKF estimate through the nonlinear measurement, and its two-sigma band.'
      }
    >
      <line x1="8" x2={W - 8} y1={toY(0)} y2={toY(0)} className={s.plotAxis} />
      <polygon points={band} className={s.plotRegion} />
      <polyline points={polyline(result.truth, toX, toY)} className={s.plotThin} />
      {result.z.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r="1.6" className={s.plotDot} />
      ))}
      <polyline points={polyline(result.estimate, toX, toY)} className={s.plotMain} />
      {params.mode === 'ekf' && result.linPoint !== null ? (
        <circle cx={toX(n - 1)} cy={toY(result.linPoint)} r="4" className={s.plotMark} />
      ) : null}
    </Plot>
  )
}

export function kalmanReadouts(params: KalmanParams, result: KalmanResult): Readout[] {
  const rows: Readout[] = [
    { label: params.mode === 'kf' ? 'RMSE, raw measurements' : 'RMSE, raw in measurement space', value: String(result.rmseRaw) },
    { label: 'RMSE, filtered estimate', value: String(result.rmseFiltered) },
    { label: 'Process noise Q', value: String(params.q) },
    { label: 'Measurement noise R', value: String(params.r) },
  ]
  if (params.mode === 'ekf' && result.linPoint !== null && result.jacobian !== null) {
    rows.push(
      { label: 'Linearisation point, final step', value: String(result.linPoint) },
      { label: 'Jacobian H at that point', value: String(result.jacobian) },
      { label: 'True H at final truth', value: String(Number((2 * Math.cos((result.truth[result.truth.length - 1] ?? 0) / 4)).toFixed(3))) },
    )
  }
  return rows
}

/* ---------------- Occupancy mapping ---------------- */

export function OccupancyFigure({ result }: { result: OccupancyResult }) {
  const C = 10
  const W = OCC_W * C
  const H = OCC_H * C
  // Cells are emitted as horizontal run-length rectangles rather than one
  // square per cell: the rover record carries this figure in its static
  // HTML, and per-cell paths measured 337 kB on that page's export.
  let occ = ''
  let free = ''
  for (let y = 0; y < OCC_H; y++) {
    let x = 0
    while (x < OCC_W) {
      const v = result.logOdds[y * OCC_W + x] ?? 0
      const kind = v > 0.6 ? 'occ' : v < -0.3 ? 'free' : null
      let run = 1
      while (x + run < OCC_W) {
        const w = result.logOdds[y * OCC_W + x + run] ?? 0
        if ((w > 0.6 ? 'occ' : w < -0.3 ? 'free' : null) !== kind) break
        run++
      }
      if (kind !== null) {
        const seg = `M${x * C} ${y * C}h${run * C}v${C}h${-run * C}z`
        if (kind === 'occ') occ += seg
        else free += seg
      }
      x += run
    }
  }
  const pts = (path: readonly { x: number; y: number }[]) =>
    path.map((p) => `${(p.x * C).toFixed(0)},${(p.y * C).toFixed(0)}`).join(' ')
  const pose = result.odomPath[result.odomPath.length - 1]
  return (
    <Plot w={W} h={H} label="The accumulated occupancy grid, the true route and the odometry route the map was written from.">
      <path d={free} className={s.occFree} />
      <path d={occ} className={s.occOcc} />
      {result.truePath.length > 1 ? (
        <polyline points={pts(result.truePath)} className={s.occTrue} />
      ) : null}
      {result.odomPath.length > 1 ? (
        <polyline points={pts(result.odomPath)} className={s.occOdom} />
      ) : null}
      {pose ? <circle cx={pose.x * C} cy={pose.y * C} r={C * 0.6} className={s.plotMark} /> : null}
    </Plot>
  )
}

export function occupancyReadouts(result: OccupancyResult, beams: number): Readout[] {
  return [
    { label: 'Scans applied', value: String(result.scansApplied) },
    { label: 'Beams per scan', value: String(beams) },
    { label: 'Cells observed', value: `${result.cellsObserved} of ${OCC_W * OCC_H}` },
    { label: 'Cells holding occupied evidence', value: String(result.occupiedCells) },
    { label: 'Pose drift at last scan', value: `${result.finalDrift} cells` },
  ]
}
