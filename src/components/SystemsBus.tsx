'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { systemLayers } from '@/content/site'
import { ArrowUpRight } from './icons'

interface LayerSpec {
  readonly index: string
  readonly interfaces: string
  readonly tools: readonly string[]
  readonly evidence: string
  readonly projects: readonly { readonly title: string; readonly slug: string }[]
}

const layerSpecs: Record<string, LayerSpec> = {
  '01': {
    index: '01',
    interfaces: 'Structural mounts, rotary brush contact, track pods, enclosures and thermal paths',
    tools: ['FreeCAD', 'SolidWorks', 'Fusion 360', 'GD&T', 'STEP assemblies'],
    evidence: 'Built crawler platform, PCB mounting CAD packages and 27-solid cleaner model.',
    projects: [
      { title: 'SPC-001 Waterless Solar-Panel Cleaner', slug: 'waterless-solar-panel-cleaner' },
      { title: 'ESP32 Ataxia Assessment Device', slug: 'ataxia-assessment-device' },
    ],
  },
  '02': {
    index: '02',
    interfaces: 'Hall-effect channels, 4-20 mA loops, Li-ion power path, buck-boost rails and Schmitt-buffered 9 uA inputs',
    tools: ['KiCad 10', 'Altium', 'LTspice', 'ngspice', 'ESP32-S3', 'STM32'],
    evidence: 'Four-layer KiCad boards with zero ERC/DRC errors and 553 parameter sweep cases.',
    projects: [
      { title: 'VW-MTC1 MazeTrack Assessment Controller', slug: 'mazetrack-assessment-controller' },
      { title: 'Industrial Display Controller', slug: 'industrial-display-controller' },
    ],
  },
  '03': {
    index: '03',
    interfaces: 'RS232, RS485, Ethernet UDP, HUB75 PIO scanning, guarded boot states and PLC/SCADA',
    tools: ['C/C++', 'RP2350 PIO', 'Siemens TIA Portal', 'WinCC', 'iFIX / PVI+', 'Modbus'],
    evidence: '31 synthetic serial profiles, host framebuffer simulations and GMP migration checks.',
    projects: [
      { title: 'Networked LED Scoreboard Controller', slug: 'led-scoreboard-controller' },
      { title: 'Industrial Display Controller', slug: 'industrial-display-controller' },
    ],
  },
  '04': {
    index: '04',
    interfaces: '2D LiDAR scans, IMU fusion, TF transforms, EKF covariance, Nav2 costmaps and command leases',
    tools: ['ROS 2 Humble', 'Nav2', 'Gazebo Fortress', 'RViz', 'Python', 'NumPy'],
    evidence: '32,400 simulated episodes and Gazebo Fortress regression runs for navigation recovery.',
    projects: [
      { title: 'Autonomous Navigation Rover on ROS 2', slug: 'autonomous-navigation-rover' },
      { title: 'Deadline-Aware Runtime Assurance', slug: 'deadline-aware-runtime-assurance' },
    ],
  },
  '05': {
    index: '05',
    interfaces: 'MES-ERP production orders, discrete 10 s plant steps, CSV contracts and local inference',
    tools: ['TypeScript', 'Tauri 2', 'Rust', 'GNU Octave', 'Chronos-2', 'Isaac Sim'],
    evidence: '1,956,878 values cross-checked within 1e-6 against Octave and 500+ automated software tests.',
    projects: [
      { title: 'Dooen Plant Process Model', slug: 'dooen-plant-process-model' },
      { title: 'Pricing and Inventory Control', slug: 'pricing-inventory-control' },
    ],
  },
  '06': {
    index: '06',
    interfaces: 'FAT/SAT procedures, byte-for-byte CSV contracts, hardware-in-loop logs and site handover',
    tools: ['Playwright', 'Vitest', 'MATLAB', 'CANoe / CANalyzer', 'GitHub Actions'],
    evidence: '40,184 supervisor assertions, 27-step WiFi handover guides and regression test suites.',
    projects: [
      { title: 'SPC-001 Waterless Solar-Panel Cleaner', slug: 'waterless-solar-panel-cleaner' },
      { title: 'Industrial Process Simulation', slug: 'industrial-process-simulation' },
      { title: 'NDCC Digital Platform & Public WiFi', slug: 'ndcc-community-systems' },
    ],
  },
}

export function SystemsBus() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const activeLayer = systemLayers[selectedIdx] ?? systemLayers[0]
  const activeSpec = layerSpecs[activeLayer.index] ?? layerSpecs['01']!

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (index + 1) % systemLayers.length
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? (index + systemLayers.length - 1) % systemLayers.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? systemLayers.length - 1
              : null
    if (next === null) return
    e.preventDefault()
    setSelectedIdx(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="systems-bus">
      <div className="bus-track" role="tablist" aria-label="Six-layer systems architecture bus">
        <div className="bus-spine" aria-hidden="true">
          <span className="bus-pulse" />
        </div>
        {systemLayers.map((layer, idx) => {
          const active = idx === selectedIdx
          return (
            <button
              key={layer.index}
              ref={(el) => {
                tabRefs.current[idx] = el
              }}
              type="button"
              role="tab"
              id={`bus-tab-${layer.index}`}
              aria-selected={active}
              aria-controls="bus-inspector"
              tabIndex={active ? 0 : -1}
              className={`bus-node${active ? ' active' : ''}`}
              onClick={() => setSelectedIdx(idx)}
              onKeyDown={(e) => onKeyDown(e, idx)}
            >
              <span className="bus-index">{layer.index}</span>
              <span className="bus-copy">
                <strong>{layer.title}</strong>
                <small>{layer.detail}</small>
              </span>
            </button>
          )
        })}
      </div>

      <article
        id="bus-inspector"
        role="tabpanel"
        aria-labelledby={`bus-tab-${activeLayer.index}`}
        className="bus-inspector"
      >
        <header className="bus-inspector-head">
          <p className="eyebrow">Layer {activeLayer.index}</p>
          <h3>{activeLayer.title}</h3>
          <p>{activeLayer.detail}</p>
        </header>

        <dl className="bus-meta">
          <div>
            <dt>Interfaces and signals</dt>
            <dd>{activeSpec.interfaces}</dd>
          </div>
          <div>
            <dt>Verification evidence</dt>
            <dd>{activeSpec.evidence}</dd>
          </div>
        </dl>

        <div className="bus-tools">
          <h4>Core engineering tools</h4>
          <ul className="chips">
            {activeSpec.tools.map((tool) => (
              <li key={tool} className="chip">
                {tool}
              </li>
            ))}
          </ul>
        </div>

        <div className="bus-links">
          <h4>Matching portfolio systems</h4>
          <ul>
            {activeSpec.projects.map((proj) => (
              <li key={proj.slug}>
                <Link className="text-link" href={`/work/${proj.slug}/`} prefetch={false}>
                  {proj.title} <ArrowUpRight />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  )
}
