'use client'

import { useMemo, useState } from 'react'

const SERVICE_TIME_MIN = 1.0
const SERVICE_RATE_PER_H = 60
const CHECKPOINTS = [50, 80, 95] as const

function calcQueue(utilPct: number) {
  const rho = utilPct / 100
  const waitMin = (rho / (1 - rho)) * SERVICE_TIME_MIN
  const totalMin = waitMin + SERVICE_TIME_MIN
  const throughputPerH = SERVICE_RATE_PER_H * rho
  const wipJobs = (throughputPerH / 60) * totalMin
  return { rho, waitMin, totalMin, throughputPerH, wipJobs }
}

const W = 560
const H = 220
const padL = 48
const padR = 24
const padT = 20
const padB = 36
const plotW = W - padL - padR
const plotH = H - padT - padB
const maxW = 20

const xFor = (u: number) => padL + ((u - 50) / 45) * plotW
const yFor = (w: number) => padT + plotH - (Math.min(maxW, w) / maxW) * plotH

const PATH_D = (() => {
  const pts: string[] = []
  for (let u = 50; u <= 95; u += 1) {
    const { waitMin } = calcQueue(u)
    pts.push(`${u === 50 ? 'M' : 'L'}${xFor(u).toFixed(1)} ${yFor(waitMin).toFixed(1)}`)
  }
  return pts.join(' ')
})()

export function QueueSimulator({ initialUtil = 80 }: { readonly initialUtil?: number }) {
  const [util, setUtil] = useState(initialUtil)
  const metrics = useMemo(() => calcQueue(util), [util])
  const pathD = PATH_D

  const activeX = xFor(util)
  const activeY = yFor(metrics.waitMin)
  const queueTokens = Math.min(20, Math.max(1, Math.round(metrics.wipJobs)))

  return (
    <section className="queue-sim" aria-labelledby="queue-sim-title">
      <div className="queue-sim-head">
        <div>
          <p className="eyebrow">Interactive M/M/1 model</p>
          <h3 id="queue-sim-title">Little&apos;s Law Queue Simulator</h3>
          <p>
            Analytical M/M/1 illustration with 1.0 min mean service time (60 jobs/h). See how mean waiting grows nonlinearly as utilisation climbs from 50% to 95%.
          </p>
        </div>
        <div className="queue-checkpoints" role="group" aria-label="Published utilisation checkpoints">
          {CHECKPOINTS.map((cp) => (
            <button
              key={cp}
              type="button"
              className="preset-btn"
              aria-pressed={util === cp}
              onClick={() => setUtil(cp)}
            >
              {cp}%
            </button>
          ))}
        </div>
      </div>

      <div className="queue-slider-row">
        <label htmlFor="queue-util-slider">
          <span>Server utilisation</span>
          <strong data-testid="queue-util">{util}%</strong>
        </label>
        <input
          id="queue-util-slider"
          type="range"
          min={50}
          max={95}
          step={1}
          value={util}
          onChange={(e) => setUtil(Number(e.target.value))}
        />
      </div>

      <div className="queue-visual-grid">
        <div className="queue-curve-wrap">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="queue-svg"
            role="img"
            aria-label={`Mean wait curve from 50 percent (1.0 min) to 95 percent (19.0 min). Current selection ${util}% gives ${metrics.waitMin.toFixed(1)} min wait.`}
          >
            {[0, 5, 10, 15, 20].map((tick) => (
              <g key={tick}>
                <line className="q-grid" x1={padL} y1={yFor(tick)} x2={W - padR} y2={yFor(tick)} />
                <text className="q-label" x={padL - 8} y={yFor(tick) + 4} textAnchor="end">
                  {tick}m
                </text>
              </g>
            ))}
            {[50, 65, 80, 95].map((uTick) => (
              <g key={uTick}>
                <line className="q-grid" x1={xFor(uTick)} y1={padT} x2={xFor(uTick)} y2={padT + plotH} />
                <text className="q-label" x={xFor(uTick)} y={H - 12} textAnchor="middle">
                  {uTick}%
                </text>
              </g>
            ))}

            <path className="q-curve" d={pathD} fill="none" />

            {CHECKPOINTS.map((cp) => {
              const cVal = calcQueue(cp)
              return (
                <g key={cp}>
                  <circle className="q-checkpoint" cx={xFor(cp)} cy={yFor(cVal.waitMin)} r={4.5} />
                </g>
              )
            })}

            <line className="q-crosshair" x1={activeX} y1={padT} x2={activeX} y2={padT + plotH} />
            <circle className="q-active" cx={activeX} cy={activeY} r={7} />
          </svg>
        </div>

        <div className="queue-metrics-panel">
          <dl className="eng-telemetry">
            <div>
              <dt>Mean wait (Wq)</dt>
              <dd data-testid="queue-wait">{metrics.waitMin.toFixed(1)} min</dd>
            </div>
            <div>
              <dt>Total flow time (W)</dt>
              <dd data-testid="queue-total">{metrics.totalMin.toFixed(1)} min</dd>
            </div>
            <div>
              <dt>Arrival rate</dt>
              <dd data-testid="queue-throughput">{metrics.throughputPerH.toFixed(1)} jobs/h</dd>
            </div>
            <div>
              <dt>Mean WIP (L)</dt>
              <dd data-testid="queue-wip">{metrics.wipJobs.toFixed(1)} jobs</dd>
            </div>
          </dl>

          <div className="queue-buffer-bar" aria-label={`Analytical work in progress depth: ${metrics.wipJobs.toFixed(1)} jobs`}>
            <span className="queue-buffer-label">Modelled WIP buffer ({metrics.wipJobs.toFixed(1)} jobs)</span>
            <div className="queue-slots" aria-hidden="true">
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className={i < queueTokens ? 'queue-slot filled' : 'queue-slot'} />
              ))}
            </div>
          </div>
          <p className="queue-disclaimer">
            Formula: Wq = (rho / (1 - rho)) x 1.0 min. Analytical M/M/1 illustration, not measured factory data.
          </p>
        </div>
      </div>
    </section>
  )
}
