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
  const style = {
    '--media-ratio': image.aspectRatio ?? `${image.width} / ${image.height}`,
    '--media-position': image.objectPosition ?? '50% 50%',
  } as React.CSSProperties
  const common = {
    width: image.width,
    height: image.height,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    fetchPriority: priority ? ('high' as const) : undefined,
    sizes: image.sizes ?? '(max-width: 767px) 100vw, (max-width: 1279px) 90vw, 1200px',
  }

  if (!isRaster) {
    // SVG sources are already compact and need no derivatives.
    return (
      <span className="project-media" data-mode={image.displayMode ?? 'contain'} data-background={image.background ?? 'neutral'} style={style}>
        <img src={image.src} alt={image.alt} {...common} />
      </span>
    )
  }

  return (
    <span className="project-media" data-mode={image.displayMode ?? 'contain'} data-background={image.background ?? 'neutral'} style={style}>
      <picture>
        {image.mobileSrc ? <source media="(max-width: 767px)" srcSet={image.mobileSrc} /> : null}
        <source srcSet={`${stem}.avif`} type="image/avif" />
        <source srcSet={`${stem}.webp`} type="image/webp" />
        <img src={image.src} alt={image.alt} {...common} />
      </picture>
    </span>
  )
}
