import type { EvidenceTier } from './tiers'

/**
 * Work records.
 *
 * Every string below is transcribed verbatim from the previous index.html.
 * Nothing is paraphrased, summarised or invented. Where the old site had no
 * copy for a field, the field carries a TODO marker and renders nothing.
 *
 * Source-field mapping from the old nine-field case studies:
 *   Problem                -> problem
 *   Context                -> context
 *   System architecture  \
 *   Engineering decisions / -> approach   (both paragraphs, in order)
 *   Tools and technologies -> toolsNote   (card "Key tools" -> stack)
 *   Validation method      -> validation
 *   Output                 -> outcome
 *   Evidence level         -> evidenceNote
 *   What it demonstrates   -> demonstrates
 */

export interface ProjectImage {
  readonly src: string
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly caption?: string
}

export interface ProjectLink {
  readonly label: string
  readonly url: string
}

export interface Project {
  readonly slug: string
  readonly title: string
  readonly summary: string
  readonly role: string
  readonly period: string | null
  readonly domain: string
  readonly disciplines: readonly string[]
  readonly stack: readonly string[]
  readonly problem: string
  readonly context: string
  /** System architecture, then Engineering decisions. */
  readonly approach: readonly string[]
  readonly toolsNote: string
  readonly validation: string
  readonly outcome: string
  readonly evidenceNote: string
  readonly demonstrates: string
  readonly evidenceTier: EvidenceTier | null
  readonly category: string
  readonly links?: readonly ProjectLink[]
  readonly images?: readonly ProjectImage[]
  readonly featured: boolean
  /** Extra verbatim fields the old site carried on a single record. */
  readonly deepDives?: readonly ProjectLink[]
}

export const projects: readonly Project[] = [
  {
    slug: 'engineering-mastery-lab',
    title: 'Engineering Mastery Lab',
    summary:
      'A browser-first engineering workbench combining input-validated calculators, bounded parametric CAD, eight guided learning labs and evidence-focused project workflows across web and desktop modes.',
    role: 'TODO: Saj to supply.',
    period: null, // TODO: Saj to supply.
    domain: 'Software and engineering tools',
    disciplines: ['Software', 'Automation'],
    stack: ['React', 'TypeScript', 'Three.js', 'Vite', 'Tauri 2', 'Rust', 'Vitest'],
    problem:
      'Engineering learning, calculation, CAD, simulation, skills tracking and evidence workflows are often fragmented across disconnected tools and notes.',
    context:
      'A personal open-source engineering application deployed publicly through GitHub Pages. The shared React and TypeScript interface runs in the browser and in an optional Tauri 2 desktop shell. Version 0.2.0 is a functional completion candidate, not certified or production engineering software.',
    approach: [
      'A React and TypeScript frontend built with Vite and HashRouter for GitHub Pages, pure TypeScript calculation and simulation engines, a Three.js bounded parametric CAD layer, browser-local storage, and a controlled Tauri and Rust boundary for authorised local workspaces, external engineering tools and evidence capture.',
      'Kept the browser experience local-first with no required account, backend or telemetry. Exposed governing assumptions and validation warnings instead of hiding engineering limits. Implemented bounded parametric templates rather than presenting a simplified modeller as general CAD. Kept desktop filesystem and process authority behind an allow-listed Rust boundary with workspace containment and deterministic evidence handling.',
    ],
    toolsNote:
      'React 18, TypeScript, Vite 8, React Router 6, Three.js, Vitest, Tauri 2, Rust, GitHub Actions, optional ngspice and KiCad CLI integration.',
    validation:
      'Automated Vitest suites, TypeScript checks, production builds and GitHub Actions gates, supported by rendered inspection of the deployed dashboard, toolbox, CAD and workbench routes. No engineering-standards certification is claimed.',
    outcome:
      'A working public web application with a browser-first engineering toolbox, bounded parametric CAD, guided learning system and evidence-focused project workflow, plus a desktop-capable source architecture.',
    evidenceNote:
      'Delivered, as personal project evidence. A live public build and public source repository exist. The current v0.2.0 code remains a functional completion candidate and is not claimed as certified or production engineering software.',
    demonstrates:
      'The ability to integrate engineering-domain logic, simulation, CAD geometry, software architecture, security boundaries, validation discipline and accessible product design into one coherent engineering system.',
    evidenceTier: 'delivered',
    category: 'Personal open-source build',
    links: [
      { label: 'Open live app', url: 'https://sajeevanveeriah.github.io/Engineering-Mastery-Lab/' },
      { label: 'View source', url: 'https://github.com/Sajeevanveeriah/Engineering-Mastery-Lab' },
    ],
    images: [
      {
        src: '/assets/image/Engineering_Mastery_Lab_Command_Centre_Rev00.svg',
        alt: 'Engineering Mastery Lab dashboard showing the Parametric CAD Studio, Engineering Toolbox, Project Workbench and PID Control Lab.',
        width: 1435,
        height: 660,
      },
    ],
    featured: true,
  },
  {
    slug: 'autonomous-navigation-rover',
    title: 'Autonomous Navigation Rover on ROS 2',
    summary:
      'A complete ROS 2 Humble autonomy stack with LiDAR SLAM, A* planning, Kalman and EKF estimation and IMU-odometry fusion, validated in simulation for repeatable obstacle-aware navigation.',
    role: 'TODO: Saj to supply.',
    period: null, // TODO: Saj to supply.
    domain: 'Robotics and autonomy',
    disciplines: ['Robotics', 'Control', 'Embedded', 'AI/ML'],
    stack: ['ROS 2 Humble', 'Nav2', 'Gazebo', 'RViz', 'SLAM', 'Kalman and EKF'],
    problem:
      'Autonomous systems need reliable localisation, mapping and obstacle-aware navigation before any of the higher-level behaviour matters.',
    context:
      'A personal robotics build developed end to end, combining simulation with physical-system thinking. Not a commercial deployment.',
    approach: [
      'Sensing and perception, LiDAR-based SLAM, Kalman and EKF state estimation with odometry and IMU fusion, A* and Nav2 path planning, motion control, and Gazebo and RViz simulation and visualisation, structured as modular ROS 2 nodes.',
      'Built on ROS 2 Humble for a maintained long-term base; kept perception, estimation, planning and control as separate nodes so each layer could be tuned and validated independently; used simulation-first validation before physical trials.',
    ],
    toolsNote:
      'ROS 2 Humble, Nav2, Gazebo, RViz, SLAM toolboxes, A* path planning, Kalman and EKF filters, LiDAR, IMU and odometry fusion, PID tuning.',
    validation:
      'Repeated simulation runs in Gazebo with RViz inspection of maps, transforms and planned paths, checking localisation stability and obstacle avoidance across reruns.',
    outcome:
      'A working end-to-end autonomy stack with robust localisation and repeatable obstacle-aware navigation behaviour.',
    evidenceNote:
      'Delivered, as personal project evidence. This is a complete built stack, not a production robot fleet.',
    demonstrates:
      'Full-stack autonomy capability: perception, state estimation, planning and control integrated and validated by one engineer.',
    evidenceTier: 'delivered',
    category: 'Featured, Personal build',
    images: [
      {
        src: '/assets/image/Autonomous_Navigation_ROS2_Robotics_Rev00.jpg',
        alt: 'ROS 2 autonomous navigation stack visualised with robot mapping and route planning',
        width: 1448,
        height: 1086,
      },
    ],
    featured: true,
  },
  {
    slug: 'jag-smart-factory',
    title: 'JAG Smart Factory and iFIX to PVI+ Migration',
    summary:
      'GMP smart-factory automation including an iFIX to PVI+ SCADA migration verified against the validated system.',
    role: 'Automation and Controls Engineer',
    period: 'Jan 2026 to Jun 2026',
    domain: 'Automation and SCADA',
    disciplines: ['Control', 'Automation', 'Manufacturing'],
    stack: ['Siemens TIA Portal', 'WinCC', 'PCS 7', 'iFIX', 'PVI+'],
    problem:
      'Regulated production needs traceability, diagnostics and process visibility without disturbing validated behaviour.',
    context:
      'Professional delivery at JAG Process Solutions Pty Ltd for pharmaceutical, biotech and food clients under GMP, across plants, skids and packaged units.',
    approach: [
      'Field devices and instrumentation integrated with control logic, HMI and SCADA layers, MES and batch execution, and production data flows, including an iFIX to PVI+ SCADA platform migration.',
      'Converted SCADA application content methodically and verified functional behaviour against the existing validated system rather than trusting the conversion; prioritised diagnostics, operator usability and data integrity in every interface decision.',
    ],
    toolsNote:
      'Siemens TIA Portal, WinCC, PCS 7, iFIX, PVI+, PLC logic (IEC 61131-3), MES and batch systems, Modbus and Profinet, GMP and GAMP 5 practice.',
    validation:
      'FAT and SAT execution with commissioning, qualification and handover documentation, verifying migrated behaviour against the validated system.',
    outcome:
      'Delivered control, integration and smart-factory engineering with clearer process visibility, trends, alarms and defensible documentation.',
    evidenceNote: 'Delivered, as professional work in regulated environments.',
    demonstrates:
      'Industrial automation delivery discipline: migrating and integrating supervisory systems where validation evidence matters as much as function.',
    evidenceTier: 'delivered',
    category: 'Professional delivery',
    images: [
      {
        src: '/assets/image/Smart_Factory_Process_Visualisation_Rev00.jpg',
        alt: 'Smart factory process visualisation with HMI, SCADA and production data screens',
        width: 1448,
        height: 1086,
      },
    ],
    featured: true,
  },
  {
    slug: 'adas-can-validation',
    title: 'Ford via Invenio: ADAS and CAN Validation',
    summary:
      'Feature, breadboard and OTA regression testing across T6 Ranger and Everest programmes with CAN-level fault evidence.',
    role: 'Product Development Test Engineer (Contract)',
    period: 'Oct 2025 to Jan 2026',
    domain: 'Automotive and validation',
    disciplines: ['Embedded', 'Validation'],
    stack: ['Vector CANoe', 'CANalyzer', 'CAN and CAN FD', 'instrumentation'],
    problem:
      'Vehicle features must remain stable across variants, running changes and over-the-air software updates, with evidence to prove it.',
    context:
      'Contract placement at Ford Motor Company via Invenio contract placement, validating vehicle software integration and ADAS features across the T6 Ranger and Everest programmes.',
    approach: [
      'Instrumented test vehicles, CAN and CAN FD networks, feature software under test, and structured feature-vehicle, breadboard and regression test workflows feeding readiness milestones and sign-off evidence.',
      'Captured bus-level evidence for every observation so defect reports stood on data rather than impressions; used structured drives to make failures reproducible before reporting them.',
    ],
    toolsNote:
      'Vector CANoe and CANalyzer, CAN and CAN FD, vehicle instrumentation, OTA regression testing, structured test procedures.',
    validation:
      'Feature-vehicle, breadboard and regression testing for readiness milestones and OTA updates, with CAN trace capture and analysis for fault isolation.',
    outcome:
      'Evidence-based defect reports and sign-off evidence supporting programme readiness decisions.',
    evidenceNote:
      'Delivered, as professional contract work. Always credited as Ford Motor Company via Invenio contract placement.',
    demonstrates:
      'Cyber-physical validation skill: reading what a vehicle network is actually doing and turning it into defensible engineering evidence.',
    evidenceTier: 'delivered',
    category: 'Professional delivery',
    images: [
      {
        src: '/assets/image/Vehicle_ADAS_CAN_Validation_Rev00.jpg',
        alt: 'Vehicle ADAS and CAN validation with software testing and signal analysis',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'emissions-compliance-testing',
    title: 'ABMARC Emissions and Compliance Testing',
    summary:
      'Repeatable, auditable emissions testing against ADR and EURO standards with instrumentation and QA records.',
    role: 'Technical Assistant',
    period: 'Jul 2024 to Aug 2025',
    domain: 'Automotive and compliance',
    disciplines: ['Validation', 'Manufacturing'],
    stack: ['Emissions instrumentation', 'data acquisition', 'ADR and EURO procedures'],
    problem:
      'Compliance testing requires accurate, repeatable and auditable measurements that survive regulatory scrutiny.',
    context:
      'Professional work at ABMARC, conducting vehicle emissions and compliance testing against ADR and EURO standards.',
    approach: [
      'Test instrumentation and data-acquisition systems, procedure-driven test execution, and QA and regulatory documentation workflows for certification and audits.',
      'Treated calibration discipline and procedure fidelity as first-class engineering tasks, because the defensibility of the final report depends on them; analysed data for deviations and trends before results left the building.',
    ],
    toolsNote:
      'Emissions test equipment, instrumentation, data-acquisition systems, ADR and EURO test procedures, QA records.',
    validation:
      'Repeatable standard procedures with instrument calibration and cross-checking, producing auditable and technically defensible results.',
    outcome:
      'Defensible compliance results and structured reporting supporting certification and audit outcomes.',
    evidenceNote: 'Delivered, as professional work.',
    demonstrates:
      'Measurement and documentation rigour: the quality habits that carry into every regulated engineering environment.',
    evidenceTier: 'delivered',
    category: 'Professional delivery',
    images: [
      {
        src: '/assets/image/Vehicle_Emissions_Compliance_Testing_Rev00.jpg',
        alt: 'Vehicle emissions and compliance testing with instrumentation and reporting',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'iot-monitoring-platform',
    title: 'DuxTel Agricultural Equipment Health and Location Platform',
    summary:
      'A custom PCB-based field telemetry system combining CAN capture, GPS and equipment condition sensing with MikroTik connectivity and a Linux server, giving operators remote status and maintenance visibility for machinery left across large agricultural sites.',
    role: 'Consultant Engineer, IoT and Projects Administrator',
    period: 'Feb 2024 to Aug 2024',
    domain: 'IoT and telemetry',
    disciplines: ['Embedded', 'Electronics', 'Software', 'AI/ML'],
    stack: [
      'Custom PCB design',
      'CAN capture',
      'GPS or GNSS',
      'sensor interfacing',
      'MikroTik',
      'Linux',
    ],
    problem:
      'Agricultural machinery may be left across large fields, making its location and current condition difficult to confirm before the next visit.',
    context:
      'Professional DuxTel Pty Ltd project, designed and deployed by Sajeevan Veeriah, currently in an active field trial.',
    approach: [
      'Agricultural equipment CAN connection and trace capture, a complete custom PCB, GPS or GNSS location capability, condition-sensor inputs, MikroTik edge connectivity, multiple data capture and transport paths, and a Linux-based server for remote status collection.',
      'Consolidated field interfaces on a purpose-built board, preserved traceable CAN and sensor data, used rugged edge connectivity and separated acquisition, transport and server responsibilities.',
    ],
    toolsNote:
      'Custom PCB design, CAN capture and trace, GPS or GNSS, sensor interfacing, MikroTik and Linux. Data capture and transfer protocols are kept generic because the exact protocols are not public evidence.',
    validation:
      'End-to-end device, CAN, location, sensor, connectivity and server-path checks during deployment and the ongoing field trial.',
    outcome:
      'A working deployed trial system that provides available location and condition information to support maintenance preparation before a return to the asset.',
    evidenceNote: 'Delivered, active professional field trial.',
    demonstrates:
      'End-to-end ownership across electronics, PCB design, embedded and vehicle interfaces, communications, Linux integration, deployment and field validation.',
    evidenceTier: 'delivered',
    category: 'Professional delivery',
    images: [
      {
        src: '/assets/image/20260724-DuxTel-Agricultural-Equipment-Telemetry-Rev00.jpg',
        alt: 'Conceptual visual of agricultural machinery, custom telemetry hardware and data links representing CAN capture, GPS, condition sensing and Linux server monitoring',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'ataxia-assessment-device',
    title: 'ESP32 Clinical Ataxia Assessment Device',
    summary:
      'Embedded hardware and firmware for movement assessment support, validated against clinical references.',
    role: 'TODO: Saj to supply.',
    period: null, // TODO: Saj to supply.
    domain: 'Embedded and sensing',
    disciplines: ['Embedded', 'Electronics', 'Mechanical'],
    stack: ['ESP32', 'IMU', 'ToF', 'Hall effect', 'magnetometer', 'MATLAB'],
    problem:
      'Movement and coordination assessment benefits from repeatable, sensor-based measurement rather than observation alone.',
    context:
      'Final-year Honours capstone for the Bachelor of Mechatronics Engineering at Deakin University, completed with Distinction.',
    approach: [
      'ESP32-based sensing hardware with IMU, time-of-flight, Hall-effect and magnetometer sensors, real-time firmware for signal acquisition, and MATLAB data logging and analysis.',
      'Chose complementary sensor modalities so movement features are captured redundantly; designed the firmware around deterministic real-time acquisition; kept analysis offline in MATLAB where clinical comparison is easier to audit.',
    ],
    toolsNote:
      'ESP32, IMU, ToF, Hall-effect and magnetometer sensing, embedded C and C++, real-time signal acquisition, MATLAB data logging and signal processing.',
    validation:
      'Measurement validation against clinical references, checking that captured motion signals were repeatable and comparable.',
    outcome:
      'A proof-of-concept measurement platform supporting repeatable motion and coordination assessment.',
    evidenceNote:
      'Delivered, as an assessed Honours capstone. A clinical research support concept, not a certified medical device.',
    demonstrates:
      'Embedded hardware, firmware and measurement rigour applied to a safety-relevant sensing problem, with honest validation against references.',
    evidenceTier: 'delivered',
    category: 'University capstone',
    images: [
      {
        src: '/assets/image/Embedded_Clinical_Ataxia_Assessment_Rev00.jpg',
        alt: 'Embedded clinical ataxia assessment device with sensors and movement data capture',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'digital-twin-industrial-ai',
    title: 'Digital Twin and Industrial AI',
    summary:
      'A real-time factory digital twin concept integrating AI agents, anomaly detection, predictive maintenance and OEE analytics.',
    role: 'TODO: Saj to supply.',
    period: null, // TODO: Saj to supply.
    domain: 'AI/ML and automation',
    disciplines: ['AI/ML', 'Automation', 'Manufacturing'],
    stack: ['Python', 'anomaly detection', 'OEE analytics', 'dashboards'],
    problem:
      'Factories benefit from a live, model-based view of equipment so faults are caught early and throughput and quality stay stable.',
    context:
      'A personal engineering concept that mirrors a production line in software. It draws on real smart-factory delivery experience but is not a deployment in a live plant.',
    approach: [
      'Process and equipment state modelling, simulated telemetry generation, an analytics and ML layer for anomaly detection and predictive maintenance, and dashboard visualisation with OEE reporting.',
      'Modelled equipment states explicitly rather than learning them blind, so anomalies map to physical causes; kept the analytics layer separate from the twin so detection logic can be swapped; reported OEE the way production teams actually read it.',
    ],
    toolsNote:
      'Python, anomaly detection and predictive-maintenance logic, AI agents, OEE analytics, dashboard visualisation.',
    validation:
      'Exercised against simulated fault and drift scenarios to confirm anomalies are surfaced, maintenance needs are flagged and OEE responds correctly. Concept-level validation only.',
    outcome:
      'A working demonstration that surfaces anomalies, flags maintenance needs and reports OEE in real time.',
    evidenceNote:
      'Hands-on. A built personal concept, deliberately not claimed as a production deployment.',
    demonstrates:
      'The bridge between plant-floor automation experience and applied AI/ML: knowing what a factory needs from its data before modelling it.',
    evidenceTier: 'hands-on',
    category: 'Personal concept',
    images: [
      {
        src: '/assets/image/Digital_Twin_Industrial_AI_Rev00.png',
        alt: 'Real-time factory digital twin concept with AI agents, anomaly detection and OEE analytics dashboards',
        width: 1448,
        height: 1086,
      },
    ],
    featured: false,
  },
  {
    slug: 'manufacturing-qa-foundation',
    title: 'Manufacturing and QA Foundation',
    summary:
      'Six years across food and beverage, carbon-fibre and structural-steel production: operations, QA, traceability, robotic automation and commissioning.',
    role: 'TODO: Saj to supply.',
    period: '2018 to 2024',
    domain: 'Manufacturing and quality',
    disciplines: ['Manufacturing', 'Mechanical'],
    stack: ['IDL', 'Carbon Revolution', 'Thornton Engineering'],
    problem:
      'Automation, validation and commissioning engineers are only as good as their understanding of how production floors, operators and quality systems actually behave.',
    context:
      'Six years of production and quality work from 2018 to 2024 at IDL, Carbon Revolution and Thornton Engineering Australia Pty Ltd, running alongside formal engineering study.',
    approach: [
      'High-throughput packaged beverage production lines, a carbon-fibre rim layup line moving onto KUKA-based robotic cells, and standards-driven structural-steel and pressure-vessel fabrication, each with its own quality, traceability and documentation system.',
      'Progressed deliberately from operating machines to leading lines and owning quality workflows; treated changeovers, first-response fixes and inspection evidence as engineering problems, not chores; learned the paperwork that makes production defensible: ITPs, MDRs, traceability records and QA sign-off.',
    ],
    toolsNote:
      'Canning, bottling and kegging lines, WestRock and Fibre King packaging equipment, KUKA-based automated rim layup, NDE and mechanical testing exposure, ITP and MDR documentation, drawing review, KPI tracking, Lean practice.',
    validation:
      'Daily production KPIs, QA checks, inspection evidence and documented sign-off, including installation and commissioning support for WestRock and Fibre King equipment during a canning line upgrade, and hands-on involvement as a legacy rim layup machine was replaced by KUKA-based robotic cells.',
    outcome:
      'A working production and quality instinct: line recovery, changeover logic, operator empathy and audit-ready documentation habits.',
    evidenceNote:
      'Delivered, as professional employment across three manufacturers. Detailed role records are in the Experience section.',
    demonstrates:
      'The foundation under every later delivery: automation designed by someone who has run the line, fixed the jam and signed the QA record.',
    evidenceTier: 'delivered',
    category: 'Professional foundation',
    deepDives: [
      {
        label: 'Carbon Revolution robotic rim layup automation',
        url: '/work/carbon-revolution-rim-layup/',
      },
      { label: 'IDL canning line upgrade and commissioning', url: '/work/idl-canning-line/' },
    ],
    featured: false,
  },
  {
    slug: 'carbon-revolution-rim-layup',
    title: 'Carbon Revolution: Robotic Rim Layup Automation',
    summary:
      'Hands-on through the automation programme that replaced the legacy automated rim layup machine with new KUKA-based robotic cells.',
    role: 'Automated Rim Layup Operator to Robotic Automation, Quality and Development Support',
    period: null, // TODO: Saj to supply.
    domain: 'Advanced manufacturing and robotics',
    disciplines: ['Robotics', 'Manufacturing', 'Mechanical'],
    stack: [
      'KUKA robotic cells',
      'automated rim layup',
      'robotic demoulding',
      'NDE and mechanical testing',
    ],
    problem:
      'Scaling carbon-fibre wheel production means taking repeatable fibre layup, and the handling of hot, heavy, safety-critical tooling, off manual work and onto robots, without losing the quality a structural wheel depends on.',
    context:
      'Advanced carbon-fibre automotive wheel manufacturing at Carbon Revolution in Waurn Ponds, Geelong. Hands-on through the automation programme that replaced the legacy automated rim layup machine with new KUKA-based robotic cells, while moving from layup operation towards quality assurance and development support.',
    approach: [
      'KUKA robotic cells for automated rim layup and robotic demoulding of tooling that runs hot and heavy, feeding the downstream composite cure, machining, NDE and mechanical-test flow, each with its own quality and traceability checks.',
      'Treated the change as a systems problem, not a machine swap: moving hot, heavy tooling handling onto robots to take it off operators, and leaning on trials, first-off checks and defect inspection to prove the robotic cell held layup repeatability before the line was allowed to ramp.',
    ],
    toolsNote:
      'KUKA robotic cells, automated rim layup, robotic demoulding, carbon-fibre composite production, NDE and mechanical testing, production quality and defect-inspection systems.',
    validation:
      'Trials, first-off and in-process quality checks, defect inspection, changeover and line recovery as the KUKA line was commissioned and ramped into production. Hands-on involvement and support, not ownership of the robot-cell design or programming.',
    outcome:
      'A hands-on, floor-level understanding of moving a production line onto industrial robotics: what changes for operators, quality and throughput when robots take over layup and demoulding.',
    evidenceNote:
      'Hands-on, as professional employment. Involvement in and support of the automation transition; never claimed as owning the KUKA cell design or programming.',
    demonstrates:
      'Real industrial robotics exposure sitting underneath the ROS 2 and controls work on this page: robotics on a factory floor, where safety, repeatability and ramp matter as much as the kinematics.',
    evidenceTier: 'hands-on',
    category: 'Professional foundation',
    featured: false,
  },
  {
    slug: 'idl-canning-line',
    title: 'IDL: Canning Line Upgrade and Commissioning',
    summary:
      'Hands-on installation and commissioning of WestRock and Fibre King packaging equipment during a canning line upgrade on a live production site.',
    role: 'Production Line Worker to Team Lead / Line Support to Cellar Hand',
    period: null, // TODO: Saj to supply.
    domain: 'Manufacturing and packaging automation',
    disciplines: ['Manufacturing', 'Automation'],
    stack: [
      'Canning, bottling and kegging lines',
      'WestRock and Fibre King packaging equipment',
      'changeover and KPI tracking',
    ],
    problem:
      'A high-throughput beverage plant has to lift capacity and reliability across canning, bottling and kegging without long downtime, which means installing and commissioning new packaging automation on a live production site.',
    context:
      'Food and beverage manufacturing at IDL across five lines: two canning, two bottling and one kegging. Hands-on installation and commissioning of WestRock and Fibre King packaging equipment during a canning line upgrade, with progression from line work into team lead, line support and cellar operations.',
    approach: [
      'High-throughput packaging lines with fillers, seamers and conveyors, the WestRock and Fibre King equipment added for the canning line upgrade, and the upstream cellar processes that turn raw product into a finished, packaged beverage.',
      "Treated changeovers, first-response fixes and run recovery as engineering problems rather than chores; supported install and commissioning so the new equipment held rate and quality; learned the line from the operator's side to see how a small mechanical or control fault costs throughput.",
    ],
    toolsNote:
      'Canning, bottling and kegging lines, WestRock and Fibre King packaging equipment, changeover and KPI tracking, quality checks and first-response machine fixes.',
    validation:
      'Daily production KPIs, quality checks, first-response fixes, and installation and commissioning checks as new equipment was brought up to rate on the canning line.',
    outcome:
      'A packaging-automation and commissioning instinct: install it, prove it, recover it and hold rate on a live, high-throughput line.',
    evidenceNote:
      'Delivered and Hands-on, as professional employment: installation and commissioning support, production operations and quality.',
    demonstrates:
      'The operator-and-commissioning half of automation: why usability, changeover design, line recovery and traceable QA matter, feeding straight into controls, commissioning and smart-factory work.',
    evidenceTier: 'delivered',
    category: 'Professional foundation',
    featured: false,
  },
  {
    // TODO: Saj to supply. Every field on this record is unwritten. The only
    // source material in the repository was two passing mentions of the club
    // website in the previous index.html (lines 756 and 1427), which is not
    // enough to write a case study from. Nothing here is inferred.
    slug: 'ndcc-website',
    title: 'Newcomb and District Cricket Club website',
    summary: 'TODO: Saj to supply.',
    role: 'TODO: Saj to supply.',
    period: null, // TODO: Saj to supply.
    domain: 'Software and engineering tools',
    disciplines: ['Software'],
    stack: [], // TODO: Saj to supply.
    problem: '', // TODO: Saj to supply.
    context: '', // TODO: Saj to supply.
    approach: [], // TODO: Saj to supply.
    toolsNote: '', // TODO: Saj to supply.
    validation: '', // TODO: Saj to supply.
    outcome: '', // TODO: Saj to supply.
    evidenceNote: '', // TODO: Saj to supply.
    demonstrates: '', // TODO: Saj to supply.
    evidenceTier: null, // TODO: Saj to assign evidenceTier.
    category: 'TODO: Saj to supply.',
    featured: false,
  },
] as const

/** Domains present across the record set, for the /work filter. */
export const projectDomains: readonly string[] = Array.from(
  new Set(projects.map((p) => p.domain)),
).sort()

/** Disciplines present across the record set, for the /work filter. */
export const projectDisciplines: readonly string[] = Array.from(
  new Set(projects.flatMap((p) => p.disciplines)),
).sort()

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

/**
 * A record renders only when it has a tier assigned. `ndcc-website` is
 * therefore scaffolded and typed but does not appear on the site until Saj
 * supplies its content and tier.
 */
export const publishedProjects: readonly Project[] = projects.filter(
  (p) => p.evidenceTier !== null,
)
