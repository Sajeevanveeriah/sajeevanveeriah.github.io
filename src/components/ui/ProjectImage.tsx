/* eslint-disable @next/next/no-img-element --
   next/image is a pass-through under `images: { unoptimized: true }`, so it
   would add client JavaScript and no optimisation. AVIF and WebP derivatives
   are produced at authoring time instead. */
import type { ProjectImage as ImageMeta } from '@/content/projects'

/**
 * Static-export image.
 *
 * next/image is deliberately not used: `images: { unoptimized: true }` makes
 * it a pass-through, so it would add runtime JavaScript for nothing. A plain
 * <picture> offers the AVIF and WebP derivatives produced by
 * scripts/convert-images.mjs with the original as the final fallback.
 *
 * width and height are always explicit, which holds cumulative layout shift
 * at zero.
 */
export function ProjectImage({
  image,
  priority = false,
}: {
  image: ImageMeta
  priority?: boolean
}) {
  const isRaster = /\.(png|jpe?g)$/i.test(image.src)
  const stem = image.src.replace(/\.(png|jpe?g)$/i, '')

  if (!isRaster) {
    // SVG sources are already compact and need no derivatives.
    return (
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  return (
    <picture>
      <source srcSet={`${stem}.avif`} type="image/avif" />
      <source srcSet={`${stem}.webp`} type="image/webp" />
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  )
}
