/**
 * Narrative, credentials, community and Beyond Engineering.
 * All copy transcribed verbatim from index.html lines 158 to 229 (hero
 * narrative and closed-loop panel), 1403 to 1435 (credentials) and 1437 to
 * 1482 (Beyond Engineering).
 */

import { JOB_TITLE } from './site'

/** Hero lede, index.html:165. */
export const narrative =
  'I build across the robotics and mechatronics stack: physical systems, electronics, embedded firmware, controls, autonomy, software, data and validation. I identify which engineering layer a problem lives in, then work across the disciplines required to resolve it.'

export const homeStory = {
  kicker: JOB_TITLE,
  headline: 'I build intelligent systems that move, sense and decide.',
  proofTitle: 'Engineering from first principles to a tested system.',
  proofKicker: '01 / Complete-package engineering',
  proofSummary:
    'My work joins mechanics, electronics, embedded software, autonomy, controls and validation. Each featured record shows the engineering need, the decisions I owned and the evidence behind the result.',
  featuredKicker: 'Selected engineering stories',
  featuredTitle: 'Built across disciplines and tested as a system.',
  responseLabel: 'Response',
  outputLabel: 'Verified output',
  recordLinkLabel: 'Read the engineering record',
  capabilityKicker: 'End-to-end capability',
  capabilityTitle:
    'One connected practice, from physical architecture to autonomy and validation.',
} as const

/** Closed-loop signal panel, index.html:183 to 227. */
export const closedLoop = {
  title: 'Closed-loop engineering',
  summary:
    'My engineering workflow closes the loop: I sense the system, estimate its state, control it, act on it and verify the result.',
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
          'I graduated from Deakin University with Distinction in 2025. My Honours capstone was an ESP32 clinical ataxia assessment device.',
      },
      {
        title: 'Higher National Diploma, Mechatronics, Robotics and Automation Engineering',
        detail: 'I completed this qualification at Cardiff Metropolitan University with Distinction in 2016.',
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
        detail: 'I also built and run the club website on Next.js and Supabase.',
      },
      {
        title: 'Deakin Mars Rover Team.',
        detail:
          'I contributed to multidisciplinary student rover engineering across mechanical, electronics, control and software work.',
      },
      {
        title: 'Math Mentors.',
        detail: 'I supported peers with mathematics, problem solving, study skills and exam preparation.',
      },
      {
        title: 'Peer Support.',
        detail: 'I helped fellow students settle in, stay connected and find the right support.',
      },
    ],
  },
] as const

export const beyondHeading = {
  title: 'Away from the stack.',
  summary: 'My week does not end at the workbench. These are five things that keep me balanced.',
} as const

export const beyond: readonly { readonly title: string; readonly body: string }[] = [
  {
    title: 'Club cricket',
    body: 'I spend most weekends in season at Newcomb and District Cricket Club, both on and off the field. I play for the club and help keep it running as secretary.',
  },
  {
    title: 'Hockey',
    body: "Hockey is my cricket off-season counterpart: a different field, a faster ball and the same appetite for team sport.",
  },
  {
    title: 'Long drives',
    body: 'Long drives are my reset button: an open road, no particular hurry and somewhere new at the end of it.',
  },
  {
    title: 'Music',
    body: 'Music is the soundtrack to my drives and most evenings. Good music is non-negotiable for me.',
  },
  {
    title: 'Robots in the garage',
    body: 'I nearly always have a personal robotics or hardware build half-finished on the bench. Some of them make it into this portfolio.',
  },
] as const

/** Contact section copy, index.html:1489. */
export const contactIntro =
  'I work across robotics, mechatronics, AI/ML, autonomous systems, embedded intelligence and end-to-end automation engineering.'
