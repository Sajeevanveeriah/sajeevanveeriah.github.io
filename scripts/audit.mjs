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

console.log('--- Accessibility (axe-core, WCAG 2.0/2.1/2.2 A + AA) ---')
for (const theme of ['light']) {
  for (const route of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    await page.addInitScript(`try{localStorage.setItem('theme','${theme}')}catch(e){}`)
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(200)
    await page.addScriptTag({ content: axeSource })
    const result = await page.evaluate(`axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] }
    })`)
    for (const v of result.violations) {
      violations.push({ theme, route, id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length,
        target: v.nodes[0]?.target?.join(' ') })
    }
    await ctx.close()
  }
}
if (violations.length === 0) console.log('  No violations across 10 routes x 2 themes.')
for (const v of violations) {
  console.log(`  [${v.impact}] ${v.route} (${v.theme}): ${v.id} - ${v.help} (${v.nodes} node(s)) ${v.target ?? ''}`)
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

console.log('\n--- Scroll rule: page height at 1440x900 ---')
for (const theme of ['dark', 'light']) {
  for (const route of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    await page.addInitScript(`try{localStorage.setItem('theme','${theme}')}catch(e){}`)
    await page.goto(base + route, { waitUntil: 'networkidle' })
    const vh = await page.evaluate('document.documentElement.scrollHeight / window.innerHeight')
    const flag = vh > 2.6
    if (flag) tall.push({ theme, route, vh })
    if (theme === 'dark') console.log(`  ${route.padEnd(42)} ${vh.toFixed(2)} viewport heights ${flag ? '  OVER' : ''}`)
    await ctx.close()
  }
}

await browser.close()
server.close()

const fail = violations.length + overflow.length + tall.length
console.log(`\nSummary: ${violations.length} a11y violations, ${overflow.length} overflow defects, ${tall.length} routes over the scroll rule.`)
process.exit(fail === 0 ? 0 : 1)
