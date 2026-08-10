/**
 * One IntersectionObserver for the whole page.
 *
 * Every reveal, every cascading group and the career spine register with the
 * same instance. The previous arrangement built one observer per mounted
 * component, which on the About page meant a fresh observer for each spine,
 * each credential card and each stage heading: a dozen observers all watching
 * the same scroll on the same root with the same options. One does the job.
 *
 * Vanilla on purpose. No library, no framework binding, nothing imported. The
 * only thing this writes to an element is a `data-shown` attribute and a
 * temporary `will-change`; every movement is declared in CSS, which is what
 * lets the reduced-motion block cancel all of it without this file knowing.
 */

/**
 * How long to keep `will-change` on a revealed element.
 *
 * `will-change` is a promise to the compositor that costs memory, so it must
 * never be left on. The spec asks for it only while an element is in view;
 * the honest implementation of that, for a reveal that runs once and is then
 * unobserved, is to raise it as the element commits to arriving and drop it
 * as soon as the arrival has finished. `transitionend` does that when a
 * transition actually runs, and this timer is the backstop for the cases
 * where one never fires: a cancelled transition, or reduced motion, where the
 * element resolves instantly and there is nothing to listen for.
 */
const SETTLE_MS = 900

/**
 * The operative threshold. A block commits to arriving once it is meaningfully
 * on screen rather than the instant one pixel of it clears the fold. `0` is
 * carried alongside it only so a block taller than the viewport, which can
 * never reach a 15 per cent ratio, still receives a callback at all.
 */
const THRESHOLD = 0.15

let observer: IntersectionObserver | null = null

function release(el: HTMLElement): void {
  el.style.willChange = ''
}

function reveal(el: HTMLElement): void {
  el.style.willChange = 'opacity, transform'
  el.setAttribute('data-shown', '')

  const done = () => {
    release(el)
    el.removeEventListener('transitionend', done)
  }
  el.addEventListener('transitionend', done)
  window.setTimeout(done, SETTLE_MS)
}

function onEntries(entries: IntersectionObserverEntry[], self: IntersectionObserver): void {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue

    // A block taller than the viewport can never reach the threshold, so
    // gating purely on the ratio would leave the longest sections on the site
    // permanently hidden. Those reveal as soon as they intersect at all.
    const rootHeight = entry.rootBounds?.height ?? window.innerHeight
    const tall = entry.boundingClientRect.height > rootHeight
    if (!tall && entry.intersectionRatio < THRESHOLD) continue

    // Once shown, always shown. Unobserving here is what keeps the single
    // observer's element set shrinking as the reader moves down the page.
    self.unobserve(entry.target)
    reveal(entry.target as HTMLElement)
  }
}

function shared(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null
  if (!observer) {
    observer = new IntersectionObserver(onEntries, {
      // Holds the trigger line just above the viewport bottom, so a block
      // arrives as the reader reaches it rather than as it clips the edge.
      rootMargin: '0px 0px -8% 0px',
      threshold: [0, THRESHOLD],
    })
  }
  return observer
}

/**
 * Register an element for its one and only reveal.
 *
 * Returns an unobserve function for React's effect cleanup. Where
 * IntersectionObserver does not exist the element is shown immediately, which
 * is the same outcome the no-JavaScript path already produces: content is
 * never gated on an observer that cannot run.
 */
export function observeReveal(el: HTMLElement | null): () => void {
  if (!el) return () => {}

  const io = shared()
  if (!io) {
    el.setAttribute('data-shown', '')
    return () => {}
  }

  io.observe(el)
  return () => io.unobserve(el)
}
