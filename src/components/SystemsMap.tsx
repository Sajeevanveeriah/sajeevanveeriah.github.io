import { systemLayers } from '@/content/site'

export function SystemsMap() {
  return (
    <section className="band" id="systems" aria-labelledby="systems-title">
      <div className="shell">
        <div className="section-heading">
          <p className="section-index">01</p>
          <div>
            <h2 id="systems-title">One system, across every boundary.</h2>
            <p>Each layer is designed against the next, then verified as a complete machine.</p>
          </div>
        </div>
        <ol className="systems-map" aria-describedby="systems-text">
          {systemLayers.map((layer) => (
            <li key={layer.index}>
              <span className="layer-index">{layer.index}</span>
              <h3>{layer.title}</h3>
              <p>{layer.detail}</p>
            </li>
          ))}
        </ol>
        <p id="systems-text" className="sr-only">
          The engineering sequence runs from the physical system through sensing, embedded intelligence,
          robotics and autonomy, AI and data, then validation and deployment.
        </p>
      </div>
    </section>
  )
}
