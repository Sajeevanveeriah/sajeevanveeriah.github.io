'use client'

import { useEffect, useRef, useState } from 'react'
import type { VideoAsset } from '@/content/media'
import { PictureMedia } from './PictureMedia'

/**
 * Silent looping engineering demo video:
 * - Pauses off-screen and when the page tab is hidden
 * - Falls back to the static 16:9 poster under prefers-reduced-motion: reduce
 * - Exposes a 44px pause/play button for explicit user control
 */
export function LoopingVideo({
  video,
  priority = false,
  compact = false,
  showCaption = true,
}: {
  readonly video: VideoAsset
  readonly priority?: boolean
  readonly compact?: boolean
  readonly showCaption?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(mq.matches)
    syncMotion()
    mq.addEventListener('change', syncMotion)
    return () => mq.removeEventListener('change', syncMotion)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || reducedMotion) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting)
        setInView(visible)
      },
      { threshold: 0.15, rootMargin: '80px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    const el = videoRef.current
    if (!el || reducedMotion) return

    const syncPlayback = () => {
      if (document.hidden || userPaused || !inView) {
        if (!el.paused) el.pause()
      } else {
        const playPromise = el.play()
        if (playPromise) {
          playPromise.catch(() => setUserPaused(true))
        }
      }
    }

    syncPlayback()
    document.addEventListener('visibilitychange', syncPlayback)
    return () => document.removeEventListener('visibilitychange', syncPlayback)
  }, [inView, userPaused, reducedMotion])

  return (
    <div ref={containerRef} className={`looping-video-frame${compact ? ' compact' : ''}`}>
      {reducedMotion ? (
        <PictureMedia media={video.poster} priority={priority} />
      ) : (
        <>
          <PictureMedia media={video.poster} priority={priority} className="loop-poster-fallback" />
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={video.poster.webp}
            width={video.poster.width}
            height={video.poster.height}
            aria-label={video.label}
          >
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </video>
          <button
            type="button"
            className="loop-control js-only"
            aria-pressed={userPaused}
            aria-label={userPaused ? `Play ${video.caption}` : `Pause ${video.caption}`}
            onClick={() => setUserPaused((p) => !p)}
          >
            {userPaused ? 'Play' : 'Pause'}
          </button>
        </>
      )}
      {showCaption && (
        <div className="loop-caption">
          <span>{video.caption}</span>
          <span>16:9 loop</span>
        </div>
      )}
    </div>
  )
}
