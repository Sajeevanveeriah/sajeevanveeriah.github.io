import type { EvidenceTier } from './tiers'
import type { AtlasCluster } from './atlas'
import { atlas } from './atlas'

/**
 * The Systems Stack: ten layers, physical at the top through to validation
 * at the base. Transcribed verbatim from index.html lines 908 to 1019.
 *
 * `cluster` reproduces the old data-stack-cluster attribute, which is what
 * made selecting a layer pre-filter the Atlas. domainsInLayer() derives the
 * cross-link from it, so the ladder is a real navigation spine between
 * /skills and /atlas rather than decoration.
 */

export interface SystemsLayer {
  readonly slug: string
  /** 1 = top of the ladder. */
  readonly order: number
  readonly name: string
  readonly description: string
  readonly tools: readonly string[]
  readonly cluster: AtlasCluster
  readonly evidenceTier: EvidenceTier
  /** Verbatim qualifier from the old tier chip, where one was present. */
  readonly tierNote?: string
}

export const systemsStack: readonly SystemsLayer[] = [
  {
    slug: 'mechanical',
    order: 1,
    name: 'Mechanical',
    description: 'Design, CAD, mechanisms, materials, thermal and fluids',
    tools: ['SolidWorks', 'Fusion 360', 'GD&T', '3D printing'],
    cluster: 'physical',
    evidenceTier: 'hands-on',
  },
  {
    slug: 'electrical',
    order: 2,
    name: 'Electrical',
    description: 'Power, machines, drives, panels, schematics, instrumentation',
    tools: ['VFDs', 'control schematics', 'loop testing'],
    cluster: 'physical',
    evidenceTier: 'hands-on',
  },
  {
    slug: 'electronics',
    order: 3,
    name: 'Electronics',
    description: 'PCB, analogue, sensors, signal conditioning, EMC awareness, bring-up',
    tools: ['Altium', 'KiCad', 'oscilloscopes', 'logic analysers'],
    cluster: 'embedded',
    evidenceTier: 'hands-on',
  },
  {
    slug: 'embedded',
    order: 4,
    name: 'Embedded',
    description: 'Firmware, real-time systems, microcontrollers, interfaces, device drivers',
    tools: ['ESP32', 'STM32', 'FreeRTOS', 'C and C++'],
    cluster: 'embedded',
    evidenceTier: 'delivered',
  },
  {
    slug: 'controls',
    order: 5,
    name: 'Controls',
    description: 'Feedback, PID, state estimation, motion and process control, modelling',
    tools: ['MATLAB and Simulink', 'Kalman and EKF', 'PID tuning'],
    cluster: 'controls',
    evidenceTier: 'delivered',
  },
  {
    slug: 'automation',
    order: 6,
    name: 'Automation',
    description: 'PLC, SCADA, HMI, MES, batch, commissioning, FAT and SAT',
    tools: ['TIA Portal', 'WinCC', 'PCS 7', 'iFIX', 'PVI+'],
    cluster: 'controls',
    evidenceTier: 'delivered',
  },
  {
    slug: 'robotics',
    order: 7,
    name: 'Robotics',
    description: 'Autonomy, SLAM, navigation, planning, perception, manipulation, simulation',
    tools: ['ROS 2', 'Nav2', 'MoveIt 2', 'Gazebo', 'RViz'],
    cluster: 'controls',
    evidenceTier: 'delivered',
    tierNote: 'project',
  },
  {
    slug: 'software-and-data',
    order: 8,
    name: 'Software and data',
    description: 'APIs, Linux, Git, testing, databases, telemetry, IoT pipelines',
    tools: ['Python', 'TypeScript', 'Linux', 'MikroTik', 'CAN telemetry'],
    cluster: 'software',
    evidenceTier: 'hands-on',
    tierNote: 'IoT delivered',
  },
  {
    slug: 'ai-ml',
    order: 9,
    name: 'AI/ML',
    description:
      'Computer vision, anomaly detection, predictive maintenance, time-series analytics',
    tools: ['scikit-learn', 'OpenCV', 'YOLO', 'Pandas'],
    cluster: 'software',
    evidenceTier: 'hands-on',
  },
  {
    slug: 'validation-and-documentation',
    order: 10,
    name: 'Validation and documentation',
    description: 'Testing, compliance, quality evidence, qualification, handover',
    tools: ['CANoe', 'FAT and SAT', 'ITPs', 'MDRs', 'GAMP 5'],
    cluster: 'assurance',
    evidenceTier: 'delivered',
  },
] as const

/** Atlas domains that operate at a given layer, via the shared cluster. */
export function domainsInLayer(layerSlug: string) {
  const layer = systemsStack.find((l) => l.slug === layerSlug)
  if (!layer) return []
  return atlas.filter((d) => d.cluster === layer.cluster)
}
