'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  runAstar,
  astarDefaults,
  GRID_W,
  GRID_H,
  type AstarParams,
  type Heuristic,
} from '@/lib/labs/astar'
import { runPid, PID_DEFAULTS, PID_PRESETS, type PidParams } from '@/lib/labs/pid'
import {
  runKalman,
  KALMAN_DEFAULTS,
  KALMAN_PRESETS,
  type KalmanParams,
  type KalmanMode,
} from '@/lib/labs/kalman'
import {
  runOccupancy,
  OCC_DEFAULTS,
  OCC_PRESETS,
  type OccupancyParams,
} from '@/lib/labs/occupancy'
import {
  AstarGrid,
  astarCellStates,
  astarReadouts,
  PidFigure,
  pidReadouts,
  KalmanFigure,
  kalmanReadouts,
  OccupancyFigure,
  occupancyReadouts,
  ReadoutTable,
} from './figures'
import s from './lab.module.css'

/**
 * The interactive lab modules. Loaded only after mount via LabMount, so
 * everything here is enhancement on top of the complete static page. All
 * four labs recompute their engine synchronously on every input; the
 * engines are small enough that this stays comfortably within a frame.
 */
export function LabClient({ slug }: { slug: string }) {
  if (slug === 'path-planner') return <AstarLab />
  if (slug === 'pid-tuning') return <PidLab />
  if (slug === 'kalman-filter') return <KalmanLab />
  return <OccupancyLab />
}

/* ---------------- Shared control primitives ---------------- */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => String(v),
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <div className={s.controlRow}>
      <label className={s.controlLabel} htmlFor={id}>
        {label}
      </label>
      <output className={s.controlValue} htmlFor={id}>
        {format(value)}
      </output>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function PresetRow<T extends object>({
  presets,
  params,
  onApply,
}: {
  presets: readonly { id: string; label: string; values: T }[]
  params: T
  onApply: (values: T) => void
}) {
  const matches = (v: T) =>
    Object.entries(v).every(([k, val]) => (params as Record<string, unknown>)[k] === val)
  return (
    <PillRow
      legend="Presets"
      options={presets}
      isActive={(id) => {
        const pr = presets.find((x) => x.id === id)
        return pr !== undefined && matches(pr.values)
      }}
      onSelect={(id) => {
        const pr = presets.find((x) => x.id === id)
        if (pr) onApply(pr.values)
      }}
    />
  )
}

function PillRow({
  legend,
  options,
  isActive,
  onSelect,
}: {
  legend: string
  options: readonly { id: string; label: string }[]
  isActive: (id: string) => boolean
  onSelect: (id: string) => void
}) {
  return (
    <div className={s.controls}>
      <span className={s.groupLabel}>{legend}</span>
      <div className={s.btnRow} role="group" aria-label={legend}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={s.pillBtn}
            aria-pressed={isActive(o.id)}
            onClick={() => onSelect(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Step, play and reset. Under reduced motion, play resolves immediately. */
function Transport({
  playing,
  onStep,
  onPlay,
  onReset,
}: {
  playing: boolean
  onStep: () => void
  onPlay: () => void
  onReset: () => void
}) {
  return (
    <div className={s.btnRow}>
      <button type="button" className={s.pillBtn} onClick={onStep}>
        Step
      </button>
      <button type="button" className={s.pillBtn} aria-pressed={playing} onClick={onPlay}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <button type="button" className={s.pillBtn} onClick={onReset}>
        Reset
      </button>
    </div>
  )
}

function Module({ stage, side, occ }: { stage: ReactNode; side: ReactNode; occ?: boolean }) {
  return (
    <div className={s.module}>
      <div className={occ ? `${s.stage} ${s.occPlot}` : s.stage}>{stage}</div>
      <div className={s.side}>{side}</div>
    </div>
  )
}

/**
 * Frame player over a finite frame count. `frame === null` means the final
 * state. Play advances from the start on an interval; reduced motion jumps
 * straight to the final state instead of animating.
 */
function usePlayer(total: number, reduced: boolean) {
  const [frame, setFrame] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const t = window.setInterval(() => {
      setFrame((f) => {
        const next = (f === null ? 0 : f) + 1
        if (next >= total) {
          setPlaying(false)
          return null
        }
        return next
      })
    }, 60)
    return () => window.clearInterval(t)
  }, [playing, total])

  const step = useCallback(() => {
    setPlaying(false)
    setFrame((f) => {
      const next = (f === null ? 0 : f + 1)
      return next >= total ? null : next
    })
  }, [total])

  const play = useCallback(() => {
    if (reduced) {
      setFrame(null)
      setPlaying(false)
      return
    }
    setPlaying((p) => {
      if (p) return false
      setFrame(0)
      return true
    })
  }, [reduced])

  const stop = useCallback(() => {
    setPlaying(false)
    setFrame(null)
  }, [])

  return { frame, playing, step, play, stop }
}

/* ---------------- A* ---------------- */

const HEURISTICS: readonly { id: Heuristic; label: string }[] = [
  { id: 'manhattan', label: 'Manhattan' },
  { id: 'euclidean', label: 'Euclidean' },
  { id: 'chebyshev', label: 'Chebyshev' },
]

const PAINT_MODES = [
  { id: 'paint', label: 'Paint obstacles' },
  { id: 'erase', label: 'Erase' },
  { id: 'start', label: 'Set start' },
  { id: 'goal', label: 'Set goal' },
] as const

type PaintMode = (typeof PAINT_MODES)[number]['id']

function AstarLab() {
  const reduced = useReducedMotion()
  const [params, setParams] = useState<AstarParams>(() => astarDefaults())
  const [mode, setMode] = useState<PaintMode>('paint')
  const [focusIdx, setFocusIdx] = useState(0)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const pointerDown = useRef(false)

  const { result, timeMs } = useMemo(() => {
    const t0 = performance.now()
    const r = runAstar(params)
    return { result: r, timeMs: performance.now() - t0 }
  }, [params])

  const totalFrames = result.expanded.length + 1
  const { frame, playing, step, play, stop } = usePlayer(totalFrames, reduced)

  // Any parameter change invalidates a replay in progress.
  useEffect(() => {
    stop()
  }, [params, stop])

  const act = useCallback(
    (i: number) => {
      setParams((p) => {
        if (mode === 'start') return i === p.goal ? p : { ...p, start: i, obstacles: p.obstacles.filter((c) => c !== i) }
        if (mode === 'goal') return i === p.start ? p : { ...p, goal: i, obstacles: p.obstacles.filter((c) => c !== i) }
        if (i === p.start || i === p.goal) return p
        const has = p.obstacles.includes(i)
        if (mode === 'paint' && !has) return { ...p, obstacles: [...p.obstacles, i] }
        if (mode === 'erase' && has) return { ...p, obstacles: p.obstacles.filter((c) => c !== i) }
        return p
      })
    },
    [mode],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, i: number) => {
      const x = i % GRID_W
      const y = Math.floor(i / GRID_W)
      let next: number | null = null
      if (e.key === 'ArrowRight' && x < GRID_W - 1) next = i + 1
      else if (e.key === 'ArrowLeft' && x > 0) next = i - 1
      else if (e.key === 'ArrowDown' && y < GRID_H - 1) next = i + GRID_W
      else if (e.key === 'ArrowUp' && y > 0) next = i - GRID_W
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        act(i)
        return
      }
      if (next !== null) {
        e.preventDefault()
        setFocusIdx(next)
        const cell = gridRef.current?.querySelector<HTMLElement>(`[data-idx="${next}"]`)
        cell?.focus()
      }
    },
    [act],
  )

  const states = astarCellStates(params, result, frame)

  return (
    <Module
      stage={
        <>
          <AstarGrid
            states={states}
            describedBy="astar-help"
            gridProps={{
              ref: gridRef,
              onPointerDown: () => {
                pointerDown.current = true
              },
              onPointerUp: () => {
                pointerDown.current = false
              },
              onPointerLeave: () => {
                pointerDown.current = false
              },
            }}
            cellProps={(i) => ({
              'data-idx': i,
              tabIndex: i === focusIdx ? 0 : -1,
              onClick: () => {
                setFocusIdx(i)
                act(i)
              },
              onPointerEnter: () => {
                if (pointerDown.current && (mode === 'paint' || mode === 'erase')) act(i)
              },
              onKeyDown: (e: React.KeyboardEvent) => onKeyDown(e, i),
            })}
          />
          <p id="astar-help" className={s.figureNote}>
            Arrow keys move around the grid; Space or Enter applies the selected tool to the
            focused cell.
          </p>
        </>
      }
      side={
        <>
          <ReadoutTable rows={astarReadouts(result, timeMs)} caption="Live A* readouts." />
          <PillRow
            legend="Tool"
            options={PAINT_MODES}
            isActive={(id) => id === mode}
            onSelect={(id) => setMode(id as PaintMode)}
          />
          <div className={s.controls}>
            <span className={s.groupLabel}>Search</span>
            <div className={s.controlRow}>
              <label className={s.controlLabel} htmlFor="astar-heuristic">
                Heuristic
              </label>
              <select
                id="astar-heuristic"
                value={params.heuristic}
                onChange={(e) => setParams((p) => ({ ...p, heuristic: e.target.value as Heuristic }))}
              >
                {HEURISTICS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>
            <label className={s.checkRow}>
              <input
                type="checkbox"
                checked={params.diagonal}
                onChange={(e) => setParams((p) => ({ ...p, diagonal: e.target.checked }))}
              />
              Diagonal movement
            </label>
            <Slider
              id="astar-inflation"
              label="Inflation radius"
              value={params.inflation}
              min={0}
              max={2}
              step={1}
              onChange={(v) => setParams((p) => ({ ...p, inflation: v }))}
              format={(v) => `${v} cells`}
            />
          </div>
          <Transport
            playing={playing}
            onStep={step}
            onPlay={play}
            onReset={() => {
              stop()
              setParams(astarDefaults())
            }}
          />
        </>
      }
    />
  )
}

/* ---------------- PID ---------------- */

function PidLab() {
  const [params, setParams] = useState<PidParams>(PID_DEFAULTS)
  const result = useMemo(() => runPid(params), [params])

  return (
    <Module
      stage={<PidFigure result={result} />}
      side={
        <>
          <ReadoutTable rows={pidReadouts(result)} caption="Live step-response readouts." />
          <div className={s.controls}>
            <span className={s.groupLabel}>Gains</span>
            <Slider id="pid-kp" label="Kp" value={params.kp} min={0} max={24} step={0.5} onChange={(v) => setParams((p) => ({ ...p, kp: v }))} />
            <Slider id="pid-ki" label="Ki" value={params.ki} min={0} max={16} step={0.5} onChange={(v) => setParams((p) => ({ ...p, ki: v }))} />
            <Slider id="pid-kd" label="Kd" value={params.kd} min={0} max={16} step={0.1} onChange={(v) => setParams((p) => ({ ...p, kd: v }))} />
            <label className={s.checkRow}>
              <input
                type="checkbox"
                checked={params.clamp}
                onChange={(e) => setParams((p) => ({ ...p, clamp: e.target.checked }))}
              />
              Integrator clamp
            </label>
          </div>
          <PresetRow presets={PID_PRESETS} params={params} onApply={setParams} />
        </>
      }
    />
  )
}

/* ---------------- Kalman ---------------- */

function KalmanLab() {
  const [params, setParams] = useState<KalmanParams>(KALMAN_DEFAULTS)
  const result = useMemo(() => runKalman(params), [params])

  return (
    <Module
      stage={
        <>
          <PillRow
            legend="Filter variant"
            options={[
              { id: 'kf', label: 'Kalman filter' },
              { id: 'ekf', label: 'EKF, nonlinear measurement' },
            ]}
            isActive={(id) => params.mode === id}
            onSelect={(id) => setParams((p) => ({ ...p, mode: id as KalmanMode }))}
          />
          <KalmanFigure params={params} result={result} />
        </>
      }
      side={
        <>
          <ReadoutTable rows={kalmanReadouts(params, result)} caption="Live filter readouts." />
          <div className={s.controls}>
            <span className={s.groupLabel}>Noise models</span>
            <Slider
              id="kalman-q"
              label="Process noise Q"
              value={params.q}
              min={0.01}
              max={2}
              step={0.01}
              onChange={(v) => setParams((p) => ({ ...p, q: v, x0: 0 }))}
            />
            <Slider
              id="kalman-r"
              label="Measurement noise R"
              value={params.r}
              min={0.05}
              max={4}
              step={0.05}
              onChange={(v) => setParams((p) => ({ ...p, r: v }))}
            />
          </div>
          <PillRow
            legend="Presets"
            options={KALMAN_PRESETS}
            isActive={(id) => {
              const pr = KALMAN_PRESETS.find((x) => x.id === id)
              return pr !== undefined && pr.values.q === params.q && pr.values.r === params.r && pr.values.x0 === params.x0
            }}
            onSelect={(id) => {
              const pr = KALMAN_PRESETS.find((x) => x.id === id)
              if (pr) setParams((p) => ({ ...p, ...pr.values }))
            }}
          />
        </>
      }
    />
  )
}

/* ---------------- Occupancy mapping ---------------- */

function OccupancyLab() {
  const reduced = useReducedMotion()
  const [params, setParams] = useState<OccupancyParams>(OCC_DEFAULTS)
  const { frame, playing, step, play, stop } = usePlayer(params.scans + 1, reduced)

  useEffect(() => {
    stop()
  }, [params, stop])

  const result = useMemo(
    () => runOccupancy(params, frame === null ? undefined : frame),
    [params, frame],
  )

  return (
    <Module
      occ
      stage={<OccupancyFigure result={result} />}
      side={
        <>
          <ReadoutTable
            rows={occupancyReadouts(result, params.beams)}
            caption="Live occupancy mapping readouts."
          />
          <div className={s.controls}>
            <span className={s.groupLabel}>Sensor and odometry</span>
            <Slider id="occ-scans" label="Scan rate along the route" value={params.scans} min={10} max={80} step={5} onChange={(v) => setParams((p) => ({ ...p, scans: v }))} format={(v) => `${v} scans`} />
            <Slider id="occ-beams" label="Angular resolution" value={params.beams} min={12} max={144} step={12} onChange={(v) => setParams((p) => ({ ...p, beams: v }))} format={(v) => `${v} beams`} />
            <Slider id="occ-noise" label="Range noise sigma" value={params.rangeNoise} min={0} max={0.6} step={0.05} onChange={(v) => setParams((p) => ({ ...p, rangeNoise: v }))} format={(v) => `${v} cells`} />
            <Slider id="occ-drift" label="Odometry drift" value={params.drift} min={0} max={0.02} step={0.001} onChange={(v) => setParams((p) => ({ ...p, drift: v }))} format={(v) => `${v} rad per step`} />
          </div>
          <PresetRow presets={OCC_PRESETS} params={params} onApply={setParams} />
          <Transport
            playing={playing}
            onStep={step}
            onPlay={play}
            onReset={() => {
              stop()
              setParams(OCC_DEFAULTS)
            }}
          />
        </>
      }
    />
  )
}
