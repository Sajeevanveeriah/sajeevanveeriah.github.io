'use client'

import Image from 'next/image'
import { useRef, useState, type KeyboardEvent } from 'react'

const stages = [
  { name: 'Sense', title: 'Understand the physical world.', detail: 'Sensors, electronics and perception turn physical signals into useful information.', image: 'hero.webp', alt: 'Exploded rover illustration showing the LiDAR sensor, stereo camera, controller and mechanical platform.' },
  { name: 'Think', title: 'Turn information into decisions.', detail: 'State estimation, control and AI connect observations to purposeful behaviour.', image: 'controller.webp', alt: 'Close-up illustration of an embedded controller and its electronic interfaces.' },
  { name: 'Act', title: 'Make the system move.', detail: 'Mechanisms, drives and embedded software bring those decisions into the real world.', image: 'rover.webp', alt: 'Assembled autonomous rover illustration with sensing paths around its chassis.' },
] as const

export function RoboticsHero() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const stage = stages[active] ?? stages[0]
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % stages.length : event.key === 'ArrowLeft' ? (index + stages.length - 1) % stages.length : event.key === 'Home' ? 0 : event.key === 'End' ? stages.length - 1 : null
    if (next === null) return
    event.preventDefault()
    setActive(next)
    buttons.current[next]?.focus()
  }
  return <div className={`robotics-stage${paused ? ' motion-paused' : ''}`}>
    <div className="robotics-art" role="tabpanel" id="robotics-panel" aria-labelledby={`robotics-tab-${active}`} tabIndex={0}>
      <Image key={stage.image} src={`/assets/image/redesign/${stage.image}`} alt={stage.alt} width={1254} height={1254} priority={active === 0} sizes="(max-width: 800px) 95vw, 55vw" className="robotics-image" />
      <button className="motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Resume motion' : 'Pause motion'}</button>
    </div>
    <div className="robotics-tabs" role="tablist" aria-label="Explore the engineering system">
      {stages.map((item, index) => <button key={item.name} ref={(node) => { buttons.current[index] = node }} id={`robotics-tab-${index}`} role="tab" type="button" aria-selected={active === index} aria-controls="robotics-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => onKey(event, index)}>{item.name}</button>)}
    </div>
    <div className="robotics-caption" aria-live="polite"><strong>{stage.title}</strong><p>{stage.detail}</p></div>
  </div>
}
