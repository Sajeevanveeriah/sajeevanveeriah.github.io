import Link from 'next/link'
import { boundaryCopy, boundaryLayers, boundaryOutcome } from '@/content/specialism'
import s from './SystemBoundary.module.css'

/**
 * The system-boundary visual.
 *
 * What it argues: a robotic system is five layers, and the engineering that
 * decides whether it works is at the joins. It is a layered system model, not
 * a schematic, and it does not pretend to be one: there are no part numbers,
 * no signal names and no drawn hardware.
 *
 * Why it is built from markup and CSS rather than from SVG:
 *
 *   - Every label is real text in the page, so it reflows, scales with the
 *     type ramp and can never be clipped by a viewBox. `SystemDiagram` needed
 *     a container-query label ramp and two alternate compositions to keep its
 *     SVG labels legible from 316px to 766px; a visual whose labels are the
 *     content should not inherit that problem.
 *   - The connectors are the only drawn part, and they are decorative
 *     (`aria-hidden`). They are CSS rules positioned against the same grid
 *     the cards sit in, so a connector cannot drift out of register with a
 *     label at any width. `boundaryCopy.relationship` states the flow the
 *     connectors show, once, for a reader who never sees them.
 *   - The content is a semantic ordered list, so it is already its own text
 *     equivalent. Nothing here is duplicated into a second hidden copy,
 *     which is what would otherwise get announced twice.
 *
 * Motion: the bus draws once when the block is revealed and then stops. The
 * resting state is the drawn state, so with JavaScript off, or under
 * `prefers-reduced-motion: reduce` where the global guard collapses the
 * transition, the visual is complete rather than half-drawn.
 *
 * Interaction: each layer's evidence is a native `<details>`. That is
 * keyboard operable, touch operable and works with no JavaScript at all,
 * which a hover-revealed panel would not be.
 */
export function SystemBoundary({ headingId = 'boundary-title' }: { headingId?: string }) {
  return (
    <div className={s.root}>
      <p className={`label label-accent ${s.kicker}`}>{boundaryCopy.kicker}</p>
      <h2 id={headingId} className={s.title}>
        {boundaryCopy.title}
      </h2>
      <p className={`lede ${s.lede}`}>{boundaryCopy.lede}</p>

      {/* The connectors are decorative, so the relationship they draw is
          stated here in words, exactly once. */}
      <p className="visually-hidden">{boundaryCopy.relationship}</p>

      <div className={s.map}>
        <ol className={s.layers}>
          {boundaryLayers.map((layer) => (
            <li key={layer.id} className={s.layer} data-layer={layer.id}>
              <span className={s.index} aria-hidden="true">
                {layer.index}
              </span>
              <h3 className={s.name}>{layer.name}</h3>
              <p className={s.detail}>{layer.detail}</p>

              <details className={s.disclosure}>
                <summary className={s.summary}>
                  Evidence
                  <span className={s.chevron} aria-hidden="true" />
                </summary>
                <div className={s.disclosureBody}>
                  <p className={s.evidence}>{layer.evidence}</p>
                  <Link className="textlink" href={layer.href}>
                    {layer.hrefLabel}
                  </Link>
                </div>
              </details>
            </li>
          ))}
        </ol>

        <div className={s.bus} aria-hidden="true">
          <span className={s.busLine} />
        </div>

        <div className={s.outcome}>
          <p className={`label ${s.outcomeLabel}`}>{boundaryCopy.outcomeLabel}</p>
          <p className={s.outcomeTitle}>{boundaryOutcome}</p>
        </div>
      </div>
    </div>
  )
}
