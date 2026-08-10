import s from './RouteSignature.module.css'

/**
 * A per-route mark that sits in the header's right column.
 *
 * Every route family used the same header: kicker, three line title, lede,
 * optional aside. Measured at 1440, `/work` and `/atlas` were both exactly
 * 467px tall with the same silhouette, so the two read as the same page with
 * different words, and both left the top right quadrant empty above the
 * aside.
 *
 * The answer is not five different header layouts. The shared header is the
 * site's spine and it should stay recognisable. What each family lacked was
 * an identity, so each one gets a mark drawn from what that route actually
 * is: a committed route for the work index, a branching lattice for the
 * atlas, layered strata for the stack, a spine with nodes for the career,
 * converging lines for contact. They share one vocabulary, hairline strokes
 * and the accent dot, so the set still reads as one system.
 *
 * Decorative and hidden from assistive technology: every mark restates
 * something the adjacent title and lede already say in words. Pure SVG and
 * CSS, so it server renders and costs no JavaScript. The draw is a one shot
 * on the shared cycle rather than a loop, because a header mark that keeps
 * redrawing itself behind a title is a distraction, not an accent.
 */

export type SignatureVariant = 'route' | 'lattice' | 'strata' | 'spine' | 'converge'

const BY_ROUTE: Record<string, SignatureVariant> = {
  work: 'route',
  atlas: 'lattice',
  skills: 'strata',
  about: 'spine',
  contact: 'converge',
}

export function signatureFor(route: string): SignatureVariant | null {
  return BY_ROUTE[route] ?? null
}

export function RouteSignature({ variant }: { variant: SignatureVariant }) {
  return (
    <div className={s.wrap} aria-hidden="true">
      <svg className={s.svg} viewBox="0 0 320 150" preserveAspectRatio="xMidYMid meet" focusable="false">
        {variant === 'route' ? <Route /> : null}
        {variant === 'lattice' ? <Lattice /> : null}
        {variant === 'strata' ? <Strata /> : null}
        {variant === 'spine' ? <Spine /> : null}
        {variant === 'converge' ? <Converge /> : null}
      </svg>
    </div>
  )
}

/** Work: a route committed around what is in the way. */
function Route() {
  return (
    <>
      <rect className={s.block} x="96" y="30" width="54" height="38" rx="6" />
      <rect className={s.block} x="186" y="74" width="62" height="42" rx="6" />
      <path
        className={s.line}
        d="M 14 122 C 60 116 66 74 108 78 C 150 82 158 116 196 62 C 226 20 268 26 306 22"
        pathLength={1}
        data-draw=""
      />
      <circle className={s.dotFaint} cx="14" cy="122" r="4" />
      <circle className={s.dot} cx="306" cy="22" r="5" />
    </>
  )
}

/** Atlas: one index branching into domains. */
function Lattice() {
  const leaves = [26, 58, 90, 122]
  return (
    <>
      {leaves.map((y, i) => (
        <path
          key={y}
          className={s.line}
          d={`M 30 74 C 110 74 130 ${y} 214 ${y}`}
          pathLength={1}
          data-draw=""
          style={{ animationDelay: `${i * 0.14}s` }}
        />
      ))}
      {leaves.map((y) => (
        <circle key={y} className={s.dot} cx="214" cy={y} r="4" />
      ))}
      <circle className={s.dotSolid} cx="30" cy="74" r="6" />
    </>
  )
}

/** Skills: the stack, physical ground up to the intelligent layer. */
function Strata() {
  const rows = [0, 1, 2, 3, 4]
  return (
    <>
      {rows.map((i) => {
        const y = 26 + i * 24
        const w = 120 + i * 38
        return (
          <g key={i}>
            <line
              className={i === 0 ? s.lineStrong : s.lineFaint}
              x1="18"
              y1={y}
              x2={18 + w}
              y2={y}
              pathLength={1}
              data-draw=""
              style={{ animationDelay: `${(rows.length - 1 - i) * 0.12}s` }}
            />
            <circle className={i === 0 ? s.dot : s.dotFaint} cx={18 + w} cy={y} r="3.5" />
          </g>
        )
      })}
    </>
  )
}

/** About: a career spine with the roles marked along it. */
function Spine() {
  const nodes = [36, 84, 132, 180, 228, 276]
  return (
    <>
      {/* The spine stops at the final node rather than running past it, so
          the current role reads as the end of the line and not as a tail. */}
      <line
        className={s.lineFaint}
        x1="24"
        y1="75"
        x2="276"
        y2="75"
        pathLength={1}
        data-draw=""
      />
      {nodes.map((x, i) => (
        <g key={x}>
          <line className={s.tick} x1={x} y1={i % 2 ? 75 : 51} x2={x} y2={i % 2 ? 99 : 75} />
          <circle
            className={i === nodes.length - 1 ? s.dotSolid : s.dot}
            cx={x}
            cy={i % 2 ? 99 : 51}
            r={i === nodes.length - 1 ? 5 : 3.5}
          />
        </g>
      ))}
    </>
  )
}

/** Contact: separate channels resolving to one address. */
function Converge() {
  const starts = [26, 58, 90, 122]
  return (
    <>
      {starts.map((y, i) => (
        <path
          key={y}
          className={s.line}
          d={`M 22 ${y} C 110 ${y} 130 74 236 74`}
          pathLength={1}
          data-draw=""
          style={{ animationDelay: `${i * 0.14}s` }}
        />
      ))}
      {starts.map((y) => (
        <circle key={y} className={s.dotFaint} cx="22" cy={y} r="3.5" />
      ))}
      <circle className={s.dotSolid} cx="236" cy="74" r="6" />
    </>
  )
}
