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
      'I delivered control, integration and smart-factory engineering for pharmaceutical, biotech and food clients under GMP, including a full SCADA platform migration.',
    domains: [
      'Automation and SCADA',
      'Controls',
      'Regulated manufacturing',
      'Commissioning and delivery',
    ],
    toolsLabel: 'Representative tools',
    tools: ['Siemens TIA Portal', 'WinCC', 'PCS 7', 'iFIX', 'PVI+', 'MES and batch'],
    achievements: [
      'I delivered automation and smart-factory engineering for pharmaceutical, biotech, food and process clients under GMP.',
      'I worked across control logic, HMI, SCADA, MES and batch execution.',
      'I executed an iFIX to PVI+ SCADA migration by converting application content and verifying behaviour against the existing validated system.',
      'I produced FAT, SAT, commissioning, qualification and handover documentation.',
      'I integrated field devices, sensors, drives and process equipment with control logic and production data flows.',
      'I resolved faults raised during testing and site support with attention to diagnostics, safety, usability and data integrity.',
    ],
    relevance:
      'Industrial automation, process control, HMI and SCADA, MES, batch systems, GMP, GAMP 5, commissioning, validation, field-device integration, production data and regulated documentation.',
    transferable:
      'In this role, I connected controls, software, process systems, operator workflows and compliance. I worked across both the machine layer and the validation layer, building capability relevant to automation, robotics, smart factory, digital twin and regulated engineering environments.',
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
      'I validated vehicle software integration and ADAS features across the T6 Ranger and Everest programmes, using CAN-level evidence for readiness milestones and OTA sign-off.',
    domains: ['Automotive and validation', 'Embedded networks', 'Test engineering'],
    toolsLabel: 'Representative tools',
    tools: ['Vector CANoe', 'CANalyzer', 'CAN and CAN FD', 'vehicle instrumentation'],
    achievements: [
      'I validated vehicle software integration and ADAS features across T6 Ranger and Everest programmes.',
      'I ran feature-vehicle, breadboard and regression testing for readiness milestones and OTA updates.',
      'I instrumented test vehicles and conducted structured test drives in controlled and real-world conditions.',
      'I captured and analysed CAN bus data using Vector CANoe and CANalyzer.',
      'I supported evidence-based defect reporting, fault isolation and verification.',
    ],
    relevance:
      'Automotive validation, ADAS, vehicle networks, CAN, CAN FD, test procedures, regression testing, OTA validation, instrumentation, diagnostics and evidence-based engineering.',
    transferable:
      'In this role, I connected embedded systems, vehicle behaviour, test engineering and fault evidence. I strengthened my ability to validate cyber-physical systems where software, sensors, networks, control logic and real-world operation interact. I apply the same closed-loop discipline to robotics and automation: sense, estimate, control, actuate and verify against real behaviour.',
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
      'I conducted vehicle emissions and compliance testing against ADR and EURO standards, producing repeatable, auditable and technically defensible results.',
    domains: ['Automotive and compliance', 'Instrumentation and DAQ', 'Quality and reporting'],
    toolsLabel: 'Representative tools',
    tools: ['Emissions instrumentation', 'data-acquisition systems', 'QA records'],
    achievements: [
      'I supported vehicle emissions and compliance testing against ADR and EURO standards.',
      'I operated test equipment, instrumentation and data-acquisition systems.',
      'I followed repeatable procedures for auditable and technically defensible test results.',
      'I prepared compliance, QA and regulatory documentation for certification, audits and reporting.',
      'I reviewed test data to identify deviations, trends and evidence gaps.',
    ],
    relevance:
      'Emissions testing, vehicle compliance, instrumentation, data acquisition, test repeatability, QA records, regulatory documentation, standards exposure and technical reporting.',
    transferable:
      'In this role, I strengthened my test discipline, evidence handling and systems-level thinking. I apply those habits wherever measurement quality, repeatability, documentation and fault interpretation matter, including robotics and automation commissioning.',
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
      'I designed and deployed field telemetry systems linking custom electronics, CAN capture, location, condition sensing, MikroTik edge equipment and Linux server integration.',
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
      'I designed and deployed IoT systems linking sensors, embedded devices, gateways, cloud platforms and dashboards.',
      'I integrated multiple data capture and transfer paths into a Linux-based server for remote status collection.',
      'I integrated devices with MikroTik equipment for field connectivity.',
      'I designed a complete custom PCB from scratch for agricultural equipment CAN capture, GPS or GNSS location capability and available condition-sensing inputs.',
      'I supported documentation and post-deployment handover.',
    ],
    relevance:
      'Embedded systems, IoT telemetry, custom PCB design, CAN trace capture, GPS or GNSS location, sensor interfacing, MikroTik connectivity, Linux servers, deployment and field validation.',
    transferable:
      'In this role, I bridged embedded devices, communications, cloud data and operational visibility. I worked from sensor-level hardware through network configuration to data pipelines and user-facing dashboards, using the same sensor-to-cloud backbone that robotics and automation rely on for monitoring, diagnostics and control.',
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
      'I worked across five food and beverage production lines, progressing from line work into team lead, line support and cellar operations.',
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
      'I started as a production line worker and progressed into a team lead and line-support role.',
      'I supported five production lines: two canning lines, two bottling lines and one kegging line.',
      'I supported daily production execution, changeovers, run completion, KPI tracking, quality checks and first-response machine fixes.',
      'I took part in the installation and commissioning of WestRock and Fibre King packaging equipment during the canning line upgrade.',
      'I moved into cellar operations to learn beverage-making processes upstream of packaging, including wine, beer, cider and other beverages.',
    ],
    relevance:
      'High-throughput production systems, machine reliability, changeover logic, operator-centred workflows, packaging automation, equipment installation and commissioning, quality assurance, traceability and process learning from raw product to finished package.',
    transferable:
      'This experience taught me how operators interact with machines, how small mechanical or control issues affect throughput, and why usability, changeover design, line recovery and traceable QA matter in production systems.',
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
      'I worked in advanced carbon-fibre automotive wheel manufacturing and was hands-on through the automation programme that replaced the legacy rim layup machine with new KUKA-based robotic cells, while moving from layup operation towards quality assurance and development support.',
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
      'I operated the legacy automated rim layup machine on the carbon-fibre wheel line.',
      'I was hands-on through the automation programme that replaced the legacy rim layup machine with new KUKA-based robotic cells for automated layup and robotic demoulding of the hot, heavy wheel tooling.',
      'I supported trials, changeovers, quality checks and line recovery as the new KUKA robotic manufacturing line was commissioned and brought into production.',
      'I moved closer to quality assurance and development work around the automated rim layup process.',
      'I gained hands-on exposure to carbon-fibre manufacturing, industrial robotics, automated layup, production quality, defect awareness and the practical realities of scaling advanced composite manufacturing.',
      'I supported wider production areas including NDE and mechanical testing.',
    ],
    relevance:
      'Advanced manufacturing, carbon-fibre composites, industrial robotics, KUKA-based robotic cells, automated layup and robotic demoulding, cell commissioning support, quality assurance, NDE, mechanical testing, defect detection, production repeatability, process development and manufacturing scale-up.',
    transferable:
      'In this role, I strengthened my understanding of the links between industrial robotics, automation, materials, machine behaviour and product quality. Working hands-on as KUKA-based robotic cells replaced a legacy line showed me how process variation, fibre placement, inspection, testing and operator feedback influence high-performance manufacturing.',
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
      'I supported structural steel and pressure vessel QA in a standards-driven fabrication environment, operating as second to the QA manager.',
    domains: ['Quality and documentation', 'Mechanical and CAD', 'Standards-driven delivery'],
    toolsLabel: 'Representative context',
    tools: ['ITPs', 'MDRs', 'drawing review', 'pressure-vessel CAD', 'traceability'],
    achievements: [
      'I worked within the quality assurance team and operated as second to the QA manager across fabrication quality workflows.',
      'I supported quality areas for structural-steel and pressure-vessel work.',
      'I prepared, maintained and reviewed ITPs, MDRs, quality records and traceability documents.',
      'I reviewed engineering drawings and specifications for inspection planning and compliance.',
      'I helped coordinate inspection evidence, non-conformance follow-up and fabrication documentation.',
      'I supported NDE and mechanical testing evidence workflows as part of fabrication QA and inspection support.',
      'I signed off QA documentation within the scope given.',
      'I developed CAD designs for pressure vessels that progressed into fabrication.',
    ],
    relevance:
      'Structural steel fabrication, pressure-vessel QA, CAD, drawing review, ITPs, MDRs, material traceability, welding and fabrication documentation, NDE, mechanical testing, inspection planning, QA sign-off and standards-driven delivery.',
    transferable:
      'In this role, I built the documentation and quality discipline behind engineering delivery. I carried clear requirements, inspection evidence, traceability, sign-offs and defensible handover documentation into later regulated automation and commissioning work, alongside the mechanical, CAD and quality rigour needed for robot hardware, fixtures, machine frames and automation structures.',
    evidenceTiers: ['delivered', 'hands-on'],
    group: 'foundation',
    relatedProjects: ['manufacturing-qa-foundation'],
  },
] as const

export function getRole(slug: string): Role | undefined {
  return experience.find((r) => r.slug === slug)
}
