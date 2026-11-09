import type { ReactNode } from 'react'

/**
 * Diagram kit for the site's figures. A figure is a grid of labelled boxes and
 * the arrows between them, drawn as inline SVG so it takes the page typeface
 * and both colour themes, stays sharp at any size and needs no image request.
 * Every label comes from the project record it illustrates.
 */

const glyphs = {
  chip: 'M7 7h10v10H7z M10 3v4 M14 3v4 M10 17v4 M14 17v4 M3 10h4 M3 14h4 M17 10h4 M17 14h4',
  sensor: 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M8 8a5.5 5.5 0 0 0 0 8 M16 8a5.5 5.5 0 0 1 0 8 M5 5a10 10 0 0 0 0 14 M19 5a10 10 0 0 1 0 14',
  screen: 'M3 5h18v11H3z M9 20h6 M12 16v4',
  doc: 'M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 16h6',
  db: 'M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6 M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3',
  wifi: 'M2 9a15 15 0 0 1 20 0 M5.5 12.5a10 10 0 0 1 13 0 M9 16a5 5 0 0 1 6 0 M12 19.5h.01',
  motor: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M19 5l-2 2 M7 17l-2 2',
  check: 'M4 12l5 5L20 6',
  chart: 'M4 20V4 M4 20h16 M8 16v-5 M12 16V8 M16 16v-8',
  battery: 'M3 8h15v8H3z M21 11v2 M7 11v2 M10 11v2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
  cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
} as const

export type Glyph = keyof typeof glyphs

export interface FigNode {
  readonly id: string
  /** Grid column and row, from zero. */
  readonly c: number
  readonly r: number
  readonly cs?: number
  readonly rs?: number
  /** Title, supporting line and optional small line above the title. */
  readonly t: string
  readonly s?: string
  readonly k?: string
  readonly g?: Glyph
  readonly tone?: 'accent' | 'ghost'
  /** A headline number with its label. */
  readonly big?: boolean
  /** Group name, so a figure can bring one group forward. */
  readonly grp?: string
}

export type FigEdge = readonly [from: string, to: string, options?: { readonly label?: string; readonly dash?: boolean; readonly via?: 'hv' | 'vh' }]

export interface FigSpec {
  /** Text alternative: what the figure shows. */
  readonly label: string
  readonly cols: number
  readonly rows: number
  readonly nodes: readonly FigNode[]
  readonly edges?: readonly FigEdge[]
  readonly note?: string
  readonly w?: number
  readonly h?: number
  /** Height kept clear above the grid for a drawing passed as `extra`. */
  readonly top?: number
  readonly gapX?: number
  readonly gapY?: number
  readonly extra?: ReactNode
}

const PAD = 14

/** Greedy word wrap by estimated glyph width. */
function wrap(text: string, width: number, size: number, factor: number) {
  const limit = Math.max(4, Math.floor(width / (size * factor)))
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > limit) {
      lines.push(line)
      line = word
    } else line = line ? line + ' ' + word : word
  }
  if (line) lines.push(line)
  return lines
}

interface Box { x: number; y: number; w: number; h: number }

function route(a: Box, b: Box, via: 'hv' | 'vh' = 'hv') {
  const acx = a.x + a.w / 2, acy = a.y + a.h / 2, bcx = b.x + b.w / 2, bcy = b.y + b.h / 2
  const top = Math.max(a.y, b.y), bottom = Math.min(a.y + a.h, b.y + b.h)
  const left = Math.max(a.x, b.x), right = Math.min(a.x + a.w, b.x + b.w)
  if (bottom - top > 8 && right - left <= 8) {
    const y = (top + bottom) / 2
    return bcx > acx ? [[a.x + a.w, y], [b.x, y]] : [[a.x, y], [b.x + b.w, y]]
  }
  if (right - left > 8) {
    const x = (left + right) / 2
    return bcy > acy ? [[x, a.y + a.h], [x, b.y]] : [[x, a.y], [x, b.y + b.h]]
  }
  if (via === 'vh') return [[acx, bcy > acy ? a.y + a.h : a.y], [acx, bcy], [bcx > acx ? b.x : b.x + b.w, bcy]]
  return [[bcx > acx ? a.x + a.w : a.x, acy], [bcx, acy], [bcx, bcy > acy ? b.y : b.y + b.h]]
}

function head(points: number[][]) {
  const [x, y] = points.at(-1)!
  const [px, py] = points.at(-2)!
  const len = Math.hypot(x! - px!, y! - py!) || 1
  const ux = (x! - px!) / len, uy = (y! - py!) / len
  const bx = x! - ux * 8, by = y! - uy * 8
  return `${x},${y} ${bx - uy * 4},${by + ux * 4} ${bx + uy * 4},${by - ux * 4}`
}

export function Diagram({ spec, focus, className = '' }: { readonly spec: FigSpec; readonly focus?: string; readonly className?: string }) {
  const W = spec.w ?? 560, H = spec.h ?? 350, top = spec.top ?? 0
  const gapX = spec.gapX ?? 24, gapY = spec.gapY ?? 20, noteH = spec.note ? 30 : 0
  const cellW = (W - 2 * PAD - (spec.cols - 1) * gapX) / spec.cols
  const cellH = (H - 2 * PAD - top - noteH - (spec.rows - 1) * gapY) / spec.rows
  const boxes = new Map<string, Box>()
  for (const n of spec.nodes) {
    const cs = n.cs ?? 1, rs = n.rs ?? 1
    boxes.set(n.id, { x: PAD + n.c * (cellW + gapX), y: PAD + top + n.r * (cellH + gapY), w: cs * cellW + (cs - 1) * gapX, h: rs * cellH + (rs - 1) * gapY })
  }
  const noteLines = spec.note ? wrap(spec.note, W - 2 * PAD, 11.5, 0.5) : []
  return (
    <svg className={`fig ${className}`} viewBox={`0 0 ${W} ${H + Math.max(0, noteLines.length - 2) * 15}`} role="img" aria-label={spec.label}>
      {spec.extra}
      {spec.edges?.map(([from, to, options]) => {
        const a = boxes.get(from), b = boxes.get(to)
        if (!a || !b) throw new Error(`Figure edge ${from} to ${to} names a missing node`)
        const points = route(a, b, options?.via)
        const [mx, my] = [(points[0]![0]! + points[1]![0]!) / 2, (points[0]![1]! + points[1]![1]!) / 2]
        return (
          <g key={`${from}-${to}`}>
            <polyline className={`fig-edge${options?.dash ? ' dash' : ''}`} points={points.map((p) => p.join(',')).join(' ')} />
            <polygon className="fig-head" points={head(points)} />
            {options?.label && <text className="fig-edge-label" x={mx} y={my - 6} textAnchor="middle">{options.label}</text>}
          </g>
        )
      })}
      {spec.nodes.map((n) => {
        const box = boxes.get(n.id)!
        const inner = box.w - 22 - (n.g ? 20 : 0)
        const longest = Math.max(...n.t.split(' ').map((word) => word.length))
        const sub = n.s ? wrap(n.s, box.w - 22, 12.5, 0.5) : []
        const height = (size: number, lines: number) => (n.k ? 15 : 0) + lines * size * 1.15 + (sub.length ? 5 + sub.length * 15.5 : 0)
        // Step the title down until the whole label fits; a label is never cut short.
        let size = Math.min(n.big ? 30 : 17, inner / (longest * 0.58))
        let title = wrap(n.t, inner, size, 0.58)
        while (height(size, title.length) > box.h - 8 && size > 11) {
          size -= 1
          title = wrap(n.t, inner, size, 0.58)
        }
        if (height(size, title.length) > box.h - 4 || sub.some((line) => line.length * 6.25 > box.w - 14)) throw new Error(`Figure label does not fit its box: ${n.t}`)
        let y = box.y + (box.h - height(size, title.length)) / 2
        const x = box.x + 11
        return (
          <g key={n.id} className={`fig-node${n.tone ? ` ${n.tone}` : ''}${focus && n.grp && n.grp !== focus ? ' dim' : ''}`}>
            <rect className="fig-box" x={box.x} y={box.y} width={box.w} height={box.h} />
            {n.g && <path className="fig-glyph" d={glyphs[n.g]} transform={`translate(${box.x + box.w - 27} ${box.y + 8}) scale(0.8)`} />}
            {n.k && <text className="fig-k" x={x} y={(y += 15) - 4}>{n.k}</text>}
            {title.map((line) => <text className="fig-t" key={line} x={x} y={(y += size * 1.15) - size * 0.28} fontSize={size}>{line}</text>)}
            {sub.map((line, index) => <text className="fig-s" key={line + index} x={x} y={(y += 15.5) + 3}>{line}</text>)}
          </g>
        )
      })}
      {noteLines.map((line, index) => <text className="fig-note" key={line} x={PAD} y={H - noteH + 18 + index * 15}>{line}</text>)}
    </svg>
  )
}

/** Horizontal bars against a shared maximum, for a small set of reported counts. */
export function Bars({ x, y, w, title, max, items }: { readonly x: number; readonly y: number; readonly w: number; readonly title: string; readonly max: number; readonly items: readonly { readonly label: string; readonly value: number; readonly accent?: boolean }[] }) {
  const format = new Intl.NumberFormat('en-AU')
  return (
    <g>
      <text className="fig-s" x={x} y={y + 12}>{title}</text>
      {items.map((item, index) => {
        const rowY = y + 28 + index * 46
        return (
          <g key={item.label}>
            <text className="fig-t" x={x} y={rowY + 12} fontSize={14}>{item.label}</text>
            <rect className="fig-track" x={x} y={rowY + 19} width={w} height={14} />
            <rect className={item.accent ? 'fig-fill accent' : 'fig-fill'} x={x} y={rowY + 19} width={(w * item.value) / max} height={14} />
            <text className="fig-t" x={x + w} y={rowY + 12} fontSize={14} textAnchor="end">{format.format(item.value)}</text>
          </g>
        )
      })}
    </g>
  )
}
