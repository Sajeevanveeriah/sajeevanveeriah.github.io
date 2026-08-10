/**
 * The specialist spine.
 *
 * One identity, stated once and reused everywhere: autonomous mobile
 * robotics and embedded intelligent systems, supported by the breadth needed
 * to build the whole machine. This file holds the three structures that
 * carry it, so the home page, the expertise page and the work index cannot
 * drift apart:
 *
 *   1. `boundaryLayers` and `boundaryOutcome`: the system-boundary model.
 *   2. `pillars`: the three specialist capability groups.
 *   3. `workGroups`: the published hierarchy of the work index.
 *
 * Every claim below is drawn from a record that already exists in
 * `projects.ts`, `skills.ts` or `employers.ts`. Nothing here introduces a
 * controller, board, mechanism, standard, client or measurement that is not
 * already evidenced there. Where an evidence boundary exists it is written
 * into the copy rather than smoothed over.
 *
 * Written per the 6 August 2026 specialist-repositioning brief, which
 * supersedes the earlier equal-weight territory presentation.
 */

/** Which of the five layer hues in tokens.css a block carries. */
export type SystemLayerId = 'mech' | 'sense' | 'control' | 'autonomy' | 'verify'

export interface BoundaryLayer {
  readonly id: SystemLayerId
  readonly index: string
  readonly name: string
  /** One sentence naming what this layer is, in engineering terms. */
  readonly detail: string
  /** Where the evidence for it sits, drawn from published records. */
  readonly evidence: string
  /** The record that carries the strongest evidence for this layer. */
  readonly href: string
  readonly hrefLabel: string
}

/**
 * The five layers a complete robotic system has to work across, in the order
 * a signal travels through them. The advantage being described is ownership
 * of the boundaries between them, not a claim to have invented any one layer.
 */
export const boundaryLayers: readonly BoundaryLayer[] = [
  {
    id: 'mech',
    index: '01',
    name: 'Mechanics and actuation',
    detail:
      'Mechanisms, packaging and drive hardware, defined around the movement the machine actually has to make.',
    evidence:
      'Modular robot platform built around replaceable actuation modules; production actuation integrated in plant automation and KUKA robotic cells.',
    href: '/work/modular-education-testing-robot/',
    hrefLabel: 'Modular education and testing robot',
  },
  {
    id: 'sense',
    index: '02',
    name: 'Sensing and electronics',
    detail:
      'Sensor selection, conditioning and the boards that carry them, treated as an engineering layer rather than as given data.',
    evidence:
      'IMU, time-of-flight, Hall-effect and magnetometer sensing on the Honours capstone; custom PCB with CAN capture and GNSS on a professional field deployment.',
    href: '/work/ataxia-assessment-device/',
    hrefLabel: 'ESP32 clinical ataxia assessment device',
  },
  {
    id: 'control',
    index: '03',
    name: 'Embedded control',
    detail:
      'Real-time firmware and control loops, where timing, determinism and failure behaviour are decided.',
    evidence:
      'ESP32 real-time acquisition firmware in embedded C and C++; PID motion control tuned against simulated behaviour; PLC control logic delivered under GMP.',
    href: '/work/autonomous-navigation-rover/',
    hrefLabel: 'Autonomous navigation rover on ROS 2',
  },
  {
    id: 'autonomy',
    index: '04',
    name: 'Autonomy and AI/ML',
    detail:
      'Localisation, mapping, estimation and planning, kept as separate nodes so each can be tuned and validated on its own.',
    evidence:
      'ROS 2 Humble stack with LiDAR SLAM, Kalman and EKF state estimation, IMU and odometry fusion, A* and Nav2 planning, validated across repeated simulation runs.',
    href: '/work/autonomous-navigation-rover/',
    hrefLabel: 'Autonomous navigation rover on ROS 2',
  },
  {
    id: 'verify',
    index: '05',
    name: 'Integration, verification and deployment',
    detail:
      'Making the layers behave as one machine, then proving it against the environment it has to survive.',
    evidence:
      'Deployed client robotics in active end-user use; Linux server and edge connectivity integrated in the field; FAT, SAT and qualification evidence produced in regulated plants.',
    href: '/work/inventory-scanning-mobile-robot/',
    hrefLabel: 'Inventory scanning mobile robot',
  },
] as const

export const boundaryOutcome = 'Reliable intelligent robotic system' as const

export const boundaryCopy = {
  kicker: 'The system boundary',
  title: 'Five layers, one machine.',
  lede: 'Most robotic programmes lose time at the joins between disciplines. The advantage here is owning those joins: each layer designed against the next, then verified as one system.',
  /**
   * Read by assistive technology in place of the drawn connectors, which are
   * decorative. The layer text itself is real markup and is not repeated
   * here, so nothing is announced twice.
   */
  relationship:
    'The five layers below feed forward in order, from mechanics and actuation through to integration, verification and deployment, and every layer contributes to one outcome: a reliable intelligent robotic system.',
  outcomeLabel: 'Central outcome',
} as const

/* ============================================================
   Three specialist pillars
   ============================================================ */

export interface Pillar {
  readonly id: SystemLayerId
  readonly index: string
  readonly name: string
  readonly summary: string
  /** Capability terms held to verified evidence. */
  readonly capabilities: readonly string[]
  /** What the pillar deliberately does not claim. */
  readonly boundary: string
  readonly records: readonly { readonly label: string; readonly href: string }[]
}

export const pillars: readonly Pillar[] = [
  {
    id: 'autonomy',
    index: '01',
    name: 'Autonomous robotic systems',
    summary:
      'Perception, localisation, estimation, planning and motion control integrated as one stack and validated as one stack.',
    capabilities: [
      'ROS 2 Humble',
      'Nav2',
      'LiDAR SLAM',
      'Kalman and EKF state estimation',
      'IMU and odometry fusion',
      'A* path planning',
      'PID motion control',
      'Gazebo and RViz validation',
    ],
    boundary:
      'The ROS 2 stack is validated in simulation. Physical deployment evidence sits with the client robotics records instead.',
    records: [
      { label: 'Autonomous navigation rover on ROS 2', href: '/work/autonomous-navigation-rover/' },
      { label: 'Inventory scanning mobile robot', href: '/work/inventory-scanning-mobile-robot/' },
    ],
  },
  {
    id: 'control',
    index: '02',
    name: 'Embedded mechatronic systems',
    summary:
      'Sensors, electronics, firmware and mechanism designed together, so the timing and the packaging agree with each other.',
    capabilities: [
      'ESP32 and ESP32-S3',
      'STM32',
      'FreeRTOS',
      'Embedded C and C++',
      'Custom PCB design',
      'CAN and CAN FD capture',
      'UART, I2C, SPI, ADC and PWM',
      'Signal conditioning and board bring-up',
      'Mechanical packaging and interfaces',
    ],
    boundary:
      'Platform selection is claimed as a judgement, not as hands-on time on every board. The reference library separates evaluated platforms from used ones.',
    records: [
      { label: 'ESP32 clinical ataxia assessment device', href: '/work/ataxia-assessment-device/' },
      {
        label: 'Agricultural equipment health and location platform',
        href: '/work/iot-monitoring-platform/',
      },
    ],
  },
  {
    id: 'verify',
    index: '03',
    name: 'Integration and verification',
    summary:
      'The part that decides whether a prototype becomes a machine somebody can run: integration, evidence, diagnostics and handover.',
    capabilities: [
      'Mechanical and electrical integration',
      'Linux and edge deployment',
      'Simulation-first validation',
      'Field and operator validation',
      'Edge AI/ML and anomaly detection',
      'Diagnostics and observability',
      'FAT, SAT and qualification evidence',
      'Serviceability and handover',
    ],
    boundary:
      'Regulated and client evidence exists but is not published. What is shown is the method and the boundary, not client data.',
    records: [
      { label: 'Inventory scanning mobile robot', href: '/work/inventory-scanning-mobile-robot/' },
      { label: 'Upzy supervised routine companion robot', href: '/work/upzy-supervised-routine-companion/' },
    ],
  },
] as const

/**
 * The supporting layer. Real professional evidence that strengthens the
 * specialist spine rather than competing with it for the first screen.
 */
export const supportingFoundation = {
  kicker: 'Supporting experience',
  title: 'Where the reliability instinct came from.',
  body: 'Industrial automation, automotive validation, IoT telemetry, manufacturing and quality work sit underneath the robotics. They are why the engineering above is designed for traceability, recovery, serviceability and the realities beyond a laboratory.',
} as const

/* ============================================================
   Work hierarchy
   ============================================================ */

export interface WorkGroup {
  readonly id: string
  readonly name: string
  readonly note: string
  /** Slugs in published order. A slug with no record is skipped, not faked. */
  readonly slugs: readonly string[]
}

/**
 * Three groups, deliberately unequal. The robotics group leads because
 * repeated depth in one specialism is the point being made; the software
 * group is retained in full because the work is real, and demoted because it
 * is not the identity.
 */
export const workGroups: readonly WorkGroup[] = [
  {
    id: 'robotic-systems',
    name: 'Robotic systems',
    note: 'Mobile robotics and autonomy, from deployed machines to a full simulation-validated stack.',
    slugs: [
      'inventory-scanning-mobile-robot',
      'autonomous-navigation-rover',
      'modular-education-testing-robot',
      'upzy-supervised-routine-companion',
    ],
  },
  {
    id: 'embedded-intelligence',
    name: 'Embedded intelligence',
    note: 'Sensing, firmware, electronics and edge intelligence on physical equipment.',
    slugs: ['ataxia-assessment-device', 'iot-monitoring-platform', 'digital-twin-industrial-ai'],
  },
  {
    id: 'supporting-systems',
    name: 'Supporting systems and software',
    note: 'Engineering software, automation and validation work that supports the physical systems above.',
    slugs: [
      'swl-pricing-inventory-control',
      'engineering-mastery-lab',
      'veerai-slm',
      'jag-smart-factory',
      'adas-can-validation',
      'ndcc-website',
    ],
  },
] as const
