import Image from 'next/image'
import { site, systemLayers } from '@/content/site'

export function EngineeringField() {
  return (
    <figure className="engineering-field" aria-labelledby="field-caption">
      <div className="field-grid" aria-hidden="true" />
      <div className="field-core">
        <Image src={site.logo} alt="" width={512} height={512} priority sizes="(max-width: 760px) 160px, 220px" />
      </div>
      <ol className="field-nodes">
        {systemLayers.map((node, index) => (
          <li className={`field-node field-node-${index + 1}`} key={node.title}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <strong>{node.title}</strong>
            <small>{node.detail}</small>
          </li>
        ))}
      </ol>
      <figcaption id="field-caption">A connected engineering practice, from physical behaviour to verified operation.</figcaption>
    </figure>
  )
}
