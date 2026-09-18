import type { BlogPost } from "./blog";

export const caseStudyPosts: BlogPost[] = [
  {
    slug: "ros2-navigation-rover-case-study",
    title: "Building a ROS 2 navigation stack I could investigate",
    date: "2026-09-18",
    category: "Engineering case study",
    description: "How I organised sensing, estimation, planning and control for a differential-drive rover, and what simulation could establish.",
    image: {
      src: "/assets/blog/20260918-Rover-Case-Study-Rev00.webp",
      alt: "Conceptual illustration of a rover beside a translucent sensing plane and a suggested navigation path.",
      caption: "AI-generated conceptual illustration. It is not a photograph of my rover or a recorded navigation result.",
      width: 1536, height: 1024,
    },
    intro: [
      "A robot reaching a goal is only part of the engineering problem. I also need to understand how it estimated its position, why it chose a path and what happened when that path became difficult to follow.",
      "For this project, I built a differential-drive platform and integrated a modular navigation stack using ROS 2 Humble, Nav2, LiDAR SLAM, IMU sensing and EKF state estimation. Gazebo Fortress and RViz gave me a repeatable environment for checking the interactions between those parts. The validation described here is simulation-based.",
    ],
    sections: [
      {
        id: "question", title: "The engineering question",
        paragraphs: ["My practical question was how to make localisation, planning and motion control work together while keeping faults traceable to a particular layer. A navigation failure can begin well before the controller: an inconsistent transform or pose estimate can make a reasonable planner appear unreliable.", "I treated the system as a sequence of interfaces. Each stage needed an output that the next stage could use and that I could inspect independently."],
        sources: [1],
      },
      {
        id: "architecture", title: "Separating the navigation layers",
        paragraphs: ["I kept perception, estimation, planning and control in modular ROS 2 nodes. That separation let me tune one part and inspect its effect across the rest of the stack."],
        table: { headings: ["Layer", "Role in this project"], rows: [
          ["Sensing and mapping", "LiDAR supports SLAM; the IMU contributes motion information."],
          ["State estimation", "EKF fusion provides the pose used downstream, with transforms inspected in RViz."],
          ["Planning", "Nav2 uses the map, fused pose and costmaps to produce a navigable path."],
          ["Control and recovery", "Motion control follows the path; recovery behaviour handles navigation interruptions."],
        ] },
      },
      {
        id: "verification", title: "What I checked",
        paragraphs: ["I used Gazebo Fortress regression runs and RViz inspection to examine maps, transforms, fused pose, planned paths and recovery behaviour. Planning, costmap settings and controller gains could be revisited without changing every part of the system at once.", "The useful result was an integrated navigation workflow whose intermediate behaviour could be inspected. I am not presenting a numerical localisation benchmark, a measured success rate or a comparison against another navigation system here; this public case study does not include the underlying run dataset needed for those claims."],
        sources: [1],
      },
      {
        id: "limits", title: "What the simulation leaves open",
        paragraphs: ["Simulation supported integration and repeatable investigation. It does not establish performance on an unseen physical floor, under wheel slip or with the timing and sensing imperfections of a deployed robot.", "A useful next experiment would hold the route and obstacle arrangement constant, repeat trials across controlled perturbations and record goal completion, path length, localisation behaviour and recovery events. I would compare those runs before claiming a particular design change improved reliability. This is a proposed extension, not a reported experiment."],
      },
      {
        id: "reflection", title: "What I would carry into research",
        paragraphs: ["This project made the interfaces between subsystems the centre of my debugging process. For future robotics work, I want an experimental question, observable intermediate states and a clear boundary between what a simulation demonstrates and what still requires a physical trial."],
      },
    ],
    sources: [
      { label: "My ROS 2 rover project record: architecture, ownership and simulation checks", url: "/work/autonomous-navigation-rover/" },
      { label: "Further reading: official Nav2 navigation concepts (Rolling documentation; project used Humble)", url: "https://docs.nav2.org/rolling/getting_started/navigation_concepts/" },
    ],
    note: "First-person engineering case study based on my project record. This is not a peer-reviewed paper or a claim of a novel navigation algorithm. Published 18 September 2026; this is the article date, not the project start date.",
  },
  {
    slug: "esp32-movement-assessment-case-study",
    title: "From movement to measurement: my ESP32 honours capstone",
    date: "2026-09-18",
    category: "Engineering case study",
    description: "Integrating Hall-effect sensing, embedded acquisition, Bluetooth and MATLAB into a movement-assessment prototype.",
    image: {
      src: "/assets/blog/20260918-Movement-Sensing-Rev00.webp",
      alt: "Conceptual laboratory illustration of a compact instrument, circuit board, magnetic elements and a mechanical arm.",
      caption: "AI-generated conceptual illustration of movement sensing. It does not reproduce the actual capstone device.",
      width: 1536, height: 1024,
    },
    intro: ["For my mechatronics honours capstone at Deakin University, I developed an ESP32 movement-assessment prototype. The work brought mechanical design, a custom PCB, embedded acquisition and analysis into one measurement workflow.", "The central challenge was making the measurement path repeatable and inspectable. A live display is useful, but understanding the sensor behaviour requires a reference and a way to examine the recorded data."],
    sections: [
      {
        id: "scope", title: "The prototype and my contribution",
        paragraphs: ["I designed the device, PCB and enclosure, implemented acquisition and Bluetooth workflows, and developed the analysis and reporting path. Four Hall-effect sensing channels fed the ESP32 at a 100 Hz acquisition rate. The system supported recording, a Bluetooth live display and CSV/PDF reporting.", "I completed my Bachelor of Mechatronics Engineering (Honours) in October 2025 with First Class Honours with Distinction. My graduation ceremony was in February 2026. Those dates describe my qualification; they do not imply a clinical validation programme."],
        sources: [1],
      },
      {
        id: "measurement-path", title: "Keeping acquisition and analysis distinct",
        paragraphs: ["I kept the embedded path responsible for acquisition and responsive live feedback, while MATLAB provided the reference-instrument comparison and reporting workflow. This made the recorded measurements available for inspection beyond the device display."],
        table: { headings: ["Stage", "Implementation"], rows: [
          ["Measure", "Four Hall-effect sensing channels capture movement-related behaviour."],
          ["Acquire", "ESP32 firmware samples at 100 Hz and supports recording."],
          ["Display and export", "Bluetooth live display and CSV/PDF output make the observations accessible."],
          ["Compare", "MATLAB analysis checks sensor behaviour against reference instruments."],
        ] },
      },
      {
        id: "validation", title: "Investigating measurement behaviour",
        paragraphs: ["My checks covered accuracy, direction, reversal, drift and temperature behaviour against reference instruments in MATLAB. These concerns span both the mechanism and the electronics: a plausible signal can still change with operating conditions or the direction of motion.", "The documented outcome is an integrated measurement prototype and a reference-comparison workflow. I have not included numerical error bounds in this article because the supporting raw measurements and analysis outputs are not published here. A sampling rate alone does not establish measurement accuracy."],
        sources: [1],
      },
      {
        id: "limits", title: "Separating an engineering prototype from clinical evidence",
        paragraphs: ["The project title refers to ataxia assessment, but the work described here concerns sensing and prototype engineering. It does not establish diagnostic accuracy, clinical effectiveness or medical-device certification.", "A research extension would need a defined measurement endpoint, documented calibration, a repeatability study and an appropriate study design for the intended population. Any work involving participants would also need the relevant oversight and consent. These are future requirements, not activities I am claiming to have completed."],
      },
      {
        id: "reflection", title: "What the capstone taught me",
        paragraphs: ["The most useful habit was tracing a result back through the entire measurement chain. Mechanical behaviour, sensing, firmware timing and analysis all influence what an apparent result means. That is the kind of integrated experimental work I want to pursue in robotics and embedded intelligence."],
      },
    ],
    sources: [
      { label: "My ESP32 assessment-device project record: sensing, implementation and validation scope", url: "/work/ataxia-assessment-device/" },
      { label: "Further reading: Espressif ESP32 Bluetooth API documentation (technical context)", url: "https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/bluetooth/index.html" },
    ],
    note: "First-person engineering case study, not a clinical study or peer-reviewed publication. Qualification details reflect my confirmed completion and award. The illustration is conceptual.",
  },
  {
    slug: "swl-pricing-inventory-case-study",
    title: "Making catalogue repricing reviewable at SWL",
    date: "2026-09-18",
    category: "Engineering case study",
    description: "A local-first pricing workflow with deterministic matching, exact money handling and an operator-reviewed ServiceM8 export.",
    image: {
      src: "/assets/image/20260826-SWL-Pricing-Run-Rev00.png",
      alt: "SWL application new-run screen showing the seven-stage workflow from file input to a reviewed export.",
      caption: "Application screenshot from the existing project record, showing the pricing workflow and business-rules panel.",
      width: 1672, height: 941,
    },
    intro: ["Stan Wootton Locksmiths needs to reprice a ServiceM8 materials catalogue using supplier exports. A spreadsheet can perform the arithmetic, but the harder problems are preserving identifiers, matching the right items and ensuring that someone reviews the changes before import.", "I developed a local-first application spanning requirements, pricing rules, desktop and browser builds, testing and release packaging. I treated the import file as a controlled output of a review process."],
    sections: [
      {
        id: "constraints", title: "The rules shaped the software",
        paragraphs: ["The application compares an untouched supplier export with the current materials list and applies the confirmed 30 percent markup to GST-exclusive cost. It produces a ServiceM8-format import alongside change, exception, rollback and audit reports.", "An item absent from a supplier file is not automatically deleted. Matching proceeds from an exact normalised code to an operator-approved alias. Description similarity is a suggestion for review, not authority to overwrite an item."],
        sources: [1],
      },
      {
        id: "architecture", title: "One domain model, several application surfaces",
        paragraphs: ["I used a shared React and TypeScript interface over pure domain modules for money, pricing, comparison, mapping and output. A typed platform adapter connects that logic to the selected runtime."],
        table: { headings: ["Surface", "Responsibility"], rows: [
          ["Windows desktop", "Tauri commands and a Rust backend with bundled SQLite."],
          ["Local browser", "A loopback Node server for local web use."],
          ["Static demonstration", "A session-only store for demonstrating the workflow."],
          ["Shared domain", "Deterministic matching, exact money handling and export rules."],
        ] },
        after: ["This separation allowed the business rules to remain consistent while the desktop and browser surfaces handled files differently. Imported business rows stay in memory rather than being persisted."],
      },
      {
        id: "review", title: "Making uncertainty visible to the operator",
        paragraphs: ["A failed match should become an exception the operator can examine. It should not silently become a guessed product association. The change and rollback outputs make the proposed import inspectable and give the workflow a recovery path.", "Exact money handling was another deliberate boundary. Binary floating-point arithmetic is not used for money in the pricing domain. The output also needs to preserve item codes and barcodes as identifiers rather than treating them as convenient numeric values."],
        sources: [1],
      },
      {
        id: "verification", title: "Checking the contract as well as the interface",
        paragraphs: ["The project record documents unit and property-based tests, browser checks, accessibility runs, installed-desktop tests and Rust unit tests. A byte-for-byte round trip checks the ServiceM8 CSV contract. Type checking, linting, testing and packaging are part of CI.", "This article summarises that established test strategy; it does not present a fresh execution of the application test suite. I am not claiming a measured time saving, revenue gain or error-reduction percentage without an operational dataset."],
        sources: [1],
      },
      {
        id: "reflection", title: "The wider engineering lesson",
        paragraphs: ["The important design decision was to give uncertainty somewhere explicit to go. A pricing tool needs a clear relationship between an input, a rule, an operator decision and an output. That principle also applies to automation and AI systems where a plausible result should remain open to inspection.", "A future evaluation could compare reviewed runs using reconciliation outcomes, exception categories and operator effort. That would measure practical usefulness without confusing test coverage with a demonstrated business outcome."],
      },
    ],
    sources: [
      { label: "My SWL project record: requirements, architecture and testing strategy", url: "/work/swl-pricing-inventory-control/" },
      { label: "Further reading: official Tauri 2 architecture documentation", url: "https://v2.tauri.app/concept/architecture/" },
    ],
    note: "Engineering case study based on the public project record. Client data, private implementation details and unsupported business metrics are omitted.",
  },
  {
    slug: "gendio-display-controller-case-study",
    title: "Designing the Gendio controller around explicit states",
    date: "2026-09-18",
    category: "Engineering case study",
    description: "An ESP32-S3 display-controller design connecting serial parsing, guarded display output, a four-layer PCB and browser configuration.",
    image: {
      src: "/assets/gendio/20260915-Gendio-CAD-Overview-Rev00.png",
      alt: "Gendio PCB design render showing the processor, power circuitry and interface connectors.",
      caption: "Render of the actual PCB design. This is a CAD view, not a photograph of assembled hardware.",
      width: 1568, height: 1176,
    },
    intro: ["An industrial weight display needs a dependable path from incoming serial data to a readable output. For Gendio, I developed an ESP32-S3 controller design with a custom four-layer PCB, embedded firmware and a local browser configuration interface.", "My work covered schematics, PCB layout, firmware, the configuration interface, mechanical exports and automated checks. The public record supports design and software verification; it does not establish assembled-hardware or field validation."],
    sections: [
      {
        id: "architecture", title: "Separating reception from display output",
        paragraphs: ["I separated serial parsing, receiver state, display formatting and scanning. Configuration and update handling sit alongside those paths rather than becoming implicit side effects of receiving a value.", "The display outputs remain disarmed after boot until explicitly enabled through configuration. Fallback glyphs and invalid-row blanking give the firmware defined behaviour when an input cannot be rendered as intended."],
        table: { headings: ["Boundary", "Design responsibility"], rows: [
          ["Receive", "Handle serial input and maintain receiver state."],
          ["Interpret", "Parse the input independently of display scanning."],
          ["Display", "Format values, apply glyph fallback and guard row output."],
          ["Configure", "Provide local browser controls and explicit activation."],
        ] },
        sources: [1],
      },
      {
        id: "board", title: "Reviewing the physical design",
        paragraphs: ["The four-layer PCB brings together power conversion, processing, serial interfaces and display buffering. I reviewed schematic connectivity, footprints, connector drills and component dissipation. That review led to a fuse-footprint correction and a higher termination-resistor rating.", "Mechanical exports connect the board design to mounting and placement work. They support fabrication preparation, but a correct export is not the same as a successful assembly or a verified electrical measurement."],
        sources: [1],
      },
      {
        id: "checks", title: "What the development checks covered",
        paragraphs: ["Synthetic serial fixtures exercised fragmentation, corruption, timeouts, recovery and counter wraparound. Host-based display tests covered glyph fallback, clipping, mirroring, row addressing, clock pulses, disarming and invalid-row blanking.", "Browser workflows were exercised against a mocked API. Circuit modelling used ngspice for divider corners, reset timing and fixed-duty LC studies, alongside GNU Octave analytical calculations. Firmware build and image-placement checks covered another part of the integration boundary."],
        table: { headings: ["Evidence", "What it supports"], rows: [
          ["Synthetic protocol and host tests", "Software behaviour for the exercised cases."],
          ["Mocked browser workflows", "Interface behaviour against a controlled API substitute."],
          ["Circuit models", "Behaviour under the model assumptions and analysed conditions."],
          ["CAD and mechanical exports", "Design review and fabrication preparation."],
        ] },
        sources: [1],
      },
      {
        id: "next", title: "The next evidence needs to come from hardware",
        paragraphs: ["These checks reduce uncertainty before hardware trials, but they do not remove it. The next phase would examine an assembled board, real indicator inputs, display timing, loading and thermal behaviour against defined acceptance criteria.", "I would retain the separation between model, host test and bench observation in the resulting report. That makes it possible to identify where an assumption failed rather than describing all verification as a single pass."],
      },
      {
        id: "reflection", title: "Why the state boundaries mattered",
        paragraphs: ["This project reinforced the value of explicit activation and independently testable paths. A controller should make its operating state understandable to both the firmware and the person configuring it. That is a practical connection between embedded design, human use and verification."],
      },
    ],
    sources: [
      { label: "My Gendio controller record: design decisions, trials and verification scope", url: "/work/gendio-controller/" },
      { label: "Further reading: KiCad 9 PCB Editor manual, including inspection and fabrication outputs", url: "https://docs.kicad.org/9.0/en/pcbnew/pcbnew.html" },
    ],
    note: "Engineering design case study, not a field-validation report, certification statement or peer-reviewed paper. Future hardware work is labelled as proposed.",
  },
];
