export const site = {
  name: 'Sajeevan Veeriah',
  shortName: 'Saj',
  initials: 'SV',
  jobTitle: 'Robotics, Mechatronics and Automation Engineer',
  proposition:
    'I build intelligent systems that move, sense and decide - from mechanisms and electronics through embedded control, autonomy, software and verified operation.',
  profile:
    'My practice connects robotics, industrial automation, automotive validation, IoT, AI/ML and engineering software. I am at my best at the interfaces: turning a physical need into a system that can be built, tested, fault-found and handed over.',
  url: 'https://sajeevanveeriah.github.io',
  email: 'sajeevanveeriah@gmail.com',
  phone: '+61 498 586 654',
  location: 'Geelong, Victoria, Australia',
  resume: '/assets/Resume_Sajeevan_Veeriah.pdf',
  github: 'https://github.com/Sajeevanveeriah',
  logo: '/assets/image/20260827-Sajeevan-Veeriah-SV-Logo-Rev00.webp',
  support: {
    label: 'Buy me a coffee',
    description: 'Optional support for the open engineering work and learning resources I publish.',
    url: 'https://paypal.me/SajeevanVeeriah95',
  },
  credentials: ['Member, Engineers Australia', 'Mechatronics Engineering Honours, Distinction, 2025'],
} as const

export interface ExperienceRecord {
  readonly period: string
  readonly role: string
  readonly organisation: string
  readonly employerUrl?: string
  readonly context: string
  readonly detail: string
  readonly tags: readonly string[]
}

/**
 * Public-facing functional titles are deliberately concise. The first two
 * organisations remain anonymised to respect programme confidentiality and
 * contract boundaries. Employer links establish company context only; every
 * personal contribution below is grounded in the resume and portfolio record.
 */
export const experience: readonly ExperienceRecord[] = [
  {
    period: 'Jan 2026 - Jun 2026',
    role: 'Automation Engineer',
    organisation: 'Process automation systems integrator',
    context: 'Regulated pharmaceutical, biotechnology and food production',
    detail:
      'Delivered controls and integration work across PLC logic, HMI/SCADA, field devices, drives, MES and production data. Migrated validated application content from iFIX to PVI+, completed functional checks, and supported FAT, SAT, commissioning, handover and MiR mobile-robot fault tracing under GMP controls.',
    tags: ['PLC', 'HMI/SCADA', 'Siemens', 'GMP', 'FAT/SAT', 'AMR support'],
  },
  {
    period: 'Oct 2025 - Jan 2026',
    role: 'Vehicle Validation Engineer',
    organisation: 'Global automotive OEM via engineering consultancy',
    context: 'Vehicle software integration and ADAS product development',
    detail:
      'Validated vehicle-software integration and ADAS behaviour through feature-vehicle, breadboard and regression testing. Instrumented test vehicles, conducted structured drives, and used Vector CANoe and CANalyzer to capture CAN and CAN FD data for fault isolation, defect evidence and software-readiness verification.',
    tags: ['ADAS', 'CAN/CAN FD', 'CANoe', 'CANalyzer', 'Regression test', 'Fault evidence'],
  },
  {
    period: 'Jul 2024 - Aug 2025',
    role: 'Automotive Test and Quality Engineer',
    organisation: 'ABMARC',
    employerUrl: 'https://abmarc.com.au/about/',
    context: 'Automotive testing, energy, emissions and compliance engineering',
    detail:
      'Delivered ADR and EURO emissions work, EV/PHEV range testing and vehicle-systems evaluation using calibrated instrumentation, data acquisition and CAN tools. Maintained traceable QA, safety, regulatory and test records so results could stand up to certification review and audit.',
    tags: ['Vehicle test', 'DAQ', 'CAN', 'ADR/EURO', 'QA', 'OH&S'],
  },
  {
    period: 'Feb 2024 - Aug 2024',
    role: 'IoT Systems Engineer',
    organisation: 'DuxTel',
    employerUrl: 'https://www.duxtel.com.au/duxSmart',
    context: 'Networking, low-power telemetry and remote asset visibility',
    detail:
      'Built field-to-dashboard solutions using ESP32 devices, sensors, LoRaWAN AU915, MQTT, ChirpStack, InfluxDB and Grafana. Supported CAN and GPS capture, custom PCB work, MikroTik connectivity and Linux services for agricultural-equipment telemetry from field trial through handover.',
    tags: ['ESP32', 'LoRaWAN', 'MQTT', 'Grafana', 'MikroTik', 'Linux'],
  },
  {
    period: 'Aug 2022 - Feb 2024',
    role: 'Production Team Lead',
    organisation: 'IDL Australia',
    employerUrl: 'https://www.idl.au/idl-story',
    context: 'Beverage manufacturing, packaging and traceable production',
    detail:
      'Led day-to-day output, changeovers and shift handovers while maintaining batch quality, traceability and safe operation. Performed first-response fault recovery and supported installation and commissioning checks during WestRock and Fibre-King canning-line upgrades.',
    tags: ['Team leadership', 'Production', 'Changeover', 'Traceability', 'Fault recovery', 'Commissioning support'],
  },
  {
    period: 'Sep 2021 - Dec 2021',
    role: 'Advanced Manufacturing Technician',
    organisation: 'Carbon Revolution',
    employerUrl: 'https://www.carbonrev.com/technology/manufacturing/',
    context: 'Carbon-fibre wheel production and Industry 4.0 quality control',
    detail:
      'Operated carbon-fibre wheel production equipment, recorded in-process quality and traceability evidence, and supported equipment trials, setup and first-level recovery during manufacturing changes. The role built practical discipline around controlled processes, repeatability and production handover.',
    tags: ['Carbon fibre', 'Manufacturing', 'Traceability', 'Quality', 'Equipment trials', 'First-level recovery'],
  },
  {
    period: 'Mar 2018 - Mar 2020',
    role: 'Quality Engineer',
    organisation: 'Thornton Engineering Australia',
    employerUrl: 'https://www.thorntoneng.com.au/capabilities/',
    context: 'Structural steel and heavy fabrication for major projects',
    detail:
      'Supported drawing review, inspection and test plans, manufacturing data records, material traceability and AS/NZS compliance across design, workshop and inspection boundaries. Learned how design intent becomes auditable fabrication evidence on real production floors.',
    tags: ['QA', 'ITP/MDR', 'Drawings', 'Materials', 'Traceability', 'AS/NZS'],
  },
]

export const foundation = {
  education: [
    'Bachelor of Mechatronics Engineering (Honours), Distinction - Deakin University, 2025',
    'Higher National Diploma in Mechatronics, Robotics and Automation Engineering, Distinction - Cardiff Metropolitan University, 2016',
  ],
  professional: ['Member, Engineers Australia', 'Current Victorian driver licence'],
  training: ['Lean Six Sigma Foundation', 'JIRA and Agile', 'KAIZEN', 'Industrial Automation and IIoT', 'AI/ML', 'CAD'],
  languages: ['English', 'Tamil', 'Sinhala'],
} as const

export const systemLayers = [
  { index: '01', title: 'Physical system', detail: 'Mechanisms, structures, actuation and the operating environment.', colour: 'orange' },
  { index: '02', title: 'Sensing and electronics', detail: 'Sensors, signal paths, power and embedded hardware.', colour: 'yellow' },
  { index: '03', title: 'Embedded intelligence', detail: 'Firmware, real-time control, drivers and middleware.', colour: 'teal' },
  { index: '04', title: 'Robotics and autonomy', detail: 'Perception, estimation, planning and motion control.', colour: 'blue' },
  { index: '05', title: 'AI/ML and data', detail: 'Models, telemetry, engineering data and diagnostics.', colour: 'violet' },
  { index: '06', title: 'Validation and deployment', detail: 'Simulation, integration, field checks and handover.', colour: 'rose' },
] as const

export const practiceDomains = [
  {
    title: 'Robotics and Autonomy',
    detail: 'ROS 2 Humble, Nav2, MoveIt 2, Gazebo Fortress, SLAM, EKF sensor fusion, localisation, planning and PID control.',
  },
  {
    title: 'Embedded and Electronics',
    detail: 'ESP32, STM32, FreeRTOS, C/C++, PCB bring-up, CAN, UART, I2C, SPI, BLE, sensing, motors and drives.',
  },
  {
    title: 'Automation and Controls',
    detail: 'Siemens TIA Portal, WinCC, PCS 7, iFIX, PVI+, PLC and HMI/SCADA integration, FAT, SAT and commissioning.',
  },
  {
    title: 'AI/ML and Engineering Data',
    detail: 'Python, scikit-learn, OpenCV, YOLO, time-series analysis, MATLAB, Simulink, InfluxDB and Grafana.',
  },
  {
    title: 'Mechanical and Validation',
    detail: 'SolidWorks, Fusion 360, GD&T, prototyping, instrumentation, calibrated testing, fault isolation and DFM.',
  },
  {
    title: 'Software and Delivery',
    detail: 'Python, C/C++, TypeScript, Linux, Git, Docker, CI/CD, REST APIs, PostgreSQL, traceability and handover.',
  },
] as const

export const community = [
  {
    title: 'Newcomb and District Cricket Club',
    detail: 'Playing club cricket, helping the club run and building its digital platform for members, committees, sponsors and supporters.',
  },
  {
    title: 'Deakin Mars Rover Team',
    detail: 'Multidisciplinary student rover work across mechanical, electronics, control and software interfaces.',
  },
  {
    title: 'Math Mentors and Peer Support',
    detail: 'Helping fellow students with problem solving, study skills, exam preparation and finding the right support.',
  },
] as const

export const beyond = [
  { title: 'Club cricket', detail: 'Most in-season weekends belong to Newcomb and District Cricket Club, on the field and behind the scenes.' },
  { title: 'Hockey', detail: 'A faster off-season field game, and another reason to enjoy team sport.' },
  { title: 'Long drives', detail: 'An open road, good music and somewhere new at the end is the best reset.' },
  { title: 'Music', detail: 'The soundtrack to those drives, late builds and most evenings.' },
  { title: 'Robots in the garage', detail: 'There is usually a personal robotics or hardware build half-finished on the bench.' },
] as const
