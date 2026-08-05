'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ProjectVideo as VideoMeta, ProjectImage as ImageMeta } from '@/content/projects'
import { ProjectImage } from '@/components/ui/ProjectImage'

/**
 * Detail-page demonstration clip.
 *
 * A muted, looping, inline video that behaves like the site's other motion:
 * it runs only while it is actually watchable and it never outranks the
 * reader. Concretely:
 *
 * - The record's static image is the poster and the failure fallback, so the
 *   first paint is identical to the image-only page and a network or decode
 *   failure degrades to exactly what the page showed before videos existed.
 * - Autoplay is decided in an effect, never as a server-rendered attribute:
 *   the exported HTML carries a still poster, which keeps the no-JavaScript
 *   and reduced-motion states correct by construction and cannot mismatch on
 *   hydration.
 * - Under `prefers-reduced-motion: reduce` nothing plays until the visitor
 *   presses play, and a deliberate pause is never overridden by the
 *   visibility logic. Leaving the viewport or hiding the tab pauses playback;
 *   scrolling back resumes it only when autoplay is still appropriate.
 * - `preload="metadata"` so the page requests headers and the index, not the
 *   clip; the bytes stream on play. Only the active record's clip is ever
 *   referenced because videos render on the detail route alone.
 */
export function ProjectVideo({ video, fallback }: { video: VideoMeta; fallback?: ImageMeta }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // A deliberate visitor pause outranks every automatic resume.
  const userPausedRef = useRef(false)
  const inViewRef = useRef(false)
  const reducedRef = useRef(false)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)

  const poster = video.poster ?? fallback?.src

  const tryPlay = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    // Muted is asserted on the element, not only as JSX: React does not
    // serialise the muted attribute into server HTML, and an unmuted start
    // is never acceptable for an autoplaying clip with an audio track.
    el.muted = true
    el.play().catch(() => {
      // Autoplay refused (policy, data saver). The poster stays and the
      // control still offers a deliberate start.
      setPlaying(false)
    })
  }, [])

  const autoResume = useCallback(() => {
    if (userPausedRef.current || reducedRef.current) return
    if (!inViewRef.current || document.visibilityState === 'hidden') return
    tryPlay()
  }, [tryPlay])

  useEffect(() => {
    const el = videoRef.current
    const wrap = wrapRef.current
    if (!el || !wrap) return

    // A load failure can fire before hydration attaches React's handlers,
    // so the mount both inspects the element's current error state and
    // listens natively. NETWORK_NO_SOURCE (3) means source selection failed.
    const markFailed = () => setFailed(true)
    const source = el.querySelector('source')
    if (el.error || el.networkState === 3) markFailed()
    el.addEventListener('error', markFailed)
    source?.addEventListener('error', markFailed)

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedRef.current = media.matches
    const onMotionChange = () => {
      reducedRef.current = media.matches
      if (media.matches) el.pause()
      else autoResume()
    }
    media.addEventListener('change', onMotionChange)

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        inViewRef.current = entry.isIntersecting
        if (entry.isIntersecting) autoResume()
        else el.pause()
      },
      { threshold: 0.25 },
    )
    observer.observe(wrap)

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') el.pause()
      else autoResume()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      el.removeEventListener('error', markFailed)
      source?.removeEventListener('error', markFailed)
      media.removeEventListener('change', onMotionChange)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [autoResume])

  const toggle = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      userPausedRef.current = false
      tryPlay()
    } else {
      userPausedRef.current = true
      el.pause()
    }
  }

  if (failed && fallback) {
    return <ProjectImage image={fallback} priority />
  }

  const style = {
    '--media-ratio': video.aspectRatio ?? `${video.width} / ${video.height}`,
    '--media-ratio-mobile': video.aspectRatio ?? `${video.width} / ${video.height}`,
  } as React.CSSProperties

  return (
    <div
      ref={wrapRef}
      className="project-media project-media-video"
      data-mode={video.displayMode ?? 'contain'}
      data-background={video.background ?? 'neutral'}
      style={style}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        width={video.width}
        height={video.height}
        aria-label={video.label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      >
        <source src={video.src} type={video.type} onError={() => setFailed(true)} />
      </video>
      <button
        type="button"
        className="video-control"
        onClick={toggle}
        aria-label={playing ? 'Pause demonstration video' : 'Play demonstration video'}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          {playing ? (
            <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
          ) : (
            <path d="M4.5 2.5l9 5.5-9 5.5z" />
          )}
        </svg>
      </button>
    </div>
  )
}
