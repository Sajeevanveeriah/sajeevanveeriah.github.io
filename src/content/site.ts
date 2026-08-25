export const site = {
  name: 'Sajeevan Veeriah',
  initials: 'SV',
  jobTitle: 'Robotics, Mechatronics, AI/ML & End-To-End Automation Engineer',
  proposition:
    'I engineer complete intelligent systems across mechanics, electronics, embedded intelligence, software, autonomy, AI/ML and real-world implementation.',
  url: 'https://sajeevanveeriah.github.io',
  email: 'sajeevanveeriah@gmail.com',
  resume: '/assets/Resume_Sajeevan_Veeriah.pdf',
  github: 'https://github.com/Sajeevanveeriah',
  support: {
    label: 'Buy me a coffee',
    description: 'Optional support for my open engineering work.',
    url: 'https://paypal.me/SajeevanVeeriah95',
  },
  credentials: ['Member, Engineers Australia', 'Deakin Mechatronics Engineering Honours, Distinction, 2025'],
} as const

export const systemLayers = [
  { index: '01', title: 'Physical system', detail: 'Mechanisms, structures, actuation and the environment.' },
  { index: '02', title: 'Sensing and electronics', detail: 'Sensors, signal paths, power and embedded hardware.' },
  { index: '03', title: 'Embedded intelligence', detail: 'Firmware, real-time control, drivers and middleware.' },
  { index: '04', title: 'Robotics and autonomy', detail: 'Perception, estimation, planning and motion control.' },
  { index: '05', title: 'AI/ML and data', detail: 'Models, telemetry, engineering data and diagnostics.' },
  { index: '06', title: 'Validation and deployment', detail: 'Simulation, integration, field checks and handover.' },
] as const

export const practiceDomains = [
  {
    title: 'Robotics & Autonomy',
    detail: 'ROS 2 Humble, Nav2, MoveIt 2, Gazebo Fortress, SLAM, EKF sensor fusion, localisation, planning and PID control.',
  },
  {
    title: 'Embedded & Electronics',
    detail: 'ESP32, STM32, FreeRTOS, C/C++, PCB bring-up, CAN, UART, I2C, SPI, BLE, sensing, motors and drives.',
  },
  {
    title: 'Automation & Controls',
    detail: 'Siemens TIA Portal, WinCC, PCS 7, iFIX, PVI+, PLC and HMI/SCADA integration, FAT, SAT and commissioning.',
  },
  {
    title: 'AI/ML & Engineering Data',
    detail: 'Python, scikit-learn, OpenCV, YOLO, time-series analysis, MATLAB, Simulink, InfluxDB and Grafana.',
  },
  {
    title: 'Mechanical & Validation',
    detail: 'SolidWorks, Fusion 360, GD&T, prototyping, instrumentation, calibrated testing, fault isolation and DFM.',
  },
  {
    title: 'Software & Delivery',
    detail: 'Python, C/C++, TypeScript, Linux, Git, Docker, CI/CD, REST APIs, PostgreSQL, traceability and handover.',
  },
] as const
