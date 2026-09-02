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
  ['desktop-tight-1180', 1180, 900, 'light', 'no-preference'],
  ['mobile-light', 390, 844, 'light', 'no-preference'],
  ['mobile-dark', 390, 844, 'dark', 'no-preference'],
  ['narrow-320', 320, 720, 'light', 'no-preference'],
  ['tablet-768', 768, 1024, 'light', 'no-preference'],
  ['zoom-200-equivalent', 720, 900, 'light', 'no-preference'],
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
    imagesReady: [...document.images].every((image) => image.complete && image.naturalWidth > 0 && (image.alt || image.closest('.brand-mark, .field-core'))),
    layoutIntegrity: (() => {
      const collisions = []
      const groups = [
        ['hero', '.hero-layout', ':scope > *'],
        ['field-nodes', '.field-nodes', ':scope > .field-node'],
        ['proof', '.proof-rail-grid', ':scope > .proof-rail-item'],
        ['role-lenses', '.role-lenses', ':scope > .role-lens'],
        ['systems-path', '.systems-path', ':scope > li'],
        ['practice', '.practice-layout', ':scope > *'],
        ['contact', '.contact-layout', ':scope > h2, :scope > p'],
      ]

      for (const [name, containerSelector, itemSelector] of groups) {
        for (const container of document.querySelectorAll(containerSelector)) {
          const items = [...container.querySelectorAll(itemSelector)]
            .map((item, index) => ({ index, rect: item.getBoundingClientRect(), display: getComputedStyle(item).display }))
            .filter((item) => item.display !== 'none' && item.rect.width > 0 && item.rect.height > 0)
          for (let left = 0; left < items.length; left += 1) {
            for (let right = left + 1; right < items.length; right += 1) {
              const a = items[left].rect
              const b = items[right].rect
              if (a.right > b.left + 1 && b.right > a.left + 1 && a.bottom > b.top + 1 && b.bottom > a.top + 1) {
                collisions.push({ name, pair: [items[left].index, items[right].index] })
              }
            }
          }
        }
      }

      const field = document.querySelector('.field-nodes')
      const fieldRect = field?.getBoundingClientRect()
      const fieldOutOfBounds = field && fieldRect && getComputedStyle(field).display !== 'none'
        ? [...field.querySelectorAll('.field-node')].flatMap((node, index) => {
            const rect = node.getBoundingClientRect()
            return rect.left < fieldRect.left - 1 || rect.top < fieldRect.top - 1 || rect.right > fieldRect.right + 1 || rect.bottom > fieldRect.bottom + 1
              ? [{ index, node: [rect.left, rect.top, rect.right, rect.bottom], field: [fieldRect.left, fieldRect.top, fieldRect.right, fieldRect.bottom] }]
              : []
          })
        : []

      return { collisions, fieldOutOfBounds }
    })(),
    imageFraming: [...document.querySelectorAll('.practice-visual, .selected-visual, .record-plate, .further-figure')].map((figure, index) => {
      const image = figure.querySelector('img')
      if (!(image instanceof HTMLImageElement)) return { index, valid: false, reason: 'missing-image' }
      const frame = figure.getBoundingClientRect()
      const rendered = image.getBoundingClientRect()
      const style = getComputedStyle(image)
      const frameRatio = frame.width / frame.height
      const withinFrame = rendered.left >= frame.left - 1 && rendered.top >= frame.top - 1 && rendered.right <= frame.right + 1 && rendered.bottom <= frame.bottom + 1
      return {
        index,
        valid: image.complete && image.naturalWidth > 0 && style.objectFit === 'contain' && Math.abs(frameRatio - (16 / 9)) < 0.03 && withinFrame,
        natural: [image.naturalWidth, image.naturalHeight],
        frame: [Math.round(frame.width), Math.round(frame.height)],
        rendered: [Math.round(rendered.width), Math.round(rendered.height)],
        objectFit: style.objectFit,
        objectPosition: style.objectPosition,
        withinFrame,
      }
    }),
    identity: document.querySelector('.hero-role')?.textContent?.replace(/\s+/g, ' ').trim(),
    proofCount: document.querySelectorAll('#proof .proof-rail-item').length,
    roleLensCount: document.querySelectorAll('#role-lenses .role-lens').length,
    systemsCount: document.querySelectorAll('#systems').length,
    selectedSystemCount: document.querySelectorAll('#work .selected-system').length,
    practiceCount: document.querySelectorAll('#practice').length,
    contactCount: document.querySelectorAll('#contact').length,
    sectionOrder: ['overview', 'proof', 'role-lenses', 'systems', 'work', 'practice', 'contact'].every((id, index, ids) => {
      const node = document.getElementById(id)
      const previous = index === 0 ? null : document.getElementById(ids[index - 1])
      return Boolean(node && (!previous || (previous.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING)))
    }),
    obsoletePhrases: [
      'Living Systems Atlas',
      'Nineteen connected capability domains.',
      'Complete project index',
      '16 further engineering projects.',
      'Complete work history',
    ].filter((phrase) => document.body.innerText.includes(phrase)),
    supportCount: document.querySelectorAll('a[href*="paypal.me"]').length,
    supportTargetSafe: [...document.querySelectorAll('a[href*="paypal.me"]')].every((link) => link.target === '_blank' && link.relList.contains('noopener') && link.relList.contains('noreferrer')),
    dialogs: [...document.querySelectorAll('[role="dialog"]')].filter((node) => getComputedStyle(node).display !== 'none').length,
    animations: document.getAnimations().filter((animation) => animation.playState === 'running').length,
    violations: (await window.axe.run({ exclude: [['.brand-mark']] }, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } })).violations.map((item) => ({ id: item.id, nodes: item.nodes.map((node) => node.target) })),
  }))
  await page.screenshot({ path: `${captureRoot}/${name}.png`, fullPage: true })
  const invalid = response?.status() !== 200 || result.overflow !== 0 || result.theme !== theme || !result.title?.includes('Sajeevan') || result.visibleText < 1200 || !result.imagesReady || result.layoutIntegrity.collisions.length || result.layoutIntegrity.fieldOutOfBounds.length || result.imageFraming.some((item) => !item.valid) || result.identity !== 'Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer' || result.proofCount !== 3 || result.roleLensCount !== 3 || result.systemsCount !== 1 || result.selectedSystemCount !== 3 || result.practiceCount !== 1 || result.contactCount !== 1 || !result.sectionOrder || result.obsoletePhrases.length !== 0 || result.supportCount !== 1 || !result.supportTargetSafe || result.dialogs !== 0 || result.violations.length || consoleErrors.length || requestFailures.length
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
    // Browsers move focus back to the document after the final tabbable
    // control. The body is the cycle boundary, not an interactive target.
    if (active === document.body || active === document.documentElement) return null
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
  await page.evaluate(async () => {
    for (const image of [...document.images]) {
      image.loading = 'eager'
      image.scrollIntoView({ block: 'center' })
    }
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)))
    window.scrollTo(0, 0)
  })
  const routeResult = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    imagesReady: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
    workIndexCount: document.querySelectorAll('.record-index .index-list > li').length,
    publicCatalogueCount: document.querySelectorAll('.further-projects, .index-group, .index-project').length,
    recordPage: Boolean(document.querySelector('.record')),
    evidenceBoundaryCount: document.querySelectorAll('.record-grid .boundary').length,
    emailActionCount: document.querySelectorAll('.record-actions a[href^="mailto:"]').length,
    resumeActionCount: document.querySelectorAll('.record-actions a[href$="Resume_Sajeevan_Veeriah.pdf"]').length,
    nextProjectCount: document.querySelectorAll('.record-actions a[data-next-project]').length,
    visualOverflow: [...document.querySelectorAll('.practice-visual, .record-plate, .selected-visual, .further-figure')].flatMap((figure, index) => {
      const image = figure.querySelector('img')
      if (!(image instanceof HTMLImageElement)) return [{ index, reason: 'missing-image' }]
      const frame = figure.getBoundingClientRect()
      const rendered = image.getBoundingClientRect()
      const style = getComputedStyle(image)
      const withinFrame = rendered.left >= frame.left - 1 && rendered.top >= frame.top - 1 && rendered.right <= frame.right + 1 && rendered.bottom <= frame.bottom + 1
      const landscape = Math.abs((frame.width / frame.height) - (16 / 9)) < 0.03
      return withinFrame && landscape && style.objectFit === 'contain' ? [] : [{ index, frame: [frame.width, frame.height], rendered: [rendered.width, rendered.height], objectFit: style.objectFit, withinFrame, landscape }]
    }),
  }))
  const isWorkIndex = route === '/work/'
  const recordContractInvalid = routeResult.recordPage && (routeResult.evidenceBoundaryCount !== 1 || routeResult.emailActionCount !== 1 || routeResult.resumeActionCount !== 1 || routeResult.nextProjectCount !== 1)
  const indexContractInvalid = isWorkIndex && (routeResult.workIndexCount !== 3 || routeResult.publicCatalogueCount !== 0)
  if (response?.status() !== 200 || routeResult.overflow || !routeResult.imagesReady || routeResult.visualOverflow.length || recordContractInvalid || indexContractInvalid) failures.push({ name: 'route', route, status: response?.status(), ...routeResult })
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
if (!mobileNavVisible || mobileLinks !== 5) failures.push({ name: 'mobile-navigation', mobileNavVisible, mobileLinks })
await mobilePage.screenshot({ path: `${captureRoot}/mobile-menu-open.png`, fullPage: false })
await mobilePage.getByRole('navigation', { name: 'Mobile primary' }).getByRole('link', { name: 'Work' }).click()
await mobilePage.waitForTimeout(50)
const mobileMenuOpenAfterSelection = await mobilePage.locator('details.nav-disclosure').evaluate((element) => element.open)
if (mobileMenuOpenAfterSelection) failures.push({ name: 'mobile-navigation-close', mobileMenuOpenAfterSelection })
await mobile.close()

const noJs = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false, colorScheme: 'dark' })
const noJsPage = await noJs.newPage()
const noJsResponse = await noJsPage.goto(baseURL)
const noJsResult = await noJsPage.evaluate(() => ({
  identity: document.querySelector('.hero-role')?.textContent?.replace(/\s+/g, ' ').trim(),
  proofCount: document.querySelectorAll('#proof .proof-rail-item').length,
  roleLensCount: document.querySelectorAll('#role-lenses .role-lens').length,
  systemsCount: document.querySelectorAll('#systems').length,
  selectedSystemCount: document.querySelectorAll('#work .selected-system').length,
  practiceCount: document.querySelectorAll('#practice').length,
  contactCount: document.querySelectorAll('#contact').length,
}))
if (
  noJsResponse?.status() !== 200
  || noJsResult.identity !== 'Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer'
  || noJsResult.proofCount !== 3
  || noJsResult.roleLensCount !== 3
  || noJsResult.systemsCount !== 1
  || noJsResult.selectedSystemCount !== 3
  || noJsResult.practiceCount !== 1
  || noJsResult.contactCount !== 1
  || !(await noJsPage.getByText('Menu', { exact: true }).isVisible())
) failures.push({ name: 'no-js', ...noJsResult })
await noJs.close()

await browser.close()
await new Promise((closed) => server.close(closed))

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2))
  process.exitCode = 1
} else {
  console.log(`Browser QA passed: ${states.length} visual states, ${routes.length} routes, collision-free layout, 200% zoom-equivalent reflow, uncropped image framing, keyboard, theme, mobile menu, 404, redirects and no-JavaScript.`)
}
