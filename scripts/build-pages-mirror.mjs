// Turns the static export into the GitHub Pages mirror. The production site is
// the Cloudflare Worker; every HTML route on github.io becomes a redirect to the
// same path there, with a canonical link so search engines consolidate on one domain.
// Assets stay in place so old direct links to files keep working.
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import { siteURL } from './routes.mjs'

const source = resolve('out')
const target = resolve('out-pages')
const release = process.env.GITHUB_SHA ?? 'local'
const keep = new Set(['googlebcce96f6b520ab1f.html'])

const escape = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const stub = (url) => `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="portfolio-release" content="${release}">
<title>Sajeevan Veeriah has moved</title>
<link rel="canonical" href="${escape(url)}">
<meta http-equiv="refresh" content="0; url=${escape(url)}">
<script>location.replace(${JSON.stringify(url)} + location.search + location.hash)</script>
</head>
<body>
<p>This portfolio now lives at <a href="${escape(url)}">${escape(url)}</a>.</p>
</body>
</html>
`

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else yield path
  }
}

await rm(target, { recursive: true, force: true })
await cp(source, target, { recursive: true })
await rm(join(target, '_headers'), { force: true })
await rm(join(target, 'sitemap.xml'), { force: true })
let pages = 0
for await (const file of walk(target)) {
  const path = relative(target, file).split(sep).join('/')
  if (!path.endsWith('.html') || keep.has(path)) continue
  if (path === '404.html') {
    await writeFile(file, stub(`${siteURL}/`).replace(`location.replace(${JSON.stringify(`${siteURL}/`)} + location.search + location.hash)`, `location.replace(${JSON.stringify(siteURL)} + location.pathname + location.search + location.hash)`))
  } else {
    const route = '/' + path.replace(/index\.html$/, '').replace(/\.html$/, '/')
    await writeFile(file, stub(siteURL + route))
  }
  pages += 1
}
await writeFile(join(target, 'robots.txt'), `User-Agent: *\nAllow: /\n\nSitemap: ${siteURL}/sitemap.xml\n`)
const home = await readFile(join(target, 'index.html'), 'utf8')
if (!home.includes(`url=${siteURL}/`)) throw new Error('mirror home page does not redirect')
console.log(`GitHub Pages mirror: ${pages} HTML files now redirect to ${siteURL}`)
