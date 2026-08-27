import { createServer } from 'node:http'
import { mkdir, readFile, stat } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { extname, join, normalize, resolve } from 'node:path'
import { chromium } from 'playwright'

const require = createRequire(import.meta.url)
const root = resolve('out')
const captureRoot = '/tmp/portfolio-qa'
const port = 4173
const baseURL = `http://127.0.0.1:${port}`
const mime = {
  '.avif': 'image/avif', '.css': 'text/css', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml',
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

await mkdir(captureRoot, { recursive: true })
await new Promise((ready) => server.listen(port, '127.0.0.1', ready))
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
  ['tablet-768', 768, 1024, 'light', 'no-preference'],
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
  await page.evaluate(async () => {
    const images = [...document.images]
    for (const image of images) {
      image.loading = 'eager'
      image.scrollIntoView({ block: 'center' })
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 50))
    }
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)))
    window.scrollTo(0, 0)
  })
  await page.addScriptTag({ path: axePath })
  const result = await page.evaluate(async () => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    theme: document.documentElement.dataset.theme,
    title: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim(),
    visibleText: document.body.innerText.trim().length,
    imagesReady: [...document.images].every((image) => image.complete && image.naturalWidth > 0 && image.alt),
    featuredCount: document.querySelectorAll('.selected-system h3').length,
    experienceCount: document.querySelectorAll('.experience-section, #experience').length,
    homepageIndexCount: document.querySelectorAll('main > .further-projects, #work .further-projects').length,
    supportCount: document.querySelectorAll('a[href="https://paypal.me/SajeevanVeeriah95"]').length,
    supportTargetSafe: [...document.querySelectorAll('a[href="https://paypal.me/SajeevanVeeriah95"]')].every((link) => link.target === '_blank' && link.relList.contains('noopener') && link.relList.contains('noreferrer')),
    dialogs: [...document.querySelectorAll('[role="dialog"]')].filter((node) => getComputedStyle(node).display !== 'none').length,
    animations: document.getAnimations().length,
    violations: (await window.axe.run({ exclude: [['.brand-mark']] }, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations.map((item) => ({ id: item.id, nodes: item.nodes.map((node) => node.target) })),
  }))
  await page.screenshot({ path: `${captureRoot}/${name}.png`, fullPage: true })
  const invalid = response?.status() !== 200 || result.overflow !== 0 || result.theme !== theme || !result.title?.includes('Sajeevan') || result.visibleText < 1200 || !result.imagesReady || result.featuredCount !== 3 || result.experienceCount !== 0 || result.homepageIndexCount !== 0 || result.supportCount !== 1 || !result.supportTargetSafe || result.dialogs !== 0 || result.violations.length || consoleErrors.length || requestFailures.length
  if (invalid) failures.push({ name, status: response?.status(), ...result, consoleErrors, requestFailures })
  if (reducedMotion === 'reduce' && result.animations !== 0) failures.push({ name, animations: result.animations })
  await context.close()
}

const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' })
await context.addInitScript(() => localStorage.setItem('sv-theme', 'light'))
const page = await context.newPage()
await page.goto(baseURL, { waitUntil: 'networkidle' })

const focusResults = []
for (let index = 0; index < 24; index += 1) {
  await page.keyboard.press('Tab')
  const result = await page.evaluate(() => {
    const active = document.activeElement
    if (!(active instanceof HTMLElement)) return null
    const element = active instanceof HTMLInputElement && active.closest('label') ? active.closest('label') : active
    if (!(element instanceof HTMLElement)) return null
    const rect = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    return { tag: element.tagName, visible: rect.width > 0 && rect.height > 0, focus: style.outlineStyle !== 'none' && style.outlineWidth !== '0px' }
  })
  if (result) focusResults.push(result)
}
if (focusResults.length < 10 || focusResults.some((item) => !item.visible || !item.focus)) failures.push({ name: 'keyboard-focus', focusResults })

await page.getByRole('group', { name: 'Colour theme' }).getByText('Dark', { exact: true }).click()
if (await page.locator('html').getAttribute('data-theme') !== 'dark') failures.push({ name: 'theme-switch' })

const routes = ['/work/', '/work/autonomous-navigation-rover/', '/work/ataxia-assessment-device/', '/work/swl-pricing-inventory-control/']
for (const route of routes) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  if (response?.status() !== 200 || overflow) failures.push({ name: 'route', route, status: response?.status(), overflow })
}

await page.goto(`${baseURL}/work/`, { waitUntil: 'networkidle' })
const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
if (canonical !== 'https://sajeevanveeriah.github.io/work/') failures.push({ name: 'work-canonical', canonical })

const missing = await page.goto(`${baseURL}/missing-route/`, { waitUntil: 'networkidle' })
const robots = (await page.locator('meta[name="robots"]').allTextContents()).join(',') || (await page.locator('meta[name="robots"]').all()).map(async (item) => item.getAttribute('content'))
const robotsContent = await page.locator('meta[name="robots"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('content') ?? '').join(','))
if (missing?.status() !== 404 || !(await page.locator('h1').textContent())?.includes('no longer part') || !robotsContent.includes('noindex')) failures.push({ name: '404', robots, robotsContent })

await page.goto(`${baseURL}/work/panelogram/`, { waitUntil: 'networkidle' })
if (page.url() !== `${baseURL}/work/`) failures.push({ name: 'legacy-work-redirect', url: page.url() })
await context.close()

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light' })
const mobilePage = await mobile.newPage()
await mobilePage.goto(baseURL, { waitUntil: 'networkidle' })
await mobilePage.getByText('Menu', { exact: true }).click()
const mobileNavVisible = await mobilePage.getByRole('navigation', { name: 'Mobile primary' }).isVisible()
const mobileLinks = await mobilePage.getByRole('navigation', { name: 'Mobile primary' }).getByRole('link').count()
if (!mobileNavVisible || mobileLinks !== 4) failures.push({ name: 'mobile-navigation', mobileNavVisible, mobileLinks })
await mobilePage.screenshot({ path: `${captureRoot}/mobile-menu-open.png`, fullPage: false })
await mobile.close()

const noJs = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false, colorScheme: 'dark' })
const noJsPage = await noJs.newPage()
const noJsResponse = await noJsPage.goto(baseURL)
if (noJsResponse?.status() !== 200 || await noJsPage.locator('.selected-system h3').count() !== 3 || !(await noJsPage.getByText('Menu', { exact: true }).isVisible())) failures.push({ name: 'no-js' })
await noJs.close()

await browser.close()
await new Promise((closed) => server.close(closed))

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2))
  process.exitCode = 1
} else {
  console.log(`Browser QA passed: ${states.length} visual states, ${routes.length} routes, keyboard, theme, mobile menu, 404, redirects and no-JavaScript.`)
}
