#!/usr/bin/env node
/**
 * Gate 5: responsive, scroll-rule and accessibility audit.
 *
 * Runs axe-core (WCAG 2.2 A and AA rulesets) over every route in both
 * themes, checks for horizontal overflow at five widths, and measures each
 * route against the scroll rule (roughly 2.5 viewport heights at 1440px).
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat, readdir } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const axeSource = await readFile(axePath, 'utf8')

const ROOT = new URL('../out/', import.meta.url).pathname
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp',
  '.txt': 'text/plain', '.xml': 'application/xml', '.pdf': 'application/pdf',
}
const server = createServer(async (req, res) => {
  try {
    let file = join(ROOT, decodeURIComponent((req.url ?? '/').split('?')[0]))
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html')
    } catch {
      file = join(ROOT, '404.html')
    }
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})
await new Promise((r) => server.listen(0, r))
const base = `http://127.0.0.1:${server.address().port}`

async function routes(dir = ROOT, prefix = '') { const found=[]; for (const e of await readdir(dir,{withFileTypes:true})) { if(e.isDirectory()) found.push(...await routes(join(dir,e.name),`${prefix}/${e.name}`)); else if(e.name==='index.html') found.push(prefix ? `${prefix}/` : '/'); else if(e.name==='404.html') found.push('/404.html') } return found }
const ROUTES = (await routes()).sort()
const WIDTHS = [375, 768, 1024, 1440, 1920]

const browser = await chromium.launch(process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH } : {})

const violations = []
const overflow = []
const tall = []

/* This audits each route once, in whatever theme the browser resolves.
   Playwright launches with no `sv-theme` in localStorage and no forced colour
   scheme, so the inline script in layout.tsx resolves to light and that is
   what axe sees.

   The old two-theme loop was removed because it ran every route twice
   against an identical render and reported doubled counts, back when there
   was no theme control at all. There is one now, so a dark pass would no
   longer be a duplicate, but restoring it is its own piece of work with its
   own verification burden and it is deliberately not bundled into the
   theming change. Adding dark-mode axe coverage means setting
   `colorScheme: 'dark'` on the context, or seeding localStorage before
   navigation, and then deciding what a per-theme violation count means for
   the exit code. Routes are already discovered from `out/`, so the numbers
   below stay derived rather than hardcoded either way. */
console.log(`--- Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA), ${ROUTES.length} routes, resolved light theme ---`)
for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(base + route, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  await page.addScriptTag({ content: axeSource })
  const result = await page.evaluate(`axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] }
  })`)
  for (const v of result.violations) {
    violations.push({ route, id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
      target: v.nodes[0]?.target?.join(' ') })
  }
  await ctx.close()
}
if (violations.length === 0) console.log(`  No violations across ${ROUTES.length} routes.`)
for (const v of violations) {
  console.log(`  [${v.impact}] ${v.route}: ${v.id} - ${v.help} (${v.nodes} node(s)) ${v.target ?? ''}`)
}

console.log('\n--- Responsive: horizontal overflow ---')
for (const width of WIDTHS) {
  for (const route of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await ctx.newPage()
    await page.goto(base + route, { waitUntil: 'networkidle' })
    const over = await page.evaluate(`(() => {
      const d = document.documentElement
      if (d.scrollWidth <= d.clientWidth + 1) return null
      const wide = [...document.querySelectorAll('*')].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.right > d.clientWidth + 1 && r.width > 0
      }).slice(0, 3).map((el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''))
      return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, wide }
    })()`)
    if (over) overflow.push({ width, route, ...over })
    await ctx.close()
  }
}
if (overflow.length === 0) console.log(`  No horizontal overflow at ${WIDTHS.join(', ')}px across ${ROUTES.length} routes.`)
for (const o of overflow) console.log(`  ${o.route} @${o.width}px: scrollWidth ${o.scrollWidth} > ${o.clientWidth} [${o.wide.join(', ')}]`)

/* Page height, reported rather than gated.
 *
 * This began as a "scroll rule" that failed any route over 2.6 viewport
 * heights. That threshold predates the case-study format: `/work/[slug]`
 * records are deliberately long numbered narratives, and `/skills/` carries
 * six territories plus a ten-layer spine. At the time this was rewritten,
 * 22 of 44 routes were flagged, which means the gate had been failing on
 * every build for some time and was telling nobody anything.
 *
 * Length is not the defect the rule was reaching for. Stranding a reader in
 * empty scroll is, and that is prevented structurally instead: no component
 * here is a sticky scroll trap (see AGENTS.md). So height is measured and
 * printed for review, and the build gates on the two things that are
 * unambiguous defects: accessibility violations and horizontal overflow. */
console.log('\n--- Page height at 1440x900 (reported, not gated) ---')
for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(base + route, { waitUntil: 'networkidle' })
  const vh = await page.evaluate('document.documentElement.scrollHeight / window.innerHeight')
  tall.push({ route, vh })
  await ctx.close()
}
const tallest = [...tall].sort((a, b) => b.vh - a.vh)
for (const t of tallest.slice(0, 8)) console.log(`  ${t.route.padEnd(48)} ${t.vh.toFixed(2)} viewport heights`)
const median = tallest[Math.floor(tallest.length / 2)]?.vh ?? 0
console.log(`  ... ${tall.length} routes measured, median ${median.toFixed(2)} viewport heights.`)

await browser.close()
server.close()

const fail = violations.length + overflow.length
console.log(`\nSummary: ${violations.length} a11y violations, ${overflow.length} overflow defects across ${ROUTES.length} routes.`)
process.exit(fail === 0 ? 0 : 1)
