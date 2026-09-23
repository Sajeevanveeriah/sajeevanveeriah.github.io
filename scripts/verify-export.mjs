// Checks the static export before any deployment.
import { readFileSync, statSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import assert from 'node:assert/strict'
import { sitemapRoutes } from './routes.mjs'

const root = resolve('out')
const routes = sitemapRoutes(root)
const required = [
  '404.html', '.nojekyll', '_headers', 'BingSiteAuth.xml', 'googlebcce96f6b520ab1f.html',
  'robots.txt', 'sitemap.xml', 'blog/feed.xml', 'favicon.png',
  'assets/Resume_Sajeevan_Veeriah.pdf', 'assets/20260903-Robotics-Learning-Roadmap-Rev00.docx',
  'assets/image/20260827-Sajeevan-Veeriah-SV-Logo-Rev00.webp',
  ...routes.map((route) => join(route, 'index.html').replace(/^\//, '')),
]
for (const file of required) assert.ok(statSync(join(root, file), { throwIfNoEntry: false })?.size > 0 || file === '.nojekyll' && existsSync(join(root, file)), `missing or empty out/${file}`)
assert.ok(!existsSync(join(root, 'assets/Resume_Sajeevan_Veeriah.docx')), 'the DOCX resume must not be published')
assert.deepEqual(readFileSync(join(root, 'assets/Resume_Sajeevan_Veeriah.pdf')), readFileSync('public/assets/Resume_Sajeevan_Veeriah.pdf'))
execFileSync('unzip', ['-tq', join(root, 'assets/20260903-Robotics-Learning-Roadmap-Rev00.docx')])
const home = readFileSync(join(root, 'index.html'), 'utf8')
for (const text of ['Robotics, Mechatronics, AI/ML &amp; End-To-End Automation Engineer', 'One system, six layers', 'Resume_Sajeevan_Veeriah.pdf', 'Complete project index']) {
  assert.ok(home.includes(text), `home page is missing "${text}"`)
}
const feed = readFileSync(join(root, 'blog/feed.xml'), 'utf8')
assert.equal((feed.match(/<item>/g) ?? []).length, routes.filter((r) => /^\/blog\/.+\//.test(r)).length, 'RSS items must match published posts')
console.log(`Export verified: ${routes.length} sitemap routes, ${required.length} required files`)
