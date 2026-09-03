export const learningGuide = {
  title: 'Six-month robotics capability plan',
  description:
    'A build-first pathway across electronics, embedded control, mechanical design, ROS 2, controls, perception and robot learning. Each month ends with evidence that can survive an engineering interview.',
  docx: '/assets/20260903-Robotics-Learning-Roadmap-Rev00.docx',
} as const

export const learningMonths = [
  {
    month: '01',
    title: 'Bench foundations',
    focus: 'Electronics, multimeter use, soldering, Python, terminal and Git.',
    build: 'Voltage-divider and transistor-switch experiments with a documented fault-finding log.',
    resources: [
      ['Falstad Circuit Simulator', 'https://www.falstad.com/circuit/'],
      ['All About Circuits textbook', 'https://www.allaboutcircuits.com/textbook/'],
      ['CS50P', 'https://cs50.harvard.edu/python/'],
      ['The Missing Semester', 'https://missing.csail.mit.edu/'],
    ],
  },
  {
    month: '02',
    title: 'Embedded motion',
    focus: 'Microcontrollers, PWM, motors, encoders, sensors and closed-loop control.',
    build: 'Line follower and self-balancing robot with logged P, PD and PID behaviour.',
    resources: [
      ['Arduino built-in examples', 'https://docs.arduino.cc/built-in-examples/'],
      ['ESP-IDF programming guide', 'https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/'],
      ['SimpleFOC documentation', 'https://docs.simplefoc.com/'],
      ['Kalman and Bayesian Filters in Python', 'https://rlabbe.github.io/Kalman-and-Bayesian-Filters-in-Python/'],
    ],
  },
  {
    month: '03',
    title: 'Mechanical embodiment',
    focus: 'Parametric CAD, tolerances, FDM design, actuation and backlash.',
    build: 'A fitted servo bracket, calibrated enclosure and modified low-cost robot arm.',
    resources: [
      ['Onshape CAD fundamentals', 'https://learn.onshape.com/learning-paths/onshape-fundamentals-cad'],
      ['OrcaSlicer calibration', 'https://github.com/OrcaSlicer/OrcaSlicer/wiki/Calibration'],
      ['Teaching Tech calibration', 'https://teachingtechyt.github.io/calibration.html'],
      ['LeRobot SO-101 guide', 'https://huggingface.co/docs/lerobot/so101'],
    ],
  },
  {
    month: '04',
    title: 'Robot software',
    focus: 'ROS 2, TF, xacro, Gazebo, ros2_control, SLAM and Nav2.',
    build: 'A custom simulated robot that maps a world, localises and navigates autonomously.',
    resources: [
      ['ROS 2 Jazzy tutorials', 'https://docs.ros.org/en/jazzy/Tutorials.html'],
      ['Articulated Robotics', 'https://articulatedrobotics.xyz/tutorials/'],
      ['Gazebo documentation', 'https://gazebosim.org/docs/latest/getstarted/'],
      ['Nav2 documentation', 'https://docs.nav2.org/'],
    ],
  },
  {
    month: '05',
    title: 'Control and perception',
    focus: 'PID, state space, LQR, kinematics, calibration, vision and MoveIt 2.',
    build: 'Measured controller comparison plus a collision-aware simulated pick-and-place task.',
    resources: [
      ['Understanding PID Control', 'https://www.mathworks.com/videos/series/understanding-pid-control.html'],
      ['Underactuated Robotics', 'https://underactuated.csail.mit.edu/'],
      ['Modern Robotics', 'http://hades.mech.northwestern.edu/index.php/Modern_Robotics'],
      ['MoveIt 2 tutorials', 'https://moveit.picknik.ai/main/doc/tutorials/getting_started/getting_started.html'],
    ],
  },
  {
    month: '06',
    title: 'Robot learning and evidence',
    focus: 'Demonstration data, imitation learning, ACT, specialisation and portfolio proof.',
    build: 'Record, train and deploy a LeRobot policy, then publish success-rate and failure analysis.',
    resources: [
      ['LeRobot documentation', 'https://huggingface.co/docs/lerobot/index'],
      ['Hugging Face Robotics Course', 'https://huggingface.co/learn/robotics-course/unit0/1'],
      ['MuJoCo Playground', 'https://github.com/google-deepmind/mujoco_playground'],
      ['CS 285 Deep Reinforcement Learning', 'https://rail.eecs.berkeley.edu/deeprlcourse/'],
    ],
  },
] as const
