import type { NextConfig } from 'next'

/**
 * GitHub Pages static export.
 *
 * This is a GitHub *user* site served from the domain root
 * (https://sajeevanveeriah.github.io/), confirmed in Phase 0 by the absence
 * of a CNAME file. A user site therefore needs no basePath and no
 * assetPrefix: adding either would break every asset path.
 *
 * trailingSlash keeps every route an index.html inside its own directory, so
 * Pages resolves /work/ and /work/some-slug/ without a server rewrite.
 *
 * images.unoptimized is mandatory: the Next image optimiser is a runtime
 * service and does not exist in a static export. Images are therefore
 * pre-compressed at build authoring time instead (AVIF with WebP fallback),
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
