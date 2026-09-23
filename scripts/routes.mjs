// One route list for every check: the exported sitemap is generated from the
// same content as the pages, so QA, Lighthouse and deployment checks cannot drift.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const siteURL = 'https://sv.sajeevanveeriah.workers.dev'

export function sitemapRoutes(root = resolve('out')) {
  const xml = readFileSync(resolve(root, 'sitemap.xml'), 'utf8')
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname)
  if (routes.length < 10) throw new Error(`sitemap.xml lists only ${routes.length} routes`)
  return routes
}
