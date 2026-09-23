import type { NextConfig } from 'next'

/**
 * Static export served by the Cloudflare Worker `sv`
 * (https://sv.sajeevanveeriah.workers.dev/) from the domain root, so no
 * basePath or assetPrefix. The same export feeds the GitHub Pages redirect
 * mirror (scripts/build-pages-mirror.mjs).
 *
 * trailingSlash keeps every route an index.html inside its own directory, so
 * /work/ and /work/some-slug/ resolve without a server rewrite.
 *
 * images.unoptimized is mandatory: the Next image optimiser is a runtime
 * service and does not exist in a static export. Images are pre-compressed
 * and every <img> carries explicit width and height to hold CLS at zero.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
}

export default nextConfig
