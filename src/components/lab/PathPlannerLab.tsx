'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { idx, presetWalls, runAStar, xy, type AStarResult } from './astar'
import { useReducedMotion } from './useReducedMotion'
import s from './lab.module.css'

type Tool = 'wall' | 'erase' | 'start' | 'goal'

const TOOLS: readonly { id: Tool; label: string }[] = [
  { id: 'wall', label: 'Draw walls' },
  { id: 'erase', label: 'Erase' },
  { id: 'start', label: 'Move start' },
  { id: 'goal', label: 'Move goal' },
]

/**
 * Interactive A* demonstration on a paintable occupancy grid.
 *
 * The grid is the ARIA grid pattern with a roving tabindex: one Tab stop,
 * arrow keys move the active cell, Space or Enter applies the current tool.
 * Painting by pointer drags across cells. The search itself is precomputed
 * in full, then replayed; under reduced motion the finished state renders
 * immediately with no replay.
 */
export function PathPlannerLab({ compact = false }: { compact?: boolean }) {
  const cols = compact ? 12 : 16
  const rows = compact ? 8 : 10

  const [walls, setWalls] = useState<Set<number>>(() => presetWalls(cols, rows))
  const [start, setStart] = useState(() => idx(1, Math.floor(rows / 2), cols))
  const [goal, setGoal] = useState(() => idx(cols - 2, Math.floor(rows / 2), cols))
  const [tool, setTool] = useState<Tool>('wall')
  const [result, setResult] = useState<AStarResult | null>(null)
  /** How many expansions are currently revealed; Infinity shows everything. */
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(() => idx(1, Math.floor(rows / 2), cols))

  const reducedMotion = useReducedMotion()
  const painting = useRef<null | 'add' | 'remove'>(null)
  const raf = useRef(0)
  const gridRef = useRef<HTMLDivElement>(null)

  const done = result !== null && progress >= (result.visitedOrder.length || 1)

  /* Stop any replay when the board changes under it. */
  const clearResult = useCallback(() => {
    cancelAnimationFrame(raf.current)
    setResult(null)
    setProgress(0)
  }, [])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const applyTool = useCallback(
    (cell: number, mode?: 'add' | 'remove') => {
      clearResult()
      if (tool === 'start') {
        if (!walls.has(cell) && cell !== goal) setStart(cell)
        return
      }
      if (tool === 'goal') {
        if (!walls.has(cell) && cell !== start) setGoal(cell)
        return
      }
      if (cell === start || cell === goal) return
      setWalls((prev) => {
        const next = new Set(prev)
        const shouldAdd = mode ? mode === 'add' : tool === 'wall'
        if (shouldAdd) next.add(cell)
        else next.delete(cell)
        return next
      })
    },
    [tool, walls, start, goal, clearResult],
  )

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current)
    const r = runAStar(cols, rows, walls, start, goal)
    setResult(r)
    if (reducedMotion || r.visitedOrder.length === 0) {
      setProgress(r.visitedOrder.length || 1)
      return
    }
    setProgress(0)
    /* Reveal a few expansions per frame so the whole replay resolves in
       well under two seconds even on the largest board. */
    const perFrame = Math.max(2, Math.ceil(r.visitedOrder.length / 55))
    let shown = 0
    const step = () => {
      shown += perFrame
      setProgress(shown)
      if (shown < r.visitedOrder.length) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }, [cols, rows, walls, start, goal, reducedMotion])

  const reset = useCallback(() => {
    clearResult()
    setWalls(presetWalls(cols, rows))
    setStart(idx(1, Math.floor(rows / 2), cols))
    setGoal(idx(cols - 2, Math.floor(rows / 2), cols))
  }, [cols, rows, clearResult])

  const clearWalls = useCallback(() => {
    clearResult()
    setWalls(new Set())
  }, [clearResult])

  /* Visible search state, derived from the replay cursor. */
  const shownVisited = useMemo(() => {
    if (!result) return new Set<number>()
    return new Set(result.visitedOrder.slice(0, progress))
  }, [result, progress])

  const shownPath = useMemo(() => {
    if (!result || !done) return new Set<number>()
    return new Set(result.path)
  }, [result, done])

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    const { x, y } = xy(active, cols)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = idx(Math.min(cols - 1, x + 1), y, cols)
    else if (e.key === 'ArrowLeft') next = idx(Math.max(0, x - 1), y, cols)
    else if (e.key === 'ArrowDown') next = idx(x, Math.min(rows - 1, y + 1), cols)
    else if (e.key === 'ArrowUp') next = idx(x, Math.max(0, y - 1), cols)
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      applyTool(active)
      return
    } else return
    e.preventDefault()
    setActive(next)
    const btn = gridRef.current?.querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)
    btn?.focus()
  }

  useEffect(() => {
    const up = () => {
      painting.current = null
    }
    window.addEventListener('pointerup', up)
    return () => window.removeEventListener('pointerup', up)
  }, [])

  const cellState = (i: number): string => {
    if (i === start) return `${s.cell} ${s.cellStart}`
    if (i === goal) return `${s.cell} ${s.cellGoal}`
    if (walls.has(i)) return `${s.cell} ${s.cellWall}`
    if (shownPath.has(i)) return `${s.cell} ${s.cellPath}`
    if (shownVisited.has(i)) return `${s.cell} ${s.cellVisited}`
    return s.cell ?? ''
  }

  const cellName = (i: number): string => {
    const { x, y } = xy(i, cols)
    const what =
      i === start
        ? 'start'
        : i === goal
          ? 'goal'
          : walls.has(i)
            ? 'wall'
            : shownPath.has(i)
              ? 'path'
              : shownVisited.has(i)
                ? 'explored'
                : 'free'
    return `Row ${y + 1}, column ${x + 1}, ${what}`
  }

  const status = !result
    ? 'Ready. Draw obstacles, then run the search.'
    : !done
      ? 'Searching.'
      : result.cost === null
        ? `No path exists. ${result.expanded} cells explored.`
        : `Path found: cost ${result.cost} steps, ${result.expanded} cells explored.`

  return (
    <div className={`${s.lab} ${compact ? s.compact : ''}`}>
      <div className={s.plate}>
        <div className={s.toolbar} role="toolbar" aria-label="Path planner controls">
          <div className={s.toolGroup} role="group" aria-label="Paint tool">
            <span className={s.toolLabel} aria-hidden="true">
              Tool
            </span>
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`${s.toolBtn} ${tool === t.id ? s.toolBtnActive : ''}`}
                aria-pressed={tool === t.id}
                onClick={() => setTool(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className={s.toolGroup}>
            <button type="button" className={s.runBtn} onClick={run}>
              Run search
            </button>
            <button type="button" className={s.toolBtn} onClick={clearWalls}>
              Clear walls
            </button>
            <button type="button" className={s.toolBtn} onClick={reset}>
              Reset board
            </button>
          </div>
        </div>

        <div className={s.gridWrap}>
          <div
            ref={gridRef}
            className={s.grid}
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            role="grid"
            aria-label={`Occupancy grid, ${cols} columns by ${rows} rows. Arrow keys move, Space applies the selected tool.`}
            onKeyDown={onGridKeyDown}
          >
            {Array.from({ length: rows }, (_, y) => (
              <div key={y} role="row" style={{ display: 'contents' }}>
                {Array.from({ length: cols }, (_, x) => {
                  const i = idx(x, y, cols)
                  return (
                    <button
                      key={i}
                      type="button"
                      role="gridcell"
                      data-cell={i}
                      className={cellState(i)}
                      tabIndex={i === active ? 0 : -1}
                      aria-label={cellName(i)}
                      onFocus={() => setActive(i)}
                      onPointerDown={(e) => {
                        e.preventDefault()
                        if (tool === 'wall' || tool === 'erase') {
                          const mode =
                            tool === 'erase' ? 'remove' : walls.has(i) ? 'remove' : 'add'
                          painting.current = mode
                          applyTool(i, mode)
                        } else {
                          applyTool(i)
                        }
                      }}
                      onPointerEnter={() => {
                        if (painting.current) applyTool(i, painting.current)
                      }}
                      onClick={(e) => {
                        /* Pointer interactions are handled above; this path
                           serves keyboard-originated clicks only. */
                        if (e.detail === 0) applyTool(i)
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>

          <ul className={s.legend} aria-hidden="true">
            <li>
              <span className={s.swatch} style={{ background: 'var(--accent-fill)' }} /> Start
            </li>
            <li>
              <span
                className={s.swatch}
                style={{ border: '2px solid var(--accent-fill)', background: 'var(--surface)' }}
              />{' '}
              Goal
            </li>
            <li>
              <span className={s.swatch} style={{ background: 'var(--text)' }} /> Wall
            </li>
            <li>
              <span className={s.swatch} style={{ background: 'var(--tint-deep)' }} /> Explored
            </li>
            <li>
              <span className={s.swatch} style={{ background: 'var(--accent-muted)' }} /> Path
            </li>
          </ul>
        </div>

        <dl className={s.readouts}>
          <div className={s.stat}>
            <dt className={s.statLabel}>Cells explored</dt>
            <dd className={s.statValue}>{done && result ? result.expanded : '0'}</dd>
          </div>
          <div className={s.stat}>
            <dt className={s.statLabel}>Path cost</dt>
            <dd className={s.statValue}>
              {done && result ? (result.cost === null ? 'No path' : `${result.cost} steps`) : 'Not run'}
            </dd>
          </div>
        </dl>
        <p className={s.srStatus} role="status">
          {status}
        </p>
      </div>
    </div>
  )
}
