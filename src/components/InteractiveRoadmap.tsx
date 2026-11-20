'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { learningMonths } from '@/content/learning'
import { ArrowUpRight } from './icons'

export function InteractiveRoadmap() {
  const [selected, setSelected] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const current = learningMonths[selected] ?? learningMonths[0]

  function onKey(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? (index + 1) % learningMonths.length
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? (index + learningMonths.length - 1) % learningMonths.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? learningMonths.length - 1
              : null
    if (next === null) return
    e.preventDefault()
    setSelected(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="roadmap-interactive" data-testid="interactive-roadmap">
      <div className="roadmap-tabs" role="tablist" aria-label="Six-month robotics roadmap phases">
        {learningMonths.map((item, idx) => (
          <button
            key={item.month}
            ref={(el) => {
              tabRefs.current[idx] = el
            }}
            type="button"
            role="tab"
            id={`roadmap-tab-${item.month}`}
            aria-selected={selected === idx}
            aria-controls="roadmap-phase-panel"
            tabIndex={selected === idx ? 0 : -1}
            className={`roadmap-phase-btn${selected === idx ? ' active' : ''}`}
            onClick={() => setSelected(idx)}
            onKeyDown={(e) => onKey(e, idx)}
          >
            <span>Month {item.month}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>

      <article
        id="roadmap-phase-panel"
        role="tabpanel"
        aria-labelledby={`roadmap-tab-${current.month}`}
        className="roadmap-panel"
      >
        <div className="roadmap-panel-head">
          <p className="eyebrow">Month {current.month} of 06</p>
          <h3>{current.title}</h3>
          <p>{current.focus}</p>
        </div>
        <p className="roadmap-build">
          <strong>Build milestone:</strong> {current.build}
        </p>
        <div className="roadmap-resources">
          <h4>Verified study resources</h4>
          <ul>
            {current.resources.map(([label, url]) => (
              <li key={url}>
                <a className="text-link" href={url} target="_blank" rel="noopener noreferrer">
                  {label} <ArrowUpRight />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  )
}
