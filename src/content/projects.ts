export interface Project {
  readonly slug: string
  readonly title: string
  readonly evidence: string
  readonly problem: string
  readonly system: string
  readonly ownership: string
  readonly decisions: readonly string[]
  readonly verification: string
  readonly outcome: string
  readonly boundary: string
  readonly stack: readonly string[]
  readonly image: { readonly src: string; readonly alt: string; readonly width: number; readonly height: number }
}

export const projects: readonly Project[] = [
  {
    slug: 'inventory-scanning-mobile-robot',
    title: 'Inventory Scanning Mobile Robot',
    evidence: 'Active client deployment',
    problem: 'Physical stock capture is repetitive and error-prone when observations, item identity, location and inventory records are disconnected.',
    system: 'An operator-support mobile robot that connects physical stock observations to a controlled inventory-review workflow.',
    ownership: 'Owned the delivered system boundary across mobility, item identification, location association, inventory data handoff, operator confirmation and deployment.',
    decisions: [
      'Separated navigation, identification and data integrity into independently verifiable problems.',
      'Made uncertain observations stop for operator review instead of changing inventory records silently.',
    ],
    verification: 'Deployment and active end-user use verify the integrated robot and review workflow. Client-site evidence and implementation details remain confidential.',
    outcome: 'A completed mobile robot in active end-user use, linking physical stock capture to controlled inventory review while retaining operator authority.',
    boundary: 'This record does not claim lights-out warehouse autonomy, certified safety, a disclosed scanner or sensor suite, or unpublished performance figures.',
    stack: ['Requirements engineering', 'System architecture', 'Robotics integration', 'Deployment and handover'],
    image: {
      src: '/assets/image/20260806-Inventory-Scanning-Mobile-Robot-Rev00.avif',
      alt: 'Concept visual of a compact operator-support mobile robot beside organised inventory shelving.',
      width: 1672,
      height: 941,
    },
  },
  {
    slug: 'autonomous-navigation-rover',
    title: 'Autonomous Navigation Rover on ROS 2',
    evidence: 'Hardware build with simulation-validated autonomy',
    problem: 'Autonomous systems need reliable localisation, mapping and obstacle-aware navigation before higher-level behaviour matters.',
    system: 'A differential-drive platform with LiDAR and IMU sensing, running ROS 2 Humble, Nav2, SLAM, EKF state estimation and motion control.',
    ownership: 'Built the platform and integrated sensing, localisation, planning and control across independently testable ROS 2 nodes.',
    decisions: [
      'Kept perception, estimation, planning and control modular so each layer could be tuned and validated independently.',
      'Regression-tested planning, costmaps, controller gains and recovery behaviour in simulation before applying changes to hardware.',
    ],
    verification: 'Gazebo Fortress regression runs and RViz inspection checked maps, transforms, fused pose, planned paths and recovery behaviour before physical deployment.',
    outcome: 'A working hardware and simulation platform with repeatable localisation, planning and obstacle-aware navigation behaviour.',
    boundary: 'Simulation provides the repeatable autonomy evidence. This record does not claim fleet deployment or certified functional safety.',
    stack: ['ROS 2 Humble', 'Nav2', 'Gazebo Fortress', 'RViz', 'LiDAR SLAM', 'EKF', 'Python', 'C++', 'Linux'],
    image: {
      src: '/assets/image/Autonomous_Navigation_ROS2_Robotics_Rev00.avif',
      alt: 'ROS 2 autonomous navigation visual showing robot mapping and route planning.',
      width: 1448,
      height: 1086,
    },
  },
  {
    slug: 'ataxia-assessment-device',
    title: 'ESP32 Clinical Ataxia Assessment Device',
    evidence: 'Assessed embedded prototype',
    problem: 'Movement and coordination assessment benefits from repeatable sensor-based measurement rather than observation alone.',
    system: 'An ESP32 device with a custom PCB, enclosure, four Hall-effect sensors, 100 Hz acquisition, Bluetooth connectivity and MATLAB validation.',
    ownership: 'Designed the device, PCB and enclosure, implemented real-time acquisition and Bluetooth workflows, and built the analysis and reporting path.',
    decisions: [
      'Used four Hall-effect sensing channels and deterministic 100 Hz acquisition to capture direction, reversal and movement behaviour consistently.',
      'Kept acquisition and live display responsive on the embedded system while retaining MATLAB for auditable reference-instrument comparison.',
    ],
    verification: 'Accuracy, direction, reversal, drift and temperature behaviour were checked against reference instruments in MATLAB.',
    outcome: 'A proof-of-concept measurement platform with real-time recording, Bluetooth live display and CSV/PDF clinician reporting.',
    boundary: 'This was an assessed engineering prototype, not a certified medical device and not a claim of clinical efficacy.',
    stack: ['ESP32', 'C/C++', 'BLE', 'Altium', 'MATLAB', 'Hall-effect sensing', 'PCB design', 'Enclosure design'],
    image: {
      src: '/assets/image/Embedded_Clinical_Ataxia_Assessment_Rev00.avif',
      alt: 'Embedded clinical ataxia assessment prototype with sensors and movement-data capture.',
      width: 1448,
      height: 1086,
    },
  },
] as const

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
