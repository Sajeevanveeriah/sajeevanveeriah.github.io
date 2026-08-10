/**
 * A* over a paintable occupancy grid. Pure and deterministic: expansion
 * order is fixed by cost with index tie-breaking, so identical inputs give
 * identical readouts, expansion history and path on every run.
 */

export const GRID_W = 24
export const GRID_H = 16

export type Heuristic = 'manhattan' | 'euclidean' | 'chebyshev'

export interface AstarParams {
  readonly heuristic: Heuristic
  readonly diagonal: boolean
  readonly inflation: number
  /** Obstacle cell indices (y * GRID_W + x). */
  readonly obstacles: readonly number[]
  readonly start: number
  readonly goal: number
}

export interface AstarResult {
  /** Cells in the order A* expanded them. */
  readonly expanded: readonly number[]
  /** Final path from start to goal, empty when unreachable. */
  readonly path: readonly number[]
  /** Cells blocked after inflation, including the painted obstacles. */
  readonly blocked: ReadonlySet<number>
  readonly nodesExpanded: number
  readonly pathCost: number
  readonly pathLength: number
  readonly admissible: boolean
  readonly found: boolean
}

/** The default map: a wall with a gap, a spur and a block, all deterministic. */
export function defaultObstacles(): number[] {
  const cells = new Set<number>()
  const add = (x: number, y: number) => {
    if (x >= 0 && x < GRID_W && y >= 0 && y < GRID_H) cells.add(y * GRID_W + x)
  }
  for (let y = 2; y < 12; y++) add(9, y)
  for (let x = 9; x < 16; x++) add(x, 11)
  for (let y = 6; y < 16; y++) add(16, y)
  for (let x = 3; x < 7; x++) for (let y = 4; y < 6; y++) add(x, y)
  return [...cells]
}

export const ASTAR_START = 13 * GRID_W + 2
export const ASTAR_GOAL = 2 * GRID_W + 21

/**
 * Admissibility is a fact about the movement model, not the run: Manhattan
 * distance overestimates the remaining cost once diagonal steps of cost
 * sqrt(2) are allowed, so that one pairing loses the optimality guarantee.
 */
export function isAdmissible(heuristic: Heuristic, diagonal: boolean): boolean {
  return !(heuristic === 'manhattan' && diagonal)
}

export function runAstar(p: AstarParams): AstarResult {
  const blocked = new Set<number>(p.obstacles)
  // Lethal inflation: cells within Chebyshev radius r of an obstacle are
  // treated as untraversable, the planner seeing the robot as a body.
  for (const c of p.obstacles) {
    const cx = c % GRID_W
    const cy = Math.floor(c / GRID_W)
    for (let dx = -p.inflation; dx <= p.inflation; dx++) {
      for (let dy = -p.inflation; dy <= p.inflation; dy++) {
        const x = cx + dx
        const y = cy + dy
        if (x >= 0 && x < GRID_W && y >= 0 && y < GRID_H) blocked.add(y * GRID_W + x)
      }
    }
  }
  blocked.delete(p.start)
  blocked.delete(p.goal)

  const h = (c: number): number => {
    const dx = Math.abs((c % GRID_W) - (p.goal % GRID_W))
    const dy = Math.abs(Math.floor(c / GRID_W) - Math.floor(p.goal / GRID_W))
    if (p.heuristic === 'manhattan') return dx + dy
    if (p.heuristic === 'euclidean') return Math.hypot(dx, dy)
    return Math.max(dx, dy)
  }

  const g = new Map<number, number>([[p.start, 0]])
  const parent = new Map<number, number>()
  const open: { c: number; f: number; h: number; i: number }[] = [
    { c: p.start, f: h(p.start), h: h(p.start), i: 0 },
  ]
  const closed = new Set<number>()
  const expanded: number[] = []
  let tick = 0

  const SQRT2 = Math.SQRT2
  const moves4 = [
    [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
  ] as const
  const moves8 = [
    ...moves4,
    [1, 1, SQRT2], [1, -1, SQRT2], [-1, 1, SQRT2], [-1, -1, SQRT2],
  ] as const

  while (open.length > 0) {
    // Deterministic extract-min: lowest f, then lowest h, then insertion order.
    let best = 0
    for (let i = 1; i < open.length; i++) {
      const a = open[i]!
      const b = open[best]!
      if (a.f < b.f || (a.f === b.f && (a.h < b.h || (a.h === b.h && a.i < b.i)))) best = i
    }
    const { c } = open.splice(best, 1)[0]!
    if (closed.has(c)) continue
    closed.add(c)
    expanded.push(c)
    if (c === p.goal) break

    const cx = c % GRID_W
    const cy = Math.floor(c / GRID_W)
    for (const [dx, dy, cost] of p.diagonal ? moves8 : moves4) {
      const x = cx + dx
      const y = cy + dy
      if (x < 0 || x >= GRID_W || y < 0 || y >= GRID_H) continue
      const n = y * GRID_W + x
      if (blocked.has(n) || closed.has(n)) continue
      // A diagonal step never cuts a blocked corner.
      if (dx !== 0 && dy !== 0 && (blocked.has(cy * GRID_W + x) || blocked.has(y * GRID_W + cx))) continue
      const ng = (g.get(c) ?? Infinity) + cost
      if (ng < (g.get(n) ?? Infinity)) {
        g.set(n, ng)
        parent.set(n, c)
        open.push({ c: n, f: ng + h(n), h: h(n), i: ++tick })
      }
    }
  }

  const path: number[] = []
  if (closed.has(p.goal)) {
    let c: number | undefined = p.goal
    while (c !== undefined) {
      path.unshift(c)
      c = parent.get(c)
    }
  }

  return {
    expanded,
    path,
    blocked,
    nodesExpanded: expanded.length,
    pathCost: path.length ? Number((g.get(p.goal) ?? 0).toFixed(2)) : 0,
    pathLength: path.length,
    admissible: isAdmissible(p.heuristic, p.diagonal),
    found: path.length > 0,
  }
}

/** The seeded default the lab and its embeds open on. */
export function astarDefaults(): AstarParams {
  return {
    heuristic: 'euclidean',
    diagonal: true,
    inflation: 1,
    obstacles: defaultObstacles(),
    start: ASTAR_START,
    goal: ASTAR_GOAL,
  }
}
