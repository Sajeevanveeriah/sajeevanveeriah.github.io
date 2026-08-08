/**
 * Narrative, credentials, community and Beyond Engineering.
 * Copy originally transcribed from index.html lines 158 to 229 (hero
 * narrative and closed-loop panel), 1403 to 1435 (credentials) and 1437 to
 * 1482 (Beyond Engineering); voice recast to agentless capability voice
 * (no name, no pronouns in prose) on the owner's 7 August 2026 direction
 * after the named third-person cut was rejected, facts unchanged.
 */

import { JOB_TITLE } from './site'

/**
 * The homepage opening, in the specialist voice.
 *
 * Recast on the 6 August 2026 repositioning. The previous lede listed the
 * stack from end to end, which is true and which read as breadth. This one
 * leads with the specialism and treats the same breadth as what makes the
 * specialism deliverable.
 */
export const heroCopy = {
  headline: 'Intelligent systems that move, sense and decide.',
  lede: 'I design, integrate and validate intelligent robotic and mechatronic systems from mechanisms, sensing and embedded control through autonomy, AI/ML, software and deployment.',
} as const

/** Hero lede, index.html:165. Retained for the About page opening rail. */
export const narrative =
  'Work spans the robotics and mechatronics stack: physical systems, electronics, embedded firmware, controls, autonomy, software, data and validation. Each problem is placed in the engineering layer it lives in, then resolved across the disciplines it requires.'

/**
 * The About page opening, supplied verbatim in the 6 August 2026 brief.
 * The production and quality history is framed as a foundation that shapes
 * how the robotics is engineered, never as the current specialism.
 */
export const aboutOpening = {
  title:
    'An engineer specialising in intelligent robotic systems built from the physical layer up.',
  lede: 'I work where mechanics, electronics, embedded control, autonomy, AI/ML and software meet. My role is to make those boundaries work as one system, then validate the result against real operating constraints.',
  foundation:
    'My production, quality and manufacturing foundation shapes how I engineer for reliability, traceability, recovery, serviceability and the realities beyond a laboratory.',
} as const

export const homeStory = {
  kicker: JOB_TITLE,
  headline: 'Intelligent systems that move, sense and decide.',
  proofTitle: 'Engineering from first principles to a tested system.',
  proofKicker: '01 / Complete-package engineering',
  proofSummary:
    'The work joins mechanics, electronics, embedded software, autonomy, controls and validation. Each featured record shows the engineering need, the decisions owned and the evidence behind the result.',
  featuredKicker: 'Selected engineering stories',
  featuredTitle: 'Built across disciplines and tested as a system.',
  responseLabel: 'Response',
  outputLabel: 'Verified output',
  recordLinkLabel: 'Read the engineering record',
  capabilityKicker: 'End-to-end capability',
  capabilityTitle:
    'One connected practice, from physical architecture to autonomy and validation.',
} as const

/**
 * Closed-loop signal panel. The collapsed stage row keeps its original
 * shape; each stage expands into an agentless account of the techniques
 * used at that stage, the systems they were used in, and the records that
 * evidence it.
 */
export const closedLoop = {
  title: 'Closed-loop engineering',
  summary:
    'The engineering workflow closes the loop: sense the system, estimate its state, control it, act on it and verify the result.',
  expandLabel: 'How this stage is closed',
  nodes: [
    {
      index: '01',
      name: 'Sense',
      detail: 'LiDAR, IMU, instrumentation, field devices',
      depth: [
        'Sensing is where every loop starts, and it is treated as an engineering layer rather than as given data. On the rover, LiDAR scans and IMU rates enter a ROS 2 graph with explicit timing and transforms. On the Honours capstone, IMU, time-of-flight, Hall-effect and magnetometer channels were chosen deliberately, so movement features arrive redundantly through modalities with different noise behaviour.',
        'Professional work integrated field devices and instrumentation with control logic in regulated plants, and captured CAN and sensor data on agricultural equipment through a custom-designed board. The shared discipline is signal integrity: conditioning, grounding and calibration decide whether everything downstream is estimation or guesswork.',
      ],
      records: [
        { label: 'ROS 2 rover', href: '/work/autonomous-navigation-rover/' },
        { label: 'Ataxia assessment device', href: '/work/ataxia-assessment-device/' },
        { label: 'Field telemetry platform', href: '/work/iot-monitoring-platform/' },
      ],
    },
    {
      index: '02',
      name: 'Estimate',
      detail: 'Kalman and EKF, sensor fusion, signal conditioning',
      depth: [
        'Raw signals disagree with each other, so estimation is where they become one defensible state. In the rover, wheel odometry and IMU data were fused through Kalman and extended Kalman filters, with LiDAR SLAM supplying the map-referenced correction that stops dead reckoning wandering.',
        'The engineering lives in the noise models and the residuals: process and measurement trust were tuned by watching estimate stability across repeated simulation runs, and on the capstone each sensor channel was conditioned so the offline clinical comparison stayed auditable.',
      ],
      records: [
        { label: 'ROS 2 rover', href: '/work/autonomous-navigation-rover/' },
        { label: 'Ataxia assessment device', href: '/work/ataxia-assessment-device/' },
      ],
    },
    {
      index: '03',
      name: 'Control',
      detail: 'PID, PLC logic, motion and process control',
      depth: [
        'With a trustworthy state the loop is closed. PID motion control in the rover was tuned against simulated behaviour, watching overshoot, rise and settling on each change, and PLC control logic was delivered for pharmaceutical, biotechnology and food-manufacturing systems under GMP.',
        'The same stability and disturbance thinking applies at both scales: a wheel motor and a dosing skid are both plants with dynamics, limits and consequences for getting the loop wrong.',
      ],
      records: [
        { label: 'ROS 2 rover', href: '/work/autonomous-navigation-rover/' },
        { label: 'Regulated smart factory', href: '/work/jag-smart-factory/' },
      ],
    },
    {
      index: '04',
      name: 'Actuate',
      detail: 'Drives, actuators, robots, production equipment',
      depth: [
        'Control earns its keep at the actuator. Drives, motors and actuators were integrated with control logic in plant automation, including hands-on work through the programme that moved carbon-fibre rim layup and demoulding onto KUKA robotic cells.',
        'Production actuation carries obligations simulation never imposes: safety, changeover, recovery and rate. Six years on manufacturing floors taught what a line needs from its equipment before any equipment was specified.',
      ],
      records: [
        { label: 'Regulated smart factory', href: '/work/jag-smart-factory/' },
        { label: 'Robotic rim layup', href: '/work/carbon-revolution-rim-layup/' },
      ],
    },
    {
      index: '05',
      name: 'Verify',
      detail: 'FAT and SAT, CAN evidence, ITPs, qualification',
      depth: [
        'Every loop closes with evidence someone else can audit. FAT and SAT were executed and qualification and handover documentation produced for regulated plants, a migrated SCADA system was verified against the validated original, and every automotive defect report raised was backed with CAN traces.',
        'In manufacturing that discipline ran through ITPs, MDRs and traceability records. Verification is designed before it is executed: acceptance criteria first, evidence at the moment of test, a record for every fault.',
      ],
      records: [
        { label: 'Regulated smart factory', href: '/work/jag-smart-factory/' },
        { label: 'ADAS and CAN validation', href: '/work/adas-can-validation/' },
      ],
    },
  ],
} as const

export interface CredentialGroup {
  readonly label: string
  readonly items: readonly { readonly title?: string; readonly detail: string }[]
}

export const credentials: readonly CredentialGroup[] = [
  {
    label: 'Formal qualifications',
    items: [
      {
        title: 'Bachelor of Mechatronics Engineering (Honours)',
        detail:
          'Completed at Deakin University with Distinction in 2025. The Honours capstone was an ESP32 clinical ataxia assessment device.',
      },
      {
        title: 'Higher National Diploma, Mechatronics, Robotics and Automation Engineering',
        detail: 'Completed at Cardiff Metropolitan University with Distinction in 2016.',
      },
    ],
  },
  {
    label: 'Membership and short courses',
    items: [
      { title: 'Member, Engineers Australia', detail: '' },
      {
        detail:
          'Short courses, not formal qualifications: Lean Six Sigma Foundation, JIRA and Agile, KAIZEN, Industrial Automation and IoT, AI/ML, CAD.',
      },
    ],
  },
  {
    label: 'Community and university involvement',
    items: [
      {
        title: 'Secretary, Newcomb and District Cricket Club.',
        detail: 'This role also covers building and running the club website on Next.js and Supabase.',
      },
      {
        title: 'Deakin Mars Rover Team.',
        detail:
          'Contributed to multidisciplinary student rover engineering across mechanical, electronics, control and software work.',
      },
      {
        title: 'Math Mentors.',
        detail: 'Supported peers with mathematics, problem solving, study skills and exam preparation.',
      },
      {
        title: 'Peer Support.',
        detail: 'Helped fellow students settle in, stay connected and find the right support.',
      },
    ],
  },
] as const

export const beyondHeading = {
  title: 'Away from the stack.',
  summary: 'The week does not end at the workbench. These are five things that keep it balanced.',
} as const

export const beyond: readonly { readonly title: string; readonly body: string }[] = [
  {
    title: 'Club cricket',
    body: 'Most weekends in season are spent at Newcomb and District Cricket Club, both on and off the field: playing for the club and helping keep it running as secretary.',
  },
  {
    title: 'Hockey',
    body: 'Hockey is the cricket off-season counterpart: a different field, a faster ball and the same appetite for team sport.',
  },
  {
    title: 'Long drives',
    body: 'Long drives are the reset button: an open road, no particular hurry and somewhere new at the end of it.',
  },
  {
    title: 'Music',
    body: 'Music is the soundtrack to those drives and to most evenings. Good music is non-negotiable.',
  },
  {
    title: 'Robots in the garage',
    body: 'There is nearly always a personal robotics or hardware build half-finished on the bench. Some of them make it into this portfolio.',
  },
] as const

/** Contact section copy, index.html:1489. */
export const contactIntro =
  'Autonomous mobile robotics, embedded intelligent systems, sensor fusion and control, and the integration and verification that make them deployable. Get in touch by email, LinkedIn or GitHub.'
