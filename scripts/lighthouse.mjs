#!/usr/bin/env node
/** Lighthouse over the exported site, served locally. */
import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const ROOT = new URL('../out/', import.meta.url).pathname
const T = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2',
  '.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.avif':'image/avif',
  '.webp':'image/webp','.txt':'text/plain','.xml':'application/xml','.pdf':'application/pdf' }
const server = createServer(async (req, res) => {
  try {
    let f = join(ROOT, decodeURIComponent((req.url ?? '/').split('?')[0]))
    try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html') } catch { f = join(ROOT, '404.html') }
    const b = await readFile(f)
    res.writeHead(200, { 'content-type': T[extname(f)] ?? 'application/octet-stream' }); res.end(b)
  } catch { res.writeHead(404).end('nf') }
})
await new Promise((r) => server.listen(0, r))
const base = `http://127.0.0.1:${server.address().port}`

const chrome = await launch({
  chromePath: process.env.BROWSER_EXECUTABLE_PATH,
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
})

/* One representative route per family rather than all 63, because a full
   Lighthouse pass costs roughly ten seconds a route. Each index is included
   plus the heaviest detail page under it, so a regression in a shared
   component still surfaces. `/ecosystem/` carries the largest server-rendered
   list on the site and the pillar page carries the most records, so both are
   here: leaving the new routes out would have made this gate quieter as the
   site grew, which is the failure mode the audit script already had. */
const ROUTES = ['/', '/work/', '/atlas/', '/about/', '/skills/', '/contact/', '/employers/',
  '/ecosystem/', '/ecosystem/compute-embedded-and-low-level-software/',
  '/work/autonomous-navigation-rover/', '/atlas/robotics-and-autonomy/']

console.log('Route'.padEnd(40) + 'Perf  A11y  BestP   SEO   FCP      LCP      CLS   TBT')
const totals = { performance: [], accessibility: [], 'best-practices': [], seo: [] }

for (const route of ROUTES) {
  const r = await lighthouse(base + route, {
    port: chrome.port, output: 'json', logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
  })
  const c = r.lhr.categories
  const a = r.lhr.audits
  for (const k of Object.keys(totals)) totals[k].push(Math.round(c[k].score * 100))
  console.log(
    route.padEnd(40) +
    String(Math.round(c.performance.score*100)).padStart(4) +
    String(Math.round(c.accessibility.score*100)).padStart(6) +
    String(Math.round(c['best-practices'].score*100)).padStart(6) +
    String(Math.round(c.seo.score*100)).padStart(6) +
    ('  ' + a['first-contentful-paint'].displayValue).padEnd(11) +
    (a['largest-contentful-paint'].displayValue).padEnd(9) +
    (a['cumulative-layout-shift'].displayValue).padEnd(6) +
    a['total-blocking-time'].displayValue,
  )
}

console.log('\nMinimums across all routes:')
for (const [k, v] of Object.entries(totals)) console.log(`  ${k.padEnd(16)} ${Math.min(...v)}`)

await chrome.kill()
server.close()
