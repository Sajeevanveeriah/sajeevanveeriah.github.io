import type { MediaAsset } from '@/content/media'

export function PictureMedia({
  media,
  alt,
  priority = false,
  className = '',
  sizes = '(max-width: 720px) 94vw, (max-width: 1200px) 48vw, 580px',
}: {
  readonly media: MediaAsset
  readonly alt?: string
  readonly priority?: boolean
  readonly className?: string
  readonly sizes?: string
}) {
  return (
    <picture className={className ? `picture-media ${className}` : 'picture-media'}>
      <source type="image/avif" srcSet={media.avif} sizes={sizes} />
      <source type="image/webp" srcSet={media.webp} sizes={sizes} />
      <img
        src={media.jpg}
        alt={alt ?? media.alt}
        width={media.width}
        height={media.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  )
}
