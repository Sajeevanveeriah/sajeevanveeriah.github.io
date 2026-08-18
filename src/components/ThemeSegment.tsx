'use client'

import { useEffect, useState } from 'react'

type Mode = 'light' | 'dark'

const options: readonly { readonly value: Mode; readonly label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

function stored(): Mode | null {
  const value = window.localStorage.getItem('sv-theme')
  return value === 'light' || value === 'dark' ? value : null
}

/**
 * Two labelled options plus the system preference as the default when nothing
 * is stored. The inline head script in layout.tsx applies the stored theme
 * before first paint, so this component only has to stay in step with it.
 */
export function ThemeSegment() {
  const [mode, setMode] = useState<Mode>('light')

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const resolve = (): Mode => stored() ?? (media.matches ? 'dark' : 'light')
    const initial = resolve()
    setMode(initial)
    document.documentElement.dataset.theme = initial

    const sync = () => {
      if (stored()) return
      const next = resolve()
      setMode(next)
      document.documentElement.dataset.theme = next
    }
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  function pick(next: Mode) {
    setMode(next)
    window.localStorage.setItem('sv-theme', next)
    document.documentElement.dataset.theme = next
  }

  return (
    <div className="seg" role="group" aria-label="Colour theme">
      {options.map((option) => (
        <label className="seg-opt" key={option.value}>
          <input
            type="radio"
            name="theme"
            value={option.value}
            checked={mode === option.value}
            onChange={() => pick(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}
