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
  readonly mobileAspectRatio?: string
}

export interface ProjectLink {
  readonly label: string
  readonly url: string
}

export interface Project {
  readonly slug: string
  readonly title: string
  readonly summary: string
  /**
   * Null where Saj has not supplied one.
   *
   * This was a bare `string` carrying the literal `'TODO: Saj to supply.'`.
   * The detail route guarded that placeholder out of the visible page, but
   * `WorkArchive` is a client component, so every field of every discoverable
   * record serialises into the RSC flight payload regardless of what is
   * painted, and the editorial marker shipped inside the public HTML and
   * index.txt. Null cannot leak a sentence, so the type carries the absence
   * instead, exactly as `period` already does.
   */
  readonly role: string | null
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
    role: null, // TODO: Saj to supply.
    period: null, // TODO: Saj to supply.
    domain: 'Software and engineering tools',
    disciplines: ['Software', 'Automation'],
    stack: ['React', 'TypeScript', 'Three.js', 'Vite', 'Tauri 2', 'Rust', 'Vitest'],
    problem:
      'Engineering learning, calculation, CAD, simulation, skills tracking and evidence workflows are often fragmented across disconnected tools and notes.',
    context:
      'I developed this personal open-source engineering application and deployed it through GitHub Pages. A shared React and TypeScript interface supports the browser application and an optional Tauri 2 desktop shell.',
    approach: [
      'I built a React and TypeScript frontend with Vite and HashRouter for GitHub Pages, TypeScript calculation and simulation engines, a bounded Three.js parametric CAD layer, browser-local storage, and a controlled Tauri and Rust boundary for authorised local workspaces, external tools and evidence capture.',
      'I kept the browser experience local-first with no required account, backend or telemetry. Exposed governing assumptions and validation warnings instead of hiding engineering limits. Implemented bounded parametric templates rather than presenting a simplified modeller as general CAD. Kept desktop filesystem and process authority behind an allow-listed Rust boundary with workspace containment and deterministic evidence handling.',
    ],
    toolsNote:
      'React 18, TypeScript, Vite 8, React Router 6, Three.js, Vitest, Tauri 2, Rust, GitHub Actions, optional ngspice and KiCad CLI integration.',
    validation:
      'I validated it with automated Vitest suites, TypeScript checks, production builds, GitHub Actions gates and rendered inspection of the deployed dashboard, toolbox, CAD and workbench routes. I do not claim engineering-standards certification.',
    outcome:
      'I delivered a working public web application with a browser-first engineering toolbox, bounded parametric CAD, a guided learning system, an evidence-focused project workflow and a desktop-capable source architecture.',
    evidenceNote:
      'I built and tested version 0.2.0 as a functional completion candidate, with a public application and source repository. It is not certified engineering software.',
    demonstrates:
      'I integrated engineering logic, simulation, CAD geometry, software architecture, security boundaries, validation and accessible product design into one coherent system.',
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
    /**
     * Owner-attested record supplied by Saj as project owner.
     *
     * The case study presents confirmed system-level architecture and avoids
     * unverified model, hardware and performance specifics.
     */
    slug: 'veerai-slm',
    title: 'VeerAI: Local SLM System',
    summary:
      'VeerAI is my completed local AI system for turning approved personal and engineering knowledge into grounded, usable responses. I designed it as a modular compound system around local open-weight inference, governed knowledge ingestion, retrieval-augmented generation, controlled memory, tools and evaluation.',
    role: 'System architect and sole implementer',
    period: null, // TODO: Saj to supply.
    domain: 'AI/ML and local inference',
    disciplines: ['AI/ML', 'Software', 'Validation'],
    stack: [
      'Local open-weight inference',
      'Retrieval-augmented generation',
      'Governed ingestion',
      'Controlled memory',
      'Tool interfaces',
      'Evaluation harness',
    ],
    problem:
      'General-purpose language models do not automatically understand personal and engineering context, preserve source grounding or operate within controlled local data boundaries. VeerAI addresses this through local inference and an explicitly governed knowledge architecture.',
    context:
      'I built VeerAI as a local AI system that runs on my own hardware and works with approved personal and engineering knowledge. I focused the project on system integration: combining local open-weight inference, governed ingestion, retrieval, memory, tools and evaluation into an architecture I control end to end.',
    approach: [
      'I designed the system around local open-weight inference, with approved-source ingestion, retrieval, context assembly, memory and tool execution separated into modular services with controlled interfaces.',
      'I made evaluation part of the architecture so retrieval quality, response grounding, memory boundaries and tool behaviour can be assessed throughout the workflow. Modular interfaces allow inference, retrieval, memory and tooling to evolve independently.',
    ],
    toolsNote:
      'Local open-weight inference, retrieval-augmented generation, governed knowledge ingestion, controlled memory, tool interfaces and evaluation workflows, integrated as independently maintainable parts of one local system.',
    validation:
      'I used the evaluation harness to assess retrieval quality, response grounding, memory and tool boundaries, edge-case handling and runtime resilience across the end-to-end workflow.',
    outcome:
      'I delivered a modular local AI system that grounds responses in approved personal and engineering knowledge while keeping inference, retrieval, memory, tools and evaluation independently maintainable.',
    evidenceNote:
      '',
    demonstrates:
      'I engineered the system across local open-weight inference, retrieval-augmented generation, governed ingestion, modular orchestration, controlled memory, tool integration and evaluation.',
    evidenceTier: 'delivered',
    category: 'Personal AI/ML build',
    images: [
      {
        src: '/assets/image/20260802-VeerAI-SLM-Project-Visual-Rev00.png',
        alt: 'Conceptual visual of the VeerAI system: scattered approved-knowledge inputs converging on a layered local core, with a smaller ordered set of outputs resolving into a written grounded response.',
        width: 1672,
        height: 941,
        displayMode: 'contain',
        aspectRatio: '1672 / 941',
        background: 'light',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    homeExcerpt: {
      ownership:
        'I owned the system architecture, governed knowledge pipeline, retrieval workflow, orchestration layer and validation structure.',
      outcome:
        'A modular local AI foundation that grounds responses in approved knowledge while keeping inference, retrieval, memory, tools and evaluation independently maintainable.',
    },
    featured: true,
  },
  {
    slug: 'autonomous-navigation-rover',
    title: 'Autonomous Navigation Rover on ROS 2',
    summary:
      'I built a complete ROS 2 Humble autonomy stack with LiDAR SLAM, A* planning, Kalman and EKF estimation and IMU-odometry fusion, then validated it in simulation for repeatable obstacle-aware navigation.',
    role: null, // TODO: Saj to supply.
    period: null, // TODO: Saj to supply.
    domain: 'Robotics and autonomy',
    disciplines: ['Robotics', 'Control', 'Embedded', 'AI/ML'],
    stack: ['ROS 2 Humble', 'Nav2', 'Gazebo', 'RViz', 'SLAM', 'Kalman and EKF'],
    problem:
      'Autonomous systems need reliable localisation, mapping and obstacle-aware navigation before any of the higher-level behaviour matters.',
    context:
      'I developed this personal robotics system end to end, using simulation to test decisions before physical implementation.',
    approach: [
      'I structured sensing, LiDAR SLAM, Kalman and EKF state estimation, odometry and IMU fusion, A* and Nav2 planning, motion control, simulation and visualisation as modular ROS 2 nodes.',
      'I built on ROS 2 Humble for a maintained long-term base; kept perception, estimation, planning and control as separate nodes so each layer could be tuned and validated independently; used simulation-first validation before physical trials.',
    ],
    toolsNote:
      'ROS 2 Humble, Nav2, Gazebo, RViz, SLAM toolboxes, A* path planning, Kalman and EKF filters, LiDAR, IMU and odometry fusion, PID tuning.',
    validation:
      'I ran repeated Gazebo simulations and used RViz to inspect maps, transforms and planned paths, checking localisation stability and obstacle avoidance across reruns.',
    outcome:
      'I delivered a working end-to-end autonomy stack with repeatable localisation and obstacle-aware navigation behaviour.',
    evidenceNote:
      'I built and tested the complete autonomy stack as a personal project in simulation. It is not evidence of a deployed production fleet.',
    demonstrates:
      'I integrated and validated perception, state estimation, planning and control as one autonomy stack.',
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
    role: 'Automation & Controls Engineer',
    period: 'Jan 2026 to Jun 2026',
    domain: 'Automation and SCADA',
    disciplines: ['Control', 'Automation', 'Manufacturing'],
    stack: ['Siemens TIA Portal', 'WinCC', 'PCS 7', 'iFIX', 'PVI+'],
    problem:
      'Regulated production needs traceability, diagnostics and process visibility without disturbing validated behaviour.',
    context:
      'I delivered this work at JAG Process Solutions Pty Ltd for pharmaceutical, biotech and food clients under GMP, across plants, skids and packaged units.',
    approach: [
      'I integrated field devices and instrumentation with control logic, HMI and SCADA, MES and batch execution, and production data flows, including an iFIX to PVI+ migration.',
      'I converted SCADA application content methodically and verified functional behaviour against the existing validated system rather than trusting the conversion; prioritised diagnostics, operator usability and data integrity in every interface decision.',
    ],
    toolsNote:
      'Siemens TIA Portal, WinCC, PCS 7, iFIX, PVI+, PLC logic (IEC 61131-3), MES and batch systems, Modbus and Profinet, GMP and GAMP 5 practice.',
    validation:
      'I executed FAT and SAT activities and produced commissioning, qualification and handover documentation, verifying migrated behaviour against the validated system.',
    outcome:
      'I delivered control, integration and smart-factory engineering with clearer process visibility, trends, alarms and defensible documentation.',
    evidenceNote: 'I delivered this work in regulated manufacturing environments.',
    demonstrates:
      'I migrated and integrated supervisory systems where validation evidence mattered as much as functional behaviour.',
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
      'I used test instrumentation and data-acquisition systems, followed controlled procedures, and maintained QA and regulatory documentation for certification and audit work.',
      'I treated calibration discipline and procedure fidelity as first-class engineering tasks, because the defensibility of the final report depends on them; analysed data for deviations and trends before results left the building.',
    ],
    toolsNote:
      'Emissions test equipment, instrumentation, data-acquisition systems, ADR and EURO test procedures, QA records.',
    validation:
      'I followed repeatable standard procedures, calibrated and cross-checked instrumentation, and produced auditable and technically defensible results.',
    outcome:
      'I delivered defensible compliance results and structured reporting supporting certification and audit outcomes.',
    evidenceNote: 'I delivered this work in a professional testing environment.',
    demonstrates:
      'I applied measurement discipline, traceable documentation and evidence-based fault interpretation in a regulated testing environment.',
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
      'I integrated agricultural-equipment CAN capture, a custom PCB, GPS or GNSS positioning, condition sensing, MikroTik edge connectivity and a Linux server for remote status collection.',
      'I consolidated field interfaces on a purpose-built board, preserved traceable CAN and sensor data, used rugged edge connectivity and separated acquisition, transport and server responsibilities.',
    ],
    toolsNote:
      'Custom PCB design, CAN capture and trace, GPS or GNSS, sensor interfacing, MikroTik networking and Linux server integration.',
    validation:
      'I validated the device, CAN, location, sensor, connectivity and server paths end to end during deployment and the ongoing field trial.',
    outcome:
      'I delivered a working trial system that provides available location and condition information to support maintenance preparation before a return to the asset.',
    evidenceNote: 'I delivered the system for an active professional field trial.',
    demonstrates:
      'I owned the engineering path from electronics and PCB design through equipment interfaces, communications, Linux integration, deployment and field validation.',
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
    role: null, // TODO: Saj to supply.
    period: null, // TODO: Saj to supply.
    domain: 'Embedded and sensing',
    disciplines: ['Embedded', 'Electronics', 'Mechanical'],
    stack: ['ESP32', 'IMU', 'ToF', 'Hall effect', 'magnetometer', 'MATLAB'],
    problem:
      'Movement and coordination assessment benefits from repeatable, sensor-based measurement rather than observation alone.',
    context:
      'I completed this as my final-year Honours capstone for the Bachelor of Mechatronics Engineering at Deakin University, graduating with Distinction.',
    approach: [
      'I built ESP32 sensing hardware around IMU, time-of-flight, Hall-effect and magnetometer inputs, with real-time firmware and MATLAB data logging and analysis.',
      'I chose complementary sensor modalities so movement features are captured redundantly; designed the firmware around deterministic real-time acquisition; kept analysis offline in MATLAB where clinical comparison is easier to audit.',
    ],
    toolsNote:
      'ESP32, IMU, ToF, Hall-effect and magnetometer sensing, embedded C and C++, real-time signal acquisition, MATLAB data logging and signal processing.',
    validation:
      'I validated measurements against clinical references, checking that captured motion signals were repeatable and comparable.',
    outcome:
      'I delivered a proof-of-concept measurement platform supporting repeatable motion and coordination assessment.',
    evidenceNote:
      'I completed and submitted this as an assessed Honours capstone and research-support concept. It is not a certified medical device.',
    demonstrates:
      'I applied embedded hardware, real-time firmware and measurement discipline to a safety-relevant sensing problem, using clinical references as the validation basis.',
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
    role: null, // TODO: Saj to supply.
    period: null, // TODO: Saj to supply.
    domain: 'AI/ML and automation',
    disciplines: ['AI/ML', 'Automation', 'Manufacturing'],
    stack: ['Python', 'anomaly detection', 'OEE analytics', 'dashboards'],
    problem:
      'Factories benefit from a live, model-based view of equipment so faults are caught early and throughput and quality stay stable.',
    context:
      'I developed this personal engineering concept to model a production line in software, drawing on my smart-factory delivery experience.',
    approach: [
      'I modelled process and equipment states, generated simulated telemetry, added analytics and ML for anomaly detection and predictive maintenance, and visualised OEE in a dashboard.',
      'I modelled equipment states explicitly rather than learning them blind, so anomalies map to physical causes; kept the analytics layer separate from the twin so detection logic can be swapped; reported OEE the way production teams actually read it.',
    ],
    toolsNote:
      'Python, anomaly detection and predictive-maintenance logic, AI agents, OEE analytics, dashboard visualisation.',
    validation:
      'I exercised the concept against simulated fault and drift scenarios, checking anomaly detection, maintenance flags and OEE calculations.',
    outcome:
      'I delivered a working demonstration that surfaces anomalies, flags maintenance needs and reports OEE in real time.',
    evidenceNote:
      'I built and tested this as a hands-on personal concept using simulated data, not as a live production deployment.',
    demonstrates:
      'I connected plant-floor automation needs with applied AI/ML by defining the physical process and operational signals before modelling them.',
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
    role: null, // TODO: Saj to supply.
    period: '2018 to 2024',
    domain: 'Manufacturing and quality',
    disciplines: ['Manufacturing', 'Mechanical'],
    stack: ['IDL', 'Carbon Revolution', 'Thornton Engineering'],
    problem:
      'Effective automation, validation and commissioning depend on understanding how production floors, operators and quality systems behave in practice.',
    context:
      'I completed six years of production and quality work from 2018 to 2024 at IDL, Carbon Revolution and Thornton Engineering Australia Pty Ltd while undertaking formal engineering study.',
    approach: [
      'I worked across high-throughput beverage lines, carbon-fibre rim layup moving onto KUKA robotic cells, and standards-driven structural-steel and pressure-vessel fabrication.',
      /* "leading lines" removed: it restated the unverified line-lead
         progression that Rev01 and Rev02 both required to stay unpublished.
         Owning quality workflows is Thornton evidence and stays. */
      'I progressed deliberately from operating machines to owning quality workflows; treated changeovers, first-response fixes and inspection evidence as engineering problems, not chores; learned the paperwork that makes production defensible: ITPs, MDRs, traceability records and QA sign-off.',
    ],
    toolsNote:
      'Canning, bottling and kegging lines, WestRock and Fibre King packaging equipment, KUKA-based automated rim layup, NDE and mechanical testing exposure, ITP and MDR documentation, drawing review, KPI tracking, Lean practice.',
    validation:
      'I validated my work through daily production KPIs, QA checks, inspection evidence and documented sign-off. This included installation and commissioning support for WestRock and Fibre King equipment during a canning line upgrade, plus hands-on involvement as KUKA-based robotic cells replaced a legacy rim layup machine.',
    outcome:
      'I developed a working production and quality instinct across line recovery, changeover logic, operator empathy and audit-ready documentation.',
    evidenceNote:
      'I built this foundation through six years of professional production, quality and commissioning work across three manufacturers.',
    demonstrates:
      'This experience gave me the operator, troubleshooting and quality perspective that now informs my engineering decisions.',
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
    role: 'Production and quality role',
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
      'I worked across production, quality assurance and development support in advanced carbon-fibre automotive wheel manufacturing at Carbon Revolution. I was hands-on through the automation programme that replaced the legacy automated rim layup machine with new KUKA-based robotic cells.',
    approach: [
      'I worked with KUKA robotic cells used for automated rim layup and demoulding, alongside downstream cure, machining, NDE, mechanical testing and traceability processes.',
      'I treated the change as a systems problem, not a machine swap: moving hot, heavy tooling handling onto robots to take it off operators, and leaning on trials, first-off checks and defect inspection to prove the robotic cell held layup repeatability before the line was allowed to ramp.',
    ],
    toolsNote:
      'KUKA robotic cells, automated rim layup, robotic demoulding, carbon-fibre composite production, NDE and mechanical testing, production quality and defect-inspection systems.',
    validation:
      'I supported trials, first-off and in-process quality checks, defect inspection, changeover and line recovery as the KUKA line was commissioned and ramped into production. My contribution was hands-on involvement and support, not ownership of the robot-cell design or programming.',
    outcome:
      'I developed a hands-on, floor-level understanding of moving a production line onto industrial robotics, including what changes for operators, quality and throughput when robots take over layup and demoulding.',
    evidenceNote:
      'I supported the automation transition through trials, quality checks, changeovers and line recovery. I did not design or program the robot cells.',
    demonstrates:
      'I gained hands-on industrial robotics experience in a production environment where safety, repeatability, quality and ramp-up mattered as much as robot motion.',
    evidenceTier: 'hands-on',
    category: 'Professional foundation',
    featured: false,
  },
  {
    slug: 'idl-canning-line',
    title: 'IDL: Canning Line Upgrade and Commissioning',
    summary:
      'I supported hands-on installation and commissioning of WestRock and Fibre King packaging equipment during a canning line upgrade on a live production site.',
    /* The role line carried an unverified progression title, and the context
       and approach below carried the trade descriptor that goes with it.
       Both trace to third-party aggregator records rather than to anything
       Saj has confirmed, and Rev01 and Rev02 both required them to stay
       unpublished. They were published here anyway. The title is reduced to
       the neutral descriptor `employers.ts` already carries for IDL; see the
       TODO CONFIRM list on that record for exactly what was removed. */
    role: 'Beverage production role',
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
      'I worked across five food and beverage manufacturing lines at IDL: two canning, two bottling and one kegging. I supported hands-on installation and commissioning of WestRock and Fibre King packaging equipment during a canning line upgrade.',
    approach: [
      'I worked across high-throughput fillers, seamers and conveyors, and supported the WestRock and Fibre King equipment added during the canning-line upgrade.',
      "Treated changeovers, first-response fixes and run recovery as engineering problems rather than chores; supported install and commissioning so the new equipment held rate and quality; learned the line from the operator's side to see how a small mechanical or control fault costs throughput.",
    ],
    toolsNote:
      'Canning, bottling and kegging lines, WestRock and Fibre King packaging equipment, changeover and KPI tracking, quality checks and first-response machine fixes.',
    validation:
      'I used daily production KPIs, quality checks, first-response fixes and installation and commissioning checks as new equipment was brought up to rate on the canning line.',
    outcome:
      'I developed a packaging-automation and commissioning instinct: install it, prove it, recover it and hold rate on a live, high-throughput line.',
    evidenceNote:
      'I supported installation and commissioning while also working across production operations and quality.',
    demonstrates:
      'I learned how usability, changeover design, line recovery and traceable QA affect automation and commissioning from an operator perspective.',
    evidenceTier: 'delivered',
    category: 'Professional foundation',
    featured: false,
  },
  {
    slug: 'ndcc-website',
    title: 'Newcomb and District Cricket Club Digital Platform',
    summary:
      'I designed, built and run the official NDCC digital platform, combining the public club website with committee content, membership, merchandise, gallery, sponsor and administration workflows.',
    role: 'Full-stack developer and platform administrator',
    period: '2026',
    domain: 'Full-stack software and community operations',
    disciplines: ['Software', 'Automation', 'Validation'],
    stack: [
      'Next.js 14',
      'TypeScript',
      'React',
      'Tailwind CSS',
      'Supabase Postgres',
      'PlayHQ API',
      'Resend',
      'Vercel',
    ],
    problem:
      'The club needed one reliable digital platform for current public information and committee workflows, without forcing volunteers to maintain the same content across disconnected pages, files and services.',
    context:
      'I built and operate this production community platform for Newcomb and District Cricket Club. It is live at ndcc.com.au and supports public club information, fixtures, teams, news, events, facilities, membership, merchandise, sponsors, gallery, fantasy cricket and committee administration.',
    approach: [
      'I structured the system as a Next.js App Router application with accessible public routes, protected committee administration and Supabase Postgres as the governed source for mutable club content.',
      'I integrated PlayHQ as the fixture source, Resend-ready transactional email, manual order and payment reconciliation, GitHub-backed single-image publishing, Supabase Storage for bulk gallery media and Vercel deployment. Server-only credentials remain outside the browser, and live CMS reads use dynamic no-store delivery so successful empty results are never replaced with stale seed content.',
    ],
    toolsNote:
      'Next.js 14, TypeScript, React, Tailwind CSS, Supabase Postgres and Storage, custom committee authentication, PlayHQ Public API, Resend, Vercel, GitHub media publishing, route and content smoke tests.',
    validation:
      'I validate the codebase with lint and production builds, route and content smoke tests, public-site audits, asset checks, migration and schema tests, and live inspection. Credential-dependent email, authentication and external-service checks remain separate so an untested integration is never presented as passing.',
    outcome:
      'I delivered and continue to operate a live club platform spanning public information, fixtures, events, news, teams, facilities, membership, merchandise, sponsors, gallery, volunteering, contact, fantasy cricket and committee administration.',
    evidenceNote:
      'Delivered evidence includes the live production website and public source repository. Payment and email paths are described at their verified implementation state and are not claimed as live unless tested in the target environment.',
    demonstrates:
      'I translated community operations into a maintained full-stack product covering information architecture, data modelling, authentication, integrations, media, administration, deployment and validation.',
    evidenceTier: 'delivered',
    category: 'Community digital platform',
    links: [
      { label: 'Open live website', url: 'https://www.ndcc.com.au/' },
      { label: 'View source', url: 'https://github.com/Sajeevanveeriah/ndcc-website' },
    ],
    images: [
      {
        src: '/assets/image/20260803-NDCC-Website-Platform-Rev00.svg',
        mobileSrc: '/assets/image/20260803-NDCC-Website-Platform-Mobile-Rev00.svg',
        alt: 'Architecture of the NDCC digital platform, connecting the public club website and committee CMS through a Next.js application core to Supabase data and operational integrations.',
        width: 1435,
        height: 660,
        displayMode: 'contain',
        aspectRatio: '1435 / 660',
        mobileAspectRatio: '660 / 960',
        background: 'light',
        sizes: '(max-width: 767px) 100vw, 1200px',
      },
    ],
    featured: false,
  },] as const

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

/** A record renders only when it has a published evidence tier. */
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
