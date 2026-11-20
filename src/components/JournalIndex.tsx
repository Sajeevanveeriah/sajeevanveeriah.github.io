'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPostMedia } from '@/content/media'
import { PictureMedia } from './PictureMedia'
import { LoopingVideo } from './LoopingVideo'

export type JournalEntry = {
  slug: string
  title: string
  description: string
  date: string
  displayDate: string
  topic: string
  minutes: number
  image?: { src: string; alt: string; width: number; height: number }
}

function Meta({ entry }: { entry: JournalEntry }) {
  return (
    <p className="post-meta">
      <span className="topic">{entry.topic}</span>
      <time dateTime={entry.date}>{entry.displayDate}</time>
      <span>{entry.minutes} min read</span>
    </p>
  )
}

export function JournalIndex({ entries, topics }: { entries: JournalEntry[]; topics: readonly string[] }) {
  const [topic, setTopic] = useState('All')
  useEffect(() => {
    const sync = () => {
      const t = new URLSearchParams(location.search).get('topic') ?? 'All'
      setTopic(topics.includes(t) ? t : 'All')
    }
    sync()
    addEventListener('popstate', sync)
    return () => removeEventListener('popstate', sync)
  }, [topics])

  function select(next: string) {
    setTopic(next)
    const url = new URL(location.href)
    if (next === 'All') url.searchParams.delete('topic')
    else url.searchParams.set('topic', next)
    history.replaceState(null, '', url)
  }

  const shown = entries.filter((e) => topic === 'All' || e.topic === topic)
  const [lead, ...rest] = topic === 'All' ? shown : [undefined, ...shown]

  function renderLeadVisual(slug: string) {
    const rich = getPostMedia(slug)
    return (
      <div className="media-frame">
        {rich.video ? <LoopingVideo video={rich.video} priority showCaption={false} /> : <PictureMedia media={rich.image} priority />}
      </div>
    )
  }

  function renderCardVisual(slug: string) {
    const rich = getPostMedia(slug)
    return (
      <div className="media-frame">
        {rich.video ? <LoopingVideo video={rich.video} showCaption={false} /> : <PictureMedia media={rich.image} />}
      </div>
    )
  }

  return (
    <>
      <div className="filters journal-controls">
        <div className="segmented" role="group" aria-label="Filter posts by topic">
          {['All', ...topics].map((t) => (
            <button type="button" key={t} aria-pressed={topic === t} onClick={() => select(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <p className="result-count" role="status">
        {shown.length} {shown.length === 1 ? 'post' : 'posts'}
      </p>
      {lead && (
        <article className="post-feature">
          {renderLeadVisual(lead.slug)}
          <div>
            <Meta entry={lead} />
            <h2>
              <Link prefetch={false} href={`/blog/${lead.slug}/`}>
                {lead.title}
              </Link>
            </h2>
            <p>{lead.description}</p>
          </div>
        </article>
      )}
      <div className="post-grid">
        {rest
          .filter((e): e is JournalEntry => Boolean(e))
          .map((entry) => (
            <article className="post-card" key={entry.slug}>
              {renderCardVisual(entry.slug)}
              <Meta entry={entry} />
              <h2 className="post-card-title">
                <Link prefetch={false} href={`/blog/${entry.slug}/`}>
                  {entry.title}
                </Link>
              </h2>
              <p>{entry.description}</p>
            </article>
          ))}
      </div>
    </>
  )
}
