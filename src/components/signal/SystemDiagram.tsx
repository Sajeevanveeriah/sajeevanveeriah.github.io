import s from './SystemDiagram.module.css'

/**
 * Per-record signature diagrams.
 *
 * Every published work record gets its own diagram rather than a repeated
 * reveal, because the interesting thing about each record is different: the
 * rover is a planner, the telemetry platform is a transport chain, the
 * capstone is a set of sensor traces. Each one animates the idea that record
 * is actually about.
 *
 * All eight are pure SVG plus CSS keyframes: they server render complete,
 * need no JavaScript, and collapse to their finished state under reduced
 * motion via the global rule in globals.css plus the per-variant rules in
 * the stylesheet beside this file.
 */

export type DiagramVariant =
  | 'lattice'
  | 'occupancy'
  | 'waveforms'
  | 'hops'
  | 'anomaly'
  | 'migration'
  | 'bus'
  | 'runs'

/** Which record reads as which idea. Unlisted slugs render no diagram. */
const BY_SLUG: Record<string, DiagramVariant> = {
  'engineering-mastery-lab': 'lattice',
  'autonomous-navigation-rover': 'occupancy',
  'ataxia-assessment-device': 'waveforms',
  'iot-monitoring-platform': 'hops',
  'digital-twin-industrial-ai': 'anomaly',
  'jag-smart-factory': 'migration',
  'adas-can-validation': 'bus',
  'emissions-compliance-testing': 'runs',
}

export function diagramFor(slug: string): DiagramVariant | null {
  return BY_SLUG[slug] ?? null
}

const DESCRIPTION: Record<DiagramVariant, string> = {
  lattice:
    'Four workbench modules connected to a shared engineering core, each coming online in turn.',
  occupancy:
    'An occupancy grid with obstacles marked, and a planned route resolved cell by cell across it.',
  waveforms:
    'Three sensor channels acquiring in parallel while a sample cursor advances through the record.',
  hops: 'Data moving from field equipment through a custom board and an edge gateway to a server.',
  anomaly:
    'A process signal running inside its expected band until a deviation is detected and flagged.',
  migration:
    'Application content converted from one supervisory platform to another, each item verified against the validated system.',
  bus: 'Frames moving along a vehicle network while one frame is captured for fault evidence.',
  runs: 'Repeated measurement runs converging inside a tolerance band.',
}

export function SystemDiagram({
  variant,
  caption,
}: {
  variant: DiagramVariant
  caption?: string
}) {
  return (
    <figure className={s.figure}>
      <div className={s.plate}>
        <svg
          className={s.svg}
          viewBox="0 0 640 300"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={DESCRIPTION[variant]}
        >
          {variant === 'lattice' ? <Lattice /> : null}
          {variant === 'occupancy' ? <Occupancy /> : null}
          {variant === 'waveforms' ? <Waveforms /> : null}
          {variant === 'hops' ? <Hops /> : null}
          {variant === 'anomaly' ? <Anomaly /> : null}
          {variant === 'migration' ? <Migration /> : null}
          {variant === 'bus' ? <Bus /> : null}
          {variant === 'runs' ? <Runs /> : null}
        </svg>
      </div>
      {caption ? <figcaption className={s.caption}>{caption}</figcaption> : null}
    </figure>
  )
}

/* ------------------------------------------------------------------
   Lattice: modules coming online around a shared core.
   ------------------------------------------------------------------ */

const MOD_W = 176
const MOD_H = 76

const MODULES = [
  { x: 24, y: 42, label: 'Calculators' },
  { x: 440, y: 42, label: 'Parametric CAD' },
  { x: 24, y: 182, label: 'Guided labs' },
  { x: 440, y: 182, label: 'Evidence' },
] as const

function Lattice() {
  return (
    <>
      <rect className={s.core} x="270" y="120" width="100" height="60" rx="14" />
      <text className={s.coreLabel} x="320" y="155" textAnchor="middle">
        Core
      </text>

      {MODULES.map((mod, i) => {
        const left = mod.x < 320
        const cy = mod.y + MOD_H / 2
        // Start at the module's inner edge, finish at the core's near edge.
        const fromX = left ? mod.x + MOD_W : mod.x
        const toX = left ? 270 : 370
        return (
          <g key={mod.label}>
            <path
              className={s.link}
              d={`M ${fromX} ${cy} L ${toX} 150`}
              pathLength={1}
              data-draw=""
              style={{ animationDelay: `${i * 0.4}s` }}
            />
            <rect className={s.module} x={mod.x} y={mod.y} width={MOD_W} height={MOD_H} rx="12" />
            <circle
              className={s.moduleDot}
              cx={mod.x + 22}
              cy={cy}
              r="5"
              style={{ animationDelay: `${i * 0.4 + 0.5}s` }}
            />
            <text className={s.label} x={mod.x + 40} y={cy + 4}>
              {mod.label}
            </text>
          </g>
        )
      })}
    </>
  )
}

/* ------------------------------------------------------------------
   Occupancy: a grid the planner resolves a route across.
   ------------------------------------------------------------------ */

const GRID_COLS = 16
const GRID_ROWS = 7
const CELL = 36
const OCC_X = 24
const OCC_Y = 30

/** Column, row pairs marked as occupied by the scan. */
const BLOCKED = [
  [3, 1],
  [3, 2],
  [4, 2],
  [7, 4],
  [7, 5],
  [8, 4],
  [11, 1],
  [11, 2],
  [12, 2],
] as const

/** The cells the planner commits to, in order. */
const ROUTE_CELLS = [
  [0, 5],
  [1, 5],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 3],
  [6, 3],
  [7, 2],
  [8, 2],
  [9, 2],
  [10, 3],
  [11, 4],
  [12, 4],
  [13, 3],
  [14, 2],
  [15, 1],
] as const

function Occupancy() {
  const cx = (c: number) => OCC_X + c * CELL
  const cy = (r: number) => OCC_Y + r * CELL
  const routePath = ROUTE_CELLS.map(
    ([c, r], i) => `${i === 0 ? 'M' : 'L'} ${cx(c) + CELL / 2} ${cy(r) + CELL / 2}`,
  ).join(' ')

  return (
    <>
      {Array.from({ length: GRID_ROWS }).map((_, r) =>
        Array.from({ length: GRID_COLS }).map((__, c) => (
          <rect
            key={`${c}-${r}`}
            className={s.cell}
            x={cx(c)}
            y={cy(r)}
            width={CELL - 3}
            height={CELL - 3}
            rx="3"
          />
        )),
      )}

      {BLOCKED.map(([c, r], i) => (
        <rect
          key={`b-${c}-${r}`}
          className={s.cellBlocked}
          x={cx(c)}
          y={cy(r)}
          width={CELL - 3}
          height={CELL - 3}
          rx="3"
          style={{ animationDelay: `${0.2 + i * 0.07}s` }}
        />
      ))}

      {ROUTE_CELLS.map(([c, r], i) => (
        <rect
          key={`r-${c}-${r}`}
          className={s.cellRoute}
          x={cx(c)}
          y={cy(r)}
          width={CELL - 3}
          height={CELL - 3}
          rx="3"
          style={{ animationDelay: `${1 + i * 0.09}s` }}
        />
      ))}

      <path className={s.routeLine} d={routePath} pathLength={1} data-draw="" />
      <path className={s.routePulse} d={routePath} pathLength={1} />
    </>
  )
}

/* ------------------------------------------------------------------
   Waveforms: three channels acquiring in parallel.
   ------------------------------------------------------------------ */

const TRACES = [
  {
    label: 'IMU',
    d: 'M 90 72 C 130 40 150 104 190 72 C 230 40 250 104 290 72 C 330 44 350 100 390 72 C 430 46 450 98 490 72 C 520 54 560 84 600 72',
  },
  {
    label: 'ToF',
    d: 'M 90 150 L 150 150 L 170 122 L 250 122 L 268 168 L 350 168 L 368 132 L 450 132 L 468 158 L 540 158 L 558 142 L 600 142',
  },
  {
    label: 'Hall',
    d: 'M 90 236 C 120 236 120 206 150 206 C 180 206 180 250 210 250 C 240 250 240 210 270 210 C 300 210 300 246 330 246 C 360 246 360 208 390 208 C 420 208 420 248 450 248 C 480 248 480 212 510 212 C 540 212 550 236 600 236',
  },
] as const

function Waveforms() {
  return (
    <>
      {TRACES.map((t, i) => (
        <g key={t.label}>
          <line className={s.axis} x1="90" y1={72 + i * 78} x2="612" y2={72 + i * 78} />
          <text className={s.label} x="24" y={76 + i * 78}>
            {t.label}
          </text>
          <path
            className={s.trace}
            d={t.d}
            pathLength={1}
            data-draw=""
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        </g>
      ))}
      <g className={s.cursor}>
        <line x1="0" y1="24" x2="0" y2="278" />
        <circle cx="0" cy="24" r="4" />
      </g>
    </>
  )
}

/* ------------------------------------------------------------------
   Hops: field equipment to custom board to gateway to server.
   ------------------------------------------------------------------ */

const HOPS = ['Equipment CAN', 'Custom PCB', 'Edge gateway', 'Linux server'] as const

function Hops() {
  const width = 124
  const gap = 36
  const startX = 16
  const y = 62

  return (
    <>
      {HOPS.map((label, i) => {
        const x = startX + i * (width + gap)
        return (
          <g key={label}>
            <rect className={s.node} x={x} y={y} width={width} height={96} rx="12" />
            <circle
              className={s.nodeDot}
              cx={x + width / 2}
              cy={y + 34}
              r="6"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            <text className={s.label} x={x + width / 2} y={y + 70} textAnchor="middle">
              {label}
            </text>
            {i < HOPS.length - 1 ? (
              <>
                <line
                  className={s.hopLine}
                  x1={x + width}
                  y1={y + 48}
                  x2={x + width + gap}
                  y2={y + 48}
                />
                <rect
                  className={s.packet}
                  x={x + width}
                  y={y + 42}
                  width="12"
                  height="12"
                  rx="3"
                  style={{ animationDelay: `${i * 0.6}s`, '--hop': `${gap - 12}px` } as never}
                />
              </>
            ) : null}
          </g>
        )
      })}
      <line className={s.axis} x1="16" y1="216" x2="624" y2="216" />
      <text className={s.label} x="16" y="246">
        Capture
      </text>
      <text className={s.label} x="320" y="246" textAnchor="middle">
        Condition and locate
      </text>
      <text className={s.label} x="624" y="246" textAnchor="end">
        Remote status
      </text>
    </>
  )
}

/* ------------------------------------------------------------------
   Anomaly: a process signal leaving its expected band.
   ------------------------------------------------------------------ */

const SIGNAL =
  'M 40 170 L 88 158 L 136 176 L 184 160 L 232 172 L 280 156 L 328 174 L 376 62 L 424 166 L 472 158 L 520 172 L 568 160 L 608 168'

function Anomaly() {
  return (
    <>
      <rect className={s.band} x="40" y="140" width="568" height="52" rx="8" />
      <line className={s.axis} x1="40" y1="140" x2="608" y2="140" />
      <line className={s.axis} x1="40" y1="192" x2="608" y2="192" />
      <text className={s.label} x="40" y="128">
        Expected band
      </text>

      <path className={s.trace} d={SIGNAL} pathLength={1} data-draw="" />

      <circle className={s.flagRing} cx="376" cy="62" r="14" />
      <circle className={s.flagDot} cx="376" cy="62" r="5" />
      <line className={s.flagStem} x1="376" y1="76" x2="376" y2="140" />
      <text className={s.flagLabel} x="398" y="58">
        Deviation flagged
      </text>

      <text className={s.label} x="40" y="244">
        Predictive maintenance and OEE follow the same signal
      </text>
    </>
  )
}

/* ------------------------------------------------------------------
   Migration: application content converted and verified.
   ------------------------------------------------------------------ */

const MIGRATION_ITEMS = ['Graphics', 'Tags and points', 'Alarms', 'Trends', 'Scripts'] as const

function Migration() {
  const rowY = (i: number) => 62 + i * 46

  return (
    <>
      <text className={s.columnLabel} x="24" y="36">
        iFIX
      </text>
      <text className={s.columnLabel} x="386" y="36">
        PVI+ verified
      </text>

      {MIGRATION_ITEMS.map((item, i) => (
        <g key={item}>
          <rect className={s.row} x="24" y={rowY(i) - 18} width="188" height="34" rx="8" />
          <text className={s.label} x="42" y={rowY(i) + 4}>
            {item}
          </text>

          <path
            className={s.convert}
            d={`M 212 ${rowY(i)} C 280 ${rowY(i)} 318 ${rowY(i)} 386 ${rowY(i)}`}
            pathLength={1}
            data-draw=""
            style={{ animationDelay: `${i * 0.42}s` }}
          />

          <rect className={s.row} x="386" y={rowY(i) - 18} width="188" height="34" rx="8" />
          <text className={s.label} x="404" y={rowY(i) + 4}>
            {item}
          </text>

          <path
            className={s.tick}
            d={`M 590 ${rowY(i)} l 6 7 l 12 -15`}
            pathLength={1}
            data-draw=""
            style={{ animationDelay: `${i * 0.42 + 0.5}s` }}
          />
        </g>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------
   Bus: frames on a vehicle network, one captured.
   ------------------------------------------------------------------ */

function Bus() {
  return (
    <>
      <line className={s.busLine} x1="0" y1="112" x2="640" y2="112" />
      <line className={s.busLine} x1="0" y1="188" x2="640" y2="188" />

      <g className={s.busTrain}>
        {Array.from({ length: 14 }).map((_, i) => (
          <rect
            key={i}
            className={s.frame}
            x={i * 96}
            y="128"
            width="72"
            height="44"
            rx="6"
            data-flag={i % 5 === 3 ? '' : undefined}
          />
        ))}
      </g>

      <rect className={s.captureWindow} x="266" y="112" width="108" height="76" rx="8" />
      <line className={s.captureStem} x1="320" y1="188" x2="320" y2="232" />
      <text className={s.flagLabel} x="320" y="252" textAnchor="middle">
        Trace captured for evidence
      </text>
      <text className={s.label} x="24" y="72">
        CAN and CAN FD
      </text>
    </>
  )
}

/* ------------------------------------------------------------------
   Runs: repeated measurements converging inside tolerance.
   ------------------------------------------------------------------ */

const RUN_VALUES = [0.62, -0.44, 0.28, -0.2, 0.14, -0.1, 0.07] as const

function Runs() {
  const baseline = 158
  const spread = 74

  return (
    <>
      <rect className={s.band} x="40" y={baseline - 22} width="568" height="44" rx="8" />
      <line className={s.axisStrong} x1="40" y1={baseline} x2="608" y2={baseline} />
      <text className={s.label} x="40" y={baseline - 34}>
        Tolerance
      </text>

      {RUN_VALUES.map((v, i) => {
        const x = 78 + i * 78
        const y = baseline + v * spread
        return (
          <g key={i} className={s.run} style={{ animationDelay: `${i * 0.22}s` }}>
            <line className={s.runStem} x1={x} y1={baseline} x2={x} y2={y} />
            <circle className={s.runDot} cx={x} cy={y} r="6" />
            <text className={s.runLabel} x={x} y="272" textAnchor="middle">
              {`Run ${i + 1}`}
            </text>
          </g>
        )
      })}
    </>
  )
}
