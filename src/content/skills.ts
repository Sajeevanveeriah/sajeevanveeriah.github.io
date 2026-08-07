import type { EvidenceTier } from './tiers'

/**
 * Skill Library: six tool territories, transcribed from index.html lines
 * 1030 to 1085; voice recast to third person on the owner's 7 August 2026
 * direction, facts unchanged. evidenceTier is ported from the tier chip
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
      'Sajeevan built and validated an autonomous ROS 2 rover stack end to end, and gained hands-on exposure to KUKA industrial robot cells in manufacturing.',
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
      'Sajeevan delivered GMP smart-factory automation, including an iFIX to PVI+ SCADA migration.',
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
      'Sajeevan designed custom PCBs, integrated CAN-connected equipment and telemetry, and developed firmware across professional, capstone and personal builds.',
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
      'Sajeevan built telemetry capture, transport and Linux server paths, and applied ML in digital-twin and robotics projects.',
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
    summary: 'Sajeevan carried out ADAS and vehicle-software validation, plus emissions and compliance testing.',
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
      'Sajeevan applied CAD across capstone, rover and pressure-vessel work, and produced delivery documentation in regulated environments.',
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
