export async function testDocumentation(browser, qa) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const health = await qa.inspect(page, '/', 'Technical documentation - OIA', 'Technical documentation')
  const links = await page.locator('header nav a').evaluateAll((nodes) =>
    Object.fromEntries(nodes.map((node) => [node.textContent.trim(), node.getAttribute('href')])),
  )
  qa.record('documentation-navigation', links['Operator HMI'] === './demo/' && links['Engineering Studio'] === './studio/', { links })
  qa.record('documentation-safety-boundary', (await page.locator('body').innerText()).includes('Certified safety remains independent'))
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-01-documentation-desktop.png`, fullPage: true })
  qa.healthy('documentation', health)
  qa.evidence.documentation = { links }
  await context.close()
}

export async function testOperator(browser, qa) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const health = await qa.inspect(page, '/demo/', 'Open Industrial Automation - Operator HMI', 'Mixing, dosing and CIP')
  const state = page.locator('[data-testid="plant-state"]')
  qa.record('operator-default-state', (await state.innerText()) === 'IDLE', { actual: await state.innerText() })
  qa.record('operator-static-mode', (await page.locator('#connectionText').innerText()) === 'Static demonstration', { actual: await page.locator('#connectionText').innerText() })
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-02-operator-default.png`, fullPage: true })

  await page.getByRole('button', { name: 'Start production', exact: true }).click()
  qa.record('operator-production-state', (await state.innerText()) === 'CHARGE_WATER', { actual: await state.innerText() })
  qa.record('operator-production-mode', (await page.locator('#mode').innerText()) === 'production', { actual: await page.locator('#mode').innerText() })
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-03-operator-production.png`, fullPage: true })

  await page.getByRole('button', { name: 'Inject communications fault', exact: true }).click()
  qa.record('operator-engineer-role', (await page.locator('#role').inputValue()) === 'engineer', { actual: await page.locator('#role').inputValue() })
  qa.record('operator-fault-state', (await state.innerText()) === 'FAULT', { actual: await state.innerText() })
  qa.record('operator-alarm-count', (await page.locator('#alarmCount').innerText()) === '1', { actual: await page.locator('#alarmCount').innerText() })
  qa.record('operator-alarm-visible', await page.getByText('Simulation communications fault', { exact: true }).isVisible())
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-04-operator-fault.png`, fullPage: true })

  await page.getByRole('button', { name: 'Acknowledge', exact: true }).click()
  qa.record('operator-alarm-acknowledged', (await page.locator('#alarms').innerText()).toLowerCase().includes('active acknowledged'))
  await page.getByRole('button', { name: 'Reset fault', exact: true }).click()
  qa.record('operator-reset-state', (await state.innerText()) === 'IDLE', { actual: await state.innerText() })
  qa.record('operator-reset-alarm-count', (await page.locator('#alarmCount').innerText()) === '0', { actual: await page.locator('#alarmCount').innerText() })

  await page.getByRole('button', { name: 'Start CIP', exact: true }).click()
  qa.record('operator-cip-state', (await state.innerText()) === 'CIP_PRE_RINSE', { actual: await state.innerText() })
  qa.record('operator-cip-mode', (await page.locator('#mode').innerText()) === 'cip', { actual: await page.locator('#mode').innerText() })
  await page.getByRole('button', { name: 'Stop', exact: true }).click()
  qa.record('operator-stop-state', (await state.innerText()) === 'IDLE', { actual: await state.innerText() })

  const focus = await qa.focus(page)
  qa.record('operator-keyboard-focus', Boolean(focus?.visible && focus?.focusVisible), { focus })
  const animations = await page.evaluate(() => document.getAnimations().filter((item) => item.playState === 'running').length)
  qa.record('operator-reduced-motion', animations === 0, { animations })
  qa.healthy('operator', health)
  qa.evidence.operator = {
    states: ['IDLE', 'CHARGE_WATER', 'FAULT', 'IDLE', 'CIP_PRE_RINSE', 'IDLE'],
    focus,
    runningAnimationsReducedMotion: animations,
  }
  await context.close()
}

export async function testStudio(browser, qa) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const health = await qa.inspect(page, '/studio/', 'Engineering Studio - OIA', 'Engineering Studio')
  const assets = await page.locator('.asset').count()
  const signals = await page.locator('#signals tr').count()
  const requirements = await page.locator('#requirements .req').count()
  qa.record('studio-assets-loaded', assets === 6, { assets })
  qa.record('studio-signals-loaded', signals === 5, { signals })
  qa.record('studio-requirements-loaded', requirements === 12, { requirements })
  await page.locator('#filter').fill('TK-101')
  const filtered = await page.locator('.asset').count()
  qa.record('studio-filter', filtered === 1, { filtered })
  await page.locator('.asset').first().click()
  qa.record('studio-inspector', (await page.locator('#inspector').innerText()).includes('TK-101'))
  await page.getByRole('button', { name: 'Validate model', exact: true }).click()
  const validation = await page.locator('#validation').innerText()
  qa.record('studio-validation', validation === 'Model validation passed', { validation })
  await page.screenshot({ path: `${qa.captureRoot}/${qa.mode}-05-studio-filtered.png`, fullPage: true })
  qa.healthy('studio', health)
  qa.evidence.studio = { assets, filtered, signals, requirements, validation }
  await context.close()
}

export async function testResponsive(browser, qa, route, heading, name) {
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const mobilePage = await mobileContext.newPage()
  const mobileHealth = qa.observe(mobilePage)
  const mobileResponse = await mobilePage.goto(qa.url(route), { waitUntil: 'networkidle' })
  const mobile = await qa.containment(mobilePage)
  qa.record(`${name}-mobile-http`, mobileResponse?.status() === 200, { status: mobileResponse?.status() })
  qa.record(`${name}-mobile-heading`, await mobilePage.getByRole('heading', { name: heading, exact: true }).isVisible())
  qa.record(`${name}-mobile-overflow`, mobile.overflow <= 4, mobile)
  let scroller = null
  if (route === '/demo/') {
    scroller = await mobilePage.evaluate(() => {
      const mimic = document.querySelector('.mimic')
      if (!(mimic instanceof HTMLElement)) return null
      return { clientWidth: mimic.clientWidth, scrollWidth: mimic.scrollWidth, overflowX: getComputedStyle(mimic).overflowX }
    })
    qa.record('operator-mobile-contained-scroller', Boolean(scroller && scroller.clientWidth > 0 && scroller.scrollWidth > scroller.clientWidth && ['auto', 'scroll'].includes(scroller.overflowX)), { scroller })
  }
  await mobilePage.screenshot({ path: `${qa.captureRoot}/${qa.mode}-mobile-${name}.png`, fullPage: true })
  qa.healthy(`${name}-mobile`, mobileHealth)
  await mobileContext.close()

  const zoomContext = await browser.newContext({ viewport: { width: 720, height: 900 }, reducedMotion: 'reduce' })
  const zoomPage = await zoomContext.newPage()
  const zoomHealth = qa.observe(zoomPage)
  const zoomResponse = await zoomPage.goto(qa.url(route), { waitUntil: 'networkidle' })
  await zoomPage.evaluate(() => { document.documentElement.style.zoom = '2' })
  await zoomPage.waitForTimeout(200)
  const zoom = await qa.containment(zoomPage)
  const controls = await zoomPage.locator('button:visible, a:visible, input:visible, select:visible').count()
  qa.record(`${name}-zoom-http`, zoomResponse?.status() === 200, { status: zoomResponse?.status() })
  qa.record(`${name}-zoom-heading`, await zoomPage.getByRole('heading', { name: heading, exact: true }).isVisible())
  qa.record(`${name}-zoom-overflow`, zoom.overflow <= 4, zoom)
  qa.record(`${name}-zoom-controls`, controls > 0, { controls })
  await zoomPage.screenshot({ path: `${qa.captureRoot}/${qa.mode}-zoom-${name}.png`, fullPage: false })
  qa.healthy(`${name}-zoom`, zoomHealth)
  await zoomContext.close()
  qa.evidence.responsive[name] = { mobile, scroller, zoom, visibleControlsAtZoom: controls }
}
