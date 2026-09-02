import { createServer } from 'node:http'
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { extname, resolve, sep } from 'node:path'
import { chromium } from 'playwright'

const require = createRequire(import.meta.url)
const exportRoot = resolve('out')
const localPort = 4174
const localOrigin = `http://127.0.0.1:${localPort}`
const localPrefix = '/open-industrial-automation'
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.csv': 'text/csv; charset=utf-8',
}

export function createQA() {
  const remoteBase = process.env.OIA_BASE_URL?.replace(/\/+$/, '')
  const siteBase = remoteBase ?? `${localOrigin}${localPrefix}`
  const captureRoot = '/tmp/oia-qa'
  const mode = remoteBase ? 'live' : 'local'
  const axePath = require.resolve('axe-core/axe.min.js')
  const failures = []
  const evidence = { mode, siteBase, routes: {}, modules: {}, interactions: {}, assets: {}, responsive: {} }
  let server

  function url(route) {
    return route === '/' ? `${siteBase}/` : `${siteBase}${route}`
  }

  function record(name, condition, details = {}) {
    if (!condition) failures.push({ name, ...details })
  }

  function observe(page) {
    const consoleErrors = []
    const requestFailures = []
    const badResponses = []
    page.on('console', (message) => message.type() === 'error' && consoleErrors.push(message.text()))
    page.on('pageerror', (error) => consoleErrors.push(String(error)))
    page.on('requestfailed', (request) => requestFailures.push(request.url()))
    page.on('response', (response) => {
      if (response.status() >= 400) badResponses.push({ status: response.status(), url: response.url() })
    })
    return { consoleErrors, requestFailures, badResponses }
  }

  function healthy(label, health) {
    record(`${label}-console`, health.consoleErrors.length === 0, { errors: health.consoleErrors })
    record(`${label}-requests`, health.requestFailures.length === 0, { failures: health.requestFailures })
    record(`${label}-responses`, health.badResponses.length === 0, { responses: health.badResponses })
  }

  async function containment(page) {
    return page.evaluate(() => {
      const root = document.documentElement
      const body = document.body
      const overflow = Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth
      const offenders = [...document.querySelectorAll('*')]
        .map((element) => {
          const rect = element.getBoundingClientRect()
          return {
            tag: element.tagName,
            id: element.id,
            className: typeof element.className === 'string' ? element.className : '',
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            overflowX: getComputedStyle(element).overflowX,
          }
        })
        .filter((item) => item.right > root.clientWidth + 4 || item.left < -4)
        .sort((left, right) => right.right - left.right)
        .slice(0, 12)
      return {
        viewport: root.clientWidth,
        rootScroll: root.scrollWidth,
        bodyScroll: body.scrollWidth,
        overflow,
        offenders,
      }
    })
  }

  async function axe(page) {
    let loaded = await page.evaluate(() => Boolean(window.axe))
    if (!loaded) {
      await page.addInitScript({ path: axePath })
      await page.reload({ waitUntil: 'networkidle' })
      loaded = await page.evaluate(() => Boolean(window.axe))
    }
    if (!loaded) throw new Error('axe-core did not load in the browser context')
    return page.evaluate(async () => {
      const result = await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      })
      return result.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        help: item.help,
        targets: item.nodes.map((node) => node.target),
      }))
    })
  }

  async function inspect(page, route, titleExpected, headingExpected) {
    const health = observe(page)
    await page.addInitScript({ path: axePath })
    const response = await page.goto(url(route), { waitUntil: 'networkidle' })
    const title = await page.title()
    const visibleText = (await page.locator('body').innerText()).trim()
    const headingVisible = await page.getByRole('heading', { name: headingExpected, exact: true }).isVisible()
    const overlayCount = await page.locator('vite-error-overlay, nextjs-portal, #webpack-dev-server-client-overlay').count()
    const dimensions = await containment(page)
    const violations = await axe(page)
    record(`${route}-http`, response?.status() === 200, { status: response?.status() })
    record(`${route}-title`, title === titleExpected, { actual: title, expected: titleExpected })
    record(`${route}-heading`, headingVisible, { headingExpected })
    record(`${route}-not-blank`, visibleText.length > 300, { visibleTextLength: visibleText.length })
    record(`${route}-framework-overlay`, overlayCount === 0, { overlayCount })
    record(`${route}-overflow`, dimensions.overflow <= 4, dimensions)
    record(`${route}-accessibility`, violations.length === 0, { violations })
    evidence.routes[route] = {
      status: response?.status(),
      title,
      heading: headingExpected,
      visibleTextLength: visibleText.length,
      containment: dimensions,
      violations,
    }
    return health
  }

  async function focus(page) {
    await page.evaluate(() => document.activeElement?.blur())
    let result = null
    for (let index = 0; index < 60; index += 1) {
      await page.keyboard.press('Tab')
      result = await page.evaluate(() => {
        const active = document.activeElement
        if (!(active instanceof HTMLElement) || active === document.body) return null
        const style = getComputedStyle(active)
        const rect = active.getBoundingClientRect()
        const outline = style.outlineStyle !== 'none' && style.outlineWidth !== '0px'
        return {
          tag: active.tagName,
          id: active.id,
          text: active.textContent?.trim().slice(0, 80),
          visible: rect.width > 0 && rect.height > 0,
          focusVisible: outline || style.boxShadow !== 'none',
        }
      })
      if (result?.visible && result?.focusVisible) return result
    }
    return result
  }

  async function start() {
    await rm(captureRoot, { recursive: true, force: true })
    await mkdir(captureRoot, { recursive: true })
    if (remoteBase) return
    server = createServer(async (request, response) => {
      try {
        let pathname = decodeURIComponent(new URL(request.url ?? '/', localOrigin).pathname)
        if (pathname.endsWith('/')) pathname += 'index.html'
        const candidate = resolve(exportRoot, `.${pathname}`)
        if (candidate !== exportRoot && !candidate.startsWith(`${exportRoot}${sep}`)) throw new Error()
        if (!(await stat(candidate)).isFile()) throw new Error()
        response.writeHead(200, {
          'cache-control': 'no-store',
          'content-type': mime[extname(candidate)] ?? 'application/octet-stream',
        })
        response.end(await readFile(candidate))
      } catch {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
        response.end('Not found')
      }
    })
    await new Promise((ready) => server.listen(localPort, '127.0.0.1', ready))
  }

  async function launch() {
    const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH
    return chromium.launch(executablePath ? { executablePath, headless: true } : { headless: true })
  }

  async function finish() {
    if (server) await new Promise((done) => server.close(done))
    const report = {
      status: failures.length === 0 ? 'PASS' : 'FAIL',
      failureCount: failures.length,
      failures,
      evidence,
    }
    await writeFile(`${captureRoot}/report.json`, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    console.log(JSON.stringify(report, null, 2))
    if (failures.length) process.exitCode = 1
  }

  return {
    axe,
    captureRoot,
    containment,
    evidence,
    finish,
    focus,
    healthy,
    inspect,
    launch,
    mode,
    observe,
    record,
    start,
    url,
  }
}
