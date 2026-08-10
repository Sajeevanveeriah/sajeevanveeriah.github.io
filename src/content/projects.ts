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
    evidence: 'Simulation-validated autonomy stack',
    problem: 'Autonomous systems need reliable localisation, mapping and obstacle-aware navigation before higher-level behaviour matters.',
    system: 'A complete ROS 2 Humble autonomy stack integrating LiDAR SLAM, state estimation, sensor fusion, planning and motion control.',
    ownership: 'Integrated perception, state estimation, planning and control as independently testable ROS 2 nodes.',
    decisions: [
      'Kept perception, estimation, planning and control modular so each layer could be tuned and validated independently.',
      'Used simulation-first validation to exercise repeatable failure cases before physical trials.',
    ],
    verification: 'Repeated Gazebo simulations and RViz inspection checked maps, transforms, localisation stability, planned paths and obstacle avoidance across reruns.',
    outcome: 'A repeatable simulation-validated autonomy stack with stable localisation and obstacle-aware navigation.',
    boundary: 'The evidence is deterministic simulated behaviour, not a fleet deployed in the field.',
    stack: ['ROS 2 Humble', 'Nav2', 'Gazebo', 'RViz', 'LiDAR SLAM', 'Kalman and EKF'],
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
    system: 'Embedded sensing hardware and real-time firmware combining IMU, time-of-flight, Hall-effect and magnetometer inputs with MATLAB analysis.',
    ownership: 'Built the sensing hardware, deterministic acquisition firmware and analysis workflow for a final-year Mechatronics Engineering Honours capstone.',
    decisions: [
      'Combined complementary sensor modalities so movement features were captured through more than one physical measurement path.',
      'Kept acquisition deterministic on the ESP32 and analysis offline where comparison to clinical references was easier to audit.',
    ],
    verification: 'Measurements were checked against clinical references for repeatability and comparability.',
    outcome: 'A proof-of-concept measurement platform supporting repeatable motion and coordination assessment.',
    boundary: 'This was an assessed engineering prototype, not a certified medical device and not a claim of clinical efficacy.',
    stack: ['ESP32', 'Embedded C/C++', 'IMU', 'Time-of-flight', 'Hall effect', 'Magnetometer', 'MATLAB'],
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
