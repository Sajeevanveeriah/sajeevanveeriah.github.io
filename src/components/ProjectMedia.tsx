import Image from "next/image";
export function ProjectMedia({
  image,
  priority = false,
}: {
  image: {
    src: string;
    mobileSrc?: string;
    mobileWidth?: number;
    mobileHeight?: number;
    alt: string;
    width: number;
    height: number;
    kind?: string;
  };
  priority?: boolean;
}) {
  return (
    <figure className="project-media">
      <a
        href={image.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View full-size image: ${image.alt}`}
      >
        <picture>
          {image.mobileSrc && <source media="(max-width: 760px)" srcSet={image.mobileSrc} width={image.mobileWidth} height={image.mobileHeight} />}
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={priority}
            sizes="(max-width: 760px) 100vw, 60vw"
          />
        </picture>
      </a>
      <figcaption>
        {image.kind}
        <a href={image.src} target="_blank" rel="noopener noreferrer">
          Full-size image ↗
        </a>
      </figcaption>
    </figure>
  );
}
