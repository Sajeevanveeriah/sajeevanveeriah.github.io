/**
 * Voltwyn services page: one offer, a paid Define phase as the entry step and
 * the rate basis. Figures Saj has not yet decided are square-bracket
 * placeholders that the page renders visibly; they are never replaced with
 * invented numbers. Clients are not named anywhere on the site, so the proof
 * points at the anonymised Industrial Display Controller record.
 */
export const placeholders = {
  rate: '[RATE PER HOUR]',
  defineFee: '[DEFINE PHASE FEE]',
  business: '[BUSINESS NAME AND ABN LINE]',
} as const

export const servicesPage = {
  /** Content date; the sitemap uses it for this route. */
  updated: '2026-10-20',
  brand: 'Voltwyn',
  tagline: 'Electronics, controls and software',
  title: 'Controller and sensor-interface boards for industrial equipment.',
  lede:
    'Voltwyn is my engineering practice, and it does one thing: custom controller and sensor-interface boards for industrial equipment, taken from schematic and four-layer PCB through firmware and browser configuration to a verification pack that states what was tested and what it proves.',
  description:
    'Custom controller and sensor-interface boards for industrial equipment, from schematic and four-layer PCB to firmware, browser configuration and a verification pack.',
  location: 'Victoria, Australia, remote and on-site',
  proofSlug: 'industrial-display-controller',
  /** Journal post that explains the design decisions behind the proof record. */
  proofStory: '/blog/industrial-display-controller-case-study/',
} as const

export const deliverables = [
  {
    title: 'Schematic',
    detail: 'Schematic capture in KiCad: power, processing, interfaces and protection, reviewed against the agreed specification before layout starts.',
  },
  {
    title: 'Four-layer PCB',
    detail: 'Layout with footprint, connector and dissipation review, then the fabrication and assembly package: Gerbers, drill files, placement file and bill of materials.',
  },
  {
    title: 'Firmware',
    detail: 'Embedded C/C++ for ESP32 or STM32 class microcontrollers, with explicit operating states, outputs held safe until enabled and automated tests that run without the hardware.',
  },
  {
    title: 'Browser configuration',
    detail: 'A local browser interface served by the device, so a technician can configure and update it from a laptop or phone without installing software.',
  },
  {
    title: 'Verification pack',
    detail: 'A written record of what was checked and how: review findings, test procedures and results, assembled-board measurements and release files, each stating what it does and does not prove.',
  },
] as const

export const fit = {
  forWhom: {
    title: 'Who it is for',
    detail:
      'Equipment makers, machine builders and integrators who need a board that off-the-shelf modules do not cover: an indicator to drive, a sensor to condition, an actuator to control or a legacy serial interface to bridge, with a configuration screen a technician can use.',
  },
  outside: {
    title: 'Outside the offer',
    detail: 'PLC and SCADA integration projects, safety-rated control systems and volume manufacturing. If your job is one of these I will say so early and point you to a better fit.',
  },
} as const

export const phases = [
  {
    label: 'Phase 1',
    title: 'Define',
    detail:
      'A short, paid study before any design work. We agree what the board must do, what it connects to, the environment it lives in, the limits on size, power and cost, and the acceptance criteria.',
    deliver: 'A written specification, interface list, block diagram, risk register and a fixed-price quote for the Design phase.',
    basis: `Fixed fee of ${placeholders.defineFee} agreed before work starts.`,
  },
  {
    label: 'Phase 2',
    title: 'Design',
    detail:
      'Schematic, four-layer PCB layout, firmware and the browser configuration interface, with a design review before the fabrication package is released. Board fabrication and assembly costs are separate.',
    deliver: 'Fabrication and assembly package, bill of materials, firmware source and build, configuration interface and the design review record.',
    basis: 'Fixed price, quoted from the Define phase specification.',
  },
  {
    label: 'Phase 3',
    title: 'Bring-up and verification',
    detail:
      'Assembled boards measured against the specification: power rails, interfaces, timing and thermal behaviour. The firmware is then commissioned on real inputs, on site where the equipment needs it.',
    deliver: 'Verification pack, measurement record, commissioning notes and handover.',
    basis: `Hourly at ${placeholders.rate} per hour, with a cap agreed in writing before the phase starts.`,
  },
] as const

export const supportNote = 'After handover: changes, further revisions and production questions at the hourly rate, by arrangement.'

export const rateCard = [
  { item: 'Engineering time', basis: `${placeholders.rate} per hour. Time is recorded against each task and reported with the invoice.` },
  { item: 'Define phase', basis: `Fixed fee of ${placeholders.defineFee} agreed before work starts.` },
  { item: 'Design phase', basis: 'Fixed price, quoted from the Define phase specification. Board fabrication and assembly costs are separate.' },
  { item: 'Bring-up and verification', basis: 'Hourly at the engineering rate, with a cap agreed in writing before the phase starts.' },
  { item: 'Support after handover', basis: 'Hourly at the engineering rate, by arrangement.' },
  { item: 'On-site work', basis: 'Victoria, Australia. Travel is agreed in the quote.' },
  { item: 'Files and ownership', basis: 'Design files, firmware source and the verification pack are delivered with each phase. Ownership terms are set out in the quote.' },
  { item: 'Invoicing', basis: `Invoices are issued by ${placeholders.business} and show GST separately. Prices are in Australian dollars and exclude GST.` },
] as const

export const enquiry = {
  title: 'Start with a Define phase.',
  detail: 'Tell me what the equipment does, what the board has to talk to and what a good result looks like. I reply with a short list of questions and a Define phase proposal.',
  topic: 'Project or consulting work',
} as const
