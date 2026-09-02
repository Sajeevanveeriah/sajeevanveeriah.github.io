import { createQA } from './qa-oia-lib.mjs'

const PRODUCTS = [
  { id: "operations", module: "operations", heading: "Live operations", visibleModules: 5 },
  { id: "control", module: "control-studio", heading: "Control studio", visibleModules: 6 },
  { id: "hmi", module: "hmi-studio", heading: "HMI studio", visibleModules: 6 },
  { id: "alarms", module: "alarms", heading: "Alarm management", visibleModules: 6 },
  { id: "historian", module: "historian", heading: "Historian and analytics", visibleModules: 6 },
  { id: "performance", module: "performance", heading: "OEE and reporting", visibleModules: 6 },
  { id: "integration", module: "integration", heading: "Integration gateway", visibleModules: 6 },
  { id: "mes", module: "batch-mes", heading: "Batch and MES", visibleModules: 6 },
  { id: "materials", module: "materials", heading: "Materials and movement", visibleModules: 5 },
  { id: "assets", module: "maintenance", heading: "Maintenance", visibleModules: 6 },
  { id: "quality", module: "validation", heading: "Validation and quality", visibleModules: 6 },
  { id: "security", module: "cybersecurity", heading: "OT cybersecurity", visibleModules: 6 },
  { id: "identity", module: "identity", heading: "Identity and records", visibleModules: 5 },
  { id: "deployment", module: "deployment", heading: "Deployment centre", visibleModules: 6 },
  { id: "migration", module: "migration", heading: "Migration workbench", visibleModules: 6 },
]

const qa = createQA()
await qa.start()
let browser

try {
  browser = await qa.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  const health = qa.observe(page)

  await page.goto(qa.url('/'), { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  for (const product of PRODUCTS) {
    const response = await page.goto(qa.url(`/products/${product.id}/`), { waitUntil: 'networkidle' })
    await page.waitForSelector('#oiaProductSelect')
    const url = new URL(await page.url())
    const selected = await page.locator('#oiaProductSelect').inputValue()
    const visibleModules = await page.locator('#moduleList .module-button:visible').count()
    const headingVisible = await page.getByRole('heading', { name: product.heading, exact: true }).isVisible()
    const containment = await qa.containment(page)

    qa.record(`product-${product.id}-http`, response?.status() === 200, { status: response?.status() })
    qa.record(`product-${product.id}-query`, url.searchParams.get('product') === product.id, { url: url.href })
    qa.record(`product-${product.id}-hash`, url.hash === `#${product.module}`, { url: url.href })
    qa.record(`product-${product.id}-selector`, selected === product.id, { selected })
    qa.record(`product-${product.id}-heading`, headingVisible, { heading: product.heading })
    qa.record(`product-${product.id}-module-scope`, visibleModules === product.visibleModules, { visibleModules })
    qa.record(`product-${product.id}-overflow`, containment.overflow <= 4, containment)
  }

  await page.goto(qa.url('/?product=operations#operations'), { waitUntil: 'networkidle' })
  const initialWorkspace = await page.evaluate(() => {
    const stored = localStorage.getItem('oia-suite-workspace-v2')
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(window.OIA_SEED))
  })
  const initialBatchCount = initialWorkspace.process.batchCount
  qa.record('simulation-default-light-theme', await page.locator('html').getAttribute('data-theme') === 'light')
  qa.record('simulation-default-speed', await page.locator('#oiaSpeedSelect').inputValue() === '5')

  await page.getByRole('button', { name: 'Start production', exact: true }).click()
  qa.record(
    'simulation-starts-charge-water',
    (await page.locator('[data-testid="plant-state"]').innerText()) === 'CHARGE WATER',
  )

  await page.waitForFunction(
    () => document.querySelector('[data-testid="plant-state"]')?.textContent?.trim() !== 'CHARGE WATER',
    undefined,
    { timeout: 15000 },
  )
  const progressedState = (await page.locator('[data-testid="plant-state"]').innerText()).trim()
  qa.record(
    'simulation-progresses-past-charge-water',
    progressedState !== 'CHARGE WATER' && progressedState !== 'IDLE',
    { progressedState },
  )

  await page.waitForFunction(
    () => document.querySelector('[data-testid="plant-state"]')?.textContent?.trim() === 'IDLE',
    undefined,
    { timeout: 55000 },
  )

  const completedWorkspace = await page.evaluate(() => JSON.parse(localStorage.getItem('oia-suite-workspace-v2')))
  qa.record('simulation-completes-production-cycle', completedWorkspace.process.state === 'IDLE')
  qa.record(
    'simulation-increments-batch-count',
    completedWorkspace.process.batchCount === initialBatchCount + 1,
    { initialBatchCount, completedBatchCount: completedWorkspace.process.batchCount },
  )
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-product-operations-complete.png`, fullPage: true })

  await page.goto(qa.url('/?product=mes#batch-mes'), { waitUntil: 'networkidle' })
  const mesWorkspace = await page.evaluate(() => JSON.parse(localStorage.getItem('oia-suite-workspace-v2')))
  qa.record(
    'interconnected-products-share-workspace',
    mesWorkspace.process.batchCount === completedWorkspace.process.batchCount,
    { mesBatchCount: mesWorkspace.process.batchCount, operationsBatchCount: completedWorkspace.process.batchCount },
  )
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-product-mes-shared-state.png`, fullPage: true })

  await page.goto(qa.url('/?product=operations#operations'), { waitUntil: 'networkidle' })
  const beforeCip = await page.evaluate(() => JSON.parse(localStorage.getItem('oia-suite-workspace-v2')))
  const initialCipCount = beforeCip.process.cipCount
  await page.getByRole('button', { name: 'Start CIP', exact: true }).click()
  qa.record(
    'simulation-starts-cip-pre-rinse',
    (await page.locator('[data-testid="plant-state"]').innerText()) === 'CIP PRE RINSE',
  )

  await page.waitForFunction(
    () => document.querySelector('[data-testid="plant-state"]')?.textContent?.trim() !== 'CIP PRE RINSE',
    undefined,
    { timeout: 15000 },
  )
  const progressedCipState = (await page.locator('[data-testid="plant-state"]').innerText()).trim()
  qa.record(
    'simulation-progresses-past-cip-pre-rinse',
    progressedCipState !== 'CIP PRE RINSE' && progressedCipState !== 'IDLE',
    { progressedCipState },
  )

  await page.waitForFunction(
    () => document.querySelector('[data-testid="plant-state"]')?.textContent?.trim() === 'IDLE',
    undefined,
    { timeout: 45000 },
  )
  const completedCipWorkspace = await page.evaluate(() => JSON.parse(localStorage.getItem('oia-suite-workspace-v2')))
  qa.record('simulation-completes-cip-cycle', completedCipWorkspace.process.state === 'IDLE')
  qa.record(
    'simulation-increments-cip-count',
    completedCipWorkspace.process.cipCount === initialCipCount + 1,
    { initialCipCount, completedCipCount: completedCipWorkspace.process.cipCount },
  )
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-product-cip-complete.png`, fullPage: true })

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const mobilePage = await mobile.newPage()
  const mobileHealth = qa.observe(mobilePage)
  await mobilePage.goto(qa.url('/?product=operations#operations'), { waitUntil: 'networkidle' })
  const mobileContainment = await qa.containment(mobilePage)
  qa.record('product-mobile-overflow', mobileContainment.overflow <= 4, mobileContainment)
  qa.record('product-mobile-heading', await mobilePage.getByRole('heading', { name: 'Live operations', exact: true }).isVisible())
  await mobilePage.screenshot({ path: `${qa.captureRoot}/${qa.mode}-product-mobile.png`, fullPage: true })

  qa.healthy('products-desktop', health)
  qa.healthy('products-mobile', mobileHealth)
  await mobile.close()
  await context.close()
} finally {
  if (browser) await browser.close()
  await qa.finish()
}
