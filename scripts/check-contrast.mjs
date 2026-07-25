#!/usr/bin/env node
/**
 * WCAG 2.2 contrast gate.
 *
 * Parses the raw palette straight out of src/styles/tokens.css, so this can
 * never drift from the values actually shipped, composites any alpha token
 * over its background, and exits non-zero if a required pair fails.
 *
 * Thresholds: 4.5:1 for body-size text, 3:1 for large text and for non-text
 * UI that carries meaning (status dots, focus rings, control boundaries).
 * Purely decorative hairlines are measured and reported but not gated: they
 * are never the sole means of identifying a control.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(here, '../src/styles/tokens.css'), 'utf8')

/** Pull `--name: value;` declarations out of the raw palette. */
function readToken(name) {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`))
  if (!m) throw new Error(`token --${name} not found in tokens.css`)
  return m[1].trim()
}

function parseColour(value) {
  const hex = value.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 }
  }
  const rgb = value.match(
    /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+)\s*)?\)$/i,
  )
  if (rgb) {
    return {
      r: +rgb[1],
      g: +rgb[2],
      b: +rgb[3],
      a: rgb[4] === undefined ? 1 : +rgb[4],
    }
  }
  throw new Error(`cannot parse colour: ${value}`)
}

/** Composite a possibly-translucent foreground over an opaque background. */
function flatten(fg, bg) {
  if (fg.a >= 1) return fg
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  }
}

const channel = (c) => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const luminance = ({ r, g, b }) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

function contrast(fgToken, bgToken) {
  const bg = parseColour(readToken(bgToken))
  const fg = flatten(parseColour(readToken(fgToken)), bg)
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

const THEMES = [
  {
    name: 'Midnight (dark, default)',
    p: 'midnight',
    surfaces: [
      ['page background', 'bg'],
      ['surface', 'surface'],
      ['surface-raised', 'surface-raised'],
    ],
  },
  {
    name: 'Daylight (light)',
    p: 'daylight',
    surfaces: [
      ['page background', 'bg'],
      ['surface', 'surface'],
      ['surface-raised', 'surface-raised'],
    ],
  },
]

/** [label, token suffix, threshold, gated] */
const CHECKS = [
  ['Body text', 'ink', 4.5, true],
  ['Muted text', 'ink-soft', 4.5, true],
  ['Faint text', 'faint', 4.5, true],
  ['Accent text (gold)', 'gold-text', 4.5, true],
  ['Accent fill, meaningful UI', null, 3.0, true],
  ['Status text (steel)', 'steel-text', 4.5, true],
  ['Status fill (steel)', null, 3.0, true],
  ['Focus ring', null, 3.0, true],
  ['Border, decorative hairline', 'line', 3.0, false],
  ['Border strong', 'line-strong', 3.0, false],
]

/** Tokens whose name differs per theme. */
function tokenFor(theme, label, suffix) {
  if (suffix) return `${theme.p}-${suffix}`
  if (label === 'Accent fill, meaningful UI')
    return theme.p === 'daylight' ? 'daylight-gold-fill' : 'midnight-gold'
  if (label === 'Status fill (steel)')
    return theme.p === 'daylight' ? 'daylight-steel-fill' : 'midnight-steel'
  if (label === 'Focus ring')
    return theme.p === 'daylight' ? 'daylight-gold-text' : 'midnight-gold'
  throw new Error(`no token mapping for ${label}`)
}

let failures = 0
const rows = []

for (const theme of THEMES) {
  rows.push(`\n${theme.name}`)
  rows.push(
    '  ' +
      'Pair'.padEnd(30) +
      theme.surfaces.map(([n]) => n.padStart(17)).join('') +
      '   need   result',
  )
  for (const [label, suffix, need, gated] of CHECKS) {
    const fg = tokenFor(theme, label, suffix)
    const ratios = theme.surfaces.map(([, s]) => contrast(fg, `${theme.p}-${s}`))
    const worst = Math.min(...ratios)
    const pass = worst >= need
    if (gated && !pass) failures += 1
    rows.push(
      '  ' +
        label.padEnd(30) +
        ratios.map((r) => `${r.toFixed(2)}:1`.padStart(17)).join('') +
        `   ${need.toFixed(1)}   ` +
        (pass ? 'PASS' : gated ? 'FAIL' : 'below (not gated, decorative)'),
    )
  }
}

console.log(rows.join('\n'))
console.log(
  `\nGated pairs failing: ${failures}. ` +
    (failures === 0
      ? 'All gated pairs meet WCAG 2.2 AA against every background they render on.'
      : 'Fix the failing token value in src/styles/tokens.css.'),
)

process.exit(failures === 0 ? 0 : 1)
