'use client'

import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/content/projects'
import { ProjectImage } from '@/components/ui/ProjectImage'
import styles from './RosSequence.module.css'

const states = [
  ['Sense and localise', 'LiDAR SLAM, odometry and IMU fusion establish the map and robot state.'],
  ['Plan', 'A* and Nav2 turn the current state and obstacle map into a navigable path.'],
  ['Control and validate', 'Motion control executes the path while Gazebo and RViz expose behaviour for repeatable checks.'],
] as const

export function RosSequence({ project }: { project: Project }) {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = root.current
    if (!element || matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches) return
    const update = () => { const box = element.getBoundingClientRect(); setActive(Math.floor(Math.max(0, Math.min(0.999, -box.top / Math.max(1, box.height - innerHeight))) * 3)) }
    update(); addEventListener('scroll', update, { passive: true })
    return () => removeEventListener('scroll', update)
  }, [])
  const current = states[active] ?? states[0]
  return <section ref={root} className={styles.sequence} aria-labelledby="ros-title" data-motion="ros-sequence" data-motion-state={active}>
    <div className={styles.sticky}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Autonomous Navigation Rover on ROS 2</p>
        <h3 id="ros-title">A system is only autonomous when every layer works together.</h3>
        <div className={styles.controls} aria-label="Autonomy sequence states">
          {states.map(([title], index) => <button key={title} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>{title}</button>)}
        </div>
        <p className={styles.detail}><strong>{current[0]}.</strong> {current[1]}</p>
        <a href={`/work/${project.slug}/`}>Inspect the complete case study</a>
      </div>
      {project.images?.[0] ? <div className={styles.media}><ProjectImage image={project.images[0]} /><svg className={styles.overlay} viewBox="0 0 600 360" role="img" aria-label={`Illustrative ${current[0]} engineering overlay`}><path className={styles.route} d={active===0?'M120 180 A90 90 0 0 1 300 180':'M70 290 C180 220 210 110 330 145 S450 255 540 80'}/>{active===0?<g className={styles.points}>{[0,1,2,3,4].map(i=><circle key={i} cx={170+i*58} cy={125+(i%2)*95} r="5"/>)}</g>:null}{active===2?<path className={styles.executed} d="M70 300 C180 230 220 125 330 155 S450 265 540 90"/>:null}</svg><span className={styles.label}>Illustrative overlay</span></div> : null}
    </div>
    <ol className={styles.mobile}>{states.map(([title, body]) => <li key={title}><h4>{title}</h4><p>{body}</p></li>)}</ol>
  </section>
}
