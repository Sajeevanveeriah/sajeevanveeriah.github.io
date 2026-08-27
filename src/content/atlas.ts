export type EvidenceLevel = 'Delivered' | 'Hands-on' | 'Working knowledge' | 'Adjacent'

export interface AtlasDomain {
  readonly slug: string
  readonly name: string
  readonly cluster:
    | 'Systems'
    | 'Physical'
    | 'Embedded'
    | 'Controls'
    | 'Software'
    | 'Sectors'
    | 'Assurance'
  readonly evidence: EvidenceLevel
  readonly summary: string
  readonly tools: readonly string[]
  readonly proof: string
  readonly growth: string
}

export const atlasDomains = [
  {
    slug: 'mechatronics-and-systems-engineering',
    name: 'Mechatronics and Systems Engineering',
    cluster: 'Systems',
    evidence: 'Delivered',
    summary:
      'Integrates mechanical, electrical, embedded, control and software layers into testable systems with clear interfaces and acceptance evidence.',
    tools: ['System decomposition', 'MATLAB', 'Simulink', 'FMEA', 'FAT', 'SAT'],
    proof:
      'The ROS 2 rover, clinical sensing device, field telemetry work and regulated automation delivery each connect physical equipment, control, data and verification.',
    growth: 'Extend model-based systems engineering practice with SysML and stronger digital traceability.',
  },
  {
    slug: 'mechanical-design-materials-and-thermofluids',
    name: 'Mechanical Design, Materials and Thermofluids',
    cluster: 'Physical',
    evidence: 'Hands-on',
    summary:
      'Designs and reviews parts, mechanisms, enclosures and assemblies, supported by degree-level materials, thermodynamics and fluid mechanics knowledge.',
    tools: ['SolidWorks', 'Fusion 360', 'GD&T', 'Engineering drawings', 'FDM prototyping'],
    proof:
      'Mechanical work includes rover hardware, the clinical device enclosure, university builds, drawing review and fabrication quality assurance.',
    growth: 'Deepen production DFM and formal FEA correlation with physical test data.',
  },
  {
    slug: 'electrical-systems-and-power',
    name: 'Electrical Systems and Power',
    cluster: 'Physical',
    evidence: 'Hands-on',
    summary:
      'Works with motors, drives, instrumentation wiring and control panels, backed by formal electrical machines and power fundamentals.',
    tools: ['VFDs', 'Control schematics', 'Multimeter', 'Loop checks', 'Instrumentation datasheets'],
    proof:
      'Integrated field devices, sensors and drives with control logic in regulated process automation and electromechanical project builds.',
    growth: 'Build deeper switchboard design ownership and AS/NZS 3000 literacy.',
  },
  {
    slug: 'electronics-pcb-and-board-bring-up',
    name: 'Electronics, PCB and Board Bring-up',
    cluster: 'Embedded',
    evidence: 'Hands-on',
    summary:
      'Takes sensor electronics from schematic and PCB layout through board bring-up, signal checks and integration with embedded firmware.',
    tools: ['Altium', 'KiCad', 'Oscilloscope', 'Logic analyser', 'ADC', 'Signal conditioning'],
    proof:
      'Designed sensor hardware for the clinical assessment prototype and custom PCB-based equipment telemetry used in a field trial.',
    growth: 'Advance multi-layer layout and formal EMC pre-compliance testing.',
  },
  {
    slug: 'embedded-systems-and-firmware',
    name: 'Embedded Systems and Firmware',
    cluster: 'Embedded',
    evidence: 'Delivered',
    summary:
      'Builds real-time sensing, communications and device-control firmware in C and C++ for embedded prototypes and deployed field equipment.',
    tools: ['ESP32', 'STM32', 'FreeRTOS', 'C/C++', 'UART', 'I2C', 'SPI', 'CAN', 'BLE'],
    proof:
      'The clinical device acquired four Hall-effect channels at 100 Hz on ESP32, while professional telemetry work connected sensing, CAN and field communications.',
    growth: 'Develop functional-safety firmware practice and production-grade update strategies.',
  },
  {
    slug: 'control-systems',
    name: 'Control Systems',
    cluster: 'Controls',
    evidence: 'Delivered',
    summary:
      'Applies feedback control, state estimation and simulation across mobile robotics, embedded systems and industrial process logic.',
    tools: ['PID', 'Kalman filter', 'EKF', 'MATLAB', 'Simulink', 'PLC control logic'],
    proof:
      'Implemented rover motion control and state estimation with simulation-led tuning, and delivered PLC logic for regulated manufacturing systems.',
    growth: 'Extend into production model predictive control and formal loop-performance auditing.',
  },
  {
    slug: 'industrial-automation-plc-and-scada',
    name: 'Industrial Automation, PLC and SCADA',
    cluster: 'Controls',
    evidence: 'Delivered',
    summary:
      'Integrates PLC, HMI, SCADA, field devices and production data through testing, commissioning and documented handover.',
    tools: ['Siemens TIA Portal', 'WinCC', 'PCS 7', 'iFIX', 'PVI+', 'Modbus', 'Profinet'],
    proof:
      'Delivered GMP automation work and migrated validated application content from iFIX to PVI+ with functional checks against the existing system.',
    growth: 'Broaden platform depth across Rockwell and Ignition environments.',
  },
  {
    slug: 'robotics-and-autonomy',
    name: 'Robotics and Autonomy',
    cluster: 'Controls',
    evidence: 'Delivered',
    summary:
      'Builds robotic systems across sensing, localisation, planning, control and operator support, with explicit boundaries between hardware and simulation evidence.',
    tools: ['ROS 2 Humble', 'Nav2', 'Gazebo Fortress', 'RViz', 'LiDAR SLAM', 'EKF', 'MoveIt 2'],
    proof:
      'Built a physical differential-drive rover and validated its autonomy stack in simulation; further evidence includes deployed support robots, rover-team work and industrial robot-cell exposure without design or programming ownership claims.',
    growth: 'Grow commercial fleet operations and production perception experience.',
  },
  {
    slug: 'ai-ml-and-data-science',
    name: 'AI, ML and Data Science',
    cluster: 'Software',
    evidence: 'Hands-on',
    summary:
      'Applies machine learning, computer vision and time-series methods to engineering data with attention to the physical meaning of each signal.',
    tools: ['Python', 'NumPy', 'Pandas', 'scikit-learn', 'OpenCV', 'YOLO', 'MATLAB'],
    proof:
      'Personal project evidence includes a locally deployed small-language-model system and industrial AI concepts for anomaly detection, maintenance and OEE analytics.',
    growth: 'Build production MLOps depth and edge inference on constrained targets.',
  },
  {
    slug: 'software-engineering-and-devops',
    name: 'Software Engineering and DevOps',
    cluster: 'Software',
    evidence: 'Delivered',
    summary:
      'Develops local-first, web and engineering software with typed interfaces, automated tests, release workflows and auditable data boundaries.',
    tools: ['TypeScript', 'React', 'Python', 'C/C++', 'Rust', 'Node.js', 'Git', 'Linux', 'GitHub Actions'],
    proof:
      'Delivered the SWL pricing application through release 1.2.0 with more than 500 automated checks, alongside deployed community and engineering platforms.',
    growth: 'Deepen containerised operations and observability for larger deployed systems.',
  },
  {
    slug: 'iot-and-edge-to-cloud-telemetry',
    name: 'IoT and Edge-to-Cloud Telemetry',
    cluster: 'Software',
    evidence: 'Delivered',
    summary:
      'Builds telemetry paths from sensing and equipment interfaces through low-power networks, Linux services, storage and dashboards.',
    tools: ['ESP32', 'LoRaWAN AU915', 'MQTT', 'ChirpStack', 'InfluxDB', 'Grafana', 'MikroTik', 'Linux'],
    proof:
      'Delivered agricultural equipment telemetry spanning custom PCB, CAN capture, GPS, condition sensing, gateway connectivity and a Linux dashboard path.',
    growth: 'Extend plant-scale IIoT experience with OPC UA and resilient backhaul design.',
  },
  {
    slug: 'automotive-systems-and-validation',
    name: 'Automotive Systems and Validation',
    cluster: 'Sectors',
    evidence: 'Delivered',
    summary:
      'Tests vehicle software, ADAS, emissions and energy performance using structured procedures, calibrated instrumentation and traceable network evidence.',
    tools: ['Vector CANoe', 'Vector CANalyzer', 'CAN', 'CAN FD', 'DAQ', 'Emissions instrumentation'],
    proof:
      'Completed feature-vehicle, breadboard and regression testing on vehicle development programmes, plus ADR and EURO emissions and range testing at ABMARC.',
    growth: 'Build deeper AUTOSAR and ISO 26262 functional-safety capability.',
  },
  {
    slug: 'biomedical-and-clinical-devices',
    name: 'Biomedical and Clinical Devices',
    cluster: 'Sectors',
    evidence: 'Hands-on',
    summary:
      'Applies embedded sensing and measurement validation to a clinical assessment context while keeping prototype and medical-device claims separate.',
    tools: ['ESP32', 'Four Hall-effect sensors', '100 Hz acquisition', 'BLE', 'MATLAB', 'Custom PCB'],
    proof:
      'Designed and validated an assessed ataxia measurement prototype with four Hall-effect channels sampled at 100 Hz, Bluetooth display and MATLAB comparison against reference instruments.',
    growth: 'Develop IEC 62304 lifecycle and formal human-factors validation knowledge.',
  },
  {
    slug: 'manufacturing-production-and-quality',
    name: 'Manufacturing, Production and Quality',
    cluster: 'Sectors',
    evidence: 'Delivered',
    summary:
      'Connects production operations, quality records, traceability and first-level fault finding across beverage, composite and structural-steel manufacturing.',
    tools: ['ITP', 'MDR', 'Material traceability', 'Engineering drawings', 'Lean', 'KAIZEN'],
    proof:
      'Held production, team-lead and quality roles across three manufacturers, including commissioning support and industrial robotics exposure without robot-cell design or programming ownership.',
    growth: 'Advance statistical process control and multi-discipline production ownership.',
  },
  {
    slug: 'process-pharma-and-regulated-manufacturing',
    name: 'Process, Pharma and Regulated Manufacturing',
    cluster: 'Sectors',
    evidence: 'Delivered',
    summary:
      'Delivers control and smart-factory integration within GMP environments where traceability, qualification and handover shape the engineering method.',
    tools: ['GMP', 'GAMP 5', 'Batch systems', 'FAT', 'SAT', 'Qualification records'],
    proof:
      'Integrated automation for pharmaceutical, biotechnology and food-production systems through functional testing, commissioning and documented handover.',
    growth: 'Build deeper process-engineering and commissioning, qualification and validation ownership.',
  },
  {
    slug: 'civil-structural-and-infrastructure-awareness',
    name: 'Civil, Structural and Infrastructure Awareness',
    cluster: 'Sectors',
    evidence: 'Adjacent',
    summary:
      'Carries transferable structural-steel fabrication and quality experience into infrastructure contexts without claiming civil design delivery.',
    tools: ['Structural drawings', 'ITPs', 'MDRs', 'Material records', 'AS/NZS documentation'],
    proof:
      'Supported drawing review, inspection planning, manufacturing data records and traceability within structural-steel fabrication workflows.',
    growth: 'Apply monitoring and automation skills on infrastructure projects under discipline-led design governance.',
  },
  {
    slug: 'aerospace-space-marine-rail-defence-mining-agriculture-and-energy',
    name: 'Aerospace, Space, Marine, Rail, Defence, Mining, Agriculture and Energy',
    cluster: 'Sectors',
    evidence: 'Adjacent',
    summary:
      'Maps transferable autonomy, telemetry and validation patterns to sectors that remain adjacent experience or future growth targets.',
    tools: ['ROS 2 field robotics', 'Remote telemetry', 'Environmental sensing', 'GPS and GNSS'],
    proof:
      'Agriculture has direct field-telemetry evidence and the Deakin Mars Rover Team provides space-adjacent project context; the other named sectors are transfer targets, not personal delivery claims.',
    growth: 'Pursue supervised sector entry through mining autonomy, defence-adjacent systems or renewable-energy automation.',
  },
  {
    slug: 'safety-reliability-standards-and-cyber-physical-security',
    name: 'Safety, Reliability, Standards and Cyber-physical Security',
    cluster: 'Assurance',
    evidence: 'Working knowledge',
    summary:
      'Uses evidence-based testing, risk thinking and standards awareness to make integrated systems safer and more defensible.',
    tools: ['FMEA', 'GAMP 5', 'IEC 61131-3', 'ISO 13849', 'IEC 62443', '21 CFR Part 11 awareness'],
    proof:
      'Applied risk, QA and test documentation in regulated automation, automotive validation and manufacturing; the named safety and cyber standards remain working knowledge.',
    growth: 'Develop certified functional-safety and industrial-cybersecurity practitioner depth.',
  },
  {
    slug: 'project-delivery-commissioning-and-handover',
    name: 'Project Delivery, Commissioning and Handover',
    cluster: 'Assurance',
    evidence: 'Delivered',
    summary:
      'Takes engineering work through structured test, fault resolution, commissioning, stakeholder communication and handover evidence.',
    tools: ['FAT', 'SAT', 'Commissioning plans', 'JIRA', 'Defect evidence', 'Handover records'],
    proof:
      'Executed FAT, SAT and commissioning support in regulated automation, produced CAN-backed automotive defect evidence and delivered field systems through handover.',
    growth: 'Lead larger multi-discipline commissioning and project-engineering scopes.',
  },
] as const satisfies readonly AtlasDomain[]
