import { InView } from '@/components/motion/InView'
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
 * All nine are pure SVG plus CSS keyframes: they server render complete,
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
  | 'knowledge'

/** Which record reads as which idea. Unlisted slugs render no diagram. */
const BY_SLUG: Record<string, DiagramVariant> = {
  'engineering-mastery-lab': 'lattice',
  'veerai-slm': 'knowledge',
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
  /* The seven stages are named here in full. The drawn labels are compacted
     to fit their boxes, so this description is the only place a reader on
     assistive technology meets the complete stage names. */
  knowledge:
    'A closed local pipeline: approved knowledge, governed ingestion, retrieval, local inference, controlled memory and tools, then a grounded response, with evaluation observing the response and feeding back into the system.',
}

/**
 * Variants whose landscape composition cannot survive a phone column.
 *
 * Scaling the drawing to fit a 320px container takes its labels down with it,
 * so the stylesheet grows the type in user units as the container narrows.
 * For a sparse plot that is enough. For these three it is not: they carry
 * long labels inside fixed boxes, and larger type overruns the box and clips
 * at the plate edge. Verified at 390px: "PARAMETRIC CAD" clipped, the four
 * transport nodes running together, "TAGS AND POINTS" overflowing its row.
 * Each one therefore gets a portrait composition that stacks along the axis
 * the phone actually has, rather than a squeezed copy of the wide layout.
 */
function portraitFor(variant: DiagramVariant) {
  switch (variant) {
    case 'lattice':
      return { viewBox: '0 0 360 470', node: <LatticePortrait /> }
    case 'hops':
      return { viewBox: '0 0 360 552', node: <HopsPortrait /> }
    case 'migration':
      return { viewBox: '0 0 360 470', node: <MigrationPortrait /> }
    case 'knowledge':
      return { viewBox: '0 0 360 622', node: <KnowledgePortrait /> }
    default:
      return null
  }
}

/**
 * Variants whose landscape composition needs the switch to happen earlier.
 *
 * The default 560px threshold assumes a label that still fits its box at the
 * 15px step of the ramp. `knowledge` carries seven stages in three columns,
 * so its boxes are 192 units wide and its longest label runs 18 characters:
 * measured, that overruns the box below roughly 620px. Switching this one
 * variant to its portrait composition at 620px keeps the landscape drawing in
 * the band where its labels are verified to fit, rather than widening every
 * other diagram's threshold to suit it.
 */
function switchesEarly(variant: DiagramVariant): boolean {
  return variant === 'knowledge'
}

export function SystemDiagram({
  variant,
  caption,
}: {
  variant: DiagramVariant
  caption?: string
}) {
  const portrait = portraitFor(variant)
  const early = switchesEarly(variant)

  return (
    <InView as="figure" className={s.figure} amount={0.2}>
      {/* The figure carries the description once. Both drawings are hidden
          from assistive technology so the alternate composition is not
          announced twice, and only one is ever painted. */}
      <div className={s.plate} role="img" aria-label={DESCRIPTION[variant]}>
        <svg
          className={`${s.svg} ${portrait ? (early ? s.svgWideEarly : s.svgWide) : ''}`}
          viewBox="0 0 640 300"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {variant === 'lattice' ? <Lattice /> : null}
          {variant === 'occupancy' ? <Occupancy /> : null}
          {variant === 'waveforms' ? <Waveforms /> : null}
          {variant === 'hops' ? <Hops /> : null}
          {variant === 'anomaly' ? <Anomaly /> : null}
          {variant === 'migration' ? <Migration /> : null}
          {variant === 'bus' ? <Bus /> : null}
          {variant === 'runs' ? <Runs /> : null}
          {variant === 'knowledge' ? <Knowledge /> : null}
        </svg>
        {portrait ? (
          <svg
            className={`${s.svg} ${early ? s.svgTallEarly : s.svgTall}`}
            viewBox={portrait.viewBox}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {portrait.node}
          </svg>
        ) : null}
      </div>
      {caption ? <figcaption className={s.caption}>{caption}</figcaption> : null}
    </InView>
  )
}

/* ------------------------------------------------------------------
   Portrait compositions. Same story, stacked down the page.
   ------------------------------------------------------------------ */

/** Core at the top, modules latching on below it in turn. */
function LatticePortrait() {
  const rowY = (i: number) => 150 + i * 78

  return (
    <>
      <rect className={s.core} x="122" y="24" width="116" height="58" rx="14" />
      <text className={s.coreLabel} x="180" y="59" textAnchor="middle">
        Core
      </text>

      {/* One spine, drawn once, that leaves the core and runs down the left
          edge through every module dot. Four separate centre links would
          overdraw each other and cross the box borders and labels. */}
      <path
        className={s.link}
        d={`M 180 82 C 180 110 44 104 44 132 L 44 ${rowY(MODULES.length - 1) + 29}`}
        pathLength={1}
        data-draw=""
      />

      {MODULES.map((mod, i) => {
        const y = rowY(i)
        return (
          <g key={mod.label}>
            <rect className={s.module} x="16" y={y} width="328" height="58" rx="12" />
            <circle
              className={s.moduleDot}
              cx="44"
              cy={y + 29}
              r="7"
              style={{ animationDelay: `${i * 0.4 + 0.5}s` }}
            />
            <text className={s.label} x="70" y={y + 35}>
              {mod.label}
            </text>
          </g>
        )
      })}
    </>
  )
}

/** The transport chain read top to bottom, one hop per row. */
function HopsPortrait() {
  const rowH = 74
  const gap = 34
  const top = 16

  return (
    <>
      {HOPS.map((label, i) => {
        const y = top + i * (rowH + gap)
        return (
          <g key={label}>
            <rect className={s.node} x="16" y={y} width="328" height={rowH} rx="12" />
            <circle
              className={s.nodeDot}
              cx="46"
              cy={y + rowH / 2}
              r="7"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            <text className={s.label} x="74" y={y + rowH / 2 + 6}>
              {label}
            </text>
            {i < HOPS.length - 1 ? (
              <>
                <line
                  className={s.hopLine}
                  x1="46"
                  y1={y + rowH}
                  x2="46"
                  y2={y + rowH + gap}
                />
                <rect
                  className={s.packetV}
                  x="40"
                  y={y + rowH}
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

      {/* Stacked, not merged into one run: at portrait label size a single
          line overruns the 328 unit plate and clips. */}
      <line className={s.axis} x1="16" y1="440" x2="344" y2="440" />
      <text className={s.label} x="16" y="472">
        Capture
      </text>
      <text className={s.label} x="16" y="502">
        Condition and locate
      </text>
      <text className={s.label} x="16" y="532">
        Remote status
      </text>
    </>
  )
}

/** Source above, verified below, one converted item per band. */
function MigrationPortrait() {
  const bandY = (i: number) => 62 + i * 82

  return (
    <>
      <text className={s.columnLabel} x="16" y="30">
        iFIX
      </text>
      <text className={s.columnLabel} x="344" y="30" textAnchor="end">
        PVI+ verified
      </text>

      {MIGRATION_ITEMS.map((item, i) => {
        const y = bandY(i)
        return (
          <g key={item}>
            <rect className={s.row} x="16" y={y} width="248" height="40" rx="8" />
            <text className={s.label} x="34" y={y + 26}>
              {item}
            </text>

            <path
              className={s.convert}
              d={`M 264 ${y + 20} C 282 ${y + 20} 282 ${y + 20} 300 ${y + 20}`}
              pathLength={1}
              data-draw=""
              style={{ animationDelay: `${i * 0.42}s` }}
            />

            <path
              className={s.tick}
              d={`M 308 ${y + 20} l 8 9 l 16 -19`}
              pathLength={1}
              data-draw=""
              style={{ animationDelay: `${i * 0.42 + 0.5}s` }}
            />
          </g>
        )
      })}
    </>
  )
}

/**
 * The seven stages, in order.
 *
 * `label` is the drawn text and `full` is the stage name as written in the
 * record. Two of the seven are compacted for the drawing because the full
 * name overruns its box at the wide end of the label ramp; the full set is
 * announced through the figure's description, so nothing is lost to a reader
 * who cannot see the boxes.
 */
const STAGES = [
  { label: 'Approved knowledge', full: 'Approved knowledge' },
  { label: 'Governed ingestion', full: 'Governed ingestion' },
  { label: 'Retrieval', full: 'Retrieval' },
  { label: 'Local inference', full: 'Local inference' },
  { label: 'Memory and tools', full: 'Controlled memory and tools' },
  { label: 'Grounded response', full: 'Grounded response' },
  { label: 'Evaluation', full: 'Evaluation' },
] as const

/* ------------------------------------------------------------------
   Knowledge: the governed local pipeline, drawn as a closed loop.
   ------------------------------------------------------------------ */

/**
 * Serpentine, not a single run: seven stages laid left to right across the
 * top row and right to left across the middle row, so each box is a third of
 * the plate wide rather than a seventh. At a seventh the labels would be
 * unreadable at every container width.
 */
function Knowledge() {
  const BOX_W = 192
  const BOX_H = 54
  const ROW_A = 24
  const ROW_B = 123
  /** Three columns at 12, 224 and 436. */
  const colX = (c: number) => 12 + c * 212
  /** Centre of the middle column, where the evaluation row sits. */
  const CENTRE = colX(1) + BOX_W / 2

  /** Row A runs left to right, row B runs right to left. */
  const mid = (i: number) => {
    const x = i < 3 ? colX(i) : colX(5 - i)
    const y = i < 3 ? ROW_A : ROW_B
    return { x, y, cx: x + BOX_W / 2, cy: y + BOX_H / 2 }
  }

  return (
    <>
      {/* Chain through the first six stages. Horizontal hops inside a row,
          then one descent at the right edge where the serpentine turns. */}
      {[0, 1, 3, 4].map((i, k) => {
        const a = mid(i)
        const b = mid(i + 1)
        const leftToRight = a.cx < b.cx
        /* Row B runs right to left, so without a head the reader has no way
           to tell which way the chain is travelling along it. */
        const tip = leftToRight ? b.x : b.x + BOX_W
        const back = leftToRight ? tip - 9 : tip + 9
        return (
          <g key={`h-${i}`}>
            <path
              className={s.link}
              d={`M ${leftToRight ? a.x + BOX_W : a.x} ${a.cy} L ${tip} ${b.cy}`}
              pathLength={1}
              data-draw=""
              style={{ animationDelay: `${k * 0.3}s` }}
            />
            <path
              className={s.head}
              d={`M ${back} ${b.cy - 5} L ${tip} ${b.cy} L ${back} ${b.cy + 5}`}
              pathLength={1}
              data-draw=""
              style={{ animationDelay: `${k * 0.3 + 0.2}s` }}
            />
          </g>
        )
      })}

      <path
        className={s.link}
        d={`M ${mid(2).cx} ${ROW_A + BOX_H} L ${mid(3).cx} ${ROW_B}`}
        pathLength={1}
        data-draw=""
        style={{ animationDelay: '0.6s' }}
      />
      <path
        className={s.head}
        d={`M ${mid(3).cx - 5} ${ROW_B - 9} L ${mid(3).cx} ${ROW_B} L ${mid(3).cx + 5} ${
          ROW_B - 9
        }`}
        pathLength={1}
        data-draw=""
        style={{ animationDelay: '0.8s' }}
      />

      {/* Evaluation observes the response, then feeds back into inference.
          Dashed, because it is a check rather than a data hop. */}
      <path
        className={s.loop}
        d={`M ${mid(5).cx} ${ROW_B + BOX_H} C ${mid(5).cx} 210 ${CENTRE - 60} 222 ${CENTRE - 96} 222`}
        fill="none"
        style={{ animationDelay: '1.5s' }}
      />
      <path
        className={s.loop}
        d={`M ${CENTRE + 96} 222 C ${CENTRE + 150} 222 ${mid(3).cx} 214 ${mid(3).cx} ${ROW_B + BOX_H}`}
        fill="none"
        style={{ animationDelay: '1.7s' }}
      />

      {STAGES.slice(0, 6).map((stage, i) => {
        const p = mid(i)
        return (
          <g key={stage.full}>
            <rect className={s.node} x={p.x} y={p.y} width={BOX_W} height={BOX_H} rx="12" />
            <circle
              className={s.nodeDot}
              cx={p.x + 20}
              cy={p.cy}
              r="5"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            <text className={s.label} x={p.x + 38} y={p.cy + 4}>
              {stage.label}
            </text>
          </g>
        )
      })}

      {/* Evaluation sits under the loop, centred, on its own row. */}
      <rect className={s.node} x={colX(1)} y="195" width={BOX_W} height={BOX_H} rx="12" />
      <circle
        className={s.nodeDot}
        cx={colX(1) + 20}
        cy="222"
        r="5"
        style={{ animationDelay: '1.8s' }}
      />
      <text className={s.label} x={colX(1) + 38} y="226">
        {STAGES[6].label}
      </text>

      <text className={s.label} x="12" y="288">
        Local throughout
      </text>
    </>
  )
}

/** The same seven stages read straight down the page, one per row. */
function KnowledgePortrait() {
  const rowH = 62
  const gap = 26
  const top = 16
  const y = (i: number) => top + i * (rowH + gap)

  return (
    <>
      {STAGES.map((stage, i) => (
        <g key={stage.full}>
          <rect className={s.node} x="16" y={y(i)} width="328" height={rowH} rx="12" />
          <circle
            className={s.nodeDot}
            cx="46"
            cy={y(i) + rowH / 2}
            r="7"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
          <text className={s.label} x="74" y={y(i) + rowH / 2 + 6}>
            {stage.label}
          </text>
          {i < STAGES.length - 1 ? (
            <>
              <line
                className={s.hopLine}
                x1="46"
                y1={y(i) + rowH}
                x2="46"
                y2={y(i) + rowH + gap}
              />
              <rect
                className={s.packetV}
                x="40"
                y={y(i) + rowH}
                width="12"
                height="12"
                rx="3"
                style={{ animationDelay: `${i * 0.3}s`, '--hop': `${gap - 12}px` } as never}
              />
            </>
          ) : null}
        </g>
      ))}

      {/* Evaluation feeding back into local inference, up the right margin. */}
      <path
        className={s.loop}
        d={`M 344 ${y(6) + rowH / 2} L 352 ${y(6) + rowH / 2} L 352 ${y(3) + rowH / 2} L 344 ${
          y(3) + rowH / 2
        }`}
        fill="none"
        style={{ animationDelay: '2.1s' }}
      />
    </>
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
