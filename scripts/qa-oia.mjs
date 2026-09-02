import { createQA } from './qa-oia-lib.mjs'
import { testPortableAssets, testResponsive, testSuite } from './qa-oia-tests.mjs'

const qa = createQA()
await qa.start()
let browser
try {
  browser = await qa.launch()
  await testSuite(browser, qa)
  await testPortableAssets(browser, qa)
  await testResponsive(browser, qa)
} finally {
  if (browser) await browser.close()
  await qa.finish()
}
