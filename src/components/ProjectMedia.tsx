import Image from "next/image";
export function ProjectMedia({
  image,
  priority = false,
}: {
  image: {
    src: string;
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
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={priority}
          sizes="(max-width: 760px) 100vw, 60vw"
        />
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
