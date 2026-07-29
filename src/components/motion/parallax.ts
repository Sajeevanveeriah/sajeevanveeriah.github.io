/**
 * One scroll listener and one requestAnimationFrame tick for every parallax
 * stage on the page.
 *
 * Per-element scroll listeners were the obvious shape and the wrong one: two
 * stages on the homepage would mean two listeners each doing their own layout
 * read, and every additional stage adds another. Instead stages register into
 * a single set, one passive listener requests a single frame, and that frame
 * reads each registered stage once.
 *
 * The tick writes only a custom property. It never writes a transform string:
 * the composition (translate plus rotate, scaled per layer by `--depth`) is
 * declared once in globals.css and CSS recomputes it from `--p`. That keeps
 * the layer's visual grammar in the stylesheet where it can be overridden by
 * `prefers-reduced-motion`, rather than in a script that would have to
 * re-check the media query on every frame.
 *
 * Stages outside the viewport are skipped and lose their `data-active`
 * attribute, which is what removes `will-change: transform` from their
 * layers. A `will-change` left on permanently promotes every layer on the
 * page to its own compositor tile whether or not it is being animated.
 */

const stages = new Set<HTMLElement>()
let frame = 0
let bound = false

function tick() {
  frame = 0
  const vh = window.innerHeight || document.documentElement.clientHeight

  for (const stage of stages) {
    const rect = stage.getBoundingClientRect()

    // Fully above or fully below the viewport: no work, and drop the
    // compositor hint.
    if (rect.bottom <= 0 || rect.top >= vh) {
      if (stage.hasAttribute('data-active')) stage.removeAttribute('data-active')
      continue
    }

    // p is 0 at the instant the stage top touches the viewport bottom and 1
    // at the instant the stage bottom leaves the viewport top, so a stage
    // shorter than the viewport still traverses the whole range.
    const span = rect.height + vh
    const raw = (vh - rect.top) / span
    const p = raw < 0 ? 0 : raw > 1 ? 1 : raw

    stage.style.setProperty('--p', p.toFixed(4))
    if (!stage.hasAttribute('data-active')) stage.setAttribute('data-active', '')
  }
}

function request() {
  if (frame) return
  frame = requestAnimationFrame(tick)
}

/**
 * Adds a stage to the shared tick and returns its unregister function.
 * Callers are responsible for not registering under reduced motion.
 */
export function registerParallaxStage(el: HTMLElement): () => void {
  stages.add(el)

  if (!bound) {
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request, { passive: true })
    bound = true
  }

  // Seed the first value before the user has scrolled, so a stage that is
  // already on screen at load does not sit at p = 0 until the first move.
  request()

  return () => {
    stages.delete(el)
    el.removeAttribute('data-active')
    el.style.removeProperty('--p')
  }
}
