#!/usr/bin/env node
/**
 * JavaScript budget gate: 180 KB gzipped first load, per route.
 *
 * Next's "First Load JS" figure omits the polyfills chunk. That chunk ships
 * with a noModule attribute, so modern browsers never fetch it; this script
 * reports both numbers so the budget is judged on what a real modern browser
 * actually downloads.
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'out')
const BUDGET = 180 * 1024

async function htmlFiles(dir) {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await htmlFiles(p)))
    else if (entry.name.endsWith('.html')) found.push(p)
  }
  return found
}

const pages = (await htmlFiles(OUT)).sort()
const rows = []
let worst = 0

for (const page of pages) {
  const html = await readFile(page, 'utf8')
  const scripts = [...html.matchAll(/<script[^>]*src="([^"]+\.js)"([^>]*)>/g)]
  let modern = 0
  let legacy = 0
  for (const [, src, attrs] of scripts) {
    const file = join(OUT, src)
    try {
      await stat(file)
    } catch {
      continue
    }
    const size = gzipSync(await readFile(file), { level: 9 }).length
    if (/noModule/i.test(attrs)) legacy += size
    else modern += size
  }
  const route = page.replace(OUT, '').replace(/\/index\.html$/, '/').replace(/\.html$/, '')
  worst = Math.max(worst, modern)
  rows.push({ route: route || '/', modern, legacy })
}

// Collapse the many generated detail pages to one representative row each.
const seen = new Set()
const display = rows.filter((r) => {
  const key = r.route.split('/').slice(0, 2).join('/') + (r.route.split('/').length > 2 ? '/*' : '')
  if (seen.has(key)) return false
  seen.add(key)
  return true
})

const kb = (n) => `${(n / 1024).toFixed(1)} KB`
console.log('Route'.padEnd(34) + 'modern gz'.padStart(12) + 'legacy gz'.padStart(12) + '  budget')
for (const r of display) {
  console.log(
    r.route.padEnd(34) +
      kb(r.modern).padStart(12) +
      kb(r.legacy).padStart(12) +
      `  ${r.modern <= BUDGET ? 'PASS' : 'FAIL'}`,
  )
}
console.log(
  `\nHeaviest route: ${kb(worst)} gzipped against a ${kb(BUDGET)} budget ` +
    `(${((worst / BUDGET) * 100).toFixed(0)}% used, ${kb(BUDGET - worst)} headroom).`,
)
process.exit(worst <= BUDGET ? 0 : 1)
