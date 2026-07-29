'use client'

import { useState } from 'react'
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
  const current = states[active] ?? states[0]
  return <section className={styles.sequence} aria-labelledby="ros-title">
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
      {project.images?.[0] ? <div className={styles.media}><ProjectImage image={project.images[0]} /></div> : null}
    </div>
    <ol className={styles.mobile}>{states.map(([title, body]) => <li key={title}><h4>{title}</h4><p>{body}</p></li>)}</ol>
  </section>
}
