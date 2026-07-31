'use client'

import { useMemo, useState } from 'react'
import { PID_DEFAULTS, PID_HORIZON, PID_SETPOINT, simulatePid } from './pid'
import { polyPoints, xScale, yScale, type ChartFrame } from './chart'
import s from './lab.module.css'

const FRAME: ChartFrame = {
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

const SLIDERS = [
  { id: 'kp', label: 'Proportional gain Kp', min: 0, max: 20, step: 0.1 },
  { id: 'ki', label: 'Integral gain Ki', min: 0, max: 10, step: 0.1 },
  { id: 'kd', label: 'Derivative gain Kd', min: 0, max: 5, step: 0.05 },
] as const

/**
 * PID tuning demonstration: three gain sliders against a fixed second-order
 * plant, with the full step response recomputed and redrawn on every change.
 * There is no animation to gate: the chart is a static render of each
 * parameter set, so reduced-motion visitors get exactly the same experience.
 */
export function PidLab({ compact = false }: { compact?: boolean }) {
  const [gains, setGains] = useState<{ kp: number; ki: number; kd: number }>(PID_DEFAULTS)

  const res = useMemo(() => simulatePid(gains.kp, gains.ki, gains.kd), [gains])
  const m = res.metrics

  const frame = compact ? { ...FRAME, height: 260 } : FRAME

  return (
    <div className={`${s.lab} ${compact ? s.compact : ''}`}>
      <div className={s.plate}>
        <svg
          className={s.chart}
          viewBox={`0 0 ${frame.width} ${frame.height}`}
          role="img"
          aria-label={`Step response with Kp ${gains.kp}, Ki ${gains.ki}, Kd ${gains.kd}: overshoot ${m.overshootPct} percent, ${
            m.settlingTime === null
              ? 'not settled within the 8 second horizon'
              : `settling in ${m.settlingTime} seconds`
          }.`}
        >
          {/* Axes */}
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
            y2={yScale(frame, 0)}
          />
          {/* Setpoint reference */}
          <line
            className={s.chartRef}
            x1={frame.padLeft}
            y1={yScale(frame, PID_SETPOINT)}
            x2={frame.width - frame.padRight}
            y2={yScale(frame, PID_SETPOINT)}
          />
          <text className={s.chartTick} x={frame.padLeft - 8} y={yScale(frame, PID_SETPOINT) + 4} textAnchor="end">
            1.0
          </text>
          <text className={s.chartTick} x={frame.padLeft - 8} y={yScale(frame, 0) + 4} textAnchor="end">
            0
          </text>
          <text className={s.chartTick} x={frame.padLeft - 8} y={yScale(frame, 2) + 4} textAnchor="end">
            2.0
          </text>
          {[0, 2, 4, 6, 8].map((tick) => (
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
          {/* Response */}
          <polyline className={s.chartLine} points={polyPoints(frame, res.t, res.y)} />
        </svg>

        <div className={s.sliders}>
          {SLIDERS.map(({ id, label, min, max, step }) => (
            <div key={id} className={s.sliderRow}>
              <label className={s.sliderLabel} htmlFor={`pid-${id}${compact ? '-c' : ''}`}>
                {label}
              </label>
              <input
                id={`pid-${id}${compact ? '-c' : ''}`}
                className={s.slider}
                type="range"
                min={min}
                max={max}
                step={step}
                value={gains[id]}
                onChange={(e) => setGains((g) => ({ ...g, [id]: Number(e.target.value) }))}
              />
              <span className={s.sliderValue}>{gains[id].toFixed(2)}</span>
            </div>
          ))}
        </div>

        <dl className={s.readouts}>
          <div className={s.stat}>
            <dt className={s.statLabel}>Overshoot</dt>
            <dd className={s.statValue}>{m.overshootPct.toFixed(1)}%</dd>
          </div>
          <div className={s.stat}>
            <dt className={s.statLabel}>Rise time</dt>
            <dd className={s.statValue}>{m.riseTime === null ? 'Not reached' : `${m.riseTime.toFixed(2)} s`}</dd>
          </div>
          <div className={s.stat}>
            <dt className={s.statLabel}>Settling time (2%)</dt>
            <dd className={s.statValue}>
              {m.settlingTime === null ? 'Not settled' : `${m.settlingTime.toFixed(2)} s`}
            </dd>
          </div>
          <div className={s.stat}>
            <dt className={s.statLabel}>Steady-state error</dt>
            <dd className={s.statValue}>{m.steadyStateError.toFixed(3)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
