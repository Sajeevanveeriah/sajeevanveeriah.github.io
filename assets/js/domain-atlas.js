/*
 * Engineering Domain Atlas
 * Data-driven, filterable atlas of engineering domains with honest evidence
 * tiers. Vanilla JS, no libraries, no external requests. Progressive
 * enhancement: the static fallback list in the markup is replaced with
 * searchable, tier-filterable expandable cards. Every claim is anchored to
 * the resume, the projects on this page or stated study, and tiered as
 * Delivered, Hands-on, Working knowledge, Adjacent or Target.
 */
(function () {
    "use strict";

    var mount = document.querySelector("[data-domain-atlas]");
    if (!mount) return;

    var TIERS = {
        delivered: "Delivered",
        handson: "Hands-on",
        working: "Working knowledge",
        adjacent: "Adjacent",
        target: "Target"
    };

    /* Each entry: cluster kicker, headline tier for the domain, summary,
       subdomains (with per-item tier where it differs from the headline),
       tools and methods, proof points, transferable logic and growth targets. */
    var DOMAINS = [
        {
            cluster: "Systems",
            name: "Mechatronics and Systems Engineering",
            tier: "delivered",
            summary: "The home discipline: integrating mechanical, electrical, embedded, control and software layers into one working system, then proving it with structured test and documentation.",
            subdomains: ["System architecture and decomposition", "Requirements to acceptance mapping", "Electromechanical integration", "Interface definition between layers", "Trade-off analysis across disciplines"],
            tools: ["Block and signal-flow modelling", "MATLAB and Simulink", "FMEA", "FAT and SAT structures", "Engineering documentation"],
            proof: "Bachelor of Mechatronics Engineering (Honours, Distinction), Deakin University. Integrated deliveries at JAG Process Solutions and DuxTel spanning field devices, control logic, data flows and handover.",
            transfer: "Knowing which layer a fault or requirement lives in is the skill that moves between every domain on this page.",
            targets: ["Model-based systems engineering (SysML)"]
        },
        {
            cluster: "Physical systems",
            name: "Mechanical Design, Materials and Thermofluids",
            tier: "handson",
            summary: "Hands-on CAD, mechanism and part design for mechatronic assemblies, backed by degree-level materials, thermodynamics and fluid mechanics coursework.",
            subdomains: ["Part and assembly modelling", "Mechanism design", "Engineering drawings and GD&T", "3D printing and prototyping", { name: "Materials selection", tier: "working" }, { name: "Thermodynamics and fluid mechanics", tier: "working" }, { name: "FEA", tier: "working" }],
            tools: ["SolidWorks", "Fusion 360", "GD&T", "FDM 3D printing", "Pneumatics and hydraulics basics"],
            proof: "Mechanical design and CAD across university projects, the Mars Rover Team and the ESP32 capstone hardware. Drawing review and fabrication QA in structural-steel and carbon-fibre manufacturing roles.",
            transfer: "Mechanism, tolerance and load thinking carries into robot hardware, fixtures, panels and production tooling.",
            targets: ["Design for manufacture at production scale", "Formal FEA validation workflows"]
        },
        {
            cluster: "Physical systems",
            name: "Electrical Systems and Power",
            tier: "handson",
            summary: "Practical motor control, drives, panel wiring and instrumentation power in industrial settings, with machine and power theory from formal study.",
            subdomains: ["VFDs and motor drives", "Control panel and schematic literacy", "Instrumentation wiring and loop checks", "Signal and power segregation", { name: "Electrical machines theory", tier: "working" }, { name: "Power systems and distribution", tier: "working" }],
            tools: ["VFD commissioning", "Control schematics", "Multimeter and loop testing", "Instrumentation datasheets"],
            proof: "Integrated field devices, sensors and drives with control logic at JAG Process Solutions. Motor and drive fundamentals from the mechatronics degree and HND.",
            transfer: "Reading a schematic and tracing a loop is the same discipline whether the cabinet runs a plant, a rig or a robot.",
            targets: ["Switchboard and panel design ownership", "AS/NZS 3000 wiring rules literacy"]
        },
        {
            cluster: "Embedded and electronics",
            name: "Electronics, PCB and Board Bring-up",
            tier: "handson",
            summary: "Working capability from schematic capture and PCB layout through to powering up, debugging and validating real boards.",
            subdomains: ["Schematic capture", "PCB layout", "Board-level bring-up and debug", "Sensor interfacing and signal conditioning", { name: "Analog front-end design", tier: "working" }, { name: "EMC and EMI awareness", tier: "working" }],
            tools: ["Altium", "KiCad", "Oscilloscope and logic analyser use", "ADC, PWM, level shifting", "Signal conditioning"],
            proof: "Designed and brought up sensor boards for the ESP32 clinical capstone and personal robotics and IoT builds, including IMU, ToF, Hall-effect and magnetometer front ends.",
            transfer: "Clean sensing and grounding habits underpin reliable data in every downstream control, telemetry and ML layer.",
            targets: ["Multi-layer high-speed layout", "Formal EMC pre-compliance testing"]
        },
        {
            cluster: "Embedded and electronics",
            name: "Embedded Systems and Firmware",
            tier: "delivered",
            summary: "Microcontroller firmware in C and C++ on ESP32 and STM32, from register-level peripherals and RTOS tasks to provisioning and field deployment.",
            subdomains: ["Embedded C and C++", "RTOS task design (FreeRTOS)", "Peripheral drivers: UART, I2C, SPI, CAN, ADC, PWM", "Low-power and battery-aware design", "Device provisioning and field deployment", { name: "Bootloaders and OTA firmware update", tier: "working" }],
            tools: ["ESP32 and ESP32-S3", "STM32", "FreeRTOS", "PlatformIO and vendor toolchains", "Serial debugging"],
            proof: "Delivered ESP32 GPS and environmental-sensing firmware, provisioning and deployment at DuxTel. Built the capstone clinical sensing device and IoT platform firmware end to end.",
            transfer: "Real-time constraints, interrupt discipline and driver structure transfer directly into robotics, automotive and instrumentation work.",
            targets: ["Functional-safety-rated firmware practices", "Rust for embedded"]
        },
        {
            cluster: "Controls and robotics",
            name: "Control Systems",
            tier: "delivered",
            summary: "Feedback control from classical PID and loop tuning in delivered PLC logic through to state estimation and model-based design from degree and project work.",
            subdomains: ["PID design and tuning", "Process control loops", "Motion control basics", { name: "Kalman and EKF state estimation", tier: "handson" }, { name: "System modelling and simulation", tier: "handson" }, { name: "Modern and optimal control theory", tier: "working" }],
            tools: ["MATLAB and Simulink", "PID tuning in PLC and firmware", "Kalman and EKF filters", "Simulation-first validation"],
            proof: "Control logic delivered for pharmaceutical, biotech and food plants at JAG Process Solutions. Kalman and EKF estimation and PID motion control built into the ROS 2 rover project.",
            transfer: "A control loop is a control loop: the same stability and disturbance thinking applies to a dosing skid, a wheel motor or a thermal chamber.",
            targets: ["Model predictive control in production", "Formal control-loop performance auditing"]
        },
        {
            cluster: "Controls and robotics",
            name: "Industrial Automation, PLC and SCADA",
            tier: "delivered",
            summary: "Professional delivery of PLC, HMI, SCADA, MES and batch systems for regulated plants, including a full SCADA platform migration verified against the validated system.",
            subdomains: ["PLC programming (IEC 61131-3)", "HMI and SCADA engineering", "MES and batch execution", "SCADA platform migration", "Industrial networks: Modbus, Profinet", "FAT, SAT and commissioning"],
            tools: ["Siemens TIA Portal", "WinCC", "PCS 7", "iFIX", "PVI+", "Modbus TCP/RTU", "Profinet"],
            proof: "Executed an iFIX to PVI+ SCADA migration at JAG Process Solutions, converting application content and verifying functional behaviour against the validated system, with FAT, SAT, commissioning and qualification documentation.",
            transfer: "Alarm philosophy, operator usability and data integrity habits carry into every supervisory and telemetry system.",
            targets: ["Allen-Bradley and Rockwell platforms", "Ignition SCADA"]
        },
        {
            cluster: "Controls and robotics",
            name: "Robotics and Autonomy",
            tier: "delivered",
            tierNote: "project delivery",
            summary: "A complete ROS 2 autonomy stack built and validated as a personal and university project: perception, SLAM, state estimation, planning, control and simulation.",
            subdomains: ["ROS 2 architecture and nodes", "SLAM and localisation", "Path planning (A*, Nav2)", "Manipulation basics (MoveIt 2)", "Sensor fusion: LiDAR, IMU, odometry", "Kinematics and dynamics", "Simulation-based validation"],
            tools: ["ROS 2 Humble", "Nav2", "MoveIt 2", "Gazebo", "RViz", "SLAM toolboxes", "A* planning", "EKF localisation"],
            proof: "Built an end-to-end ROS 2 autonomous rover with LiDAR SLAM, A* planning, Kalman and EKF estimation and IMU-odometry fusion. Contributor to the Deakin Mars Rover Team.",
            transfer: "Autonomy is systems engineering at speed: timing, transforms and failure handling sharpen every other integration discipline.",
            targets: ["Commercial robot deployment and fleet operations", "Learning-based perception in production"]
        },
        {
            cluster: "Software and intelligence",
            name: "AI, ML and Data Science",
            tier: "handson",
            summary: "Applied machine learning where it earns its keep: anomaly detection, predictive-maintenance logic, computer vision and time-series analytics wired into real telemetry.",
            subdomains: ["Anomaly detection", "Predictive maintenance concepts", "Time-series analytics and OEE", "Computer vision (OpenCV, YOLO)", "Feature extraction and statistical modelling", { name: "Deep learning model training at scale", tier: "working" }],
            tools: ["Python: NumPy, Pandas, scikit-learn", "OpenCV and YOLO", "MATLAB", "InfluxDB", "Grafana"],
            proof: "Built anomaly detection, predictive-maintenance logic and OEE analytics into the digital-twin concept, and ML-driven monitoring on IoT sensor pipelines. Vision and estimation work in the ROS 2 rover.",
            transfer: "Knowing the physics behind the signal makes the models honest: sensor-aware ML beats black-box ML in engineering settings.",
            targets: ["Production MLOps", "Edge inference on embedded targets"]
        },
        {
            cluster: "Software and intelligence",
            name: "Software Engineering and DevOps",
            tier: "handson",
            summary: "Practical software across Python, C, C++, JavaScript and TypeScript with Linux, Git, REST APIs, databases and test automation, including a deployed club website.",
            subdomains: ["Python and C/C++ development", "REST APIs and integration", "Linux and scripting", "Version control and CI workflows", "Test automation", "Web systems (Next.js, Supabase)", { name: "Databases and time-series stores", tier: "handson" }],
            tools: ["Python", "C and C++", "JavaScript and TypeScript", "Node.js", "Git", "Linux", "JIRA", "InfluxDB"],
            proof: "Test automation and CI workflows in professional validation roles. Built and runs the Newcomb and District Cricket Club website on Next.js and Supabase, plus this static portfolio.",
            transfer: "Clean interfaces, version discipline and automated checks are the connective tissue between every engineering domain here.",
            targets: ["Cloud architecture certification", "Containerised deployment at scale"]
        },
        {
            cluster: "Software and intelligence",
            name: "IoT and Edge-to-Cloud Telemetry",
            tier: "delivered",
            summary: "Professional end-to-end IoT delivery: embedded sensing devices, LoRaWAN networks, MQTT brokers, time-series storage and live operational dashboards.",
            subdomains: ["Low-power device design", "LoRaWAN networks and provisioning", "MQTT and telemetry pipelines", "Gateways and edge devices", "Time-series storage and dashboards", "Field deployment and support"],
            tools: ["ESP32", "LoRaWAN", "ChirpStack", "MQTT", "InfluxDB", "Grafana", "GPS and environmental sensors"],
            proof: "Designed and deployed end-to-end IoT systems at DuxTel, commissioning devices onto ChirpStack LoRaWAN networks and delivering an ESP32 GPS and environmental-sensing workflow through to dashboards.",
            transfer: "Edge-to-cloud thinking scales from a paddock sensor to a plant historian: the same ingestion, buffering and visualisation logic applies.",
            targets: ["Industrial IoT at plant scale (OPC UA)", "Cellular and satellite backhaul systems"]
        },
        {
            cluster: "Sectors",
            name: "Automotive Systems and Validation",
            tier: "delivered",
            summary: "Professional vehicle software and ADAS validation on major OEM programmes, plus regulated emissions and compliance testing, grounded in CAN-level evidence.",
            subdomains: ["CAN and CAN FD analysis", "ADAS feature validation", "OTA update regression testing", "Vehicle instrumentation", "Emissions and compliance testing (ADR, EURO)", "Fault isolation and defect evidence", { name: "EV and HEV architectures", tier: "working" }],
            tools: ["Vector CANoe", "Vector CANalyzer", "Data-acquisition systems", "Emissions instrumentation", "Structured test procedures"],
            proof: "Validated vehicle software and ADAS features across the T6 Ranger and Everest programmes at Ford Motor Company via Invenio contract placement. Emissions and compliance testing against ADR and EURO standards at ABMARC.",
            transfer: "Evidence-first validation, from a CAN trace to a certification report, is a portable habit every regulated industry pays for.",
            targets: ["AUTOSAR literacy", "ISO 26262 functional safety"]
        },
        {
            cluster: "Sectors",
            name: "Biomedical and Clinical Devices",
            tier: "handson",
            summary: "Embedded clinical sensing built and validated against clinical references in an Honours capstone, with working knowledge of human-factors and device-validation concepts.",
            subdomains: ["Embedded physiological sensing", "Real-time signal acquisition", "Measurement validation against references", { name: "Human factors and usability concepts", tier: "working" }, { name: "Medical device regulation awareness", tier: "working" }],
            tools: ["ESP32", "IMU, ToF, Hall-effect, magnetometer sensing", "MATLAB data logging", "Signal processing"],
            proof: "Honours capstone at Deakin University: ESP32 clinical ataxia assessment device with real-time acquisition and measurement validation against clinical references.",
            transfer: "Clinical work forces measurement rigour, repeatability and documentation discipline that generalises to any safety-relevant sensing.",
            targets: ["IEC 62304 software lifecycle", "Clinical trial support engineering"]
        },
        {
            cluster: "Sectors",
            name: "Manufacturing, Production and Quality",
            tier: "delivered",
            summary: "Years on real production floors across food and beverage, carbon-fibre and structural-steel manufacturing: operations, QA, traceability and disciplined documentation.",
            subdomains: ["Production operations", "QA records, ITPs and MDRs", "Material traceability", "Engineering-drawing review", "Inspection planning", "Lean and continuous improvement"],
            tools: ["ITP and MDR documentation", "FMEA", "Lean Six Sigma Foundation", "KAIZEN", "Traceability systems"],
            proof: "Manufacturing, QA and documentation roles at IDL, Carbon Revolution and Thornton Engineering from 2018 to 2024, spanning food and beverage, carbon-fibre and structural-steel production.",
            transfer: "Floor-level empathy for operators and inspectors makes automation, HMI and MES design markedly better.",
            targets: ["Six Sigma Green Belt", "Production line ownership"]
        },
        {
            cluster: "Sectors",
            name: "Process, Pharma and Regulated Manufacturing",
            tier: "delivered",
            summary: "Smart-factory and control engineering delivered for pharmaceutical, biotech and food clients under GMP, with GAMP 5 validation discipline through to qualification and handover.",
            subdomains: ["GMP working practices", "GAMP 5 validation lifecycle", "Batch systems and execution", "Process visualisation", "Qualification and handover documentation", { name: "P&ID and process design literacy", tier: "working" }],
            tools: ["GAMP 5", "FDA 21 CFR Part 11 awareness", "Batch execution systems", "FAT, SAT, IQ/OQ-style documentation"],
            proof: "Delivered control, integration and smart-factory engineering for pharmaceutical, biotech and food clients under GMP at JAG Process Solutions, across plants, skids and packaged units.",
            transfer: "If it is not documented, it did not happen: regulated-industry discipline raises the quality bar in every other sector.",
            targets: ["CQV engineering roles", "Process engineering depth in pharma"]
        },
        {
            cluster: "Sectors",
            name: "Civil, Structural and Infrastructure Awareness",
            tier: "adjacent",
            summary: "Transferable exposure from structural-steel fabrication QA: reading structural drawings, weld and inspection documentation, and standards-driven fabrication workflows.",
            subdomains: ["Structural drawing review", "Steel fabrication QA", "ITP-driven inspection", "Standards-driven documentation"],
            tools: ["Engineering drawings", "ITPs and MDRs", "Material traceability records"],
            proof: "QA, drawing review and documentation work at Thornton Engineering across structural-steel fabrication projects.",
            transfer: "Standards-driven fabrication QA is a direct bridge into infrastructure, rail and energy project work.",
            targets: ["Infrastructure automation and monitoring systems"]
        },
        {
            cluster: "Sectors",
            name: "Aerospace, Space, Marine, Rail, Defence, Mining, Agriculture and Energy",
            tier: "adjacent",
            summary: "Sector adjacencies reached through rover robotics, field IoT and hands-on farm work, held honestly as adjacent exposure and strategic growth targets rather than delivery claims.",
            subdomains: [{ name: "Space and field robotics (Mars Rover Team)", tier: "adjacent" }, { name: "Agricultural sensing and AgTech", tier: "adjacent" }, { name: "Mining automation", tier: "target" }, { name: "Rail systems and signalling", tier: "target" }, { name: "Defence systems engineering", tier: "target" }, { name: "Marine and offshore systems", tier: "target" }, { name: "Energy and renewables integration", tier: "target" }],
            tools: ["ROS 2 field robotics", "Environmental and GPS telemetry", "Remote asset monitoring patterns"],
            proof: "Deakin Mars Rover Team contribution, deployed environmental and GPS IoT monitoring, and practical agricultural experience as a farmhand.",
            transfer: "Autonomy, telemetry, harsh-environment sensing and regulated validation are exactly the capabilities these sectors hire for.",
            targets: ["Mining autonomy programmes", "Defence-adjacent autonomous systems", "Renewable energy plant automation"]
        },
        {
            cluster: "Assurance and delivery",
            name: "Safety, Reliability, Standards and Cyber-physical Security",
            tier: "working",
            summary: "Working knowledge of the machinery-safety, industrial-cybersecurity and quality standards that frame the delivered automation and validation work, applied through documentation and test practice.",
            subdomains: [{ name: "Evidence-based test documentation", tier: "delivered" }, { name: "FMEA and risk assessment", tier: "handson" }, "Machinery safety (ISO 13849)", "Industrial cybersecurity (IEC 62443)", "Computerised system validation (GAMP 5, 21 CFR Part 11)", { name: "Reliability engineering methods", tier: "working" }],
            tools: ["ISO 13849", "IEC 62443", "GAMP 5", "FDA 21 CFR Part 11", "IEC 61131-3", "FMEA"],
            proof: "Standards applied through GMP automation delivery, FMEA and QA documentation across JAG, ABMARC and manufacturing roles.",
            transfer: "Standards literacy converts good engineering into defensible engineering: it is the language auditors and safety leads trust.",
            targets: ["Functional safety certification (TUV style)", "IEC 62443 practitioner depth"]
        },
        {
            cluster: "Assurance and delivery",
            name: "Project Delivery, Commissioning and Handover",
            tier: "delivered",
            summary: "Taking systems over the line: structured FAT and SAT, site commissioning, fault resolution, stakeholder communication and complete qualification and handover packages.",
            subdomains: ["FAT and SAT execution", "Site commissioning", "Qualification documentation", "Stakeholder and client communication", "Fault resolution under time pressure", "Handover and training material"],
            tools: ["FAT and SAT protocols", "Commissioning plans", "JIRA and Agile", "Structured reporting"],
            proof: "Produced FAT, SAT, commissioning, qualification and handover documentation at JAG Process Solutions and resolved faults raised during testing and site support. Readiness-milestone evidence at Ford via Invenio.",
            transfer: "Commissioning is where every discipline meets reality: it proves the breadth claimed everywhere else on this page.",
            targets: ["Lead commissioning roles", "Multi-discipline project engineering"]
        }
    ];

    function esc(value) {
        return String(value).replace(/[&<>"]/g, function (ch) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
        });
    }

    function tierBadge(tier, note) {
        return '<span class="tier tier-' + tier + '">' + TIERS[tier] + (note ? '<span class="tier-note">' + esc(note) + "</span>" : "") + "</span>";
    }

    function subItem(sub) {
        if (typeof sub === "string") return '<li class="chip">' + esc(sub) + "</li>";
        return '<li class="chip chip-tiered">' + esc(sub.name) + ' <span class="chip-tier chip-tier-' + sub.tier + '">' + TIERS[sub.tier] + "</span></li>";
    }

    function searchText(d) {
        var parts = [d.name, d.cluster, d.summary, d.proof, d.transfer, TIERS[d.tier]];
        d.subdomains.forEach(function (s) { parts.push(typeof s === "string" ? s : s.name); });
        parts = parts.concat(d.tools, d.targets || []);
        return parts.join(" ").toLowerCase();
    }

    /* ── Build the atlas ── */
    var wrap = document.createElement("div");
    wrap.className = "atlas";

    var CLUSTERS = [];
    DOMAINS.forEach(function (d) {
        if (CLUSTERS.indexOf(d.cluster) === -1) CLUSTERS.push(d.cluster);
    });

    var controls = document.createElement("div");
    controls.className = "atlas-controls";
    controls.innerHTML =
        '<div class="atlas-search">' +
        '<label class="atlas-search-label" for="atlas-search-input">Search domains, tools and methods</label>' +
        '<input type="search" id="atlas-search-input" class="atlas-search-input" placeholder="Try SLAM, GAMP 5, CAN, PCB, LoRaWAN" autocomplete="off">' +
        "</div>" +
        '<div class="atlas-cluster">' +
        '<label class="atlas-search-label" for="atlas-cluster-select">Domain cluster</label>' +
        '<select id="atlas-cluster-select" class="atlas-cluster-select">' +
        '<option value="all">All clusters</option>' +
        CLUSTERS.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("") +
        "</select>" +
        "</div>" +
        '<div class="atlas-filters" role="group" aria-label="Filter domains by evidence tier">' +
        '<button type="button" class="skill-tab is-active" data-tier="all" aria-pressed="true">All tiers</button>' +
        Object.keys(TIERS).map(function (key) {
            return '<button type="button" class="skill-tab" data-tier="' + key + '" aria-pressed="false">' + TIERS[key] + "</button>";
        }).join("") +
        "</div>";

    var status = document.createElement("p");
    status.className = "atlas-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    var grid = document.createElement("div");
    grid.className = "atlas-grid";

    var cards = DOMAINS.map(function (d, i) {
        var card = document.createElement("article");
        card.className = "atlas-card";
        card.setAttribute("data-tier", d.tier);
        card.setAttribute("data-cluster", d.cluster);
        card.setAttribute("data-search", searchText(d));
        card.innerHTML =
            '<details class="atlas-details">' +
            '<summary class="atlas-summary">' +
            '<span class="atlas-summary-head"><span class="card-label">' + esc(d.cluster) + "</span>" + tierBadge(d.tier, d.tierNote) + "</span>" +
            '<span class="atlas-name">' + esc(d.name) + "</span>" +
            '<span class="atlas-lede">' + esc(d.summary) + "</span>" +
            "</summary>" +
            '<div class="atlas-body">' +
            '<p class="atlas-row-label">Subdomains</p>' +
            '<ul class="chip-row">' + d.subdomains.map(subItem).join("") + "</ul>" +
            '<p class="atlas-row-label">Tools and methods</p>' +
            '<ul class="chip-row">' + d.tools.map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("") + "</ul>" +
            '<p class="atlas-row-label">Proof</p>' +
            '<p class="atlas-text">' + esc(d.proof) + "</p>" +
            '<p class="atlas-row-label">Transferable logic</p>' +
            '<p class="atlas-text">' + esc(d.transfer) + "</p>" +
            (d.targets && d.targets.length
                ? '<p class="atlas-row-label">Growth targets</p><ul class="chip-row">' + d.targets.map(function (t) { return '<li class="chip chip-target">' + esc(t) + "</li>"; }).join("") + "</ul>"
                : "") +
            "</div>" +
            "</details>";
        grid.appendChild(card);
        return card;
    });

    /* ── Filtering ── */
    var activeTier = "all";
    var activeCluster = "all";
    var query = "";
    var tierButtons;

    function applyFilters() {
        var shown = 0;
        cards.forEach(function (card) {
            var tierOk = activeTier === "all" || card.getAttribute("data-tier") === activeTier;
            var clusterOk = activeCluster === "all" || card.getAttribute("data-cluster") === activeCluster;
            var textOk = !query || card.getAttribute("data-search").indexOf(query) !== -1;
            var visible = tierOk && clusterOk && textOk;
            card.hidden = !visible;
            if (visible) shown++;
        });
        status.textContent = "Showing " + shown + " of " + DOMAINS.length + " domains" +
            (activeCluster !== "all" ? " in cluster: " + activeCluster : "") +
            (activeTier !== "all" ? " at tier: " + TIERS[activeTier] : "") +
            (query ? ' matching "' + query + '"' : "") + ".";
    }

    controls.addEventListener("click", function (event) {
        var btn = event.target.closest("[data-tier]");
        if (!btn) return;
        activeTier = btn.getAttribute("data-tier");
        tierButtons.forEach(function (b) {
            var on = b === btn;
            b.classList.toggle("is-active", on);
            b.setAttribute("aria-pressed", String(on));
        });
        applyFilters();
    });

    var searchInput = controls.querySelector("#atlas-search-input");
    searchInput.addEventListener("input", function () {
        query = searchInput.value.trim().toLowerCase();
        applyFilters();
    });

    var clusterSelect = controls.querySelector("#atlas-cluster-select");
    clusterSelect.addEventListener("change", function () {
        activeCluster = clusterSelect.value;
        applyFilters();
    });

    /* ── Mount: replace the static fallback ── */
    wrap.appendChild(controls);
    wrap.appendChild(status);
    wrap.appendChild(grid);
    mount.innerHTML = "";
    mount.appendChild(wrap);
    tierButtons = Array.prototype.slice.call(controls.querySelectorAll("[data-tier]"));
    applyFilters();
}());
