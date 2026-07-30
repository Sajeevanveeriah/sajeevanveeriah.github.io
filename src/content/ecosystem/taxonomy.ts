import type { EcosystemPillar, EcosystemDomain, EcosystemCategory } from './types'

/**
 * Eight pillars, thirty-one domains, plus a universal baseline.
 *
 * The pillar order is the order a signal actually travels: structure and
 * material first, then power and transduction, then compute, then control
 * and perception, then learned judgement, then the factory, then the
 * network, then the safety and human layer that bounds all of it. The
 * integrator domain closes the set because it is what ties the stack into
 * one verified system.
 *
 * This is a separate axis from `src/content/atlas.ts`. The Atlas is Saj's
 * own nineteen capability domains, cut by what he has evidence for. These
 * thirty-one are cut by how the field is organised, and most of them contain
 * nothing he claims personally. Neither is derived from the other, and the
 * Atlas slugs are untouched.
 */

export const BASELINE_PILLAR_ID = 'baseline'
export const BASELINE_DOMAIN_ID = 'universal-baseline'

export const pillars: readonly EcosystemPillar[] = [
  {
    id: 'physical',
    slug: 'physical-structural-and-material',
    name: 'Physical, Structural and Material Engineering',
    shortName: 'Physical and material',
    summary:
      'The mechanical architecture of a machine: how it is shaped, what it is made from, how it articulates and how much force it can carry before something yields.',
    purpose: 'Provides structure, articulation and physical force.',
    order: 1,
  },
  {
    id: 'electronics',
    slug: 'electronics-power-and-transducers',
    name: 'Electronics, Power and Transducer Design',
    shortName: 'Electronics and power',
    summary:
      'Everything between the wall and the physics: converting, delivering and measuring energy, and turning real-world quantities into signals a computer can read.',
    purpose: 'Manages energy flow and converts physical phenomena into signals.',
    order: 2,
  },
  {
    id: 'compute',
    slug: 'compute-embedded-and-low-level-software',
    name: 'Compute, Embedded and Low-Level Software',
    shortName: 'Compute and embedded',
    summary:
      'The reflex layer: microcontrollers, accelerators and real-time software close enough to the hardware that timing is a correctness property rather than a performance one.',
    purpose: 'Executes low-level determinism and the sensor-to-actuator cycle.',
    order: 3,
  },
  {
    id: 'controls',
    slug: 'controls-kinematics-and-perception',
    name: 'Controls, Kinematics and Perception',
    shortName: 'Controls and perception',
    summary:
      'How a machine works out where it is, where it should go and what to command so it gets there while staying stable under load.',
    purpose: 'Computes spatial position, trajectory and stability in real time.',
    order: 4,
  },
  {
    id: 'ai',
    slug: 'ai-edge-compute-and-mlops',
    name: 'AI, Edge Compute and MLOps',
    shortName: 'AI and edge',
    summary:
      'Learned behaviour and the machinery around it: training, compressing models to fit a thermally constrained device, and keeping deployed models honest over time.',
    purpose: 'Grants high-level decision making, adaptation and perception.',
    order: 5,
  },
  {
    id: 'ot',
    slug: 'operational-technology-and-industrial-automation',
    name: 'Operational Technology and Industrial Automation',
    shortName: 'Industrial automation',
    summary:
      'Where one machine becomes a production line: controllers, supervisory systems, process loops and the integration work that makes a workcell behave as a unit.',
    purpose: 'Orchestrates large-scale machinery on a manufacturing floor.',
    order: 6,
  },
  {
    id: 'networks',
    slug: 'networking-cyber-physical-systems-and-cloud-iot',
    name: 'Networking, Cyber-Physical Systems and Cloud-IoT',
    shortName: 'Networks and twins',
    summary:
      'The links that carry determinism across a plant and telemetry out of it, the simulations that run alongside the physical asset, and the controls that keep both defensible.',
    purpose: 'Links physical assets to digital networks, twins and remote monitoring.',
    order: 7,
  },
  {
    id: 'safety',
    slug: 'safety-reliability-and-human-centric-systems',
    name: 'Safety, Reliability and Human-Centric Systems',
    shortName: 'Safety and reliability',
    summary:
      'The layer that decides whether a system is allowed to run: hazard analysis, rated safety functions, failure behaviour over a lifetime, and how people share space with a machine.',
    purpose: 'Ensures non-destructive operation and safe human collaboration.',
    order: 8,
  },
] as const

/**
 * The universal baseline is not a ninth pillar. It is the toolset every
 * domain above assumes, listed once instead of thirty-one times, and it is
 * grouped separately in the interface for exactly that reason.
 */
export const baselinePillar: EcosystemPillar = {
  id: BASELINE_PILLAR_ID,
  slug: 'universal-baseline',
  name: 'Universal Baseline',
  shortName: 'Universal baseline',
  summary:
    'The languages, operating systems, build and version-control tooling, formats and numerical libraries that every domain in this sweep assumes rather than restates.',
  purpose: 'Shared across all eight pillars, listed once.',
  order: 9,
} as const

export const allPillars: readonly EcosystemPillar[] = [...pillars, baselinePillar] as const

export const domains: readonly EcosystemDomain[] = [
  // Pillar 1
  {
    id: 'kinematics',
    slug: 'kinematics-and-multibody-dynamics',
    name: 'Kinematics and multibody dynamics',
    pillarId: 'physical',
    summary:
      'Link geometry, joint torque and load paths: what a mechanism can reach without force, and what it does once mass and acceleration are in the equation.',
    order: 1,
  },
  {
    id: 'materials',
    slug: 'materials-and-smart-materials',
    name: 'Materials and smart materials',
    pillarId: 'physical',
    summary:
      'Structural alloys and composites through to materials that are themselves actuators: shape-memory alloys, piezo stacks, dielectric elastomers and soft silicones.',
    order: 2,
  },
  {
    id: 'fluid-power',
    slug: 'fluid-power-pneumatics-and-hydraulics',
    name: 'Fluid power: pneumatics and hydraulics',
    pillarId: 'physical',
    summary:
      'Compressed air and pressurised fluid as the actuation medium, where power density beats electric drive and the control problem moves into valves and flow.',
    order: 3,
  },
  {
    id: 'biomechanical',
    slug: 'biomechanical-and-rehabilitation-engineering',
    name: 'Biomechanical and rehabilitation engineering',
    pillarId: 'physical',
    summary:
      'Machines that attach to people: exoskeletons, prosthetics, surgical tooling and haptics, where the load case is a human body and the regulator is a medical authority.',
    order: 4,
  },
  // Pillar 2
  {
    id: 'power-electronics',
    slug: 'electrical-and-power-electronics',
    name: 'Electrical and power electronics',
    pillarId: 'electronics',
    summary:
      'Switching energy efficiently and safely: converters, inverters, motor drives, battery management and the thermal and EMI consequences of all of it.',
    order: 5,
  },
  {
    id: 'microelectronics',
    slug: 'microelectronics-semiconductor-fpga-and-soc',
    name: 'Microelectronics, semiconductor, FPGA and SoC engineering',
    pillarId: 'electronics',
    summary:
      'Designing the silicon and the board it sits on: RTL, synthesis, timing closure, place and route, and the PCB practice that keeps a fast signal intact.',
    order: 6,
  },
  {
    id: 'instrumentation',
    slug: 'instrumentation-and-transducer-engineering',
    name: 'Instrumentation and transducer engineering',
    pillarId: 'electronics',
    summary:
      'Sensor physics and the conditioning chain behind it: encoders, strain gauges, IMUs, force-torque cells, and the amplification, filtering and calibration that make a reading trustworthy.',
    order: 7,
  },
  {
    id: 'optics',
    slug: 'optical-and-photonics-engineering',
    name: 'Optical and photonics engineering',
    pillarId: 'electronics',
    summary:
      'Light as a measurement instrument: LiDAR emitters and receivers, structured light, laser triangulation, and the eye-safety and link-budget work that governs them.',
    order: 8,
  },
  // Pillar 3
  {
    id: 'firmware',
    slug: 'embedded-firmware-engineering',
    name: 'Embedded firmware engineering',
    pillarId: 'compute',
    summary:
      'Code with no operating system underneath it, or only just enough: interrupts, DMA, linker scripts, bootloaders and the peripheral buses that reach the rest of the board.',
    order: 9,
  },
  {
    id: 'architecture',
    slug: 'computer-architecture-and-hardware-acceleration',
    name: 'Computer architecture and hardware acceleration',
    pillarId: 'compute',
    summary:
      'Making the arithmetic fit the silicon: GPU and NPU pipelines, FPGA bitstreams, vectorisation and the memory bandwidth that usually turns out to be the real limit.',
    order: 10,
  },
  {
    id: 'realtime',
    slug: 'real-time-systems-engineering',
    name: 'Real-time systems engineering',
    pillarId: 'compute',
    summary:
      'Guaranteeing when, not just what: schedulability, worst-case execution time, jitter, priority inversion and the difference between fast and deterministic.',
    order: 11,
  },
  // Pillar 4
  {
    id: 'control-systems',
    slug: 'control-systems-and-dynamic-modelling',
    name: 'Control systems and dynamic modelling',
    pillarId: 'controls',
    summary:
      'Modelling a plant and closing the loop around it: PID through state-space, LQR, MPC and the estimators that supply the states you cannot measure.',
    order: 12,
  },
  {
    id: 'robotics-middleware',
    slug: 'robotics-middleware-manipulation-and-motion',
    name: 'Robotics middleware, manipulation and motion',
    pillarId: 'controls',
    summary:
      'The software spine of a robot: node graphs and transport, kinematic solvers, trajectory generation, and the simulators that let all of it run before hardware exists.',
    order: 13,
  },
  {
    id: 'vision',
    slug: 'computer-vision-and-spatial-ai',
    name: 'Computer vision and spatial AI',
    pillarId: 'controls',
    summary:
      'Turning pixels and point clouds into geometry: calibration, feature matching, registration, SLAM and the reconstruction methods that build a map worth planning against.',
    order: 14,
  },
  {
    id: 'navigation',
    slug: 'autonomous-navigation-and-fleet-engineering',
    name: 'Autonomous navigation and fleet engineering',
    pillarId: 'controls',
    summary:
      'Getting a vehicle from A to B without hitting anything, then getting a hundred of them to share the same floor without deadlocking.',
    order: 15,
  },
  // Pillar 5
  {
    id: 'ml',
    slug: 'machine-learning-and-deep-learning',
    name: 'Machine learning and deep learning',
    pillarId: 'ai',
    summary:
      'Training the models that do the perceiving and deciding, including the reinforcement and imitation learning used for manipulation and locomotion.',
    order: 16,
  },
  {
    id: 'edge-ai',
    slug: 'edge-ai-and-tinyml',
    name: 'Edge AI and TinyML',
    pillarId: 'ai',
    summary:
      'Making a model fit a device with no fan and a power budget: quantisation, pruning, distillation, operator fusion and vendor-specific runtimes.',
    order: 17,
  },
  {
    id: 'mlops',
    slug: 'mlops-and-data-pipelines',
    name: 'MLOps and data pipelines',
    pillarId: 'ai',
    summary:
      'The lifecycle around a model: versioned data, annotation, synthetic generation, retraining, serving, and watching for the drift that quietly invalidates it.',
    order: 18,
  },
  {
    id: 'multimodal',
    slug: 'multimodal-ai-vla-and-agentic-engineering',
    name: 'Multimodal AI, VLA and agentic engineering',
    pillarId: 'ai',
    summary:
      'Language and vision joined to action: retrieval, tool use, agent planning, and the vision-language-action models that map an instruction onto a physical task.',
    order: 19,
  },
  // Pillar 6
  {
    id: 'industrial-automation',
    slug: 'industrial-automation-plc-pac-scada-hmi-and-dcs',
    name: 'Industrial automation: PLC, PAC, SCADA, HMI and DCS',
    pillarId: 'ot',
    summary:
      'The controllers and supervisory layer that actually run a plant, programmed in the IEC 61131-3 languages and operated through HMI and SCADA.',
    order: 20,
  },
  {
    id: 'process-control',
    slug: 'process-control',
    name: 'Process control',
    pillarId: 'ot',
    summary:
      'Continuous production rather than discrete parts: valves, flow and thermal loops, dead-time compensation, batch structure and safety instrumented functions.',
    order: 21,
  },
  {
    id: 'workcell',
    slug: 'workcell-systems-integration',
    name: 'Workcell systems integration',
    pillarId: 'ot',
    summary:
      'Making an arm, a conveyor, a feeder, a camera and a guard behave as one machine, then proving it at factory and site acceptance.',
    order: 22,
  },
  {
    id: 'manufacturing',
    slug: 'manufacturing-and-industrial-engineering',
    name: 'Manufacturing and industrial engineering',
    pillarId: 'ot',
    summary:
      'Throughput as the object of design: manufacturability, line balancing, takt, bottleneck theory and the statistics used to tell noise from a real shift.',
    order: 23,
  },
  // Pillar 7
  {
    id: 'fieldbus',
    slug: 'industrial-networking-and-fieldbus',
    name: 'Industrial networking and fieldbus',
    pillarId: 'networks',
    summary:
      'Deterministic communication on a factory floor: the fieldbuses, the switching, the redundancy topologies and the device description files that make a node joinable.',
    order: 24,
  },
  {
    id: 'iiot',
    slug: 'industrial-iot-and-edge-cloud-systems',
    name: 'Industrial IoT and edge-cloud systems',
    pillarId: 'networks',
    summary:
      'Getting plant data out safely and usefully: edge gateways, store-and-forward, device identity, fleet updates and the time-series stack it lands in.',
    order: 25,
  },
  {
    id: 'digital-twin',
    slug: 'digital-twins-and-cyber-physical-systems',
    name: 'Digital twins and cyber-physical systems',
    pillarId: 'networks',
    summary:
      'A model running alongside the asset: co-simulation, hardware-in-the-loop, virtual commissioning and the predictive maintenance that pays for it.',
    order: 26,
  },
  {
    id: 'ot-security',
    slug: 'ot-and-ics-security',
    name: 'OT and ICS security',
    pillarId: 'networks',
    summary:
      'Defending a network where availability outranks confidentiality and a patch window may be a year away: segmentation, monitoring, secure remote access and zones and conduits.',
    order: 27,
  },
  // Pillar 8
  {
    id: 'functional-safety',
    slug: 'functional-safety',
    name: 'Functional safety',
    pillarId: 'safety',
    summary:
      'Rated protective functions and the evidence behind them: hazard identification, required performance level or integrity level, architecture, and validation against it.',
    order: 28,
  },
  {
    id: 'hri',
    slug: 'human-robot-interaction-and-ergonomics',
    name: 'Human-robot interaction and ergonomics',
    pillarId: 'safety',
    summary:
      'Sharing a workspace with a machine: power and force limiting, speed and separation monitoring, hand guiding, and the cognitive load the interface imposes.',
    order: 29,
  },
  {
    id: 'reliability',
    slug: 'reliability-and-failure-analysis',
    name: 'Reliability and failure analysis',
    pillarId: 'safety',
    summary:
      'How a system fails and how often: FMEA and fault trees up front, accelerated life and environmental testing to confirm it, and a feedback loop from the field.',
    order: 30,
  },
  // Integrator
  {
    id: 'systems-integration',
    slug: 'systems-and-integration-engineering',
    name: 'Systems and integration engineering',
    pillarId: 'safety',
    summary:
      'The integrator domain: requirements, interfaces, MBSE models, trade studies, verification and validation, and the system-of-systems view that owns the end-to-end budget.',
    order: 31,
  },
  // Baseline
  {
    id: BASELINE_DOMAIN_ID,
    slug: 'universal-baseline',
    name: 'Universal baseline',
    pillarId: BASELINE_PILLAR_ID,
    summary:
      'Languages, operating systems and RTOSs, version control, build and package systems, CI/CD and containers, editors, debugging and profiling, documentation, communication fundamentals, data formats and numerical libraries.',
    order: 0,
  },
] as const

/**
 * The classification axis. Every catalogue entry carries at least one, and
 * an entry may legitimately carry several: a Jetson module is both a
 * hardware family and a compute accelerator.
 */
export const categories: readonly EcosystemCategory[] = [
  { id: 'hardware-family', name: 'Hardware family' },
  { id: 'hardware-model', name: 'Hardware model' },
  { id: 'electronic-component', name: 'Electronic component' },
  { id: 'mechanical-component', name: 'Mechanical component' },
  { id: 'material', name: 'Material' },
  { id: 'sensor', name: 'Sensor or transducer' },
  { id: 'actuator', name: 'Motor, actuator or drive' },
  { id: 'accelerator', name: 'Compute accelerator' },
  { id: 'test-measurement', name: 'Test and measurement equipment' },
  { id: 'fabrication', name: 'Fabrication or laboratory equipment' },
  { id: 'language', name: 'Language' },
  { id: 'os-rtos', name: 'OS or RTOS' },
  { id: 'ide-toolchain', name: 'IDE or toolchain' },
  { id: 'cad-cae', name: 'CAD, CAE, CAM or EDA application' },
  { id: 'framework', name: 'Framework, library or middleware' },
  { id: 'simulator', name: 'Simulator' },
  { id: 'protocol', name: 'Protocol or interface' },
  { id: 'platform', name: 'Cloud, data, MLOps or observability platform' },
  { id: 'algorithm', name: 'Algorithm' },
  { id: 'method', name: 'Engineering method' },
  { id: 'standard', name: 'Standard or regulation' },
  { id: 'vendor-platform', name: 'Vendor platform' },
  { id: 'research-model', name: 'Research model' },
  { id: 'legacy-reference', name: 'Legacy or historical reference' },
] as const
