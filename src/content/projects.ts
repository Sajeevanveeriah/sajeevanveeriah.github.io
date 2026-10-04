export interface Project {
  readonly sections?: readonly {
    readonly id: string
    readonly title: string
    readonly paragraphs: readonly string[]
    readonly image?: {
      readonly src: string
      readonly mobileSrc?: string
      readonly mobileWidth?: number
      readonly mobileHeight?: number
      readonly alt: string
      readonly width: number
      readonly height: number
      readonly kind: string
    }
    readonly links?: readonly { readonly label: string; readonly href: string }[]
  }[]
  readonly publication?: { readonly url: string; readonly label: string }
  readonly caseStudy?: string
  readonly category: 'Robotics' | 'Embedded' | 'Software' | 'Industrial'
  readonly trials?: readonly { readonly area: string; readonly result: string }[]
  readonly slug: string
  readonly title: string
  readonly status: string
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
    readonly kind: 'Application interface' | 'System illustration' | 'PCB design render' | 'Production design concept - generated visualisation' | 'Project scope' | 'Engineering diagram'
  }
}

export const projects: readonly [Project, Project, Project, ...Project[]] = [
  {
    slug: 'ndcc-community-systems',
    category: 'Software',
    title: 'NDCC Digital Platform & Public WiFi',
    status: 'Community platform and completed WiFi upgrade',
    proof: 'Helping volunteers run the club through connected website, committee and event workflows, with public WiFi at the ground.',
    problem: 'A community club depends on volunteers keeping information, orders and events organised. My work at Newcomb and District Cricket Club spans the digital tools people use and the connectivity that supports them at the ground.',
    system: 'I build and maintain NDCC\'s digital platform, support club communications and operations, and have completed a public WiFi network upgrade at Grinter Reserve.',
    architecture: 'The website combines a Next.js and TypeScript application with Supabase-backed content, operational records and media. Committee permissions control administrative workflows. PlayHQ supplies fixtures and supported cricket data; Resend handles application email. Payment paths are configuration-dependent, with manual bank transfer and a separately gated Stripe Checkout integration.',
    ownership: 'Website development and maintenance, committee and member workflows, event communications, operational tools and the recent public WiFi network upgrade. I also prepared the outdoor network expansion guide and pilot design.',
    decisions: [
      'Keep public content and committee administration connected through a shared content system, with server-enforced permissions for sensitive actions.',
      'Use PlayHQ as the fixture source and retain review steps for imported data, orders and payments.',
      'Keep the existing internet gateway in the outdoor expansion design, with a wired root access point and a separately powered remote mesh access point.',
      'Separate the completed WiFi upgrade from the proposed outdoor pilot. Equipment options and acceptance targets are design records, not measured coverage results.',
    ],
    verification: 'The digital-platform scope is documented in the NDCC source repository. The network expansion guide contains 27 installation and handover steps, a connection diagram and proposed acceptance checks. The recent public WiFi upgrade is complete; this case study does not claim measured throughput, reserve-wide coverage or a verified installed equipment inventory.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PlayHQ', 'Resend', 'Vercel', 'Network planning', 'WiFi'],
    systemPath: [
      { label: 'Inform', detail: 'Club website and communications' },
      { label: 'Operate', detail: 'Committee, orders and events' },
      { label: 'Connect', detail: 'Public WiFi upgrade' },
      { label: 'Document', detail: 'Network design and handover' },
    ],
    image: { src: '/assets/image/20261004-NDCC-Systems-Rev00.svg', alt: 'Diagram connecting the NDCC public website, committee tools and public WiFi upgrade. The outdoor expansion remains planned.', width: 1200, height: 720, kind: 'Engineering diagram' },
    sections: [
      {
        id: 'club-platform', title: 'A platform for the people running the club',
        paragraphs: [
          'The public website brings together news, events, fixtures, sponsors, gallery content and club information. Behind it, the committee tools support content updates, seasonal administration, registrations and member services.',
          'The operational scope includes kitchen and merchandise ordering, supplier exports, payment records and receipts, fundraising, calendars and fantasy cricket administration. These workflows sit alongside the public site so that club information and the work of maintaining it belong to the same system.',
        ],
        links: [{ label: 'Visit the NDCC website', href: 'https://www.ndcc.com.au/' }, { label: 'Explore the platform source', href: 'https://github.com/Sajeevanveeriah/ndcc-website' }],
      },
      {
        id: 'club-operations', title: 'The work around the software',
        paragraphs: [
          'My club contribution also includes event artwork and communications, kitchen-order consolidation, member and mailing-list organisation, and fixture comparison for potential ground clashes. The aim is practical: give volunteers clear information they can use on the day.',
          'This is ongoing community work. The website, event material and operational documents need to stay aligned as committee decisions and club requirements change.',
        ],
      },
      {
        id: 'public-wifi', title: 'Public WiFi at Grinter Reserve',
        paragraphs: [
          'I recently completed a public WiFi network upgrade for the club. Alongside that work, I developed a documented approach to extending outdoor connectivity, covering equipment selection, connection paths, site checks, troubleshooting and handover.',
          'The available network map below is the expansion concept from that guide. It shows a wired root access point, a wireless backhaul to a remote access point, and separate local power at the remote end. It is a topology diagram, not an as-built site map or a radio-coverage survey.',
        ],
        image: {
          src: '/assets/image/20261003-NDCC-Network-Plan-Rev00.svg',
          mobileSrc: '/assets/image/20261003-NDCC-Network-Plan-Mobile-Rev00.svg',
          mobileWidth: 600, mobileHeight: 1220,
          alt: 'Proposed outdoor pilot: the existing internet gateway feeds LAN ports or a switch. Wired branches connect an Omada controller, a root outdoor access point through its injector, and an optional indoor access point. Wireless backhaul connects the root to a remote outdoor access point with its own local power and injector. Locations and coverage require on-site validation.',
          width: 1200, height: 850, kind: 'Outdoor expansion concept - not an as-built or coverage map',
        },
      },
      {
        id: 'network-handover', title: 'Design, acceptance and handover',
        paragraphs: [
          'The September 2026 guide proposes a two-AP EAP225-Outdoor pilot with an Omada Software Controller on an existing computer, or an optional OC200 controller. Those are documented design options, not a statement of the equipment installed in the completed upgrade.',
          'The handover plan covers equipment records, authorised mounting positions, power and cable routes, guest separation, repeatable walk tests and restart recovery. It treats wired internet performance, local network performance and radio coverage as separate checks.',
          'The guide also includes an equipment calculator, a 27-step checklist and a field notebook. Site measurements determine whether the design should expand and where additional access points belong.',
        ],
      },
    ],
  },
  {
    slug: 'autonomous-navigation-rover',
    caseStudy: '/blog/ros2-navigation-rover-case-study/',
    category: 'Robotics',
    title: 'Autonomous Navigation Rover on ROS 2',
    status: 'Built platform; navigation checked in simulation',
    proof: 'A navigation stack that makes sensing, localisation, planning and recovery behaviour inspectable in simulation.',
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
    image: { src: '/assets/image/20261004-ROS2-Navigation-Rev00.svg', alt: 'ROS 2 architecture diagram showing an illustrative route alongside sensing, estimation, planning and simulation inspection.', width: 1200, height: 720, kind: 'Engineering diagram' },
  },
  {
    slug: 'ataxia-assessment-device',
    caseStudy: '/blog/esp32-movement-assessment-case-study/',
    category: 'Embedded',
    title: 'ESP32 Ataxia Assessment Device',
    status: 'Honours measurement prototype',
    proof: 'From physical movement to recorded measurements: four sensing channels, 100 Hz acquisition, Bluetooth and MATLAB analysis.',
    problem: 'Movement and coordination assessment benefits from repeatable sensor-based measurement rather than observation alone.',
    system: 'An ESP32 device with a custom PCB, enclosure, four Hall-effect sensors, 100 Hz acquisition, Bluetooth connectivity and MATLAB validation.',
    architecture: 'Four Hall-effect sensing channels feed deterministic 100 Hz acquisition on the ESP32. The embedded path supports recording and Bluetooth live display, while MATLAB provides the auditable reference-instrument comparison and reporting workflow.',
    ownership: 'Designed the device, PCB and enclosure, implemented real-time acquisition and Bluetooth workflows, and built the analysis and reporting path.',
    decisions: [
      'Used four Hall-effect sensing channels and deterministic 100 Hz acquisition to capture direction, reversal and movement behaviour consistently.',
      'Kept acquisition and live display responsive on the embedded system while retaining MATLAB for auditable reference-instrument comparison.',
    ],
    verification: 'Accuracy, direction, reversal, drift and temperature behaviour were checked against reference instruments in MATLAB. This is an engineering measurement prototype; these checks do not establish clinical effectiveness or medical-device certification.',
    stack: ['ESP32', 'C/C++', 'BLE', 'Altium', 'MATLAB', 'Hall-effect sensing', 'PCB design', 'Enclosure design'],
    systemPath: [
      { label: 'Measure', detail: 'Four Hall-effect channels' },
      { label: 'Acquire', detail: 'ESP32 at 100 Hz' },
      { label: 'Transmit', detail: 'BLE live display and CSV' },
      { label: 'Validate', detail: 'MATLAB comparison and reporting' },
    ],
    image: { src: '/assets/image/20261004-Movement-Measurement-Rev00.svg', alt: 'Signal-path diagram: four Hall-effect channels feed ESP32 acquisition at 100 Hz, Bluetooth feedback, MATLAB comparison and reports.', width: 1200, height: 720, kind: 'Engineering diagram' },
  },
  {
    slug: 'swl-pricing-inventory-control',
    caseStudy: '/blog/swl-pricing-inventory-case-study/',
    category: 'Software',
    title: 'SWL Pricing and Inventory Control',
    status: 'Client software with automated verification',
    proof: 'Turning supplier files into reviewed catalogue updates, with exact pricing, visible exceptions and a rollback trail.',
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
    image: { src: '/assets/image/20261004-SWL-Pricing-Rev00.svg', alt: 'Workflow diagram connecting supplier exports, exact pricing rules, operator review and a ServiceM8 import with exception and recovery reports.', width: 1200, height: 720, kind: 'Engineering diagram' },
  },
  {
    slug: 'gendio-controller',
    caseStudy: '/blog/gendio-display-controller-case-study/',
    title: 'Gendio Display Controller',
    status: 'PCB design and software verification',
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
    verification: 'Verification covered the firmware build, synthetic serial-protocol fixtures, host-based display tests, browser workflows and circuit modelling. These checks support the PCB design and software behaviour; assembled-board measurements and field validation remain separate work.',
    stack: ['KiCad', 'ESP32-S3', 'C++', 'Serial protocols', 'Matrix displays', 'ngspice', 'GNU Octave', 'Browser testing'],
    systemPath: [
      { label: 'Receive', detail: 'Serial indicator data' },
      { label: 'Interpret', detail: 'Parsing and receiver state' },
      { label: 'Display', detail: 'Formatting and guarded scanning' },
      { label: 'Configure', detail: 'Local browser interface' },
    ],
    image: { src: '/assets/image/20261004-Gendio-Controller-Rev00.svg', alt: 'Actual Gendio PCB CAD render beside the serial input, guarded parsing, display and local configuration architecture.', width: 1200, height: 720, kind: 'Engineering diagram' },
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
    status: 'Functionally tested prototype and independent research',
    caseStudy: '/blog/solar-panel-cleaning-robot-design-study/',
    publication: { url: 'https://zenodo.org/records/22865101', label: 'Read the research paper on Zenodo - Revision 02' },
    proof: 'A built cleaning prototype and an independent paper connecting mechanical design, traction, control and coverage planning.',
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
    image: { src: '/assets/image/20261004-Solar-Cleaner-Rev00.svg', alt: 'Functional top-view schematic of the SPC-001 chassis, tracks and dry-cleaning roller, with contact, traction and coverage considerations.', width: 1200, height: 720, kind: 'Engineering diagram' },
  },
  {
    slug: 'deadline-aware-runtime-assurance',
    category: 'Robotics',
    title: 'Deadline-Aware Runtime Assurance for Autonomous Mobile Robots Under Sensor Degradation',
    status: 'Reduced-order simulation research',
    proof: 'Investigating when a robot should slow down or brake as sensing and command timing degrade, across 32,400 simulated navigation episodes.',
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
    image: { src: '/assets/image/20261004-Runtime-Assurance-Rev00.svg', alt: 'Research architecture connecting timestamped observations to a recovery certificate and command-lease braking watchdog.', width: 1200, height: 720, kind: 'Engineering diagram' },
    publication: { url: 'https://doi.org/10.5281/zenodo.22865084', label: 'Read the research report on Zenodo' },
  },
  {
    slug: 'industrial-process-simulation',
    category: 'Industrial',
    title: 'Industrial Process Simulation',
    status: 'Independent illustrative simulation',
    proof: 'Explore a connected potato-processing line, inject faults and follow their effect on flow, quality and dispatch.',
    problem: 'A production line is a connected process. A change at one machine can affect buffers, downstream throughput, quality release and the work of the operator.',
    system: 'An interactive browser simulation of a potato-processing plant, with a selectable 3D layout, process controls, production records, alarms and fault scenarios.',
    architecture: 'A deterministic process model supplies a shared plant state to the 3D view, flow schematic, asset register and operational workspaces. Equipment selection stays consistent between views. A vector renderer preserves access when WebGL 2 is unavailable.',
    ownership: 'Developed the simulation, operator interface, connected process views, scenario workflows and delivery checks as an independent engineering study.',
    decisions: [
      'Keep one process state behind the equipment views, quality records and operator controls so a scenario can be followed across the plant.',
      'Distinguish stopping, holding and draining the line, preserving material and operator intent through state changes.',
      'Make model assumptions visible and use synthetic operating values and records. No real PLC or production plant is connected.',
      'Provide keyboard navigation, selectable overlays and a vector fallback so the model remains usable across different devices.',
    ],
    verification: 'The public repository includes deterministic model tests, build checks and browser suites covering commands, quality and dispatch, exports, navigation and saved preferences. These are software and simulation checks. The model is illustrative, not a calibrated plant replica or an endorsed control system, and does not establish factory performance.',
    stack: ['Process modelling', 'Browser simulation', '3D visualisation', 'Fault scenarios', 'Quality traceability', 'Automated testing'],
    systemPath: [
      { label: 'Receive', detail: 'Intake and material records' },
      { label: 'Process', detail: 'Connected equipment and buffers' },
      { label: 'Inspect', detail: 'Quality, genealogy and alarms' },
      { label: 'Release', detail: 'Packing, cold store and dispatch' },
    ],
    image: { src: '/assets/image/20261004-Process-Simulation-Rev00.svg', alt: 'Illustrative potato-processing flow from intake through preparation, processing, packing, quality release and dispatch, with shared equipment and alarm views.', width: 1200, height: 720, kind: 'Engineering diagram' },
    sections: [{
      id: 'explore-model',
      title: 'Explore the model and its assumptions',
      paragraphs: ['Follow the material journey from receiving and washing through cutting, thermal processing, freezing, packing and dispatch. The source documents the controls, test suites and model boundary.'],
      links: [{ label: 'Open the simulation source and guide', href: 'https://github.com/Sajeevanveeriah/open-industrial-automation' }],
    }],
  },
] as const

export const featuredProjects = projects

export interface IndexedProject {
  readonly title: string
  readonly summary: string
  readonly href?: string
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
        title: 'Snail Race Fundraising Platform', summary: 'An event platform with replayable races, a projector stage, QR donations and moderator reconciliation to support club fundraising.',
        href: 'https://github.com/Sajeevanveeriah/SnailRace',
        image: { src: '/assets/image/20260826-Snail-Race-Stage-Rev00.png', alt: 'Screenshot of the Snail Race projector stage showing the animated track and play-chip tote board.', width: 1672, height: 941, kind: 'Interface visual' },
      },
      {
        title: 'Engineering Mastery Lab', summary: 'An engineering learning platform with 175 lessons across five courses, guided laboratories, project briefs, analysis tools and evidence exports. Learning, building and demonstrating capability share one workflow.',
        href: 'https://github.com/Sajeevanveeriah/Engineering-Mastery-Lab',
        image: { src: '/assets/image/Engineering_Mastery_Lab_Command_Centre_Rev00.svg', alt: 'Interface visual of the Engineering Mastery Lab dashboard.', width: 1435, height: 660, kind: 'Interface visual' },
      },
      {
        title: 'VeerAI: Local SLM System', summary: 'A local AI project connecting an open-weight language model with document ingestion, retrieval, memory, controlled tools and evaluation on personally owned hardware.',
        href: '/blog/local-ai-beyond-the-model/',
        image: { src: '/assets/image/20260802-VeerAI-SLM-Project-Visual-Rev00.avif', alt: 'System diagram of the VeerAI local SLM system.', width: 1672, height: 941, kind: 'System diagram' },
      },
      {
        title: 'Saj Service Desk',
        summary: 'A service-management application connecting requests, jobs, quotes, invoices and follow-up records. The public request page prepares an email for the visitor to review and send; the full server application is a separate deployment.',
        href: 'https://github.com/Sajeevanveeriah/saj-service-desk',
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
