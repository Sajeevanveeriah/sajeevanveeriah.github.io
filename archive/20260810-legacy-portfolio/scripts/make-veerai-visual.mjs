#!/usr/bin/env node
/**
 * Author the VeerAI project visual and emit the PNG, AVIF and WebP the
 * portfolio serves.
 *
 * The other case-study images are photographs and renders supplied as files.
 * This one is drawn here, so the committed asset has a source rather than
 * being an opaque binary nobody can regenerate or adjust. Run it and the three
 * files in public/assets/image are rewritten in place.
 *
 * The drawing is conceptual. Scattered approved-knowledge tokens converge on a
 * layered local core, and a smaller ordered set leaves it and resolves into a
 * written grounded result. Nothing in it depicts a measured architecture, a
 * layer count, a model, a component or a metric, because none of that is
 * published on the VeerAI record. See the record's header comment in
 * src/content/projects.ts for why.
 *
 * Output is deterministic: the PRNG is seeded, no clock or Math.random is
 * read, and every coordinate is rounded before it reaches the markup. Re-running
 * reproduces the committed bytes exactly, which `--check` asserts.
 *
 *   node scripts/make-veerai-visual.mjs           rewrite the three assets
 *   node scripts/make-veerai-visual.mjs --check    verify, write nothing
 *
 * Colours are the Signal Path palette. Keep them in step with globals.css if
 * the palette moves.
 */
import sharp from 'sharp'
import { writeFile, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'image')
const STEM = '20260802-VeerAI-SLM-Project-Visual-Rev00'
const CHECK = process.argv.includes('--check')

const W = 1672
const H = 941

/* Deterministic PRNG so the drawing is reproducible byte for byte. */
let seed = 20260802
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

const INK = '#0D0D0F'
const SECOND = '#4E4E57'
const ACCENT = '#0B5CD5'
const ACCENT_DEEP = '#0846A6'
const ACCENT_LIFT = '#1F6FE0'
const LINE = '#D9D9DE'
const EDGE = '#E6E6EA'
const BG = '#F2F2F1'

const defs = []
const out = []
const push = (s) => out.push(s)

let uid = 0
const nextId = () => `v${uid++}`
const n = (v) => Number(v.toFixed(2))

/* ---- Isometric primitives -------------------------------------------- */

/**
 * Rounded rhombus, the isometric projection of a rounded square.
 *
 * Each vertex is cut back along both adjacent edges and reconnected through a
 * quadratic, which gives the slabs their soft silhouette rather than four
 * hard isometric points.
 */
function roundedRhombus(cx, cy, w, h, k = 0.14) {
  const pts = [
    [cx - w, cy],
    [cx, cy - h],
    [cx + w, cy],
    [cx, cy + h],
  ]
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

  let d = ''
  for (let i = 0; i < 4; i++) {
    const prev = pts[(i + 3) % 4]
    const cur = pts[i]
    const next = pts[(i + 1) % 4]
    const inPt = lerp(cur, prev, k)
    const outPt = lerp(cur, next, k)
    d += i === 0 ? `M ${n(inPt[0])} ${n(inPt[1])} ` : `L ${n(inPt[0])} ${n(inPt[1])} `
    d += `Q ${n(cur[0])} ${n(cur[1])} ${n(outPt[0])} ${n(outPt[1])} `
  }
  return `${d}Z`
}

/**
 * One slab: a rounded-square top face extruded downward by `t`.
 *
 * The silhouette is a clip path holding the top rhombus, the bottom rhombus
 * and the band between them. Both side faces are drawn oversized inside that
 * clip, so the extrusion inherits the rounded outline instead of reverting to
 * hard corners at the left, bottom and right vertices.
 */
function slab(cx, cy, w, h, t, cTop, cLeft, cRight, extra = '') {
  const id = nextId()
  const top = roundedRhombus(cx, cy, w, h)
  const bottom = roundedRhombus(cx, cy + t, w, h)
  const band =
    `M ${n(cx - w)} ${n(cy)} L ${n(cx)} ${n(cy + h)} L ${n(cx + w)} ${n(cy)} ` +
    `L ${n(cx + w)} ${n(cy + t)} L ${n(cx)} ${n(cy + h + t)} L ${n(cx - w)} ${n(cy + t)} Z`

  defs.push(
    `<clipPath id="${id}"><path d="${top}"/><path d="${bottom}"/><path d="${band}"/></clipPath>`,
  )

  push(`<g clip-path="url(#${id})">`)
  push(
    `<path d="M ${n(cx - w - 4)} ${n(cy - 4)} L ${n(cx)} ${n(cy + h + 4)} ` +
      `L ${n(cx)} ${n(cy + h + t + 8)} L ${n(cx - w - 4)} ${n(cy + t + 8)} Z" fill="${cLeft}"/>`,
  )
  push(
    `<path d="M ${n(cx + w + 4)} ${n(cy - 4)} L ${n(cx)} ${n(cy + h + 4)} ` +
      `L ${n(cx)} ${n(cy + h + t + 8)} L ${n(cx + w + 4)} ${n(cy + t + 8)} Z" fill="${cRight}"/>`,
  )
  if (extra) push(extra)
  push(`<path d="${top}" fill="${cTop}"/>`)
  push(`</g>`)
}

/** Evenly spaced vertical fins down both visible side faces. */
function fins(cx, cy, w, h, t, colour, count) {
  const parts = []
  for (let i = 1; i < count; i++) {
    const p = i / count
    const lx = cx - w + p * w
    const ly = cy + p * h
    parts.push(
      `<line x1="${n(lx)}" y1="${n(ly)}" x2="${n(lx)}" y2="${n(ly + t + 8)}" stroke="${colour}" stroke-width="3" opacity="0.5"/>`,
    )
    const rx = cx + w - p * w
    parts.push(
      `<line x1="${n(rx)}" y1="${n(ly)}" x2="${n(rx)}" y2="${n(ly + t + 8)}" stroke="${colour}" stroke-width="3" opacity="0.34"/>`,
    )
  }
  return parts.join('')
}

/** Small isometric cube used for one token. */
function cube(cx, cy, r, top, left, right) {
  const h = r * 0.5
  const d = r * 0.7
  push(
    `<path d="M ${n(cx - r)} ${n(cy)} L ${n(cx)} ${n(cy - h)} L ${n(cx + r)} ${n(cy)} L ${n(cx)} ${n(cy + h)} Z" fill="${top}"/>` +
      `<path d="M ${n(cx - r)} ${n(cy)} L ${n(cx)} ${n(cy + h)} L ${n(cx)} ${n(cy + h + d)} L ${n(cx - r)} ${n(cy + d)} Z" fill="${left}"/>` +
      `<path d="M ${n(cx + r)} ${n(cy)} L ${n(cx)} ${n(cy + h)} L ${n(cx)} ${n(cy + h + d)} L ${n(cx + r)} ${n(cy + d)} Z" fill="${right}"/>`,
  )
}

const CUBE_STYLES = [
  ['#FFFFFF', '#EAEAEE', '#D8D8DD'],
  ['#FFFFFF', '#EAEAEE', '#D8D8DD'],
  ['#6A6A73', '#4A4A53', '#33333A'],
  ['#33333A', '#212127', INK],
  [ACCENT_LIFT, ACCENT, ACCENT_DEEP],
  ['#D8D8DD', '#C4C4CA', '#B0B0B7'],
]

/* ---- Canvas ----------------------------------------------------------- */

push(`<rect width="${W}" height="${H}" fill="${BG}"/>`)

/** A quiet dotted ground either side of the core. */
function dotField(x0, y0, cols, rows, sx, sy) {
  const parts = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      parts.push(`<circle cx="${x0 + c * sx}" cy="${y0 + r * sy}" r="1.7" fill="${LINE}"/>`)
    }
  }
  push(parts.join(''))
}
dotField(474, 350, 12, 15, 13.5, 13.5)
dotField(1040, 350, 12, 15, 13.5, 13.5)

/* ---- Flow lines ------------------------------------------------------- */

const CORE_X = 836
const CORE_W = 196
const CORE_H = 82

/* Inbound: scattered approved sources converging on the core. */
const IN_Y = [400, 432, 464, 496, 528]
for (let i = 0; i < IN_Y.length; i++) {
  const y = IN_Y[i]
  const ty = 400 + i * 24
  const accent = i === 0 || i === 3
  push(
    `<path d="M 0 ${y} L 280 ${y} C 420 ${y} 480 ${ty} 620 ${ty} L ${CORE_X - CORE_W - 10} ${ty}" ` +
      `fill="none" stroke="${accent ? ACCENT : LINE}" stroke-width="${accent ? 1.7 : 1.3}"/>`,
  )
  push(
    `<circle cx="${CORE_X - CORE_W - 10}" cy="${ty}" r="3.6" fill="${accent ? ACCENT : SECOND}" opacity="${accent ? 1 : 0.55}"/>`,
  )
}

/* Outbound: a smaller ordered set leaving the core for the result. */
const OUT_Y = [400, 424, 448, 472]
for (let i = 0; i < OUT_Y.length; i++) {
  const ty = OUT_Y[i]
  const y = 408 + i * 30
  const accent = i === 0 || i === 2
  push(
    `<path d="M ${CORE_X + CORE_W + 10} ${ty} L 1120 ${ty} C 1250 ${ty} 1300 ${y} 1420 ${y} L ${W} ${y}" ` +
      `fill="none" stroke="${accent ? ACCENT : LINE}" stroke-width="${accent ? 1.7 : 1.3}"/>`,
  )
  push(
    `<circle cx="${CORE_X + CORE_W + 10}" cy="${ty}" r="3.6" fill="${accent ? ACCENT : SECOND}" opacity="${accent ? 1 : 0.55}"/>`,
  )
}

/* ---- Scattered input tokens ------------------------------------------- */

for (let i = 0; i < 44; i++) {
  const x = 14 + rnd() * 430
  const y = 336 + rnd() * 250
  const r = 10 + rnd() * 5
  const st = CUBE_STYLES[Math.floor(rnd() * CUBE_STYLES.length)]
  cube(x, y, r, st[0], st[1], st[2])
}

/* ---- The local core ---------------------------------------------------- */

/* Flat contact shadow. No glow. */
push(`<ellipse cx="${CORE_X}" cy="672" rx="236" ry="26" fill="#E7E7E6"/>`)

/* Base plate, tucked directly beneath the stack. */
slab(CORE_X, 566, 226, 95, 15, '#F0F0F2', '#DFDFE3', '#D0D0D6')

const LAYERS = [
  { kind: 'white', t: 42, gap: 12 },
  { kind: 'dark', t: 15, gap: 0 },
  { kind: 'blue', t: 50, gap: 0 },
  { kind: 'dark', t: 15, gap: 0 },
  { kind: 'blue', t: 50, gap: 0 },
  { kind: 'dark', t: 15, gap: 0 },
]

let cy = 350
const drawn = []
for (const layer of LAYERS) {
  drawn.push({ ...layer, cy })
  cy += layer.t + layer.gap
}

/* Bottom up, so each slab overlaps the one beneath it correctly. */
for (let i = drawn.length - 1; i >= 0; i--) {
  const l = drawn[i]
  if (l.kind === 'white') {
    slab(CORE_X, l.cy, CORE_W, CORE_H, l.t, '#FFFFFF', '#EBEBEF', '#DADADF')
    /* A small textured plate on the top face. The core has a face, not a mark. */
    const px = CORE_X
    const py = l.cy
    push(
      `<path d="${roundedRhombus(px, py, 66, 27, 0.2)}" fill="none" stroke="${EDGE}" stroke-width="2"/>`,
    )
    const rows = []
    for (let k = 1; k < 9; k++) {
      const p = k / 9
      rows.push(
        `<line x1="${n(px - 60 + p * 58)}" y1="${n(py + p * 24)}" x2="${n(px + p * 58)}" y2="${n(py - 24 + p * 24)}" stroke="${EDGE}" stroke-width="1.7"/>`,
      )
    }
    push(rows.join(''))
  } else if (l.kind === 'dark') {
    slab(CORE_X, l.cy, CORE_W - 4, CORE_H - 2, l.t, '#2E2E35', '#1C1C21', INK)
  } else {
    slab(
      CORE_X,
      l.cy,
      CORE_W - 1,
      CORE_H,
      l.t,
      ACCENT_LIFT,
      ACCENT,
      ACCENT_DEEP,
      fins(CORE_X, l.cy, CORE_W - 1, CORE_H, l.t, '#08387E', 28),
    )
  }
}

/* ---- Intermediate tokens on the output side ---------------------------- */

for (let i = 0; i < 13; i++) {
  const x = 1176 + rnd() * 140
  const y = 392 + rnd() * 120
  const r = 11 + rnd() * 4
  const st = CUBE_STYLES[Math.floor(rnd() * CUBE_STYLES.length)]
  cube(x, y, r, st[0], st[1], st[2])
}

/* ---- The grounded result ----------------------------------------------- */

const DX = 1436
const DY = 388
const DW = 186
const DH = 154
push(`<rect x="${DX}" y="${DY}" width="${DW}" height="${DH}" rx="22" fill="#FFFFFF"/>`)
push(
  `<path d="M ${DX + 10} ${DY + DH} h ${DW - 20} a 12 12 0 0 1 -12 12 h ${-(DW - 44)} a 12 12 0 0 1 -12 -12 z" fill="#E4E4E3"/>`,
)
push(`<rect x="${DX + 26}" y="${DY + 30}" width="${DW - 52}" height="7" rx="3.5" fill="${ACCENT}"/>`)
for (let i = 0; i < 5; i++) {
  const w = i === 4 ? DW - 100 : DW - 52
  push(
    `<rect x="${DX + 26}" y="${DY + 60 + i * 19}" width="${w}" height="5" rx="2.5" fill="#C6C6CC"/>`,
  )
}

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<defs>${defs.join('')}</defs>${out.join('')}</svg>`

/* Rasterise at the intrinsic size the record declares. librsvg scales by
   density, so the explicit resize is what pins the output to 1672 x 941
   rather than whatever the DPI assumption produces. */
const png = await sharp(Buffer.from(svg), { density: 96 })
  .resize(W, H, { fit: 'fill' })
  .png({ compressionLevel: 9 })
  .toBuffer()

/* Same settings as scripts/convert-images.mjs, so this asset compresses like
   every other one rather than drifting to its own quality. */
const avif = await sharp(png).avif({ quality: 55, effort: 6 }).toBuffer()
const webp = await sharp(png).webp({ quality: 78, effort: 5 }).toBuffer()

const built = { png, avif, webp }
const kb = (b) => `${(b.length / 1024).toFixed(0)} KB`

if (CHECK) {
  let drift = 0
  for (const [ext, buffer] of Object.entries(built)) {
    const path = join(DIR, `${STEM}.${ext}`)
    let committed
    try {
      committed = await readFile(path)
    } catch {
      console.log(`  MISSING  ${STEM}.${ext}`)
      drift++
      continue
    }
    const same = committed.equals(buffer)
    if (!same) drift++
    console.log(
      `  ${same ? 'MATCH   ' : 'DRIFT   '} ${STEM}.${ext}  ` +
        `committed ${kb(committed)}  rebuilt ${kb(buffer)}`,
    )
  }
  if (drift > 0) {
    console.error(
      `\n${drift} asset(s) differ from a fresh build. Either the generator changed ` +
        `and the assets were not regenerated, or the assets were edited by hand.`,
    )
    process.exit(1)
  }
  console.log('\nVeerAI visual reproduces the committed bytes exactly.')
} else {
  for (const [ext, buffer] of Object.entries(built)) {
    await writeFile(join(DIR, `${STEM}.${ext}`), buffer)
    console.log(`  wrote ${STEM}.${ext}  ${kb(buffer)}`)
  }
  const { width, height } = await sharp(join(DIR, `${STEM}.png`)).metadata()
  console.log(`\n${width} x ${height}, matching the record's declared intrinsic size.`)
}
