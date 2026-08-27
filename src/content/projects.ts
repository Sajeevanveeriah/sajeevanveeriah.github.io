export interface Project {
  readonly slug: string
  readonly title: string
  readonly evidence: string
  readonly problem: string
  readonly system: string
  readonly architecture: string
  readonly ownership: string
  readonly decisions: readonly string[]
  readonly verification: string
  readonly readiness: string
  readonly boundary: string
  readonly stack: readonly string[]
  readonly systemPath: readonly { readonly label: string; readonly detail: string }[]
  readonly image?: { readonly src: string; readonly alt: string; readonly width: number; readonly height: number }
}

export const projects: readonly [Project, Project, Project] = [
  {
    slug: 'autonomous-navigation-rover',
    title: 'Autonomous Navigation Rover on ROS 2',
    evidence: 'Hardware build with simulation-validated autonomy',
    problem: 'Autonomous systems need reliable localisation, mapping and obstacle-aware navigation before higher-level behaviour matters.',
    system: 'A differential-drive platform with LiDAR and IMU sensing, running ROS 2 Humble, Nav2, SLAM, EKF state estimation and motion control.',
    architecture: 'LiDAR and IMU inputs feed modular ROS 2 nodes for mapping and EKF state estimation. Nav2 consumes the resulting map and fused pose for costmaps, planning, control and recovery behaviour, with Gazebo Fortress and RViz providing repeatable inspection.',
    ownership: 'Built the platform and integrated sensing, localisation, planning and control across independently testable ROS 2 nodes.',
    decisions: [
      'Kept perception, estimation, planning and control modular so each layer could be tuned and validated independently.',
      'Regression-tested planning, costmaps, controller gains and recovery behaviour in simulation before applying changes to hardware.',
    ],
    verification: 'Gazebo Fortress regression runs and RViz inspection checked maps, transforms, fused pose, planned paths and recovery behaviour before physical deployment.',
    readiness: 'A working hardware and simulation platform with repeatable localisation, planning and obstacle-aware navigation behaviour.',
    boundary: 'Simulation provides the repeatable autonomy evidence. This record does not claim fleet deployment or certified functional safety.',
    stack: ['ROS 2 Humble', 'Nav2', 'Gazebo Fortress', 'RViz', 'LiDAR SLAM', 'EKF', 'Python', 'C++', 'Linux'],
    systemPath: [
      { label: 'Sense', detail: 'LiDAR and IMU' },
      { label: 'Estimate', detail: 'SLAM and EKF pose' },
      { label: 'Plan', detail: 'Nav2 and costmaps' },
      { label: 'Act', detail: 'Motion control and recovery' },
    ],
  },
  {
    slug: 'ataxia-assessment-device',
    title: 'ESP32 Clinical Ataxia Assessment Device',
    evidence: 'Assessed embedded prototype',
    problem: 'Movement and coordination assessment benefits from repeatable sensor-based measurement rather than observation alone.',
    system: 'An ESP32 device with a custom PCB, enclosure, four Hall-effect sensors, 100 Hz acquisition, Bluetooth connectivity and MATLAB validation.',
    architecture: 'Four Hall-effect sensing channels feed deterministic 100 Hz acquisition on the ESP32. The embedded path supports recording and Bluetooth live display, while MATLAB provides the auditable reference-instrument comparison and reporting workflow.',
    ownership: 'Designed the device, PCB and enclosure, implemented real-time acquisition and Bluetooth workflows, and built the analysis and reporting path.',
    decisions: [
      'Used four Hall-effect sensing channels and deterministic 100 Hz acquisition to capture direction, reversal and movement behaviour consistently.',
      'Kept acquisition and live display responsive on the embedded system while retaining MATLAB for auditable reference-instrument comparison.',
    ],
    verification: 'Accuracy, direction, reversal, drift and temperature behaviour were checked against reference instruments in MATLAB.',
    readiness: 'A proof-of-concept measurement platform with real-time recording, Bluetooth live display and CSV/PDF clinician reporting.',
    boundary: 'This was an assessed engineering prototype, not a certified medical device and not a claim of clinical efficacy.',
    stack: ['ESP32', 'C/C++', 'BLE', 'Altium', 'MATLAB', 'Hall-effect sensing', 'PCB design', 'Enclosure design'],
    systemPath: [
      { label: 'Measure', detail: 'Four Hall-effect channels' },
      { label: 'Acquire', detail: 'ESP32 at 100 Hz' },
      { label: 'Transmit', detail: 'BLE live display and CSV' },
      { label: 'Validate', detail: 'MATLAB comparison and reporting' },
    ],
  },
  {
    slug: 'swl-pricing-inventory-control',
    title: 'SWL Pricing and Inventory Control',
    evidence: 'Client-commissioned system, release 1.2.0',
    problem: 'Stan Wootton Locksmiths reprices its ServiceM8 materials catalogue from supplier price exports. Doing that by spreadsheet risks damaged item numbers and barcodes, an inconsistent markup and unreviewed price changes reaching the job system.',
    system: 'A local-first pricing and inventory control application with a Windows desktop surface and a browser surface. It compares an untouched supplier export against the current ServiceM8 materials list, applies the confirmed 30 percent markup on GST-exclusive cost, and produces an operator-reviewed import CSV in ServiceM8\'s exact format, with change, exception, rollback and audit reports.',
    architecture: 'A shared React and TypeScript interface over pure domain modules for money, pricing, comparison, mapping and output. A typed platform adapter selects the backend: scoped Tauri commands with bundled SQLite on the Rust desktop build, a loopback Node server for local web use, and a session-only store for the static demonstration.',
    ownership: 'Sole engineer across requirements, domain rules, the desktop and web builds, file-format contracts, test strategy, CI and Windows release packaging.',
    decisions: [
      'Matching is deterministic and fail-closed: exact normalised code, then operator-approved alias, then description similarity as a suggestion only. Items missing from a supplier file are never deleted, and money is never binary floating point.',
      'Imported business rows stay in memory and are never persisted; repository checks and CI enforce a no-production-data and no-secrets rule on every change.',
    ],
    verification: 'More than 500 automated checks: Vitest unit and property-based tests, Playwright browser tests with axe accessibility runs, WebdriverIO tests against the installed desktop app and Rust unit tests, including a byte-for-byte round trip of the ServiceM8 CSV contract. Typecheck, lint, tests and packaging run in CI.',
    readiness: 'Release 1.2.0 builds an unsigned Windows installer and a browser demonstration through CI. Production installation, code signing and automatic updates sit outside the current release boundary and are tracked in the repository\'s gap register.',
    boundary: 'This record does not claim a completed production rollout, live supplier or accounting integrations in use, or outcomes beyond the release evidence described here. The software is proprietary to the client and its codebase is private.',
    stack: ['TypeScript', 'React', 'Tauri 2', 'Rust', 'SQLite', 'Node.js', 'Vitest', 'Playwright', 'GitHub Actions'],
    systemPath: [
      { label: 'Ingest', detail: 'Supplier and ServiceM8 files' },
      { label: 'Decide', detail: 'Pure pricing and matching rules' },
      { label: 'Review', detail: 'Changes, exceptions and rollback' },
      { label: 'Deliver', detail: 'Audited ServiceM8 import' },
    ],
    image: {
      src: '/assets/image/20260826-SWL-Pricing-Run-Rev00.png',
      alt: 'Screenshot of the SWL Pricing and Inventory Control new-run screen showing the seven-stage workflow from adding files to a reviewed export, with the current business rules panel.',
      width: 1672,
      height: 941,
    },
  },
] as const

export const featuredProjects = projects

export interface IndexedProject {
  readonly title: string
  readonly summary: string
  readonly evidence: string
  readonly image?: {
    readonly src: string
    readonly alt: string
    readonly width: number
    readonly height: number
    readonly kind: 'Interface visual' | 'System diagram'
  }
}

export interface ProjectGroup {
  readonly group: string
  readonly items: readonly IndexedProject[]
}

export const projectIndex: readonly ProjectGroup[] = [
  {
    group: 'Robotics and physical systems',
    items: [
      { title: 'Upzy: Supervised Routine Companion Robot', summary: 'A completed, privacy-conscious educational routine companion robot for young children, with a supporting browser application for adult-defined routines and review.', evidence: 'Deployed physical system' },
      { title: 'Inventory Scanning Mobile Robot', summary: 'An operator-support mobile robot that assists physical inventory scanning and connects captured stock observations to a controlled review workflow.', evidence: 'Active client deployment' },
      { title: 'Modular Education and Testing Robot', summary: 'A modular robot platform for education, engineering experiments and repeatable subsystem testing, in active supervised use.', evidence: 'Deployed physical system' },
      { title: 'DuxTel Agricultural Equipment Telemetry', summary: 'A custom PCB-based field telemetry system combining CAN capture, GPS and condition sensing with MikroTik connectivity and a Linux server for remote machinery visibility.', evidence: 'Deployed physical system' },
    ],
  },
  {
    group: 'Software and AI platforms',
    items: [
      {
        title: 'Panelogram Retail Shelf Planner', summary: 'A local-first retail shelf planner with exact millimetre geometry, capacity checks, CSV import and printable shelf reporting.', evidence: 'Local-first alpha with a published static build',
        image: { src: '/assets/image/20260826-Panelogram-Bay-Layout-Rev00.png', alt: 'Screenshot of Panelogram rendering a six-shelf bay to scale with millimetre rulers and per-shelf capacity figures.', width: 1672, height: 941, kind: 'Interface visual' },
      },
      {
        title: 'Snail Race Fundraising Platform', summary: 'A versioned fundraising event platform with a seeded, replayable race engine, QR donations, tote board and moderator reconciliation.', evidence: 'Complete event platform, version 3.0.0',
        image: { src: '/assets/image/20260826-Snail-Race-Stage-Rev00.png', alt: 'Screenshot of the Snail Race projector stage showing the animated track and play-chip tote board.', width: 1672, height: 941, kind: 'Interface visual' },
      },
      {
        title: 'Engineering Mastery Lab', summary: 'A browser-first engineering workbench combining input-validated calculators, bounded parametric CAD, guided learning labs and evidence-focused project workflows.', evidence: 'Deployed software system',
        image: { src: '/assets/image/Engineering_Mastery_Lab_Command_Centre_Rev00.svg', alt: 'Interface visual of the Engineering Mastery Lab dashboard.', width: 1435, height: 660, kind: 'Interface visual' },
      },
      {
        title: 'VeerAI: Local SLM System', summary: 'A complete local AI system: an open-weight small language model on personally owned hardware inside a governed ingestion, retrieval, memory, tools and evaluation pipeline.', evidence: 'Locally deployed private system',
        image: { src: '/assets/image/20260802-VeerAI-SLM-Project-Visual-Rev00.avif', alt: 'System diagram of the VeerAI local SLM system.', width: 1672, height: 941, kind: 'System diagram' },
      },
      {
        title: 'Newcomb and District Cricket Club Platform', summary: 'The official NDCC digital platform, combining the public club website with committee content, membership, merchandise, gallery, sponsor and administration workflows.', evidence: 'Deployed software system',
        image: { src: '/assets/image/20260803-NDCC-Website-Platform-Rev00.svg', alt: 'System diagram of the NDCC digital platform architecture.', width: 1435, height: 660, kind: 'System diagram' },
      },
      { title: 'Digital Twin and Industrial AI', summary: 'A real-time factory digital twin concept integrating AI agents, anomaly detection, predictive maintenance and OEE analytics.', evidence: 'Concept development' },
    ],
  },
  {
    group: 'Industrial and automotive delivery',
    items: [
      { title: 'Regulated Smart Factory and SCADA Migration', summary: 'GMP smart-factory automation delivery, including an iFIX to PVI+ SCADA migration verified against the validated system.', evidence: 'Hands-on professional integration' },
      { title: 'ADAS and CAN Validation', summary: 'Feature, breadboard and OTA regression testing across vehicle development programmes, supported by CAN-level fault evidence.', evidence: 'Hands-on professional integration' },
      { title: 'ABMARC Emissions and Compliance Testing', summary: 'Repeatable, auditable emissions testing against ADR and EURO standards, supported by calibrated instrumentation and QA records.', evidence: 'Hands-on professional integration' },
      { title: 'Carbon Revolution: Robotic Rim Layup Automation', summary: 'Hands-on work through the automation programme that replaced the legacy automated rim layup machine with new KUKA-based robotic cells.', evidence: 'Hands-on professional integration' },
      { title: 'IDL: Canning Line Upgrade and Commissioning', summary: 'Hands-on installation and commissioning of WestRock and Fibre King packaging equipment during a canning line upgrade on a live production site.', evidence: 'Hands-on professional integration' },
      { title: 'Manufacturing and QA Foundation', summary: 'Six years across food and beverage, carbon-fibre and structural-steel production, spanning operations, QA, traceability, robotic automation and commissioning.', evidence: 'Hands-on professional integration' },
    ],
  },
] as const

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
