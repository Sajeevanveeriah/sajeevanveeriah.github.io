import type { EvidenceTier } from './tiers'

/**
 * Skill Library: six tool territories, transcribed verbatim from
 * index.html lines 1030 to 1085. evidenceTier is ported from the tier chip
 * Saj set on each group; tierNote preserves the chip's qualifier text.
 */

export interface Discipline {
  readonly slug: string
  readonly name: string
  /** The old "usage context" line. */
  readonly summary: string
  /** The old "anchor platforms". */
  readonly platforms: readonly string[]
  /** The old supporting dot strip. */
  readonly protocols?: readonly string[]
  readonly evidenceTier: EvidenceTier
  readonly tierNote?: string
}

export const disciplines: readonly Discipline[] = [
  {
    slug: 'robotics-and-autonomy',
    name: 'Robotics and autonomy',
    summary:
      'Used to build and validate the autonomous rover stack end to end, with hands-on industrial robot cell exposure (KUKA) at Carbon Revolution.',
    platforms: ['ROS 2 Humble', 'Nav2', 'MoveIt 2', 'Gazebo'],
    protocols: [
      'RViz',
      'SLAM',
      'A* path planning',
      'Kalman and EKF',
      'LiDAR',
      'IMU',
      'Depth cameras',
      'OpenCV',
      'YOLO',
      'KUKA cell exposure',
    ],
    evidenceTier: 'delivered',
    tierNote: 'project evidence',
  },
  {
    slug: 'controls-automation-and-scada',
    name: 'Controls, automation and SCADA',
    summary:
      'GMP smart-factory delivery at JAG Process Solutions, including the iFIX to PVI+ migration.',
    platforms: ['Siemens TIA Portal', 'WinCC', 'PCS 7', 'iFIX', 'PVI+'],
    protocols: [
      'PLC programming (IEC 61131-3)',
      'HMI and SCADA',
      'MES and batch systems',
      'Modbus',
      'Profinet',
      'VFDs and drives',
      'GMP',
      'GAMP 5',
      'FAT and SAT',
    ],
    evidenceTier: 'delivered',
    tierNote: 'professional',
  },
  {
    slug: 'embedded-and-electronics',
    name: 'Embedded and electronics',
    summary:
      'Custom PCB, CAN-connected equipment interfaces and telemetry integration delivered professionally at DuxTel; firmware and bring-up across capstone and personal builds.',
    platforms: ['ESP32 and ESP32-S3', 'STM32', 'FreeRTOS', 'Custom PCB design', 'CAN capture'],
    protocols: [
      'Embedded C and C++',
      'UART',
      'I2C',
      'SPI',
      'CAN',
      'ADC',
      'PWM',
      'Signal conditioning',
      'Board bring-up',
    ],
    evidenceTier: 'delivered',
    tierNote: 'firmware',
  },
  {
    slug: 'software-data-and-ai-ml',
    name: 'Software, data and AI/ML',
    summary:
      'Telemetry capture, transport and Linux server paths delivered at DuxTel; applied ML in the digital twin and rover projects.',
    platforms: ['Python', 'C and C++', 'MATLAB and Simulink', 'Linux', 'MikroTik'],
    protocols: [
      'JavaScript',
      'TypeScript',
      'Node.js',
      'REST APIs',
      'MQTT',
      'Linux',
      'Git',
      'Applied machine learning',
      'Anomaly detection',
      'Test automation',
      'CI workflows',
    ],
    evidenceTier: 'hands-on',
  },
  {
    slug: 'automotive-and-validation',
    name: 'Automotive and validation',
    summary: 'ADAS and vehicle software validation at Ford via Invenio; emissions compliance at ABMARC.',
    platforms: ['Vector CANoe', 'Vector CANalyzer'],
    protocols: [
      'CAN and CAN FD',
      'ADAS validation',
      'OTA regression testing',
      'Vehicle instrumentation',
      'Fault isolation',
      'Emissions instrumentation',
      'Data acquisition',
    ],
    evidenceTier: 'delivered',
    tierNote: 'professional',
  },
  {
    slug: 'mechanical-hardware-and-delivery',
    name: 'Mechanical, hardware and delivery',
    summary:
      'CAD across capstone, rover and pressure-vessel design work; delivery documentation across regulated roles.',
    platforms: ['SolidWorks', 'Fusion 360'],
    protocols: [
      'Motors, drives and actuators',
      'Sensors and instrumentation',
      '3D printing',
      'ISO and IEC',
      'AS/NZS',
      'ADR and EURO',
      'FMEA',
      'ITP and MDR documentation',
      'Commissioning and handover',
    ],
    evidenceTier: 'hands-on',
    tierNote: 'documentation delivered',
  },
] as const
