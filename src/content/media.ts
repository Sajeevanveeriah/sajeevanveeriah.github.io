export interface MediaAsset {
  readonly stem: string
  readonly avif: string
  readonly webp: string
  readonly jpg: string
  readonly width: 1280
  readonly height: 720
  readonly alt: string
  readonly kind: string
}

export interface VideoAsset {
  readonly id: string
  readonly mp4: string
  readonly webm: string
  readonly poster: MediaAsset
  readonly label: string
  readonly caption: string
}

function asset(stem: string, alt: string, kind: string): MediaAsset {
  return {
    stem,
    avif: `/assets/media/${stem}.avif`,
    webp: `/assets/media/${stem}.webp`,
    jpg: `/assets/media/${stem}.jpg`,
    width: 1280,
    height: 720,
    alt,
    kind,
  }
}

export const mediaLibrary = {
  heroLab: asset(
    '20261120-Voltwyn-Hero-Lab-Bench-Rev00',
    'Hardware-grade robotics workbench featuring a differential-drive rover chassis, a three-link aluminium planar arm and a matte-navy controller enclosure.',
    'Engineering bench visual',
  ),
  launchPoster: asset(
    '20261120-Voltwyn-Launch-Poster-Rev00',
    'Voltwyn engineering showcase featuring a LiDAR-equipped autonomous rover sweeping across calibration rings.',
    'Engineering video poster',
  ),
  ros2Rover: asset(
    '20261120-Voltwyn-ROS2-Rover-SLAM-Rev00',
    'Differential-drive mobile rover with a cylindrical spinning LiDAR turret on a calibration grid floor.',
    'Engineering visualisation',
  ),
  ataxiaRig: asset(
    '20261120-Voltwyn-Embedded-Ataxia-Rig-Rev00',
    'ESP32 instrumentation board on brass standoffs wired to a machined aluminium track with four Hall-effect sensor modules.',
    'Prototype visual',
  ),
  displayPcb: asset(
    '20261120-Voltwyn-Display-Controller-PCB-Rev00',
    'Four-layer Night Navy industrial controller circuit board with central microcontroller, pluggable terminal block and ribbon display header.',
    'PCB visual',
  ),
  solarCleaner: asset(
    '20261120-Voltwyn-Solar-Cleaner-Robot-Rev00',
    'Modular tracked waterless solar-panel cleaning robot with cylindrical dry-cleaning roller positioned on photovoltaic cells.',
    'Prototype visual',
  ),
  runtimeAssurance: asset(
    '20261120-Voltwyn-Runtime-Assurance-Sim-Rev00',
    'Top-down technical corridor visualisation showing an autonomous mobile robot with concentric clearance rings and braking envelope contours.',
    'Simulation visual',
  ),
  processTwin: asset(
    '20261120-Voltwyn-Industrial-Process-Twin-Rev00',
    'Isometric render of a modular stainless-steel food-processing and conveyor automation line with station status indicators.',
    'Process model visual',
  ),
  scoreboardLan: asset(
    '20261120-Voltwyn-LED-Scoreboard-LAN-Rev00',
    'Hardware test rig holding modular HUB75 LED matrix panels connected via Ethernet patch leads to microcontroller receiver boards.',
    'Hardware rig visual',
  ),
  pricingSystem: asset(
    '20261120-Voltwyn-Pricing-Control-System-Rev00',
    'Anodised aluminium engineering workstation displaying dark-navy review cards and structured verification status bars.',
    'Software system visual',
  ),
  ndccNetwork: asset(
    '20261120-Voltwyn-NDCC-Network-Systems-Rev00',
    'Weatherproof outdoor wireless access point and anodised pole-mount PoE assembly on a steel mast at twilight.',
    'Infrastructure visual',
  ),
  dooenIsaac: asset(
    '20261120-Voltwyn-Dooen-Plant-Isaac-Rev00',
    'NVIDIA Isaac Sim render of two parallel 15-station potato-processing trains coloured by material flow and hold-up bars.',
    'Verified simulation render',
  ),
  mazetrackPcb: asset(
    '20261120-Voltwyn-MazeTrack-PCB-Rev00',
    'KiCad 3D render of the VW-MTC1 four-layer ESP32-S3 controller board showing USB-C, microSD and sensor connectors.',
    'Verified KiCad render',
  ),
  panelogramUi: asset(
    '20261120-Voltwyn-Panelogram-UI-Rev00',
    'Panelogram desktop application rendering a six-shelf retail bay to millimetre scale with capacity metrics.',
    'Verified software screenshot',
  ),
  snailRaceUi: asset(
    '20261120-Voltwyn-Snail-Race-UI-Rev00',
    'Snail Race projector stage interface showing track lanes and fundraising tote controls.',
    'Verified software screenshot',
  ),
  localSlm: asset(
    '20261120-Voltwyn-Local-SLM-Rev00',
    'Local open-weight language model architecture connecting document ingestion, retrieval, memory and evaluation.',
    'Verified system diagram',
  ),
  masteryLab: asset(
    '20261120-Voltwyn-Engineering-Mastery-Lab-Rev00',
    'Engineering Mastery Lab learning dashboard showing five mechatronics courses and guided laboratories.',
    'Verified interface graphic',
  ),
  slamLoopPoster: asset(
    '20261120-Voltwyn-SLAM-Poster-Rev00',
    'Interactive ROS 2 rover simulation showing a 36-ray LiDAR scan, EKF covariance ellipse and Nav2 target waypoint.',
    'Live simulation frame',
  ),
  kinematicsLoopPoster: asset(
    '20261120-Voltwyn-Kinematics-Poster-Rev00',
    'Three-link planar kinematics simulation showing joint angle arcs inside a dashed circular reach envelope.',
    'Live kinematics frame',
  ),
  pidLoopPoster: asset(
    '20261120-Voltwyn-PID-Poster-Rev00',
    'PID closed-loop step-response oscilloscope trace with overshoot and 2 percent settling-band markers.',
    'Live control trace frame',
  ),
  queueLoopPoster: asset(
    '20261120-Voltwyn-Queue-Poster-Rev00',
    'Interactive Little Law M/M/1 queue response curve plotting waiting time across 50 to 95 percent utilisation.',
    'Live queue model frame',
  ),
} as const satisfies Record<string, MediaAsset>

export const videoLibrary = {
  heroLaunch: {
    id: 'hero-launch',
    mp4: '/assets/video/20261120-Voltwyn-Launch-Loop-Rev00.mp4',
    webm: '/assets/video/20261120-Voltwyn-Launch-Loop-Rev00.webm',
    poster: mediaLibrary.launchPoster,
    label: 'Voltwyn hardware, autonomous rover and telemetry showcase loop',
    caption: 'Hardware, autonomy and telemetry showcase',
  },
  slamLoop: {
    id: 'slam-loop',
    mp4: '/assets/video/20261120-Voltwyn-SLAM-Loop-Rev00.mp4',
    webm: '/assets/video/20261120-Voltwyn-SLAM-Loop-Rev00.webm',
    poster: mediaLibrary.slamLoopPoster,
    label: 'Looping demonstration of the ROS 2 rover, 36-ray LiDAR scan and EKF covariance tracking',
    caption: 'ROS 2 LiDAR SLAM & EKF loop',
  },
  kinematicsLoop: {
    id: 'kinematics-loop',
    mp4: '/assets/video/20261120-Voltwyn-Kinematics-Loop-Rev00.mp4',
    webm: '/assets/video/20261120-Voltwyn-Kinematics-Loop-Rev00.webm',
    poster: mediaLibrary.kinematicsLoopPoster,
    label: 'Looping demonstration of the 3-DOF planar inverse kinematics solver and reach envelope',
    caption: '3-DOF planar kinematics loop',
  },
  pidLoop: {
    id: 'pid-loop',
    mp4: '/assets/video/20261120-Voltwyn-PID-Scope-Loop-Rev00.mp4',
    webm: '/assets/video/20261120-Voltwyn-PID-Scope-Loop-Rev00.webm',
    poster: mediaLibrary.pidLoopPoster,
    label: 'Looping demonstration of PID step-response tuning across underdamped and balanced regimes',
    caption: 'PID step-response scope loop',
  },
  queueLoop: {
    id: 'queue-loop',
    mp4: '/assets/video/20261120-Voltwyn-Queue-Sim-Loop-Rev00.mp4',
    webm: '/assets/video/20261120-Voltwyn-Queue-Sim-Loop-Rev00.webm',
    poster: mediaLibrary.queueLoopPoster,
    label: 'Looping demonstration of M/M/1 waiting time scaling from 50 percent to 95 percent utilisation',
    caption: 'Little Law M/M/1 queue curve',
  },
} as const satisfies Record<string, VideoAsset>

const projectMediaBySlug: Record<string, { readonly image: MediaAsset; readonly video?: VideoAsset }> = {
  'autonomous-navigation-rover': { image: mediaLibrary.ros2Rover, video: videoLibrary.slamLoop },
  'industrial-display-controller': { image: mediaLibrary.displayPcb },
  'dooen-plant-process-model': { image: mediaLibrary.dooenIsaac },
  'mazetrack-assessment-controller': { image: mediaLibrary.mazetrackPcb },
  'waterless-solar-panel-cleaner': { image: mediaLibrary.solarCleaner },
  'deadline-aware-runtime-assurance': { image: mediaLibrary.runtimeAssurance },
  'ataxia-assessment-device': { image: mediaLibrary.ataxiaRig },
  'pricing-inventory-control': { image: mediaLibrary.pricingSystem },
  'industrial-process-simulation': { image: mediaLibrary.processTwin },
  'led-scoreboard-controller': { image: mediaLibrary.scoreboardLan },
  'ndcc-community-systems': { image: mediaLibrary.ndccNetwork },
}

const indexedProjectMediaByTitle: Record<string, MediaAsset> = {
  'Supervised Routine Companion Robot': mediaLibrary.heroLab,
  'Inventory Scanning Mobile Robot': mediaLibrary.ros2Rover,
  'Modular Education and Testing Robot': mediaLibrary.solarCleaner,
  'DuxTel Agricultural Equipment Telemetry': mediaLibrary.ndccNetwork,
  'Panelogram Retail Shelf Planner': mediaLibrary.panelogramUi,
  'Snail Race Fundraising Platform': mediaLibrary.snailRaceUi,
  'Engineering Mastery Lab': mediaLibrary.masteryLab,
  'Voltwyn: Local SLM System': mediaLibrary.localSlm,
  'Saj Service Desk': mediaLibrary.pricingSystem,
  'Regulated Smart Factory and SCADA Migration': mediaLibrary.processTwin,
  'ADAS and CAN Validation': mediaLibrary.runtimeAssurance,
  'ABMARC Emissions and Compliance Testing': mediaLibrary.displayPcb,
  'Carbon Revolution: Carbon-Fibre Wheel Manufacturing': mediaLibrary.heroLab,
  'IDL: Canning Line Upgrade and Commissioning': mediaLibrary.processTwin,
  'Manufacturing and Quality Foundation': mediaLibrary.processTwin,
}

const postMediaBySlug: Record<string, { readonly image: MediaAsset; readonly video?: VideoAsset }> = {
  'automation-queues-and-flow-time': { image: mediaLibrary.queueLoopPoster, video: videoLibrary.queueLoop },
  'integrator-windup-on-a-saturated-drive': { image: mediaLibrary.pidLoopPoster, video: videoLibrary.pidLoop },
  'ros2-navigation-rover-case-study': { image: mediaLibrary.ros2Rover, video: videoLibrary.slamLoop },
  'solar-panel-cleaning-robot-design-study': { image: mediaLibrary.solarCleaner },
  'slow-down-to-speed-up-in-engineering': { image: mediaLibrary.heroLab },
  'odometry-drift-grows-with-distance-squared': { image: mediaLibrary.ros2Rover },
  'size-the-motor-from-the-motion-profile': { image: mediaLibrary.heroLab },
  'test-each-stage-of-a-document-grounded-ai': { image: mediaLibrary.localSlm },
  'bridge-humanoid-hardware-and-control': { image: mediaLibrary.kinematicsLoopPoster, video: videoLibrary.kinematicsLoop },
  'size-the-thermistor-divider-for-the-heat': { image: mediaLibrary.displayPcb },
  'test-a-robot-when-the-data-stops': { image: mediaLibrary.runtimeAssurance },
  'display-control-board-and-radar-positioning': { image: mediaLibrary.displayPcb },
  'esp32-movement-assessment-case-study': { image: mediaLibrary.ataxiaRig },
  'pricing-inventory-case-study': { image: mediaLibrary.pricingSystem },
  'industrial-display-controller-case-study': { image: mediaLibrary.displayPcb },
  'the-second-life-of-a-product': { image: mediaLibrary.ataxiaRig },
  'in-praise-of-the-volume-knob': { image: mediaLibrary.scoreboardLan },
  'the-experience-trap': { image: mediaLibrary.masteryLab },
  'sampling-can-hide-real-motion': { image: mediaLibrary.ataxiaRig },
  'inspection-accuracy-and-missed-defects': { image: mediaLibrary.processTwin },
  'machine-vision-starts-with-the-image': { image: mediaLibrary.runtimeAssurance },
  'mqtt-connected-does-not-mean-current': { image: mediaLibrary.ndccNetwork },
  'ros2-topic-visible-but-no-messages': { image: mediaLibrary.ros2Rover },
  'robot-localisation-before-controller-tuning': { image: mediaLibrary.slamLoopPoster },
  'noisy-sensors-hysteresis-and-debounce': { image: mediaLibrary.mazetrackPcb },
  'local-ai-beyond-the-model': { image: mediaLibrary.localSlm },
  'csv-imports-that-deserve-trust': { image: mediaLibrary.pricingSystem },
  'local-first-apps-need-a-restore-path': { image: mediaLibrary.panelogramUi },
  'automation-retries-without-duplicate-actions': { image: mediaLibrary.processTwin },
  'ai-without-the-jargon': { image: mediaLibrary.localSlm },
}

export function getProjectMedia(slug: string): { readonly image: MediaAsset; readonly video?: VideoAsset } {
  return projectMediaBySlug[slug] ?? { image: mediaLibrary.heroLab }
}

export function getIndexedProjectMedia(title: string): MediaAsset {
  return indexedProjectMediaByTitle[title] ?? mediaLibrary.heroLab
}

export function getPostMedia(slug: string): { readonly image: MediaAsset; readonly video?: VideoAsset } {
  return postMediaBySlug[slug] ?? { image: mediaLibrary.heroLab }
}
