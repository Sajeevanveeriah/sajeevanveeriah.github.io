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

const browser = await chromium.launch(process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH } : {})

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

console.log('\n--- Gate 3: ambient motion runs on screen and pauses off screen ---')
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.addInitScript(RAF_PROBE)
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)

  /* The hero is pure SVG and CSS keyframes with no JavaScript at all (see
     AGENTS.md), so it has no requestAnimationFrame loop to count. The old
     check asserted one anyway and had therefore been failing on every run
     since the hero was rewritten. What actually needs proving is that the
     declared animations are live, so count running CSS animations instead. */
  const running = await page.evaluate(`(() => {
    return [...document.querySelectorAll('header svg *, main svg *')].filter((el) => {
      const cs = getComputedStyle(el)
      return cs.animationName !== 'none' && cs.animationPlayState === 'running'
    }).length
  })()`)
  check('hero ambient CSS animations are running while visible', running > 0, `${running} running animations`)

  // No JavaScript animation loop should be running at all: the ambient
  // motion is declarative, so a rAF loop here would be an unintended cost.
  await page.evaluate('window.__rafCount = 0')
  await page.waitForTimeout(1000)
  const heroRaf = await page.evaluate('window.__rafCount')
  check('no JavaScript animation loop drives the hero', heroRaf <= 2, `${heroRaf} rAF callbacks/s`)

  await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
  await page.waitForTimeout(900)
  await page.evaluate('window.__rafCount = 0')
  await page.waitForTimeout(1000)
  const offScreen = await page.evaluate('window.__rafCount')
  check(
    'no ambient rAF loop runs after scrolling away',
    offScreen <= 2,
    `${offScreen} rAF callbacks/s after scrolling away`,
  )
  await ctx.close()
}

/* The real off-screen pause is the InView wrapper, which sets `data-inview`
   while a subtree intersects and removes it when it leaves, so the
   stylesheets can pause the ambient animation inside. Test that on a work
   record, where the signature diagram actually lives: asserting it from the
   top of the home page proved nothing, because nothing is marked until
   something scrolls into view. */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(`${base}/work/autonomous-navigation-rover/`, { waitUntil: 'networkidle' })

  let peak = 0
  for (let step = 0; step < 12; step++) {
    await page.evaluate(`window.scrollTo(0, ${step} * window.innerHeight * 0.75)`)
    await page.waitForTimeout(250)
    const n = await page.evaluate('document.querySelectorAll("[data-inview]").length')
    peak = Math.max(peak, n)
    if (peak > 0) break
  }
  check('InView marks an ambient subtree once it scrolls on screen', peak > 0, `${peak} marked`)

  await page.evaluate('window.scrollTo(0, 0)')
  await page.waitForTimeout(600)
  const afterTop = await page.evaluate('document.querySelectorAll("[data-inview]").length')
  check(
    'InView unmarks the subtree once it leaves the viewport',
    afterTop < peak,
    `${afterTop} marked back at the top, down from ${peak}`,
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

  /* Assert against every animated element rather than one hand-written
     selector. The previous selector had drifted out of step with the markup
     and was silently reporting "absent", which passes without testing
     anything. Counting live animations cannot go stale that way. */
  const stillAnimating = await page.evaluate(`(() => {
    return [...document.querySelectorAll('header svg *, main svg *')].filter((el) => {
      const cs = getComputedStyle(el)
      return cs.animationName !== 'none' && cs.animationIterationCount === 'infinite'
        && cs.animationPlayState === 'running'
    }).length
  })()`)
  check(
    'no infinite CSS animation runs under reduced motion',
    stillAnimating === 0,
    `${stillAnimating} still animating`,
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
