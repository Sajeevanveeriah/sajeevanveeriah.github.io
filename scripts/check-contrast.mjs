#!/usr/bin/env node
/**
 * WCAG 2.2 contrast gate, both themes.
 *
 * The previous version of this script read `src/styles/tokens.css` with a
 * regex that matched the FIRST `--name: #rrggbb` it found, and checked eight
 * pairs. That had two defects once a dark theme existed. It could only see
 * six-digit hex, so the four tokens declared as `rgb(r g b / a)` were
 * invisible to it. And matching the first occurrence meant it would always
 * read the `:root` light value and silently ignore any dark override, while
 * deploy.yml described it to the reader as gating "either theme". It gated
 * one.
 *
 * This version:
 *
 * 1. Parses the `:root` block for the light theme, and the
 *    `html[data-theme='dark']` block for the dark theme.
 * 2. Resolves the dark block's `var(--dark-*)` aliases back to their `:root`
 *    declarations, so an alias pointing at the wrong source is caught rather
 *    than silently inheriting the light value.
 * 3. Composites `rgb(r g b / a)` over the resolved opaque backdrop before
 *    measuring, so translucent rules and the translucent header are checked
 *    honestly rather than skipped.
 * 4. Checks every pair in the acceptance table, in both themes.
 *
 * Border pairs are computed and printed but NOT gated. See ADVISORY below.
 */
import { readFileSync } from 'node:fs'

const CSS = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8')

/* ---------- Parsing ---------- */

/**
 * Body of the first rule whose selector matches, by brace counting rather
 * than a lazy regex, so a nested block cannot end it early.
 */
function block(selector) {
  const start = CSS.indexOf(selector)
  if (start === -1) throw new Error(`selector ${selector} not found in tokens.css`)
  const open = CSS.indexOf('{', start)
  if (open === -1) throw new Error(`no block body for ${selector}`)
  let depth = 1
  let i = open + 1
  while (i < CSS.length && depth > 0) {
    if (CSS[i] === '{') depth++
    else if (CSS[i] === '}') depth--
    i++
  }
  if (depth !== 0) throw new Error(`unbalanced braces in ${selector}`)
  return CSS.slice(open + 1, i - 1)
}

/** Every `--name: value;` declaration in a block body, comments stripped. */
function declarations(body) {
  const out = new Map()
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, '')
  for (const m of clean.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    out.set(m[1].replace(/^--/, ''), m[2].trim())
  }
  return out
}

const ROOT = declarations(block(':root'))
const DARK_ALIASES = declarations(block("html[data-theme='dark']"))

/**
 * Light theme is :root as declared. Dark theme is :root with every alias in
 * the dark block resolved through :root. A `var(--dark-x)` naming a property
 * :root does not declare is a hard error, not a silent fallback, because that
 * is exactly the mistake this indirection exists to make visible.
 */
function darkTheme() {
  const out = new Map(ROOT)
  for (const [name, value] of DARK_ALIASES) {
    const alias = value.match(/^var\(\s*--([a-z0-9-]+)\s*\)$/i)
    if (!alias) {
      // A literal in the dark block. Permitted, but it defeats the
      // single-source rule, so say so rather than accepting it quietly.
      if (name !== 'color-scheme') {
        console.warn(`NOTE: --${name} is a literal in the dark block, not an alias: ${value}`)
      }
      out.set(name, value)
      continue
    }
    if (!ROOT.has(alias[1])) {
      throw new Error(`dark alias --${name} points at --${alias[1]}, which :root does not declare`)
    }
    out.set(name, ROOT.get(alias[1]))
  }
  return out
}

/* ---------- Colour ---------- */

/** `#rrggbb`, `rgb(r g b / a)` or `rgba(r, g, b, a)` into [r, g, b, a]. */
function parse(input) {
  const value = input.trim()
  const hex = value.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    return [
      parseInt(hex[1].slice(0, 2), 16),
      parseInt(hex[1].slice(2, 4), 16),
      parseInt(hex[1].slice(4, 6), 16),
      1,
    ]
  }
  const fn = value.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[/,]\s*([\d.]+%?)\s*)?\)$/i,
  )
  if (fn) {
    const raw = fn[4]
    const alpha =
      raw === undefined ? 1 : raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw)
    return [Number(fn[1]), Number(fn[2]), Number(fn[3]), alpha]
  }
  throw new Error(`cannot parse colour: ${input}`)
}

const linear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

/** Source-over composite of a possibly translucent colour on an opaque one. */
function composite(fg, bg) {
  const f = parse(fg)
  const b = parse(bg)
  if (b[3] !== 1) throw new Error(`backdrop must be opaque, got ${bg}`)
  return [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3]))
}

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => linear(v / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(theme, fgToken, bgToken) {
  const fg = theme.get(fgToken)
  const bg = theme.get(bgToken)
  if (!fg) throw new Error(`token --${fgToken} not found`)
  if (!bg) throw new Error(`token --${bgToken} not found`)
  const a = luminance(composite(fg, bg))
  const b = luminance(parse(bg).slice(0, 3))
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/* ---------- Acceptance table ---------- */

/* 4.5:1 for body text. 3:1 for large text, borders, focus rings, icons and
   other non-text UI, per WCAG 2.2 1.4.3 and 1.4.11. */
const GATED = [
  ['text', 'bg', 4.5],
  ['text', 'surface', 4.5],
  ['text', 'surface-raised', 4.5],
  ['text', 'tint', 4.5],
  ['text', 'tint-deep', 4.5],
  ['text-muted', 'bg', 4.5],
  ['text-muted', 'surface', 4.5],
  ['text-muted', 'tint', 4.5],
  ['text-faint', 'bg', 4.5],
  ['text-faint', 'surface', 4.5],
  ['text-faint', 'tint', 4.5],
  ['accent-text', 'bg', 4.5],
  ['accent-text', 'surface', 4.5],
  ['accent-text', 'tint', 4.5],
  ['accent-hover', 'bg', 4.5],
  ['accent-hover', 'surface', 4.5],
  ['status-text', 'bg', 4.5],
  ['on-accent', 'accent-fill', 4.5],
  ['focus-ring', 'bg', 3],
  ['focus-ring', 'surface', 3],
  ['focus-ring', 'surface-raised', 3],
  ['focus-ring', 'tint', 3],
  ['accent-fill', 'bg', 3],
  ['accent-fill', 'surface', 3],

  /* The five system-layer hues. Each is used as a label colour as well as a
     stroke, so each is gated at the text threshold rather than the 3:1
     non-text one, on both grounds it is ever drawn on: the page canvas and
     the tinted stage. Added with the specialist redesign; without these rows
     a new hue could ship legible in light and unreadable in dark, which is
     precisely the failure the dark-theme rows above exist to catch. */
  ['sys-mech', 'bg', 4.5],
  ['sys-mech', 'tint', 4.5],
  ['sys-sense', 'bg', 4.5],
  ['sys-sense', 'tint', 4.5],
  ['sys-control', 'bg', 4.5],
  ['sys-control', 'tint', 4.5],
  ['sys-autonomy', 'bg', 4.5],
  ['sys-autonomy', 'tint', 4.5],
  ['sys-verify', 'bg', 4.5],
  ['sys-verify', 'tint', 4.5],
]

/* ADVISORY, ungated. Reported for visibility, and deliberately do not fail
   the build. Gating them at 3:1 would fail on the SHIPPING LIGHT theme,
   which this change did not introduce and is not authorised to alter:
   `.pill`, `.search` and the header menu button, in
   src/components/ui/shared.module.css and
   src/components/chrome/SiteHeader.module.css, use these tokens as their
   only visible boundary, at 1.27:1 and 1.82:1 in light. Raising light's
   --border-strong to 3:1 needs alpha 0.439 rather than 0.26, which visibly
   thickens every rule on the site. Dark mirrors light's weight on purpose,
   so the two themes match. Tracked as a follow-up task: do not convert these
   to gated rows without doing the light-mode work at the same time. */
const ADVISORY = [
  ['border', 'bg', 3],
  ['border', 'surface', 3],
  ['border-strong', 'bg', 3],
  ['border-strong', 'surface', 3],
  ['border-faint', 'bg', 3],
]

const ADVISORY_REASON =
  'ADVISORY rows above are NOT gated and cannot fail this build. Reason: the light ' +
  'theme already ships below 3:1 on these border tokens, and correcting it changes ' +
  'the shipped light appearance, which is out of scope for the theming change. ' +
  'Dark deliberately mirrors light rather than exceeding it. Tracked as a separate ' +
  'follow-up task. Do not read an ADVISORY row as a checked row.'

/* ---------- Run ---------- */

const THEMES = [
  ['light', ROOT],
  ['dark', darkTheme()],
]

let failures = 0

for (const [name, theme] of THEMES) {
  console.log(`\n--- ${name} theme ---`)
  for (const [fg, bg, min] of GATED) {
    const r = ratio(theme, fg, bg)
    const pass = r >= min
    if (!pass) failures++
    console.log(
      `${`${fg} on ${bg}`.padEnd(32)} ${r.toFixed(2).padStart(6)}:1, need ${min}: ${
        pass ? 'PASS' : 'FAIL'
      }`,
    )
  }
  for (const [fg, bg, min] of ADVISORY) {
    const r = ratio(theme, fg, bg)
    console.log(
      `ADVISORY (ungated) ${`${fg} on ${bg}`.padEnd(26)} ${r.toFixed(2).padStart(6)}:1, ` +
        `reference ${min}: ${r >= min ? 'meets' : 'below'}`,
    )
  }
}

console.log(`\n${ADVISORY_REASON}`)
console.log(`\nGated pairs checked: ${GATED.length * THEMES.length} across ${THEMES.length} themes`)
console.log(`Gated pairs failing: ${failures}`)
process.exit(failures ? 1 : 0)
