import { ParallaxStage, ParallaxLayer } from '@/components/motion/ParallaxStage'
import s from './SignalHero.module.css'

/**
 * The homepage hero graphic: a robot senses a space, plans a route through it
 * and drives the route to a goal.
 *
 * It is drawn as three stacked SVG planes sharing one viewBox rather than one
 * SVG, so the composition can be given depth by the parallax stage: the
 * lattice ground barely moves, the obstacles the scan resolved move a little,
 * and the route, vehicle and goal move most. The planes are transparent
 * cutouts over each other, and the plate frame is the container, not any one
 * plane, so the border is drawn once.
 *
 * Everything below is still pure SVG plus CSS keyframes: it server renders
 * complete, needs no JavaScript and costs nothing on the main thread. The
 * travelling pulse remains a dash segment sweeping along the same path the
 * route is drawn on, in the same plane, so the two stay exactly in register
 * at every viewport size.
 *
 * Under reduced motion the route is shown fully drawn, the sweep and pulse
 * are removed, the parallax is cancelled, and the picture still reads as
 * "sense, plan, verify".
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

/**
 * The whole composition is described once, on the stage. Each plane is
 * `aria-hidden`, because three planes of one picture is still one picture.
 */
const DESCRIPTION =
  'An autonomous vehicle senses a space containing three obstacles, plans a route around them and drives that route to a goal.'

export function SignalHero() {
  return (
    <figure className={s.figure}>
      <ParallaxStage label={DESCRIPTION} className={`stage-stacked ${s.plate}`}>
        {/* Ground. Nearly pinned: a field that slid would read as the page
            moving rather than as depth. */}
        <ParallaxLayer depth={0.1}>
          <svg className={s.svg} viewBox="0 0 900 600" aria-hidden="true" focusable="false">
            <defs>
              <pattern id="sh-lattice" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" className={s.latticeDot} />
              </pattern>

            </defs>

            <rect width="900" height="600" fill="url(#sh-lattice)" />
          </svg>
        </ParallaxLayer>

        {/* What the scan resolved: the obstacles and the rejected candidate. */}
        <ParallaxLayer depth={0.2}>
          <svg className={s.svg} viewBox="0 0 900 600" aria-hidden="true" focusable="false">
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
          </svg>
        </ParallaxLayer>

        {/* The decision: sensing, the committed route, the vehicle and the
            goal. Deepest, because this is the plane the eye tracks. */}
        <ParallaxLayer depth={0.3}>
          <svg className={s.svg} viewBox="0 0 900 600" aria-hidden="true" focusable="false">
            {/* Each plane carries the paint servers it references. A def in a
                sibling SVG resolves in every current browser, but keeping the
                reference inside its own document fragment removes the
                question entirely. */}
            <defs>
              <radialGradient id="sh-sweep" cx="0" cy="0" r="1" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="sh-route" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--accent-deep)" />
              </linearGradient>
            </defs>

            {/* Sensing sweep and range rings, all in the vehicle's own frame
                so they rotate and expand about it without a
                transform-origin. */}
            <g transform="translate(90 470)">
              <g className={s.sweep}>
                <path d="M 0 0 L 268 0 A 268 268 0 0 0 172 -205 Z" fill="url(#sh-sweep)" />
              </g>
              <circle className={`${s.ping} ${s.ping1}`} cx="0" cy="0" r="6" />
              <circle className={`${s.ping} ${s.ping2}`} cx="0" cy="0" r="6" />
            </g>

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

            <g className={s.annotations}>
              <text x="70" y="529">
                Sense
              </text>
              <text x="404" y="292">
                Plan
              </text>
              <text x="700" y="98">
                Verify
              </text>
            </g>
          </svg>
        </ParallaxLayer>
      </ParallaxStage>

      <figcaption className={s.caption}>
        Sense, estimate, plan, control, verify. The loop under every record in this portfolio.
      </figcaption>
    </figure>
  )
}
