#!/usr/bin/env node
/**
 * Gate 3 and Gate 4 verification.
 *
 * Drives the exported static site in a real browser and asserts, rather than
 * assumes, that:
 *   - every ambient (tier 3) component stops when scrolled off-screen
 *   - every ambient component is inert under prefers-reduced-motion
 *   - content is painted and readable before ambient motion completes
 *   - scroll frame rate holds on the heaviest route
 *
 * Exits non-zero on any failure.
 */
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const ROOT = new URL('../out/', import.meta.url).pathname
const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp',
  '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml',
  '.pdf': 'application/pdf',
}

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent((req.url ?? '/').split('?')[0])
    let file = join(ROOT, p)
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

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const browser = await chromium.launch({ executablePath: EXEC })

const results = []
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}

/** Count requestAnimationFrame callbacks over a window of time. */
const RAF_PROBE = `
  window.__rafCount = 0;
  const orig = window.requestAnimationFrame;
  window.requestAnimationFrame = function (cb) {
    return orig.call(window, function (t) { window.__rafCount++; return cb(t); });
  };
`

console.log('\n--- Gate 3: ambient motion pauses off-screen ---')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.addInitScript(RAF_PROBE)
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  await page.evaluate('window.__rafCount = 0')
  await page.waitForTimeout(1000)
  const onScreen = await page.evaluate('window.__rafCount')

  // Scroll the hero fully out of view.
  await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
  await page.waitForTimeout(900)
  await page.evaluate('window.__rafCount = 0')
  await page.waitForTimeout(1000)
  const offScreen = await page.evaluate('window.__rafCount')

  check(
    'hero ambient rAF runs while hero is visible',
    onScreen > 20,
    `${onScreen} frames/s`,
  )
  check(
    'hero ambient rAF stops when hero is off-screen',
    offScreen <= 2,
    `${offScreen} frames/s after scrolling away`,
  )
  await ctx.close()
}

console.log('\n--- Gate 3: ambient motion disabled under reduced motion ---')
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  await page.addInitScript(RAF_PROBE)
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await page.evaluate('window.__rafCount = 0')
  await page.waitForTimeout(1000)
  const frames = await page.evaluate('window.__rafCount')
  check('no ambient rAF loop under prefers-reduced-motion', frames <= 2, `${frames} frames/s`)

  const sweepAnimated = await page.evaluate(`(() => {
    const el = document.querySelector('svg[class*="sweep"] g[class*="sweepArm"]');
    if (!el) return 'absent';
    return getComputedStyle(el).animationName;
  })()`)
  check(
    'sensor sweep animation is none under reduced motion',
    sweepAnimated === 'none' || sweepAnimated === 'absent',
    `animation-name: ${sweepAnimated}`,
  )

  const bootAttr = await page.evaluate('document.documentElement.getAttribute("data-boot")')
  check('boot sequence does not run under reduced motion', bootAttr === null, `data-boot: ${bootAttr}`)
  await ctx.close()
}

console.log('\n--- Gate 4: content readable before ambient motion completes ---')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' })
  // Immediately, before any ambient loop or boot sequence could finish.
  const h1 = await page.locator('h1').first().innerText()
  const lede = await page.locator('main p').first().innerText()
  check('h1 present and non-empty at DOMContentLoaded', h1.trim().length > 0, JSON.stringify(h1.replace(/\n/g, ' ')))
  check('body copy present at DOMContentLoaded', lede.trim().length > 10)

  const opacity = await page.evaluate(`getComputedStyle(document.querySelector('h1')).opacity`)
  check('h1 is fully opaque, never gated behind animation', Number(opacity) === 1, `opacity ${opacity}`)
  await ctx.close()
}

console.log('\n--- Gate 3: scroll frame rate on the heaviest route ---')
{
  // /atlas carries the most DOM and the most interactive controls.
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(`${base}/atlas/`, { waitUntil: 'networkidle' })
  const fps = await page.evaluate(`(async () => {
    let frames = 0
    let stop = false
    const count = () => { frames++; if (!stop) requestAnimationFrame(count) }
    requestAnimationFrame(count)
    const start = performance.now()
    const end = start + 2000
    while (performance.now() < end) {
      window.scrollBy(0, 14)
      await new Promise((r) => setTimeout(r, 16))
    }
    stop = true
    return Math.round(frames / ((performance.now() - start) / 1000))
  })()`)
  check('scroll holds 50 fps or better on /atlas', fps >= 50, `${fps} fps while scrolling`)
  await ctx.close()
}

await browser.close()
server.close()

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} motion checks passed.`)
process.exit(failed.length === 0 ? 0 : 1)
