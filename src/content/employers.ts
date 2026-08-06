import type { EvidenceTier } from './tiers'

/**
 * Employer records: the single authored source of truth for employer
 * content.
 *
 * This file was additive when it was introduced, sitting beside an
 * `experience.ts` that carried its own authored copy of the same six
 * employers. Two authored copies of one career is a content defect on its
 * own, and it had a visible cost: every human path into the site landed on
 * the thinner copy, so the richer one was never read. `experience.ts` is now
 * a derived view over this file and authors nothing. Everything it used to
 * carry alone was migrated here, or dropped on the record with a reason.
 *
 * Binding rules for this file:
 *   - Every string below traces to one of exactly two places: the
 *     authoritative content brief of 30 July 2026, or the migrated text of
 *     the former `experience.ts`. Claims added from the resume carry an
 *     explicit `source`. Nothing is paraphrased into a stronger statement
 *     and no claim about Saj's work is inferred from anywhere else.
 *   - `companyFacts` are verified facts about the employer, not about Saj.
 *     Each carries the primary source domain it was verified against.
 *     "Company fact" is deliberately not an evidence tier: the five-tier
 *     model in `tiers.ts` grades Saj's own evidence and is not extended.
 *   - `todoConfirm` entries are unverified. They render as HTML source
 *     comments only and must never reach published prose.
 *   - A `suppressed` employer is withheld from publication and from every
 *     discovery surface, but its `/about/[slug]/` URL still resolves and
 *     still carries `noindex`. Suppression is not deletion.
 */

/**
 * Closed discipline vocabulary. Two axes, deliberately independent: `tier`
 * grades the evidence and is transcribed from the source brief, `discipline`
 * is the visible grouping. Assigning a discipline never changes a tier, and
 * a claim that spans two disciplines takes the one its text leads with and
 * is never duplicated.
 */
export const DISCIPLINES = [
  'Control and automation',
  'Instrumentation and measurement',
  'Embedded and electronics',
  'Networks and data',
  'Robotics and autonomy',
  'Manufacturing and process',
  'Quality, compliance and documentation',
  'Project and delivery',
] as const

export type Discipline = (typeof DISCIPLINES)[number]

export interface EmployerClaim {
  readonly discipline: Discipline
  readonly tier: EvidenceTier
  readonly body: string
  /**
   * Provenance, so a claim can be traced back to the document it came from
   * long after this run. Absent means the claim came from the original
   * content brief of 30 July 2026. `experience.ts` marks a claim migrated
   * from the former authored copy; `resume Rev09` marks one extracted from
   * `public/assets/Resume_Sajeevan_Veeriah.pdf`, which is the file committed
   * as 20260728-Sajeevan-Veeriah-Resume-Rev09.pdf and renamed in 579e7f7.
   */
  readonly source?: 'experience.ts' | 'resume Rev09'
}

export interface CompanyFact {
  /** Primary source domain the fact was verified against. */
  readonly source: string
  readonly body: string
}

export interface Employer {
  readonly slug: string
  readonly company: string
  /** null where the brief supplies no title. */
  readonly title: string | null
  /** null where the brief supplies no dates. */
  readonly period: string | null
  /**
   * State and country only. AGENTS.md forbids role locations, and the source
   * brief supplies suburb-level ones, so every value is reduced to
   * "Victoria, Australia". Suburbs that are verified facts about an
   * employer's own site stay in `companyFacts`, because those describe the
   * company rather than Saj. One edit here strips all six.
   */
  readonly location: string | null
  readonly companyFacts: readonly CompanyFact[]
  readonly claims: readonly EmployerClaim[]
  /** The page's argument. null where the brief supplies no closing line. */
  readonly closing: string | null
  readonly todoConfirm: readonly string[]

  /* ---- Migrated from the former authored `experience.ts` ----
     These are not claims and were never graded by a tier: they are the
     framing, the rail contents and the argument the role supports. They
     live here because this file is now the only place employer content is
     authored, and `experience.ts` derives its `Role` shape from them. */

  /** One-sentence framing, used as the page lede and the spine summary. */
  readonly summary: string
  /** Capability domains, rendered as chips in the detail rail. */
  readonly domains: readonly string[]
  /** Label above the tools line: "Representative tools" or context. */
  readonly toolsLabel: string
  readonly tools: readonly string[]
  /** What the role is relevant to, as one sentence of keywords. */
  readonly relevance: string
  /** What the role transferred into later work. */
  readonly transferable: string
  /** Which band of the career spine the role sits in. */
  readonly group: 'recent' | 'foundation'
  /** Work records covering the same employer. */
  readonly relatedProjects: readonly string[]

  /**
   * Withheld from publication and from every discovery surface: nav panels,
   * the career spine, the employers index and the sitemap. A suppressed
   * employer is excluded from `publishedEmployers`, so no
   * `/employers/[slug]/` route is emitted for it, and its `/about/[slug]/`
   * URL renders in full while carrying `noindex`. The record stays in the
   * career history and no history is rewritten.
   */
  readonly suppressed?: true
}

export const employers: readonly Employer[] = [
  {
    /*
     * Current independent practice. Saj confirmed on 6 August 2026 that all
     * four recent projects are completed, deployed and used by their end-users.
     * The records in `projects.ts` carry the full evidence and public scope
     * boundaries. No location is published and no date range uses "Present".
     */
    slug: 'independent-engineering-practice',
    company: 'Independent Engineering Practice',
    title: 'Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer',
    period: 'Jun 2026 onward',
    location: null,
    companyFacts: [],
    claims: [
      {
        discipline: 'Robotics and autonomy',
        tier: 'delivered',
        body: 'I completed and deployed Upzy, a supervised, privacy-conscious educational routine companion browser application now used by end-users for adult-defined routines, simple child-facing prompts and adult review while keeping button interactions separate from proof that an activity occurred.',
      },
      {
        discipline: 'Networks and data',
        tier: 'delivered',
        body: 'I designed, implemented and deployed a controlled browser and Windows desktop workflow now used by Stan Wootton Locksmiths to compare supplier and ServiceM8 exports, apply a confirmed 30% markup on cost, route exceptions and proposals through operator review, and produce reviewable import, change, exception, rollback and audit outputs.',
      },
      {
        discipline: 'Robotics and autonomy',
        tier: 'delivered',
        body: 'I designed, built and deployed an operator-support mobile robot now used by end-users to assist physical inventory scanning and connect captured stock observations to a controlled review workflow.',
      },
      {
        discipline: 'Robotics and autonomy',
        tier: 'delivered',
        body: 'I designed, built and deployed a modular robot platform now used by end-users for education, engineering experiments and repeatable subsystem testing, with clear interfaces and observable behaviour supporting supervised operation.',
      },
    ],
    summary:
      'I design, build and deploy independent and client-facing engineering systems across robotics, mechatronics, AI/ML, software and end-to-end automation, taking work from problem definition and architecture through implementation, validation, deployment and practical handover.',
    domains: ['Robotics and autonomy', 'Product R&D', 'Engineering software', 'Inventory systems'],
    toolsLabel: 'Representative tools from completed and deployed work',
    tools: ['React', 'TypeScript', 'Vite', 'Tauri 2', 'Node.js', 'Vitest', 'Playwright'],
    relevance:
      'Completed and deployed independent and client engineering across robotics, product development, engineering software, data integrity and validation.',
    transferable:
      'This work demonstrates direct ownership of multidisciplinary systems from operating problem and architecture through implementation, validation, deployment and end-user handover.',
    group: 'recent',
    relatedProjects: [
      'upzy-supervised-routine-companion',
      'swl-pricing-inventory-control',
      'inventory-scanning-mobile-robot',
      'modular-education-testing-robot',
    ],
    closing:
      'These completed projects show end-to-end delivery through validation, deployment, handover and active end-user use while keeping public implementation and performance boundaries explicit.',
    todoConfirm: [],
  },
  {
    slug: 'jag-process-solutions',
    company: 'JAG Process Solutions Pty Ltd',
    title: 'Automation & Controls Engineer',
    period: 'Jan 2026 to Jun 2026',
    location: 'Victoria, Australia',
    companyFacts: [
      {
        source: 'jag-ps.com.au/en-au/company',
        body: 'JAG Process Solutions is the Australian arm of the JAG Group, a Swiss process technology house founded in Biel that grew from an electrical installation firm into a systems integrator covering basic and detail engineering, plant construction, control panel manufacture, industrial field wiring, process control systems and MES, building turnkey plants for the pharmaceutical, biotech and food industries.',
      },
      {
        source: 'jag-ps.com.au/en-au/automation',
        body: "JAG's automation scope runs from the ERP interface to field level and is positioned as smart-factory compatible.",
      },
    ],
    claims: [
      {
        discipline: 'Control and automation',
        tier: 'delivered',
        body: 'I executed an iFIX to PVI+ migration on a validated system, verifying functional behaviour against the pre-existing qualified baseline rather than against a specification alone.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'delivered',
        body: 'I produced FAT, SAT, commissioning, qualification and handover documentation packages.',
      },
      {
        discipline: 'Control and automation',
        tier: 'hands-on',
        body: 'I built and modified control logic and process visualisation for pharmaceutical, biotech and food manufacturing lines operating under GMP.',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'hands-on',
        body: 'I worked across field devices, instruments and drives, including the wiring and signal path between an instrument and the controller, not only the tag in software.',
      },
      {
        discipline: 'Robotics and autonomy',
        tier: 'hands-on',
        body: 'I supported MiR autonomous mobile robot operations and material-flow workflows in a smart-factory environment, diagnosing faults across the robot, the control system, the network and the production interface.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I ran verification against a validated system under GMP change control, where the burden is proving that behaviour did not change, a harder test than proving a new feature works.',
      },
      {
        discipline: 'Control and automation',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of batch control and recipe-driven production, including how a batch layer sits above equipment modules.',
      },
      {
        discipline: 'Embedded and electronics',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of control-panel construction and industrial field-wiring practice.',
      },
      {
        discipline: 'Robotics and autonomy',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of fleet-level traffic management and AMR mission dispatch against production demand.',
      },
      {
        discipline: 'Networks and data',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of industrial networking between control, robot and production layers, including interface failure modes.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of the GMP computerised-system validation lifecycle and requirement-to-test traceability.',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'adjacent',
        body: "I worked on systems for JAG's pharmaceutical, biotechnology and food-manufacturing clients.",
      },
      {
        discipline: 'Control and automation',
        tier: 'delivered',
        body: 'I delivered end-to-end automation and systems integration for pharmaceutical, biotech and food manufacturing under GMP.',
        source: 'resume Rev09',
      },
      {
        discipline: 'Control and automation',
        tier: 'hands-on',
        body: 'I worked across control logic, HMI, SCADA, MES and batch execution.',
        source: 'experience.ts',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'hands-on',
        body: 'I integrated field devices, sensors, drives and process equipment with control logic and production data flows.',
        source: 'experience.ts',
      },
      {
        discipline: 'Project and delivery',
        tier: 'hands-on',
        body: 'I resolved faults raised during testing and site support with attention to diagnostics, safety, usability and data integrity.',
        source: 'experience.ts',
      },
    ],
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
    relevance:
      'Industrial automation, process control, HMI and SCADA, MES, batch systems, GMP, GAMP 5, commissioning, validation, field-device integration, production data and regulated documentation.',
    transferable:
      'In this role, I connected controls, software, process systems, operator workflows and compliance. I worked across both the machine layer and the validation layer, building capability relevant to automation, robotics, smart factory, digital twin and regulated engineering environments.',
    group: 'recent',
    relatedProjects: ['jag-smart-factory'],
    closing:
      'I learned to treat a regulated plant as one connected system: recipes and supervisory software, field devices, material movement, and the qualification evidence that proves the system behaves as intended.',
    todoConfirm: [
      'PVI+ migration scope, a screen or object count.',
      'Did Saj personally do loop checking or point-to-point testing.',
      'MiR unit count, and whether Saj did map or mission configuration or only fault diagnosis.',
      'Which fieldbus or industrial ethernet protocols Saj personally configured or traced.',
      // Redacted deliberately. The source brief names the client here, but
      // `todoConfirm` ships into the built HTML as a source comment, so
      // carrying the name would publish exactly what this item forbids.
      // The instruction is preserved; only the name is withheld.
      'Whether any client may be named publicly. Default is to name none. The one client named in the source brief must not be named: it was a JAG client, never an employer.',
    ],
  },
  {
    /*
     * Suppressed per Rev01 and unchanged by this run. The record moved here
     * only because this file is now the single authored source; suppressing
     * it in one place is what keeps it out of `publishedEmployers`, out of
     * the employers index, out of the nav panel, out of the career spine and
     * out of the sitemap. No `/employers/ford-via-invenio/` route is emitted.
     * `/about/ford-via-invenio/` still resolves at its original URL and still
     * carries `noindex`, exactly as before. Suppression is not deletion and
     * no history is rewritten.
     */
    slug: 'ford-via-invenio',
    company: 'Ford Motor Company via Invenio contract placement',
    title: 'Product Development Test Engineer (Contract)',
    period: 'Oct 2025 to Jan 2026',
    location: 'Victoria, Australia',
    companyFacts: [],
    claims: [
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'delivered',
        body: 'Validated vehicle software integration and ADAS features across T6 Ranger and Everest programmes.',
        source: 'experience.ts',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'delivered',
        body: 'Ran feature-vehicle, breadboard and regression testing for readiness milestones and OTA updates.',
        source: 'experience.ts',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'hands-on',
        body: 'Instrumented test vehicles and conducted structured test drives in controlled and real-world conditions.',
        source: 'experience.ts',
      },
      {
        discipline: 'Networks and data',
        tier: 'hands-on',
        body: 'Captured and analysed CAN bus data using Vector CANoe and CANalyzer.',
        source: 'experience.ts',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'Supported evidence-based defect reporting, fault isolation and verification.',
        source: 'experience.ts',
      },
    ],
    summary:
      'I validated vehicle software integration and ADAS features across the T6 Ranger and Everest programmes, using CAN-level evidence for readiness milestones and OTA sign-off.',
    domains: ['Automotive and validation', 'Embedded networks', 'Test engineering'],
    toolsLabel: 'Representative tools',
    tools: ['Vector CANoe', 'CANalyzer', 'CAN and CAN FD', 'vehicle instrumentation'],
    relevance:
      'Automotive validation, ADAS, vehicle networks, CAN, CAN FD, test procedures, regression testing, OTA validation, instrumentation, diagnostics and evidence-based engineering.',
    transferable:
      'In this role, I connected embedded systems, vehicle behaviour, test engineering and fault evidence. I strengthened my ability to validate cyber-physical systems where software, sensors, networks, control logic and real-world operation interact. I apply the same closed-loop discipline to robotics and automation: sense, estimate, control, actuate and verify against real behaviour.',
    group: 'recent',
    relatedProjects: ['adas-can-validation'],
    closing: null,
    todoConfirm: [],
  },
  {
    slug: 'abmarc',
    company: 'ABMARC',
    title: 'Technical Assistant',
    period: 'Jul 2024 to Aug 2025',
    location: 'Victoria, Australia',
    companyFacts: [
      {
        source: 'abmarc.com.au/about',
        body: 'ABMARC is an independent Australian transport engineering consultancy established in March 2011, providing testing, research and evaluation across automotive, on and off road engines, transport, fuels, emissions, aviation, rail, marine, energy and mining, plus policy and regulatory analysis, transport modelling and economic analysis, technology and fuel neutral, emphasising evidence-based solutions.',
      },
      {
        source: 'abmarc.com.au/vehicle-emissions-testing',
        body: "ABMARC operates Australia's first Portable Emissions Measurement System, an AVL PEMS compliant with US EPA 1065 2007 and EC 595 2009 Regulation 49, achieving laboratory-quality accuracy and repeatability from 0.5 per cent in the field.",
      },
      {
        source: 'abmarc.com.au/engineering-service and /testing-service',
        body: 'ABMARC is a registered agent with the Department of Infrastructure for the Road Vehicle Certification System, providing testing and certification against Australian Design Rules, and has been selected by ANCAP as a provider of ADAS testing in Australia. It accesses light and heavy vehicle chassis dynamometers through collaboration with the Kangan Institute.',
      },
      {
        source: 'realworld.org.au/fleets-business',
        body: 'ABMARC was contracted by the Australian Automobile Association to deliver the Real-World Testing Program, running instrumented vehicles over a 93 kilometre urban, rural and motorway course in and around Geelong.',
      },
    ],
    claims: [
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'delivered',
        body: 'I prepared QA, regulatory and test documentation for certification and audit, holding traceable configurations, results and findings.',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'hands-on',
        body: 'I prepared and instrumented vehicles for emissions and range testing, including fitting measurement equipment, verifying calibration state and setting up the test environment before a run.',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'hands-on',
        body: 'I conducted real-time data acquisition during test runs and analysed results against ADR and EURO requirements.',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'hands-on',
        body: 'I performed maintenance and fault finding on emissions test equipment to hold accuracy and reliability between programs.',
      },
      {
        discipline: 'Networks and data',
        tier: 'hands-on',
        body: 'I used CAN tools to capture and interpret vehicle bus data during testing, correlating bus signals against measured emissions and energy consumption.',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'hands-on',
        body: 'I tested EV and PHEV range and vehicle systems, a different measurement problem from tailpipe emissions requiring energy accounting rather than gas analysis.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I analysed deviations and supported evidence-based fault isolation, separating instrument fault from vehicle behaviour from test procedure error.',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of portable emissions measurement and the controls needed to preserve laboratory-grade discipline in field testing.',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of internal-combustion, hybrid and battery-electric powertrain behaviour as it appears in test data.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'working-knowledge',
        body: 'I applied repeatability criteria when deciding whether inconsistent results required another test run.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of the Australian Design Rules and Road Vehicle Certification System as the framework for test evidence.',
      },
      {
        discipline: 'Instrumentation and measurement',
        tier: 'adjacent',
        body: 'I worked adjacent to ABMARC service lines covering ADAS, driver-assist, noise and VASS engineering.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I followed repeatable procedures for auditable and technically defensible test results.',
        source: 'experience.ts',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I reviewed test data to identify deviations, trends and evidence gaps.',
        source: 'experience.ts',
      },
    ],
    summary:
      'I conducted vehicle emissions and compliance testing against ADR and EURO standards, producing repeatable, auditable and technically defensible results.',
    domains: ['Automotive and compliance', 'Instrumentation and DAQ', 'Quality and reporting'],
    toolsLabel: 'Representative tools',
    tools: ['Emissions instrumentation', 'data-acquisition systems', 'QA records'],
    relevance:
      'Emissions testing, vehicle compliance, instrumentation, data acquisition, test repeatability, QA records, regulatory documentation, standards exposure and technical reporting.',
    transferable:
      'In this role, I strengthened my test discipline, evidence handling and systems-level thinking. I apply those habits wherever measurement quality, repeatability, documentation and fault interpretation matter, including robotics and automation commissioning.',
    group: 'recent',
    relatedProjects: ['emissions-compliance-testing'],
    closing:
      'I learned to question every measurement: calibration state, procedure, repeatability and the difference between instrument behaviour and the system under test.',
    todoConfirm: [
      'Did Saj work on the AVL PEMS specifically.',
      'Did Saj work on the AAA Real-World Testing Program.',
      'Any involvement in ADAS target testing, noise testing or modelling.',
    ],
  },
  {
    slug: 'duxtel',
    company: 'DuxTel Pty Ltd',
    title: 'Consultant Engineer, IoT and Projects Administrator',
    period: 'Feb 2024 to Aug 2024',
    location: 'Victoria, Australia',
    companyFacts: [
      {
        source: 'duxtel.com.au/hardware_overview and store.duxtel.com',
        body: 'DuxTel is the wholesale distributor for MikroTik, Mimosa and RF Elements in Australia and the Pacific region, an authorised MikroTik distributor and certified MikroTik Consultant, supplying ISPs and WISPs, hospitality, education, government, community wireless, and point to point and point to multipoint links.',
      },
      {
        source: 'store.duxtel.com and mikrotik.com/products/group/iot-products',
        body: "DuxTel's range includes IoT devices, and the MikroTik IoT line covers configurable LoRaWAN sensor tags including the 902 to 928 MHz variant for the Australian band, plus CAT-M and LTE gateways for connecting ethernet devices and industrial automation equipment.",
      },
    ],
    claims: [
      {
        discipline: 'Embedded and electronics',
        tier: 'delivered',
        body: 'I designed and deployed end-to-end IoT systems linking sensors, embedded devices, gateways, Linux services, data pipelines and dashboards. End to end means the literal chain: a sensor reading, an ESP32 firmware loop, a LoRaWAN uplink on AU915, a ChirpStack network server, an MQTT broker, a Linux service, an InfluxDB time series and a Grafana panel. Seven layers, one engineer.',
      },
      {
        discipline: 'Project and delivery',
        tier: 'delivered',
        body: 'I ran field trials on agricultural equipment and supported provisioning, fault finding and handover to the operator.',
      },
      { discipline: 'Embedded and electronics', tier: 'hands-on', body: 'I developed ESP32 firmware for sensing and telemetry.' },
      { discipline: 'Networks and data', tier: 'hands-on', body: 'I planned LoRaWAN AU915 radio links and provisioned devices.' },
      { discipline: 'Networks and data', tier: 'hands-on', body: 'I configured ChirpStack and designed MQTT topic structures.' },
      {
        discipline: 'Networks and data',
        tier: 'hands-on',
        body: 'I deployed Linux services, designed InfluxDB schemas and retention, and built Grafana dashboards.',
      },
      {
        discipline: 'Embedded and electronics',
        tier: 'hands-on',
        body: 'I designed a custom PCB for the agricultural monitoring application, integrating CAN trace capture, GPS and environmental sensing on one board.',
      },
      {
        discipline: 'Embedded and electronics',
        tier: 'hands-on',
        body: 'I made enclosure, mounting and field-hardening decisions for equipment operating outdoors on moving machinery.',
      },
      {
        discipline: 'Networks and data',
        tier: 'hands-on',
        body: 'I configured MikroTik networking for the field deployment.',
      },
      {
        discipline: 'Networks and data',
        tier: 'hands-on',
        body: 'I diagnosed failures in a deployed system where the fault could be firmware, radio, network server, broker, database or dashboard, with no way to know in advance which.',
      },
      {
        discipline: 'Project and delivery',
        tier: 'hands-on',
        body: 'I administered the project alongside the engineering: scope, supplier coordination, documentation and delivery tracking.',
      },
      {
        discipline: 'Networks and data',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of point-to-point and point-to-multipoint wireless design, including RF trade-offs between LoRaWAN, Wi-Fi and cellular links.',
      },
      {
        discipline: 'Networks and data',
        tier: 'hands-on',
        body: 'I integrated multiple data capture and transfer paths into a Linux-based server for remote status collection.',
        source: 'experience.ts',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I supported documentation and post-deployment handover.',
        source: 'experience.ts',
      },
    ],
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
    relevance:
      'Embedded systems, IoT telemetry, custom PCB design, CAN trace capture, GPS or GNSS location, sensor interfacing, MikroTik connectivity, Linux servers, deployment and field validation.',
    transferable:
      'In this role, I bridged embedded devices, communications, cloud data and operational visibility. I worked from sensor-level hardware through network configuration to data pipelines and user-facing dashboards, using the same sensor-to-cloud backbone that robotics and automation rely on for monitoring, diagnostics and control.',
    group: 'recent',
    relatedProjects: ['iot-monitoring-platform'],
    closing:
      'I worked across the telemetry path from custom electronics and firmware to networking, Linux services, stored data and the dashboard used in the field.',
    todoConfirm: [
      'Device count provisioned, and physical area or link range.',
      'EDA tool for the agricultural PCB, KiCad or Altium, and revision count.',
      "Did Saj configure RouterOS directly, and did he use DuxTel's own configuration template library.",
      'What the projects administrator half of the title involved. Quoting, purchasing, client communication, scheduling.',
    ],
  },
  {
    slug: 'thornton-engineering',
    company: 'Thornton Engineering Australia',
    title: 'Quality Assurance and Engineering Support',
    // The brief supplies no dates for this role and none are reconstructed.
    period: null,
    location: 'Victoria, Australia',
    companyFacts: [
      {
        source:
          'thorntoneng.com.au/about and /capabilities, Geelong Manufacturing Council, Australian Steel Institute directory',
        body: 'Thornton Engineering is a family-owned Australian steel fabricator founded in 1975 in Penshurst, western Victoria, which established its head office and fabrication facility on a 100,000 square metre site in Geelong in 1999. It designs and fabricates structural steel, pressure vessels, heat exchangers, plate products, and pipe and pilings, and provides stress-relieving heat treatment, operating five workshops including a dedicated Vessel Shop, two Beamlines and a Plate Shop.',
      },
      {
        source: "Manufacturers' Monthly, December 2023",
        body: "Thornton's two Beamlines are designed to turn CAD drawings into fully fabricated structural steel within 48 hours.",
      },
    ],
    claims: [
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'delivered',
        body: 'I prepared and worked from Inspection and Test Plans.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'delivered',
        body: 'I assembled Manufacturing Data Reports and traceable evidence packages for fabricated items.',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'hands-on',
        body: 'I reviewed structural-steel detail drawings against fabrication requirements and shop capability.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I maintained material traceability by linking heat numbers and material certificates to finished members.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of AS/NZS structural-steel compliance records and audit expectations.',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of welding as a controlled process, including procedure and welder qualification. I did not perform welding-engineering work.',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'adjacent',
        body: 'I worked adjacent to pressure-vessel and heat-exchanger fabrication, stress relieving and heat treatment.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'delivered',
        body: 'I signed off QA documentation within the scope given.',
        source: 'experience.ts',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'delivered',
        body: 'I developed CAD designs for pressure vessels that progressed into fabrication.',
        source: 'experience.ts',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I worked within the quality assurance team and operated as second to the QA manager across fabrication quality workflows.',
        source: 'experience.ts',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I supported quality areas for structural-steel and pressure-vessel work.',
        source: 'experience.ts',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I helped coordinate inspection evidence, non-conformance follow-up and fabrication documentation.',
        source: 'experience.ts',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I supported NDE and mechanical testing evidence workflows as part of fabrication QA and inspection support.',
        source: 'experience.ts',
      },
    ],
    summary:
      'I worked across quality assurance, engineering support, pressure-vessel CAD, drawing review, traceability and fabrication documentation in a standards-driven structural-steel and pressure-vessel environment, operating as second to the QA manager.',
    domains: ['Quality and documentation', 'Mechanical and CAD', 'Standards-driven delivery'],
    toolsLabel: 'Representative context',
    tools: ['ITPs', 'MDRs', 'drawing review', 'pressure-vessel CAD', 'traceability'],
    relevance:
      'Structural steel fabrication, pressure-vessel QA, CAD, drawing review, ITPs, MDRs, material traceability, welding and fabrication documentation, NDE, mechanical testing, inspection planning, QA sign-off and standards-driven delivery.',
    transferable:
      'In this role, I built the documentation and quality discipline behind engineering delivery. I carried clear requirements, inspection evidence, traceability, sign-offs and defensible handover documentation into later regulated automation and commissioning work, alongside the mechanical, CAD and quality rigour needed for robot hardware, fixtures, machine frames and automation structures.',
    group: 'foundation',
    relatedProjects: ['manufacturing-qa-foundation'],
    closing:
      'I learned that traceability is part of the delivered product: fabrication evidence must show what was built, from which material and against which requirements.',
    todoConfirm: [
      'Exact dates and exact job title.',
      'Any named project, such as a bridge or station package.',
      'TODO CONFIRM: the title. The retired experience.ts read "Quality Assurance / Undergraduate Engineering Support", this file reads "Engineering and QA support". The word "Undergraduate" is carried nowhere else and is recorded here so retiring that file does not lose it. Resume Rev09 gives this role no separate title.',
      'TODO CONFIRM: the legal name. The retired experience.ts read "Thornton Engineering Australia Pty Ltd", this file reads "Thornton Engineering Australia".',
      'TODO CONFIRM: ownership of the QA sign-off claim. "Signed off QA documentation within the scope given" is carried at Delivered because the wording states a personal act, but the scope it was given is unrecorded.',
    ],
  },
  {
    slug: 'carbon-revolution',
    company: 'Carbon Revolution',
    title: 'Production and Quality Assurance',
    // The brief supplies no dates for this role and none are reconstructed.
    period: null,
    location: 'Victoria, Australia',
    companyFacts: [
      {
        source: 'carbonrev.com/company',
        body: 'Carbon Revolution is a Geelong-founded global technology company and Tier 1 OEM supplier that innovated, commercialised and industrialised single-piece carbon fibre automotive wheels, founded in 2007 out of a Formula SAE background, with over 100,000 wheels sold and 18 awarded programs across six global OEMs.',
      },
      {
        source: 'carbonrev.com/faqs and /company',
        body: 'The wheels are manufactured as one continuous carbon fibre structure, face, spokes and barrel, not bonded, glued or bolted, using proprietary process IP in an ISO quality certified facility that has also achieved Ford Q1 supplier certification. Resin is injected at approximately 50 times atmospheric pressure, and the company performs over 160 in-process measurements and inspections.',
      },
      {
        source: 'carbonrev.com/technology/manufacturing',
        body: 'At the heart of the plant is an Industry 4.0 quality tracking system that collects data for every wheel at every point of the process, with artificial intelligence and automation conducting many of the checks so the operation can scale without losing quality.',
      },
    ],
    claims: [
      {
        discipline: 'Manufacturing and process',
        tier: 'hands-on',
        body: 'I operated and monitored carbon fibre production equipment through the process steps, working to the tolerances a Tier 1 automotive part demands.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I performed quality-control checks within the in-process measurement regime.',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'hands-on',
        body: 'I performed first-level troubleshooting when equipment or process behaviour drifted, including stopping the process when required.',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of composite manufacturing as a controlled process, including cure, pressure and layup discipline.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of Industry 4.0 traceability by working within a system that recorded data for each unit and process stage.',
      },
      {
        discipline: 'Robotics and autonomy',
        tier: 'adjacent',
        body: 'I worked adjacent to automation, robotics and AI-assisted inspection within the plant.',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'hands-on',
        body: 'I operated the legacy automated rim layup machine on the carbon-fibre wheel line.',
        source: 'experience.ts',
      },
      {
        // The KUKA cell programme. Rev01 identified this as material only the
        // former experience.ts carried, and it is the single largest piece of
        // robotics evidence in the foundation years. Held at Hands-on, the
        // tier the retired file already carried for the whole role: the
        // wording says Saj was present and supporting through the programme,
        // not that he owned the cell build.
        discipline: 'Robotics and autonomy',
        tier: 'hands-on',
        body: 'I was hands-on through the automation programme that replaced the legacy rim layup machine with new KUKA-based robotic cells for automated layup and robotic demoulding of the hot, heavy wheel tooling.',
        source: 'experience.ts',
      },
      {
        discipline: 'Robotics and autonomy',
        tier: 'hands-on',
        body: 'I supported trials, changeovers, quality checks and line recovery as the new KUKA robotic manufacturing line was commissioned and brought into production.',
        source: 'experience.ts',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I supported wider production areas including NDE and mechanical testing.',
        source: 'experience.ts',
      },
      {
        // "Moved closer to" states proximity, not ownership, so this sits a
        // tier below the supporting claims above it rather than beside them.
        discipline: 'Quality, compliance and documentation',
        tier: 'hands-on',
        body: 'I supported quality assurance and development work around automated rim layup, including first-off checks, in-process inspection, defect review, traceability and production trials.',
        source: 'experience.ts',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'working-knowledge',
        body: 'I gained hands-on exposure to carbon-fibre manufacturing, industrial robotics, automated layup, production quality, defect awareness and the practical realities of scaling advanced composite manufacturing.',
        source: 'experience.ts',
      },
    ],
    summary:
      'I worked across production, quality assurance and development support in advanced carbon-fibre automotive wheel manufacturing, and I was hands-on through the programme that replaced the legacy rim layup machine with new KUKA-based robotic cells.',
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
    relevance:
      'Advanced manufacturing, carbon-fibre composites, industrial robotics, KUKA-based robotic cells, automated layup and robotic demoulding, cell commissioning support, quality assurance, NDE, mechanical testing, defect detection, production repeatability, process development and manufacturing scale-up.',
    transferable:
      'In this role, I strengthened my understanding of the links between industrial robotics, automation, materials, machine behaviour and product quality. Working hands-on as KUKA-based robotic cells replaced a legacy line showed me how process variation, fibre placement, inspection, testing and operator feedback influence high-performance manufacturing.',
    group: 'foundation',
    relatedProjects: ['carbon-revolution-rim-layup', 'manufacturing-qa-foundation'],
    closing:
      'I saw how robotics, process control, inspection and digital traceability work together when an advanced manufacturing line changes at production scale.',
    todoConfirm: [
      'Exact dates and exact title. Public records list Production Line Operator.',
      'Which process stage. Moulding, demoulding, machining, finishing or inspection.',
      'TODO CONFIRM: the title. The retired experience.ts read "Automated Rim Layup Operator to Robotic Automation, Quality and Development Support". That is a progression title from the previous site with no verified source, so this file keeps the neutral "Production and quality role" and records the variant here rather than publishing it. Resume Rev09 gives this role no separate title.',
      'TODO CONFIRM: ownership on the KUKA cell programme. The claim is held at Hands-on. Saj must confirm whether he supported the programme or owned any part of the cell build, commissioning or programming, because the tier moves if he did.',
    ],
  },
  {
    slug: 'idl',
    company: 'IDL',
    title: 'Beverage production role',
    // The brief supplies no dates for this role and none are reconstructed.
    period: null,
    location: 'Victoria, Australia',
    companyFacts: [],
    claims: [
      {
        discipline: 'Manufacturing and process',
        tier: 'hands-on',
        body: 'I operated and monitored beverage production equipment while maintaining safety, quality, traceability and first-level troubleshooting discipline.',
      },
      {
        discipline: 'Quality, compliance and documentation',
        tier: 'working-knowledge',
        body: 'I developed working knowledge of production hygiene, batch traceability and quality controls for food and beverage manufacturing.',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'hands-on',
        body: 'I supported five production lines: two canning lines, two bottling lines and one kegging line.',
        source: 'experience.ts',
      },
      {
        discipline: 'Manufacturing and process',
        tier: 'hands-on',
        body: 'I supported daily production execution, changeovers, run completion, KPI tracking, quality checks and first-response machine fixes.',
        source: 'experience.ts',
      },
      {
        discipline: 'Project and delivery',
        tier: 'hands-on',
        body: 'I took part in the installation and commissioning of WestRock and Fibre King packaging equipment during the canning line upgrade.',
        source: 'experience.ts',
      },
    ],
    summary:
      'I operated and monitored beverage production equipment while maintaining safety, quality, traceability and first-level troubleshooting discipline.',
    domains: ['Manufacturing and quality', 'Machine operations', 'Installation and commissioning'],
    toolsLabel: 'Representative context',
    tools: [
      'Canning, bottling and kegging lines',
      'WestRock and Fibre King line upgrade',
      'changeovers',
      'KPI tracking',
      'QA checks',
    ],
    relevance:
      'High-throughput production systems, machine reliability, changeover logic, operator-centred workflows, packaging automation, equipment installation and commissioning, quality assurance and traceability.',
    transferable:
      'This experience taught me how operators interact with machines, how small mechanical or control issues affect throughput, and why usability, changeover design, line recovery and traceable QA matter in production systems.',
    group: 'foundation',
    relatedProjects: ['idl-canning-line', 'manufacturing-qa-foundation'],
    closing: null,
    todoConfirm: [
      // Redacted deliberately, and for the same reason Rev02 redacted the JAG
      // client name: `todoConfirm` ships into the built HTML as a source
      // comment, so naming the unverified descriptors here would publish the
      // exact strings this entry exists to keep unpublished. The instruction
      // is preserved in full; only the two descriptors are withheld.
      'BLOCKING: full legal entity name, title and dates. Third-party aggregator records associate this employer with a trade descriptor and a job title that are withheld here and published nowhere, because aggregators are unreliable and none of it is verified. Resume Rev09 names IDL only inside a grouped foundation block, gives it no separate title and no separate dates. Saj must supply the entity name, the title and the dates.',
      // Also redacted, and the redaction is the whole point: naming the
      // removed strings here would republish them, because this list ships
      // into the built HTML as a source comment. The first draft of this note
      // did exactly that and put all three back on the page it had just
      // cleaned. The removals are described by shape, never quoted. Saj has
      // the originals in the branch diff and in the git history.
      'TODO CONFIRM: four items were removed from the published pages this run. One progression job title with three stages, published as the role line on two pages; the sentence asserting that progression; the sentence asserting a move into an upstream production area, which named four product types; and one clause repeating the same progression inside a work record. Every one of them carried either an unverified job title or an unverified trade descriptor, both traced to third-party aggregators. They are gone from /about/idl/, /employers/idl/, /work/idl-canning-line/ and /work/manufacturing-qa-foundation/. Saj must supply the real title and the real scope before any of it returns.',
      'TODO CONFIRM: whether IDL should be published at all. The former experience.ts published /about/idl/ with the unverified title, while this file held IDL back as a draft. Both could not be right. It is published here, stripped to what is verifiable, because the /about/idl/ URL already resolved and removing a live URL is a bigger breach than publishing a reduced page.',
      'TODO CONFIRM: the five-line count, the two canning, two bottling and one kegging breakdown, and the WestRock and Fibre King equipment names. These come from the previous site rather than an aggregator, so they were kept, but nothing independently verifies them.',
    ],
  },
] as const

/**
 * Everything cleared for publication. A suppressed employer is excluded
 * outright, so no `/employers/[slug]/` route is emitted for it and no
 * discovery surface can list it by accident.
 */
export const publishedEmployers: readonly Employer[] = employers.filter((e) => !e.suppressed)

/** Published employers only. Never resolves a suppressed record. */
export function getEmployer(slug: string): Employer | undefined {
  return publishedEmployers.find((e) => e.slug === slug)
}

/**
 * Every authored record, suppressed ones included. Only the `/about/[slug]/`
 * route uses this, because that URL resolved before this run for all seven
 * records and must keep resolving for all seven.
 */
export function getEmployerRecord(slug: string): Employer | undefined {
  return employers.find((e) => e.slug === slug)
}

/**
 * Section 6's argument, stated once. Transcribed verbatim, including the
 * ordering, which runs oldest to most recent so the pattern accumulates.
 */
export const versatility = {
  heading: 'Different roles, one engineering method.',
  body: 'My roles varied, but the work repeatedly crossed mechanical, electrical, software, data, quality and delivery boundaries.',
  columns: ['Employer', 'Title implied', 'Work actually crossed'] as const,
  rows: [
    [
      'Carbon Revolution',
      'Production operator',
      'Composite process control, in-process measurement, digital traceability',
    ],
    ['IDL', 'Beverage production', 'Batch quality, hygiene regime, plant troubleshooting'],
    [
      'Thornton Engineering',
      'Engineering and QA support',
      'Drawing review, ITPs, MDRs, material traceability, AS/NZS compliance',
    ],
    [
      'DuxTel',
      'IoT consultant and project administrator',
      'PCB design, embedded firmware, LoRaWAN, networking, Linux, time series, dashboards, field trials, project administration',
    ],
    [
      'ABMARC',
      'Technical assistant',
      'Instrumentation, calibration, CAN, data acquisition, deviation analysis, certification evidence',
    ],
    [
      'JAG Process Solutions',
      'Automation & Controls Engineer',
      'Control logic, HMI, field devices, drives, AMR fleet operations, industrial networking, GMP qualification',
    ],
  ] as const,
  closing:
    'My consistent method is to instrument the system, establish trustworthy evidence, isolate interface failures and document the result so another engineer can verify it. I apply that method across manufacturing, instrumentation, regulated automation, embedded systems and robotics.',
} as const
