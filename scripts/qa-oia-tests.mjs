const MODULES = [
  ['Overview', 'Operations command centre'],
  ['Operations', 'Live operations'],
  ['Control studio', 'Control studio'],
  ['HMI studio', 'HMI studio'],
  ['Tags and I/O', 'Tags and I/O'],
  ['Integration gateway', 'Integration gateway'],
  ['Alarm management', 'Alarm management'],
  ['Historian and analytics', 'Historian and analytics'],
  ['OEE and reporting', 'OEE and reporting'],
  ['Batch and MES', 'Batch and MES'],
  ['Materials and movement', 'Materials and movement'],
  ['Maintenance', 'Maintenance'],
  ['Validation and quality', 'Validation and quality'],
  ['OT cybersecurity', 'OT cybersecurity'],
  ['Identity and records', 'Identity and records'],
  ['Deployment centre', 'Deployment centre'],
  ['Migration workbench', 'Migration workbench'],
  ['Documentation', 'Documentation'],
  ['System settings', 'System settings'],
]

const ACCESSIBILITY_MODULES = new Set([
  'Overview',
  'Operations',
  'Control studio',
  'HMI studio',
  'Integration gateway',
  'OEE and reporting',
  'Batch and MES',
  'Validation and quality',
  'OT cybersecurity',
  'Identity and records',
  'System settings',
])

async function clearToasts(page) {
  await page.locator('.toast-region').evaluate((element) => { element.innerHTML = '' })
}

async function assertModule(page, qa, label, heading) {
  await page.getByRole('button', { name: label, exact: true }).click()
  const headingVisible = await page.getByRole('heading', { name: heading, exact: true }).isVisible()
  const dimensions = await qa.containment(page)
  qa.record(`module-${label}-heading`, headingVisible, { label, heading })
  qa.record(`module-${label}-overflow`, dimensions.overflow <= 4, dimensions)
  if (ACCESSIBILITY_MODULES.has(label)) {
    const violations = await qa.axe(page)
    qa.record(`module-${label}-accessibility`, violations.length === 0, { violations })
    qa.evidence.modules[label] = { heading, containment: dimensions, violations }
  } else {
    qa.evidence.modules[label] = { heading, containment: dimensions }
  }
}

export async function testSuite(browser, qa) {
  qa.evidence.modules = {}
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const health = await qa.inspect(page, '/', 'Overview - Open Industrial Automation Suite', 'Operations command centre')
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })

  const moduleCount = await page.locator('#moduleList [data-module]').count()
  qa.record('suite-module-count', moduleCount === 19, { moduleCount })
  qa.record('suite-boundary-visible', await page.getByText('Engineering and simulation boundary', { exact: true }).isVisible())
  qa.record('suite-no-employer-branding', !(await page.locator('body').innerText()).includes('JAG'))
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-01-overview-dark.png`, fullPage: true })

  for (const [label, heading] of MODULES) await assertModule(page, qa, label, heading)

  await page.getByRole('button', { name: 'Operations', exact: true }).click()
  await page.getByRole('button', { name: 'Start production', exact: true }).click()
  qa.record('operations-production-state', (await page.locator('[data-testid="plant-state"]').innerText()) === 'CHARGE WATER')
  qa.record('operations-production-mode', (await page.locator('[data-testid="plant-mode"]').innerText()) === 'Production')
  await clearToasts(page)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-02-operations-running.png`, fullPage: true })
  await page.getByRole('button', { name: 'Inject communications fault', exact: true }).click()
  qa.record('operations-fault-state', (await page.locator('[data-testid="plant-state"]').innerText()) === 'FAULT')
  qa.record('operations-fault-alarm-count', (await page.locator('[data-testid="active-alarm-count"]').innerText()) === '1')

  await page.getByRole('button', { name: 'Alarm management', exact: true }).click()
  await page.getByRole('button', { name: 'Acknowledge alarm ALM-COMMS-001', exact: true }).click()
  qa.record('alarm-acknowledged', await page.locator('table').getByText('Active acknowledged', { exact: true }).isVisible())

  await page.getByRole('button', { name: 'Control studio', exact: true }).click()
  await page.getByRole('button', { name: 'Validate program', exact: true }).click()
  qa.record('control-validation', await page.getByText('Validation passed', { exact: true }).isVisible())
  await page.getByRole('button', { name: 'Run one scan', exact: true }).click()
  qa.record('control-scan', await page.getByText('Scan completed', { exact: true }).isVisible())
  await clearToasts(page)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-03-control-studio.png`, fullPage: true })

  await page.getByRole('button', { name: 'HMI studio', exact: true }).click()
  await page.getByPlaceholder('Filter screens').fill('CIP')
  qa.record('hmi-filter-count', await page.locator('[data-screen-id]').count() === 1)
  await page.locator('[data-screen-id]').first().click()
  qa.record('hmi-selection', await page.getByText('CIP overview', { exact: true }).isVisible())
  await clearToasts(page)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-04-hmi-studio.png`, fullPage: true })

  await page.getByRole('button', { name: 'OEE and reporting', exact: true }).click()
  const oeeBefore = await page.locator('[data-testid="oee-value"]').innerText()
  await page.getByRole('button', { name: 'Recalculate OEE', exact: true }).click()
  const oeeAfter = await page.locator('[data-testid="oee-value"]').innerText()
  qa.record('oee-calculation', /\d+\.\d+%/.test(oeeAfter), { oeeBefore, oeeAfter })
  await clearToasts(page)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-05-oee-reporting.png`, fullPage: true })

  await page.getByRole('button', { name: 'Integration gateway', exact: true }).click()
  await page.getByRole('button', { name: 'Replay message MSG-260902-1842', exact: true }).click()
  const replayRow = page.locator('tr', { hasText: 'MSG-260902-1842' })
  qa.record('integration-replay', (await replayRow.innerText()).includes('Processed'))
  await clearToasts(page)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-06-integration-gateway.png`, fullPage: true })

  await page.getByRole('button', { name: 'Batch and MES', exact: true }).click()
  await page.getByRole('button', { name: 'Release order MO-260902-01', exact: true }).click()
  const orderRow = page.locator('tr', { hasText: 'MO-260902-01' }).first()
  qa.record('mes-order-release', (await orderRow.innerText()).includes('Running'))

  await page.getByRole('button', { name: 'Materials and movement', exact: true }).click()
  const missionBefore = await page.locator('.queue-item', { hasText: 'MMS-260902-07' }).innerText()
  await page.getByRole('button', { name: 'Advance mission MMS-260902-07', exact: true }).click()
  const missionAfter = await page.locator('.queue-item', { hasText: 'MMS-260902-07' }).innerText()
  qa.record('materials-mission-advance', missionBefore !== missionAfter, { missionBefore, missionAfter })

  await page.getByRole('button', { name: 'Validation and quality', exact: true }).click()
  await page.getByRole('button', { name: 'Execute test TEST-001', exact: true }).click()
  const testRow = page.locator('tr', { hasText: 'TEST-001' }).filter({ hasText: 'FAT' }).first()
  qa.record('validation-test-execution', (await testRow.innerText()).includes('Passed'))

  await page.getByRole('button', { name: 'OT cybersecurity', exact: true }).click()
  await page.getByRole('button', { name: 'Run posture assessment', exact: true }).click()
  const securityScore = await page.locator('[data-testid="security-score"]').innerText()
  qa.record('security-assessment', /\d+%/.test(securityScore), { securityScore })

  await page.getByRole('button', { name: 'Identity and records', exact: true }).click()
  await page.getByRole('button', { name: 'Sign record REC-BATCH-018', exact: true }).click()
  const recordRow = page.locator('tr', { hasText: 'REC-BATCH-018' }).filter({ hasText: 'Batch execution' }).first()
  qa.record('electronic-record-review', (await recordRow.innerText()).includes('Reviewed'))
  await clearToasts(page)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-07-identity-records.png`, fullPage: true })

  await page.getByRole('button', { name: 'Open command palette', exact: true }).click()
  await page.locator('#commandInput').fill('material')
  qa.record('command-palette-results', await page.locator('[data-command-module]').count() > 0)
  await page.keyboard.press('Escape')

  const themeBefore = await page.locator('html').getAttribute('data-theme')
  await page.getByRole('button', { name: 'Toggle colour theme', exact: true }).click()
  const themeAfter = await page.locator('html').getAttribute('data-theme')
  qa.record('theme-state-change', themeBefore !== themeAfter, { themeBefore, themeAfter })
  await clearToasts(page)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-08-light-theme.png`, fullPage: false })

  await page.getByRole('button', { name: 'System settings', exact: true }).click()
  await page.getByRole('button', { name: 'Reset demonstration workspace', exact: true }).click()
  qa.record('reset-dialog-visible', await page.getByRole('heading', { name: 'Reset demonstration workspace?', exact: true }).isVisible())
  await page.getByRole('button', { name: 'Confirm reset', exact: true }).click()
  qa.record('workspace-reset', await page.getByText('Workspace reset', { exact: true }).isVisible())

  const focus = await qa.focus(page)
  qa.record('keyboard-focus-visible', Boolean(focus?.visible && focus?.focusVisible), { focus })
  const animations = await page.evaluate(() => document.getAnimations().filter((item) => item.playState === 'running').length)
  qa.record('reduced-motion', animations === 0, { animations })
  qa.healthy('suite-desktop', health)
  qa.evidence.interactions = {
    operations: ['IDLE', 'CHARGE WATER', 'FAULT'],
    alarm: 'Active acknowledged',
    control: ['Validation passed', 'Scan completed'],
    hmi: 'CIP overview',
    oee: oeeAfter,
    integration: 'MSG-260902-1842 processed',
    mes: 'MO-260902-01 running',
    materials: missionAfter,
    validation: 'TEST-001 passed',
    security: securityScore,
    records: 'REC-BATCH-018 reviewed',
    theme: [themeBefore, themeAfter],
    reset: 'Workspace reset',
    focus,
    runningAnimationsReducedMotion: animations,
  }
  await context.close()
}

export async function testPortableAssets(browser, qa) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  const request = context.request
  const assets = [
    ['model.json', 'application/json'],
    ['README.md', 'text/markdown'],
    ['LICENSE', 'application/octet-stream'],
    ['schemas/oia-project.schema.json', 'application/json'],
    ['examples/site-profile.json', 'application/json'],
    ['docs/Capability-Matrix.md', 'text/markdown'],
  ]
  qa.evidence.assets = {}
  for (const [path, type] of assets) {
    const response = await request.get(qa.url(`/${path}`))
    const body = await response.body()
    qa.record(`asset-${path}-http`, response.status() === 200, { status: response.status() })
    qa.record(`asset-${path}-non-empty`, body.length > 100, { bytes: body.length })
    qa.evidence.assets[path] = { status: response.status(), bytes: body.length, expectedType: type }
  }
  const modelResponse = await request.get(qa.url('/model.json'))
  const model = await modelResponse.json()
  qa.record('model-schema-version', model.meta?.schemaVersion === '2.1.0', { actual: model.meta?.schemaVersion })
  qa.record('model-module-count', model.modules?.length === 19, { actual: model.modules?.length })
  qa.record('model-source-integrity', model.meta?.licence === 'Apache-2.0' && !JSON.stringify(model).includes('JAG'))

  for (const [route, heading] of [['/demo/', 'Live operations'], ['/studio/', 'Control studio']]) {
    const page = await context.newPage()
    const health = qa.observe(page)
    const response = await page.goto(qa.url(route), { waitUntil: 'networkidle' })
    qa.record(`compat-${route}-http`, response?.status() === 200, { status: response?.status() })
    qa.record(`compat-${route}-heading`, await page.getByRole('heading', { name: heading, exact: true }).isVisible())
    qa.record(`compat-${route}-hash`, (await page.url()).includes(heading === 'Live operations' ? '#operations' : '#control-studio'), { url: await page.url() })
    qa.healthy(`compat-${route}`, health)
    await page.close()
  }
  await context.close()
}

export async function testResponsive(browser, qa) {
  qa.evidence.responsive = {}
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const page = await mobileContext.newPage()
  const health = qa.observe(page)
  const response = await page.goto(qa.url('/'), { waitUntil: 'networkidle' })
  const overview = await qa.containment(page)
  qa.record('mobile-http', response?.status() === 200, { status: response?.status() })
  qa.record('mobile-overview-heading', await page.getByRole('heading', { name: 'Operations command centre', exact: true }).isVisible())
  qa.record('mobile-overview-overflow', overview.overflow <= 4, overview)
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  qa.record('mobile-navigation-open', (await page.locator('#moduleNav').getAttribute('data-open')) === 'true')
  const navScroll = await page.locator('#moduleNav').evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    overflowY: getComputedStyle(element).overflowY,
  }))
  qa.record('mobile-navigation-scrollable', navScroll.scrollHeight > navScroll.clientHeight && ['auto', 'scroll'].includes(navScroll.overflowY), navScroll)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-mobile-navigation.png`, fullPage: false })
  await page.getByRole('button', { name: 'Operations', exact: true }).click()
  const operations = await qa.containment(page)
  qa.record('mobile-operations-heading', await page.getByRole('heading', { name: 'Live operations', exact: true }).isVisible())
  qa.record('mobile-operations-overflow', operations.overflow <= 4, operations)
  const mimic = await page.locator('.process-mimic').evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    overflowX: getComputedStyle(element).overflowX,
  }))
  qa.record('mobile-process-scroller', mimic.scrollWidth > mimic.clientWidth && ['auto', 'scroll'].includes(mimic.overflowX), mimic)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-mobile-operations.png`, fullPage: true })
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click()
  await page.getByRole('button', { name: 'OEE and reporting', exact: true }).click()
  const oee = await qa.containment(page)
  qa.record('mobile-oee-heading', await page.getByRole('heading', { name: 'OEE and reporting', exact: true }).isVisible())
  qa.record('mobile-oee-overflow', oee.overflow <= 4, oee)
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-mobile-oee.png`, fullPage: true })
  qa.healthy('suite-mobile', health)
  qa.evidence.responsive.mobile = { overview, navScroll, operations, mimic, oee }
  await mobileContext.close()

  const zoomContext = await browser.newContext({ viewport: { width: 360, height: 450 }, reducedMotion: 'reduce' })
  const zoomPage = await zoomContext.newPage()
  const zoomHealth = qa.observe(zoomPage)
  const zoomResponse = await zoomPage.goto(qa.url('/'), { waitUntil: 'networkidle' })
  const zoom = await qa.containment(zoomPage)
  qa.record('zoom-http', zoomResponse?.status() === 200, { status: zoomResponse?.status() })
  qa.record('zoom-heading', await zoomPage.getByRole('heading', { name: 'Operations command centre', exact: true }).isVisible())
  qa.record('zoom-overflow', zoom.overflow <= 4, zoom)
  qa.record('zoom-controls', await zoomPage.locator('button:visible, a:visible, input:visible, select:visible').count() > 0)
  await zoomPage.screenshot({ path: `${qa.captureRoot}/${qa.mode}-zoom-overview.png`, fullPage: false })
  qa.healthy('suite-zoom', zoomHealth)
  qa.evidence.responsive.zoom = zoom
  await zoomContext.close()
}
