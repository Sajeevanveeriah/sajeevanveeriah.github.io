'use client'

import { useMemo, useState } from 'react'
import { KALMAN_DEFAULTS, runKalman } from './kalman'
import { bandPath, polyPoints, xScale, yScale, type ChartFrame } from './chart'
import s from './lab.module.css'

const FRAME: ChartFrame = {
  width: 720,
  height: 320,
  padLeft: 44,
  padRight: 12,
  padTop: 14,
  padBottom: 32,
  xMin: 0,
  xMax: 13.9,
  yMin: -0.6,
  yMax: 3.4,
}

/* The sliders move through variance exponentially, because useful Q and R
   values span decades; the slider position is the exponent. */
function toVariance(pos: number): number {
  return Number(Math.pow(10, pos).toFixed(4))
}

/**
 * One-dimensional Kalman filter demonstration: seeded noisy measurements of
 * a hidden trajectory, a scalar filter tracking it, and process and
 * measurement noise sliders that re-balance how much the filter trusts the
 * model against the sensor. Every render is a complete static chart of the
 * current settings, so reduced motion needs no separate variant.
 */
export function KalmanLab({ compact = false }: { compact?: boolean }) {
  const [qPos, setQPos] = useState(Math.log10(KALMAN_DEFAULTS.q))
  const [rPos, setRPos] = useState(Math.log10(KALMAN_DEFAULTS.r))

  const q = toVariance(qPos)
  const r = toVariance(rPos)
  const run = useMemo(() => runKalman(q, r), [q, r])

  const frame = compact ? { ...FRAME, height: 260 } : FRAME
  const improvement =
    run.rmseRaw > 0 ? Math.round((1 - run.rmseFiltered / run.rmseRaw) * 100) : 0

  return (
    <div className={`${s.lab} ${compact ? s.compact : ''}`}>
      <div className={s.plate}>
        <svg
          className={s.chart}
          viewBox={`0 0 ${frame.width} ${frame.height}`}
          role="img"
          aria-label={`Kalman filter run with process noise ${q} and measurement noise ${r}: raw error ${run.rmseRaw}, filtered error ${run.rmseFiltered}.`}
        >
          <line
            className={s.chartAxis}
            x1={frame.padLeft}
            y1={yScale(frame, 0)}
            x2={frame.width - frame.padRight}
            y2={yScale(frame, 0)}
          />
          <line
            className={s.chartAxis}
            x1={frame.padLeft}
            y1={frame.padTop}
            x2={frame.padLeft}
            y2={yScale(frame, FRAME.yMin)}
          />
          {[0, 1, 2, 3].map((tick) => (
            <text
              key={tick}
              className={s.chartTick}
              x={frame.padLeft - 8}
              y={yScale(frame, tick) + 4}
              textAnchor="end"
            >
              {tick}
            </text>
          ))}
          {[0, 4, 8, 12].map((tick) => (
            <text
              key={tick}
              className={s.chartTick}
              x={xScale(frame, tick)}
              y={frame.height - 10}
              textAnchor="middle"
            >
              {tick} s
            </text>
          ))}

          {/* Two-sigma confidence band around the estimate. */}
          <polygon className={s.chartBand} points={bandPath(frame, run.t, run.xhat, run.bound)} />
          {/* Hidden truth. */}
          <polyline className={s.chartTruth} points={polyPoints(frame, run.t, run.truth)} />
          {/* Raw measurements. */}
          {run.t.map((time, i) => (
            <circle
              key={i}
              className={s.chartRaw}
              cx={xScale(frame, time)}
              cy={yScale(frame, Math.max(FRAME.yMin, Math.min(FRAME.yMax, run.z[i] ?? 0)))}
              r={2}
            />
          ))}
          {/* Filtered estimate. */}
          <polyline className={s.chartLine} points={polyPoints(frame, run.t, run.xhat)} />
        </svg>

        <ul className={s.legend}>
          <li>
            <span className={s.swatch} style={{ background: 'var(--accent-fill)' }} /> Kalman
            estimate
          </li>
          <li>
            <span className={s.swatch} style={{ background: 'var(--border-strong)' }} /> Raw
            measurements
          </li>
          <li>
            <span
              className={s.swatch}
              style={{ background: 'var(--surface)', border: '1px dashed var(--text-faint)' }}
            />{' '}
            Hidden truth
          </li>
          <li>
            <span className={s.swatch} style={{ background: 'var(--accent-muted)' }} /> Two-sigma
            band
          </li>
        </ul>

        <div className={s.sliders}>
          <div className={s.sliderRow}>
            <label className={s.sliderLabel} htmlFor={`kal-q${compact ? '-c' : ''}`}>
              Process noise Q
            </label>
            <input
              id={`kal-q${compact ? '-c' : ''}`}
              className={s.slider}
              type="range"
              min={-4}
              max={0}
              step={0.05}
              value={qPos}
              onChange={(e) => setQPos(Number(e.target.value))}
              aria-valuetext={`${q}`}
            />
            <span className={s.sliderValue}>{q}</span>
          </div>
          <div className={s.sliderRow}>
            <label className={s.sliderLabel} htmlFor={`kal-r${compact ? '-c' : ''}`}>
              Measurement noise R
            </label>
            <input
              id={`kal-r${compact ? '-c' : ''}`}
              className={s.slider}
              type="range"
              min={-2}
              max={0.7}
              step={0.05}
              value={rPos}
              onChange={(e) => setRPos(Number(e.target.value))}
              aria-valuetext={`${r}`}
            />
            <span className={s.sliderValue}>{r}</span>
          </div>
        </div>

        <dl className={s.readouts}>
          <div className={s.stat}>
            <dt className={s.statLabel}>RMSE, raw</dt>
            <dd className={s.statValue}>{run.rmseRaw.toFixed(3)}</dd>
          </div>
          <div className={s.stat}>
            <dt className={s.statLabel}>RMSE, filtered</dt>
            <dd className={s.statValue}>{run.rmseFiltered.toFixed(3)}</dd>
          </div>
          <div className={s.stat}>
            <dt className={s.statLabel}>Error reduction</dt>
            <dd className={s.statValue}>{improvement}%</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
