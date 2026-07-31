import { idx, presetWalls, runAStar } from './astar'
import { PID_DEFAULTS, PID_HORIZON, PID_SETPOINT, simulatePid } from './pid'
import { KALMAN_DEFAULTS, runKalman } from './kalman'
import { bandPath, polyPoints, xScale, yScale, type ChartFrame } from './chart'
import s from './lab.module.css'

/**
 * Server-rendered final states of each demonstration.
 *
 * These are computed at build time by the same engines the widgets use, so
 * the no-JavaScript fallback is not a screenshot or a sketch: it is the real
 * result of the default parameters, complete and readable on its own. With
 * JavaScript the interactive widget replaces this block after mount.
 */

const CHART_FRAME: ChartFrame = {
  width: 720,
  height: 320,
  padLeft: 44,
  padRight: 12,
  padTop: 14,
  padBottom: 32,
  xMin: 0,
  xMax: PID_HORIZON,
  yMin: 0,
  yMax: 2,
}

export function PathPlannerStatic({ compact = false }: { compact?: boolean }) {
  const cols = compact ? 12 : 16
  const rows = compact ? 8 : 10
  const walls = presetWalls(cols, rows)
  const start = idx(1, Math.floor(rows / 2), cols)
  const goal = idx(cols - 2, Math.floor(rows / 2), cols)
  const result = runAStar(cols, rows, walls, start, goal)
  const path = new Set(result.path)
  const visited = new Set(result.visitedOrder)

  const cellSize = 36
  const gap = 3
  const w = cols * (cellSize + gap) - gap
  const h = rows * (cellSize + gap) - gap

  const fillFor = (i: number): string => {
    if (i === start) return 'var(--accent-fill)'
    if (i === goal) return 'var(--surface)'
    if (walls.has(i)) return 'var(--text)'
    if (path.has(i)) return 'var(--accent-muted)'
    if (visited.has(i)) return 'var(--tint-deep)'
    return 'var(--tint)'
  }

  return (
    <div className={`${s.lab} ${compact ? s.compact : ''}`}>
      <div className={s.plate}>
        <svg
          className={s.chart}
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={`Finished A* search on the preset ${cols} by ${rows} grid: the shortest path of ${result.cost} steps threads the wall gaps, with ${result.expanded} cells explored on the way. The interactive version needs JavaScript.`}
        >
          {Array.from({ length: rows * cols }, (_, i) => {
            const x = (i % cols) * (cellSize + gap)
            const y = Math.floor(i / cols) * (cellSize + gap)
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                rx={4}
                fill={fillFor(i)}
                stroke={i === goal ? 'var(--accent-fill)' : 'none'}
                strokeWidth={i === goal ? 3 : 0}
              />
            )
          })}
        </svg>
        <dl className={s.readouts}>
          <div className={s.stat}>
            <dt className={s.statLabel}>Cells explored</dt>
            <dd className={s.statValue}>{result.expanded}</dd>
          </div>
          <div className={s.stat}>
            <dt className={s.statLabel}>Path cost</dt>
            <dd className={s.statValue}>{result.cost} steps</dd>
          </div>
        </dl>
        <p className={s.framing}>
          Static result of the preset board. The interactive board needs JavaScript.
        </p>
      </div>
    </div>
  )
}

export function PidStatic({ compact = false }: { compact?: boolean }) {
  const res = simulatePid(PID_DEFAULTS.kp, PID_DEFAULTS.ki, PID_DEFAULTS.kd)
  const m = res.metrics
  const frame = compact ? { ...CHART_FRAME, height: 260 } : CHART_FRAME

  return (
    <div className={`${s.lab} ${compact ? s.compact : ''}`}>
      <div className={s.plate}>
        <svg
          className={s.chart}
          viewBox={`0 0 ${frame.width} ${frame.height}`}
          role="img"
          aria-label={`Step response at the default gains Kp ${PID_DEFAULTS.kp}, Ki ${PID_DEFAULTS.ki}, Kd ${PID_DEFAULTS.kd}: overshoot ${m.overshootPct} percent. The interactive sliders need JavaScript.`}
        >
          <line
            className={s.chartAxis}
            x1={frame.padLeft}
            y1={yScale(frame, 0)}
            x2={frame.width - frame.padRight}
            y2={yScale(frame, 0)}
          />
          <line
            className={s.chartRef}
            x1={frame.padLeft}
            y1={yScale(frame, PID_SETPOINT)}
            x2={frame.width - frame.padRight}
            y2={yScale(frame, PID_SETPOINT)}
          />
          <polyline className={s.chartLine} points={polyPoints(frame, res.t, res.y)} />
        </svg>
        <dl className={s.readouts}>
          <div className={s.stat}>
            <dt className={s.statLabel}>Overshoot</dt>
            <dd className={s.statValue}>{m.overshootPct.toFixed(1)}%</dd>
          </div>
          <div className={s.stat}>
            <dt className={s.statLabel}>Settling time (2%)</dt>
            <dd className={s.statValue}>
              {m.settlingTime === null ? 'Not settled' : `${m.settlingTime.toFixed(2)} s`}
            </dd>
          </div>
        </dl>
        <p className={s.framing}>
          Static response at the default gains. The tuning sliders need JavaScript.
        </p>
      </div>
    </div>
  )
}

export function KalmanStatic({ compact = false }: { compact?: boolean }) {
  const run = runKalman(KALMAN_DEFAULTS.q, KALMAN_DEFAULTS.r)
  const frame: ChartFrame = {
    ...CHART_FRAME,
    height: compact ? 260 : 320,
    xMax: 13.9,
    yMin: -0.6,
    yMax: 3.4,
  }

  return (
    <div className={`${s.lab} ${compact ? s.compact : ''}`}>
      <div className={s.plate}>
        <svg
          className={s.chart}
          viewBox={`0 0 ${frame.width} ${frame.height}`}
          role="img"
          aria-label={`Kalman filter run at the default noise settings: raw measurement error ${run.rmseRaw}, filtered error ${run.rmseFiltered}. The noise sliders need JavaScript.`}
        >
          <line
            className={s.chartAxis}
            x1={frame.padLeft}
            y1={yScale(frame, 0)}
            x2={frame.width - frame.padRight}
            y2={yScale(frame, 0)}
          />
          <polygon className={s.chartBand} points={bandPath(frame, run.t, run.xhat, run.bound)} />
          <polyline className={s.chartTruth} points={polyPoints(frame, run.t, run.truth)} />
          {run.t.map((time, i) => (
            <circle
              key={i}
              className={s.chartRaw}
              cx={xScale(frame, time)}
              cy={yScale(frame, Math.max(frame.yMin, Math.min(frame.yMax, run.z[i] ?? 0)))}
              r={2}
            />
          ))}
          <polyline className={s.chartLine} points={polyPoints(frame, run.t, run.xhat)} />
        </svg>
        <dl className={s.readouts}>
          <div className={s.stat}>
            <dt className={s.statLabel}>RMSE, raw</dt>
            <dd className={s.statValue}>{run.rmseRaw.toFixed(3)}</dd>
          </div>
          <div className={s.stat}>
            <dt className={s.statLabel}>RMSE, filtered</dt>
            <dd className={s.statValue}>{run.rmseFiltered.toFixed(3)}</dd>
          </div>
        </dl>
        <p className={s.framing}>
          Static run at the default noise settings. The sliders need JavaScript.
        </p>
      </div>
    </div>
  )
}
