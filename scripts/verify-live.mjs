// Verifies a live deployment after release. Usage:
//   node scripts/verify-live.mjs                 -> production Worker, every sitemap route
//   node scripts/verify-live.mjs --mirror URL    -> GitHub Pages redirect mirror
// Retries while the edge picks up the new release.
import { readFileSync } from 'node:fs'
import { sitemapRoutes, siteURL } from './routes.mjs'

const mirrorIndex = process.argv.indexOf('--mirror')
const mirror = mirrorIndex > -1 ? process.argv[mirrorIndex + 1] : null
const release = process.env.GITHUB_SHA
const routes = sitemapRoutes()
const attempts = Number(process.env.LIVE_ATTEMPTS ?? 60)

async function get(url) {
  const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}release=${Date.now()}`, { headers: { 'cache-control': 'no-cache' }, redirect: 'follow' })
  return { response, body: Buffer.from(await response.arrayBuffer()) }
}

async function checkProduction() {
  const problems = []
  for (const route of routes) {
    const { response, body } = await get(siteURL + route)
    if (response.status !== 200) problems.push(`${route}: HTTP ${response.status}`)
    else if (!body.toString().includes(`<link rel="canonical" href="${siteURL}${route}"`)) problems.push(`${route}: canonical mismatch`)
  }
  const home = await get(siteURL + '/')
  if (release && !home.body.toString().includes(`content="${release}"`)) problems.push(`home: release ${release} not live yet`)
  if (home.response.headers.get('x-content-type-options') !== 'nosniff') problems.push('home: security headers missing')
  const pdf = await get(siteURL + '/assets/Resume_Sajeevan_Veeriah.pdf')
  if (!pdf.body.equals(readFileSync('public/assets/Resume_Sajeevan_Veeriah.pdf'))) problems.push('resume PDF differs from the repository')
  const feed = await get(siteURL + '/blog/feed.xml')
  if (feed.response.status !== 200 || !feed.body.toString().includes('<rss')) problems.push('RSS feed unavailable')
  const missing = await get(siteURL + '/missing-route-check/')
  if (missing.response.status !== 404) problems.push(`404 route returned HTTP ${missing.response.status}`)
  return problems
}

async function checkMirror(base) {
  const problems = []
  for (const route of routes) {
    const { response, body } = await get(base + route)
    const html = body.toString()
    if (response.status !== 200) problems.push(`${route}: HTTP ${response.status}`)
    else if (!html.includes(`url=${siteURL}${route}`) || !html.includes(`rel="canonical" href="${siteURL}${route}"`)) problems.push(`${route}: does not redirect to ${siteURL}${route}`)
    else if (release && !html.includes(release)) problems.push(`${route}: release ${release} not live yet`)
  }
  return problems
}

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  const problems = mirror ? await checkMirror(mirror.replace(/\/$/, '')) : await checkProduction()
  if (!problems.length) {
    console.log(`${mirror ? `Mirror ${mirror}` : siteURL}: ${routes.length} routes verified on attempt ${attempt}${release ? ` for release ${release}` : ''}`)
    process.exit(0)
  }
  console.log(`Attempt ${attempt}: ${problems.slice(0, 5).join('; ')}${problems.length > 5 ? ` (+${problems.length - 5} more)` : ''}`)
  await new Promise((wait) => setTimeout(wait, 5000))
}
console.error('Live verification failed')
process.exit(1)
