'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Monitor, Moon, Sun } from 'lucide-react'
import styles from './ThemeToggle.module.css'

const ORDER = ['system', 'light', 'dark'] as const
type ThemeChoice = (typeof ORDER)[number]

const LABEL: Record<ThemeChoice, string> = {
  system: 'Colour theme: follow system',
  light: 'Colour theme: light',
  dark: 'Colour theme: dark',
}

const ICON: Record<ThemeChoice, typeof Monitor> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // The server cannot know the visitor's stored choice, so the control only
  // renders its real state after hydration. Until then it renders a
  // same-sized inert placeholder, which holds layout and keeps CLS at zero.
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <span className={styles.placeholder} aria-hidden="true" />
  }

  const current: ThemeChoice = ORDER.includes(theme as ThemeChoice)
    ? (theme as ThemeChoice)
    : 'system'
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length] ?? 'system'
  const Icon = ICON[current]

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setTheme(next)}
      aria-label={LABEL[current]}
      title={LABEL[current]}
    >
      <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
    </button>
  )
}
