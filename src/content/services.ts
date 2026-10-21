/**
 * Voltwyn services page: four service areas, a paid Define phase as the entry
 * step and the rate basis. Pricing set by Saj on 21 October 2026 from
 * Australian market rates; amounts are Australian dollars excluding GST.
 * Change them only on his instruction. Each area links to a project already on
 * the site and shows that record's own evidence stage. Clients are not named,
 * and plant-controls integration is deliberately left off this page.
 */
export const pricing = {
  rate: 'A$140',
  defineFee: 'A$1,400',
  invoicer: 'Sajeevan Veeriah, sole trader, ABN 17 630 081 594',
} as const

export const servicesPage = {
  /** Content date; the sitemap uses it for this route. */
  updated: '2026-10-21',
  brand: 'Voltwyn',
  tagline: 'Electronics, controls and software',
  title: 'Robotics, mechatronics and AI/ML engineering, from concept to working prototype.',
  lede:
    'Voltwyn is my engineering practice. I take robotics, mechatronic, embedded and AI/ML problems from the first requirement to a working prototype, with the tests and records that show what the result does and does not prove.',
  description:
    'Robotics, mechatronics, embedded electronics and AI/ML engineering, from concept to working prototype, with a paid Define phase first and a published rate.',
  location: 'Victoria, Australia, remote and on-site',
} as const

export interface ServiceArea {
  readonly id: string
  readonly title: string
  readonly scope: string
  readonly detail: string
  readonly start: string
  /** Project records on the site that back the area. */
  readonly proof: readonly string[]
  /** Evidence limit quoted from the proof record, where it matters to the claim. */
  readonly boundary?: string
}

export const areas: readonly ServiceArea[] = [
  {
    id: 'robotics',
    title: 'Robotics and autonomy',
    scope: 'ROS 2, navigation, sensor fusion and motion control.',
    detail: 'Robots that sense, localise, plan and recover, with the navigation stack checked in simulation before it runs on hardware.',
    start: 'A Define phase that sets the task, the sensors, the operating area and the simulation tests the robot has to pass.',
    proof: ['autonomous-navigation-rover'],
  },
  {
    id: 'mechatronics',
    title: 'Mechatronic design and prototypes',
    scope: 'Mechanisms, actuators, sensors and test rigs.',
    detail: 'Mechanical, electrical and control design worked out together, then built into a prototype you can test and improve.',
    start: 'A Define phase covering loads, motion, environment and what the prototype has to demonstrate.',
    proof: ['waterless-solar-panel-cleaner'],
  },
  {
    id: 'embedded',
    title: 'Embedded electronics',
    scope: 'Custom PCBs, ESP32 and STM32 firmware, sensor interfaces and communications.',
    detail: 'Boards and firmware with explicit operating states, outputs held safe until enabled and tests that run without the hardware.',
    start: 'A Define phase that fixes the interfaces, power, environment and acceptance criteria for the board.',
    proof: ['industrial-display-controller'],
    boundary: 'These checks support the PCB design and software behaviour; assembled-board measurements and field validation remain separate work.',
  },
  {
    id: 'ai-ml',
    title: 'AI/ML, vision and data',
    scope: 'Perception, inspection, time-series analysis and decision tools.',
    detail: 'Models and tools built so a person can check the input, the rule and the result before acting on it.',
    start: 'A Define phase that agrees the data available, the decision it should support and how the results will be judged.',
    proof: ['deadline-aware-runtime-assurance', 'pricing-inventory-control'],
  },
] as const

export const fit = {
  forWhom: {
    title: 'Who it is for',
    detail:
      'Equipment makers, machine builders, research teams and businesses that need a robot, mechanism, board or model built and tested, and documented well enough to hand over.',
  },
  outside: {
    title: 'Outside the offer',
    detail: 'Safety-rated control systems, certified products and volume manufacturing. If your job needs one of these I will say so early and point you to a better fit.',
  },
} as const

export const phases = [
  {
    label: 'Phase 1',
    title: 'Define',
    detail:
      'A short, paid study before any design work. We agree what the system must do, what it connects to, the environment it works in, the limits on size, power and cost, and the acceptance criteria.',
    deliver: 'A written specification, interface list, block diagram, risk register and a fixed-price quote for the Design and build phase.',
    basis: `Fixed fee of ${pricing.defineFee} for one system or prototype, agreed before work starts.`,
  },
  {
    label: 'Phase 2',
    title: 'Design and build',
    detail:
      'Mechanical, electronic, firmware and software design to the agreed specification, with a design review before parts are ordered or boards are made. Materials, parts, fabrication and assembly costs are separate.',
    deliver: 'Design files, bill of materials, firmware and software source, the working prototype and the design review record.',
    basis: 'Fixed price, quoted from the Define phase specification.',
  },
  {
    label: 'Phase 3',
    title: 'Test and handover',
    detail:
      'The prototype is tested against the acceptance criteria from the Define phase: measurements, simulation runs or data checks, as the work needs. Testing happens on site where the equipment requires it.',
    deliver: 'Verification pack, test records and handover notes.',
    basis: `Hourly at ${pricing.rate} per hour, with a cap agreed in writing before the phase starts.`,
  },
] as const

export const supportNote = 'After handover: changes, further revisions and production questions at the hourly rate, by arrangement.'

export const rateCard = [
  { item: 'Engineering time', basis: `${pricing.rate} per hour. Time is recorded against each task and reported with the invoice.` },
  { item: 'Define phase', basis: `Fixed fee of ${pricing.defineFee} for one system or prototype, agreed before work starts.` },
  { item: 'Design and build phase', basis: 'Fixed price, quoted from the Define phase specification. Materials, parts, fabrication and assembly costs are separate.' },
  { item: 'Test and handover', basis: 'Hourly at the engineering rate, with a cap agreed in writing before the phase starts.' },
  { item: 'Support after handover', basis: 'Hourly at the engineering rate, by arrangement.' },
  { item: 'On-site work', basis: 'Victoria, Australia. Travel is agreed in the quote.' },
  { item: 'Files and ownership', basis: 'Design files, source code and the verification pack are delivered with each phase. Ownership terms are set out in the quote.' },
  { item: 'Invoicing', basis: `Invoices are issued by ${pricing.invoicer}, registered for GST, and show GST separately. Prices are in Australian dollars and exclude GST.` },
] as const

export const enquiry = {
  title: 'Start with a Define phase.',
  detail: 'Tell me what you are building, what it has to work with and what a good result looks like. I reply with a short list of questions and a Define phase proposal.',
  topic: 'Project or consulting work',
} as const
