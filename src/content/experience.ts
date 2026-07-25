import type { EvidenceTier } from './tiers'

/**
 * Career record: seven roles, transcribed verbatim from index.html lines
 * 1097 to 1399.
 *
 * Binding rules carried over from AGENTS.md:
 *   - Ford appears only as "Ford Motor Company via Invenio contract
 *     placement", never as direct Ford employment.
 *   - JAG Process Solutions is Jan 2026 to Jun 2026. No role uses "Present".
 *   - The previous site carried no dates for IDL, Carbon Revolution or
 *     Thornton Engineering. They stay null rather than being reconstructed.
 *   - No locations, ever.
 */

export interface Role {
  readonly slug: string
  readonly company: string
  readonly title: string
  /** null where the previous site carried no date range. */
  readonly period: string | null
  readonly summary: string
  readonly domains: readonly string[]
  readonly tools: readonly string[]
  /** Label used above the tools line: "Representative tools" or context. */
  readonly toolsLabel: string
  readonly achievements: readonly string[]
  readonly relevance: string
  readonly transferable: string
  readonly evidenceTiers: readonly EvidenceTier[]
  readonly group: 'recent' | 'foundation'
  /** Work records covering the same employer. */
  readonly relatedProjects: readonly string[]
}

export const experienceGroups = {
  recent: {
    period: 'Feb 2024 to Jun 2026',
    kicker: 'Automation, validation, compliance and IoT',
    heading: 'Recent engineering roles',
  },
  foundation: {
    period: '2018 to 2024',
    kicker: 'Manufacturing, QA and the production floor',
    heading: 'Foundation: manufacturing, quality and production',
  },
} as const

export const experience: readonly Role[] = [
  {
    slug: 'jag-process-solutions',
    company: 'JAG Process Solutions Pty Ltd',
    title: 'Automation and Controls Engineer',
    period: 'Jan 2026 to Jun 2026',
    summary:
      'Delivered control, integration and smart-factory engineering for pharmaceutical, biotech and food clients under GMP, including a full SCADA platform migration.',
    domains: [
      'Automation and SCADA',
      'Controls',
      'Regulated manufacturing',
      'Commissioning and delivery',
    ],
    toolsLabel: 'Representative tools',
    tools: ['Siemens TIA Portal', 'WinCC', 'PCS 7', 'iFIX', 'PVI+', 'MES and batch'],
    achievements: [
      'Delivered automation and smart-factory engineering for pharmaceutical, biotech, food and process clients under GMP.',
      'Worked across control logic, HMI, SCADA, MES and batch execution.',
      'Executed an iFIX to PVI+ SCADA migration by converting application content and verifying behaviour against the existing validated system.',
      'Produced FAT, SAT, commissioning, qualification and handover documentation.',
      'Integrated field devices, sensors, drives and process equipment with control logic and production data flows.',
      'Resolved faults raised during testing and site support with attention to diagnostics, safety, usability and data integrity.',
    ],
    relevance:
      'Industrial automation, process control, HMI and SCADA, MES, batch systems, GMP, GAMP 5, commissioning, validation, field-device integration, production data and regulated documentation.',
    transferable:
      'This role ties together controls, software, process systems, operator workflows and compliance. It shows the ability to work across both the machine layer and the validation layer, which is valuable for automation, robotics, smart factory, digital twin and regulated engineering environments.',
    evidenceTiers: ['delivered'],
    group: 'recent',
    relatedProjects: ['jag-smart-factory'],
  },
  {
    slug: 'ford-via-invenio',
    company: 'Ford Motor Company via Invenio contract placement',
    title: 'Product Development Test Engineer (Contract)',
    period: 'Oct 2025 to Jan 2026',
    summary:
      'Validated vehicle software integration and ADAS features across the T6 Ranger and Everest programmes with CAN-level evidence for readiness milestones and OTA sign-off.',
    domains: ['Automotive and validation', 'Embedded networks', 'Test engineering'],
    toolsLabel: 'Representative tools',
    tools: ['Vector CANoe', 'CANalyzer', 'CAN and CAN FD', 'vehicle instrumentation'],
    achievements: [
      'Validated vehicle software integration and ADAS features across T6 Ranger and Everest programmes.',
      'Ran feature-vehicle, breadboard and regression testing for readiness milestones and OTA updates.',
      'Instrumented test vehicles and conducted structured test drives in controlled and real-world conditions.',
      'Captured and analysed CAN bus data using Vector CANoe and CANalyzer.',
      'Supported evidence-based defect reporting, fault isolation and verification.',
    ],
    relevance:
      'Automotive validation, ADAS, vehicle networks, CAN, CAN FD, test procedures, regression testing, OTA validation, instrumentation, diagnostics and evidence-based engineering.',
    transferable:
      'This role connects embedded systems, vehicle behaviour, test engineering and fault evidence. It strengthens the ability to validate cyber-physical systems where software, sensors, networks, control logic and real-world operation interact. It is the same closed-loop validation discipline that robotics and automation systems demand: sense, estimate, control, actuate and verify against real behaviour.',
    evidenceTiers: ['delivered'],
    group: 'recent',
    relatedProjects: ['adas-can-validation'],
  },
  {
    slug: 'abmarc',
    company: 'ABMARC',
    title: 'Technical Assistant',
    period: 'Jul 2024 to Aug 2025',
    summary:
      'Conducted vehicle emissions and compliance testing against ADR and EURO standards, producing repeatable, auditable and technically defensible results.',
    domains: ['Automotive and compliance', 'Instrumentation and DAQ', 'Quality and reporting'],
    toolsLabel: 'Representative tools',
    tools: ['Emissions instrumentation', 'data-acquisition systems', 'QA records'],
    achievements: [
      'Supported vehicle emissions and compliance testing against ADR and EURO standards.',
      'Operated test equipment, instrumentation and data-acquisition systems.',
      'Followed repeatable procedures for auditable and technically defensible test results.',
      'Prepared compliance, QA and regulatory documentation for certification, audits and reporting.',
      'Reviewed test data to identify deviations, trends and evidence gaps.',
    ],
    relevance:
      'Emissions testing, vehicle compliance, instrumentation, data acquisition, test repeatability, QA records, regulatory documentation, standards exposure and technical reporting.',
    transferable:
      'This role strengthened test discipline, evidence handling and systems-level thinking. It applies directly to validation roles where measurement quality, repeatability, documentation and fault interpretation matter as much as the test itself, and carries straight into robotics and automation commissioning, where a measurement is only as trustworthy as its repeatability and its record.',
    evidenceTiers: ['delivered'],
    group: 'recent',
    relatedProjects: ['emissions-compliance-testing'],
  },
  {
    slug: 'duxtel',
    company: 'DuxTel Pty Ltd',
    title: 'Consultant Engineer, IoT and Projects Administrator',
    period: 'Feb 2024 to Aug 2024',
    summary:
      'Designed and deployed field telemetry systems linking custom electronics, CAN capture, location, condition sensing, MikroTik edge equipment, Linux server integration and field deployment.',
    domains: ['IoT and telemetry', 'Embedded and vehicle interfaces', 'Linux integration'],
    toolsLabel: 'Representative tools',
    tools: [
      'Custom PCB design',
      'CAN capture',
      'GPS or GNSS',
      'sensor interfacing',
      'MikroTik',
      'Linux',
    ],
    achievements: [
      'Designed and deployed IoT systems linking sensors, embedded devices, gateways, cloud platforms and dashboards.',
      'Integrated multiple data capture and transfer paths into a Linux-based server for remote status collection.',
      'Integrated devices with MikroTik equipment for field connectivity.',
      'Designed a complete custom PCB from scratch for agricultural equipment CAN capture, GPS or GNSS location capability and available condition-sensing inputs.',
      'Supported documentation and post-deployment handover.',
    ],
    relevance:
      'Embedded systems, IoT telemetry, custom PCB design, CAN trace capture, GPS or GNSS location, sensor interfacing, MikroTik connectivity, Linux servers, deployment and field validation.',
    transferable:
      'This role bridges embedded devices, communications, cloud data and operational visibility. It supports the broader complete-package profile because it moves from sensor-level hardware through network configuration to data pipelines and user-facing dashboards. The sensor-to-cloud telemetry it builds is the same backbone robotics and automation rely on for monitoring, diagnostics and control.',
    evidenceTiers: ['delivered'],
    group: 'recent',
    relatedProjects: ['iot-monitoring-platform'],
  },
  {
    slug: 'idl',
    company: 'IDL',
    title: 'Production Line Worker to Team Lead / Line Support to Cellar Hand',
    period: null, // TODO: Saj to supply. The previous site carried no dates.
    summary:
      'Food and beverage manufacturing across five production lines, with progression from line work into team lead, line support and cellar operations.',
    domains: ['Manufacturing and quality', 'Machine operations', 'Installation and commissioning'],
    toolsLabel: 'Representative context',
    tools: [
      'Canning, bottling and kegging lines',
      'WestRock and Fibre King line upgrade',
      'changeovers',
      'KPI tracking',
      'QA checks',
    ],
    achievements: [
      'Started as a production line worker and progressed into a team lead and line-support role.',
      'Supported five production lines: two canning lines, two bottling lines and one kegging line.',
      'Supported daily production execution, changeovers, run completion, KPI tracking, quality checks and first-response machine fixes.',
      'Took part in the installation and commissioning of WestRock and Fibre King packaging equipment during the canning line upgrade.',
      'Moved into cellar operations to learn beverage-making processes upstream of packaging, including wine, beer, cider and other beverages.',
    ],
    relevance:
      'High-throughput production systems, machine reliability, changeover logic, operator-centred workflows, packaging automation, equipment installation and commissioning, quality assurance, traceability and process learning from raw product to finished package.',
    transferable:
      'This experience connects directly to automation and controls because it showed how real operators interact with machines, how small mechanical or control issues affect throughput, and why usability, changeover design, line recovery and traceable QA matter in production systems.',
    evidenceTiers: ['delivered', 'hands-on'],
    group: 'foundation',
    relatedProjects: ['idl-canning-line', 'manufacturing-qa-foundation'],
  },
  {
    slug: 'carbon-revolution',
    company: 'Carbon Revolution',
    title: 'Automated Rim Layup Operator to Robotic Automation, Quality and Development Support',
    period: null, // TODO: Saj to supply. The previous site carried no dates.
    summary:
      'Advanced carbon-fibre automotive wheel manufacturing, hands-on through the automation programme that replaced the legacy rim layup machine with new KUKA-based robotic cells, while moving from layup operation towards quality assurance and development support.',
    domains: [
      'Advanced manufacturing',
      'Robotics and automation',
      'Quality and inspection',
      'Process development',
    ],
    toolsLabel: 'Representative context',
    tools: [
      'Legacy and KUKA-based automated rim layup',
      'robotic demoulding',
      'composite production',
      'NDE and mechanical testing',
    ],
    achievements: [
      'Operated the legacy automated rim layup machine on the carbon-fibre wheel line.',
      'Was hands-on through the automation programme that replaced the legacy rim layup machine with new KUKA-based robotic cells for automated layup and robotic demoulding of the hot, heavy wheel tooling.',
      'Supported trials, changeovers, quality checks and line recovery as the new KUKA robotic manufacturing line was commissioned and brought into production.',
      'Moved closer to quality assurance and development work around the automated rim layup process.',
      'Gained hands-on exposure to carbon-fibre manufacturing, industrial robotics, automated layup, production quality, defect awareness and the practical realities of scaling advanced composite manufacturing.',
      'Supported wider production areas including NDE and mechanical testing.',
    ],
    relevance:
      'Advanced manufacturing, carbon-fibre composites, industrial robotics, KUKA-based robotic cells, automated layup and robotic demoulding, cell commissioning support, quality assurance, NDE, mechanical testing, defect detection, production repeatability, process development and manufacturing scale-up.',
    transferable:
      'This role strengthened the link between industrial robotics, automation, materials, machine behaviour and product quality. Being hands-on as a legacy line was replaced by KUKA-based robotic cells showed how process variation, fibre placement, inspection, testing and operator feedback influence high-performance manufacturing, and what it takes to move a production line onto robotic automation.',
    evidenceTiers: ['hands-on'],
    group: 'foundation',
    relatedProjects: ['carbon-revolution-rim-layup', 'manufacturing-qa-foundation'],
  },
  {
    slug: 'thornton-engineering',
    company: 'Thornton Engineering Australia Pty Ltd',
    title: 'Quality Assurance / Undergraduate Engineering Support',
    period: null, // TODO: Saj to supply. The previous site carried no dates.
    summary:
      'Structural steel and pressure vessel QA in a standards-driven fabrication environment, operating as second to the QA manager.',
    domains: ['Quality and documentation', 'Mechanical and CAD', 'Standards-driven delivery'],
    toolsLabel: 'Representative context',
    tools: ['ITPs', 'MDRs', 'drawing review', 'pressure-vessel CAD', 'traceability'],
    achievements: [
      'Worked within the quality assurance team and operated as second to the QA manager across fabrication quality workflows.',
      'Supported quality areas for structural-steel and pressure-vessel work.',
      'Prepared, maintained and reviewed ITPs, MDRs, quality records and traceability documents.',
      'Reviewed engineering drawings and specifications for inspection planning and compliance.',
      'Helped coordinate inspection evidence, non-conformance follow-up and fabrication documentation.',
      'Supported NDE and mechanical testing evidence workflows as part of fabrication QA and inspection support.',
      'Signed off QA documentation within the scope given.',
      'Developed CAD designs for pressure vessels that progressed into fabrication.',
    ],
    relevance:
      'Structural steel fabrication, pressure-vessel QA, CAD, drawing review, ITPs, MDRs, material traceability, welding and fabrication documentation, NDE, mechanical testing, inspection planning, QA sign-off and standards-driven delivery.',
    transferable:
      'This role built the documentation and quality discipline behind engineering delivery. It connects strongly to regulated automation and commissioning work because both require clear requirements, inspection evidence, traceability, sign-offs and defensible handover documentation. The same mechanical, CAD and quality rigour underpins robot hardware, fixtures, machine frames and automation structures just as much as pressure vessels.',
    evidenceTiers: ['delivered', 'hands-on'],
    group: 'foundation',
    relatedProjects: ['manufacturing-qa-foundation'],
  },
] as const

export function getRole(slug: string): Role | undefined {
  return experience.find((r) => r.slug === slug)
}
