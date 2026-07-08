/*
 * Engineering Capability Map
 * Self-contained vanilla-JS hub-and-spoke graph for the hero.
 * No libraries, no external requests. Progressive enhancement: the static
 * fallback grid in the markup is replaced with an interactive SVG (wide
 * screens) and a vertical button list (narrow screens). Both views share one
 * selection model with hover, click/pin and full keyboard support, an
 * aria-live detail panel, and a reduced-motion-safe idle highlight.
 */
(function () {
    "use strict";

    var stage = document.querySelector("[data-competency-map]");
    if (!stage) return;

    var SVGNS = "http://www.w3.org/2000/svg";
    var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var reduceMotion = motionQuery ? motionQuery.matches : false;

    /* Fourteen high-level domains for the hero map. Full depth lives in the
       Domain Atlas; this map stays deliberately readable. */
    var DOMAINS = [
        { name: "Mechanical Design", label: "Mechanical", desc: "Hands-on CAD, mechanism and part design for mechatronic assemblies.", skills: ["SolidWorks", "Fusion 360", "GD&T", "Mechanism design", "3D printing (FDM)"] },
        { name: "Electrical and Power", label: "Electrical", desc: "Practical motor control, drives, panels and instrumentation wiring.", skills: ["VFDs and motor drives", "Control schematics", "Instrumentation wiring", "Signal conditioning"] },
        { name: "Electronics and PCB", label: "Electronics", desc: "Schematic capture and PCB layout through to board bring-up and sensing.", skills: ["Altium", "KiCad", "Board-level bring-up", "IMU, LiDAR, ToF sensors", "Signal conditioning"] },
        { name: "Embedded and Firmware", label: "Firmware", desc: "Hands-on microcontroller firmware in C and C++ on ESP32 and STM32.", skills: ["ESP32 / ESP32-S3", "STM32", "Embedded C/C++", "FreeRTOS", "UART, I2C, SPI, CAN"] },
        { name: "Control Systems", label: "Control", desc: "Delivered control loops, state estimation and PLC logic.", skills: ["PID control", "Kalman and EKF", "IEC 61131-3", "MATLAB and Simulink"] },
        { name: "Automation and SCADA", label: "Automation", desc: "Delivery experience in PLC, HMI, SCADA and MES for regulated plants.", skills: ["Siemens TIA Portal", "WinCC", "PCS 7", "iFIX", "PVI+", "MES and batch"] },
        { name: "Robotics and Autonomy", label: "Robotics", desc: "Full ROS 2 autonomy stack across mapping, planning and sensor fusion.", skills: ["ROS 2 (Humble)", "Nav2", "MoveIt 2", "Gazebo", "SLAM", "A* path planning"] },
        { name: "AI, ML and Vision", label: "AI/ML", desc: "Applied ML for anomaly detection, prediction and machine vision.", skills: ["Anomaly detection", "scikit-learn", "OpenCV and YOLO", "Predictive maintenance"] },
        { name: "Software and Data", label: "Software", desc: "Practical Python, C/C++ and TypeScript with pipelines and dashboards.", skills: ["Python", "REST APIs", "Git and Linux", "InfluxDB", "Grafana"] },
        { name: "IoT and Telemetry", label: "IoT", desc: "Delivered low-power telemetry from device through to dashboard.", skills: ["ESP32", "LoRaWAN", "ChirpStack", "MQTT", "GPS"] },
        { name: "Automotive and Validation", label: "Automotive", desc: "OEM-programme ADAS validation plus emissions and compliance testing.", skills: ["Vector CANoe", "CANalyzer", "CAN FD", "ADAS validation", "ADR and EURO exposure"] },
        { name: "Manufacturing and QA", label: "Manufacturing", desc: "Production-floor, traceability and structured QA documentation.", skills: ["ITPs", "MDRs", "Traceability", "FMEA", "Lean"] },
        { name: "Safety and Standards", label: "Standards", desc: "Working knowledge of machinery, security and quality standards.", skills: ["ISO 13849", "IEC 62443", "GAMP 5", "FDA 21 CFR Part 11"] },
        { name: "Commissioning and Delivery", label: "Delivery", desc: "Delivery through FAT, SAT, commissioning, qualification and handover.", skills: ["FAT", "SAT", "Qualification", "Handover", "GMP / GAMP 5"] }
    ];

    var N = DOMAINS.length;

    function esc(value) {
        return String(value).replace(/[&<>"]/g, function (ch) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
        });
    }

    function svgEl(tag, attrs) {
        var node = document.createElementNS(SVGNS, tag);
        if (attrs) {
            for (var key in attrs) {
                if (Object.prototype.hasOwnProperty.call(attrs, key)) node.setAttribute(key, attrs[key]);
            }
        }
        return node;
    }

    /* ── Geometry ── */
    var VB_W = 860, VB_H = 700, CX = 430, CY = 350, R = 228, LABEL_R = R + 20, HUB_R = 54;

    var positions = DOMAINS.map(function (d, i) {
        var ang = (-90 + i * 360 / N) * Math.PI / 180;
        return { ang: ang, cos: Math.cos(ang), sin: Math.sin(ang), x: CX + R * Math.cos(ang), y: CY + R * Math.sin(ang) };
    });

    /* ── Build the SVG graph view ── */
    var svg = svgEl("svg", { viewBox: "0 0 " + VB_W + " " + VB_H, class: "map-graph", role: "group" });
    svg.setAttribute("aria-label", "Engineering capability map. " + N + " domains arranged around a Mechatronics Systems hub.");

    var spokeGroup = svgEl("g", { class: "map-spokes" });
    var nodeGroup = svgEl("g", { class: "map-nodes" });
    var graphNodes = [];

    positions.forEach(function (p, i) {
        var spoke = svgEl("line", { x1: CX, y1: CY, x2: p.x, y2: p.y, class: "map-spoke", "data-spoke": i });
        spokeGroup.appendChild(spoke);

        var g = svgEl("g", { class: "map-node", "data-node": i, role: "button", "aria-label": DOMAINS[i].name, "aria-pressed": "false", tabindex: i === 0 ? "0" : "-1" });
        g.appendChild(svgEl("circle", { cx: p.x, cy: p.y, r: 8, class: "map-node-dot" }));

        var lx = CX + LABEL_R * p.cos;
        var ly = CY + LABEL_R * p.sin;
        /* Only the exact top and bottom nodes are centre-anchored; every other
           label splays outward (start on the right half, end on the left half)
           so neighbouring labels never overlap. */
        var anchor = p.cos > 0.08 ? "start" : (p.cos < -0.08 ? "end" : "middle");
        var baseline = p.sin > 0.34 ? "hanging" : (p.sin < -0.34 ? "auto" : "middle");
        var label = svgEl("text", { x: lx, y: ly, class: "map-node-label", "text-anchor": anchor, "dominant-baseline": baseline });
        label.textContent = DOMAINS[i].label;
        g.appendChild(label);

        nodeGroup.appendChild(g);
        graphNodes.push(g);
    });

    var hub = svgEl("g", { class: "map-hub" });
    hub.appendChild(svgEl("circle", { cx: CX, cy: CY, r: HUB_R, class: "map-hub-circle" }));
    var hubA = svgEl("text", { x: CX, y: CY - 5, class: "map-hub-text", "text-anchor": "middle" });
    hubA.textContent = "Mechatronics";
    var hubB = svgEl("text", { x: CX, y: CY + 16, class: "map-hub-text", "text-anchor": "middle" });
    hubB.textContent = "Systems";
    hub.appendChild(hubA);
    hub.appendChild(hubB);

    svg.appendChild(spokeGroup);
    svg.appendChild(hub);
    svg.appendChild(nodeGroup);

    /* ── Build the narrow-screen list view ── */
    var listWrap = document.createElement("div");
    listWrap.className = "map-list";
    var list = document.createElement("ul");
    list.setAttribute("role", "list");
    var listNodes = [];

    DOMAINS.forEach(function (d, i) {
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "map-list-btn";
        btn.setAttribute("data-node", i);
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("tabindex", i === 0 ? "0" : "-1");
        btn.innerHTML = '<span class="map-list-name">' + esc(d.name) + "</span>";
        li.appendChild(btn);
        list.appendChild(li);
        listNodes.push(btn);
    });
    listWrap.appendChild(list);

    /* ── Detail panel (aria-live) ── */
    var detail = document.createElement("div");
    detail.className = "map-detail";
    detail.setAttribute("role", "status");
    detail.setAttribute("aria-live", "polite");

    var DEFAULT_DETAIL =
        '<p class="map-detail-kicker">Engineering capability</p>' +
        '<h3 class="map-detail-name">Mechatronics Systems</h3>' +
        '<p class="map-detail-desc">Select a domain to see the concrete tools and standards behind it. Fourteen domains feed one integrated systems capability.</p>';

    function renderDetail(index) {
        if (index < 0) {
            detail.innerHTML = DEFAULT_DETAIL;
            return;
        }
        var d = DOMAINS[index];
        var chips = d.skills.map(function (s) { return '<li class="map-chip">' + esc(s) + "</li>"; }).join("");
        detail.innerHTML =
            '<p class="map-detail-kicker">Domain' + (index === pinned ? " &middot; pinned" : "") + "</p>" +
            '<h3 class="map-detail-name">' + esc(d.name) + "</h3>" +
            '<p class="map-detail-desc">' + esc(d.desc) + "</p>" +
            '<ul class="map-chips" aria-label="Tools and standards">' + chips + "</ul>";
    }

    /* ── Selection state ── */
    var pinned = -1;
    var active = -1;
    var focusIndex = 0;

    function applyActive(index) {
        active = index;
        graphNodes.forEach(function (g, i) {
            g.classList.toggle("is-active", i === index);
            g.setAttribute("aria-pressed", i === pinned ? "true" : "false");
        });
        listNodes.forEach(function (b, i) {
            b.classList.toggle("is-active", i === index);
            b.setAttribute("aria-pressed", i === pinned ? "true" : "false");
        });
        var spokes = spokeGroup.childNodes;
        for (var s = 0; s < spokes.length; s++) {
            if (spokes[s].classList) spokes[s].classList.toggle("is-active", s === index);
        }
        renderDetail(index);
    }

    function show(index) {
        endIdle();
        applyActive(index);
    }

    function revertToBaseline() {
        applyActive(pinned);
    }

    function togglePin(index) {
        pinned = (pinned === index) ? -1 : index;
        endIdle();
        applyActive(pinned >= 0 ? pinned : index);
    }

    function setRovingFocus(index) {
        focusIndex = index;
        graphNodes.forEach(function (g, i) { g.setAttribute("tabindex", i === index ? "0" : "-1"); });
        listNodes.forEach(function (b, i) { b.setAttribute("tabindex", i === index ? "0" : "-1"); });
    }

    function moveFocus(from, delta, viewNodes) {
        var next = (from + delta + N) % N;
        setRovingFocus(next);
        if (viewNodes[next].focus) viewNodes[next].focus({ preventScroll: true });
        show(next);
    }

    function wireNode(nodeEl, index, viewNodes) {
        nodeEl.addEventListener("mouseenter", function () { show(index); });
        nodeEl.addEventListener("focus", function () { setRovingFocus(index); show(index); });
        nodeEl.addEventListener("click", function () {
            togglePin(index);
            if (nodeEl.focus) nodeEl.focus({ preventScroll: true });
        });
        nodeEl.addEventListener("keydown", function (event) {
            switch (event.key) {
                case "ArrowRight":
                case "ArrowDown":
                    event.preventDefault();
                    moveFocus(index, 1, viewNodes);
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                    event.preventDefault();
                    moveFocus(index, -1, viewNodes);
                    break;
                case "Home":
                    event.preventDefault();
                    setRovingFocus(0);
                    viewNodes[0].focus({ preventScroll: true });
                    show(0);
                    break;
                case "End":
                    event.preventDefault();
                    setRovingFocus(N - 1);
                    viewNodes[N - 1].focus({ preventScroll: true });
                    show(N - 1);
                    break;
                case "Enter":
                case " ":
                case "Spacebar":
                    event.preventDefault();
                    togglePin(index);
                    break;
            }
        });
    }

    graphNodes.forEach(function (g, i) { wireNode(g, i, graphNodes); });
    listNodes.forEach(function (b, i) { wireNode(b, i, listNodes); });

    /* Leaving the map reverts to the pinned domain (or the default prompt). */
    svg.addEventListener("mouseleave", revertToBaseline);
    listWrap.addEventListener("mouseleave", revertToBaseline);

    /* ── Idle highlight (reduced-motion-safe, pauses when hidden) ── */
    var idleRAF = null;
    var idleLast = 0;
    var idleIdx = 0;
    var idleEnded = reduceMotion;

    function clearIdle() {
        graphNodes.forEach(function (g) { g.classList.remove("is-idle"); });
        listNodes.forEach(function (b) { b.classList.remove("is-idle"); });
    }

    function idleStep(ts) {
        if (idleEnded) { idleRAF = null; return; }
        if (!idleLast) idleLast = ts;
        if (ts - idleLast >= 1500) {
            idleLast = ts;
            graphNodes[idleIdx].classList.remove("is-idle");
            listNodes[idleIdx].classList.remove("is-idle");
            idleIdx = (idleIdx + 1) % N;
            if (active !== idleIdx && pinned !== idleIdx) {
                graphNodes[idleIdx].classList.add("is-idle");
                listNodes[idleIdx].classList.add("is-idle");
            }
        }
        idleRAF = requestAnimationFrame(idleStep);
    }

    function startIdle() {
        if (idleEnded || idleRAF || document.hidden) return;
        idleLast = 0;
        idleRAF = requestAnimationFrame(idleStep);
    }

    function pauseIdle() {
        if (idleRAF) { cancelAnimationFrame(idleRAF); idleRAF = null; }
    }

    function endIdle() {
        if (idleEnded) return;
        idleEnded = true;
        pauseIdle();
        clearIdle();
    }

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) pauseIdle();
        else startIdle();
    });

    if (motionQuery) {
        var onMotionChange = function () {
            reduceMotion = motionQuery.matches;
            if (reduceMotion) endIdle();
        };
        if (motionQuery.addEventListener) motionQuery.addEventListener("change", onMotionChange);
        else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);
    }

    /* ── Mount: replace the static fallback with the interactive views ── */
    stage.innerHTML = "";
    stage.appendChild(svg);
    stage.appendChild(listWrap);
    stage.appendChild(detail);

    applyActive(-1);
    startIdle();
}());
