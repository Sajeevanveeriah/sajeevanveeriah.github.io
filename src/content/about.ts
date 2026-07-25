/**
 * Narrative, credentials, community and Beyond Engineering.
 * All copy transcribed verbatim from index.html lines 158 to 229 (hero
 * narrative and closed-loop panel), 1403 to 1435 (credentials) and 1437 to
 * 1482 (Beyond Engineering).
 */

/** Hero lede, index.html:165. */
export const narrative =
  'Sajeevan Veeriah builds across the robotics and mechatronics stack: physical systems, electronics, embedded firmware, controls, autonomy, software, data and validation. He is comfortable identifying which engineering layer a problem lives in and resolving it across the disciplines required.'

/** Closed-loop signal panel, index.html:183 to 227. */
export const closedLoop = {
  title: 'Closed-loop engineering',
  summary:
    'The discipline behind every record on this page: sense the system, estimate its state, control it, act on it and verify the result.',
  nodes: [
    { index: '01', name: 'Sense', detail: 'LiDAR, IMU, instrumentation, field devices' },
    {
      index: '02',
      name: 'Estimate',
      detail: 'Kalman and EKF, sensor fusion, signal conditioning',
    },
    { index: '03', name: 'Control', detail: 'PID, PLC logic, motion and process control' },
    { index: '04', name: 'Actuate', detail: 'Drives, actuators, robots, production equipment' },
    { index: '05', name: 'Verify', detail: 'FAT and SAT, CAN evidence, ITPs, qualification' },
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
          'Deakin University. Graduated with Distinction, 2025. Honours capstone: ESP32 clinical ataxia assessment device.',
      },
      {
        title: 'Higher National Diploma, Mechatronics, Robotics and Automation Engineering',
        detail: 'Cardiff Metropolitan University. Awarded with Distinction, 2016.',
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
        detail: 'Also built and runs the club website on Next.js and Supabase.',
      },
      {
        title: 'Deakin Mars Rover Team.',
        detail:
          'Multidisciplinary student rover engineering across mechanical, electronics, control and software work.',
      },
      {
        title: 'Math Mentors.',
        detail: 'Peer mathematics mentoring: problem solving, study skills and exam preparation.',
      },
      {
        title: 'Peer Support.',
        detail: 'Helping fellow students settle in, stay connected and find the right help.',
      },
    ],
  },
] as const

export const beyondHeading = {
  title: 'Away from the stack.',
  summary: 'The week does not end at the workbench. Five things that keep it balanced.',
} as const

export const beyond: readonly { readonly title: string; readonly body: string }[] = [
  {
    title: 'Club cricket',
    body: 'Most weekends in season are spent at Newcomb and District Cricket Club, on the field and off it: Saj plays for the club and keeps it running as secretary.',
  },
  {
    title: 'Hockey',
    body: "Cricket's off-season counterpart. A different field, a faster ball and the same appetite for team sport.",
  },
  {
    title: 'Long drives',
    body: 'The reset button: an open road, no particular hurry and somewhere new at the end of it.',
  },
  {
    title: 'Music',
    body: 'The soundtrack to those drives, and to most evenings besides. Good music is non-negotiable.',
  },
  {
    title: 'Robots in the garage',
    body: 'There is always a personal robotics or hardware build half-finished on the bench. Some of them even make it onto this page.',
  },
] as const

/** Contact section copy, index.html:1489. */
export const contactIntro =
  'Open to roles across mechatronics, robotics, automation, embedded systems, controls, validation, IoT, AI/ML and smart factory engineering. The resume carries the full professional record.'
