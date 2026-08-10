import type { SourceRecord } from './types'

/**
 * Citable sources behind the lifecycle claims in this catalogue.
 *
 * Every entry that says something is current, preview or maintained points
 * at one of these, and every record carries the date it was read. That date
 * is the honest limit of the claim: it says what the source said when it was
 * checked, not what is true forever.
 *
 * These are reference links only. Nothing here is fetched at build time or
 * at runtime, and no external request is made when a page loads: the URLs
 * render as ordinary outbound anchors the reader may choose to follow.
 *
 * `sourceType: 'secondary'` marks the few records where no primary source
 * was reachable. They are rendered with a visible "secondary source" label
 * so a reader can weigh them accordingly.
 */

export const REVIEWED_AT = '2026-07-30'

export const sources: readonly SourceRecord[] = [
  // Raspberry Pi
  {
    id: 'src-rpi-products',
    title: 'Raspberry Pi: products',
    url: 'https://www.raspberrypi.com/products/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-rpi-cm',
    title: 'Raspberry Pi documentation: Compute Module hardware',
    url: 'https://www.raspberrypi.com/documentation/computers/compute-module.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-rpi-pico',
    title: 'Raspberry Pi documentation: Pico-series microcontroller boards',
    url: 'https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-rpi-aihat',
    title: 'Raspberry Pi documentation: AI HATs',
    url: 'https://www.raspberrypi.com/documentation/accessories/ai-hat-plus.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-rpi-camera',
    title: 'Raspberry Pi documentation: camera hardware',
    url: 'https://www.raspberrypi.com/documentation/accessories/camera.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },

  // Arduino
  {
    id: 'src-arduino-hardware',
    title: 'Arduino documentation: hardware',
    url: 'https://docs.arduino.cc/hardware/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-arduino-unoq',
    title: 'Arduino blog: UNO Q accessories announcement',
    url: 'https://blog.arduino.cc/2026/03/27/we-just-announced-seven-new-products-ready-to-expand-your-arduino-uno-q-board/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-arduino-nano-r4',
    title: 'Arduino: Nano R4 product page',
    url: 'https://store.arduino.cc/products/nano-r4',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },

  // Particle
  {
    id: 'src-particle-docs',
    title: 'Particle documentation: getting started, what is new',
    url: 'https://docs.particle.io/getting-started/new/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-particle-changelog',
    title: 'Particle changelog',
    url: 'https://changelog.particle.io/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-particle-mesh',
    title: 'Particle blog: Mesh update, a note from the CEO',
    url: 'https://www.particle.io/blog/mesh-deprecation/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-particle-photon2',
    title: 'Particle documentation: Photon 2 from Argon migration guide',
    url: 'https://docs.particle.io/hardware/migration-guides/photon-2-argon-migration-guide/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },

  // NVIDIA
  {
    id: 'src-nvidia-jetson-modules',
    title: 'NVIDIA Developer: Jetson modules, support, ecosystem and lineup',
    url: 'https://developer.nvidia.com/embedded/jetson-modules',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-nvidia-jetson-thor',
    title: 'NVIDIA: Jetson Thor, advanced AI for physical robotics',
    url: 'https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-nvidia-t4000',
    title: 'NVIDIA Technical Blog: Jetson T4000 and JetPack 7.1',
    url: 'https://developer.nvidia.com/blog/accelerate-ai-inference-for-edge-and-robotics-with-nvidia-jetson-t4000-and-nvidia-jetpack-7-1/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-nvidia-omniverse',
    title: 'NVIDIA: Omniverse and Isaac Sim',
    url: 'https://developer.nvidia.com/isaac/sim',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },

  // ROS and simulation
  {
    id: 'src-ros2-releases',
    title: 'ROS 2 documentation: distributions',
    url: 'https://docs.ros.org/en/rolling/Releases.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-ros2-lyrical',
    title: 'ROS 2 documentation: Lyrical Luth release timeline',
    url: 'https://docs.ros.org/en/jazzy/Releases/lyrical/release-timeline.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-gazebo',
    title: 'Gazebo documentation: releases and ROS installation',
    url: 'https://gazebosim.org/docs/latest/ros_installation/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },

  // Toolchains and runtimes
  {
    id: 'src-threadx',
    title: 'Eclipse ThreadX: Azure RTOS is now Eclipse ThreadX',
    url: 'https://threadx.io/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-litert',
    title: 'Google Developers Blog: TensorFlow Lite is now LiteRT',
    url: 'https://developers.googleblog.com/tensorflow-lite-is-now-litert/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-mathworks',
    title: 'MathWorks: products',
    url: 'https://www.mathworks.com/products.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-gymnasium',
    title: 'Farama Foundation: Gymnasium documentation',
    url: 'https://gymnasium.farama.org/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-google-iot-core',
    title: 'Google Cloud: IoT Core retirement notice',
    url: 'https://cloud.google.com/iot/docs/release-notes',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-hailo',
    title: 'Hailo: AI accelerators and vision processors',
    url: 'https://hailo.ai/products/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-coral',
    title: 'Coral: products and Edge TPU',
    url: 'https://coral.ai/products/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-beagleboard',
    title: 'BeagleBoard.org: boards',
    url: 'https://www.beagleboard.org/boards',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-hardkernel-odroid',
    title: 'Hardkernel: ODROID product range',
    url: 'https://www.hardkernel.com/',
    sourceType: 'official',
    reviewedAt: '2026-08-06',
  },
  {
    id: 'src-asus-tinker-board',
    title: 'ASUS: Tinker Board series',
    url: 'https://tinker-board.asus.com/series/tinker-board.html',
    sourceType: 'official',
    reviewedAt: '2026-08-06',
  },
  {
    id: 'src-microbit-v2',
    title: 'Micro:bit Educational Foundation: micro:bit V2 hardware',
    url: 'https://tech.microbit.org/hardware/2-0-revision/',
    sourceType: 'official',
    reviewedAt: '2026-08-06',
  },
  {
    id: 'src-adafruit-feather',
    title: 'Adafruit Learning System: Feather overview',
    url: 'https://learn.adafruit.com/adafruit-feather',
    sourceType: 'official',
    reviewedAt: '2026-08-06',
  },

  // Standards bodies
  {
    id: 'src-iso-10218-1',
    title: 'ISO 10218-1:2025, robotics, safety requirements, part 1: industrial robots',
    url: 'https://www.iso.org/standard/73933.html',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-iso-10218-2',
    title: 'ISO 10218-2:2025, robotics, safety requirements, part 2: industrial robot applications',
    url: 'https://www.iso.org/standard/73934.html',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-iso-13849-1',
    title: 'ISO 13849-1:2023, safety-related parts of control systems, part 1',
    url: 'https://www.iso.org/standard/73481.html',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-iso-ts-15066',
    title: 'ISO/TS 15066:2016, robots and robotic devices, collaborative robots',
    url: 'https://www.iso.org/standard/62996.html',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-iec-61508',
    title: 'IEC 61508 series, functional safety of E/E/PE safety-related systems',
    url: 'https://webstore.iec.ch/publication/5515',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-iec-62443',
    title: 'IEC 62443 series, security for industrial automation and control systems',
    url: 'https://webstore.iec.ch/publication/7029',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-iec-61131-3',
    title: 'IEC 61131-3, programmable controllers, part 3: programming languages',
    url: 'https://webstore.iec.ch/publication/62427',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-iso-26262',
    title: 'ISO 26262 series, road vehicles, functional safety',
    url: 'https://www.iso.org/standard/68383.html',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-eu-machinery',
    title: 'Regulation (EU) 2023/1230 on machinery',
    url: 'https://eur-lex.europa.eu/eli/reg/2023/1230/oj',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-eu-cra',
    title: 'Regulation (EU) 2024/2847, Cyber Resilience Act',
    url: 'https://eur-lex.europa.eu/eli/reg/2024/2847/oj',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-fda-qmsr',
    title: 'FDA: Quality Management System Regulation',
    url: 'https://www.fda.gov/medical-devices/postmarket-requirements-devices/quality-management-system-regulation-qmsr',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-eu-mdr',
    title: 'Regulation (EU) 2017/745 on medical devices',
    url: 'https://eur-lex.europa.eu/eli/reg/2017/745/oj',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-opcfoundation',
    title: 'OPC Foundation: OPC UA specifications',
    url: 'https://opcfoundation.org/about/opc-technologies/opc-ua/',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-ethercat',
    title: 'EtherCAT Technology Group',
    url: 'https://www.ethercat.org/',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-profibus',
    title: 'PROFIBUS and PROFINET International',
    url: 'https://www.profibus.com/',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-ieee-tsn',
    title: 'IEEE 802.1 Time-Sensitive Networking Task Group',
    url: 'https://1.ieee802.org/tsn/',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-vda5050',
    title: 'VDA 5050, interface for the communication between AGVs and a master control',
    url: 'https://www.vda.de/en/news/publications',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-isa',
    title: 'International Society of Automation: standards',
    url: 'https://www.isa.org/standards-and-publications/isa-standards',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-nist-800-82',
    title: 'NIST SP 800-82, guide to operational technology security',
    url: 'https://csrc.nist.gov/pubs/sp/800/82/r3/final',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-ipc',
    title: 'IPC: standards and publications',
    url: 'https://www.ipc.org/standards',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-autosar',
    title: 'AUTOSAR: classic and adaptive platforms',
    url: 'https://www.autosar.org/standards',
    sourceType: 'standards-body',
    reviewedAt: REVIEWED_AT,
  },

  // Repositories and project homes
  {
    id: 'src-opencv',
    title: 'OpenCV',
    url: 'https://opencv.org/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-pytorch',
    title: 'PyTorch',
    url: 'https://pytorch.org/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-tensorflow',
    title: 'TensorFlow',
    url: 'https://www.tensorflow.org/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-openvla',
    title: 'OpenVLA: an open-source vision-language-action model',
    url: 'https://openvla.github.io/',
    sourceType: 'repository',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-physical-intelligence',
    title: 'Physical Intelligence: pi-zero',
    url: 'https://www.physicalintelligence.company/blog/pi0',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-rt2',
    title: 'Google DeepMind: RT-2, vision-language-action models',
    url: 'https://deepmind.google/discover/blog/rt-2-new-model-translates-vision-and-language-into-action/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-octo',
    title: 'Octo: an open-source generalist robot policy',
    url: 'https://octo-models.github.io/',
    sourceType: 'repository',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-codesys',
    title: 'CODESYS Group',
    url: 'https://www.codesys.com/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-siemens-tia',
    title: 'Siemens: TIA Portal',
    url: 'https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-rockwell',
    title: 'Rockwell Automation: control systems and software',
    url: 'https://www.rockwellautomation.com/en-us/products.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-beckhoff',
    title: 'Beckhoff: TwinCAT automation software',
    url: 'https://www.beckhoff.com/en-en/products/automation/twincat/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-espressif',
    title: 'Espressif: SoCs and modules',
    url: 'https://www.espressif.com/en/products/socs',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-st',
    title: 'STMicroelectronics: STM32 32-bit Arm Cortex MCUs',
    url: 'https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-zephyr',
    title: 'Zephyr Project',
    url: 'https://www.zephyrproject.org/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
  {
    id: 'src-freertos',
    title: 'FreeRTOS',
    url: 'https://www.freertos.org/',
    sourceType: 'official',
    reviewedAt: REVIEWED_AT,
  },
] as const

/** Most recent source-review date, without re-dating older source records. */
export const CATALOGUE_UPDATED_AT = sources.reduce(
  (latest, source) => (source.reviewedAt > latest ? source.reviewedAt : latest),
  REVIEWED_AT,
)
