interface Step {
  readonly label: string
  readonly detail: string
}

export function SystemEvidence({ eyebrow, title, steps, compact = false }: { readonly eyebrow: string; readonly title: string; readonly steps: readonly Step[]; readonly compact?: boolean }) {
  return (
    <section className={`system-evidence${compact ? ' compact' : ''}`} aria-label={`${title} system path`}>
      <header><p>{eyebrow}</p><h2>{title}</h2></header>
      <ol>
        {steps.map((step, index) => (
          <li key={step.label}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div><strong>{step.label}</strong><small>{step.detail}</small></div>
          </li>
        ))}
      </ol>
    </section>
  )
}
