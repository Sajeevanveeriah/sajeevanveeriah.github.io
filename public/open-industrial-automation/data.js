(function () {
  'use strict';

  const now = '2026-09-02T12:00:00+10:00';

  window.OIA_SEED = {
    meta: {
      schemaVersion: '2.1.0',
      projectId: 'OIA-REF-001',
      projectName: 'Reference Plant 01',
      site: 'Open Demonstration Site',
      timezone: 'Australia/Melbourne',
      unitSystem: 'SI',
      release: '2.1.0',
      generatedAt: now,
      licence: 'Apache-2.0',
      safetyBoundary: 'Simulation and engineering reference only. Certified safety functions remain independent.'
    },
    modules: [
      { id: 'overview', label: 'Overview', group: 'Operate', icon: 'grid', description: 'Plant status, work queue and lifecycle coverage' },
      { id: 'operations', label: 'Operations', group: 'Operate', icon: 'activity', description: 'Operator HMI, sequences, commands and events' },
      { id: 'control-studio', label: 'Control studio', group: 'Engineer', icon: 'logic', description: 'IEC 61131-3 oriented program workspace and scan simulation' },
      { id: 'hmi-studio', label: 'HMI studio', group: 'Engineer', icon: 'screen', description: 'Screen library, process graphics, bindings and navigation' },
      { id: 'tags-io', label: 'Tags and I/O', group: 'Engineer', icon: 'io', description: 'Tag database, I/O mapping, scaling and protocol adapters' },
      { id: 'integration', label: 'Integration gateway', group: 'Engineer', icon: 'link', description: 'ERP, MES, historian, broker and edge interface orchestration' },
      { id: 'alarms', label: 'Alarm management', group: 'Operate', icon: 'alarm', description: 'Alarm lifecycle, rationalisation, shelving and performance' },
      { id: 'historian', label: 'Historian and analytics', group: 'Operate', icon: 'trend', description: 'Time-series trends, events, replay and exports' },
      { id: 'performance', label: 'OEE and reporting', group: 'Operate', icon: 'gauge', description: 'Availability, performance, quality, downtime and production reporting' },
      { id: 'batch-mes', label: 'Batch and MES', group: 'Manufacture', icon: 'batch', description: 'Recipes, production orders, batches and genealogy' },
      { id: 'materials', label: 'Materials and movement', group: 'Manufacture', icon: 'materials', description: 'Material lots, warehouse movements, line supply and mobile equipment tasks' },
      { id: 'maintenance', label: 'Maintenance', group: 'Manufacture', icon: 'wrench', description: 'Asset health, work orders and calibration' },
      { id: 'validation', label: 'Validation and quality', group: 'Govern', icon: 'check', description: 'Requirements, tests, traceability, deviations and change control' },
      { id: 'cybersecurity', label: 'OT cybersecurity', group: 'Govern', icon: 'shield', description: 'Zones, conduits, controls and risk posture' },
      { id: 'identity', label: 'Identity and records', group: 'Govern', icon: 'user', description: 'Roles, named access, audit trails, electronic records and signatures' },
      { id: 'deployment', label: 'Deployment centre', group: 'Govern', icon: 'deploy', description: 'Environments, releases, package export and rollback' },
      { id: 'migration', label: 'Migration workbench', group: 'Engineer', icon: 'migrate', description: 'Legacy screen, tag, script and navigation inventory' },
      { id: 'documentation', label: 'Documentation', group: 'Govern', icon: 'docs', description: 'Architecture, capability matrix and operating guidance' },
      { id: 'settings', label: 'System settings', group: 'Govern', icon: 'settings', description: 'Workspace persistence, import, export and preferences' }
    ],
    hierarchy: [
      { level: 'Enterprise', id: 'ENT-001', name: 'Open Industrial Automation' },
      { level: 'Site', id: 'SITE-001', name: 'Open Demonstration Site' },
      { level: 'Area', id: 'AREA-PROCESS', name: 'Process Hall' },
      { level: 'Process cell', id: 'CELL-MIX-01', name: 'Mixing Cell 01' },
      { level: 'Unit', id: 'UNIT-MIX-01', name: 'Mixing Unit 01' },
      { level: 'Equipment module', id: 'EM-CIP-01', name: 'CIP Supply Module' },
      { level: 'Control module', id: 'CM-P101', name: 'Water Charge Pump' }
    ],
    process: {
      state: 'IDLE',
      displayState: 'IDLE',
      mode: 'None',
      phase: 'Ready',
      progress: 0,
      simulatedTimeS: 0,
      tankLevelPct: 34.2,
      temperatureC: 22.8,
      flowLMin: 0,
      conductivityMSCm: 0.6,
      agitatorRpm: 0,
      pressureKPa: 101.3,
      batchCount: 18,
      cipCount: 7,
      activeBatch: null,
      pausedFrom: null
    },
    sequence: [
      { id: 'PH-001', name: 'Charge water', state: 'CHARGE_WATER', target: '550 L', status: 'pending', durationS: 20 },
      { id: 'PH-002', name: 'Dose concentrate', state: 'DOSE_CONCENTRATE', target: '120 L', status: 'pending', durationS: 18 },
      { id: 'PH-003', name: 'Mix', state: 'MIX', target: '820 r/min', status: 'pending', durationS: 20 },
      { id: 'PH-004', name: 'Heat', state: 'HEAT', target: '68 degC', status: 'pending', durationS: 25 },
      { id: 'PH-005', name: 'Hold', state: 'HOLD', target: '180 s', status: 'pending', durationS: 18 },
      { id: 'PH-006', name: 'Transfer', state: 'TRANSFER', target: 'Packing line', status: 'pending', durationS: 20 }
    ],
    cipSequence: [
      { id: 'CIP-001', name: 'Pre-rinse', state: 'CIP_PRE_RINSE', target: '5 min', status: 'pending', durationS: 18 },
      { id: 'CIP-002', name: 'Caustic wash', state: 'CIP_CAUSTIC', target: '2.0 % at 72 degC', status: 'pending', durationS: 22 },
      { id: 'CIP-003', name: 'Intermediate rinse', state: 'CIP_INTERMEDIATE_RINSE', target: 'Conductivity below 8 mS/cm', status: 'pending', durationS: 18 },
      { id: 'CIP-004', name: 'Final rinse', state: 'CIP_FINAL_RINSE', target: 'Conductivity below 1.2 mS/cm', status: 'pending', durationS: 18 }
    ],
    assets: [
      { id: 'TK-101', name: 'Mix tank', type: 'Tank', area: 'AREA-PROCESS', criticality: 'A', state: 'Available', health: 94, capacity: '1,000 L', owner: 'Process' },
      { id: 'P-101', name: 'Water charge pump', type: 'Centrifugal pump', area: 'AREA-PROCESS', criticality: 'B', state: 'Available', health: 91, capacity: '150 L/min', owner: 'Utilities' },
      { id: 'P-102', name: 'Concentrate dosing pump', type: 'Positive displacement pump', area: 'AREA-PROCESS', criticality: 'A', state: 'Available', health: 88, capacity: '40 L/min', owner: 'Process' },
      { id: 'AG-101', name: 'Mix tank agitator', type: 'Agitator', area: 'AREA-PROCESS', criticality: 'A', state: 'Available', health: 86, capacity: '1,500 r/min', owner: 'Process' },
      { id: 'HX-101', name: 'Product heater', type: 'Plate heat exchanger', area: 'AREA-PROCESS', criticality: 'A', state: 'Available', health: 96, capacity: '95 degC', owner: 'Process' },
      { id: 'P-201', name: 'CIP circulation pump', type: 'Centrifugal pump', area: 'AREA-CIP', criticality: 'A', state: 'Available', health: 82, capacity: '180 L/min', owner: 'Hygiene' },
      { id: 'V-101', name: 'Water inlet valve', type: 'Pneumatic valve', area: 'AREA-PROCESS', criticality: 'B', state: 'Closed', health: 98, capacity: 'DN40', owner: 'Process' },
      { id: 'V-201', name: 'CIP return valve', type: 'Pneumatic valve', area: 'AREA-CIP', criticality: 'A', state: 'Closed', health: 92, capacity: 'DN50', owner: 'Hygiene' }
    ],
    tags: [
      { id: 'LT-101.PV', description: 'Mix tank level', asset: 'TK-101', type: 'REAL', direction: 'AI', unit: '%', range: '0 to 100', value: 34.2, quality: 'Good', scanMs: 250, source: 'OPC UA', address: 'ns=2;s=TK101.Level.PV', alarm: 'HH 92 / LL 8' },
      { id: 'TT-101.PV', description: 'Mix tank temperature', asset: 'TK-101', type: 'REAL', direction: 'AI', unit: 'degC', range: '0 to 100', value: 22.8, quality: 'Good', scanMs: 250, source: 'Modbus TCP', address: '40001', alarm: 'HH 82 / H 75' },
      { id: 'FT-101.PV', description: 'Water charge flow', asset: 'P-101', type: 'REAL', direction: 'AI', unit: 'L/min', range: '0 to 150', value: 0, quality: 'Good', scanMs: 250, source: 'OPC UA', address: 'ns=2;s=P101.Flow.PV', alarm: 'L 5' },
      { id: 'AIT-201.PV', description: 'CIP return conductivity', asset: 'P-201', type: 'REAL', direction: 'AI', unit: 'mS/cm', range: '0 to 100', value: 0.6, quality: 'Good', scanMs: 500, source: 'Modbus TCP', address: '40013', alarm: 'H 8' },
      { id: 'PT-101.PV', description: 'Tank head pressure', asset: 'TK-101', type: 'REAL', direction: 'AI', unit: 'kPa', range: '90 to 130', value: 101.3, quality: 'Good', scanMs: 500, source: 'OPC UA', address: 'ns=2;s=TK101.Pressure.PV', alarm: 'HH 122' },
      { id: 'AG-101.SPEED', description: 'Agitator speed command', asset: 'AG-101', type: 'REAL', direction: 'AO', unit: 'r/min', range: '0 to 1500', value: 0, quality: 'Good', scanMs: 250, source: 'Profinet', address: 'QW64', alarm: 'None' },
      { id: 'P-101.RUN', description: 'Water pump run feedback', asset: 'P-101', type: 'BOOL', direction: 'DI', unit: '-', range: '0 or 1', value: false, quality: 'Good', scanMs: 100, source: 'Profinet', address: 'I0.0', alarm: 'Fail to run' },
      { id: 'P-101.CMD', description: 'Water pump start command', asset: 'P-101', type: 'BOOL', direction: 'DO', unit: '-', range: '0 or 1', value: false, quality: 'Good', scanMs: 100, source: 'Profinet', address: 'Q0.0', alarm: 'None' },
      { id: 'V-101.OPEN_FB', description: 'Water valve open feedback', asset: 'V-101', type: 'BOOL', direction: 'DI', unit: '-', range: '0 or 1', value: false, quality: 'Good', scanMs: 100, source: 'Remote I/O', address: 'I1.2', alarm: 'Travel timeout' },
      { id: 'SYS.HEARTBEAT', description: 'Controller heartbeat', asset: 'PLC-001', type: 'UDINT', direction: 'INTERNAL', unit: 'count', range: '0 to 4294967295', value: 260902, quality: 'Good', scanMs: 1000, source: 'Runtime', address: 'DB1.DBD0', alarm: 'Stale 5 s' }
    ],
    protocols: [
      { id: 'CONN-OPCUA-01', name: 'Process OPC UA', protocol: 'OPC UA', endpoint: 'opc.tcp://edge-01:4840', mode: 'Read/write', security: 'Sign and encrypt', status: 'Reference adapter', latencyMs: 18 },
      { id: 'CONN-MQTT-01', name: 'Plant event broker', protocol: 'MQTT Sparkplug', endpoint: 'mqtts://broker.local:8883', mode: 'Publish/subscribe', security: 'TLS and client certificate', status: 'Reference adapter', latencyMs: 24 },
      { id: 'CONN-MBTCP-01', name: 'Utilities gateway', protocol: 'Modbus TCP', endpoint: '10.20.30.41:502', mode: 'Read/write', security: 'Zone-contained', status: 'Reference adapter', latencyMs: 12 },
      { id: 'CONN-PN-01', name: 'Cell controller network', protocol: 'Profinet', endpoint: 'CELL-MIX-01', mode: 'Cyclic I/O', security: 'Dedicated control zone', status: 'Engineering definition', latencyMs: 4 }
    ],
    alarms: [
      { id: 'ALM-TEMP-001', tag: 'TT-101.PV', message: 'Mix tank high temperature', priority: 'High', state: 'Normal', lifecycle: 'Rationalised', limit: '75 degC', delay: '5 s', consequence: 'Product quality risk', response: 'Stop heating and verify temperature loop', owner: 'Process', lastChange: now },
      { id: 'ALM-LEVEL-001', tag: 'LT-101.PV', message: 'Mix tank high-high level', priority: 'Critical', state: 'Normal', lifecycle: 'Rationalised', limit: '92 %', delay: '2 s', consequence: 'Overflow and contamination risk', response: 'Stop all incoming flow and isolate feeds', owner: 'Process', lastChange: now },
      { id: 'ALM-COMMS-001', tag: 'SYS.HEARTBEAT', message: 'Simulation communications fault', priority: 'High', state: 'Normal', lifecycle: 'Rationalised', limit: 'Stale 5 s', delay: '0 s', consequence: 'Loss of supervisory visibility', response: 'Place plant in safe local operating state and restore communication', owner: 'Automation', lastChange: now },
      { id: 'ALM-PUMP-001', tag: 'P-101.RUN', message: 'Water pump failed to run', priority: 'Medium', state: 'Normal', lifecycle: 'Rationalised', limit: 'Command without feedback', delay: '3 s', consequence: 'Batch sequence delay', response: 'Check permissives, overload and field isolation', owner: 'Maintenance', lastChange: now }
    ],
    alarmEvents: [
      { time: '11:52:04', alarm: 'ALM-PUMP-001', transition: 'Returned to normal', user: 'Runtime', comment: 'Feedback restored' },
      { time: '11:51:58', alarm: 'ALM-PUMP-001', transition: 'Acknowledged', user: 'System engineer', comment: 'Inspection in progress' },
      { time: '11:51:54', alarm: 'ALM-PUMP-001', transition: 'Active unacknowledged', user: 'Runtime', comment: 'Start feedback timeout' }
    ],
    recipes: [
      { id: 'RCP-PROD-001', name: 'Reference product', version: '3.2', state: 'Approved', yield: '640 L', phases: 6, parameters: 18, approvedBy: 'Quality engineer', updated: '2026-08-29' },
      { id: 'RCP-CIP-001', name: 'Reference CIP', version: '2.4', state: 'Approved', yield: 'N/A', phases: 4, parameters: 12, approvedBy: 'Hygiene lead', updated: '2026-08-21' },
      { id: 'RCP-PROD-002', name: 'Low-temperature product', version: '1.1', state: 'Draft', yield: '590 L', phases: 7, parameters: 22, approvedBy: '-', updated: '2026-09-01' }
    ],
    orders: [
      { id: 'MO-260902-01', product: 'Reference product', quantity: '4,800 L', plannedStart: '12:30', line: 'Mixing Cell 01', priority: 'High', status: 'Ready', recipe: 'RCP-PROD-001', materialLot: 'MAT-260901-A' },
      { id: 'MO-260902-02', product: 'Low-temperature product', quantity: '2,400 L', plannedStart: '17:00', line: 'Mixing Cell 01', priority: 'Normal', status: 'Held', recipe: 'RCP-PROD-002', materialLot: 'MAT-260901-B' },
      { id: 'MO-260903-01', product: 'Reference product', quantity: '6,400 L', plannedStart: '2026-09-03 07:00', line: 'Mixing Cell 01', priority: 'Normal', status: 'Planned', recipe: 'RCP-PROD-001', materialLot: 'MAT-260902-C' }
    ],
    batches: [
      { id: 'BATCH-260902-018', order: 'MO-260902-01', recipe: 'RCP-PROD-001 v3.2', unit: 'UNIT-MIX-01', started: '10:42', ended: '11:58', status: 'Complete', yield: '637 L', lot: 'FG-260902-018', review: 'Pending review' },
      { id: 'BATCH-260902-017', order: 'MO-260902-01', recipe: 'RCP-PROD-001 v3.2', unit: 'UNIT-MIX-01', started: '09:18', ended: '10:31', status: 'Complete', yield: '642 L', lot: 'FG-260902-017', review: 'Released' },
      { id: 'BATCH-260902-016', order: 'MO-260902-01', recipe: 'RCP-PROD-001 v3.2', unit: 'UNIT-MIX-01', started: '07:54', ended: '09:07', status: 'Complete', yield: '639 L', lot: 'FG-260902-016', review: 'Released' }
    ],
    genealogy: [
      { input: 'MAT-260901-A', material: 'Concentrate', quantity: '118.7 L', output: 'FG-260902-018', verification: 'Barcode matched' },
      { input: 'WTR-UTILITY-01', material: 'Process water', quantity: '521.4 L', output: 'FG-260902-018', verification: 'Meter totalised' },
      { input: 'CIP-260902-07', material: 'Pre-use clean status', quantity: 'Pass', output: 'FG-260902-018', verification: 'Conductivity release' }
    ],
    workOrders: [
      { id: 'WO-260902-014', asset: 'P-201', type: 'Corrective', title: 'Investigate elevated motor vibration', priority: 'High', status: 'Open', due: '2026-09-02 15:00', owner: 'Maintenance' },
      { id: 'WO-260902-012', asset: 'TT-101', type: 'Calibration', title: 'Quarterly temperature transmitter calibration', priority: 'Normal', status: 'Scheduled', due: '2026-09-05', owner: 'Instrumentation' },
      { id: 'WO-260901-008', asset: 'V-201', type: 'Preventive', title: 'Inspect valve seat and position feedback', priority: 'Normal', status: 'Complete', due: '2026-09-01', owner: 'Maintenance' }
    ],
    calibrations: [
      { instrument: 'LT-101', range: '0 to 1,000 L', last: '2026-06-12', next: '2026-12-12', standard: 'CAL-LEVEL-04', result: 'Pass' },
      { instrument: 'TT-101', range: '0 to 100 degC', last: '2026-06-05', next: '2026-09-05', standard: 'CAL-TEMP-02', result: 'Due soon' },
      { instrument: 'AIT-201', range: '0 to 100 mS/cm', last: '2026-08-17', next: '2027-02-17', standard: 'CAL-COND-01', result: 'Pass' }
    ],
    requirements: [
      { id: 'URS-001', statement: 'The system shall provide role-controlled operation of production and CIP sequences.', source: 'User requirement', risk: 'High', design: 'FDS-001', test: 'TEST-001', status: 'Verified' },
      { id: 'URS-002', statement: 'The system shall capture chronological alarms, events and operator actions.', source: 'User requirement', risk: 'High', design: 'FDS-004', test: 'TEST-002', status: 'Verified' },
      { id: 'URS-003', statement: 'The system shall maintain versioned master recipes and execution records.', source: 'User requirement', risk: 'High', design: 'FDS-007', test: 'TEST-003', status: 'Verified' },
      { id: 'URS-004', statement: 'The system shall provide equipment, signal and protocol configuration with export.', source: 'User requirement', risk: 'Medium', design: 'SDS-003', test: 'TEST-004', status: 'Verified' },
      { id: 'URS-005', statement: 'The system shall preserve traceability from requirement through verification evidence.', source: 'User requirement', risk: 'High', design: 'VMP-001', test: 'TEST-005', status: 'Verified' },
      { id: 'URS-006', statement: 'The system shall model OT zones, conduits, identities and security controls.', source: 'Security requirement', risk: 'High', design: 'SDS-SEC-001', test: 'TEST-006', status: 'Verified' },
      { id: 'URS-007', statement: 'The system shall support reversible import, export and seeded reset of the workspace.', source: 'Operational requirement', risk: 'Medium', design: 'SDS-009', test: 'TEST-007', status: 'Verified' },
      { id: 'URS-008', statement: 'The system shall expose a clear boundary between reference simulation and certified plant control.', source: 'Safety requirement', risk: 'Critical', design: 'FDS-SAF-001', test: 'TEST-008', status: 'Verified' }
    ],
    tests: [
      { id: 'TEST-001', title: 'Production command and role enforcement', type: 'FAT', requirement: 'URS-001', expected: 'Authorised role starts production; state changes to CHARGE WATER', status: 'Not executed', evidence: '-' },
      { id: 'TEST-002', title: 'Alarm activation and acknowledgement', type: 'FAT', requirement: 'URS-002', expected: 'Alarm transitions are time-stamped and attributable', status: 'Not executed', evidence: '-' },
      { id: 'TEST-003', title: 'Recipe and batch record integrity', type: 'OQ', requirement: 'URS-003', expected: 'Execution record references approved recipe version', status: 'Not executed', evidence: '-' },
      { id: 'TEST-004', title: 'Configuration export and re-import', type: 'FAT', requirement: 'URS-004', expected: 'Exported model re-imports without loss', status: 'Not executed', evidence: '-' },
      { id: 'TEST-005', title: 'Traceability matrix completeness', type: 'IQ/OQ', requirement: 'URS-005', expected: 'Every requirement has design and test coverage', status: 'Not executed', evidence: '-' },
      { id: 'TEST-006', title: 'Security posture assessment', type: 'Security', requirement: 'URS-006', expected: 'Assessment reports implemented and open controls', status: 'Not executed', evidence: '-' },
      { id: 'TEST-007', title: 'Workspace rollback', type: 'Recovery', requirement: 'URS-007', expected: 'Reset returns deterministic seed state', status: 'Not executed', evidence: '-' },
      { id: 'TEST-008', title: 'Safety boundary visibility', type: 'Safety', requirement: 'URS-008', expected: 'All operating surfaces state the non-certified boundary', status: 'Not executed', evidence: '-' }
    ],
    deviations: [
      { id: 'DEV-260901-03', title: 'CIP conductivity sample delayed', severity: 'Minor', batch: 'BATCH-260902-016', status: 'Under review', owner: 'Quality', opened: '2026-09-01' },
      { id: 'DEV-260828-01', title: 'Historian clock offset exceeded target', severity: 'Major', batch: '-', status: 'Closed', owner: 'Automation', opened: '2026-08-28' }
    ],
    changes: [
      { id: 'CC-260902-02', title: 'Add low-temperature recipe family', impact: 'Recipe and reporting', risk: 'Medium', status: 'Assessment', owner: 'Process engineering' },
      { id: 'CC-260829-01', title: 'Update water flow scaling', impact: 'PLC, HMI and historian', risk: 'High', status: 'Implemented', owner: 'Automation' }
    ],
    auditTrail: [
      { time: now, user: 'System engineer', action: 'Workspace opened', object: 'OIA-REF-001', reason: 'Engineering review', source: 'Local session' },
      { time: '2026-09-02T11:58:12+10:00', user: 'Quality engineer', action: 'Batch review started', object: 'BATCH-260902-018', reason: 'Routine review', source: 'MES module' },
      { time: '2026-09-02T11:54:09+10:00', user: 'Runtime', action: 'Batch completed', object: 'BATCH-260902-018', reason: 'Sequence complete', source: 'Control runtime' }
    ],
    zones: [
      { id: 'ZONE-ENT', name: 'Enterprise zone', level: '4', assets: 3, trust: 'Business managed', controls: ['SSO', 'EDR', 'Backup'], status: 'Managed' },
      { id: 'ZONE-DMZ', name: 'Industrial DMZ', level: '3.5', assets: 4, trust: 'Brokered', controls: ['Firewall', 'Jump host', 'Proxy'], status: 'Managed' },
      { id: 'ZONE-OPS', name: 'Operations zone', level: '3', assets: 6, trust: 'Restricted', controls: ['Allow-list', 'Patch window', 'Monitoring'], status: 'Managed' },
      { id: 'ZONE-CTRL', name: 'Cell control zone', level: '2', assets: 12, trust: 'Deterministic', controls: ['Segmentation', 'Engineering station control', 'Backups'], status: 'Review' },
      { id: 'ZONE-IO', name: 'Field I/O zone', level: '1', assets: 18, trust: 'Device constrained', controls: ['Physical access', 'Port control'], status: 'Review' }
    ],
    conduits: [
      { id: 'CON-ENT-DMZ', from: 'Enterprise zone', to: 'Industrial DMZ', services: 'HTTPS, SFTP', direction: 'Brokered', protectedBy: 'FW-ENT-01', status: 'Approved' },
      { id: 'CON-DMZ-OPS', from: 'Industrial DMZ', to: 'Operations zone', services: 'MQTTS, OPC UA proxy', direction: 'Restricted', protectedBy: 'FW-OT-01', status: 'Approved' },
      { id: 'CON-OPS-CTRL', from: 'Operations zone', to: 'Cell control zone', services: 'OPC UA, engineering', direction: 'Allow-listed', protectedBy: 'FW-CELL-01', status: 'Approved' }
    ],
    securityControls: [
      { id: 'SEC-001', domain: 'Asset inventory', control: 'Maintain current hardware, software and communication inventory', status: 'Implemented', evidence: 'Asset and connection registers' },
      { id: 'SEC-002', domain: 'Segmentation', control: 'Define OT zones and restricted conduits', status: 'Implemented', evidence: 'Zone and conduit model' },
      { id: 'SEC-003', domain: 'Identity', control: 'Use named identities and least privilege', status: 'Implemented', evidence: 'Role matrix' },
      { id: 'SEC-004', domain: 'Remote access', control: 'Broker and monitor remote engineering access', status: 'Partial', evidence: 'Reference jump-host workflow' },
      { id: 'SEC-005', domain: 'Backup', control: 'Test configuration backup and restoration', status: 'Implemented', evidence: 'Workspace export/reset test' },
      { id: 'SEC-006', domain: 'Monitoring', control: 'Record security-relevant events and changes', status: 'Implemented', evidence: 'Audit trail and event log' },
      { id: 'SEC-007', domain: 'Vulnerability management', control: 'Track advisories, exposure and risk treatment', status: 'Partial', evidence: 'Risk register only' },
      { id: 'SEC-008', domain: 'Incident response', control: 'Maintain OT-specific response and recovery procedures', status: 'Planned', evidence: 'Procedure template' }
    ],
    risks: [
      { id: 'RISK-OT-001', scenario: 'Unauthorised engineering change', likelihood: 2, consequence: 5, score: 10, treatment: 'Named access, review, audit trail and tested rollback', status: 'Treat' },
      { id: 'RISK-OT-002', scenario: 'Loss of supervisory network', likelihood: 3, consequence: 4, score: 12, treatment: 'Local control independence, buffered records and recovery runbook', status: 'Treat' },
      { id: 'RISK-OT-003', scenario: 'Historian data gap', likelihood: 3, consequence: 3, score: 9, treatment: 'Quality flags, gap detection and reconciliation', status: 'Monitor' }
    ],
    users: [
      { role: 'Viewer', operate: 'Read', engineer: 'None', recipes: 'Read', quality: 'Read', security: 'Read' },
      { role: 'Operator', operate: 'Execute', engineer: 'None', recipes: 'Execute approved', quality: 'Create comments', security: 'Read' },
      { role: 'Engineer', operate: 'Execute', engineer: 'Configure', recipes: 'Draft', quality: 'Execute tests', security: 'Assess' },
      { role: 'Quality', operate: 'Read', engineer: 'Review', recipes: 'Approve', quality: 'Approve and release', security: 'Review' },
      { role: 'Administrator', operate: 'Admin', engineer: 'Admin', recipes: 'Admin', quality: 'Admin', security: 'Admin' }
    ],
    environments: [
      { id: 'DEV', name: 'Development', version: '2.0.0-dev.14', config: 'CFG-2.0.0-14', status: 'Healthy', drift: 3, deployed: '2026-09-02 10:18' },
      { id: 'TEST', name: 'Test', version: '2.0.0-rc.2', config: 'CFG-2.0.0-12', status: 'Healthy', drift: 1, deployed: '2026-09-02 08:45' },
      { id: 'PROD', name: 'Reference production', version: '2.0.0', config: 'CFG-2.0.0', status: 'Healthy', drift: 0, deployed: '2026-09-02 12:00' }
    ],
    releases: [
      { id: 'REL-2.0.0', version: '2.0.0', environment: 'Reference production', commit: 'pending-runtime', manifest: 'MAN-2.0.0', status: 'Current', deployed: now, rollback: 'REL-1.0.0' },
      { id: 'REL-1.0.0', version: '1.0.0', environment: 'Archive', commit: '3a753e09', manifest: 'MAN-1.0.0', status: 'Rollback', deployed: '2026-09-02T12:08:00+10:00', rollback: '-' }
    ],
    migrationScreens: [
      { id: 'SCR-001', name: 'Plant overview', source: 'Legacy SCADA', target: 'Modern HMI', buttons: 18, bindings: 44, scripts: 2, navigation: 7, status: 'Verified', notes: 'Navigation and bindings reconciled' },
      { id: 'SCR-002', name: 'CIP overview', source: 'Legacy SCADA', target: 'Modern HMI', buttons: 11, bindings: 31, scripts: 1, navigation: 4, status: 'In review', notes: 'One hard-coded target remains' },
      { id: 'SCR-003', name: 'Alarm summary', source: 'Legacy SCADA', target: 'Modern HMI', buttons: 8, bindings: 22, scripts: 3, navigation: 5, status: 'Not started', notes: 'Inventory complete' },
      { id: 'SCR-004', name: 'Batch detail', source: 'Legacy SCADA', target: 'Modern HMI', buttons: 14, bindings: 38, scripts: 4, navigation: 6, status: 'In progress', notes: 'Dynamic recipe panel under test' }
    ],
    hmiScreens: [
      { id: 'HMI-001', name: 'Plant overview', type: 'Overview', route: '/operations/overview', bindings: 44, navigation: 7, status: 'Published', description: 'Primary operator process overview' },
      { id: 'HMI-002', name: 'CIP overview', type: 'Process', route: '/operations/cip', bindings: 31, navigation: 4, status: 'Published', description: 'CIP supply and return operation' },
      { id: 'HMI-003', name: 'Batch detail', type: 'Detail', route: '/operations/batch', bindings: 38, navigation: 6, status: 'Draft', description: 'Active recipe phase and parameter detail' },
      { id: 'HMI-004', name: 'Alarm summary', type: 'Utility', route: '/operations/alarms', bindings: 22, navigation: 5, status: 'Published', description: 'Prioritised active alarm display' }
    ],
    hmiBindings: [
      { element: 'Tank level value', property: 'textContent', tag: 'LT-101.PV', expression: 'value.toFixed(1) + " %"', quality: 'Good' },
      { element: 'Tank fill', property: 'height', tag: 'LT-101.PV', expression: 'clamp(value, 0, 100)', quality: 'Good' },
      { element: 'Temperature value', property: 'textContent', tag: 'TT-101.PV', expression: 'value.toFixed(1) + " degC"', quality: 'Good' },
      { element: 'Water pump', property: 'state', tag: 'P-101.RUN', expression: 'value ? "running" : "stopped"', quality: 'Good' },
      { element: 'Alarm banner', property: 'visibility', tag: 'SYS.ALARM_COUNT', expression: 'value > 0', quality: 'Good' }
    ],
    controlProgram: {
      language: 'ST',
      name: 'PRG_MixingUnit',
      version: '1.4.0',
      code: "PROGRAM PRG_MixingUnit\nVAR\n  StartProduction : BOOL;\n  StopRequest : BOOL;\n  TankLevelPct : REAL;\n  PumpCommand : BOOL;\nEND_VAR\n\nIF StopRequest THEN\n  PumpCommand := FALSE;\nELSIF StartProduction AND TankLevelPct < 85.0 THEN\n  PumpCommand := TRUE;\nELSE\n  PumpCommand := FALSE;\nEND_IF;\nEND_PROGRAM",
      diagnostics: [],
      lastValidation: 'Not validated',
      scans: 0
    },

    oee: {
      period: 'Current shift',
      availabilityPct: 92.4,
      performancePct: 88.7,
      qualityPct: 99.1,
      oeePct: 81.2,
      plannedMinutes: 480,
      runMinutes: 443.5,
      idealCycleS: 72,
      totalCount: 381,
      goodCount: 378,
      targetPct: 85,
      lastCalculated: now
    },
    downtimeReasons: [
      { id: 'DT-001', reason: 'Planned changeover', category: 'Planned', durationMin: 18.0, count: 1, owner: 'Production' },
      { id: 'DT-002', reason: 'CIP verification hold', category: 'Quality', durationMin: 9.5, count: 1, owner: 'Quality' },
      { id: 'DT-003', reason: 'Water pump feedback delay', category: 'Equipment', durationMin: 6.0, count: 2, owner: 'Maintenance' },
      { id: 'DT-004', reason: 'Material staging wait', category: 'Supply', durationMin: 3.0, count: 1, owner: 'Warehouse' }
    ],
    reports: [
      { id: 'RPT-SHIFT-001', name: 'Shift production report', scope: 'Output, downtime, OEE and exceptions', cadence: 'Per shift', status: 'Ready' },
      { id: 'RPT-BATCH-001', name: 'Batch review report', scope: 'Recipe, materials, phases, alarms and signatures', cadence: 'Per batch', status: 'Ready' },
      { id: 'RPT-UTILITY-001', name: 'Utilities consumption report', scope: 'Water, energy and CIP use', cadence: 'Daily', status: 'Scheduled' },
      { id: 'RPT-ALARM-001', name: 'Alarm performance report', scope: 'Standing, frequent, flood and response indicators', cadence: 'Weekly', status: 'Ready' }
    ],
    materials: [
      { id: 'MAT-260901-A', name: 'Reference concentrate', type: 'Raw material', quantity: '1,240 L', location: 'RM-TK-04', status: 'Released', expiry: '2026-09-18', supplierLot: 'SUP-A7814' },
      { id: 'WTR-UTILITY-01', name: 'Process water', type: 'Utility', quantity: 'Available', location: 'UTILITY-RING-01', status: 'Released', expiry: '-', supplierLot: 'SITE-WATER' },
      { id: 'PKG-260831-B', name: 'Primary packaging', type: 'Packaging', quantity: '8,400 units', location: 'WH-A-17', status: 'Released', expiry: '-', supplierLot: 'PKG-B2041' },
      { id: 'MAT-260901-B', name: 'Low-temperature concentrate', type: 'Raw material', quantity: '620 L', location: 'QUAR-02', status: 'Held', expiry: '2026-09-12', supplierLot: 'SUP-B2920' }
    ],
    materialMovements: [
      { id: 'MOVE-260902-021', material: 'MAT-260901-A', from: 'RM-TK-04', to: 'CELL-MIX-01', quantity: '118.7 L', method: 'Fixed transfer', status: 'Complete', verification: 'Meter totalised' },
      { id: 'MOVE-260902-022', material: 'PKG-260831-B', from: 'WH-A-17', to: 'PACK-01', quantity: '1,200 units', method: 'AMR-02', status: 'In transit', verification: 'Barcode confirmed' },
      { id: 'MOVE-260902-023', material: 'CIP-CHEM-01', from: 'CHEM-STORE', to: 'CIP-SKID-01', quantity: '80 L', method: 'Operator transfer', status: 'Ready', verification: 'Permit required' }
    ],
    mobileTasks: [
      { id: 'MMS-260902-07', vehicle: 'AMR-02', mission: 'Deliver packaging to PACK-01', source: 'WH-A-17', destination: 'PACK-01', priority: 'High', state: 'Executing', progress: 64 },
      { id: 'MMS-260902-08', vehicle: 'AMR-01', mission: 'Return empty pallet', source: 'PACK-01', destination: 'WH-RETURN', priority: 'Normal', state: 'Queued', progress: 0 },
      { id: 'MMS-260902-09', vehicle: 'AGV-01', mission: 'Stage raw material tote', source: 'RM-DOCK', destination: 'STAGE-MIX-01', priority: 'Normal', state: 'Ready', progress: 0 }
    ],
    interfaces: [
      { id: 'INT-ERP-MES-01', name: 'ERP production orders', source: 'ERP', target: 'MES', transport: 'REST/JSON', contract: 'ProductionOrder v2', direction: 'Inbound', state: 'Healthy', queued: 0, lastMessage: '12:03:18' },
      { id: 'INT-MES-ERP-01', name: 'Production confirmations', source: 'MES', target: 'ERP', transport: 'REST/JSON', contract: 'ProductionConfirmation v2', direction: 'Outbound', state: 'Healthy', queued: 1, lastMessage: '11:58:30' },
      { id: 'INT-CTRL-HIS-01', name: 'Process telemetry', source: 'Control', target: 'Historian', transport: 'OPC UA', contract: 'Tag sample', direction: 'Outbound', state: 'Healthy', queued: 0, lastMessage: '12:04:01' },
      { id: 'INT-EVENT-01', name: 'Plant event stream', source: 'Edge', target: 'Broker', transport: 'MQTT Sparkplug', contract: 'BIRTH/DATA/DEATH', direction: 'Bidirectional', state: 'Healthy', queued: 0, lastMessage: '12:04:01' },
      { id: 'INT-LIMS-01', name: 'Quality results', source: 'LIMS', target: 'MES', transport: 'SFTP/CSV', contract: 'QualityResult v1', direction: 'Inbound', state: 'Review', queued: 2, lastMessage: '11:42:09' }
    ],
    interfaceMessages: [
      { id: 'MSG-260902-1841', interface: 'INT-MES-ERP-01', correlation: 'CORR-BATCH-018', object: 'BATCH-260902-018', received: '11:58:30', status: 'Acknowledged', attempts: 1 },
      { id: 'MSG-260902-1842', interface: 'INT-LIMS-01', correlation: 'CORR-QC-018', object: 'QC-BATCH-018', received: '11:42:09', status: 'Validation error', attempts: 2 },
      { id: 'MSG-260902-1843', interface: 'INT-ERP-MES-01', correlation: 'CORR-MO-0201', object: 'MO-260902-01', received: '10:01:22', status: 'Processed', attempts: 1 }
    ],
    electronicRecords: [
      { id: 'REC-BATCH-018', type: 'Batch execution record', object: 'BATCH-260902-018', version: '1', state: 'Pending review', checksum: 'SHA256-7B42A1', retention: '7 years', signatures: 0 },
      { id: 'REC-CC-260829', type: 'Change-control record', object: 'CC-260829-01', version: '3', state: 'Effective', checksum: 'SHA256-1F37C9', retention: 'Permanent', signatures: 2 },
      { id: 'REC-CAL-TT101', type: 'Calibration record', object: 'TT-101', version: '2', state: 'Approved', checksum: 'SHA256-9D113E', retention: 'Asset life plus 2 years', signatures: 1 }
    ],
    signatures: [
      { id: 'SIG-260829-01', record: 'REC-CC-260829', user: 'Automation engineer', meaning: 'Implemented', time: '2026-08-29T16:22:04+10:00' },
      { id: 'SIG-260829-02', record: 'REC-CC-260829', user: 'Quality engineer', meaning: 'Approved', time: '2026-08-29T16:41:18+10:00' },
      { id: 'SIG-260605-01', record: 'REC-CAL-TT101', user: 'Instrumentation technician', meaning: 'Performed', time: '2026-06-05T14:10:32+10:00' }
    ],
    notifications: [
      { id: 'NOT-001', type: 'warning', title: 'Calibration due soon', detail: 'TT-101 is due on 5 September 2026.', unread: true },
      { id: 'NOT-002', type: 'info', title: 'Batch review pending', detail: 'BATCH-260902-018 is ready for quality review.', unread: true }
    ],
    events: [
      { time: '12:00:00', source: 'Runtime', event: 'Reference workspace initialised', category: 'System', user: 'System' },
      { time: '11:58:12', source: 'Batch', event: 'Batch BATCH-260902-018 completed', category: 'Production', user: 'Runtime' },
      { time: '11:54:09', source: 'Control', event: 'Transfer phase completed', category: 'Sequence', user: 'Runtime' },
      { time: '11:51:58', source: 'Alarm', event: 'ALM-PUMP-001 acknowledged', category: 'Alarm', user: 'System engineer' }
    ],
    trend: Array.from({ length: 60 }, function (_, index) {
      const t = index;
      return {
        t: t,
        level: Number((28 + Math.min(t, 28) * 1.45 + Math.sin(t / 4) * 1.2).toFixed(2)),
        temperature: Number((22 + Math.max(0, t - 22) * 0.75 + Math.sin(t / 5) * 0.6).toFixed(2)),
        flow: Number((t < 28 ? 78 + Math.sin(t / 2) * 6 : Math.max(0, 72 - (t - 28) * 5)).toFixed(2)),
        conductivity: Number((0.6 + Math.sin(t / 7) * 0.08).toFixed(2))
      };
    })
  };
})();
