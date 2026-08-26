'use client'

import { useEffect, useState } from 'react'

type Choice = 'light' | 'auto' | 'dark'
type Resolved = 'light' | 'dark'

const options: readonly { readonly value: Choice; readonly label: string; readonly hint: string }[] = [
  { value: 'light', label: 'Light', hint: 'Light theme' },
  { value: 'auto', label: 'Auto', hint: 'Follow the system theme' },
  { value: 'dark', label: 'Dark', hint: 'Dark theme' },
]

function stored(): Resolved | null {
  const value = window.localStorage.getItem('sv-theme')
  return value === 'light' || value === 'dark' ? value : null
}

/**
 * Three labelled options. Light and Dark are explicit choices that persist in
 * localStorage; Auto is the default and the reset, clears the stored choice
 * and follows the operating system preference live. The inline head script in
 * layout.tsx applies the resolved theme before first paint, so this component
 * only has to stay in step with it after hydration.
 */
export function ThemeSegment() {
  const [choice, setChoice] = useState<Choice>('auto')

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const systemTheme = (): Resolved => (media.matches ? 'dark' : 'light')
    const explicit = stored()
    setChoice(explicit ?? 'auto')
    document.documentElement.dataset.theme = explicit ?? systemTheme()

    const followSystem = () => {
      if (stored()) return
      document.documentElement.dataset.theme = systemTheme()
    }
    media.addEventListener('change', followSystem)
    return () => media.removeEventListener('change', followSystem)
  }, [])

  function pick(next: Choice) {
    setChoice(next)
    if (next === 'auto') {
      window.localStorage.removeItem('sv-theme')
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      return
    }
    window.localStorage.setItem('sv-theme', next)
    document.documentElement.dataset.theme = next
  }

  return (
    <div className="seg" role="group" aria-label="Colour theme">
      {options.map((option) => (
        <label className="seg-opt" key={option.value} title={option.hint}>
          <input
            type="radio"
            name="theme"
            value={option.value}
            checked={choice === option.value}
            onChange={() => pick(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}
