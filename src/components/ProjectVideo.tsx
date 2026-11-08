export function ProjectVideo({
  video,
}: {
  video: {
    src: string;
    poster: string;
    width: number;
    height: number;
    label: string;
    kind: string;
  };
}) {
  return (
    <figure className="project-media project-video">
      <video
        controls
        playsInline
        preload="none"
        poster={video.poster}
        width={video.width}
        height={video.height}
        aria-label={video.label}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <figcaption>
        {video.kind}
        <a href={video.src} target="_blank" rel="noopener noreferrer">
          Open video file
        </a>
      </figcaption>
    </figure>
  );
}
