import { createQA } from './qa-oia-lib.mjs'
import { testDocumentation, testOperator, testResponsive, testStudio } from './qa-oia-tests.mjs'

const qa = createQA()
await qa.start()
let browser
try {
  browser = await qa.launch()
  await testDocumentation(browser, qa)
  await testOperator(browser, qa)
  await testStudio(browser, qa)
  await testResponsive(browser, qa, '/', 'Technical documentation', 'documentation')
  await testResponsive(browser, qa, '/demo/', 'Mixing, dosing and CIP', 'operator')
  await testResponsive(browser, qa, '/studio/', 'Engineering Studio', 'studio')
} finally {
  if (browser) await browser.close()
  await qa.finish()
}
