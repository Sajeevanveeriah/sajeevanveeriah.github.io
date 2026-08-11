import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { extname, join, normalize, resolve } from 'node:path'
import { chromium } from 'playwright'

const require = createRequire(import.meta.url)
const root = resolve('out')
const port = 4173
const baseURL = `http://127.0.0.1:${port}`
const mime = {
  '.avif': 'image/avif', '.css': 'text/css', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript', '.pdf': 'application/pdf', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml',
}

const server = createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url ?? '/', baseURL).pathname)
    if (pathname.endsWith('/')) pathname += 'index.html'
    const candidate = normalize(join(root, pathname))
    if (!candidate.startsWith(root) || !(await stat(candidate)).isFile()) throw new Error('not found')
    response.writeHead(200, { 'content-type': mime[extname(candidate)] ?? 'application/octet-stream' })
    response.end(await readFile(candidate))
  } catch {
    response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
    response.end(await readFile(join(root, '404.html')))
  }
})

await new Promise((resolveReady) => server.listen(port, '127.0.0.1', resolveReady))
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH
const browser = await chromium.launch(executablePath ? { executablePath, headless: true } : { headless: true })
const axePath = require.resolve('axe-core/axe.min.js')
const failures = []
const states = [
  ['desktop-light', 1440, 1000, 'light', 'no-preference'],
  ['desktop-dark', 1440, 1000, 'dark', 'no-preference'],
  ['mobile-light', 390, 844, 'light', 'no-preference'],
  ['mobile-dark', 390, 844, 'dark', 'no-preference'],
  ['narrow-320', 320, 720, 'light', 'no-preference'],
  ['zoom-200-equivalent', 640, 900, 'light', 'no-preference'],
  ['tablet-768', 768, 1024, 'light', 'no-preference'],
  ['laptop-1024', 1024, 768, 'light', 'no-preference'],
  ['ultrawide-1920', 1920, 1080, 'dark', 'no-preference'],
  ['reduced-motion', 1440, 1000, 'light', 'reduce'],
]

for (const [name, width, height, theme, reducedMotion] of states) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: theme, reducedMotion })
  await context.addInitScript((value) => localStorage.setItem('sv-theme', value), theme)
  const page = await context.newPage()
  const consoleErrors = []
  const requestFailures = []
  page.on('console', (message) => message.type() === 'error' && consoleErrors.push(message.text()))
  page.on('requestfailed', (request) => requestFailures.push(request.url()))
  const response = await page.goto(baseURL, { waitUntil: 'networkidle' })
  await page.addScriptTag({ path: axePath })
  const result = await page.evaluate(async () => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    theme: document.documentElement.dataset.theme,
    imagesReady: [...document.images].every((image) => image.complete && image.naturalWidth > 0 && image.alt),
    iepCount: document.querySelectorAll('.iep-section, #iep-title').length,
    linkedInCount: document.querySelectorAll('a[href*="linkedin.com"]').length,
    practiceTarget: document.querySelector('#practice')?.classList.contains('practice-section') ?? false,
    animations: document.getAnimations().length,
    violations: (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
    })),
  }))
  await page.screenshot({ path: `/tmp/portfolio-${name}.png`, fullPage: true })
  if (response?.status() !== 200 || result.overflow !== 0 || result.theme !== theme || !result.imagesReady || result.iepCount !== 0 || result.linkedInCount !== 0 || !result.practiceTarget || result.violations.length || consoleErrors.length || requestFailures.length) {
    failures.push({ name, status: response?.status(), ...result, consoleErrors, requestFailures })
  }
  if (reducedMotion === 'reduce' && result.animations !== 0) failures.push({ name, animations: result.animations })
  await context.close()
}

const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' })
await context.addInitScript(() => localStorage.setItem('sv-theme', 'light'))
const page = await context.newPage()
await page.goto(baseURL, { waitUntil: 'networkidle' })
const focusResults = []
const focusableCount = await page.locator('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])').count()
for (let index = 0; index < focusableCount; index += 1) {
  await page.keyboard.press('Tab')
  focusResults.push(await page.evaluate(() => {
    const element = document.activeElement
    if (!(element instanceof HTMLElement)) return false
    const rect = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    return rect.width > 0 && rect.height > 0 && style.outlineStyle !== 'none' && style.outlineWidth !== '0px'
  }))
}
if (focusResults.some((result) => !result)) failures.push({ name: 'keyboard-focus', focusResults })

const themeButton = page.getByRole('button', { name: /Theme:/ })
await themeButton.click()
if (await page.locator('html').getAttribute('data-theme') !== 'dark') failures.push({ name: 'theme-switch' })
for (const route of ['/work/inventory-scanning-mobile-robot/', '/work/autonomous-navigation-rover/', '/work/ataxia-assessment-device/', '/work/']) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
  if (response?.status() !== 200 || await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) failures.push({ name: 'route', route, status: response?.status() })
}
const missing = await page.goto(`${baseURL}/missing-route/`, { waitUntil: 'networkidle' })
if (missing?.status() !== 404 || !(await page.locator('h1').textContent())?.includes('no longer part')) failures.push({ name: '404' })
await page.goto(`${baseURL}/about/`, { waitUntil: 'networkidle' })
if (page.url() !== `${baseURL}/`) failures.push({ name: 'legacy-redirect', url: page.url() })
await context.close()

const noJs = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false, colorScheme: 'dark' })
const noJsPage = await noJs.newPage()
const noJsResponse = await noJsPage.goto(baseURL)
if (noJsResponse?.status() !== 200 || await noJsPage.locator('.project-copy h3 a').count() !== 3) failures.push({ name: 'no-js' })
await noJs.close()

await browser.close()
await new Promise((resolveClosed) => server.close(resolveClosed))

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2))
  process.exitCode = 1
} else {
  console.log(`Browser QA passed: ${states.length} visual states, 4 routes, keyboard focus, 404 and no-JavaScript.`)
}
