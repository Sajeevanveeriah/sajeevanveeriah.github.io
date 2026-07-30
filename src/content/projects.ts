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
  readonly displayMode?: 'contain' | 'cover' | 'full-bleed'
  readonly aspectRatio?: string
  readonly objectPosition?: string
  readonly background?: 'light' | 'dark' | 'neutral'
  readonly sizes?: string
  readonly mobileSrc?: string
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
  /**
   * Withheld from every discovery surface: nav panels, index listings,
   * related-work modules and the sitemap. The route still builds and
   * resolves at its original URL, deliberately, and the page carries
   * `noindex`. Suppression is not deletion: nothing is removed from the
   * record set and no history is rewritten.
   */
  readonly suppressed?: true
  readonly homeExcerpt?: {
    readonly ownership: string
    readonly outcome: string
  }
  /** Extra verbatim fields the old site carried on a single record. */
  readonly deepDives?: readonly ProjectLink[]
}

export const projects: readonly Project[] = [
  {
    slug: 'engineering-mastery-lab',
    title: 'Engineering Mastery Lab',
    summary:
      'I built a browser-first engineering workbench that combines input-validated calculators, bounded parametric CAD, eight guided learning labs and evidence-focused project workflows across web and desktop modes.',
    role: 'TODO: Saj to supply.',
    period: null, // TODO: Saj to supply.
    domain: 'Software and engineering tools',
    disciplines: ['Software', 'Automation'],
    stack: ['React', 'TypeScript', 'Three.js', 'Vite', 'Tauri 2', 'Rust', 'Vitest'],
    problem:
      'Engineering learning, calculation, CAD, simulation, skills tracking and evidence workflows are often fragmented across disconnected tools and notes.',
    context:
      'I developed this as a personal open-source engineering application and deployed it publicly through GitHub Pages. I use a shared React and TypeScript interface in the browser and an optional Tauri 2 desktop shell. Version 0.2.0 is my functional completion candidate, not certified or production engineering software.',
    approach: [
      'A React and TypeScript frontend built with Vite and HashRouter for GitHub Pages, pure TypeScript calculation and simulation engines, a Three.js bounded parametric CAD layer, browser-local storage, and a controlled Tauri and Rust boundary for authorised local workspaces, external engineering tools and evidence capture.',
      'I kept the browser experience local-first with no required account, backend or telemetry. Exposed governing assumptions and validation warnings instead of hiding engineering limits. Implemented bounded parametric templates rather than presenting a simplified modeller as general CAD. Kept desktop filesystem and process authority behind an allow-listed Rust boundary with workspace containment and deterministic evidence handling.',
    ],
    toolsNote:
      'React 18, TypeScript, Vite 8, React Router 6, Three.js, Vitest, Tauri 2, Rust, GitHub Actions, optional ngspice and KiCad CLI integration.',
    validation:
      'I validated it with automated Vitest suites, TypeScript checks, production builds, GitHub Actions gates and rendered inspection of the deployed dashboard, toolbox, CAD and workbench routes. I do not claim engineering-standards certification.',
    outcome:
      'I delivered a working public web application with a browser-first engineering toolbox, bounded parametric CAD, a guided learning system, an evidence-focused project workflow and a desktop-capable source architecture.',
    evidenceNote:
      'I present this as Delivered personal project evidence. I provide a live public build and public source repository. My current v0.2.0 code remains a functional completion candidate, and I do not claim it as certified or production engineering software.',
    demonstrates:
      'This demonstrates my ability to integrate engineering-domain logic, simulation, CAD geometry, software architecture, security boundaries, validation discipline and accessible product design into one coherent engineering system.',
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
        displayMode: 'contain',
        aspectRatio: '1435 / 660',
        background: 'dark',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    homeExcerpt: {
      ownership: 'I owned the product architecture across engineering logic, CAD geometry, software, desktop security boundaries and validation.',
      outcome: 'A working public application spanning calculation, bounded parametric CAD, guided learning and evidence workflows.',
    },
    featured: true,
  },
  {
    slug: 'autonomous-navigation-rover',
    title: 'Autonomous Navigation Rover on ROS 2',
    summary:
      'I built a complete ROS 2 Humble autonomy stack with LiDAR SLAM, A* planning, Kalman and EKF estimation and IMU-odometry fusion, then validated it in simulation for repeatable obstacle-aware navigation.',
    role: 'TODO: Saj to supply.',
    period: null, // TODO: Saj to supply.
    domain: 'Robotics and autonomy',
    disciplines: ['Robotics', 'Control', 'Embedded', 'AI/ML'],
    stack: ['ROS 2 Humble', 'Nav2', 'Gazebo', 'RViz', 'SLAM', 'Kalman and EKF'],
    problem:
      'Autonomous systems need reliable localisation, mapping and obstacle-aware navigation before any of the higher-level behaviour matters.',
    context:
      'I developed this personal robotics build end to end, combining simulation with physical-system thinking. I do not present it as a commercial deployment.',
    approach: [
      'Sensing and perception, LiDAR-based SLAM, Kalman and EKF state estimation with odometry and IMU fusion, A* and Nav2 path planning, motion control, and Gazebo and RViz simulation and visualisation, structured as modular ROS 2 nodes.',
      'I built on ROS 2 Humble for a maintained long-term base; kept perception, estimation, planning and control as separate nodes so each layer could be tuned and validated independently; used simulation-first validation before physical trials.',
    ],
    toolsNote:
      'ROS 2 Humble, Nav2, Gazebo, RViz, SLAM toolboxes, A* path planning, Kalman and EKF filters, LiDAR, IMU and odometry fusion, PID tuning.',
    validation:
      'I ran repeated Gazebo simulations and used RViz to inspect maps, transforms and planned paths, checking localisation stability and obstacle avoidance across reruns.',
    outcome:
      'I delivered a working end-to-end autonomy stack with robust localisation and repeatable obstacle-aware navigation behaviour.',
    evidenceNote:
      'I present this as Delivered personal project evidence. I built the complete stack, but I do not present it as a production robot fleet.',
    demonstrates:
      'This demonstrates my full-stack autonomy capability across perception, state estimation, planning and control, integrated and validated by me.',
    evidenceTier: 'delivered',
    category: 'Featured, Personal build',
    images: [
      {
        src: '/assets/image/Autonomous_Navigation_ROS2_Robotics_Rev00.jpg',
        alt: 'ROS 2 autonomous navigation stack visualised with robot mapping and route planning',
        width: 1448,
        height: 1086,
        displayMode: 'contain',
        aspectRatio: '4 / 3',
        background: 'dark',
      },
    ],
    homeExcerpt: {
      ownership: 'I integrated perception, state estimation, planning and control as independently testable ROS 2 nodes.',
      outcome: 'A repeatable simulation-validated autonomy stack with stable localisation and obstacle-aware navigation.',
    },
    featured: true,
  },
  {
    slug: 'jag-smart-factory',
    title: 'JAG Smart Factory and iFIX to PVI+ Migration',
    summary:
      'I delivered GMP smart-factory automation, including an iFIX to PVI+ SCADA migration that I verified against the validated system.',
    role: 'Automation and Controls Engineer',
    period: 'Jan 2026 to Jun 2026',
    domain: 'Automation and SCADA',
    disciplines: ['Control', 'Automation', 'Manufacturing'],
    stack: ['Siemens TIA Portal', 'WinCC', 'PCS 7', 'iFIX', 'PVI+'],
    problem:
      'Regulated production needs traceability, diagnostics and process visibility without disturbing validated behaviour.',
    context:
      'I delivered this work at JAG Process Solutions Pty Ltd for pharmaceutical, biotech and food clients under GMP, across plants, skids and packaged units.',
    approach: [
      'Field devices and instrumentation integrated with control logic, HMI and SCADA layers, MES and batch execution, and production data flows, including an iFIX to PVI+ SCADA platform migration.',
      'I converted SCADA application content methodically and verified functional behaviour against the existing validated system rather than trusting the conversion; prioritised diagnostics, operator usability and data integrity in every interface decision.',
    ],
    toolsNote:
      'Siemens TIA Portal, WinCC, PCS 7, iFIX, PVI+, PLC logic (IEC 61131-3), MES and batch systems, Modbus and Profinet, GMP and GAMP 5 practice.',
    validation:
      'I executed FAT and SAT activities and produced commissioning, qualification and handover documentation, verifying migrated behaviour against the validated system.',
    outcome:
      'I delivered control, integration and smart-factory engineering with clearer process visibility, trends, alarms and defensible documentation.',
    evidenceNote: 'I present this as Delivered professional work in regulated environments.',
    demonstrates:
      'This demonstrates my industrial automation delivery discipline: I migrate and integrate supervisory systems where validation evidence matters as much as function.',
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
    suppressed: true,
    title: 'ADAS and CAN Validation',
    summary:
      'I conducted feature, breadboard and OTA regression testing across the T6 Ranger and Everest programmes, supported by CAN-level fault evidence.',
    role: 'Product Development Test Engineer (Contract)',
    period: 'Oct 2025 to Jan 2026',
    domain: 'Automotive and validation',
    disciplines: ['Embedded', 'Validation'],
    stack: ['Vector CANoe', 'CANalyzer', 'CAN and CAN FD', 'instrumentation'],
    problem:
      'Vehicle features must remain stable across variants, running changes and over-the-air software updates, with evidence to prove it.',
    context:
      'I validated vehicle software integration and ADAS features across the T6 Ranger and Everest programmes.',
    approach: [
      'Instrumented test vehicles, CAN and CAN FD networks, feature software under test, and structured feature-vehicle, breadboard and regression test workflows feeding readiness milestones and sign-off evidence.',
      'I captured bus-level evidence for every observation so defect reports stood on data rather than impressions; used structured drives to make failures reproducible before reporting them.',
    ],
    toolsNote:
      'Vector CANoe and CANalyzer, CAN and CAN FD, vehicle instrumentation, OTA regression testing, structured test procedures.',
    validation:
      'I ran feature-vehicle, breadboard and regression testing for readiness milestones and OTA updates, capturing and analysing CAN traces for fault isolation.',
    outcome:
      'I delivered evidence-based defect reports and sign-off evidence supporting programme readiness decisions.',
    evidenceNote:
      'I present this as Delivered professional contract work.',
    demonstrates:
      'This demonstrates my cyber-physical validation skill: I read what a vehicle network is actually doing and turn it into defensible engineering evidence.',
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
      'I conducted repeatable, auditable emissions testing against ADR and EURO standards, supported by instrumentation and QA records.',
    role: 'Technical Assistant',
    period: 'Jul 2024 to Aug 2025',
    domain: 'Automotive and compliance',
    disciplines: ['Validation', 'Manufacturing'],
    stack: ['Emissions instrumentation', 'data acquisition', 'ADR and EURO procedures'],
    problem:
      'Compliance testing requires accurate, repeatable and auditable measurements that survive regulatory scrutiny.',
    context:
      'I completed this professional work at ABMARC, conducting vehicle emissions and compliance testing against ADR and EURO standards.',
    approach: [
      'Test instrumentation and data-acquisition systems, procedure-driven test execution, and QA and regulatory documentation workflows for certification and audits.',
      'I treated calibration discipline and procedure fidelity as first-class engineering tasks, because the defensibility of the final report depends on them; analysed data for deviations and trends before results left the building.',
    ],
    toolsNote:
      'Emissions test equipment, instrumentation, data-acquisition systems, ADR and EURO test procedures, QA records.',
    validation:
      'I followed repeatable standard procedures, calibrated and cross-checked instrumentation, and produced auditable and technically defensible results.',
    outcome:
      'I delivered defensible compliance results and structured reporting supporting certification and audit outcomes.',
    evidenceNote: 'I present this as Delivered professional work.',
    demonstrates:
      'This demonstrates my measurement and documentation rigour, including the quality habits I carry into regulated engineering environments.',
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
      'I designed and deployed a custom PCB-based field telemetry system combining CAN capture, GPS and equipment condition sensing with MikroTik connectivity and a Linux server, giving operators remote status and maintenance visibility for machinery left across large agricultural sites.',
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
      'I designed and deployed this professional DuxTel Pty Ltd project, which is currently in an active field trial.',
    approach: [
      'Agricultural equipment CAN connection and trace capture, a complete custom PCB, GPS or GNSS location capability, condition-sensor inputs, MikroTik edge connectivity, multiple data capture and transport paths, and a Linux-based server for remote status collection.',
      'I consolidated field interfaces on a purpose-built board, preserved traceable CAN and sensor data, used rugged edge connectivity and separated acquisition, transport and server responsibilities.',
    ],
    toolsNote:
      'Custom PCB design, CAN capture and trace, GPS or GNSS, sensor interfacing, MikroTik and Linux. Data capture and transfer protocols are kept generic because the exact protocols are not public evidence.',
    validation:
      'I validated the device, CAN, location, sensor, connectivity and server paths end to end during deployment and the ongoing field trial.',
    outcome:
      'I delivered a working trial system that provides available location and condition information to support maintenance preparation before a return to the asset.',
    evidenceNote: 'I present this as a Delivered professional system in an active field trial.',
    demonstrates:
      'This demonstrates my end-to-end ownership across electronics, PCB design, embedded and vehicle interfaces, communications, Linux integration, deployment and field validation.',
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
      'I developed embedded hardware and firmware for movement assessment support and validated it against clinical references.',
    role: 'TODO: Saj to supply.',
    period: null, // TODO: Saj to supply.
    domain: 'Embedded and sensing',
    disciplines: ['Embedded', 'Electronics', 'Mechanical'],
    stack: ['ESP32', 'IMU', 'ToF', 'Hall effect', 'magnetometer', 'MATLAB'],
    problem:
      'Movement and coordination assessment benefits from repeatable, sensor-based measurement rather than observation alone.',
    context:
      'I completed this as my final-year Honours capstone for the Bachelor of Mechatronics Engineering at Deakin University, graduating with Distinction.',
    approach: [
      'ESP32-based sensing hardware with IMU, time-of-flight, Hall-effect and magnetometer sensors, real-time firmware for signal acquisition, and MATLAB data logging and analysis.',
      'I chose complementary sensor modalities so movement features are captured redundantly; designed the firmware around deterministic real-time acquisition; kept analysis offline in MATLAB where clinical comparison is easier to audit.',
    ],
    toolsNote:
      'ESP32, IMU, ToF, Hall-effect and magnetometer sensing, embedded C and C++, real-time signal acquisition, MATLAB data logging and signal processing.',
    validation:
      'I validated measurements against clinical references, checking that captured motion signals were repeatable and comparable.',
    outcome:
      'I delivered a proof-of-concept measurement platform supporting repeatable motion and coordination assessment.',
    evidenceNote:
      'I present this as a Delivered, assessed Honours capstone and a clinical research support concept, not a certified medical device.',
    demonstrates:
      'This demonstrates how I apply embedded hardware, firmware and measurement rigour to a safety-relevant sensing problem, with honest validation against references.',
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
      'I built a real-time factory digital twin concept integrating AI agents, anomaly detection, predictive maintenance and OEE analytics.',
    role: 'TODO: Saj to supply.',
    period: null, // TODO: Saj to supply.
    domain: 'AI/ML and automation',
    disciplines: ['AI/ML', 'Automation', 'Manufacturing'],
    stack: ['Python', 'anomaly detection', 'OEE analytics', 'dashboards'],
    problem:
      'Factories benefit from a live, model-based view of equipment so faults are caught early and throughput and quality stay stable.',
    context:
      'I developed this personal engineering concept to mirror a production line in software. I drew on my smart-factory delivery experience, but I do not present it as a deployment in a live plant.',
    approach: [
      'Process and equipment state modelling, simulated telemetry generation, an analytics and ML layer for anomaly detection and predictive maintenance, and dashboard visualisation with OEE reporting.',
      'I modelled equipment states explicitly rather than learning them blind, so anomalies map to physical causes; kept the analytics layer separate from the twin so detection logic can be swapped; reported OEE the way production teams actually read it.',
    ],
    toolsNote:
      'Python, anomaly detection and predictive-maintenance logic, AI agents, OEE analytics, dashboard visualisation.',
    validation:
      'I exercised it against simulated fault and drift scenarios to confirm that anomalies were surfaced, maintenance needs were flagged and OEE responded correctly. I classify this as concept-level validation only.',
    outcome:
      'I delivered a working demonstration that surfaces anomalies, flags maintenance needs and reports OEE in real time.',
    evidenceNote:
      'I present this as Hands-on personal project evidence and deliberately do not claim it as a production deployment.',
    demonstrates:
      'This demonstrates how I bridge plant-floor automation experience and applied AI/ML by understanding what a factory needs from its data before modelling it.',
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
      'I built six years of experience across food and beverage, carbon-fibre and structural-steel production, spanning operations, QA, traceability, robotic automation and commissioning.',
    role: 'TODO: Saj to supply.',
    period: '2018 to 2024',
    domain: 'Manufacturing and quality',
    disciplines: ['Manufacturing', 'Mechanical'],
    stack: ['IDL', 'Carbon Revolution', 'Thornton Engineering'],
    problem:
      'Automation, validation and commissioning engineers are only as good as their understanding of how production floors, operators and quality systems actually behave.',
    context:
      'I completed six years of production and quality work from 2018 to 2024 at IDL, Carbon Revolution and Thornton Engineering Australia Pty Ltd while undertaking formal engineering study.',
    approach: [
      'High-throughput packaged beverage production lines, a carbon-fibre rim layup line moving onto KUKA-based robotic cells, and standards-driven structural-steel and pressure-vessel fabrication, each with its own quality, traceability and documentation system.',
      'I progressed deliberately from operating machines to leading lines and owning quality workflows; treated changeovers, first-response fixes and inspection evidence as engineering problems, not chores; learned the paperwork that makes production defensible: ITPs, MDRs, traceability records and QA sign-off.',
    ],
    toolsNote:
      'Canning, bottling and kegging lines, WestRock and Fibre King packaging equipment, KUKA-based automated rim layup, NDE and mechanical testing exposure, ITP and MDR documentation, drawing review, KPI tracking, Lean practice.',
    validation:
      'I validated my work through daily production KPIs, QA checks, inspection evidence and documented sign-off. This included installation and commissioning support for WestRock and Fibre King equipment during a canning line upgrade, plus hands-on involvement as KUKA-based robotic cells replaced a legacy rim layup machine.',
    outcome:
      'I developed a working production and quality instinct across line recovery, changeover logic, operator empathy and audit-ready documentation.',
    evidenceNote:
      'I present this as Delivered professional employment across three manufacturers. My detailed role records are in the Experience section.',
    demonstrates:
      'This is the foundation under my later engineering delivery: I have run the line, fixed the jam and signed the QA record.',
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
      'I worked hands-on through the automation programme that replaced the legacy automated rim layup machine with new KUKA-based robotic cells.',
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
      'I worked in advanced carbon-fibre automotive wheel manufacturing at Carbon Revolution. I was hands-on through the automation programme that replaced the legacy automated rim layup machine with new KUKA-based robotic cells, while moving from layup operation towards quality assurance and development support.',
    approach: [
      'KUKA robotic cells for automated rim layup and robotic demoulding of tooling that runs hot and heavy, feeding the downstream composite cure, machining, NDE and mechanical-test flow, each with its own quality and traceability checks.',
      'I treated the change as a systems problem, not a machine swap: moving hot, heavy tooling handling onto robots to take it off operators, and leaning on trials, first-off checks and defect inspection to prove the robotic cell held layup repeatability before the line was allowed to ramp.',
    ],
    toolsNote:
      'KUKA robotic cells, automated rim layup, robotic demoulding, carbon-fibre composite production, NDE and mechanical testing, production quality and defect-inspection systems.',
    validation:
      'I supported trials, first-off and in-process quality checks, defect inspection, changeover and line recovery as the KUKA line was commissioned and ramped into production. My contribution was hands-on involvement and support, not ownership of the robot-cell design or programming.',
    outcome:
      'I developed a hands-on, floor-level understanding of moving a production line onto industrial robotics, including what changes for operators, quality and throughput when robots take over layup and demoulding.',
    evidenceNote:
      'I present this as Hands-on professional employment evidence. I supported the automation transition and do not claim ownership of the KUKA cell design or programming.',
    demonstrates:
      'This demonstrates my real industrial robotics exposure beneath the ROS 2 and controls work in this portfolio: robotics on a factory floor, where safety, repeatability and ramp matter as much as kinematics.',
    evidenceTier: 'hands-on',
    category: 'Professional foundation',
    featured: false,
  },
  {
    slug: 'idl-canning-line',
    title: 'IDL: Canning Line Upgrade and Commissioning',
    summary:
      'I supported hands-on installation and commissioning of WestRock and Fibre King packaging equipment during a canning line upgrade on a live production site.',
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
      'I worked across five food and beverage manufacturing lines at IDL: two canning, two bottling and one kegging. I supported hands-on installation and commissioning of WestRock and Fibre King packaging equipment during a canning line upgrade, while progressing from line work into team lead, line support and cellar operations.',
    approach: [
      'High-throughput packaging lines with fillers, seamers and conveyors, the WestRock and Fibre King equipment added for the canning line upgrade, and the upstream cellar processes that turn raw product into a finished, packaged beverage.',
      "Treated changeovers, first-response fixes and run recovery as engineering problems rather than chores; supported install and commissioning so the new equipment held rate and quality; learned the line from the operator's side to see how a small mechanical or control fault costs throughput.",
    ],
    toolsNote:
      'Canning, bottling and kegging lines, WestRock and Fibre King packaging equipment, changeover and KPI tracking, quality checks and first-response machine fixes.',
    validation:
      'I used daily production KPIs, quality checks, first-response fixes and installation and commissioning checks as new equipment was brought up to rate on the canning line.',
    outcome:
      'I developed a packaging-automation and commissioning instinct: install it, prove it, recover it and hold rate on a live, high-throughput line.',
    evidenceNote:
      'I present this as Delivered and Hands-on professional employment evidence across installation and commissioning support, production operations and quality.',
    demonstrates:
      'This demonstrates my operator and commissioning perspective on automation: why usability, changeover design, line recovery and traceable QA matter, and how they feed into controls, commissioning and smart-factory work.',
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

/**
 * What may be advertised. Suppressed records still build and still resolve
 * at their own URL; they are simply never linked or listed. Every discovery
 * surface reads this list, never `publishedProjects`, so a new surface
 * cannot reintroduce a suppressed record by accident.
 */
export const discoverableProjects: readonly Project[] = publishedProjects.filter(
  (p) => !p.suppressed,
)
