import { Diagram, type FigSpec } from './kit'
import { indexFigures, postFigures, projectFigures } from './specs'
import { experience, site, systemLayers } from '@/content/site'

/** A figure in its sheet frame, with an optional caption line. */
export function Figure({ spec, caption, className = '' }: { readonly spec: FigSpec; readonly caption?: string; readonly className?: string }) {
  return (
    <figure className={`fig-frame ${className}`}>
      <Diagram spec={spec} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export const projectFigure = (slug: string) => projectFigures[slug]
export const indexFigure = (title: string) => indexFigures[title]
export const postFigure = (slug: string) => postFigures[slug]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const stamp = (month: string, year: string) => Number(year) + MONTHS.indexOf(month) / 12

/** Roles drawn to scale on a shared time axis, from the dates in the career record. */
export function CareerChart() {
  const updated = new Date(site.updated)
  const now = updated.getUTCFullYear() + updated.getUTCMonth() / 12
  const rows = experience.map((e) => {
    const match = e.period.match(/^(\w{3}) (\d{4}) - (?:(present)|(\w{3}) (\d{4}))$/)
    if (!match) return { e, start: null, end: now, open: true }
    return { e, start: stamp(match[1]!, match[2]!), end: match[3] ? now : stamp(match[4]!, match[5]!) + 1 / 12, open: Boolean(match[3]) }
  })
  const first = Math.floor(Math.min(...rows.flatMap((row) => (row.start === null ? [] : [row.start]))))
  const last = Math.ceil(now)
  const W = 640, labelW = 214, rowH = 30, top = 30
  const x = (t: number) => labelW + ((t - first) / (last - first)) * (W - labelW - 16)
  const H = top + rows.length * rowH + 34
  const years = Array.from({ length: last - first + 1 }, (_, i) => first + i)
  return (
    <svg className="fig" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Career timeline from ${first}: ${rows.map((row) => `${row.e.organisation}, ${row.e.period}`).join('; ')}.`}>
      {years.map((year) => (
        <g key={year}>
          <path className="fig-grid" d={`M${x(year)} ${top - 6}V${top + rows.length * rowH}`} />
          <text className="fig-s" x={x(year)} y={14} textAnchor="middle">{year}</text>
        </g>
      ))}
      {rows.map((row, index) => {
        const y = top + index * rowH
        return (
          <g key={row.e.role}>
            <text className="fig-t" x={0} y={y + 19} fontSize={13}>{row.e.organisation}</text>
            {row.start === null
              ? <rect className="fig-fill accent" x={x(now) - 6} y={y + 8} width={12} height={12} transform={`rotate(45 ${x(now)} ${y + 14})`} />
              : <rect className={row.open ? 'fig-fill accent' : 'fig-fill'} x={x(row.start)} y={y + 8} width={Math.max(4, x(row.end) - x(row.start))} height={12} />}
          </g>
        )
      })}
      <text className="fig-note" x={0} y={H - 8}>Bars run from the first to the last month of each role. The diamond marks the current role.</text>
    </svg>
  )
}

/** The six system layers as an exploded stack, bottom layer first. */
export function LayerStack() {
  const W = 600, H = 430, cx = 170, half = 150, rise = 34, step = 58
  return (
    <svg className="fig" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Six layers of one system, from the bottom: ${systemLayers.map((layer) => layer.title).join(', ')}.`}>
      {systemLayers.map((layer, index) => {
        const y = H - 60 - index * step
        const top = `${cx - half},${y} ${cx},${y - rise} ${cx + half},${y} ${cx},${y + rise}`
        const side = `${cx - half},${y} ${cx},${y + rise} ${cx + half},${y} ${cx + half},${y + 10} ${cx},${y + rise + 10} ${cx - half},${y + 10}`
        return (
          <g key={layer.index}>
            <polygon className="fig-slab-side" points={side} />
            <polygon className={index === 0 ? 'fig-slab base' : 'fig-slab'} points={top} />
            <path className="fig-edge" d={`M${cx + half} ${y}H${cx + half + 28}`} />
            <text className="fig-k" x={cx + half + 36} y={y - 4}>{layer.index}</text>
            <text className="fig-t" x={cx + half + 36} y={y + 13} fontSize={14}>{layer.title}</text>
          </g>
        )
      })}
    </svg>
  )
}
