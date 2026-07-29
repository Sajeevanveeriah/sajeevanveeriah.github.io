import s from './SignalHero.module.css'

/**
 * The homepage hero graphic: a robot senses a space, plans a route through it
 * and drives the route to a goal.
 *
 * It is pure SVG plus CSS keyframes, so it server renders complete, needs no
 * JavaScript and costs nothing on the main thread. The travelling pulse is a
 * dash segment sweeping along the same path the route is drawn on, rather
 * than a separately positioned element, which keeps the two exactly in
 * register at every viewport size.
 *
 * Under reduced motion the route is shown fully drawn, the sweep and pulse
 * are removed, and the picture still reads as "sense, plan, verify".
 */

/** The committed route. Shared by the draw and the travelling pulse. */
const ROUTE =
  'M 90 470 C 150 455 195 400 245 350 C 300 320 360 325 420 320 C 490 315 545 305 600 285 C 640 260 640 205 700 175 C 740 155 775 140 810 130'

/** A candidate the planner considered and discarded: longer, and it grazes
 *  the third obstacle. Drawn faint so the committed route stays dominant. */
const CANDIDATE =
  'M 90 470 C 210 528 360 540 480 512 C 580 488 618 452 664 402 C 712 348 754 240 810 130'

/** Obstacles the route has to resolve around. */
const OBSTACLES = [
  { x: 196, y: 168, w: 152, h: 118 },
  { x: 414, y: 366, w: 186, h: 132 },
  { x: 646, y: 246, w: 128, h: 168 },
] as const

export function SignalHero() {
  return (
    <figure className={s.figure}>
      <svg
        className={s.svg}
        viewBox="0 0 900 600"
        role="img"
        aria-label="An autonomous vehicle senses a space containing three obstacles, plans a route around them and drives that route to a goal."
      >
        <defs>
          <pattern id="sh-lattice" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" className={s.latticeDot} />
          </pattern>

          <radialGradient id="sh-sweep" cx="0" cy="0" r="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="sh-route" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-deep)" />
          </linearGradient>

          <clipPath id="sh-frame">
            <rect x="0" y="0" width="900" height="600" rx="1" />
          </clipPath>
        </defs>

        <g clipPath="url(#sh-frame)">
          <rect width="900" height="600" fill="url(#sh-lattice)" />

          {/* Sensing sweep and range rings, all in the vehicle's own frame so
              they rotate and expand about it without a transform-origin. */}
          <g transform="translate(90 470)">
            <g className={s.sweep}>
              <path d="M 0 0 L 268 0 A 268 268 0 0 0 172 -205 Z" fill="url(#sh-sweep)" />
            </g>
            <circle className={`${s.ping} ${s.ping1}`} cx="0" cy="0" r="6" />
            <circle className={`${s.ping} ${s.ping2}`} cx="0" cy="0" r="6" />
          </g>

          {/* Obstacles resolved by the scan. */}
          {OBSTACLES.map((o, i) => (
            <rect
              key={i}
              className={s.obstacle}
              style={{ animationDelay: `${0.45 + i * 0.35}s` }}
              x={o.x}
              y={o.y}
              width={o.w}
              height={o.h}
              rx="10"
            />
          ))}

          {/* The route the planner considered and rejected. */}
          <path className={s.ghostRoute} d={CANDIDATE} />

          {/* The committed route, drawn once per cycle. */}
          <path className={s.route} d={ROUTE} pathLength={1} data-draw="" />

          {/* The vehicle's own progress along that route. */}
          <path className={s.pulse} d={ROUTE} pathLength={1} />

          {/* Goal. */}
          <circle className={s.goalRing} cx="810" cy="130" r="20" />
          <circle className={s.goalDot} cx="810" cy="130" r="6" />

          {/* Vehicle. */}
          <rect className={s.vehicleBody} x="70" y="450" width="40" height="40" rx="12" />
          <circle className={s.vehicleCore} cx="90" cy="470" r="6" />
        </g>

        <g className={s.annotations} aria-hidden="true">
          <text x="70" y="529">Sense</text>
          <text x="404" y="292">Plan</text>
          <text x="700" y="98">Verify</text>
        </g>
      </svg>

      <figcaption className={s.caption}>
        Sense, estimate, plan, control, verify. The loop under every record in this portfolio.
      </figcaption>
    </figure>
  )
}
