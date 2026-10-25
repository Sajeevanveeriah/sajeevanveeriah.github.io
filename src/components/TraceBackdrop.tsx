/**
 * Decorative circuit traces along the top of a band: orthogonal routes with
 * 45-degree jogs and vias, and an amber signal travelling each route. Pure SVG
 * and CSS, hidden from assistive technology, and still under reduced motion.
 */
const routes = [
  "M0 22 H210 L232 44 H520 L542 22 H860 L882 44 H1200",
  "M0 58 H120 L142 36 H380 L402 58 H700 L722 80 H1000 L1022 58 H1200",
  "M0 94 H300 L322 72 H610 L632 94 H1200",
  "M440 120 V100 L462 78 H560",
  "M940 0 V14 L962 36 H1100",
]

const vias = [[210, 22], [520, 44], [860, 22], [120, 58], [700, 58], [1000, 80], [300, 94], [610, 72], [560, 78], [1100, 36]]

export function TraceBackdrop() {
  return (
    <svg className="trace-backdrop" viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g className="trace-base">{routes.map((d) => <path key={d} d={d} />)}</g>
      <g className="trace-signal">{routes.map((d, i) => <path key={d} d={d} pathLength={100} style={{ animationDelay: `${i * -1.7}s`, animationDuration: `${7 + (i % 3) * 1.5}s` }} />)}</g>
      <g className="trace-vias">{vias.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" />)}</g>
    </svg>
  )
}
