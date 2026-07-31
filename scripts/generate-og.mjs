/**
 * Open Graph image generation, in the site's own visual style.
 *
 * Run with:
 *   npm run og
 *
 * Renders one 1200 x 630 PNG per page family into public/assets/og/ using
 * the design tokens (white canvas, ink ramp, single engineering blue) and
 * the site's own Space Grotesk and Hanken Grotesk faces. The outputs are
 * committed, deliberately: GitHub Actions runners do not carry the site's
 * typefaces as system fonts, and an OG card silently rendered in DejaVu
 * would betray the design system. Re-run this script after changing a page
 * title, a record title, an atlas domain name or a lab, then commit the
 * refreshed images.
 *
 * Rendering text needs the two faces installed as system fonts. Convert the
 * repository woff2 files once (any tool that emits ttf works; fonttools is
 * the reference path) and install them for the current user, then fc-cache.
 * The script fails closed with that instruction if the faces are missing.
 */

import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(here, '..')
const outDir = path.join(root, 'public', 'assets', 'og')

const { site } = await import('../src/content/site.ts')
const { publishedProjects } = await import('../src/content/projects.ts')
const { atlas } = await import('../src/content/atlas.ts')
const { labs } = await import('../src/content/lab.ts')

/* ---- Design tokens, mirrored from src/styles/tokens.css ---- */
const INK = '#0d0d0f'
const INK_MUTED = '#4e4e57'
const ACCENT = '#0b5cd5'
const TINT_DEEP = '#eef0f3'
const DISPLAY = 'Space Grotesk Light, Space Grotesk'
const BODY = 'Hanken Grotesk'

/* Fail closed if the display face is not installed: a card silently set in
   DejaVu is worse than no card. */
try {
  const list = execSync('fc-list', { encoding: 'utf8' })
  if (!/grotesk/i.test(list)) {
    console.error(
      'OG generation needs Space Grotesk and Hanken Grotesk installed as system fonts.',
    )
    console.error('Convert the woff2 files in public/assets/fonts/ to ttf, install, fc-cache.')
    process.exit(1)
  }
} catch {
  console.error('fc-list unavailable; cannot verify fonts. Aborting rather than mis-rendering.')
  process.exit(1)
}

function escapeXml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * Greedy word wrap against an estimated glyph width. The display face runs
 * narrow; 0.56 em per character measured well against the rendered output.
 */
function wrap(text, fontSize, maxWidth, maxLines) {
  const perChar = fontSize * 0.56
  const maxChars = Math.floor(maxWidth / perChar)
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > maxChars && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[,.]?$/, '')}...`
    return kept
  }
  return lines
}

/**
 * The card: white canvas, kicker in engineering blue, display title, a
 * baseline strip with the name and site, and the signal-path node motif the
 * homepage hero draws, restated as a static mark.
 */
function cardSvg({ kicker, title }) {
  const W = 1200
  const H = 630
  const M = 80

  const titleSize = title.length > 60 ? 58 : 66
  const lines = wrap(title, titleSize, W - M * 2, 3)
  const lineHeight = titleSize * 1.12
  const titleTop = 232

  const titleText = lines
    .map(
      (line, i) =>
        `<text x="${M}" y="${titleTop + i * lineHeight}" font-family="${DISPLAY}" font-weight="700" font-size="${titleSize}" letter-spacing="-2" fill="${INK}">${escapeXml(line)}</text>`,
    )
    .join('\n  ')

  /* The route: a polyline with instrument nodes, drawn once, echoing the
     hero. Sits under the baseline strip, right-aligned. */
  const routeY = H - 150
  const route = `
  <polyline points="${W - 470},${routeY} ${W - 350},${routeY} ${W - 310},${routeY - 40} ${W - 210},${routeY - 40} ${W - 170},${routeY} ${M + 960},${routeY}"
    fill="none" stroke="${TINT_DEEP}" stroke-width="3"/>
  <circle cx="${W - 470}" cy="${routeY}" r="7" fill="${ACCENT}"/>
  <circle cx="${W - 310}" cy="${routeY - 40}" r="7" fill="none" stroke="${ACCENT}" stroke-width="3"/>
  <circle cx="${W - 170}" cy="${routeY}" r="7" fill="${INK}"/>`

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect x="0" y="0" width="${W}" height="8" fill="${ACCENT}"/>
  <text x="${M}" y="130" font-family="${BODY}" font-weight="500" font-size="26" letter-spacing="4" fill="${ACCENT}">${escapeXml(kicker.toUpperCase())}</text>
  ${titleText}
  ${route}
  <line x1="${M}" y1="${H - 108}" x2="${W - M}" y2="${H - 108}" stroke="${TINT_DEEP}" stroke-width="2"/>
  <text x="${M}" y="${H - 58}" font-family="${DISPLAY}" font-weight="600" font-size="30" letter-spacing="-0.5" fill="${INK}">${escapeXml(site.name)}</text>
  <text x="${W - M}" y="${H - 58}" text-anchor="end" font-family="${BODY}" font-weight="400" font-size="24" fill="${INK_MUTED}">sajeevanveeriah.github.io</text>
</svg>`
}

async function render(name, card) {
  const svg = cardSvg(card)
  const png = await sharp(Buffer.from(svg), { density: 96 }).png().toBuffer()
  writeFileSync(path.join(outDir, `${name}.png`), png)
  return png.length
}

mkdirSync(outDir, { recursive: true })

const jobs = [
  ['og-default', { kicker: 'Portfolio', title: site.jobTitle }],
  ['work', { kicker: 'Work', title: 'Case studies with honest evidence tiers.' }],
  ['atlas', { kicker: 'Engineering Atlas', title: 'Nineteen domains, tiered honestly by evidence.' }],
  ['lab', { kicker: 'Concept Lab', title: 'Interactive demonstrations of the ideas behind the work.' }],
  ...publishedProjects.map((p) => [`work-${p.slug}`, { kicker: 'Work record', title: p.title }]),
  ...atlas.map((d) => [`atlas-${d.slug}`, { kicker: 'Engineering Atlas', title: d.name }]),
  ...labs.map((l) => [`lab-${l.slug}`, { kicker: l.kicker, title: l.title }]),
]

let total = 0
for (const [name, card] of jobs) {
  const bytes = await render(name, card)
  total += bytes
}
console.log(`Wrote ${jobs.length} OG images to public/assets/og/ (${Math.round(total / 1024)} kB total).`)
