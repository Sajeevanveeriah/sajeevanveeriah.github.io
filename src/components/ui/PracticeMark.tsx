import { practice } from '@/content/practice'
import s from './PracticeMark.module.css'

/**
 * The Independent Engineering Practice lockup, theme aware.
 *
 * Requirements this has to meet at once: correct on first paint, correct
 * after a manual theme toggle, correct on a system-preference change with
 * no stored choice, no hydration mismatch, no flash of the wrong artwork,
 * no layout shift, and exactly one accessible name.
 *
 * How it is built, and why not the obvious alternatives:
 *
 *   - It is a CSS background rather than an `<img>` whose `src` is swapped in
 *     React. A React swap cannot know the theme during server rendering, so
 *     it either mismatches on hydration or paints the light lockup first and
 *     flips. The theme is already resolved before first paint by the blocking
 *     inline script in `layout.tsx`, which writes `data-theme` on `<html>`;
 *     keying off that attribute in CSS means the correct artwork is chosen by
 *     the style engine before anything paints, with no JavaScript of its own.
 *   - It is one element, not two `<img>` tags toggled with `display: none`.
 *     Two images would put the same logo into the accessibility tree twice
 *     if either rule ever failed, and would make the browser fetch both.
 *     One element with a theme-keyed `background-image` fetches exactly the
 *     artwork that is shown.
 *   - `role="img"` plus `aria-label` gives the mark one accessible name, the
 *     same name in both themes.
 *   - The two theme blocks in `PracticeMark.module.css` mirror the two
 *     activation blocks in `tokens.css` exactly: the attribute block for an
 *     explicit choice, and `html:not([data-theme])` inside a
 *     `prefers-color-scheme` query for the JavaScript-disabled case. If those
 *     ever diverge, the logo and the page ground disagree, which is the one
 *     failure this component exists to prevent.
 *   - No filter, inversion or recolouring is used anywhere. Each theme gets
 *     the artwork Saj drew for it.
 *
 * The plate holds a fixed aspect ratio and both crops resolve to it, so
 * toggling the theme changes the artwork inside a box that never moves.
 */
export function PracticeMark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label={practice.logo.alt}
      className={`${s.mark} ${className ?? ''}`}
    />
  )
}
