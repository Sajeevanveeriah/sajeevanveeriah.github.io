/**
 * Technical depth treatments.
 *
 * Each entry turns a technique named on a record or Atlas domain into a
 * self-contained explanation: what it does, the mechanism underneath it,
 * why it was chosen, how it was implemented, the failure modes guarded
 * against and how the result was verified. (Prose recast to generic,
 * agentless voice on 7 August 2026 per the owner's direction.)
 * Treatments render inside the TechnicalDepth disclosure on
 * the page where the technique is claimed.
 *
 * Every implementation statement here stays within what the records and
 * employer entries already evidence. Mechanism explanations are engineering
 * knowledge; claims about the delivered systems are limited to what those
 * systems actually did. No rates, gains, resolutions or results appear
 * unless a record already states them.
 */

export interface Technique {
  readonly id: string
  readonly name: string
  readonly paragraphs: readonly string[]
}

export const techniques: readonly Technique[] = [
  {
    id: 'a-star-search',
    name: 'A* graph search',
    paragraphs: [
      'A* finds the cheapest path through a graph by expanding nodes in order of f(n) = g(n) + h(n), where g is the accumulated cost from the start and h is a heuristic estimate of the cost remaining to the goal. It keeps an open set of frontier nodes ordered by f and a closed set of nodes already expanded. The heuristic carries the guarantees: if h never overestimates the true remaining cost it is admissible and the first path A* returns to the goal is optimal, and if h is also consistent, meaning h(n) never exceeds the step cost to a neighbour plus h at that neighbour, no node ever needs re-expansion after it enters the closed set.',
      'On an occupancy grid the design decisions are the cost function and the grid itself. Grid resolution trades path fidelity against the number of cells the search must touch, and an inflation radius grows the cost around obstacles so the planner treats the robot as a body with clearance rather than a point, which is what stops geometrically valid paths from clipping corners the physical robot cannot make. Tie-breaking matters too: many grid paths share the same f value, and biasing expansion towards the goal stops the search flooding sideways across cost plateaus.',
      'In the ROS 2 rover, A* ran over the occupancy grid that LiDAR SLAM produced, with planning kept in its own node so the planner could be exercised, tuned and replaced without touching perception or control. Replanning is part of the design: when the map updates or the goal changes, the planner produces a fresh path from the current estimated pose rather than patching the old one.',
      'The failure modes guarded against are quiet ones: an inadmissible heuristic still returns paths, just silently suboptimal ones, and an inflation radius that is too small produces paths a real chassis cannot track. Planning behaviour was verified through repeated Gazebo simulation runs, inspecting the planned paths against the map in RViz and checking that replanning around newly observed obstacles stayed consistent across reruns.',
    ],
  },
  {
    id: 'kalman-filter',
    name: 'Kalman filter',
    paragraphs: [
      'A Kalman filter is a recursive state estimator: it keeps a state vector, such as pose and velocity, together with a covariance matrix that says how uncertain that state is. Each cycle has two steps. Prediction pushes the state forward through a process model and grows the covariance by the process noise Q, which encodes how much the model is trusted to describe the real motion. Update corrects the prediction with a measurement through a measurement model, weighted by the measurement noise R. The Kalman gain is the balance point between the two: small R pulls the estimate towards the sensor, small Q pulls it towards the model.',
      'Tuning Q and R is where the filter is actually engineered. The signal to watch is the innovation, the difference between what the measurement model predicted and what the sensor delivered. A well-tuned filter produces innovations that look like zero-mean noise sized to the innovation covariance; innovations that stay biased in one direction mean the models or the noise matrices are wrong, and that residual monitoring is the honest check on whether the filter is doing estimation or just smoothing.',
      'In the rover, Kalman filtering ran on the odometry and IMU signals feeding the navigation stack, tuned by running the simulation repeatedly and watching estimate stability against the simulated world rather than trusting a single pass. The estimation layer lived in its own node, so the filter could be adjusted and re-validated without disturbing planning or control.',
      'The failure modes are asymmetric: Q too small makes the filter overconfident in its model so it ignores real measurements, and R too large makes it sluggish so state changes arrive late to the planner. The behaviour was verified through repeated simulation reruns, checking in RViz that the estimated transforms stayed stable and that localisation held across runs instead of degrading.',
    ],
  },
  {
    id: 'extended-kalman-filter',
    name: 'Extended Kalman filter',
    paragraphs: [
      'The plain Kalman filter is only optimal for linear models, and mobile robot models are not linear: heading enters the motion equations through sines and cosines, and range-bearing style measurements are nonlinear in the pose. The extended Kalman filter handles this by linearising both models about the current estimate at every step, replacing the fixed matrices of the linear filter with Jacobians, the matrices of partial derivatives of the process and measurement functions evaluated at the working point.',
      'That linearisation is also the EKF risk. The Jacobian is only a faithful stand-in near the point it was evaluated at, so a poor initial estimate, an aggressive motion between updates or badly sized noise matrices can make the filter diverge: the covariance stops representing the real error and the estimate walks away from the truth while still reporting confidence.',
      'In the rover the EKF fused IMU and wheel odometry into one continuous pose estimate. The divergence risk was guarded structurally: the fused estimate was continuously compared against the LiDAR SLAM pose, so drift between the dead-reckoned estimate and the map-referenced one was visible rather than hidden, and the estimation node could be retuned independently of the rest of the stack.',
      'Verification was the same discipline as the linear filter, applied harder: repeated Gazebo runs, watching the fused estimate against raw odometry to confirm the fusion was earning its place, and inspecting the transform tree in RViz for the slow rotation and translation drift that a diverging EKF produces.',
    ],
  },
  {
    id: 'slam',
    name: 'SLAM',
    paragraphs: [
      'Simultaneous localisation and mapping answers a circular problem: a robot needs a map to localise, and needs its location to build a map, so both must be estimated together. With LiDAR the workhorse is scan matching, aligning each new scan against the previous scans or the map so far to recover the motion between them. The map itself is an occupancy grid: each cell holds the accumulated evidence that it is occupied or free, updated as rays pass through cells to their measured endpoints.',
      'Scan matching drifts, because every alignment carries a small error and the errors compound. The drift manifests physically: corridors bend, straight walls double, and a loop of travel fails to close back on itself. Loop closure is the correction mechanism: when the system recognises a previously mapped place, the accumulated error around the loop becomes measurable and can be redistributed back through the trajectory, snapping the map straight.',
      'In the rover, LiDAR SLAM produced the occupancy grid that everything downstream consumed: the A* planner searched it and the localisation estimate was referenced to it. SLAM ran as its own node in the ROS 2 stack, so mapping could be restarted and inspected without restarting planning or control.',
      'Mapping was verified through repeated simulation runs, inspecting the grid in RViz for the signature failures, doubled walls, bent geometry and unstable localisation, and checking that maps of the same simulated world stayed consistent across reruns rather than diverging run to run.',
    ],
  },
  {
    id: 'sensor-fusion',
    name: 'Sensor fusion',
    paragraphs: [
      'No single sensor on a mobile robot is sufficient, and the reasons are complementary. Wheel odometry is smooth and high-rate but integrates error continuously and lies outright when a wheel slips. An IMU measures rotation rates and accelerations at high rate, but turning those into position means integrating noise, so it drifts on its own timescale. LiDAR measures the actual geometry of the world and does not drift, but it arrives at a lower rate and needs distinctive structure to match against.',
      'Fusion architecture is about assigning each sensor the role its error profile earns. In the rover the EKF fused wheel odometry and IMU data into a continuous short-horizon estimate, and LiDAR SLAM provided the map-referenced correction that stopped the dead-reckoned estimate wandering. The continuous estimate keeps control responsive between scans; the absolute reference keeps the whole thing honest over minutes.',
      'The practical discipline is in the interfaces: each source publishes its own topic with its own timing, the fusion node owns the combination, and the transform tree exposes the result. That separation means a misbehaving sensor is diagnosable, because its raw stream and the fused output can be compared directly.',
      'Fusion behaviour was validated in repeated Gazebo runs by comparing fused localisation stability against what odometry alone produced, and by watching for the disagreement signatures, fused pose stepping when a correction lands, or drifting between corrections, that indicate the noise models need rebalancing.',
    ],
  },
  {
    id: 'pid-control',
    name: 'PID control',
    paragraphs: [
      'PID is feedback control built from three views of the same error signal. The proportional term pushes against the present error, and alone it leaves a steady-state offset on any plant that needs sustained effort to hold a setpoint. The integral term accumulates the error history and removes that offset, and the derivative term reacts to the rate of change, damping the response and letting the proportional gain be higher than it could be alone.',
      'Each term has a known pathology. The integrator keeps accumulating while an actuator is saturated, then unwinds slowly after the setpoint is reached, which is integral windup, and the standard mitigations are clamping the integrator or back-calculating it from the actuator limit. The derivative term amplifies measurement noise and kicks hard on a setpoint step, which is why it is computed on the measurement rather than the error and filtered. A loop that ignores either pathology tunes well on paper and misbehaves on the plant.',
      'PID has been applied in two settings the records evidence: motion control in the ROS 2 rover, tuned against simulated step behaviour, and process control loops in PLC logic delivered professionally for regulated manufacturing clients. The tuning practice is iterative and observational: raise proportional gain until the response is fast but oscillatory, add derivative action to damp it, then add just enough integral action to remove the remaining offset, watching overshoot, rise and settling behaviour on each change.',
      'Verification differs by setting but the logic is the same: in simulation, manoeuvres were re-run to check the response stayed consistent across runs, and in plant work loop behaviour is proven during commissioning and FAT and SAT execution, where the response to setpoint changes and disturbances is exercised and documented rather than assumed.',
    ],
  },
  {
    id: 'ros2-architecture',
    name: 'ROS 2 architecture',
    paragraphs: [
      'ROS 2 structures a robot as a graph of nodes that communicate through typed topics, services and actions over DDS. Topics carry continuous streams such as scans, odometry and velocity commands; services carry request-reply interactions. Quality of service settings tune each connection to its data: a sensor stream is usually best-effort with a shallow queue, because a stale scan is worse than a dropped one, while commands and state that must arrive use reliable delivery. Getting QoS wrong is a classic silent failure, since publishers and subscribers with incompatible profiles simply never connect.',
      'The rover was decomposed along the natural seams of the autonomy problem: sensing, LiDAR SLAM, state estimation with Kalman and EKF filtering, A* and Nav2 planning, motion control, simulation and visualisation each ran as separate nodes. The launch structure composed them into one system, which is what makes a stack like this operable: one entry point brings the graph up in order with consistent parameters.',
      'The reason for that decomposition is testability. Because every interface is a published message contract, each node can be run against recorded or simulated inputs on its own: the planner can be exercised against a saved map, the estimator against replayed sensor streams. Each layer was tuned and validated independently before running the integrated stack, which is the difference between debugging a node and debugging a robot.',
      'The integrated verification then happened in Gazebo with RViz as the window into the graph: checking the transform tree was consistent, topics flowed at the expected rates and the composed system reproduced the behaviour the individual nodes had shown in isolation, across repeated runs rather than a single demonstration.',
    ],
  },
  {
    id: 'nav2-moveit',
    name: 'Nav2 and MoveIt 2',
    paragraphs: [
      'Nav2 is the ROS 2 navigation framework, and its core design is a behaviour tree orchestrating dedicated servers. The planner server produces a global path across the costmap; the controller server turns that path into velocity commands that track it locally; recovery behaviours such as clearing costmaps or backing up run when either gets stuck. The behaviour tree is what makes the system inspectable: navigation stops being one opaque loop and becomes a tree of small actions whose success and failure are explicit.',
      'The costmap is the shared world model, built in layers: a static layer from the SLAM map, an obstacle layer from live sensor data, and an inflation layer that spreads cost around obstacles so clearance is part of the cost surface rather than an afterthought. Both the global planner and the local controller read this layered map, which is why inflation tuning changes planned routes and tracking behaviour together.',
      'MoveIt 2 is the manipulation counterpart: a motion planning pipeline that holds a planning scene, samples collision-free joint-space paths with sampling-based planners, and solves inverse kinematics to reach Cartesian goals. MoveIt 2 sits at the level of manipulation basics, and is stated at that level: working familiarity with the pipeline and its concepts rather than a delivered manipulation system.',
      'In the rover, Nav2 ran alongside the separately implemented A* planning work, letting a framework planner be compared against a direct implementation, and navigation behaviour was validated the same way as the rest of the stack: repeated simulated runs, goals reached with obstacle avoidance intact, and path and costmap inspection in RViz.',
    ],
  },
  {
    id: 'can-canoe',
    name: 'CAN and CANoe',
    paragraphs: [
      'CAN is a broadcast bus: every frame carries an identifier that doubles as its arbitration priority, a data length code, up to eight data bytes on classical CAN and more on CAN FD, a CRC and an acknowledgement slot. There is no addressing; every node hears every frame and decides what to decode. The meaning of the bytes lives in a DBC file, which maps signals to bit positions, byte order, scaling and offset, so signal extraction is only as trustworthy as the DBC matching the software build on the vehicle.',
      'Working at this level means reading the bus as evidence. A captured trace shows what the vehicle network actually did: which frames appeared, at what rate, with what payloads, and how bus load behaved. That is the difference between reporting that a feature misbehaved and showing the frames that prove it, and it is why bus-level evidence was captured for every observation rather than relying on what the vehicle appeared to do.',
      'The automotive validation work used Vector CANoe and CANalyzer to capture and analyse CAN and CAN FD traffic while running feature-vehicle, breadboard and over-the-air regression testing across the T6 Ranger and Everest programmes. What was being validated was feature behaviour against its specification: that features behaved correctly across vehicle variants, running changes and software updates feeding readiness milestones.',
      'The hard part of vehicle-level fault evidence is attribution: separating a genuine feature fault from instrumentation error and from procedure error. Structured, repeatable drives made failures reproducible before they were reported, so every defect report stood on a trace someone else could re-derive rather than an impression from the driver seat.',
    ],
  },
  {
    id: 'telemetry-path',
    name: 'LoRaWAN, MQTT and the telemetry path',
    paragraphs: [
      'The DuxTel telemetry systems ran a seven-layer chain, and every layer exists to solve a distinct problem: a sensor reading, an ESP32 firmware loop, a LoRaWAN uplink on the AU915 plan, a ChirpStack network server, an MQTT broker, a Linux service, an InfluxDB time series and a Grafana panel. The radio gets kilometres of range at milliwatts; the network server owns the LoRaWAN MAC layer, device identity and deduplication when several gateways hear one uplink; the broker decouples producers from consumers; the service translates and validates; the database makes time first-class; the dashboard makes it legible.',
      'LoRaWAN physics is a budget. Each step up in spreading factor roughly doubles time on air in exchange for range, which costs battery and channel capacity, and duty-cycle and dwell-time constraints cap how often a device may transmit, so payload size, transmission interval and spreading factor have to be planned together rather than chosen independently. Planning the AU915 radio links and provisioning devices happened with those trade-offs in view, as did designing the MQTT topic structures that carried the decoded data onwards.',
      'On the storage side, the work covered designing InfluxDB schemas and retention policies, which is where a telemetry system either stays operable or drowns: retention decides how long raw readings live before they are discarded or downsampled, and the schema decides which queries the Grafana dashboards can answer cheaply.',
      'The failure mode of a chain like this is ambiguity: a silent dashboard could be firmware, radio, network server, broker, database or dashboard, with no way to know in advance which. Deployed faults were diagnosed layer by layer, checking each stage of the chain where its data could be observed, and the end-to-end path was validated during deployment and the active field trial rather than in isolation on a bench.',
    ],
  },
  {
    id: 'embedded-firmware',
    name: 'ESP32 and STM32 firmware',
    paragraphs: [
      'Embedded firmware starts at peripheral configuration: clocks, then the buses and converters the application needs, UART, I2C, SPI, ADC and PWM, each configured at the register or driver level. The structural decision is how data moves: polling wastes the processor, interrupts hand each event to a handler the moment it happens, and DMA moves blocks of data without the CPU touching each byte. The discipline is keeping interrupt handlers short, moving work out of them into tasks, so the timing-critical paths stay predictable.',
      'On FreeRTOS the architecture is task decomposition and priority: acquisition runs as a high-priority task paced by hardware timing so sample intervals stay uniform, while communications, logging and housekeeping run below it, and queues carry data between them so a slow consumer can never stall the sampling path. Deterministic acquisition means the sample clock is owned by hardware, not by a delay loop whose period stretches under load.',
      'Two evidenced systems were built this way. The Honours capstone ran real-time acquisition on an ESP32 across IMU, time-of-flight, Hall-effect and magnetometer sensors, designed around deterministic real-time acquisition with analysis kept offline in MATLAB where clinical comparison is easier to audit. At DuxTel, the ESP32 sensing and telemetry firmware developed there fed the LoRaWAN uplink path on deployed field hardware. STM32 also features as a working platform, stated as platform capability rather than a delivered STM32 product.',
      'The failure modes are timing failures: jitter in the sample interval, a blocking call sneaking into the acquisition path, or a starved interrupt, and they corrupt data in ways that look like sensor noise. Verification was downstream and honest: the capstone measurements were validated against clinical references for repeatability and comparability, and the telemetry firmware proved itself in the field trial, where a timing fault would have surfaced as gaps or drift in the recorded series.',
    ],
  },
  {
    id: 'hall-effect-sensing',
    name: 'Hall-effect sensing and signal conditioning',
    paragraphs: [
      'A Hall-effect sensor transduces magnetic field into voltage: current flowing through a conductor in a magnetic field experiences a transverse force, and the resulting charge separation appears as a small voltage proportional to the field component normal to the element. That gives non-contact sensing of position and motion relative to a magnet, with no wear surface, which is what makes it attractive for measuring movement in a hand-held assessment device.',
      'The raw signal is small and everything couples into it: offset and temperature drift in the element, supply noise, and electromagnetic interference from nearby electronics. Conditioning is what turns it into measurement, ranging the signal to the converter and filtering it so the band of interest, human movement, survives while broadband noise is rejected. On the ataxia device the Hall-effect channel sat alongside IMU, time-of-flight and magnetometer channels deliberately, so movement features were captured redundantly across modalities with different noise behaviour.',
      'Calibration and validation were the point of the project: the captured measurements were validated against clinical references, checking that the motion signals were repeatable across captures and comparable against the reference, which is the standard that matters for an assessment-support instrument. The firmware acquired in real time and the analysis ran offline in MATLAB, keeping the comparison auditable.',
      'The record states its boundary plainly: this was the assessed Honours capstone and a research-support concept, built and validated as a proof-of-concept measurement platform, and the clinical-reference validation is the evidence it stands on.',
    ],
  },
  {
    id: 'pcb-design',
    name: 'PCB design and board bring-up',
    paragraphs: [
      'A PCB starts as a schematic, where the design decisions are electrical: sensor front-ends, supply architecture, protection on anything leaving the board. Layout is where those decisions survive or die physically. Grounding strategy decides where return currents actually flow; decoupling puts local charge next to every supply pin so fast transients are served on the board rather than across it; and placement groups noisy and quiet sections so a switching supply or a radio does not sit under an analogue front-end.',
      'Electromagnetic compatibility is mostly loop area: every signal returns somewhere, and the smaller the loop between a trace and its return, the less it radiates and the less it receives. A board destined for machinery in a paddock also has mechanical EMC: enclosure, mounting, connector strain and vibration, and those field-hardening decisions were made as part of the design rather than after it.',
      'For the DuxTel agricultural monitoring application, a custom board was designed to consolidate the field interfaces in one place: CAN trace capture from the equipment, GPS positioning and environmental sensing integrated on one PCB, which replaced a loose collection of modules with a single deliberate design.',
      'Bring-up is a sequence, not an event: inspect, then power rails before anything else, then clocks, then each bus and peripheral in turn with an oscilloscope or logic analyser on the wire, so the first fault found is the real first fault rather than a symptom three layers up. The board then proved itself the only way field hardware can: deployed in the active trial, feeding the telemetry chain.',
    ],
  },
  {
    id: 'scada-migration',
    name: 'SCADA migration under GAMP 5',
    paragraphs: [
      'A SCADA migration replaces the supervisory layer of a plant while the validated behaviour underneath it must remain provably unchanged. The application content that has to cross from iFIX to PVI+ spans five families: the graphics operators actually watch, the tag database binding every screen element to a live point, the alarm configuration with its priorities and shelving behaviour, the historical trends, and the scripts that carry the application logic the vendor tools do not translate cleanly.',
      'Under GAMP 5, verifying against a validated system has a precise meaning: the existing system is the specification. Every migrated screen, tag, alarm and trend has to demonstrably reproduce the behaviour the validated system already exhibits, with documented evidence produced under change control, because the regulated status of the plant rests on that evidence rather than on the migration tooling.',
      'The method on the regulated smart-factory delivery was conversion followed by verification, in that order of trust: the SCADA application content was converted methodically, then functional behaviour was verified against the existing validated system rather than trusting the conversion. Where an interface decision was open, diagnostics, operator usability and data integrity took priority, because a migration is also the moment those either improve or quietly regress.',
      'The evidence trail was part of the delivery: FAT and SAT activities were executed and commissioning, qualification and handover documentation produced, so the migrated system arrived with the proof of equivalence a regulated site requires, and the delivered work is documented in the smart-factory record this treatment sits on.',
    ],
  },
  {
    id: 'qualification-evidence',
    name: 'FAT, SAT, ITP, IQ, OQ and PQ',
    paragraphs: [
      'Each stage of the qualification ladder proves a different thing. A factory acceptance test proves the system meets its specification before it ships, while faults are still cheap to fix. A site acceptance test proves the same system still behaves once it is installed against real plant, real instruments and real networks. An inspection and test plan governs fabrication itself: hold points, witness points and the inspections that must pass before work proceeds. Installation qualification proves the system is installed as specified, operational qualification proves it operates correctly across its intended ranges, and performance qualification proves it performs consistently under actual production conditions.',
      'What makes these engineering rather than paperwork is the evidence each produces: executed and signed protocols, recorded results, deviations with their resolutions, and traceability records such as manufacturing data reports that tie physical material and welds back to certificates. That evidence is what an auditor reads years later, so its defensibility is the deliverable.',
      'The role differs by stage and is stated precisely. On the regulated smart-factory delivery, the work covered executing FAT and SAT activities and producing commissioning, qualification and handover documentation within the GAMP 5 lifecycle that IQ and OQ style records belong to. In manufacturing, the work involved ITP-driven inspection and MDR documentation across structural-steel and pressure-vessel fabrication, and in automotive testing it produced the structured, auditable results that regulatory scrutiny demands.',
      'The transferable habit is that verification is designed before it is executed: each stage has defined acceptance criteria, evidence is produced at the moment of test rather than reconstructed afterwards, and a fault found is a record made. That habit is visible across the records, from CAN traces attached to defect reports to qualification documents handed over with a migrated SCADA system.',
    ],
  },
  {
    id: 'retrieval-augmented-generation',
    name: 'Retrieval-augmented generation',
    paragraphs: [
      'Retrieval-augmented generation grounds a language model in sources instead of leaving it to answer from parametric memory alone. The pipeline has distinct stages: documents are split into chunks, each chunk is embedded into a vector that places its meaning in a geometric space, and at question time the query is embedded the same way and the nearest chunks by vector similarity are retrieved and assembled into the model context, so the answer is generated from cited source text rather than recalled from training.',
      'Chunking strategy is a real design decision, because it fixes what a retrieval unit can say: chunks too small lose the surrounding argument, chunks too large dilute the similarity signal and waste context. Grounding and citation are the hallucination mitigation: when every response must trace to retrieved approved sources, an unsupported claim is detectable rather than plausible, which converts hallucination from a behaviour to an evaluable failure.',
      'In VeerAI, the full loop was built on personal hardware: an ingestion layer that normalises and approves source documents, the chunking and embedding stage that makes them retrievable, the retrieval-augmented generation loop that grounds every response in cited approved sources, and a controlled memory layer with explicit read and write boundaries. Local inference keeps the data boundary absolute, and modular separation lets any stage be replaced without touching the others.',
      'Evaluation is a first-class subsystem rather than a final step: an evaluation harness scores retrieval relevance and answer faithfulness against a held-out set, which verified that the system was actually grounding its answers, and the same harness exercised memory boundaries, tool behaviour and edge-case handling across the end-to-end workflow.',
    ],
  },
] as const

export function getTechnique(id: string): Technique | undefined {
  return techniques.find((t) => t.id === id)
}

/** Techniques claimed by each work record, rendered on that record's page. */
export const projectTechniques: Record<string, readonly string[]> = {
  'autonomous-navigation-rover': [
    'ros2-architecture',
    'slam',
    'sensor-fusion',
    'kalman-filter',
    'extended-kalman-filter',
    'a-star-search',
    'nav2-moveit',
    'pid-control',
  ],
  'adas-can-validation': ['can-canoe'],
  'iot-monitoring-platform': ['telemetry-path', 'pcb-design', 'embedded-firmware'],
  'ataxia-assessment-device': ['embedded-firmware', 'hall-effect-sensing'],
  'jag-smart-factory': ['scada-migration', 'qualification-evidence'],
  'manufacturing-qa-foundation': ['qualification-evidence'],
  'veerai-slm': ['retrieval-augmented-generation'],
}

/** Techniques claimed by each Atlas domain, rendered on that domain's page. */
export const atlasTechniques: Record<string, readonly string[]> = {
  'robotics-and-autonomy': ['ros2-architecture', 'slam', 'sensor-fusion', 'nav2-moveit', 'a-star-search'],
  'control-systems': ['pid-control', 'kalman-filter', 'extended-kalman-filter'],
  'industrial-automation-plc-and-scada': ['scada-migration', 'qualification-evidence'],
  'automotive-systems-and-validation': ['can-canoe'],
  'iot-and-edge-to-cloud-telemetry': ['telemetry-path'],
  'embedded-systems-and-firmware': ['embedded-firmware'],
  'electronics-pcb-and-board-bring-up': ['pcb-design', 'hall-effect-sensing'],
  'biomedical-and-clinical-devices': ['hall-effect-sensing'],
  'process-pharma-and-regulated-manufacturing': ['scada-migration', 'qualification-evidence'],
  'project-delivery-commissioning-and-handover': ['qualification-evidence'],
}

export function techniquesFor(map: Record<string, readonly string[]>, slug: string): readonly Technique[] {
  return (map[slug] ?? []).map(getTechnique).filter((t): t is Technique => t !== undefined)
}
