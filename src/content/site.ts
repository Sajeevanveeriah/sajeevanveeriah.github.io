export const site = {
  name: 'Sajeevan Veeriah',
  initials: 'SV',
  jobTitle: 'Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer',
  proposition:
    'I work across the full stack of a machine: mechanical design, electronics, embedded firmware, controls, autonomy, software and engineering data.',
  profile:
    'My experience spans vehicle software and ADAS validation, GMP process automation, mobile-robot support, automotive emissions and EV testing, IoT field deployment and manufacturing quality. I take systems from requirements and prototyping through integration, test, commissioning and handover.',
  url: 'https://sajeevanveeriah.github.io',
  email: 'sajeevanveeriah@gmail.com',
  phone: '+61 498 586 654',
  location: 'Geelong, VIC, Australia',
  resume: '/assets/Resume_Sajeevan_Veeriah.pdf',
  github: 'https://github.com/Sajeevanveeriah',
  support: {
    label: 'Support my work',
    description: 'Optional support for my open engineering work.',
    url: 'https://paypal.me/SajeevanVeeriah95',
  },
  credentials: ['Member, Engineers Australia', 'Deakin Mechatronics Engineering Honours, Distinction, 2025'],
} as const

export const experience = [
  {
    period: 'Jan 2026 - Jun 2026', role: 'Automation and Controls Engineer', organisation: 'Process automation systems integrator',
    context: 'GMP automation for pharmaceutical, biotechnology and food production',
    detail: 'Integrated PLC logic, HMI/SCADA, field devices, drives and production data through testing, commissioning and handover. Migrated validated application content from iFIX to PVI+, completed functional checks and supported MiR mobile-robot operations and fault tracing.',
    tags: ['PLC/HMI/SCADA', 'GMP', 'FAT/SAT', 'AMR support'],
  },
  {
    period: 'Oct 2025 - Jan 2026', role: 'Product Development Test Engineer (Contract)', organisation: 'Global automotive OEM via engineering consultancy',
    context: 'Vehicle product development and validation',
    detail: 'Validated vehicle software integration and ADAS features using feature-vehicle, breadboard and regression testing. Instrumented test vehicles, ran structured drives and used Vector CANoe and CANalyzer for CAN-data fault isolation and defect evidence.',
    tags: ['ADAS', 'CAN', 'Regression test', 'Vehicle software'],
  },
  {
    period: 'Jul 2024 - Aug 2025', role: 'Technical Officer, Quality Assurance and OH&S', organisation: 'ABMARC',
    context: 'Automotive emissions, energy, compliance and future mobility',
    detail: 'Delivered ADR/EURO emissions, EV/PHEV range and vehicle-systems testing using calibrated instrumentation, data acquisition and CAN tools. Maintained QA, regulatory, safety and test evidence for certification and audit.',
    tags: ['Vehicle test', 'DAQ', 'Compliance', 'Quality'],
  },
  {
    period: 'Feb 2024 - Aug 2024', role: 'Consultant Engineer, IoT and Projects Administrator', organisation: 'DuxTel',
    context: 'Networking and low-power IoT telemetry',
    detail: 'Built ESP32, sensor, gateway and Linux dashboard solutions using LoRaWAN AU915, MQTT, ChirpStack, InfluxDB and Grafana. Supported CAN, GPS, custom PCB, MikroTik and agricultural monitoring work from field trial to handover.',
    tags: ['IoT', 'LoRaWAN', 'ESP32', 'Grafana'],
  },
  {
    period: 'Aug 2022 - Feb 2024', role: 'Production Line Team Lead and Cellar Hand', organisation: 'IDL Australia',
    context: 'Beverage development, manufacturing and packaging',
    detail: 'Led shift output, changeovers and handover while maintaining batch quality and traceability. Performed first-level fault finding across production equipment and process interruptions.',
    tags: ['Team lead', 'Production', 'Traceability', 'Fault finding'],
  },
  {
    period: 'Sep 2021 - Dec 2021', role: 'Production Line Operator and Commissioning Support', organisation: 'Carbon Revolution',
    context: 'Industry 4.0 carbon-fibre wheel manufacturing',
    detail: 'Operated production equipment, recorded quality and traceability data, and supported equipment trials, setup and verification during commissioning activity.',
    tags: ['Manufacturing', 'Commissioning', 'Quality', 'Traceability'],
  },
  {
    period: 'Mar 2018 - Mar 2020', role: 'Undergraduate Quality Engineer', organisation: 'Thornton Engineering Australia',
    context: 'Structural steel and heavy fabrication',
    detail: 'Supported drawing review, inspection and test plans, manufacturing data records, material traceability and AS/NZS compliance across design, workshop and inspection boundaries.',
    tags: ['QA', 'ITP/MDR', 'Drawings', 'AS/NZS'],
  },
] as const

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
  { index: '01', title: 'Physical system', detail: 'Mechanisms, structures, actuation and the environment.' },
  { index: '02', title: 'Sensing and electronics', detail: 'Sensors, signal paths, power and embedded hardware.' },
  { index: '03', title: 'Embedded intelligence', detail: 'Firmware, real-time control, drivers and middleware.' },
  { index: '04', title: 'Robotics and autonomy', detail: 'Perception, estimation, planning and motion control.' },
  { index: '05', title: 'AI/ML and data', detail: 'Models, telemetry, engineering data and diagnostics.' },
  { index: '06', title: 'Validation and deployment', detail: 'Simulation, integration, field checks and handover.' },
] as const

export const practiceDomains = [
  {
    title: 'Robotics & Autonomy',
    detail: 'ROS 2 Humble, Nav2, MoveIt 2, Gazebo Fortress, SLAM, EKF sensor fusion, localisation, planning and PID control.',
  },
  {
    title: 'Embedded & Electronics',
    detail: 'ESP32, STM32, FreeRTOS, C/C++, PCB bring-up, CAN, UART, I2C, SPI, BLE, sensing, motors and drives.',
  },
  {
    title: 'Automation & Controls',
    detail: 'Siemens TIA Portal, WinCC, PCS 7, iFIX, PVI+, PLC and HMI/SCADA integration, FAT, SAT and commissioning.',
  },
  {
    title: 'AI/ML & Engineering Data',
    detail: 'Python, scikit-learn, OpenCV, YOLO, time-series analysis, MATLAB, Simulink, InfluxDB and Grafana.',
  },
  {
    title: 'Mechanical & Validation',
    detail: 'SolidWorks, Fusion 360, GD&T, prototyping, instrumentation, calibrated testing, fault isolation and DFM.',
  },
  {
    title: 'Software & Delivery',
    detail: 'Python, C/C++, TypeScript, Linux, Git, Docker, CI/CD, REST APIs, PostgreSQL, traceability and handover.',
  },
] as const
