#!/usr/bin/env node
import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

const root = new URL('../out/', import.meta.url).pathname
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.txt': 'text/plain', '.xml': 'application/xml', '.pdf': 'application/pdf' }
const server = createServer(async (request, response) => {
  try {
    let file = join(root, decodeURIComponent((request.url ?? '/').split('?')[0]))
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html') } catch { file = join(root, '404.html') }
    response.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
    response.end(await readFile(file))
  } catch { response.writeHead(404).end('not found') }
})
await new Promise((ready) => server.listen(0, ready))
const address = server.address()
if (!address || typeof address === 'string') throw new Error('Lighthouse server did not start')
const base = `http://127.0.0.1:${address.port}`

const chrome = await launch({
  chromePath: process.env.BROWSER_EXECUTABLE_PATH || chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
})
const routes = ['/', '/about/', '/notes/', '/work/', '/work/autonomous-navigation-rover/', '/work/ataxia-assessment-device/', '/work/swl-pricing-inventory-control/']
const minimum = { performance: 90, accessibility: 95, 'best-practices': 95, seo: 95 }
const scores = []

console.log('Route'.padEnd(46) + 'Perf  A11y  Best  SEO')
for (const route of routes) {
  const result = await lighthouse(base + route, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: Object.keys(minimum),
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false },
    throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
  })
  if (!result) throw new Error(`Lighthouse did not return a result for ${route}`)
  const row = Object.fromEntries(Object.keys(minimum).map((key) => [key, Math.round((result.lhr.categories[key].score ?? 0) * 100)]))
  scores.push({ route, ...row })
  console.log(route.padEnd(46) + String(row.performance).padStart(4) + String(row.accessibility).padStart(6) + String(row['best-practices']).padStart(6) + String(row.seo).padStart(5))
}

await chrome.kill()
await new Promise((closed) => server.close(closed))

const failures = scores.flatMap((row) => Object.entries(minimum).filter(([key, threshold]) => row[key] < threshold).map(([key, threshold]) => ({ route: row.route, category: key, score: row[key], threshold })))
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2))
  process.exitCode = 1
} else {
  console.log(`Lighthouse passed ${routes.length} routes at or above ${JSON.stringify(minimum)}.`)
}
