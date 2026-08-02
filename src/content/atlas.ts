import type { EvidenceTier } from './tiers'

/**
 * The Engineering Atlas: 19 capability domains.
 *
 * This is the deepest written content on the site. Every field below is
 * transcribed verbatim from the previous index.html (lines 611 to 897).
 * Nothing is cut, compressed, summarised or paraphrased.
 *
 * evidenceTier is ported from the explicit data-tier attribute Saj set on
 * each entry. `cluster` is the old data-cluster attribute and `contexts` the
 * old data-context attribute; both drive filtering exactly as before.
 * systemsLayers is derived from cluster, reproducing the old behaviour where
 * selecting a Systems Stack layer pre-filtered the Atlas by cluster.
 *
 * Inline cross-reference links in the source prose are preserved as prose
 * (the words are unchanged) and surfaced structurally via relatedProjects.
 */

export type AtlasCluster =
  | 'systems'
  | 'physical'
  | 'embedded'
  | 'controls'
  | 'software'
  | 'sectors'
  | 'assurance'

export type DeliveryContext = 'professional' | 'project' | 'personal' | 'study'

export const CLUSTER_LABEL: Record<AtlasCluster, string> = {
  systems: 'Systems engineering',
  physical: 'Physical systems',
  embedded: 'Embedded and electronics',
  controls: 'Controls and robotics',
  software: 'Software and intelligence',
  sectors: 'Sectors',
  assurance: 'Assurance and delivery',
}

export const CONTEXT_LABEL: Record<DeliveryContext, string> = {
  professional: 'Professional delivery',
  project: 'University and team projects',
  personal: 'Personal builds',
  study: 'Study and coursework',
}

export interface AtlasDomain {
  readonly slug: string
  readonly name: string
  readonly summary: string
  readonly cluster: AtlasCluster
  readonly contexts: readonly DeliveryContext[]
  readonly evidenceTier: EvidenceTier
  readonly subdomains: readonly string[]
  /** The old "Tools and software" field. */
  readonly platforms: readonly string[]
  readonly protocols?: readonly string[]
  readonly projectProof: string
  readonly experienceProof: string
  readonly transferableLogic: string
  readonly growthTargets: readonly string[]
  readonly relatedProjects: readonly string[]
}

export const atlas: readonly AtlasDomain[] = [
  {
    slug: 'mechatronics-and-systems-engineering',
    name: 'Mechatronics and Systems Engineering',
    summary:
      'The home discipline: integrating mechanical, electrical, embedded, control and software layers into one working system, then proving it with structured test and documentation.',
    cluster: 'systems',
    contexts: ['professional', 'project', 'study'],
    evidenceTier: 'delivered',
    subdomains: [
      'System architecture and decomposition',
      'Requirements to acceptance mapping',
      'Electromechanical integration',
      'Interface definition between layers',
      'Trade-off analysis across disciplines',
    ],
    platforms: [
      'Block and signal-flow modelling',
      'MATLAB and Simulink',
      'FMEA',
      'FAT and SAT structures',
      'Engineering documentation',
    ],
    projectProof:
      'The ROS 2 rover and clinical capstone both required whole-stack integration from sensing to validated behaviour.',
    experienceProof:
      'Bachelor of Mechatronics Engineering (Honours, Distinction), Deakin University. Integrated deliveries at JAG Process Solutions and DuxTel spanning field devices, control logic, data flows and handover.',
    transferableLogic:
      'I use system decomposition to locate faults and requirements at the correct engineering layer before choosing a solution.',
    growthTargets: ['Model-based systems engineering (SysML)'],
    relatedProjects: ['autonomous-navigation-rover', 'ataxia-assessment-device'],
  },
  {
    slug: 'mechanical-design-materials-and-thermofluids',
    name: 'Mechanical Design, Materials and Thermofluids',
    summary:
      'Hands-on CAD, mechanism and part design for mechatronic assemblies, backed by degree-level materials, thermodynamics and fluid mechanics coursework.',
    cluster: 'physical',
    contexts: ['professional', 'project', 'study'],
    evidenceTier: 'hands-on',
    subdomains: [
      'Part and assembly modelling',
      'Mechanism design',
      'Engineering drawings and GD&T',
      '3D printing and prototyping',
      'Materials selection (Working knowledge)',
      'Thermodynamics and fluid mechanics (Working knowledge)',
      'FEA (Working knowledge)',
    ],
    platforms: [
      'SolidWorks',
      'Fusion 360',
      'GD&T',
      'FDM 3D printing',
      'Pneumatics and hydraulics basics',
    ],
    projectProof:
      'Mechanical design and CAD across university projects, the Deakin Mars Rover Team and the ESP32 capstone hardware.',
    experienceProof:
      'Drawing review and fabrication QA in structural-steel and carbon-fibre manufacturing roles, including pressure-vessel CAD designs at Thornton Engineering that progressed into fabrication.',
    transferableLogic:
      'Mechanism, tolerance and load thinking carries into robot hardware, fixtures, panels and production tooling.',
    growthTargets: ['Design for manufacture at production scale', 'Formal FEA validation workflows'],
    relatedProjects: ['ataxia-assessment-device'],
  },
  {
    slug: 'electrical-systems-and-power',
    name: 'Electrical Systems and Power',
    summary:
      'Practical motor control, drives, panel wiring and instrumentation power in industrial settings, with machine and power theory from formal study.',
    cluster: 'physical',
    contexts: ['professional', 'study'],
    evidenceTier: 'hands-on',
    subdomains: [
      'VFDs and motor drives',
      'Control panel and schematic literacy',
      'Instrumentation wiring and loop checks',
      'Signal and power segregation',
      'Electrical machines theory (Working knowledge)',
      'Power systems and distribution (Working knowledge)',
    ],
    platforms: [
      'VFD commissioning',
      'Control schematics',
      'Multimeter and loop testing',
      'Instrumentation datasheets',
    ],
    projectProof: 'Motor, drive and actuator integration in robotics and capstone builds.',
    experienceProof:
      'Integrated field devices, sensors and drives with control logic at JAG Process Solutions. Motor and drive fundamentals from the mechatronics degree and HND.',
    transferableLogic:
      'Reading a schematic and tracing a loop is the same discipline whether the cabinet runs a plant, a rig or a robot.',
    growthTargets: ['Switchboard and panel design ownership', 'AS/NZS 3000 wiring rules literacy'],
    relatedProjects: ['jag-smart-factory'],
  },
  {
    slug: 'electronics-pcb-and-board-bring-up',
    name: 'Electronics, PCB and Board Bring-up',
    summary:
      'I have hands-on capability from schematic capture and PCB layout through board bring-up, debugging and validation.',
    cluster: 'embedded',
    contexts: ['project', 'personal'],
    evidenceTier: 'hands-on',
    subdomains: [
      'Schematic capture',
      'PCB layout',
      'Board-level bring-up and debug',
      'Sensor interfacing and signal conditioning',
      'Analog front-end design (Working knowledge)',
      'EMC and EMI awareness (Working knowledge)',
    ],
    platforms: [
      'Altium',
      'KiCad',
      'Oscilloscope and logic analyser use',
      'ADC, PWM, level shifting',
      'Signal conditioning',
    ],
    projectProof:
      'I designed and brought up sensor hardware for the ESP32 clinical capstone and a custom PCB for an agricultural-equipment telemetry field trial.',
    experienceProof:
      'I applied sensor, CAN and equipment interfacing in professional IoT device work.',
    transferableLogic:
      'Reliable control, telemetry and ML depend on clean sensing, grounding and signal integrity.',
    growthTargets: ['Multi-layer high-speed layout', 'Formal EMC pre-compliance testing'],
    relatedProjects: ['ataxia-assessment-device', 'iot-monitoring-platform'],
  },
  {
    slug: 'embedded-systems-and-firmware',
    name: 'Embedded Systems and Firmware',
    summary:
      'Embedded firmware and device integration in C and C++ on ESP32 and STM32, from register-level peripherals and RTOS tasks to provisioning, CAN-connected equipment interfaces and field deployment.',
    cluster: 'embedded',
    contexts: ['professional', 'project', 'personal'],
    evidenceTier: 'delivered',
    subdomains: [
      'Embedded C and C++',
      'RTOS task design (FreeRTOS)',
      'Peripheral drivers: UART, I2C, SPI, CAN, ADC, PWM',
      'Low-power and battery-aware design',
      'Device provisioning and field deployment',
      'Bootloaders and OTA firmware update (Working knowledge)',
    ],
    platforms: [
      'ESP32 and ESP32-S3',
      'STM32',
      'FreeRTOS',
      'PlatformIO and vendor toolchains',
      'Serial debugging',
    ],
    protocols: ['UART', 'I2C', 'SPI', 'CAN', 'ADC', 'PWM'],
    projectProof:
      'Built the capstone clinical sensing device and IoT platform firmware end to end.',
    experienceProof:
      'I delivered agricultural-equipment telemetry work spanning custom PCB design, CAN trace capture, GPS or GNSS location, condition sensing, MikroTik connectivity and Linux server integration.',
    transferableLogic:
      'Real-time constraints, interrupt discipline and driver structure transfer directly into robotics, automotive and instrumentation work.',
    growthTargets: ['Functional-safety-rated firmware practices', 'Rust for embedded'],
    relatedProjects: ['ataxia-assessment-device', 'iot-monitoring-platform'],
  },
  {
    slug: 'control-systems',
    name: 'Control Systems',
    summary:
      'I have applied feedback control through PID and PLC logic, then extended it through state estimation and model-based design in degree and project work.',
    cluster: 'controls',
    contexts: ['professional', 'project', 'study'],
    evidenceTier: 'delivered',
    subdomains: [
      'PID design and tuning',
      'Process control loops',
      'Motion control basics',
      'Kalman and EKF state estimation (Hands-on)',
      'System modelling and simulation (Hands-on)',
      'Modern and optimal control theory (Working knowledge)',
    ],
    platforms: [
      'MATLAB and Simulink',
      'PID tuning in PLC and firmware',
      'Kalman and EKF filters',
      'Simulation-first validation',
    ],
    projectProof:
      'Kalman and EKF estimation and PID motion control built into the ROS 2 rover project.',
    experienceProof:
      'I delivered control logic for pharmaceutical, biotechnology and food-manufacturing systems.',
    transferableLogic:
      'A control loop is a control loop: the same stability and disturbance thinking applies to a dosing skid, a wheel motor or a thermal chamber.',
    growthTargets: [
      'Model predictive control in production',
      'Formal control-loop performance auditing',
    ],
    relatedProjects: ['autonomous-navigation-rover', 'jag-smart-factory'],
  },
  {
    slug: 'industrial-automation-plc-and-scada',
    name: 'Industrial Automation, PLC and SCADA',
    summary:
      'I delivered PLC, HMI, SCADA, MES and batch-system work for regulated plants, including a SCADA migration verified against the existing validated system.',
    cluster: 'controls',
    contexts: ['professional'],
    evidenceTier: 'delivered',
    subdomains: [
      'PLC programming (IEC 61131-3)',
      'HMI and SCADA engineering',
      'MES and batch execution',
      'SCADA platform migration',
      'Industrial networks: Modbus, Profinet',
      'FAT, SAT and commissioning',
    ],
    platforms: [
      'Siemens TIA Portal',
      'WinCC',
      'PCS 7',
      'iFIX',
      'PVI+',
      'Modbus TCP/RTU',
      'Profinet',
    ],
    protocols: ['Modbus TCP/RTU', 'Profinet'],
    projectProof:
      'My smart-factory case study details the SCADA migration and process-visualisation work I delivered.',
    experienceProof:
      'Executed an iFIX to PVI+ SCADA migration at JAG Process Solutions, converting application content and verifying functional behaviour against the validated system, with FAT, SAT, commissioning and qualification documentation.',
    transferableLogic:
      'I carry alarm design, operator usability and data-integrity discipline into supervisory and telemetry systems.',
    growthTargets: ['Allen-Bradley and Rockwell platforms', 'Ignition SCADA'],
    relatedProjects: ['jag-smart-factory'],
  },
  {
    slug: 'robotics-and-autonomy',
    name: 'Robotics and Autonomy',
    summary:
      'I built and validated a ROS 2 autonomy stack covering perception, SLAM, state estimation, planning, control and simulation.',
    cluster: 'controls',
    contexts: ['professional', 'project', 'personal'],
    evidenceTier: 'delivered',
    subdomains: [
      'ROS 2 architecture and nodes',
      'SLAM and localisation',
      'Path planning (A*, Nav2)',
      'Manipulation basics (MoveIt 2)',
      'Industrial robot cells (KUKA, exposure)',
      'Sensor fusion: LiDAR, IMU, odometry',
      'Kinematics and dynamics',
      'Simulation-based validation',
    ],
    platforms: [
      'ROS 2 Humble',
      'Nav2',
      'MoveIt 2',
      'Gazebo',
      'RViz',
      'SLAM toolboxes',
      'A* planning',
      'EKF localisation',
    ],
    projectProof:
      'Built an end-to-end ROS 2 autonomous rover with LiDAR SLAM, A* planning, Kalman and EKF estimation and IMU-odometry fusion.',
    experienceProof:
      'Contributor to the Deakin Mars Rover Team. Hands-on industrial robotics exposure at Carbon Revolution, working through the automation programme that replaced a legacy rim layup machine with KUKA-based robotic layup and demoulding cells.',
    transferableLogic:
      'Robotics strengthened my discipline around timing, transforms, interfaces and failure handling across integrated systems.',
    growthTargets: [
      'Commercial robot deployment and fleet operations',
      'Learning-based perception in production',
    ],
    relatedProjects: ['autonomous-navigation-rover', 'carbon-revolution-rim-layup'],
  },
  {
    slug: 'ai-ml-and-data-science',
    name: 'AI, ML and Data Science',
    summary:
      'I apply machine learning to engineering signals through anomaly detection, predictive-maintenance logic, computer vision and time-series analytics.',
    cluster: 'software',
    contexts: ['personal', 'project', 'study'],
    evidenceTier: 'hands-on',
    subdomains: [
      'Anomaly detection',
      'Predictive maintenance concepts',
      'Time-series analytics and OEE',
      'Computer vision (OpenCV, YOLO)',
      'Feature extraction and statistical modelling',
      'Deep learning model training at scale (Working knowledge)',
    ],
    platforms: [
      'Python: NumPy, Pandas, scikit-learn',
      'OpenCV and YOLO',
      'MATLAB',
      'InfluxDB',
      'Grafana',
    ],
    projectProof:
      'Built anomaly detection, predictive-maintenance logic and OEE analytics into the digital-twin concept. Vision and estimation work in the ROS 2 rover.',
    experienceProof:
      'I applied monitoring concepts to professional IoT telemetry pipelines. The agricultural field trial did not include a claimed ML deployment.',
    transferableLogic:
      'I use the physics and measurement context behind a signal to guide feature design, model choice and validation.',
    growthTargets: ['Production MLOps', 'Edge inference on embedded targets'],
    relatedProjects: ['digital-twin-industrial-ai', 'autonomous-navigation-rover'],
  },
  {
    slug: 'software-engineering-and-devops',
    name: 'Software Engineering and DevOps',
    summary:
      'Practical software across Python, C, C++, JavaScript and TypeScript with Linux, Git, REST APIs, databases and test automation, including a deployed club website.',
    cluster: 'software',
    contexts: ['professional', 'personal'],
    evidenceTier: 'hands-on',
    subdomains: [
      'Python and C/C++ development',
      'REST APIs and integration',
      'Linux and scripting',
      'Version control and CI workflows',
      'Test automation',
      'Web systems (Next.js, Supabase)',
      'Databases and time-series stores',
    ],
    platforms: [
      'Python',
      'C and C++',
      'JavaScript and TypeScript',
      'Node.js',
      'Git',
      'Linux',
      'JIRA',
      'InfluxDB',
    ],
    projectProof:
      'I built and run the Newcomb and District Cricket Club website on Next.js and Supabase, alongside this portfolio and the Engineering Mastery Lab.',
    experienceProof: 'I used test automation and CI workflows in professional validation work.',
    transferableLogic:
      'I use clean interfaces, version discipline and automated checks to connect work across engineering domains.',
    growthTargets: ['Cloud architecture certification', 'Containerised deployment at scale'],
    relatedProjects: ['engineering-mastery-lab', 'ndcc-website'],
  },
  {
    slug: 'iot-and-edge-to-cloud-telemetry',
    name: 'IoT and Edge-to-Cloud Telemetry',
    summary:
      'I delivered an end-to-end IoT field-trial system spanning custom electronics, CAN capture, GPS or GNSS location, condition sensing, MikroTik connectivity and Linux server integration.',
    cluster: 'software',
    contexts: ['professional'],
    evidenceTier: 'delivered',
    subdomains: [
      'Custom telemetry hardware',
      'CAN capture and trace',
      'GPS or GNSS location',
      'Condition-sensing inputs',
      'MikroTik edge connectivity',
      'Linux server integration',
      'Field deployment and support',
    ],
    platforms: [
      'Custom PCB design',
      'CAN capture',
      'GPS or GNSS',
      'Sensor interfacing',
      'MikroTik',
      'Linux',
    ],
    projectProof:
      'The DuxTel agricultural equipment telemetry case study covers the deployed active field-trial system end to end.',
    experienceProof:
      'Designed and deployed DuxTel field telemetry systems from custom PCB and equipment interfaces through MikroTik connectivity, Linux server integration and trial deployment.',
    transferableLogic:
      'Edge-to-cloud thinking scales from a paddock sensor to a plant historian: the same ingestion, buffering and visualisation logic applies.',
    growthTargets: ['Industrial IoT at plant scale (OPC UA)', 'Cellular and satellite backhaul systems'],
    relatedProjects: ['iot-monitoring-platform'],
  },
  {
    slug: 'automotive-systems-and-validation',
    name: 'Automotive Systems and Validation',
    summary:
      'I carried out vehicle-software and ADAS validation on OEM programmes, plus regulated emissions and compliance testing grounded in CAN-level evidence.',
    cluster: 'sectors',
    contexts: ['professional'],
    evidenceTier: 'delivered',
    subdomains: [
      'CAN and CAN FD analysis',
      'ADAS feature validation',
      'OTA update regression testing',
      'Vehicle instrumentation',
      'Emissions and compliance testing (ADR, EURO)',
      'Fault isolation and defect evidence',
      'EV and HEV architectures (Working knowledge)',
    ],
    platforms: [
      'Vector CANoe',
      'Vector CANalyzer',
      'Data-acquisition systems',
      'Emissions instrumentation',
      'Structured test procedures',
    ],
    protocols: ['CAN', 'CAN FD'],
    projectProof:
      'The ADAS validation and emissions testing case studies break the work down.',
    experienceProof:
      'Validated vehicle software and ADAS features across the T6 Ranger and Everest programmes. Emissions and compliance testing against ADR and EURO standards at ABMARC.',
    transferableLogic:
      'I use traceable evidence, from CAN traces to certification reports, to support validation decisions in regulated work.',
    growthTargets: ['AUTOSAR literacy', 'ISO 26262 functional safety'],
    relatedProjects: ['adas-can-validation', 'emissions-compliance-testing'],
  },
  {
    slug: 'biomedical-and-clinical-devices',
    name: 'Biomedical and Clinical Devices',
    summary:
      'Embedded clinical sensing built and validated against clinical references in an Honours capstone, with working knowledge of human-factors and device-validation concepts.',
    cluster: 'sectors',
    contexts: ['project', 'study'],
    evidenceTier: 'hands-on',
    subdomains: [
      'Embedded physiological sensing',
      'Real-time signal acquisition',
      'Measurement validation against references',
      'Human factors and usability concepts (Working knowledge)',
      'Medical device regulation awareness (Working knowledge)',
    ],
    platforms: [
      'ESP32',
      'IMU, ToF, Hall-effect, magnetometer sensing',
      'MATLAB data logging',
      'Signal processing',
    ],
    projectProof:
      'The ESP32 clinical ataxia assessment capstone with real-time acquisition and measurement validation against clinical references.',
    experienceProof: 'Assessed Honours capstone at Deakin University, graded with Distinction.',
    transferableLogic:
      'Clinical work forces measurement rigour, repeatability and documentation discipline that generalises to any safety-relevant sensing.',
    growthTargets: ['IEC 62304 software lifecycle', 'Clinical trial support engineering'],
    relatedProjects: ['ataxia-assessment-device'],
  },
  {
    slug: 'manufacturing-production-and-quality',
    name: 'Manufacturing, Production and Quality',
    summary:
      'I built production, QA, traceability and documentation experience across food and beverage, carbon-fibre and structural-steel manufacturing.',
    cluster: 'sectors',
    contexts: ['professional'],
    evidenceTier: 'delivered',
    subdomains: [
      'Production operations',
      'QA records, ITPs and MDRs',
      'Material traceability',
      'Engineering-drawing review',
      'Inspection planning',
      'Lean and continuous improvement',
    ],
    platforms: [
      'ITP and MDR documentation',
      'FMEA',
      'Lean Six Sigma Foundation',
      'KAIZEN',
      'Traceability systems',
    ],
    projectProof:
      'The manufacturing and QA foundation record and the compliance testing case study show the same QA discipline applied end to end.',
    experienceProof:
      'Manufacturing, QA and documentation roles at IDL, Carbon Revolution and Thornton Engineering from 2018 to 2024, spanning food and beverage, carbon-fibre and structural-steel production.',
    transferableLogic:
      'Floor-level empathy for operators and inspectors makes automation, HMI and MES design markedly better.',
    growthTargets: ['Six Sigma Green Belt', 'Production line ownership'],
    relatedProjects: [
      'manufacturing-qa-foundation',
      'emissions-compliance-testing',
      'idl-canning-line',
      'carbon-revolution-rim-layup',
    ],
  },
  {
    slug: 'process-pharma-and-regulated-manufacturing',
    name: 'Process, Pharma and Regulated Manufacturing',
    summary:
      'I delivered smart-factory and control engineering for pharmaceutical, biotechnology and food-manufacturing clients under GMP, through qualification and handover.',
    cluster: 'sectors',
    contexts: ['professional'],
    evidenceTier: 'delivered',
    subdomains: [
      'GMP working practices',
      'GAMP 5 validation lifecycle',
      'Batch systems and execution',
      'Process visualisation',
      'Qualification and handover documentation',
      'P&ID and process design literacy (Working knowledge)',
    ],
    platforms: [
      'GAMP 5',
      'FDA 21 CFR Part 11 awareness',
      'Batch execution systems',
      'FAT, SAT, IQ/OQ-style documentation',
    ],
    projectProof: 'The JAG smart factory case study details the regulated delivery context.',
    experienceProof:
      'I delivered control, integration and smart-factory engineering for pharmaceutical, biotechnology and food-manufacturing clients under GMP across plants, skids and packaged units.',
    transferableLogic:
      'I apply regulated-industry traceability and documentation discipline to engineering work in other sectors.',
    growthTargets: ['CQV engineering roles', 'Process engineering depth in pharma'],
    relatedProjects: ['jag-smart-factory'],
  },
  {
    slug: 'civil-structural-and-infrastructure-awareness',
    name: 'Civil, Structural and Infrastructure Awareness',
    summary:
      'Transferable exposure from structural-steel fabrication QA: reading structural drawings, weld and inspection documentation, and standards-driven fabrication workflows.',
    cluster: 'sectors',
    contexts: ['professional'],
    evidenceTier: 'adjacent',
    subdomains: [
      'Structural drawing review',
      'Steel fabrication QA',
      'ITP-driven inspection',
      'Standards-driven documentation',
    ],
    platforms: ['Engineering drawings', 'ITPs and MDRs', 'Material traceability records'],
    projectProof: 'Pressure-vessel CAD designs that progressed into fabrication.',
    experienceProof:
      'QA, drawing review and documentation work at Thornton Engineering across structural-steel fabrication projects.',
    transferableLogic:
      'Standards-driven fabrication QA is a direct bridge into infrastructure, rail and energy project work.',
    growthTargets: ['Infrastructure automation and monitoring systems'],
    relatedProjects: ['manufacturing-qa-foundation'],
  },
  {
    slug: 'aerospace-space-marine-rail-defence-mining-agriculture-and-energy',
    name: 'Aerospace, Space, Marine, Rail, Defence, Mining, Agriculture and Energy',
    summary:
      'Sector adjacencies reached through rover robotics, field IoT and hands-on farm work, held honestly as adjacent exposure and strategic growth targets rather than delivery claims.',
    cluster: 'sectors',
    contexts: ['project', 'personal'],
    evidenceTier: 'adjacent',
    subdomains: [
      'Space and field robotics (Mars Rover Team)',
      'Agricultural sensing and AgTech',
      'Mining automation (Target)',
      'Rail systems and signalling (Target)',
      'Defence systems engineering (Target)',
      'Marine and offshore systems (Target)',
      'Energy and renewables integration (Target)',
    ],
    platforms: [
      'ROS 2 field robotics',
      'Environmental and GPS telemetry',
      'Remote asset monitoring patterns',
    ],
    projectProof:
      'Deakin Mars Rover Team contribution and the deployed agricultural equipment health and location telemetry platform.',
    experienceProof:
      'Practical agricultural experience as a farmhand alongside field IoT trial deployment work.',
    transferableLogic:
      'Autonomy, telemetry, harsh-environment sensing and regulated validation transfer directly into these sectors.',
    growthTargets: [
      'Mining autonomy programmes',
      'Defence-adjacent autonomous systems',
      'Renewable energy plant automation',
    ],
    relatedProjects: ['iot-monitoring-platform', 'autonomous-navigation-rover'],
  },
  {
    slug: 'safety-reliability-standards-and-cyber-physical-security',
    name: 'Safety, Reliability, Standards and Cyber-physical Security',
    summary:
      'I have working knowledge of machinery safety, industrial cybersecurity and quality standards, applied through documentation and test practice.',
    cluster: 'assurance',
    contexts: ['professional', 'study'],
    evidenceTier: 'working-knowledge',
    subdomains: [
      'Evidence-based test documentation (Delivered)',
      'FMEA and risk assessment (Hands-on)',
      'Machinery safety (ISO 13849)',
      'Industrial cybersecurity (IEC 62443)',
      'Computerised system validation (GAMP 5, 21 CFR Part 11)',
      'Reliability engineering methods',
    ],
    platforms: [
      'ISO 13849',
      'IEC 62443',
      'GAMP 5',
      'FDA 21 CFR Part 11',
      'IEC 61131-3',
      'FMEA',
    ],
    projectProof:
      'I use a consistent, standards-aware structure for validation methods and evidence.',
    experienceProof:
      'Standards applied through GMP automation delivery, FMEA and QA documentation across JAG, ABMARC and manufacturing roles.',
    transferableLogic:
      'Standards literacy converts good engineering into defensible engineering: it is the language auditors and safety leads trust.',
    growthTargets: ['Functional safety certification (TUV style)', 'IEC 62443 practitioner depth'],
    relatedProjects: ['jag-smart-factory', 'emissions-compliance-testing'],
  },
  {
    slug: 'project-delivery-commissioning-and-handover',
    name: 'Project Delivery, Commissioning and Handover',
    summary:
      'I take systems through FAT and SAT, site commissioning, fault resolution, stakeholder communication, qualification and handover.',
    cluster: 'assurance',
    contexts: ['professional'],
    evidenceTier: 'delivered',
    subdomains: [
      'FAT and SAT execution',
      'Site commissioning',
      'Qualification documentation',
      'Stakeholder and client communication',
      'Fault resolution under time pressure',
      'Handover and training material',
    ],
    platforms: ['FAT and SAT protocols', 'Commissioning plans', 'JIRA and Agile', 'Structured reporting'],
    projectProof:
      'My professional case studies include documented validation and handover, not only functional implementation.',
    experienceProof:
      // TODO CONFIRM: removing the employer attribution leaves the final
      // sentence a bare noun phrase. Not rewritten, because a replacement
      // would be invented. Saj to reword or drop it.
      'Produced FAT, SAT, commissioning, qualification and handover documentation at JAG Process Solutions and resolved faults raised during testing and site support. Readiness-milestone evidence.',
    transferableLogic:
      'I use commissioning to test interfaces, expose faults and verify how the complete system behaves in practice.',
    growthTargets: ['Lead commissioning roles', 'Multi-discipline project engineering'],
    relatedProjects: ['jag-smart-factory', 'adas-can-validation'],
  },
] as const

export function getDomain(slug: string): AtlasDomain | undefined {
  return atlas.find((d) => d.slug === slug)
}

export const atlasClusters: readonly AtlasCluster[] = Array.from(
  new Set(atlas.map((d) => d.cluster)),
)
