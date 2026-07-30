import type { EvidenceTier } from './tiers'

/**
 * Employer records, transcribed verbatim from the authoritative content
 * brief of 30 July 2026. This layer is additive: `experience.ts` and the
 * `/about/[role]` routes it feeds are untouched, because those carry
 * material this brief does not supply and removing it would be a content
 * deletion, not a content build.
 *
 * Binding rules for this file:
 *   - Every string below is transcribed, never paraphrased or extended. No
 *     claim about Saj's work is inferred from any other source.
 *   - `companyFacts` are verified facts about the employer, not about Saj.
 *     Each carries the primary source domain it was verified against.
 *     "Company fact" is deliberately not an evidence tier: the five-tier
 *     model in `tiers.ts` grades Saj's own evidence and is not extended.
 *   - `todoConfirm` entries are unverified. They render as HTML source
 *     comments only and must never reach published prose.
 *   - An employer with `draft: true` is not routed and not published.
 */

export interface EmployerClaim {
  readonly tier: EvidenceTier
  readonly body: string
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
  /** null where the brief supplies no location. */
  readonly location: string | null
  readonly companyFacts: readonly CompanyFact[]
  readonly claims: readonly EmployerClaim[]
  /** The page's argument. null where the brief supplies no closing line. */
  readonly closing: string | null
  readonly todoConfirm: readonly string[]
  /**
   * Withheld from publication pending a blocking confirmation. A draft
   * employer is excluded from `publishedEmployers` and from
   * `generateStaticParams`, so no route is emitted for it at all.
   */
  readonly draft?: true
}

export const employers: readonly Employer[] = [
  {
    slug: 'jag-process-solutions',
    company: 'JAG Process Solutions Pty Ltd',
    title: 'Automation and Controls Engineer',
    period: 'Jan 2026 to Jun 2026',
    location: 'Brunswick, Victoria',
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
        tier: 'delivered',
        body: 'Executed an iFIX to PVI+ migration on a validated system, verifying functional behaviour against the pre-existing qualified baseline rather than against a specification alone.',
      },
      {
        tier: 'delivered',
        body: 'Produced FAT, SAT, commissioning, qualification and handover documentation packages.',
      },
      {
        tier: 'hands-on',
        body: 'Built and modified control logic and process visualisation for pharmaceutical, biotech and food manufacturing lines operating under GMP.',
      },
      {
        tier: 'hands-on',
        body: 'Worked across field devices, instruments and drives, including the wiring and signal path between an instrument and the controller, not only the tag in software.',
      },
      {
        tier: 'hands-on',
        body: 'Supported MiR autonomous mobile robot operations and material-flow workflows in a smart-factory environment, diagnosing faults across the robot, the control system, the network and the production interface.',
      },
      {
        tier: 'hands-on',
        body: 'Ran verification against a validated system under GMP change control, where the burden is proving that behaviour did not change, a harder test than proving a new feature works.',
      },
      {
        tier: 'working-knowledge',
        body: 'Batch control and recipe-driven production, including how a batch layer sits above equipment modules.',
      },
      {
        tier: 'working-knowledge',
        body: 'Control panel construction and industrial field wiring practice as executed by the JAG Group.',
      },
      {
        tier: 'working-knowledge',
        body: 'Fleet-level traffic management and how AMR missions are dispatched against production demand.',
      },
      {
        tier: 'working-knowledge',
        body: 'Industrial networking between control, robot and production layers, and the failure modes that appear at the seams between them.',
      },
      {
        tier: 'working-knowledge',
        body: 'GMP computerised system validation lifecycle, and why traceability from requirement to test evidence is the deliverable rather than a by-product.',
      },
      {
        tier: 'adjacent',
        body: "Work was performed for JAG's end clients in pharmaceutical, biotech and food manufacturing.",
      },
    ],
    closing:
      'Six months in a Swiss-standard process house is not a long time. What it bought was seeing one plant as one system: a recipe in software, a valve in the field, a robot moving material between them, and a qualification file that has to prove the whole thing behaves. Most engineers meet those four things in four different jobs.',
    todoConfirm: [
      'PVI+ migration scope, a screen or object count.',
      'Did Saj personally do loop checking or point-to-point testing.',
      'MiR unit count, and whether Saj did map or mission configuration or only fault diagnosis.',
      'Which fieldbus or industrial ethernet protocols Saj personally configured or traced.',
      "Whether any client may be named publicly. Default is to name none. Do not name CSL Behring. It was a JAG client, never Saj's employer.",
    ],
  },
  {
    slug: 'abmarc',
    company: 'ABMARC',
    title: 'Technical Assistant',
    period: 'Jul 2024 to Aug 2025',
    location: 'South Geelong, Victoria',
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
        tier: 'delivered',
        body: 'Prepared QA, regulatory and test documentation for certification and audit, holding traceable configurations, results and findings.',
      },
      {
        tier: 'hands-on',
        body: 'Prepared and instrumented vehicles for emissions and range testing, including fitting measurement equipment, verifying calibration state and setting up the test environment before a run.',
      },
      {
        tier: 'hands-on',
        body: 'Conducted real-time data acquisition during test runs and analysed results against ADR and EURO requirements.',
      },
      {
        tier: 'hands-on',
        body: 'Performed maintenance and fault finding on emissions test equipment to hold accuracy and reliability between programs.',
      },
      {
        tier: 'hands-on',
        body: 'Used CAN tools to capture and interpret vehicle bus data during testing, correlating bus signals against measured emissions and energy consumption.',
      },
      {
        tier: 'hands-on',
        body: 'Tested EV and PHEV range and vehicle systems, a different measurement problem from tailpipe emissions requiring energy accounting rather than gas analysis.',
      },
      {
        tier: 'hands-on',
        body: 'Analysed deviations and supported evidence-based fault isolation, separating instrument fault from vehicle behaviour from test procedure error.',
      },
      {
        tier: 'working-knowledge',
        body: 'Portable emissions measurement as a discipline, including why a field instrument must be treated as a laboratory instrument that happens to be moving.',
      },
      {
        tier: 'working-knowledge',
        body: 'Powertrain behaviour across internal combustion, hybrid and battery electric vehicles as it appears in test data.',
      },
      {
        tier: 'working-knowledge',
        body: 'Repeatability criteria, and what it means for a program to require a third test run when two runs disagree.',
      },
      {
        tier: 'working-knowledge',
        body: 'The Australian Design Rules and the Road Vehicle Certification System as the framework the evidence has to satisfy.',
      },
      {
        tier: 'adjacent',
        body: 'ADAS and driver-assist testing, noise testing and VASS engineering are ABMARC service lines.',
      },
    ],
    closing:
      'Thirteen months of being the person who has to know whether the number is real. Every later claim about sensor fusion, EKF tuning and validated migrations rests on that habit.',
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
    location: 'Greater Geelong, Victoria',
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
        tier: 'delivered',
        body: 'Designed and deployed end-to-end IoT systems linking sensors, embedded devices, gateways, Linux services, data pipelines and dashboards. End to end means the literal chain: a sensor reading, an ESP32 firmware loop, a LoRaWAN uplink on AU915, a ChirpStack network server, an MQTT broker, a Linux service, an InfluxDB time series and a Grafana panel. Seven layers, one engineer.',
      },
      {
        tier: 'delivered',
        body: 'Ran field trials on agricultural equipment and supported provisioning, fault finding and handover to the operator.',
      },
      { tier: 'hands-on', body: 'ESP32 firmware for sensing and telemetry.' },
      { tier: 'hands-on', body: 'LoRaWAN AU915 radio planning and device provisioning.' },
      { tier: 'hands-on', body: 'ChirpStack network server configuration and MQTT topic design.' },
      {
        tier: 'hands-on',
        body: 'Linux service deployment, InfluxDB schema and retention, and Grafana dashboard construction.',
      },
      {
        tier: 'hands-on',
        body: 'Designed a custom PCB for the agricultural monitoring application, integrating CAN trace capture, GPS and environmental sensing on one board.',
      },
      {
        tier: 'hands-on',
        body: 'Enclosure, mounting and field-hardening decisions for equipment that lives outdoors on moving machinery.',
      },
      {
        tier: 'hands-on',
        body: 'MikroTik networking for the field deployment, configured inside the company that distributes and consults on the platform.',
      },
      {
        tier: 'hands-on',
        body: 'Diagnosed failures in a deployed system where the fault could be firmware, radio, network server, broker, database or dashboard, with no way to know in advance which.',
      },
      {
        tier: 'hands-on',
        body: 'Administered the project alongside the engineering: scope, supplier coordination, documentation and delivery tracking.',
      },
      {
        tier: 'working-knowledge',
        body: 'Point to point and point to multipoint wireless design, and the RF trade-offs between LoRaWAN, WiFi and cellular for a given site.',
      },
    ],
    closing:
      'Seven months and a complete vertical stack, from a soldered board to a dashboard a farmer looks at. This is the clearest single proof of the complete-package thesis in the whole record.',
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
    title: 'Engineering and QA support',
    // The brief supplies no dates for this role and none are reconstructed.
    period: null,
    location: 'Corio and Geelong, Victoria',
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
        tier: 'delivered',
        body: 'Inspection and Test Plans, and inspection planning against them.',
      },
      {
        tier: 'delivered',
        body: 'Manufacturing Data Reports, assembling the traceable evidence package for a fabricated item.',
      },
      {
        tier: 'hands-on',
        body: 'Drawing review against fabrication reality, reading structural steel detail drawings and checking them against what the shop could and would produce.',
      },
      {
        tier: 'hands-on',
        body: 'Material traceability, tying heat numbers and material certificates to finished members.',
      },
      {
        tier: 'working-knowledge',
        body: 'AS/NZS structural steel compliance records and what an auditor looks for in them.',
      },
      {
        tier: 'working-knowledge',
        body: 'Welding as a controlled process, including why procedure qualification and welder qualification exist. Thornton employs dedicated welding engineers, so this is proximity to the discipline, not practice of it.',
      },
      {
        tier: 'adjacent',
        body: 'Pressure vessel and heat exchanger fabrication, stress relieving and heat treatment are Thornton capabilities.',
      },
    ],
    closing:
      'This is where the documentation instinct came from. Traceability was not a compliance chore, it was the product: a fabricated beam is worth nothing without the paperwork that proves what it is made of.',
    todoConfirm: [
      'Exact dates and exact job title.',
      'Any named project, such as a bridge or station package.',
    ],
  },
  {
    slug: 'carbon-revolution',
    company: 'Carbon Revolution',
    title: 'Production and quality role',
    // The brief supplies no dates for this role and none are reconstructed.
    period: null,
    location: 'Waurn Ponds and Geelong, Victoria',
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
        tier: 'hands-on',
        body: 'Operated and monitored carbon fibre production equipment through the process steps, working to the tolerances a Tier 1 automotive part demands.',
      },
      {
        tier: 'hands-on',
        body: 'Quality control checks within the in-process measurement regime.',
      },
      {
        tier: 'hands-on',
        body: 'First-level troubleshooting when equipment or process behaviour drifted, including knowing when to stop rather than continue.',
      },
      {
        tier: 'working-knowledge',
        body: 'Composite manufacturing as a controlled process, including why cure, pressure and layup discipline determine whether a structural part is sound.',
      },
      {
        tier: 'working-knowledge',
        body: 'Industry 4.0 traceability in practice, having worked inside a system that records data for every unit at every station.',
      },
      {
        tier: 'adjacent',
        body: "The plant's use of automation, robotics and AI-driven inspection.",
      },
    ],
    closing:
      'The bridge between the manufacturing years and the engineering years. Carbon Revolution is where digital traceability stopped being a concept and became the thing that governed the shift.',
    todoConfirm: [
      'Exact dates and exact title. Public records list Production Line Operator.',
      'Which process stage. Moulding, demoulding, machining, finishing or inspection.',
    ],
  },
  {
    slug: 'idl',
    company: 'IDL',
    title: 'Beverage production role',
    // The brief supplies no dates for this role and none are reconstructed.
    period: null,
    location: 'Geelong, Victoria',
    companyFacts: [],
    claims: [
      {
        tier: 'hands-on',
        body: 'Operated and monitored beverage production equipment while maintaining safety, quality, traceability and first-level troubleshooting discipline.',
      },
      {
        tier: 'working-knowledge',
        body: 'Food and beverage production hygiene, batch traceability and the quality regime governing a consumable product, the same regulatory logic later met at JAG in pharmaceutical and food manufacturing under GMP, approached from the plant floor.',
      },
    ],
    closing: null,
    todoConfirm: [
      'BLOCKING: Full legal entity name. Third-party aggregator records associate this with a Geelong winery and a cellar hand title, but aggregators are unreliable and this is unverified. Do not publish this page until Saj confirms the entity name, the title and the dates. Scaffold the page and leave it unrouted or draft-flagged.',
    ],
    draft: true,
  },
] as const

/** Everything cleared for publication. Draft employers are excluded outright. */
export const publishedEmployers: readonly Employer[] = employers.filter((e) => !e.draft)

export function getEmployer(slug: string): Employer | undefined {
  return publishedEmployers.find((e) => e.slug === slug)
}

/**
 * Section 6's argument, stated once. Transcribed verbatim, including the
 * ordering, which runs oldest to most recent so the pattern accumulates.
 */
export const versatility = {
  heading: 'Six titles, one method.',
  body: 'Six employers. Six different titles. One consistent pattern: in each place the work crossed the boundary the title implied it would respect.',
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
      'Automation and controls engineer',
      'Control logic, HMI, field devices, drives, AMR fleet operations, industrial networking, GMP qualification',
    ],
  ] as const,
  closing:
    'The through-line is not a technology, it is a method: instrument the thing, get a number you can trust, find where the boundary between two subsystems is lying to you, then write down enough evidence that someone else can trust the result. That transfers from a carbon fibre moulding station to a portable emissions analyser on a public road to a validated pharmaceutical plant to a ROS 2 navigation stack, which is why the domains look unrelated on paper and are not.',
} as const
