import { Bars, type FigEdge, type FigNode, type FigSpec } from './kit'
import { learningMonths } from '@/content/learning'
import { phases } from '@/content/services'

/**
 * One figure per piece of work. Case studies are keyed by slug, project-index
 * entries and journal posts by title or slug. Labels and numbers restate the
 * record they sit beside; a figure adds no claim of its own.
 */

type Options = Omit<FigNode, 'id' | 'c' | 'r' | 't' | 's'>
const n = (id: string, c: number, r: number, t: string, s?: string, options: Options = {}): FigNode => ({ id, c, r, t, ...(s ? { s } : {}), ...options })

/** A single row of steps joined left to right. */
function chain(label: string, steps: readonly (readonly [string, string?])[], note?: string): FigSpec {
  return {
    label, cols: steps.length, rows: 1, h: note ? 200 : 170, gapX: steps.length > 4 ? 18 : 24,
    nodes: steps.map(([t, s], index) => n(`s${index}`, index, 0, t, s, index === steps.length - 1 ? { tone: 'accent' } : {})),
    edges: steps.slice(1).map((_, index): FigEdge => [`s${index}`, `s${index + 1}`]),
    ...(note ? { note } : {}),
  }
}

const solarPlan = (
  <g>
    <rect className="fig-box ghost" x={20} y={16} width={520} height={128} />
    <text className="fig-s" x={28} y={32}>Panel boundary</text>
    <rect className="fig-box" x={206} y={38} width={136} height={14} />
    <rect className="fig-box" x={206} y={108} width={136} height={14} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path className="fig-edge" key={i} d={`M${216 + i * 17} 38v14 M${216 + i * 17} 108v14`} />)}
    <rect className="fig-box" x={222} y={52} width={104} height={56} />
    <text className="fig-t" x={274} y={85} fontSize={14} textAnchor="middle">Chassis</text>
    <rect className="fig-fill accent" x={356} y={22} width={12} height={116} />
    <text className="fig-s" x={378} y={74}>Dry-cleaning roller</text>
    <text className="fig-s" x={378} y={90}>reaches past the tracks</text>
    <text className="fig-s" x={196} y={49} textAnchor="end">Track pod</text>
    <text className="fig-s" x={196} y={119} textAnchor="end">Track pod</text>
    <path className="fig-edge" d="M440 124h44" /><polygon className="fig-head" points="492,124 484,120 484,128" />
    <text className="fig-s" x={436} y={128} textAnchor="end">Travel</text>
  </g>
)

const ledCanvas = (
  <g>
    {Array.from({ length: 10 }, (_, i) => (
      <g key={i}>
        <rect className={i === 0 ? 'fig-fill accent' : 'fig-box'} x={170 + (i % 5) * 44} y={20 + Math.floor(i / 5) * 44} width={44} height={44} />
        <text className={i === 0 ? 'fig-on-accent' : 'fig-s'} x={192 + (i % 5) * 44} y={47 + Math.floor(i / 5) * 44} textAnchor="middle">{i + 1}</text>
      </g>
    ))}
    <text className="fig-t" x={14} y={50} fontSize={15}>640 x 256 canvas</text>
    <text className="fig-s" x={14} y={68}>20 frames per second</text>
    <text className="fig-t" x={404} y={50} fontSize={15}>128 x 128 each</text>
    <text className="fig-s" x={404} y={68}>One region per receiver</text>
    <text className="fig-s" x={404} y={84}>through two HUB75 outputs</text>
  </g>
)

export const projectFigures: Record<string, FigSpec> = {
  'autonomous-navigation-rover': {
    label: 'Navigation stack: LiDAR feeds SLAM mapping and an IMU feeds EKF pose estimation; Nav2 uses the map and fused pose for costmaps, planning, control and recovery, and drives a differential-drive platform. Checked in Gazebo Fortress and RViz.',
    cols: 4, rows: 3,
    nodes: [
      n('lidar', 0, 0, 'LiDAR', 'Range scans', { g: 'sensor' }),
      n('ros', 0, 1, 'ROS 2 Humble', 'Independently testable nodes', { cs: 2, tone: 'ghost' }),
      n('imu', 0, 2, 'IMU', 'Inertial data', { g: 'sensor' }),
      n('slam', 1, 0, 'SLAM', 'Builds the map'),
      n('ekf', 1, 2, 'EKF', 'Fused pose'),
      n('nav', 2, 0, 'Nav2', 'Costmaps, planning, control and recovery behaviour', { rs: 3, tone: 'accent' }),
      n('drive', 3, 1, 'Drive', 'Differential drive', { g: 'motor' }),
    ],
    edges: [['lidar', 'slam'], ['imu', 'ekf'], ['slam', 'nav'], ['ekf', 'nav'], ['nav', 'drive']],
    note: 'Maps, transforms, fused pose, planned paths and recovery were checked in Gazebo Fortress regression runs and RViz.',
  },
  'ataxia-assessment-device': {
    label: 'Signal path: four Hall-effect channels feed ESP32 acquisition at 100 Hz, which drives a Bluetooth live display and CSV recording; MATLAB compares the recordings against reference instruments.',
    cols: 4, rows: 4, gapY: 10,
    nodes: [
      ...[0, 1, 2, 3].map((i) => n(`h${i}`, 0, i, `Hall ${i + 1}`)),
      n('esp', 1, 0, 'ESP32', 'Deterministic 100 Hz acquisition', { rs: 4, tone: 'accent', g: 'chip' }),
      n('ble', 2, 0, 'Bluetooth', 'Live display', { rs: 2 }),
      n('csv', 2, 2, 'Recording', 'CSV data', { rs: 2, g: 'doc' }),
      n('mat', 3, 0, 'MATLAB', 'Compared with reference instruments: accuracy, direction, reversal, drift, temperature', { rs: 4, g: 'chart' }),
    ],
    edges: [['h0', 'esp'], ['h1', 'esp'], ['h2', 'esp'], ['h3', 'esp'], ['esp', 'ble'], ['esp', 'csv'], ['csv', 'mat']],
    note: 'An engineering measurement prototype. These checks do not establish clinical effectiveness.',
  },
  'pricing-inventory-control': {
    label: 'Workflow: a supplier export and the current ServiceM8 materials list are matched, priced at a 30 percent markup on GST-exclusive cost and reviewed by an operator, producing a ServiceM8 import CSV and change, exception, rollback and audit reports.',
    cols: 4, rows: 3,
    nodes: [
      n('sup', 0, 0, 'Supplier export', 'Untouched price file', { g: 'doc' }),
      n('sm8', 0, 2, 'ServiceM8 list', 'Current materials', { g: 'db' }),
      n('match', 1, 0, 'Match', 'Exact code, then approved alias. Similarity is a suggestion only.', { rs: 3 }),
      n('price', 2, 0, 'Price', '30% markup on GST-exclusive cost'),
      n('review', 2, 1, 'Operator review', 'Changes and exceptions stay visible', { rs: 2, g: 'user' }),
      n('out', 3, 0, 'Import CSV', 'ServiceM8 format', { tone: 'accent' }),
      n('rep', 3, 2, 'Reports', 'Change, exception, rollback, audit'),
    ],
    edges: [['sup', 'match'], ['sm8', 'match'], ['match', 'price'], ['price', 'review'], ['review', 'out'], ['review', 'rep']],
    note: 'More than 500 automated checks, including a byte-for-byte round trip of the ServiceM8 CSV contract.',
  },
  'industrial-display-controller': {
    label: 'Controller architecture: serial indicator data passes a parser and receiver state machine to display formatting and scanning, which drives a matrix display that stays disarmed until enabled. A local browser interface configures the ESP32-S3 on its four-layer PCB.',
    cols: 4, rows: 3,
    nodes: [
      n('ser', 0, 0, 'Serial input', 'Indicator data'),
      n('parse', 1, 0, 'Parser', 'Receiver state machine'),
      n('fmt', 2, 0, 'Display logic', 'Formatting, scanning'),
      n('led', 3, 0, 'Matrix display', 'Disarmed until enabled', { tone: 'accent' }),
      n('mcu', 0, 1, 'ESP32-S3 on a four-layer PCB', 'Power conversion, processing, serial interfaces and display buffering', { cs: 4, tone: 'ghost', g: 'chip' }),
      n('cfg', 0, 2, 'Browser interface', 'Local configuration and updates', { cs: 2, g: 'screen' }),
      n('p31', 2, 2, '31', 'synthetic protocol profiles', { big: true }),
      n('p88', 3, 2, '88', 'SMT designators matched', { big: true }),
    ],
    edges: [['ser', 'parse'], ['parse', 'fmt'], ['fmt', 'led'], ['cfg', 'mcu']],
    note: 'These checks support the PCB design and software behaviour. Assembled-board measurements are separate work.',
  },
  'waterless-solar-panel-cleaner': {
    label: 'Top view of the SPC-001: a chassis between two track pods with a dry-cleaning roller ahead of it that reaches past the tracks, inside a panel boundary. Below: contact, movement, supervision and analysis, with 40,184 supervisor assertions and 870 coverage-planner assertions.',
    cols: 4, rows: 2, top: 146, gapY: 12, h: 380,
    extra: solarPlan,
    nodes: [
      n('a', 0, 0, 'Contact', 'Dry-cleaning roller'),
      n('b', 1, 0, 'Move', 'Tracked platform'),
      n('c', 2, 0, 'Supervise', 'States and faults'),
      n('d', 3, 0, 'Analyse', 'Traction, energy, coverage'),
      n('e', 0, 1, '40,184', 'supervisor assertions', { cs: 2, big: true }),
      n('f', 2, 1, '870', 'coverage-planner assertions', { cs: 2, big: true }),
    ],
    note: 'Hardware built and functionally tested. Force, torque, energy and coverage figures are modelled results.',
  },
  'deadline-aware-runtime-assurance': {
    label: 'Chart: of 5,400 navigation episodes, joint supervision completed 5,268 and a global worst-case supervisor completed 2,674. Below: observe, estimate, supervise and execute, where the supervisor chooses continue, restrict or recover.',
    cols: 4, rows: 1, top: 138,
    extra: <Bars x={14} y={14} w={532} title="Navigation episodes completed, out of 5,400" max={5400} items={[{ label: 'Joint supervision', value: 5268, accent: true }, { label: 'Global worst-case supervisor', value: 2674 }]} />,
    nodes: [
      n('a', 0, 0, 'Observe', 'Timestamped position and commands'),
      n('b', 1, 0, 'Estimate', 'Bounded state, information age'),
      n('c', 2, 0, 'Supervise', 'Continue, restrict or recover', { tone: 'accent' }),
      n('d', 3, 0, 'Execute', 'Command lease, braking watchdog'),
    ],
    edges: [['a', 'b'], ['b', 'c'], ['c', 'd']],
    note: 'Reduced-order simulation with static obstacles. Both supervisors recorded zero collisions in 3,000 bounded wall approaches.',
  },
  'industrial-process-simulation': {
    label: 'Process flow: receive, wash, cut, thermal processing, freeze, pack and dispatch. One deterministic plant state feeds the 3D view, flow schematic, asset register and alarms.',
    cols: 4, rows: 3,
    nodes: [
      n('a', 0, 0, 'Receive', 'Intake records'),
      n('b', 1, 0, 'Wash'),
      n('c', 2, 0, 'Cut'),
      n('d', 3, 0, 'Thermal', 'Processing'),
      n('e', 3, 1, 'Freeze'),
      n('f', 2, 1, 'Pack'),
      n('g', 1, 1, 'Dispatch', 'Quality release'),
      n('state', 0, 2, 'One plant state', 'Deterministic process model', { cs: 2, tone: 'accent' }),
      n('views', 2, 2, 'Connected views', '3D layout, flow schematic, asset register, alarms', { cs: 2, g: 'screen' }),
    ],
    edges: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'f'], ['f', 'g'], ['state', 'views']],
    note: 'Illustrative simulation with synthetic values. No real PLC or production plant is connected.',
  },
  'dooen-plant-process-model': {
    label: 'One process model behind three front ends: the Octave reference engine is ported to JavaScript for the web app, exported to an Isaac Sim scene, and joined by a local FastAPI server for Chronos-2 forecasts and a Qwen3-4B assistant. 1,956,878 values match the Octave reference.',
    cols: 4, rows: 3,
    nodes: [
      n('oct', 0, 0, 'Octave engine', 'Reference, 10 s step'),
      n('js', 1, 0, 'JavaScript port', 'Runs in the browser'),
      n('web', 2, 0, 'Web app', '14 campaigns, 67 recorded metrics', { cs: 2, tone: 'accent', g: 'screen' }),
      n('exp', 0, 1, 'Run exporter'),
      n('isaac', 1, 1, 'Isaac Sim 4.5', 'OpenUSD 3D playback', { g: 'cube' }),
      n('ai', 2, 1, 'Local FastAPI', 'Chronos-2 forecast and Qwen3-4B assistant, on the laptop', { cs: 2 }),
      n('v', 0, 2, '1,956,878', 'values match Octave within 1e-6', { cs: 2, big: true }),
      n('s', 2, 2, '15 x 2', 'process stations by trains', { cs: 2, big: true }),
    ],
    edges: [['oct', 'js'], ['js', 'web'], ['oct', 'exp'], ['exp', 'isaac'], ['ai', 'web']],
    note: 'Every figure is a study assumption from public sources, not a site record.',
  },
  'mazetrack-assessment-controller': {
    label: 'Board architecture: USB-C and a Li-ion cell feed an LTC4054 charger and LTC3536 buck-boost rail; four SS49E Hall sensors pass Sallen-Key filters to an MCP3204 ADC; maze contacts pass Schmitt inputs; all reach an ESP32-S3 that logs to microSD and drives feedback.',
    cols: 4, rows: 3,
    nodes: [
      n('usb', 0, 0, 'USB-C', '1S Li-ion cell', { g: 'battery' }),
      n('chg', 1, 0, 'LTC4054', 'Charger and power path'),
      n('buck', 2, 0, 'LTC3536', '3.3 V buck-boost, 1 A'),
      n('hall', 0, 1, '4 x SS49E', 'Hall sensors', { g: 'sensor' }),
      n('filt', 1, 1, 'Sallen-Key', 'Second-order filters'),
      n('adc', 2, 1, 'MCP3204', '12-bit ratiometric ADC'),
      n('maze', 0, 2, 'Maze contacts', 'Limited to 9 uA'),
      n('sch', 1, 2, 'Schmitt inputs', 'Pull-up and RC filter'),
      n('mcu', 3, 0, 'ESP32-S3', 'Six-axis IMU, microSD logging, haptic, audio and visual feedback', { rs: 3, tone: 'accent', g: 'chip' }),
    ],
    edges: [['usb', 'chg'], ['chg', 'buck'], ['buck', 'mcu'], ['hall', 'filt'], ['filt', 'adc'], ['adc', 'mcu'], ['maze', 'sch'], ['sch', 'mcu']],
    note: 'The 20-circuit LTspice set gives 66 pass, 93 information and 17 fail rows, including charger and contact-gap failures. Research hardware, not a medical device.',
  },
  'led-scoreboard-controller': {
    label: 'A 640 by 256 pixel canvas split into ten 128 by 128 regions, one per receiver. A CM4 sender streams frames over an isolated LAN to ten RP2350 receivers driving HUB75 panels; each frame is prepared, acknowledged and then committed, and the output blanks after one second without a commit.',
    cols: 4, rows: 2, top: 110, gapY: 14,
    extra: ledCanvas,
    nodes: [
      n('src', 0, 0, 'Source', 'Test pattern, RGB or HDMI'),
      n('cm4', 1, 0, 'CM4 sender', 'RGB888, isolated LAN'),
      n('rx', 2, 0, '10 receivers', 'RP2350, W5500 Ethernet', { g: 'chip' }),
      n('hub', 3, 0, 'HUB75 panels', 'PIO scanning', { tone: 'accent' }),
      n('p', 0, 1, 'Prepare', 'CRC-checked fragments'),
      n('a', 1, 1, 'Acknowledge', 'Frame complete'),
      n('c', 2, 1, 'Commit', 'Then display'),
      n('b', 3, 1, 'Blank', 'After 1 s without a commit', { tone: 'ghost' }),
    ],
    edges: [['src', 'cm4'], ['cm4', 'rx'], ['rx', 'hub'], ['p', 'a'], ['a', 'c'], ['c', 'b', { dash: true }]],
    note: 'A receiver never shows a partial frame. Expired and replayed frames are discarded.',
  },
  'ndcc-community-systems': {
    label: 'Club systems: the public website and committee tools share one content system, with PlayHQ fixtures and Resend email. Public WiFi was upgraded at Grinter Reserve, and a proposed outdoor pilot links the gateway to a wired root access point and a wireless remote access point.',
    cols: 3, rows: 3,
    nodes: [
      n('web', 0, 0, 'Public website', 'News, events, fixtures, sponsors', { g: 'screen' }),
      n('data', 1, 0, 'Shared content', 'Supabase, server-enforced permissions', { g: 'db' }),
      n('com', 2, 0, 'Committee tools', 'Orders, registrations, records', { g: 'user' }),
      n('playhq', 0, 1, 'PlayHQ', 'Fixture source', { tone: 'ghost' }),
      n('wifi', 1, 1, 'Public WiFi', 'Upgrade completed at Grinter Reserve', { tone: 'accent', g: 'wifi' }),
      n('resend', 2, 1, 'Resend', 'Application email', { tone: 'ghost' }),
      n('gw', 0, 2, 'Gateway', 'Existing internet'),
      n('root', 1, 2, 'Root access point', 'Wired, outdoor'),
      n('remote', 2, 2, 'Remote access point', 'Wireless backhaul, own local power'),
    ],
    edges: [['web', 'data'], ['com', 'data'], ['playhq', 'web'], ['resend', 'com'], ['gw', 'root'], ['root', 'remote', { dash: true }]],
    note: 'The bottom row is the proposed outdoor pilot. Locations and coverage need on-site validation.',
  },
}

export const indexFigures: Record<string, FigSpec> = {
  'Supervised Routine Companion Robot': chain('An adult defines a routine in the browser application, the robot guides the routine under supervision and the adult reviews it.', [['Define', 'Adult sets the routine in a browser app'], ['Guide', 'Robot runs it, supervised'], ['Review', 'Adult checks the session']]),
  'Inventory Scanning Mobile Robot': chain('The mobile robot assists physical inventory scanning, captures stock observations and passes them to a controlled review workflow.', [['Scan', 'Robot assists the operator'], ['Capture', 'Stock observations'], ['Review', 'Controlled workflow']]),
  'Modular Education and Testing Robot': chain('A modular robot platform used for education, engineering experiments and repeatable subsystem testing.', [['Modular platform', 'For supervised use'], ['Experiment', 'Education and engineering'], ['Repeat', 'Subsystem testing']]),
  'DuxTel Agricultural Equipment Telemetry': chain('Field telemetry: CAN capture, GPS and condition sensing on a custom PCB, over MikroTik connectivity to a Linux server for remote machinery visibility.', [['Sense', 'CAN, GPS, condition'], ['Custom PCB', 'Field unit'], ['MikroTik', 'Connectivity'], ['Linux server', 'Remote visibility']]),
  'Voltwyn: Local SLM System': {
    label: 'Local AI system: documents are ingested for retrieval and memory, an open-weight language model runs locally with controlled tools, and the results are evaluated on personally owned hardware.',
    cols: 3, rows: 2, h: 280,
    nodes: [
      n('doc', 0, 0, 'Documents', 'Ingestion', { g: 'doc' }),
      n('ret', 1, 0, 'Retrieval', 'And memory', { g: 'db' }),
      n('model', 2, 0, 'Language model', 'Open weights, run locally', { tone: 'accent' }),
      n('eval', 0, 1, 'Evaluation', 'On personally owned hardware', { cs: 2, g: 'check' }),
      n('tools', 2, 1, 'Controlled tools'),
    ],
    edges: [['doc', 'ret'], ['ret', 'model'], ['model', 'tools'], ['tools', 'eval']],
  },
  'Saj Service Desk': chain('Service records in order: request, job, quote, invoice and follow-up.', [['Request'], ['Job'], ['Quote'], ['Invoice'], ['Follow-up']]),
  'Regulated Smart Factory and SCADA Migration': chain('SCADA migration under GMP: the validated iFIX application is migrated to PVI+ and verified against the validated system.', [['iFIX', 'Validated system'], ['Migrate', 'Application content'], ['PVI+', 'New SCADA'], ['Verify', 'Against the validated system']]),
  'ADAS and CAN Validation': chain('Feature, breadboard and OTA regression tests produce CAN-level captures used as fault evidence.', [['Test', 'Feature, breadboard, OTA regression'], ['Capture', 'CAN-level data'], ['Evidence', 'Fault records']]),
  'ABMARC Emissions and Compliance Testing': chain('Calibrated instrumentation supports emissions tests against ADR and EURO standards, with QA records that make the result auditable.', [['Instrument', 'Calibrated'], ['Test', 'ADR and EURO emissions'], ['Record', 'QA records'], ['Audit', 'Repeatable result']]),
  'Carbon Revolution: Carbon-Fibre Wheel Manufacturing': chain('Operating production equipment, recording quality and traceability evidence, and supporting equipment trials, setup and first-level recovery.', [['Operate', 'Production equipment'], ['Record', 'Quality and traceability'], ['Support', 'Trials, setup, recovery']]),
  'IDL: Canning Line Upgrade and Commissioning': chain('Live production and changeovers, fault recovery, and commissioning checks around WestRock and Fibre-King packaging upgrades.', [['Run', 'Live production, changeovers'], ['Recover', 'Faults'], ['Commission', 'WestRock, Fibre-King checks']]),
  'Manufacturing and Quality Foundation': chain('Production experience from 2018 to 2024 across structural steel, carbon-fibre and beverage manufacturing.', [['Structural steel', 'Quality and traceability'], ['Carbon fibre', 'Wheel production'], ['Beverage', 'Operations, commissioning']], '2018 to 2024.'),
}

export const postFigures: Record<string, FigSpec> = {
  'the-second-life-of-a-product': chain('What a repairer has and what they still need: access needs a safe procedure, a part number needs compatibility information, and a replacement part needs setup and a way to check the result.', [['Access', 'Still needs a safe removal and reassembly procedure'], ['Part number', 'Still needs compatibility for the exact revision'], ['Replacement', 'Still needs setup and a way to check the result']]),
  'in-praise-of-the-volume-knob': chain('Three kinds of adjustment and the design question each raises.', [['Turn up or down', 'Can a small change be made and recognised?'], ['Choose a mode', 'Are the choices and the current mode both clear?'], ['Enter a value', 'Can it be reached without repeated fine movements?']]),
  'ai-without-the-jargon': chain('A four-step routine for using AI: ask, protect, check and decide.', [['Ask', 'Give it one clear task'], ['Protect', 'Share only what the task needs'], ['Check', 'Verify the important details'], ['Decide', 'Make the final choice yourself']]),
}

export const loopFigure: FigSpec = {
  label: 'A closed engineering loop. The physical system is measured by sensors and signal electronics, estimated and decided on in software, then acted on through drives and mechanisms, which changes the physical system again.',
  cols: 3, rows: 3, h: 430, gapX: 30,
  nodes: [
    n('elec', 0, 0, 'Signal electronics', 'PCB bring-up, CAN, UART, I2C, SPI', { grp: 'Sense', g: 'chip' }),
    n('sens', 0, 1, 'Sensors', 'LiDAR, IMU, Hall effect, vision', { grp: 'Sense', g: 'sensor' }),
    n('est', 1, 0, 'Estimate', 'SLAM, EKF sensor fusion, localisation', { grp: 'Think' }),
    n('dec', 1, 1, 'Decide', 'Nav2 planning, PID, PLC logic, ML models', { grp: 'Think' }),
    n('act', 2, 0, 'Actuate', 'Motors, drives, mechanisms and embedded firmware', { rs: 2, grp: 'Act', g: 'motor' }),
    n('world', 0, 2, 'The physical system', 'Robots, machines and production lines', { cs: 3, tone: 'ghost' }),
  ],
  edges: [['world', 'sens'], ['sens', 'elec'], ['elec', 'est'], ['est', 'dec'], ['dec', 'act'], ['act', 'world']],
}

export const learningFigure: FigSpec = {
  label: `Six-month learning pathway: ${learningMonths.map((m) => `month ${m.month}, ${m.title}`).join('; ')}.`,
  cols: 3, rows: 2, h: 380,
  nodes: learningMonths.map((m, index) => n(`m${index}`, index % 3, Math.floor(index / 3), m.title, m.build, { k: `Month ${m.month}`, ...(index === learningMonths.length - 1 ? { tone: 'accent' as const } : {}) })),
  edges: [['m0', 'm1'], ['m1', 'm2'], ['m3', 'm4'], ['m4', 'm5']],
}

export const phasesFigure: FigSpec = {
  label: `Three phases: ${phases.map((p) => `${p.title}, ${p.basis}`).join(' ')}`,
  cols: 3, rows: 1, h: 230,
  nodes: phases.map((p, index) => n(`p${index}`, index, 0, p.title, p.basis, { k: p.label, ...(index === 0 ? { tone: 'accent' as const } : {}) })),
  edges: [['p0', 'p1'], ['p1', 'p2']],
}
