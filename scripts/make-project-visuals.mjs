#!/usr/bin/env node
/**
 * Author the four current-project visuals and emit the PNG, AVIF and WebP the
 * portfolio serves, following the workflow scripts/make-veerai-visual.mjs
 * established: the committed asset has a source rather than being an opaque
 * binary nobody can regenerate or adjust.
 *
 * Four stems, one drawing each, all 2048 x 1152:
 *   20260806-Upzy-Supervised-Routine-Companion-Rev00
 *   20260806-SWL-Pricing-Inventory-Control-Rev00
 *   20260806-Inventory-Scanning-Mobile-Robot-Rev00
 *   20260806-Education-Testing-Robot-Rev00
 *
 * Every drawing is conceptual. Nothing depicts a measured architecture, a
 * component selection, a vendor, a sensor suite or a metric, because none of
 * that is published on the records. See each record's header comment in
 * src/content/projects.ts.
 *
 * Output is deterministic: no clock or Math.random is read and every
 * coordinate is literal or derived from literals, so re-running reproduces
 * the committed bytes exactly, which `--check` asserts.
 *
 *   node scripts/make-project-visuals.mjs           rewrite the assets
 *   node scripts/make-project-visuals.mjs --check   verify, write nothing
 *
 * Colours are the Signal Path palette. Keep them in step with globals.css if
 * the palette moves.
 */
import sharp from 'sharp'
import { writeFile, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'image')
const CHECK = process.argv.includes('--check')

const W = 2048
const H = 1152

const SECOND = '#4E4E57'
const ACCENT = '#0B5CD5'
const ACCENT_DEEP = '#0846A6'
const ACCENT_LIFT = '#1F6FE0'
const LINE = '#D9D9DE'
const EDGE = '#E6E6EA'
const BG = '#F2F2F1'
const SURFACE = '#FFFFFF'
const TINT = '#E9E9EC'
const SHADOW = '#E2E2E1'

const n = (v) => Number(v.toFixed(2))

/** Rounded rectangle path element. */
const rr = (x, y, w, h, r, fill, extra = '') =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}" fill="${fill}" ${extra}/>`

const lineEl = (x1, y1, x2, y2, stroke, sw, extra = '') =>
  `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`

const circle = (cx, cy, r, fill, extra = '') =>
  `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}" ${extra}/>`

/** Flat contact shadow under an object. */
const ground = (cx, cy, rx, ry = 22) =>
  `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${SHADOW}"/>`

/** A quiet dotted field, the same ambient ground the VeerAI visual uses. */
function dotField(x0, y0, cols, rows, sx, sy) {
  const parts = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      parts.push(circle(x0 + c * sx, y0 + r * sy, 2.2, LINE))
    }
  }
  return parts.join('')
}

/** Abstract text lines inside a card. */
function textLines(x, y, w, rows, gap = 26, fill = '#C6C6CC') {
  const parts = []
  for (let i = 0; i < rows; i++) {
    const width = i === rows - 1 ? w * 0.62 : w
    parts.push(rr(x, y + i * gap, width, 7, 3.5, fill))
  }
  return parts.join('')
}

/** A small table card: header bar, then striped rows. */
function tableCard(x, y, w, h, accentHeader) {
  const parts = [rr(x + 8, y + 10, w, h, 18, SHADOW), rr(x, y, w, h, 18, SURFACE)]
  parts.push(rr(x + 24, y + 22, 34, 34, 8, accentHeader ? ACCENT : SECOND))
  parts.push(rr(x + 74, y + 32, w * 0.4, 9, 4.5, '#B9B9BF'))
  const rows = Math.floor((h - 90) / 34)
  for (let i = 0; i < rows; i++) {
    const ry = y + 78 + i * 34
    parts.push(circle(x + 34, ry + 8, 6, '#C6C6CC'))
    parts.push(rr(x + 56, ry + 3, w - 90, 10, 5, i % 2 === 0 ? TINT : '#F0F0F3'))
    const cell = x + 56 + ((i * 37) % (w - 220))
    parts.push(rr(cell, ry + 3, 64, 10, 5, i % 3 === 0 ? '#BFC9DC' : '#D3D3D8'))
  }
  return parts.join('')
}

/** Blue routed connector with an arrow head, orthogonal segments. */
function route(points, sw = 7) {
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${n(p[0])} ${n(p[1])}`).join(' ')
  const [ax, ay] = points[points.length - 1]
  const [bx, by] = points[points.length - 2]
  const horiz = Math.abs(ax - bx) >= Math.abs(ay - by)
  const s = 18
  const head = horiz
    ? `M ${n(ax - Math.sign(ax - bx) * s)} ${n(ay - s * 0.7)} L ${n(ax)} ${n(ay)} L ${n(ax - Math.sign(ax - bx) * s)} ${n(ay + s * 0.7)}`
    : `M ${n(ax - s * 0.7)} ${n(ay - Math.sign(ay - by) * s)} L ${n(ax)} ${n(ay)} L ${n(ax + s * 0.7)} ${n(ay - Math.sign(ay - by) * s)}`
  return (
    `<path d="${d}" fill="none" stroke="${ACCENT}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${head}" fill="none" stroke="${ACCENT}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
  )
}

const svgDoc = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
  `<rect width="${W}" height="${H}" fill="${BG}"/>${body}</svg>`

/* =====================================================================
   1. Upzy: a small friendly tabletop routine companion with a simple
      display and physical response controls in a calm supervised home
      setting.
   ===================================================================== */
function drawUpzy() {
  const p = []

  /* Calm home setting: a table line and two quiet background objects. */
  p.push(rr(0, 878, W, 274, 0, '#EAEAE8'))
  p.push(lineEl(0, 878, W, 878, LINE, 3))
  p.push(rr(268, 560, 190, 318, 26, TINT))
  p.push(rr(300, 480, 22, 96, 10, '#D3D3D8'))
  p.push(rr(346, 452, 22, 124, 10, '#C9C9CF'))
  p.push(rr(1620, 606, 210, 272, 26, TINT))
  p.push(rr(1668, 520, 26, 104, 12, '#D3D3D8'))
  p.push(dotField(560, 250, 14, 6, 26, 26))
  p.push(dotField(1330, 300, 10, 5, 26, 26))

  /* The companion device. */
  const cx = 1024
  p.push(ground(cx, 900, 330, 30))

  /* Base foot, body, top button. */
  p.push(rr(cx - 310, 812, 620, 74, 34, '#3A3A41'))
  p.push(rr(cx - 320, 320, 640, 530, 96, SURFACE))
  p.push(rr(cx - 320, 320, 640, 530, 96, 'none', `stroke="${EDGE}" stroke-width="3"`))
  p.push(rr(cx - 96, 282, 192, 68, 34, ACCENT))
  p.push(rr(cx - 78, 296, 156, 18, 9, ACCENT_LIFT))

  /* Dark display panel with three simple prompt shapes. */
  p.push(rr(cx - 268, 372, 536, 250, 44, '#1B1B20'))
  p.push(circle(cx - 150, 497, 44, ACCENT_LIFT))
  p.push(rr(cx - 44, 455, 84, 84, 18, '#DDE7F6'))
  p.push(
    `<path d="M ${cx + 156} ${455} L ${cx + 206} ${539} L ${cx + 106} ${539} Z" fill="#9FBCE8"/>`,
  )
  /* Progress dots under the prompts. */
  for (let i = 0; i < 5; i++) {
    p.push(circle(cx - 60 + i * 30, 592, 6, i === 0 ? ACCENT_LIFT : '#3A3A41'))
  }

  /* Fabric speaker band, drawn as a woven dot texture. */
  p.push(rr(cx - 268, 648, 536, 168, 34, '#DCDCDA'))
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 32; c++) {
      p.push(circle(cx - 246 + c * 16 + (r % 2) * 8, 672 + r * 24, 3.4, '#C3C3C0'))
    }
  }

  /* Physical response controls on the side face. */
  p.push(rr(cx + 258, 402, 88, 52, 26, ACCENT))
  p.push(circle(cx + 302, 540, 30, 'none', `stroke="${SECOND}" stroke-width="6"`))
  p.push(
    `<path d="M ${cx + 302} ${618} L ${cx + 328} ${662} L ${cx + 276} ${662} Z" fill="none" stroke="${SECOND}" stroke-width="6" stroke-linejoin="round"/>`,
  )

  return svgDoc(p.join(''))
}

/* =====================================================================
   2. SWL: local supplier and inventory data moving through controlled
      comparison, exception review and approved workbook outputs on a
      clean engineering workstation.
   ===================================================================== */
function drawSwl() {
  const p = []
  p.push(dotField(120, 120, 16, 6, 24, 24))
  p.push(dotField(1560, 860, 14, 6, 24, 24))

  /* Inputs: supplier export and inventory export tables, stacked left. */
  p.push(tableCard(96, 200, 430, 300, true))
  p.push(tableCard(96, 620, 430, 300, false))

  /* Routes into the review panel. */
  p.push(route([[534, 350], [640, 350], [640, 470], [716, 470]]))
  p.push(route([[534, 770], [640, 770], [640, 660], [716, 660]]))

  /* Central controlled-review panel. */
  p.push(rr(716, 168, 640, 816, 44, SHADOW))
  p.push(rr(704, 156, 640, 816, 44, '#274E8D'))
  p.push(rr(728, 180, 592, 700, 32, SURFACE))
  p.push(circle(1024, 156, 54, '#274E8D'))
  p.push(circle(1024, 152, 34, SURFACE))
  p.push(circle(1024, 144, 12, '#274E8D'))
  p.push(`<path d="M 1004 172 a 20 14 0 0 1 40 0 z" fill="#274E8D"/>`)

  /* Left column: approved proposals with ticks. */
  p.push(rr(756, 212, 268, 636, 22, 'none', `stroke="${ACCENT}" stroke-width="3"`))
  p.push(circle(890, 262, 26, ACCENT))
  p.push(
    `<path d="M 878 262 l 8 9 l 17 -19" fill="none" stroke="${SURFACE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  )
  for (let i = 0; i < 3; i++) {
    const y = 320 + i * 172
    p.push(rr(772, y, 236, 132, 18, '#F4F6FA'))
    p.push(rr(788, y + 20, 44, 44, 10, ACCENT))
    p.push(textLines(848, y + 28, 130, 2, 20))
    p.push(circle(978, y + 96, 16, ACCENT))
    p.push(
      `<path d="M 970 96 l 5 6 l 11 -12" transform="translate(0 ${y})" fill="none" stroke="${SURFACE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
  }

  /* Right column: exceptions held for operator review. */
  p.push(rr(1048, 212, 268, 636, 22, 'none', `stroke="${LINE}" stroke-width="3"`))
  p.push(
    `<path d="M 1182 238 L 1210 286 L 1154 286 Z" fill="none" stroke="${SECOND}" stroke-width="7" stroke-linejoin="round"/>`,
  )
  p.push(rr(1179, 254, 6, 14, 3, SECOND))
  p.push(circle(1182, 276, 3.4, SECOND))
  for (let i = 0; i < 3; i++) {
    const y = 320 + i * 172
    p.push(rr(1064, y, 236, 132, 18, '#F3F3F5'))
    p.push(rr(1080, y + 20, 44, 44, 10, '#8A8A93'))
    p.push(textLines(1140, y + 28, 130, 2, 20))
    p.push(circle(1270, y + 96, 16, 'none', `stroke="${SECOND}" stroke-width="5"`))
    p.push(lineEl(1262, y + 96, 1278, y + 96, SECOND, 5, 'stroke-linecap="round"'))
  }

  /* Approve and hold controls on the panel chin. */
  p.push(circle(902, 928, 30, ACCENT))
  p.push(
    `<path d="M 888 928 l 9 10 l 19 -21" fill="none" stroke="${SURFACE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  )
  p.push(circle(1024, 928, 36, '#1B1B20'))
  p.push(circle(1024, 928, 24, '#3B6BB8'))
  p.push(circle(1146, 928, 30, '#6A6A73'))
  p.push(
    `<path d="M 1134 916 l 24 24 M 1158 916 l -24 24" stroke="${SURFACE}" stroke-width="6" stroke-linecap="round"/>`,
  )

  /* Outputs: candidate import, change and audit workbooks. */
  const outs = [270, 570, 870]
  for (let i = 0; i < outs.length; i++) {
    const y = outs[i]
    p.push(route([[1356, 470 + i * 96], [1470, 470 + i * 96], [1470, y + 90], [1560, y + 90]]))
    p.push(rr(1580, y + 10, 360, 200, 18, SHADOW))
    p.push(rr(1568, y, 360, 200, 18, SURFACE))
    p.push(rr(1568, y, 26, 200, 13, i === 1 ? '#5F5F68' : '#274E8D'))
    if (i === 0) {
      p.push(rr(1620, y + 24, 40, 40, 8, ACCENT))
      p.push(textLines(1620, y + 90, 260, 3, 30))
    } else if (i === 1) {
      for (let b = 0; b < 5; b++) {
        const bh = 24 + ((b * 29) % 78)
        p.push(rr(1626 + b * 56, y + 164 - bh, 30, bh, 6, b % 2 ? '#9A9AA2' : '#6F6F78'))
      }
      p.push(lineEl(1620, y + 168, 1900, y + 168, LINE, 3))
    } else {
      p.push(rr(1620, y + 30, 120, 12, 6, '#C6C6CC'))
      p.push(rr(1620, y + 66, 200, 12, 6, TINT))
      p.push(circle(1856, y + 120, 44, 'none', `stroke="${SECOND}" stroke-width="14"`))
      p.push(
        `<path d="M 1856 76 a 44 44 0 0 1 44 44" transform="translate(0 ${y})" fill="none" stroke="${ACCENT}" stroke-width="14"/>`,
      )
      p.push(textLines(1620, y + 104, 150, 3, 28))
    }
  }

  return svgDoc(p.join(''))
}

/* =====================================================================
   3. Inventory scanning mobile robot: a compact operator-support robot
      beside organised inventory shelving, with a non-specific sensor
      head for stock observation.
   ===================================================================== */
function drawRobot() {
  const p = []

  /* Floor. */
  p.push(rr(0, 920, W, 232, 0, '#E9E9E7'))
  p.push(lineEl(0, 920, W, 920, LINE, 3))
  p.push(dotField(160, 180, 12, 6, 26, 26))

  /* Shelving rack with bins and boxes, right side. */
  const rx = 1150
  for (const post of [rx, rx + 820]) {
    p.push(rr(post, 120, 26, 820, 6, '#5F5F68'))
  }
  const shelves = [220, 420, 620, 820]
  for (const sy of shelves) {
    p.push(rr(rx - 20, sy, 860, 18, 6, '#77777F'))
  }
  /* Bins on the top two shelves, boxes below. */
  for (let i = 0; i < 5; i++) {
    const bx = rx + 30 + i * 160
    p.push(`<path d="M ${bx} ${150} L ${bx + 130} ${150} L ${bx + 118} ${216} L ${bx + 12} ${216} Z" fill="#55555E"/>`)
    p.push(rr(bx + 8, 150, 114, 12, 4, '#3D3D45'))
  }
  for (let i = 0; i < 5; i++) {
    const bx = rx + 30 + i * 160
    p.push(`<path d="M ${bx} ${352} L ${bx + 130} ${352} L ${bx + 118} ${416} L ${bx + 12} ${416} Z" fill="#66666E"/>`)
  }
  for (let i = 0; i < 4; i++) {
    const bx = rx + 40 + i * 200
    p.push(rr(bx, 540, 150, 78, 6, '#CBB79B'))
    p.push(lineEl(bx + 75, 540, bx + 75, 618, '#B7A184', 4))
  }
  for (let i = 0; i < 4; i++) {
    const bx = rx + 40 + i * 200
    p.push(rr(bx, 730, 160, 88, 6, '#C2AD90'))
    p.push(rr(bx, 758, 160, 10, 4, '#AE9878'))
  }

  /* The robot: chassis, body, sensor mast, non-specific sensor head. */
  const cx = 560
  p.push(ground(cx, 936, 300, 28))
  /* Drive base. */
  p.push(rr(cx - 300, 812, 600, 96, 40, '#1B1B20'))
  p.push(circle(cx - 190, 908, 52, '#101014'))
  p.push(circle(cx - 190, 908, 24, '#3A3A41'))
  p.push(circle(cx + 170, 908, 52, '#101014'))
  p.push(circle(cx + 170, 908, 24, '#3A3A41'))
  p.push(circle(cx + 286, 922, 30, '#101014'))
  /* Emergency stop. */
  p.push(rr(cx + 216, 826, 64, 40, 10, '#8F2F2F'))
  /* Body shell: white faceted tower with dark sensor window. */
  p.push(
    `<path d="M ${cx - 250} ${812} L ${cx - 250} ${520} L ${cx - 130} ${330} L ${cx + 130} ${330} L ${cx + 250} ${520} L ${cx + 250} ${812} Z" fill="${SURFACE}" stroke="${EDGE}" stroke-width="3"/>`,
  )
  p.push(
    `<path d="M ${cx - 60} ${812} L ${cx - 60} ${430} L ${cx + 110} ${370} L ${cx + 210} ${540} L ${cx + 210} ${812} Z" fill="#26262C"/>`,
  )
  p.push(rr(cx - 250, 700, 120, 46, 20, ACCENT))
  /* Fasteners. */
  for (const [fx, fy] of [[cx - 216, 560], [cx - 216, 760], [cx + 216, 760], [cx - 96, 368]]) {
    p.push(circle(fx, fy, 6, '#C6C6CC'))
  }
  /* Mast and sensor head, deliberately non-specific. */
  p.push(rr(cx - 26, 216, 52, 118, 10, '#26262C'))
  p.push(rr(cx - 30, 246, 60, 16, 8, ACCENT))
  p.push(
    `<path d="M ${cx - 96} ${150} L ${cx + 120} ${120} L ${cx + 150} ${216} L ${cx - 66} ${240} Z" fill="${SURFACE}" stroke="${EDGE}" stroke-width="3"/>`,
  )
  p.push(rr(cx + 60, 150, 74, 60, 10, '#1B1B20'))
  p.push(circle(cx + 84, 180, 12, '#4E4E57'))
  p.push(circle(cx + 114, 180, 8, '#6A6A73'))

  /* Observation cone toward the shelves: dashed, stopping short. */
  p.push(
    `<path d="M ${cx + 150} ${180} L ${1080} ${300} M ${cx + 150} ${200} L ${1080} ${560}" stroke="${ACCENT}" stroke-width="4" stroke-dasharray="14 14" fill="none"/>`,
  )

  return svgDoc(p.join(''))
}

/* =====================================================================
   4. Modular education and testing robot: a compact modular platform on
      an engineering bench with interchangeable sensing and actuation
      modules beside it.
   ===================================================================== */
function drawEducation() {
  const p = []

  /* Bench surface with a quiet fixture grid, echoing an optical bench. */
  p.push(rr(0, 860, W, 292, 0, '#EBEBE9'))
  p.push(lineEl(0, 860, W, 860, LINE, 3))
  p.push(rr(90, 560, 320, 260, 14, TINT))
  for (let c = 0; c < 6; c++) {
    for (let r = 0; r < 4; r++) {
      p.push(circle(140 + c * 45, 610 + r * 52, 8, '#CFCFD4'))
    }
  }
  p.push(dotField(1500, 160, 12, 6, 26, 26))

  /* The platform. */
  const cx = 940
  p.push(ground(cx, 878, 360, 30))
  /* Four omni wheels drawn as roller discs. */
  for (const [wx, wy] of [[cx - 300, 830], [cx + 300, 830], [cx - 210, 872], [cx + 210, 872]]) {
    p.push(circle(wx, wy, 64, '#33333A'))
    p.push(circle(wx, wy, 40, '#6A6A73'))
    for (let a = 0; a < 6; a++) {
      const ang = (a * Math.PI) / 3
      p.push(circle(wx + Math.cos(ang) * 52, wy + Math.sin(ang) * 52, 10, '#8A8A93'))
    }
    p.push(circle(wx, wy, 12, ACCENT))
  }
  /* Lower chassis and upper deck plate. */
  p.push(rr(cx - 340, 720, 680, 110, 20, '#1B1B20'))
  p.push(rr(cx - 250, 748, 120, 22, 8, ACCENT))
  p.push(rr(cx - 380, 610, 760, 120, 24, SURFACE, `stroke="${EDGE}" stroke-width="3"`))
  p.push(rr(cx - 380, 596, 760, 26, 12, '#26262C'))
  /* Deck fixture holes and edge connectors. */
  for (let i = 0; i < 12; i++) {
    p.push(circle(cx - 330 + i * 60, 668, 7, '#C6C6CC'))
  }
  for (const px of [cx - 300, cx - 60, cx + 180]) {
    p.push(rr(px, 636, 120, 34, 8, '#101014'))
    for (let k = 0; k < 7; k++) p.push(circle(px + 18 + k * 14, 653, 4, '#B08A3E'))
  }

  /* Three mounted modules on blue interface plates. */
  const mount = (mx, body) => {
    p.push(rr(mx - 74, 560, 148, 30, 8, ACCENT))
    body(mx)
  }
  mount(cx - 240, (mx) => {
    /* Sensing cube. */
    p.push(rr(mx - 64, 440, 128, 122, 16, SURFACE, `stroke="${EDGE}" stroke-width="3"`))
    p.push(rr(mx - 40, 466, 80, 56, 10, '#26262C'))
    p.push(circle(mx - 12, 494, 12, '#4E4E57'))
    p.push(circle(mx + 20, 494, 8, '#6A6A73'))
  })
  mount(cx + 20, (mx) => {
    /* Pan-tilt camera head module, the tallest element. */
    p.push(rr(mx - 52, 452, 104, 110, 14, '#26262C'))
    p.push(rr(mx - 22, 380, 44, 76, 12, SURFACE, `stroke="${EDGE}" stroke-width="3"`))
    p.push(rr(mx - 78, 300, 156, 88, 18, SURFACE, `stroke="${EDGE}" stroke-width="3"`))
    p.push(rr(mx + 4, 316, 60, 56, 10, '#1B1B20'))
    p.push(circle(mx + 24, 344, 10, '#4E4E57'))
    p.push(circle(mx + 48, 344, 7, '#6A6A73'))
    p.push(rr(mx - 62, 314, 52, 14, 7, ACCENT))
  })
  mount(cx + 260, (mx) => {
    /* Spinning sensor drum module. */
    p.push(rr(mx - 60, 470, 120, 92, 14, SURFACE, `stroke="${EDGE}" stroke-width="3"`))
    p.push(rr(mx - 44, 420, 88, 54, 12, '#1B1B20'))
    p.push(rr(mx - 44, 458, 88, 12, 6, '#33333A'))
  })

  /* Interchangeable modules waiting beside the platform. */
  const spare = (sx, sy, body) => {
    p.push(ground(sx, sy + 96, 96, 14))
    p.push(rr(sx - 84, sy + 66, 168, 26, 8, ACCENT_DEEP))
    body(sx, sy)
  }
  spare(1560, 760, (sx, sy) => {
    p.push(rr(sx - 74, sy - 40, 148, 108, 14, SURFACE, `stroke="${EDGE}" stroke-width="3"`))
    p.push(rr(sx - 52, sy - 16, 68, 48, 8, '#26262C'))
    p.push(circle(sx - 28, sy + 8, 10, '#4E4E57'))
    p.push(circle(sx + 2, sy + 8, 7, '#6A6A73'))
    p.push(rr(sx - 44, sy - 54, 88, 22, 10, '#1B1B20'))
  })
  spare(1790, 700, (sx, sy) => {
    p.push(rr(sx - 74, sy - 20, 148, 88, 14, SURFACE, `stroke="${EDGE}" stroke-width="3"`))
    p.push(rr(sx - 40, sy - 4, 80, 30, 6, '#101014'))
    for (let k = 0; k < 5; k++) p.push(circle(sx - 26 + k * 14, sy + 11, 4, '#B08A3E'))
  })
  spare(1930, 810, (sx, sy) => {
    p.push(rr(sx - 66, sy - 24, 132, 92, 14, SURFACE, `stroke="${EDGE}" stroke-width="3"`))
    p.push(rr(sx - 44, sy - 40, 88, 24, 10, '#1B1B20'))
    p.push(rr(sx - 30, sy + 4, 60, 34, 6, '#26262C'))
  })

  return svgDoc(p.join(''))
}

/* ---- Emit -------------------------------------------------------------- */

const DRAWINGS = [
  ['20260806-Upzy-Supervised-Routine-Companion-Rev00', drawUpzy],
  ['20260806-SWL-Pricing-Inventory-Control-Rev00', drawSwl],
  ['20260806-Inventory-Scanning-Mobile-Robot-Rev00', drawRobot],
  ['20260806-Education-Testing-Robot-Rev00', drawEducation],
]

const kb = (b) => `${(b.length / 1024).toFixed(0)} KB`
let drift = 0

for (const [stem, draw] of DRAWINGS) {
  const svg = draw()
  /* Same rasterisation and compression settings as make-veerai-visual.mjs
     and convert-images.mjs, so these assets compress like every other one. */
  const png = await sharp(Buffer.from(svg), { density: 96 })
    .resize(W, H, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toBuffer()
  const avif = await sharp(png).avif({ quality: 55, effort: 6 }).toBuffer()
  const webp = await sharp(png).webp({ quality: 78, effort: 5 }).toBuffer()
  const built = { png, avif, webp }

  if (CHECK) {
    for (const [ext, buffer] of Object.entries(built)) {
      const path = join(DIR, `${stem}.${ext}`)
      let committed
      try {
        committed = await readFile(path)
      } catch {
        console.log(`  MISSING  ${stem}.${ext}`)
        drift++
        continue
      }
      const same = committed.equals(buffer)
      if (!same) drift++
      console.log(
        `  ${same ? 'MATCH   ' : 'DRIFT   '} ${stem}.${ext}  committed ${kb(committed)}  rebuilt ${kb(buffer)}`,
      )
    }
  } else {
    for (const [ext, buffer] of Object.entries(built)) {
      await writeFile(join(DIR, `${stem}.${ext}`), buffer)
      console.log(`  wrote ${stem}.${ext}  ${kb(buffer)}`)
    }
    const { width, height } = await sharp(join(DIR, `${stem}.png`)).metadata()
    console.log(`  ${width} x ${height}\n`)
  }
}

if (CHECK) {
  if (drift > 0) {
    console.error(`\n${drift} asset(s) differ from a fresh build.`)
    process.exit(1)
  }
  console.log('\nAll four project visuals reproduce the committed bytes exactly.')
}
