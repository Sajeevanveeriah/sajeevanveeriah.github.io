import Image from 'next/image'
import { site } from '@/content/site'

const nodes = [
  { label: 'Robotics', detail: 'Sense, plan, move', colour: 'blue' },
  { label: 'Mechanical', detail: 'Make the physical work', colour: 'orange' },
  { label: 'Embedded', detail: 'Control at the edge', colour: 'teal' },
  { label: 'AI and software', detail: 'Turn data into decisions', colour: 'violet' },
  { label: 'Validation', detail: 'Prove and hand over', colour: 'yellow' },
] as const

export function EngineeringField() {
  return (
    <figure className="engineering-field" aria-labelledby="field-caption">
      <div className="field-grid" aria-hidden="true" />
      <div className="field-core">
        <Image src={site.logo} alt="" width={512} height={512} priority sizes="(max-width: 760px) 160px, 220px" />
      </div>
      <ol className="field-nodes">
        {nodes.map((node, index) => (
          <li className={`field-node field-node-${index + 1}`} data-colour={node.colour} key={node.label}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <strong>{node.label}</strong>
            <small>{node.detail}</small>
          </li>
        ))}
      </ol>
      <figcaption id="field-caption">A connected engineering practice, from physical behaviour to verified operation.</figcaption>
    </figure>
  )
}
