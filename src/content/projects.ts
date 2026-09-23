export interface Project {
  readonly publication?: { readonly url: string; readonly label: string }
  readonly caseStudy?: string
  readonly category: 'Robotics' | 'Embedded' | 'Software' | 'Industrial'
  readonly trials?: readonly { readonly area: string; readonly result: string }[]
  readonly slug: string
  readonly title: string
  readonly proof: string
  readonly problem: string
  readonly system: string
  readonly architecture: string
  readonly ownership: string
  readonly decisions: readonly string[]
  readonly verification: string
  readonly stack: readonly string[]
  readonly systemPath: readonly { readonly label: string; readonly detail: string }[]
  readonly image?: {
    readonly src: string
    readonly alt: string
    readonly width: number
    readonly height: number
    readonly kind: 'Application interface' | 'System illustration' | 'PCB design render' | 'Production design concept - generated visualisation'
  }
}

export const projects: readonly [Project, Project, Project, ...Project[]] = [
  {
    slug: 'autonomous-navigation-rover',
    caseStudy: '/blog/ros2-navigation-rover-case-study/',
    category: 'Robotics',
    title: 'Autonomous Navigation Rover on ROS 2',
    proof: 'Repeatable localisation, planning and obstacle-aware navigation behaviour.',
    problem: 'Autonomous systems need reliable localisation, mapping and obstacle-aware navigation before higher-level behaviour matters.',
    system: 'A differential-drive platform with LiDAR and IMU sensing, running ROS 2 Humble, Nav2, SLAM, EKF state estimation and motion control.',
    architecture: 'LiDAR and IMU inputs feed modular ROS 2 nodes for mapping and EKF state estimation. Nav2 consumes the resulting map and fused pose for costmaps, planning, control and recovery behaviour, with Gazebo Fortress and RViz providing repeatable inspection.',
    ownership: 'Built the platform and integrated sensing, localisation, planning and control across independently testable ROS 2 nodes.',
    decisions: [
      'Kept perception, estimation, planning and control modular so each layer could be tuned and validated independently.',
      'Regression-tested planning, costmaps, controller gains and recovery behaviour in simulation.',
    ],
    verification: 'Gazebo Fortress regression runs and RViz inspection checked maps, transforms, fused pose, planned paths and recovery behaviour in simulation.',
    stack: ['ROS 2 Humble', 'Nav2', 'Gazebo Fortress', 'RViz', 'LiDAR SLAM', 'EKF', 'Python', 'C++', 'Linux'],
    systemPath: [
      { label: 'Sense', detail: 'LiDAR and IMU' },
      { label: 'Estimate', detail: 'SLAM and EKF pose' },
      { label: 'Plan', detail: 'Nav2 and costmaps' },
      { label: 'Act', detail: 'Motion control and recovery' },
    ],
    image: {
      src: '/assets/image/Autonomous_Navigation_ROS2_Robotics_Rev00.webp',
      alt: 'Illustrative system visual showing an autonomous rover moving through a mapped environment with navigation and sensing layers.',
      width: 1448,
      height: 1086,
      kind: 'System illustration',
    },
  },
  {
    slug: 'ataxia-assessment-device',
    caseStudy: '/blog/esp32-movement-assessment-case-study/',
    category: 'Embedded',
    title: 'ESP32 Ataxia Assessment Device',
    proof: 'Real-time recording, Bluetooth display and CSV/PDF reporting.',
    problem: 'Movement and coordination assessment benefits from repeatable sensor-based measurement rather than observation alone.',
    system: 'An ESP32 device with a custom PCB, enclosure, four Hall-effect sensors, 100 Hz acquisition, Bluetooth connectivity and MATLAB validation.',
    architecture: 'Four Hall-effect sensing channels feed deterministic 100 Hz acquisition on the ESP32. The embedded path supports recording and Bluetooth live display, while MATLAB provides the auditable reference-instrument comparison and reporting workflow.',
    ownership: 'Designed the device, PCB and enclosure, implemented real-time acquisition and Bluetooth workflows, and built the analysis and reporting path.',
    decisions: [
      'Used four Hall-effect sensing channels and deterministic 100 Hz acquisition to capture direction, reversal and movement behaviour consistently.',
      'Kept acquisition and live display responsive on the embedded system while retaining MATLAB for auditable reference-instrument comparison.',
    ],
    verification: 'Accuracy, direction, reversal, drift and temperature behaviour were checked against reference instruments in MATLAB.',
    stack: ['ESP32', 'C/C++', 'BLE', 'Altium', 'MATLAB', 'Hall-effect sensing', 'PCB design', 'Enclosure design'],
    systemPath: [
      { label: 'Measure', detail: 'Four Hall-effect channels' },
      { label: 'Acquire', detail: 'ESP32 at 100 Hz' },
      { label: 'Transmit', detail: 'BLE live display and CSV' },
      { label: 'Validate', detail: 'MATLAB comparison and reporting' },
    ],
    image: {
      src: '/assets/image/Embedded_Clinical_Ataxia_Assessment_Rev00.webp',
      alt: 'Illustrative system visual of an embedded movement-assessment prototype and its sensing and analysis path.',
      width: 1448,
      height: 1086,
      kind: 'System illustration',
    },
  },
  {
    slug: 'swl-pricing-inventory-control',
    caseStudy: '/blog/swl-pricing-inventory-case-study/',
    category: 'Software',
    title: 'SWL Pricing and Inventory Control',
    proof: 'Operator-reviewed imports with change, exception, rollback and audit reports.',
    problem: 'Stan Wootton Locksmiths reprices its ServiceM8 materials catalogue from supplier price exports. Doing that by spreadsheet risks damaged item numbers and barcodes, an inconsistent markup and unreviewed price changes reaching the job system.',
    system: 'A local-first pricing and inventory control application with a Windows desktop surface and a browser surface. It compares an untouched supplier export against the current ServiceM8 materials list, applies the confirmed 30 percent markup on GST-exclusive cost, and produces an operator-reviewed import CSV in ServiceM8\'s exact format, with change, exception, rollback and audit reports.',
    architecture: 'A shared React and TypeScript interface over pure domain modules for money, pricing, comparison, mapping and output. A typed platform adapter selects the backend: scoped Tauri commands with bundled SQLite on the Rust desktop build, a loopback Node server for local web use, and a session-only store for the static demonstration.',
    ownership: 'Sole engineer across requirements, domain rules, the desktop and web builds, file-format contracts, test strategy, CI and Windows release packaging.',
    decisions: [
      'Matching is deterministic and fail-closed: exact normalised code, then operator-approved alias, then description similarity as a suggestion only. Items missing from a supplier file are never deleted, and money is never binary floating point.',
      'Imported business rows stay in memory and are never persisted; repository checks and CI enforce a no-production-data and no-secrets rule on every change.',
    ],
    verification: 'More than 500 automated checks: Vitest unit and property-based tests, Playwright browser tests with axe accessibility runs, WebdriverIO tests against the installed desktop app and Rust unit tests, including a byte-for-byte round trip of the ServiceM8 CSV contract. Typecheck, lint, tests and packaging run in CI.',
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
      kind: 'Application interface',
    },
  },
  {
    slug: 'gendio-controller',
    caseStudy: '/blog/gendio-display-controller-case-study/',
    title: 'Gendio Display Controller',
    category: 'Embedded',
    proof: 'Four-layer PCB design, ESP32-S3 firmware and a browser-based configuration interface.',
    problem: 'An industrial weight display needs a controller that translates serial data into clear, consistent readings and gives technicians a straightforward way to configure it.',
    system: 'An ESP32-S3 controller design combining a custom four-layer PCB, serial data handling, matrix-display firmware and a local browser interface.',
    architecture: 'Serial inputs feed a parser and receiver state machine. Display formatting and scanning are separated from configuration and update handling. The PCB design brings together power conversion, processing, serial interfaces and display buffering.',
    ownership: 'Designed the schematics and four-layer PCB, developed the embedded firmware and browser interface, and prepared mechanical exports and automated tests.',
    decisions: [
      'Kept display outputs disarmed after boot until explicitly enabled through the configuration workflow.',
      'Separated serial parsing, receiver state and display scanning so each could be exercised independently.',
      'Reviewed footprints, connector drills and component dissipation. Corrected a fuse footprint and increased the termination resistor rating.',
      'Added fallback glyphs and blanking for invalid display rows, with host-based regression tests.',
    ],
    verification: 'Verification covered the firmware build, synthetic serial-protocol fixtures, host-based display tests, browser workflows and circuit modelling. These checks supported the PCB and software development.',
    stack: ['KiCad', 'ESP32-S3', 'C++', 'Serial protocols', 'Matrix displays', 'ngspice', 'GNU Octave', 'Browser testing'],
    systemPath: [
      { label: 'Receive', detail: 'Serial indicator data' },
      { label: 'Interpret', detail: 'Parsing and receiver state' },
      { label: 'Display', detail: 'Formatting and guarded scanning' },
      { label: 'Configure', detail: 'Local browser interface' },
    ],
    image: {
      src: '/assets/gendio/20260915-Gendio-CAD-Overview-Rev00.webp',
      alt: 'PCB design render showing the ESP32-S3 processor, power section and interface connectors.',
      width: 1568, height: 1176,
      kind: 'PCB design render',
    },
    trials: [
      { area: 'Schematic and PCB review', result: 'Reviewed schematic connectivity, footprints and connector drills in KiCad, including corrections to the fuse footprint and termination resistor rating.' },
      { area: 'Firmware build', result: 'Compiled the ESP32-S3 firmware and checked image identity, partition placement and non-overlap.' },
      { area: 'Serial protocols', result: 'Exercised fragmentation, corruption, timeouts, recovery and counter wraparound across 31 synthetic protocol profiles.' },
      { area: 'Display logic', result: 'Host framebuffer and GPIO simulations checked glyph fallback, clipping, mirroring, row addressing, clock pulses, disarming and invalid-row blanking.' },
      { area: 'Browser interface', result: 'Tested 31 protocol options and five configuration workflows against a mocked API, including JavaScript error and mobile overflow checks.' },
      { area: 'Circuit modelling', result: 'Used ngspice for divider corners, reset timing and fixed-duty LC studies, with GNU Octave for analytical load-step and tolerance calculations.' },
      { area: 'Mechanical exports', result: 'Prepared the board model and mounting exports and matched 88 SMT designators against the placement file.' },
    ],
  },
  {
    slug: 'waterless-solar-panel-cleaner',
    category: 'Robotics',
    title: 'SPC-001 Waterless Solar-Panel Cleaner',
    caseStudy: '/blog/solar-panel-cleaning-robot-design-study/',
    publication: { url: 'https://zenodo.org/records/22865101', label: 'Read the research paper on Zenodo - Revision 02' },
    proof: 'Built and tested hardware, supported by a 96-page independent research paper.',
    problem: 'Cleaning solar panels without water couples surface contact, traction, cleaning reach and motion control.',
    system: 'A modular waterless solar-panel cleaning robot combining a tracked platform, dry-cleaning roller, electronic interfaces and supervisory control. I have built and tested the hardware, and it is operating as intended.',
    architecture: 'The mechanical design separates the chassis, track pods and cleaning roller, with docking and loading interfaces. Supervisory control manages operating states and fault handling, while the analytical work examines contact forces, drive torque, energy and coverage geometry.',
    ownership: 'Designed and built the prototype, integrated the mechanical and electronic systems, tested its operation and authored the independent research paper.',
    decisions: [
      'Considered brush loading and traction together because cleaning contact changes both resistance and available track loading.',
      'Examined the trade-off between keeping the platform inside a panel boundary and allowing the brush to reach its edges.',
      'Kept mechanical modules and control interfaces explicit to support inspection, maintenance and further development.',
    ],
    verification: 'The hardware has been built and functionally tested. The paper separately presents reproducible analytical calculations and archived software checks: 40,184 supervisor assertions and 870 coverage-planner assertions. Numerical force, torque, energy and coverage figures are modelled results.',
    stack: ['Mechanical design', 'Electronics', 'FreeCAD', 'KiCad', 'Supervisory control', 'Python', 'Contact mechanics', 'Coverage planning'],
    systemPath: [
      { label: 'Contact', detail: 'Dry-cleaning roller' },
      { label: 'Move', detail: 'Modular tracked platform' },
      { label: 'Supervise', detail: 'Operating states and fault handling' },
      { label: 'Analyse', detail: 'Traction, energy and coverage' },
    ],
    image: {
      src: '/assets/image/20260922-Solar-Panel-Cleaner-Concept-Rev00.webp',
      alt: 'Solar-panel cleaning robot concept with a full-width brush at the outer guide-arm ends and a photovoltaic charging panel on top.',
      width: 1536, height: 1024,
      kind: 'Production design concept - generated visualisation',
    },
  },
  {
    slug: 'deadline-aware-runtime-assurance',
    category: 'Robotics',
    title: 'Deadline-Aware Runtime Assurance for Autonomous Mobile Robots Under Sensor Degradation',
    proof: 'Joint sensing-and-timing recovery analysis with 32,400 navigation episodes.',
    problem: 'A mobile robot can lose its ability to recover safely before an immediate collision warning. Localisation uncertainty, ageing measurements and delayed commands must be considered together.',
    system: 'An independent research study combining a mathematical recoverability model, a conservative braking supervisor, numerical simulation and measured software execution.',
    architecture: 'Timestamped observations and command records form a bounded position estimate. A recovery certificate combines uncertainty, geometry, response delay and braking capability to select continue, restrict or recover. Command leases and a separately scheduled watchdog trigger braking when an approved command expires.',
    ownership: 'Developed the mathematical formulation, simulation benchmark, supervisory software, comparative analysis and research monograph.',
    decisions: [
      'Preserved a feasible braking manoeuvre through a state-dependent clearance envelope and admissible-speed limit.',
      'Propagated measurement age and outstanding commands into the recovery calculation.',
      'Kept the simulated plant moving during delayed computation and compared matched fault schedules across six supervisor variants.',
      'Evaluated learned anticipation separately from the model-based safety certificate.',
    ],
    verification: 'Evaluated 100,000 sampled boundary states, 32,400 navigation episodes, 3,900 supplementary episodes, 24,000 wall approaches and four process-based timing cases. Joint supervision completed 5,268 of 5,400 navigation episodes versus 2,674 for a global worst-case supervisor. Both recorded zero collisions in 3,000 bounded wall approaches; beyond-bound tests exposed failures when braking or response-delay assumptions were violated. The study uses a reduced-order model and static obstacles.',
    stack: ['Python', 'NumPy', 'Robust control', 'Uncertainty propagation', 'Fault injection', 'Software-in-the-loop', 'LaTeX'],
    systemPath: [
      { label: 'Observe', detail: 'Timestamped position and command records' },
      { label: 'Estimate', detail: 'Bounded state and information age' },
      { label: 'Supervise', detail: 'Continue, restrict or recover' },
      { label: 'Execute', detail: 'Command lease and braking watchdog' },
    ],
    image: { src: '/assets/image/20260921-Recoverability-Architecture-Rev00.png', alt: 'Research architecture: timestamped observations and command records feed a recoverability supervisor, command lease and braking watchdog, with a separate evaluator.', width: 1440, height: 940, kind: 'System illustration' },
    publication: { url: 'https://doi.org/10.5281/zenodo.22865084', label: 'Read the research report on Zenodo' },
  },
] as const

export const featuredProjects = projects

export interface IndexedProject {
  readonly title: string
  readonly summary: string
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
      { title: 'Upzy: Supervised Routine Companion Robot', summary: 'A privacy-conscious educational routine companion robot for young children, paired with a browser application for adult-defined routines, supervised use and review.' },
      { title: 'Inventory Scanning Mobile Robot', summary: 'An operator-support mobile robot that assists physical inventory scanning and connects captured stock observations to a controlled review workflow.' },
      { title: 'Modular Education and Testing Robot', summary: 'A modular robot platform for education, engineering experiments and repeatable subsystem testing in supervised use.' },
      { title: 'DuxTel Agricultural Equipment Telemetry', summary: 'A custom PCB-based field telemetry system combining CAN capture, GPS and condition sensing with MikroTik connectivity and a Linux server for remote machinery visibility.' },
    ],
  },
  {
    group: 'Software and AI platforms',
    items: [
      {
        title: 'Panelogram Retail Shelf Planner', summary: 'A local-first retail shelf planner with exact millimetre geometry, capacity checks, CSV import and printable shelf reporting.',
        image: { src: '/assets/image/20260826-Panelogram-Bay-Layout-Rev00.png', alt: 'Screenshot of Panelogram rendering a six-shelf bay to scale with millimetre rulers and per-shelf capacity figures.', width: 1672, height: 941, kind: 'Interface visual' },
      },
      {
        title: 'Snail Race Fundraising Platform', summary: 'A versioned fundraising event platform with a seeded, replayable race engine, QR donations, tote board and moderator reconciliation.',
        image: { src: '/assets/image/20260826-Snail-Race-Stage-Rev00.png', alt: 'Screenshot of the Snail Race projector stage showing the animated track and play-chip tote board.', width: 1672, height: 941, kind: 'Interface visual' },
      },
      {
        title: 'Engineering Mastery Lab', summary: 'A browser-first engineering workbench combining input-validated calculators, bounded parametric CAD, guided learning labs and evidence-focused project workflows.',
        image: { src: '/assets/image/Engineering_Mastery_Lab_Command_Centre_Rev00.svg', alt: 'Interface visual of the Engineering Mastery Lab dashboard.', width: 1435, height: 660, kind: 'Interface visual' },
      },
      {
        title: 'VeerAI: Local SLM System', summary: 'A complete local AI system: an open-weight small language model on personally owned hardware inside a governed ingestion, retrieval, memory, tools and evaluation pipeline.',
        image: { src: '/assets/image/20260802-VeerAI-SLM-Project-Visual-Rev00.avif', alt: 'System diagram of the VeerAI local SLM system.', width: 1672, height: 941, kind: 'System diagram' },
      },
      {
        title: 'Newcomb and District Cricket Club Platform', summary: 'The official NDCC digital platform, combining the public club website with committee content, membership, merchandise, gallery, sponsor and administration workflows.',
        image: { src: '/assets/image/20260803-NDCC-Website-Platform-Rev00.svg', alt: 'System diagram of the NDCC digital platform architecture.', width: 1435, height: 660, kind: 'System diagram' },
      },
    ],
  },
  {
    group: 'Industrial and automotive delivery',
    items: [
      { title: 'Regulated Smart Factory and SCADA Migration', summary: 'GMP smart-factory automation delivery, including an iFIX to PVI+ SCADA migration verified against the validated system.' },
      { title: 'ADAS and CAN Validation', summary: 'Feature, breadboard and OTA regression testing across vehicle development programmes, supported by CAN-level fault evidence.' },
      { title: 'ABMARC Emissions and Compliance Testing', summary: 'Repeatable, auditable emissions testing against ADR and EURO standards, supported by calibrated instrumentation and QA records.' },
      { title: 'Carbon Revolution: Carbon-Fibre Wheel Manufacturing', summary: 'Operated production equipment, recorded quality and traceability evidence, and supported equipment trials, setup and first-level recovery during manufacturing changes.' },
      { title: 'IDL: Canning Line Upgrade and Commissioning', summary: 'Supported live production, changeovers, fault recovery and commissioning checks around WestRock and Fibre-King packaging upgrades.' },
      { title: 'Manufacturing and Quality Foundation', summary: 'Experience spanning 2018 to 2024 across beverage, carbon-fibre and structural-steel production, connecting operations, quality, traceability and commissioning support.' },
    ],
  },
] as const

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
