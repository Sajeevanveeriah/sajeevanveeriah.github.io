import { projects } from './projects'

export const ENGINEERING_AREA_IDS = [
  'controller-compute',
  'electronics-electrical',
  'mechanical',
  'sensors-instrumentation',
  'communications-interfaces',
  'software-control',
  'safety-standards',
  'verification-testing',
] as const

export type EngineeringAreaId = (typeof ENGINEERING_AREA_IDS)[number]

export const ENGINEERING_AREA_LABEL: Record<EngineeringAreaId, string> = {
  'controller-compute': 'Controller and compute',
  'electronics-electrical': 'Electronics and electrical',
  mechanical: 'Mechanical',
  'sensors-instrumentation': 'Sensors and instrumentation',
  'communications-interfaces': 'Communications and interfaces',
  'software-control': 'Software and control',
  'safety-standards': 'Safety and standards',
  'verification-testing': 'Verification and testing',
}

export type EngineeringItemStatus =
  | 'documented'
  | 'inferred'
  | 'applied'
  | 'reference'
  | 'performed'
  | 'recommended'
  | 'not-applicable'

export const ENGINEERING_STATUS_LABEL: Record<EngineeringItemStatus, string> = {
  documented: 'Documented in this record',
  inferred: 'Inferred reference architecture, not historical claim',
  applied: 'Applied framework',
  reference: 'Applicable reference, not certification',
  performed: 'Performed verification',
  recommended: 'Recommended check, not claimed as performed',
  'not-applicable': 'Not applicable',
}

export interface ProjectEngineeringItem {
  readonly name: string
  readonly role: string
  readonly status: EngineeringItemStatus
  readonly rationale?: string
  readonly ecosystemEntityId?: string
}

export interface ProjectEngineeringSection {
  readonly summary: string
  readonly items: readonly ProjectEngineeringItem[]
}

export interface ProjectEngineeringConnection {
  readonly from: EngineeringAreaId
  readonly relation: string
  readonly to: EngineeringAreaId
}

export interface ProjectEngineeringProfile {
  readonly basis: string
  readonly areas: Readonly<Record<EngineeringAreaId, ProjectEngineeringSection>>
  readonly connections: readonly ProjectEngineeringConnection[]
}

const item = (
  status: EngineeringItemStatus,
  name: string,
  role: string,
  rationale?: string,
  ecosystemEntityId?: string,
): ProjectEngineeringItem => ({
  status,
  name,
  role,
  ...(rationale ? { rationale } : {}),
  ...(ecosystemEntityId ? { ecosystemEntityId } : {}),
})

const d = (name: string, role: string, entity?: string) => item('documented', name, role, undefined, entity)
const i = (name: string, role: string, rationale: string, entity?: string) =>
  item('inferred', name, role, rationale, entity)
const a = (name: string, role: string) => item('applied', name, role)
const r = (name: string, role: string) => item('reference', name, role)
const p = (name: string, role: string) => item('performed', name, role)
const q = (name: string, role: string, rationale: string) => item('recommended', name, role, rationale)
const na = (reason: string) => item('not-applicable', 'Not applicable', reason)

const section = (summary: string, ...items: readonly ProjectEngineeringItem[]): ProjectEngineeringSection => ({
  summary,
  items,
})

const robotFlow: readonly ProjectEngineeringConnection[] = [
  { from: 'electronics-electrical', relation: 'powers and protects', to: 'controller-compute' },
  { from: 'sensors-instrumentation', relation: 'reports state to', to: 'controller-compute' },
  { from: 'software-control', relation: 'plans and commands through', to: 'controller-compute' },
  { from: 'controller-compute', relation: 'drives physical outputs through', to: 'mechanical' },
  { from: 'communications-interfaces', relation: 'links operator and data systems to', to: 'software-control' },
  { from: 'verification-testing', relation: 'checks functions defined by', to: 'safety-standards' },
]

const softwareFlow: readonly ProjectEngineeringConnection[] = [
  { from: 'controller-compute', relation: 'hosts', to: 'software-control' },
  { from: 'communications-interfaces', relation: 'brings controlled data into', to: 'software-control' },
  { from: 'software-control', relation: 'is checked by', to: 'verification-testing' },
  { from: 'safety-standards', relation: 'sets quality references for', to: 'software-control' },
]

const automationFlow: readonly ProjectEngineeringConnection[] = [
  { from: 'electronics-electrical', relation: 'powers and isolates', to: 'controller-compute' },
  { from: 'sensors-instrumentation', relation: 'reports plant state to', to: 'controller-compute' },
  { from: 'software-control', relation: 'executes sequences on', to: 'controller-compute' },
  { from: 'controller-compute', relation: 'commands plant and motion in', to: 'mechanical' },
  { from: 'communications-interfaces', relation: 'connects field and supervisory', to: 'software-control' },
  { from: 'verification-testing', relation: 'records evidence against', to: 'safety-standards' },
]

const testFlow: readonly ProjectEngineeringConnection[] = [
  { from: 'mechanical', relation: 'defines the physical test article for', to: 'sensors-instrumentation' },
  { from: 'sensors-instrumentation', relation: 'produces signals for', to: 'electronics-electrical' },
  { from: 'electronics-electrical', relation: 'conditions and acquires into', to: 'controller-compute' },
  { from: 'communications-interfaces', relation: 'moves time-aligned data into', to: 'software-control' },
  { from: 'controller-compute', relation: 'runs analysis in', to: 'software-control' },
  { from: 'software-control', relation: 'produces evidence through', to: 'verification-testing' },
  { from: 'safety-standards', relation: 'defines the test basis for', to: 'verification-testing' },
]

const aiFlow: readonly ProjectEngineeringConnection[] = [
  { from: 'controller-compute', relation: 'runs models and storage for', to: 'software-control' },
  { from: 'sensors-instrumentation', relation: 'provides observed or simulated inputs to', to: 'software-control' },
  { from: 'communications-interfaces', relation: 'delivers approved inputs to', to: 'software-control' },
  { from: 'safety-standards', relation: 'sets governance boundaries for', to: 'software-control' },
  { from: 'verification-testing', relation: 'measures grounded behaviour of', to: 'software-control' },
]

export const projectEngineering: Readonly<Record<string, ProjectEngineeringProfile>> = {
  'upzy-supervised-routine-companion': {
    basis: 'The physical robot and local browser application are documented. Exact as-built electronics remain private, so named hardware is an inferred reference selection based on the published privacy, supervision and interaction requirements.',
    areas: {
      'controller-compute': section('Split rich interface compute from deterministic physical I/O.',
        i('Orange Pi 5 class SBC', 'Runs the local interface, routine logic and service layer.', 'A Linux SBC suits a rich local UI.', 'ent-alt-sbc'),
        i('ESP32-S3', 'Handles buttons, indicators, watchdogs and device state.', 'A dedicated MCU keeps physical I/O bounded.', 'ent-esp32')),
      'electronics-electrical': section('Separate protected rails keep logic stable.',
        i('12 V DC input with fused 5 V and 3.3 V buck rails', 'Supplies compute, display, audio and indicators.', 'Separate rails reduce brown-outs and contain load faults.'),
        i('Protected output drivers and hardware watchdog', 'Switches loads and restores a safe idle state.', 'MCU pins should not directly carry load current.')),
      mechanical: section('A stable, rounded and serviceable tabletop enclosure avoids exposed pinch points.',
        i('PETG or ABS shell with threaded inserts', 'Creates a durable low-volume body.', 'Additive manufacture supports rapid iteration and repair.'),
        i('Guarded silicone buttons', 'Provides obvious physical responses for supervised use.', 'The interaction model is button-led.')),
      'sensors-instrumentation': section('Sensing stays deliberately minimal because cameras and microphones are excluded.',
        d('Physical response controls', 'Record acknowledgement without claiming the real-world task occurred.'),
        i('Internal temperature and supply monitoring', 'Protects the device without observing the child.', 'Diagnostics support device safety without surveillance.')),
      'communications-interfaces': section('Local interfaces keep routine data within the supervised boundary.',
        d('Browser-local versioned storage', 'Stores routines and interaction records locally.'),
        i('USB service and optional local Wi-Fi', 'Supports commissioning without a cloud dependency.', 'The published application and privacy boundary favour local access.'),
        d('No camera, microphone, account, analytics or cloud database', 'Defines the data-minimisation boundary.')),
      'software-control': section('The web interface manages routines while embedded firmware enforces simple safe states.',
        d('React 19, TypeScript 5.9, Vite 7 and localStorage', 'Implements routine creation, prompts and review.'),
        i('ESP-IDF finite-state firmware', 'Debounces controls and drives physical feedback.', 'A finite-state design makes behaviour observable and testable.')),
      'safety-standards': section('These are productisation references only; no certification is claimed.',
        r('ISO 12100', 'Risk-assessment reference for mechanical, electrical and foreseeable-use hazards.'),
        r('IEC 62368-1', 'Potential equipment-safety basis if the final classification is in scope.'),
        r('WCAG 2.2', 'Accessibility reference for the browser interface.'),
        r('Australian EMC and RCM supplier process', 'Requires product-specific evidence if the electronic product is supplied.')),
      'verification-testing': section('Published software checks are distinct from proposed hardware qualification.',
        p('TypeScript, lint, Vitest and production-build checks', 'Validate the browser application and storage recovery.'),
        p('Deployment and active-use confirmation', 'Provides operational evidence for the integrated workflow.'),
        q('Power-fault, thermal, button-endurance and drop checks', 'Qualify a physical release.', 'Exact hardware test records are not public.')),
    },
    connections: robotFlow,
  },

  'swl-pricing-inventory-control': {
    basis: 'This is a documented software-only system. Host compute and data interfaces are included; physical machine, sensing and power domains are explicitly not applicable.',
    areas: {
      'controller-compute': section('A Windows workstation or browser hosts the workflow.', d('Windows desktop and browser host', 'Runs the Tauri or browser build and local working state.')),
      'electronics-electrical': section('No designed electrical assembly is in scope.', na('The product uses ordinary end-user computer hardware.')),
      mechanical: section('No machine structure or actuator is in scope.', na('Pricing and inventory preparation are file and operator workflows.')),
      'sensors-instrumentation': section('Source files replace physical sensing.', na('Supplier and ServiceM8 exports are the controlled inputs.')),
      'communications-interfaces': section('File contracts keep external-system writes outside the application.',
        d('CSV and XLSX interfaces', 'Carry source, candidate, exception, rollback and audit records.'),
        d('Operator-reviewed ServiceM8 and Xero boundary', 'Prevents silent direct writes.'),
        d('Own-origin search service', 'Supports controlled price searches without transmitting imported rows.')),
      'software-control': section('Deterministic rules and an approval gate are the control system.',
        d('React, TypeScript, Tauri 2 and Rust', 'Deliver browser and Windows interfaces.'),
        d('ExcelJS, Papa Parse, big.js and Zod', 'Parse, validate and calculate without unsafe coercion.'),
        d('IndexedDB and local configuration', 'Keep operational state within the client boundary.')),
      'safety-standards': section('Software quality and accessibility references apply.',
        r('ISO/IEC 25010', 'Software-product quality reference.'),
        r('ISO/IEC 25012', 'Structured-data quality reference.'),
        r('WCAG 2.2', 'Accessibility reference for operator workflows.')),
      'verification-testing': section('The record documents automated and adversarial checks.',
        p('Unit, integration and property-based tests', 'Exercise parsing, matching and pricing.'),
        p('Playwright and axe-core', 'Exercise end-to-end and accessibility behaviour.'),
        p('Formula-injection and data-safety checks', 'Block unsafe outputs and accidental publication.')),
    },
    connections: softwareFlow,
  },

  'inventory-scanning-mobile-robot': {
    basis: 'The deployed operator-support robot and review boundary are documented. The exact client build remains private, so this is an inferred reference architecture selected for the published mobility, scanning and data-integrity requirements.',
    areas: {
      'controller-compute': section('High-level autonomy is separated from real-time motion and safety I/O.',
        i('NVIDIA Jetson Orin Nano', 'Runs perception, mapping and scan association.', 'Edge GPU compute suits barcode or vision workloads.', 'ent-nvidia-jetson'),
        i('STM32G4 or STM32H7', 'Closes wheel loops and supervises the host.', 'A real-time MCU isolates low-level motion from Linux.', 'ent-stm32')),
      'electronics-electrical': section('Traction power is isolated from compute and retains a direct stop path.',
        i('24 V LiFePO4 pack, BMS, fuse and disconnect', 'Supplies a serviceable indoor mobile platform.', 'LiFePO4 offers cycle life and a conservative thermal profile.'),
        i('Dual motor drivers, protected DC-DC rails and hard-wired E-stop', 'Drive the base while protecting compute.', 'Operator support requires stable power and independent drive disable.')),
      mechanical: section('A compact differential-drive base provides manoeuvrability and service access.',
        i('6061 aluminium modular chassis', 'Carries battery, compute, drive and scanner mast.', 'Low-volume builds benefit from adjustable aluminium structure.'),
        i('Geared drive wheels, encoders, castors and guarded bumper', 'Implements measurable indoor mobility.', 'This is a simple zero-radius base with a physical contact boundary.')),
      'sensors-instrumentation': section('Navigation, identification and contact sensing are independent evidence channels.',
        i('2D LiDAR', 'Provides obstacle range and scan matching.', 'Indoor aisle navigation benefits from a planar range field.'),
        i('Global-shutter barcode camera or industrial 2D scanner', 'Captures item identity.', 'The workflow associates items and locations.'),
        i('Encoders, IMU, ToF zones and bumper switches', 'Support odometry and near-field coverage.', 'No one sensor covers every indoor failure mode.')),
      'communications-interfaces': section('Field buses stay inside the robot; reviewed observations leave through an explicit service.',
        i('CAN FD', 'Links host, motor controller and I/O nodes.', 'Differential signalling is robust around motors.'),
        i('USB or GigE', 'Connects scanner and LiDAR.', 'These interfaces support higher-bandwidth perception.'),
        i('Wi-Fi or Ethernet', 'Transfers observations to operator review.', 'The data boundary retains human approval.')),
      'software-control': section('The autonomy stack retains a review state for uncertain identification or localisation.',
        i('Ubuntu, JetPack, ROS 2 and Nav2', 'Provide drivers, localisation, planning and lifecycle supervision.', 'These suit a Jetson-class indoor robot.'),
        i('EKF fusion and velocity PID', 'Combine odometry and IMU while closing drive loops.', 'Estimation and motor control remain separate.'),
        d('Operator confirmation workflow', 'Stops uncertain observations from changing inventory records.')),
      'safety-standards': section('These are design references only; no certification, PL or SIL is claimed.',
        r('ISO 12100 and AS/NZS 4024', 'Risk-assessment and machinery-safety references.'),
        r('ISO 3691-4:2023', 'Relevant only if the platform is within driverless industrial truck scope.'),
        r('ISO 13849-1 and -2', 'Relevant after safety functions and required performance are defined.'),
        r('IEC 60204-1', 'Relevant where the machine electrical-equipment scope is met.')),
      'verification-testing': section('Operational use is documented; quantitative results remain private.',
        p('Deployment and active-use confirmation', 'Provides integrated operational evidence.'),
        q('Route replay, localisation-loss and obstacle intrusion tests', 'Exercise degradation and recovery.', 'Navigation results are not public.'),
        q('Scan confusion matrix and safety-function validation', 'Quantifies identification and stop behaviour.', 'No certified result is claimed.')),
    },
    connections: robotFlow,
  },

  'modular-education-testing-robot': {
    basis: 'The deployed modular platform and supervised test purpose are documented. The board families below are inferred selections that make the replaceable-module architecture concrete without claiming the exact private build.',
    areas: {
      'controller-compute': section('A host plus interchangeable teaching controllers exposes compute and real-time I/O.',
        i('Raspberry Pi 5 host', 'Runs dashboards, ROS 2 exercises and test orchestration.', 'A Linux host supports several teaching stacks.', 'ent-raspberry-pi'),
        i('ODROID N2+ host alternative', 'Provides a robust Linux host for the same orchestration role.', 'A replaceable host makes compute trade-offs visible.', 'ent-alt-sbc'),
        i('Raspberry Pi Pico 2 W module', 'Provides programmable I/O and a wireless MCU target.', 'Replaceable controllers are central to the platform.', 'ent-rpi-pico'),
        i('Arduino UNO R4 module', 'Provides an approachable general-purpose teaching target.', 'The controller bay is intended to expose architecture choices.', 'ent-arduino'),
        i('ESP32 module', 'Provides a wireless MCU target.', 'The controller bay is intended to expose architecture choices.', 'ent-esp32'),
        i('STM32 Nucleo or Discovery module', 'Provides an industrial real-time MCU target.', 'The controller bay is intended to expose architecture choices.', 'ent-stm32'),
        i('BBC micro:bit V2 module', 'Adds a beginner-focused sensor and display target.', 'It broadens the supervised education path.', 'ent-microbit'),
        i('Adafruit Feather module', 'Adds compact battery-capable controller options.', 'It broadens portable modular prototyping.', 'ent-adafruit-feather')),
      'electronics-electrical': section('A current-limited backplane prevents one module from disturbing the platform.',
        i('12 V SELV input with fused 5 V and 3.3 V branches', 'Powers logic and low-energy actuation.', 'A bounded supply suits supervised bench use.'),
        i('Replaceable motor drivers with per-port current limiting', 'Separates actuator current and contains wiring faults.', 'The platform supports varied actuation and predictable mistakes.')),
      mechanical: section('The structure exposes interfaces and survives repeated reconfiguration.',
        i('2020 aluminium extrusion and PETG module plates', 'Creates a reusable chassis with visible datums.', 'T-slot structure suits layout changes.'),
        i('Captive fasteners, guarded gears, wheels, servos and stepper axes', 'Supports safe repeated module replacement.', 'The platform demonstrates continuous, angular and indexed motion.')),
      'sensors-instrumentation': section('Pluggable sensors expose state and let tests repeat across modalities.',
        i('Ultrasonic, ToF and infrared modules', 'Compare range sensing and filtering.', 'These are low-energy education sensors.'),
        i('IMU, encoder, Hall, limit, current and temperature modules', 'Expose motion, position and electrical state.', 'Instrumentation makes experiments observable.')),
      'communications-interfaces': section('Selected reference buses let modules be exchanged without hiding contracts.',
        i('I2C, SPI, UART and CAN', 'Connect sensors, controllers and distributed I/O.', 'These span board-level and robust differential buses.'),
        i('USB, Wi-Fi, BLE and keyed Grove/Qwiic adapters', 'Support programming, telemetry and reliable module wiring.', 'The selected board families support these paths.')),
      'software-control': section('Multiple toolchains share one observable test contract.',
        i('C/C++, MicroPython and CircuitPython', 'Stage learning from scripts to deterministic firmware.', 'The proposed board families support them.'),
        i('ROS 2 or Python host harness', 'Orchestrates tests and records telemetry.', 'A shared harness supports repeatability.'),
        i('PID and finite-state exercises', 'Demonstrate feedback and sequence control.', 'These are foundational control patterns.')),
      'safety-standards': section('References depend on final classification and do not establish certification.',
        r('ISO 12100 and AS/NZS 4024 principles', 'Guide hazard identification and guarding.'),
        r('IEC 61010-1', 'Potential reference for educational test or control equipment.'),
        r('IEC 62368-1', 'Potential ICT or AV equipment reference.'),
        r('Australian EMC and RCM supplier process', 'Requires product-specific evidence if supplied.')),
      'verification-testing': section('Interfaces should be proved independently before system exercises.',
        p('Deployment and active-use confirmation', 'Provides operational evidence for supervised use.'),
        q('Module contract and wrong-connection tests', 'Verify pinout, voltage and fault containment.', 'Exact component evidence is private.'),
        q('Repeatability, calibration and guard checks', 'Verify each released configuration.', 'No certified result is claimed.')),
    },
    connections: robotFlow,
  },

  'engineering-mastery-lab': {
    basis: 'This is a documented browser-first and desktop-capable engineering application. Hardware domains describe systems modelled by the software, not hardware built for the application.',
    areas: {
      'controller-compute': section('Browser or desktop compute hosts the workbench.', d('Browser or Tauri desktop host', 'Runs React, Three.js and local project state.')),
      'electronics-electrical': section('No dedicated electronics are required.', na('Circuits are calculation subjects rather than application hardware.')),
      mechanical: section('No physical mechanism is part of the workbench.', na('CAD and mechanics are modelled in software.')),
      'sensors-instrumentation': section('User parameters replace live instrumentation.', na('The public workbench does not claim physical sensor connection.')),
      'communications-interfaces': section('Optional local adapters extend the browser-first core.',
        d('Browser-local project storage', 'Keeps work and evidence local.'),
        d('Optional ngspice and KiCad CLI adapters', 'Compare local circuit or design artefacts.')),
      'software-control': section('Input contracts and bounded models are the control boundary.',
        d('React 18, TypeScript, Vite and React Router', 'Implement the workbench and guided labs.'),
        d('Three.js', 'Renders bounded parametric geometry.'),
        d('Tauri 2 and Rust', 'Provide desktop-capable local-tool integration.')),
      'safety-standards': section('Quality and accessibility references apply; certification is not claimed.',
        r('ISO/IEC 25010', 'Software-quality reference.'),
        r('ISO/IEC/IEEE 29119', 'Software-test process reference.'),
        r('WCAG 2.2', 'Accessibility reference.')),
      'verification-testing': section('Each calculator needs a traceable engineering result as well as code tests.',
        p('Vitest and production-build checks', 'Exercise input and application behaviour.'),
        q('Golden calculations against named design references', 'Prevent engineering-wrong but numerically stable outputs.', 'The governing basis must be named per calculator.')),
    },
    connections: softwareFlow,
  },

  'veerai-slm': {
    basis: 'Local inference, retrieval, governed ingestion, memory, tools and evaluation are documented. The exact private model and host remain unpublished, so hardware is expressed as a class.',
    areas: {
      'controller-compute': section('A local accelerator host keeps knowledge and inference inside the boundary.',
        i('x86-64 workstation with NVIDIA CUDA GPU', 'Runs quantised inference, embeddings and evaluation.', 'A local SLM benefits from mature GPU runtimes.'),
        i('NVMe storage and 32 GB or more RAM', 'Stores weights, indexes and evaluation artefacts.', 'Retrieval and model loading are storage and memory intensive.')),
      'electronics-electrical': section('No custom electronics are disclosed.', na('Host-computer power and cooling are used.')),
      mechanical: section('No mechanism or custom enclosure is disclosed.', na('This is a private local compute stack.')),
      'sensors-instrumentation': section('Approved documents and evaluation sets are the inputs.', na('No physical sensor pipeline is published.')),
      'communications-interfaces': section('Only approved ingestion and bounded tool calls cross interfaces.',
        d('Governed ingestion and retrieval', 'Controls which knowledge enters context.'),
        d('Bounded tool interface', 'Separates model output from actions.'),
        i('Loopback-only HTTP or local IPC', 'Links UI, runner, retrieval and tools.', 'The system is private and local.')),
      'software-control': section('Retrieval, memory and policies surround the model.',
        d('Local open-weight inference and RAG', 'Produces responses grounded in approved knowledge.'),
        d('Controlled memory, tools and evaluation', 'Limits persistence, action and evidence boundaries.'),
        i('Python orchestration with local runner and vector index', 'Composes ingestion, retrieval and evaluation.', 'This is a maintainable stack for the documented functions.')),
      'safety-standards': section('Governance references do not imply organisational certification.',
        r('ISO/IEC 23894', 'AI risk-management guidance.'),
        r('ISO/IEC 25010', 'Software-quality reference.'),
        r('Selected ISO/IEC 27002 controls', 'Security-control reference for local data and artefacts.')),
      'verification-testing': section('Evaluation observes grounded responses and feeds back into the pipeline.',
        p('Evaluation harness', 'Checks controlled cases.'),
        q('Retrieval recall, grounding, refusal and prompt-injection suites', 'Separate retrieval, generation and tool failures.', 'Private metrics and datasets are not published.')),
    },
    connections: aiFlow,
  },

  'autonomous-navigation-rover': {
    basis: 'The ROS 2 autonomy stack is documented as simulation-validated, not physically deployed. All physical components are a future reference build, not historical hardware.',
    areas: {
      'controller-compute': section('Companion compute runs navigation while an MCU owns wheel I/O.',
        i('NVIDIA Jetson Orin Nano', 'Runs ROS 2, SLAM and Nav2.', 'The stack can migrate to compact edge compute.', 'ent-nvidia-jetson'),
        i('Pico 2 or STM32G4', 'Handles encoders, PWM and watchdog.', 'Wheel control should not depend on Linux scheduling.', 'ent-rpi-pico')),
      'electronics-electrical': section('A proposed 12 V power tree separates motors from compute.',
        i('12 V LiFePO4, BMS, fuse and dual H-bridge', 'Supplies and drives a small rover.', 'This is a conservative indoor development supply.'),
        i('Isolated 5 V buck rail', 'Protects companion compute from motor transients.', 'Traction and logic loads need separation.')),
      mechanical: section('The future physical reference follows the simulated differential-drive model.',
        i('Aluminium modular chassis', 'Carries battery, compute and sensors.', 'A simple chassis supports development access.'),
        i('Geared DC motors with encoders', 'Implements wheel odometry and differential drive.', 'The software already models these states.')),
      'sensors-instrumentation': section('Simulated sensor classes define the proposed physical set.',
        d('Simulated LiDAR, IMU and wheel odometry', 'Feed mapping and state estimation.'),
        i('Bumper and near-field ToF', 'Cover blind zones in a future build.', 'Physical deployment needs independent close-range protection.')),
      'communications-interfaces': section('ROS 2 DDS links software; a future MCU boundary carries wheel I/O.',
        d('ROS 2 DDS topics, services and transforms', 'Connect mapping, planning and control.'),
        i('CAN FD or USB serial', 'Carries commands, encoders and watchdog state.', 'Either makes the real-time boundary explicit.')),
      'software-control': section('The simulation covers mapping, planning, fusion and control.',
        d('ROS 2 Humble, Nav2, Gazebo and RViz', 'Provide simulation and navigation lifecycle.'),
        d('LiDAR SLAM, A*, Kalman or EKF and PID', 'Map, plan, estimate and control.')),
      'safety-standards': section('Physical references apply only if the rover is built and deployed.',
        r('ISO 12100', 'Future physical risk-assessment reference.'),
        r('ISO 3691-4:2023', 'Potential reference only if the platform is in scope.'),
        r('ISO 13849', 'Potential reference after safety functions are defined.')),
      'verification-testing': section('Current evidence remains simulation-only.',
        p('Gazebo and RViz scenario validation', 'Exercises mapping, planning and recovery.'),
        q('Hardware-in-the-loop and physical stop tests', 'Verify timing, saturation and safety before deployment.', 'No physical rover is claimed.')),
    },
    connections: robotFlow,
  },

  'jag-smart-factory': {
    basis: 'The Siemens engineering environment, supervisory migration, protocols, regulated validation and commissioning work are documented. Exact client CPUs, I/O, drives and instruments remain confidential.',
    areas: {
      'controller-compute': section('PLC and supervisory compute coordinate the manufacturing system.',
        d('Siemens PLC and distributed control environment', 'Runs IEC 61131-3 logic and plant interfaces.'),
        i('S7-1500 and ET 200 class hardware', 'Provides modern TIA Portal PLC and remote I/O.', 'Exact client hardware is unpublished.'),
        d('WinCC, PCS 7, iFIX and PVI+', 'Provide HMI, SCADA, DCS and migration platforms.')),
      'electronics-electrical': section('Industrial panels distribute control power and isolate field signals.',
        i('24 V DC protection, relays, isolated I/O and drives', 'Feeds PLC, instruments and actuators.', 'This is the expected panel architecture for the documented environment.')),
      mechanical: section('Client equipment forms the controlled plant.',
        d('Process equipment, field devices and drives', 'Provide the controlled production system.'),
        i('Pumps, valves, conveyors and guarded mechanisms', 'Execute process and machine sequences.', 'Exact client assets are confidential.')),
      'sensors-instrumentation': section('Field instrumentation supplies measurements, permissives and alarms.',
        d('Industrial field devices and instruments', 'Provide process values and machine state.'),
        i('Pressure, temperature, flow, level and proximity channels', 'Represent common process signal classes.', 'Exact loop lists are not published.')),
      'communications-interfaces': section('Industrial networks connect field, controller and supervisory layers.',
        d('PROFINET and Modbus', 'Connect control, I/O, drives and gateways.'),
        d('SCADA, MES and batch interfaces', 'Move validated states, recipes and records.')),
      'software-control': section('Engineering change controls PLC logic and supervisory migration.',
        a('IEC 61131-3', 'Defines documented PLC programming.'),
        d('TIA Portal, WinCC, PCS 7, iFIX and PVI+', 'Support engineering and migration.'),
        d('MES and batch integration', 'Connects execution records to control state.')),
      'safety-standards': section('GMP and GAMP 5 are documented; safety and OT references remain scope-dependent.',
        a('GMP environment and GAMP 5 practice', 'Structure validated-system change and evidence.'),
        a('IEC 61131-3', 'Provides the PLC-language framework.'),
        r('ISO 12100, ISO 13849 or IEC 62061', 'Relevant where machine safety functions exist.'),
        r('IEC 62443', 'Relevant where OT cybersecurity is in scope.')),
      'verification-testing': section('Commissioning and qualification evidence are first-class outputs.',
        p('FAT, SAT, commissioning and qualification', 'Check functions and preserve traceable evidence.'),
        q('Safety-function and OT-security validation', 'Required where those functions are approved scope.', 'No PL, SIL or IEC 62443 conformity is claimed.')),
    },
    connections: automationFlow,
  },

  'adas-can-validation': {
    basis: 'Vehicle-network validation, CAN/CAN FD tooling, instrumentation and regression evidence are documented. Confidential ECUs, features and programme details remain general.',
    areas: {
      'controller-compute': section('Vehicle ECUs are under test and a Vector workstation controls analysis.',
        d('Vehicle ECUs', 'Exchange feature and diagnostic state.'),
        d('CANoe and CANalyzer workstation', 'Stimulates, captures and compares network behaviour.')),
      'electronics-electrical': section('Protected vehicle interfaces support repeatable capture.',
        i('Fused 12 V breakout, bench supply and isolated interface', 'Powers or observes ECUs safely.', 'This is an appropriate validation bench boundary.'),
        d('Vehicle instrumentation', 'Provides electrical and timing evidence.')),
      mechanical: section('The vehicle or breadboard is the physical system under test.', d('Vehicle and breadboard context', 'Carries real sensors, actuators and ECUs.')),
      'sensors-instrumentation': section('Instruments correlate physical behaviour with network state.',
        d('Vehicle instrumentation and bus capture', 'Create trace-correlated evidence.'),
        i('Oscilloscope or logic timing checks', 'Resolve questions a decoded trace cannot.', 'Exact bench instruments are confidential.')),
      'communications-interfaces': section('CAN and CAN FD are the documented backbone.',
        d('CAN and CAN FD', 'Carry feature, diagnostic and state frames.'),
        d('Vector trace and database workflow', 'Decodes and preserves fault evidence.')),
      'software-control': section('Configurations and procedures control evidence collection.',
        d('CANoe and CANalyzer', 'Configure capture, stimulation and analysis.'),
        d('Feature, breadboard and OTA regression', 'Compare behaviour across changes.')),
      'safety-standards': section('References apply without implying ASIL or conformity ownership.',
        r('ISO 11898', 'CAN and CAN FD protocol basis.'),
        r('ISO 26262', 'Reference for safety-related E/E malfunction.'),
        r('ISO 21448', 'Reference for ADAS intended-function limits.'),
        r('UNECE R156', 'OEM-level update reference where applicable.')),
      'verification-testing': section('The record is built around trace-backed validation.',
        p('Feature, breadboard and OTA regression tests', 'Check integrated behaviour.'),
        p('Trace-backed defect evidence', 'Links failures to reproducible records.')),
    },
    connections: testFlow,
  },

  'emissions-compliance-testing': {
    basis: 'Calibrated emissions instrumentation, DAQ, ADR/EURO procedures and auditable QA records are documented. Exact analyser models, regulatory revisions and accreditation scope are not inferred.',
    areas: {
      'controller-compute': section('A DAQ and workstation coordinate channels and run records.', d('DAQ and test workstation', 'Collects calibrated measurements into an auditable record.')),
      'electronics-electrical': section('Conditioned acquisition protects signal integrity.',
        i('Isolated analogue, frequency and CAN acquisition', 'Collects heterogeneous channels on one time base.', 'The work spans emissions instruments, DAQ and vehicle data.'),
        i('Protected vehicle and instrument power', 'Supplies equipment without corrupting measurements.', 'Exact cell hardware is private.')),
      mechanical: section('The vehicle and sample path create the physical measurement system.',
        d('Vehicle test configuration', 'Provides the prescribed operating condition.'),
        i('Heated sample lines and leak-controlled fittings', 'Preserve representative gas transport.', 'The analyser arrangement is not published.')),
      'sensors-instrumentation': section('Calibrated instruments are the centre of the evidence chain.',
        d('Calibrated emissions instrumentation', 'Measures regulated or investigated constituents.'),
        d('Vehicle and environmental channels', 'Contextualise each run.')),
      'communications-interfaces': section('DAQ, vehicle and laboratory records share identity and time.',
        d('DAQ and vehicle-data interfaces', 'Bring measurements into the run record.'),
        i('CAN and synchronised file export', 'Align vehicle and analyser state.', 'Exact interfaces are not published.')),
      'software-control': section('Procedures and analysis convert measurement into evidence.',
        d('ADR and EURO procedures', 'Define the test method and acceptance basis.'),
        d('Calibration, QA and reporting workflow', 'Preserves traceability.')),
      'safety-standards': section('Only the contemporaneous procedure establishes the exact basis.',
        a('ADR and EURO requirements', 'Provide the documented framework.'),
        r('Exact ADR, UNECE or EU regulation in the procedure', 'Must come from the project record.'),
        r('ISO/IEC 17025', 'Relevant only if confirmed by the accredited scope.')),
      'verification-testing': section('Calibration and run records are documented.',
        p('Instrument calibration, QA and repeat runs', 'Establish readiness and consistency.'),
        q('Procedure-to-regulation trace matrix', 'Pins results to exact requirements.', 'The public record omits guessed regulation numbers.')),
    },
    connections: testFlow,
  },

  'iot-monitoring-platform': {
    basis: 'The custom PCB, ESP32 firmware, CAN/GNSS/sensing, LoRaWAN AU915, edge networking and Linux data stack are documented. Exact SKUs and environmental qualification remain unpublished.',
    areas: {
      'controller-compute': section('An embedded node acquires data and Linux services store it.',
        d('ESP32 custom-board controller', 'Samples, packages and transmits field records.', 'ent-esp32'),
        d('MikroTik edge and Linux server', 'Provide networking, ingestion and operations.')),
      'electronics-electrical': section('Mobile-equipment power requires transient protection.',
        i('12/24 V fuse, reverse-polarity protection, TVS and buck regulator', 'Protects the custom PCB.', 'Agricultural equipment supplies are electrically harsh.'),
        d('Custom PCB', 'Integrates CAN, GNSS, sensing and connectivity.')),
      mechanical: section('Field mounting and environmental protection are part of the system.',
        d('Enclosure and equipment mounting', 'Secures electronics and antenna.'),
        i('Gasketed enclosure, cable glands and vibration-isolated bracket', 'Improves field serviceability and durability.', 'No tested IP rating is claimed.')),
      'sensors-instrumentation': section('Machine, position and condition channels create the health record.',
        d('CAN capture', 'Reads equipment state without control authority.'),
        d('GPS/GNSS', 'Associates data with location and time.'),
        d('Environmental and condition sensors', 'Add health context.')),
      'communications-interfaces': section('A low-power field link feeds edge and time-series services.',
        d('CAN and GNSS', 'Acquire equipment and location data.'),
        d('LoRaWAN AU915, ChirpStack and MQTT', 'Move telemetry through the gateway.'),
        d('MikroTik networking', 'Provides field backhaul.')),
      'software-control': section('Firmware, ingestion and visualisation form an observable pipeline.',
        d('ESP32 firmware', 'Acquires, validates, buffers and transmits.'),
        d('Linux service, InfluxDB and Grafana', 'Ingest, store and present time-series data.'),
        d('ChirpStack and MQTT', 'Manage radio network and messaging.')),
      'safety-standards': section('These are references, not verified conformity.',
        r('ISO 11898', 'CAN protocol basis.'),
        r('IPC-2221 and IPC-A-610', 'PCB design and assembly references if adopted.'),
        r('IEC 60068 and IEC 60529', 'Environmental references only where tested.'),
        r('Australian EMC and RCM supplier process', 'Would require evidence before supply.')),
      'verification-testing': section('An active field trial is documented.',
        p('Bench-to-field telemetry checks and active trial', 'Verify the end-to-end path.'),
        q('Load-dump, ESD, vibration, ingress and radio tests', 'Qualify a product release.', 'Formal EMC pre-compliance is not claimed.')),
    },
    connections: automationFlow,
  },

  'ataxia-assessment-device': {
    basis: 'ESP32 control, IMU, ToF, Hall and magnetic sensing, embedded acquisition and MATLAB processing are documented for a university proof-of-concept. Medical productisation remains prospective.',
    areas: {
      'controller-compute': section('ESP32 acquires signals and MATLAB performs analysis.',
        d('ESP32', 'Samples and timestamps movement events.', 'ent-esp32'),
        d('MATLAB workstation', 'Processes and visualises traces.')),
      'electronics-electrical': section('Low-noise power and defined logic levels support repeatability.',
        i('USB or protected Li-ion supply', 'Powers the portable prototype.', 'The exact board and battery are private.'),
        i('Decoupling, level adaptation and ESD protection', 'Stabilises mixed sensor interfaces.', 'Several digital and magnetic sensors are combined.')),
      mechanical: section('A repeatable fixture preserves sensor geometry.',
        i('PETG fixture with adjustable mounts', 'Maintains sensor spacing.', 'A proof-of-concept benefits from modifiable geometry.'),
        i('Rounded contact surfaces and retained fasteners', 'Reduce obvious supervised-use hazards.', 'No biocompatibility claim is made.')),
      'sensors-instrumentation': section('Multiple modalities observe motion and position.',
        d('IMU', 'Measures acceleration and angular rate.'),
        d('Time-of-flight sensor', 'Measures range.'),
        d('Hall-effect sensor and magnetometer', 'Measure magnetic position cues.')),
      'communications-interfaces': section('Embedded buses feed a deterministic MATLAB path.',
        i('I2C and GPIO', 'Connect sensors to ESP32.', 'These are conventional interfaces for the documented sensors.'),
        d('Serial or logged-data transfer', 'Carries timestamped records to MATLAB.')),
      'software-control': section('Acquisition and offline processing remain separate.',
        d('Embedded C/C++ deterministic acquisition', 'Samples and timestamps channels.'),
        d('MATLAB logging and processing', 'Filters, plots and compares records.'),
        i('Finite-state trial controller and calibration record', 'Makes trials repeatable.', 'The project is a structured assessment proof-of-concept.')),
      'safety-standards': section('The prototype is not a certified medical device.',
        r('ISO 14971', 'Future medical-device risk-management reference.'),
        r('IEC 62304', 'Future medical software lifecycle reference.'),
        r('IEC 60601-1 and -1-2', 'Future electrical safety and EMC references.'),
        r('IEC 62366-1 and ISO 10993', 'Future usability and biocompatibility references where applicable.')),
      'verification-testing': section('Prototype assessment is documented; clinical validation is not.',
        p('Deterministic acquisition and MATLAB trace review', 'Check timing and plausibility.'),
        p('Assessed university proof-of-concept', 'Provides academic implementation evidence.'),
        q('Calibration and repeatability protocol', 'Quantifies measurement uncertainty.', 'No clinical performance is claimed.')),
    },
    connections: testFlow,
  },

  'digital-twin-industrial-ai': {
    basis: 'The equipment-state model, simulated telemetry, anomaly logic, predictive-maintenance concepts and OEE dashboard are documented as a working demonstration, not a live plant deployment.',
    areas: {
      'controller-compute': section('A local workstation or server hosts simulation and analytics.', d('Python-capable host', 'Runs state, feature, anomaly and dashboard services.')),
      'electronics-electrical': section('No custom hardware is connected.', na('Electrical behaviour is simulated.')),
      mechanical: section('Equipment behaviour is modelled.', na('No plant asset is physically built.')),
      'sensors-instrumentation': section('Synthetic tags make fault cases reproducible.', d('Simulated telemetry', 'Produces normal, degraded and anomalous states.')),
      'communications-interfaces': section('A future OT adapter remains an explicit boundary.',
        i('OPC UA or MQTT adapter', 'Maps approved tags into the model.', 'These protocols fit industrial telemetry; no live link is claimed.'),
        d('Dashboard and agent interface', 'Presents state, OEE and reasoning.')),
      'software-control': section('State, analytics and agents stay visible.',
        d('Python equipment-state model', 'Defines transitions and operating behaviour.'),
        d('Anomaly and predictive-maintenance logic', 'Produces diagnostic signals.'),
        d('OEE dashboard and AI agents', 'Expose performance and interpretation.')),
      'safety-standards': section('Architecture references apply without live-plant conformity.',
        r('ISO 23247', 'Manufacturing digital-twin reference.'),
        r('ISO 22400', 'Manufacturing KPI and OEE reference.'),
        r('IEC 62264 or ISA-95', 'Enterprise, operations and control boundary reference.')),
      'verification-testing': section('Simulation supports repeatable fault injection.',
        p('Normal and anomalous scenario replay', 'Checks state and alert behaviour.'),
        q('Historical back-test and OT adapter contract tests', 'Measure performance and read-only integration.', 'No live dataset or plant link is claimed.')),
    },
    connections: aiFlow,
  },

  'manufacturing-qa-foundation': {
    basis: 'This record consolidates experience across several sites rather than one owned machine. The architecture is the recurring production-system pattern, with exact components kept site-specific.',
    areas: {
      'controller-compute': section('Vendor PLC, robot and line controllers coordinate installed assets.',
        d('KUKA robot and packaging-line controls', 'Run encountered automated equipment.'),
        i('Siemens or Allen-Bradley PLC and HMI class', 'Provide recurring machine control.', 'Exact site families are unconfirmed.')),
      'electronics-electrical': section('Industrial distribution, drives and safety circuits support production.',
        i('24 V panels, VFDs, contactors and safety relays', 'Power conveyors, pumps and guarded tooling.', 'This is a cross-site pattern, not a panel schedule.')),
      mechanical: section('Packaging, composite and fabricated systems form the work.',
        d('Fillers, seamers, conveyors and packaging equipment', 'Process beverage products.'),
        d('KUKA layup and demoulding cells', 'Automate composite stages.'),
        d('Fabrication and pressure-vessel work', 'Connect drawings and traceability to hardware.')),
      'sensors-instrumentation': section('Machine sensors and QA instruments establish process and acceptance evidence.',
        d('NDE and mechanical-test evidence exposure', 'Supports review of composite and fabricated acceptance records without claiming test execution.'),
        i('Photoelectric, proximity, pressure and position sensors', 'Provide common machine-state inputs.', 'Exact devices are site-specific.')),
      'communications-interfaces': section('Machine networks and documents connect production to quality.',
        i('Industrial Ethernet and field I/O', 'Connect controllers, drives and sensors.', 'Exact protocols are unconfirmed.'),
        d('ITP, MDR, drawing and traceability records', 'Carry acceptance and as-built evidence.')),
      'software-control': section('Installed software is vendor-owned; the work centres on operation and quality.',
        d('Robot and line operator interfaces', 'Support production, commissioning and recovery.'),
        d('KPI, Lean and quality workflows', 'Turn observations into controlled improvement.')),
      'safety-standards': section('Exact codes must come from original job records.',
        d('Broad AS/NZS structural-steel compliance-record exposure', 'Supports traceability without certification authority.'),
        r('ISO 12100, ISO 10218 and AS/NZS 4024', 'References where installed equipment is in scope.'),
        r('Project-specific welding and pressure-vessel standards', 'Must be confirmed from contracts.')),
      'verification-testing': section('The evidence chain links drawings and process to release.',
        p('ITP, MDR and material-traceability review', 'Checks hold points and records.'),
        d('NDE and mechanical-test records', 'Provide acceptance context; personal test execution is not claimed.'),
        p('Commissioning, KPI and first-response checks', 'Support stable operation.')),
    },
    connections: automationFlow,
  },

  'carbon-revolution-rim-layup': {
    basis: 'KUKA layup and demoulding, composite processing, downstream NDE and mechanical-test stages, and traceability are documented. Controller and cell-safety hardware are inferred reference architecture, not personal design, programming or certification claims.',
    areas: {
      'controller-compute': section('Robot, line and safety controllers coordinate the cell.',
        d('KUKA industrial robot platform', 'Performs layup and demoulding motion.'),
        i('KUKA robot controller, exact generation unconfirmed', 'Runs robot motion and I/O.', 'The cell uses KUKA robots, but the installed controller generation is not published.'),
        i('Line PLC and safety PLC', 'Coordinate fixtures, guards and permissives.', 'Integrated cells need machine and safety boundaries.')),
      'electronics-electrical': section('Servo drives, 24 V control and safety switching support motion.',
        i('Robot drives, control panel and safety contactors', 'Power axes and remove energy under stop conditions.', 'Exact installed parts are private.'),
        i('Tool I/O and pneumatic or vacuum valve island', 'Actuate process tooling.', 'Composite handling needs controlled end-effectors.')),
      mechanical: section('Robots, tooling, moulds and guards form the system.',
        d('KUKA layup and demoulding cells', 'Automate material placement and handling.'),
        i('Vacuum or compliant gripping tooling', 'Handles material and parts.', 'Exact tooling is process-specific.'),
        d('Cure, machining and test stages', 'Complete manufacturing and acceptance.')),
      'sensors-instrumentation': section('Cell sensors protect sequence integrity and tests verify product.',
        i('Part-present, position, vacuum and guard sensors', 'Confirm state before motion.', 'These are expected functions, not a device list.'),
        d('NDE and mechanical-test stages', 'Provide downstream product evidence; personal test execution is not claimed.')),
      'communications-interfaces': section('Robot, PLC, safety and traceability exchange bounded state.',
        i('Industrial Ethernet and safety fieldbus', 'Connect cell controllers and I/O.', 'Exact protocol is unconfirmed.'),
        d('Production traceability records', 'Link material and process to test evidence.')),
      'software-control': section('The record covers operation and support, not programme authorship.',
        d('KUKA cell operation and line recovery', 'Support ramp-up, quality and throughput.'),
        i('PLC sequence and robot programme coordination', 'Synchronises tooling and motion.', 'This describes architecture, not personally authored code.')),
      'safety-standards': section('Cell-level references do not imply personal conformity ownership.',
        r('ISO 10218-1 and -2', 'Industrial robot and application safety references.'),
        r('ISO 12100 and ISO 13849', 'Risk and safety-control references.'),
        r('IEC 60204-1 and AS/NZS 4024', 'Machine electrical and Australian safety references.')),
      'verification-testing': section('Product evidence is documented; cell design verification is not attributed.',
        p('First-off, defect-inspection, traceability and line-recovery checks', 'Support product quality and stable output within the documented role.'),
        d('NDE and mechanical-test results', 'Provide downstream process context; personal test execution is not claimed.')),
    },
    connections: automationFlow,
  },

  'idl-canning-line': {
    basis: 'Hands-on installation, commissioning, operation and quality work on beverage equipment is documented. Exact vendor controllers, machine counts and licensed electrical scope remain unconfirmed.',
    areas: {
      'controller-compute': section('Vendor PLCs and HMIs coordinate packaging sequences.',
        i('Compact S7-1200 or equivalent packaging PLC', 'Runs interlocks and sequencing.', 'The class fits the equipment; exact vendor is unconfirmed.'),
        i('Touch HMI', 'Exposes recipes, faults and counts.', 'Operation and commissioning support are documented.')),
      'electronics-electrical': section('Motor control and 24 V I/O support the line.',
        i('VFDs, starters, 24 V I/O and safety relays', 'Power conveyors, pumps and auxiliaries.', 'This is a reference architecture, not a panel schedule.'),
        i('Washdown-capable enclosures and connectors', 'Protect field equipment.', 'No specific IP rating is claimed.')),
      mechanical: section('Stainless machinery and conveyors create product flow.',
        d('Fillers, seamers, conveyors and packaging equipment', 'Process, close and transfer containers.'),
        d('WestRock and Fibre King equipment', 'Forms and handles secondary packaging.'),
        i('Guides, change parts, pumps and pneumatic stops', 'Support transfer and format change.', 'Exact detail is site-specific.')),
      'sensors-instrumentation': section('Presence and process signals coordinate line state.',
        i('Photoelectric and proximity sensors', 'Detect containers and machine positions.', 'These are typical functions on the documented line class.'),
        i('Pressure, flow, level and temperature instruments', 'Monitor filling and utilities.', 'Exact loops are not public.'),
        d('Quality and KPI observations', 'Connect operation to accepted output.')),
      'communications-interfaces': section('Machine networks coordinate drives and I/O.',
        i('Industrial Ethernet or fieldbus', 'Links PLC, HMI, VFDs and remote I/O.', 'Exact protocol is unconfirmed.'),
        d('Changeover, quality and KPI records', 'Carry operating evidence into review.')),
      'software-control': section('Vendor sequences support operation; authorship is not claimed.',
        i('PLC interlocks, recipes and line pacing', 'Coordinate product flow and restart.', 'This describes the control layer.'),
        d('Commissioning, changeover and first-response workflows', 'Support bring-up and recovery.')),
      'safety-standards': section('References do not attribute conformity or licensed work personally.',
        r('ISO 12100 and AS/NZS 4024', 'Risk and safeguarding references.'),
        r('IEC 60204-1 and ISO 13849', 'Electrical and safety-control references where in scope.'),
        r('Site food-safety procedures', 'Must be confirmed rather than inferred as certification.')),
      'verification-testing': section('Commissioning and operating checks are documented at support level.',
        p('Installation and commissioning checks', 'Support equipment bring-up.'),
        p('Quality, changeover, KPI and first-response checks', 'Verify output and restore operation within role boundaries.')),
    },
    connections: automationFlow,
  },

  'ndcc-website': {
    basis: 'This is a documented live software platform. Compute, storage, identity and external services are included; physical engineering domains are explicitly not applicable.',
    areas: {
      'controller-compute': section('Managed web and database platforms host the application.',
        d('Vercel', 'Builds and serves Next.js.'),
        d('Supabase Postgres and Storage', 'Store structured data and media.')),
      'electronics-electrical': section('No project-specific electronics are in scope.', na('The service uses managed infrastructure and user devices.')),
      mechanical: section('No physical mechanism is in scope.', na('Club operations are represented through web workflows.')),
      'sensors-instrumentation': section('Approved administrative data replaces sensing.', na('No live sensing pipeline is disclosed.')),
      'communications-interfaces': section('Public, admin and service boundaries use explicit permissions.',
        d('PlayHQ API', 'Imports approved competition data.'),
        d('Resend', 'Provides transactional email where configured.'),
        d('GitHub media publishing', 'Supports controlled content updates.')),
      'software-control': section('Typed routes, data access and protected admin form the boundary.',
        d('Next.js 14, TypeScript, React and Tailwind', 'Implement public and admin experiences.'),
        d('Supabase-backed custom authentication', 'Protects administration.'),
        d('Schema and smoke-test tooling', 'Checks contracts and routes.')),
      'safety-standards': section('Web quality, security and privacy references apply.',
        r('WCAG 2.2', 'Accessibility reference.'),
        r('ISO/IEC 25010', 'Software-quality reference.'),
        r('OWASP ASVS', 'Application-security verification reference.'),
        r('Australian Privacy Principles', 'Privacy reference where personal data is handled.')),
      'verification-testing': section('Live operation plus schema and route checks are documented.',
        p('Schema validation and smoke tests', 'Check database expectations and critical routes.'),
        p('Live production operation', 'Provides deployment evidence.'),
        q('Restore drill, access review and accessibility audit', 'Verify resilience and admin boundaries.', 'Exact audit evidence is not public.')),
    },
    connections: softwareFlow,
  },
}

const projectSlugs = new Set(projects.map((project) => project.slug))
const engineeringSlugs = new Set(Object.keys(projectEngineering))
const missing = [...projectSlugs].filter((slug) => !engineeringSlugs.has(slug))
const unknown = [...engineeringSlugs].filter((slug) => !projectSlugs.has(slug))

if (missing.length || unknown.length) {
  throw new Error(
    'Project engineering coverage mismatch. Missing: ' +
      (missing.join(', ') || 'none') +
      '. Unknown: ' +
      (unknown.join(', ') || 'none') +
      '.',
  )
}

for (const [slug, profile] of Object.entries(projectEngineering)) {
  const connectedAreas = new Set(
    profile.connections.flatMap((connection) => [connection.from, connection.to]),
  )
  for (const areaId of ENGINEERING_AREA_IDS) {
    const area = profile.areas[areaId]
    if (!area || area.items.length === 0) {
      throw new Error('Project engineering area ' + areaId + ' is empty for ' + slug + '.')
    }
    const applies = area.items.some((entry) => entry.status !== 'not-applicable')
    if (applies && !connectedAreas.has(areaId)) {
      throw new Error('Project engineering map omits applicable area ' + areaId + ' for ' + slug + '.')
    }
    for (const entry of area.items) {
      if ((entry.status === 'inferred' || entry.status === 'recommended') && !entry.rationale) {
        throw new Error('Project engineering item ' + entry.name + ' needs a rationale for ' + slug + '.')
      }
    }
  }
}

export function getProjectEngineering(slug: string): ProjectEngineeringProfile {
  const profile = projectEngineering[slug]
  if (!profile) throw new Error('No engineering profile exists for project ' + slug + '.')
  return profile
}
