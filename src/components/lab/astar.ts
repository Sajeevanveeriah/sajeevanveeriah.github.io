/**
 * Deterministic A* search on a 4-connected occupancy grid.
 *
 * Pure and side-effect free so the same module can run at build time, where
 * the server renders the finished search as the static no-JavaScript
 * fallback, and in the browser, where the widget replays the expansion order
 * step by step. Determinism is load-bearing: ties in f-cost are broken by
 * insertion order, so a given grid always explores in exactly one order and
 * commits exactly one path.
 */

export interface AStarResult {
  /** Cell indices in the exact order the search expanded them. */
  readonly visitedOrder: readonly number[]
  /** Cell indices of the committed path, start to goal. Empty when no path. */
  readonly path: readonly number[]
  /** Number of nodes expanded before the goal was reached or the search died. */
  readonly expanded: number
  /** Path cost in unit steps, or null when the goal is unreachable. */
  readonly cost: number | null
}

export function idx(x: number, y: number, cols: number): number {
  return y * cols + x
}

export function xy(i: number, cols: number): { x: number; y: number } {
  return { x: i % cols, y: Math.floor(i / cols) }
}

/** Manhattan distance: admissible and consistent on a 4-connected grid. */
function heuristic(a: number, b: number, cols: number): number {
  const pa = xy(a, cols)
  const pb = xy(b, cols)
  return Math.abs(pa.x - pb.x) + Math.abs(pa.y - pb.y)
}

export function runAStar(
  cols: number,
  rows: number,
  walls: ReadonlySet<number>,
  start: number,
  goal: number,
): AStarResult {
  const size = cols * rows
  if (
    start < 0 ||
    goal < 0 ||
    start >= size ||
    goal >= size ||
    walls.has(start) ||
    walls.has(goal)
  ) {
    return { visitedOrder: [], path: [], expanded: 0, cost: null }
  }

  const g = new Map<number, number>([[start, 0]])
  const f = new Map<number, number>([[start, heuristic(start, goal, cols)]])
  const cameFrom = new Map<number, number>()
  const closed = new Set<number>()
  const visitedOrder: number[] = []

  /* A plain array scanned for the minimum keeps the implementation obviously
     correct and deterministic; the largest grid the widget offers is a few
     hundred cells, far below where a binary heap would matter. */
  const open: number[] = [start]

  while (open.length > 0) {
    let best = 0
    for (let i = 1; i < open.length; i += 1) {
      const a = open[i] as number
      const b = open[best] as number
      if ((f.get(a) ?? Infinity) < (f.get(b) ?? Infinity)) best = i
    }
    const current = open.splice(best, 1)[0] as number
    if (closed.has(current)) continue
    closed.add(current)
    visitedOrder.push(current)

    if (current === goal) {
      const path: number[] = [current]
      let node = current
      while (cameFrom.has(node)) {
        node = cameFrom.get(node) as number
        path.push(node)
      }
      path.reverse()
      return { visitedOrder, path, expanded: visitedOrder.length, cost: path.length - 1 }
    }

    const { x, y } = xy(current, cols)
    /* Fixed neighbour order (right, down, left, up) is part of the
       deterministic contract. */
    const neighbours: readonly (readonly [number, number])[] = [
      [x + 1, y],
      [x, y + 1],
      [x - 1, y],
      [x, y - 1],
    ]
    for (const [nx, ny] of neighbours) {
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
      const n = idx(nx, ny, cols)
      if (walls.has(n) || closed.has(n)) continue
      const tentative = (g.get(current) ?? Infinity) + 1
      if (tentative < (g.get(n) ?? Infinity)) {
        cameFrom.set(n, current)
        g.set(n, tentative)
        f.set(n, tentative + heuristic(n, goal, cols))
        if (!open.includes(n)) open.push(n)
      }
    }
  }

  return { visitedOrder, path: [], expanded: visitedOrder.length, cost: null }
}

/**
 * The preset obstacle field the lab opens with. Authored, not random, so the
 * first render, the static fallback and every reload agree exactly.
 */
export function presetWalls(cols: number, rows: number): Set<number> {
  const walls = new Set<number>()
  const midX = Math.floor(cols / 2)
  const gapA = Math.floor(rows / 4)
  const gapB = rows - 2
  for (let y = 1; y < rows - 1; y += 1) {
    if (y !== gapA && y !== gapB) walls.add(idx(midX, y, cols))
  }
  const thirdX = Math.floor(cols / 4)
  for (let y = Math.floor(rows / 2); y < rows; y += 1) {
    walls.add(idx(thirdX, y, cols))
  }
  const lastX = Math.floor((cols * 3) / 4)
  for (let y = 0; y < Math.floor(rows / 2); y += 1) {
    walls.add(idx(lastX, y, cols))
  }
  return walls
}
