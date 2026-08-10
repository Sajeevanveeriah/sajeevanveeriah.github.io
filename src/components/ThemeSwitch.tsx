'use client'

import { useEffect, useRef, useState } from 'react'

type Mode = 'system' | 'light' | 'dark'
const modes: readonly Mode[] = ['system', 'light', 'dark']

function apply(mode: Mode) {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.dataset.theme = mode === 'system' ? (dark ? 'dark' : 'light') : mode
}

export function ThemeSwitch() {
  const [mode, setMode] = useState<Mode>('system')
  const modeRef = useRef<Mode>('system')

  useEffect(() => {
    const stored = window.localStorage.getItem('sv-theme')
    const initial = modes.includes(stored as Mode) ? (stored as Mode) : 'system'
    modeRef.current = initial
    setMode(initial)
    apply(initial)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => modeRef.current === 'system' && apply('system')
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  function cycle() {
    const next = modes[(modes.indexOf(mode) + 1) % modes.length] ?? 'system'
    modeRef.current = next
    setMode(next)
    window.localStorage.setItem('sv-theme', next)
    apply(next)
  }

  return (
    <button className="theme-switch" type="button" onClick={cycle} aria-label={`Theme: ${mode}. Activate to change theme.`}>
      <span aria-hidden="true" className="theme-symbol">{mode === 'dark' ? '◐' : mode === 'light' ? '○' : '◒'}</span>
      <span>{mode}</span>
    </button>
  )
}
