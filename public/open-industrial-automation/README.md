# Open-Industrial-Automation-Suite

Open-Industrial-Automation is a vendor-neutral, Apache-2.0 browser reference suite for industrial automation engineering, operations, manufacturing information, validation and OT governance.

The hosted edition runs locally in the browser, stores demonstration state in local storage, works offline after first load, and exports portable JSON and CSV records. It does not connect to live plant equipment and it does not replace a PLC, DCS, safety system, qualified historian, enterprise identity service or validated records platform.

## What is included

| Domain | Built-in capability |
|---|---|
| Operations | Deterministic mixing, dosing and CIP reference process, operator commands, sequence execution, live values, trends and event context |
| Control engineering | IEC 61131-3-oriented Structured Text editor, ladder, function-block and sequential-chart views, validation and one-scan simulation |
| HMI and SCADA | Screen inventory, process graphics, bindings, navigation, idle/running/fault previews and portable HMI metadata export |
| Tags and I/O | Asset hierarchy, tag database, data types, direction, engineering units, scaling, quality, scan rates, addresses and alarm metadata |
| Integration gateway | Explicit ERP, MES, LIMS, historian and edge contracts with correlation IDs, queue visibility, endpoint tests and controlled replay |
| Alarm management | Priority, state, acknowledgement, shelving, clearing, rationalisation, consequences, operator response and chronological events |
| Historian and analytics | Multi-series deterministic trends, quality summary, event sequence, sample append and CSV export |
| OEE and reporting | Transparent availability, performance, quality and OEE calculations, downtime classification and report catalogue |
| Batch and MES | Versioned recipes, production orders, release and completion, batch records, material genealogy and quality-review state |
| Materials and movement | Material lots, release and quarantine state, warehouse locations, traceable movements and vendor-neutral AMR/AGV missions |
| Maintenance | Asset criticality and health, work orders, completion workflow and calibration register |
| Validation and quality | User requirements, functional-design links, executable tests, traceability, deviations, change control and audit records |
| OT cybersecurity | Zones, conduits, least-privilege controls, OT risk register, posture assessment, backup and recovery evidence |
| Identity and records | Role matrix, checksummed electronic-record metadata, attributable review signatures and audit package export |
| Deployment | Environment comparison, configuration drift, release pipeline, manifest generation, package export and rollback lineage |
| Migration | Legacy screen, button, binding, script and navigation inventory with CSV import/export and controlled progression |
| Documentation | Architecture, capability classification, public standards targets, deployment path, safety boundary and contribution guidance |
| Workspace management | Local persistence, schema validation, import, export, dark/light themes, density controls and deterministic reset |
| Offline application | Installable web manifest and service-worker cache when served over HTTPS |

## Reference architecture

```text
Enterprise and business systems
        |
        | versioned information contracts
        v
MES, batch, materials, quality, OEE, maintenance and historian
        |
        | role-checked supervisory interfaces
        v
SCADA, HMI, alarms, trends and operator workflows
        |
        | bounded protocol adapters
        v
PLC/DCS, remote I/O, drives, instruments and edge runtimes
        |
        v
Physical process and equipment

Independent boundary: safety-related controls, emergency stops,
guards, hazardous-energy isolation and qualified protective systems.
```

`model.json` is the portable project-model snapshot. `data.js` is the browser seed that supplies the same model. The complete local workspace export also includes changed runtime state and accumulated audit records.

## Run locally

Use any static HTTP server. Examples:

```bash
python -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080/open-industrial-automation/
```

For a production build in the containing portfolio repository:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run qa:oia
```

## Core workflow

1. Define the site hierarchy, assets, tags, connections, alarms, recipes, requirements and roles.
2. Engineer control intent, HMI screens, bindings, navigation and interface contracts.
3. Verify the model, program, process sequences, alarm lifecycle, records and responsive UI.
4. Operate the deterministic reference plant and inspect events, trends, batches, materials and maintenance work.
5. Export evidence, compare environments, build a release manifest and preserve an explicit rollback point.
6. Extend through a separate, reviewed edge runtime for any real industrial connectivity.

## Production extension boundary

A real deployment requires additional independently engineered services and site acceptance:

- deterministic PLC or DCS runtime and qualified controller hardware
- independently engineered safety system and physical protective functions
- protocol adapters with certificate trust, command allow-lists, payload validation and fail-safe behaviour
- durable historian and manufacturing database with backup, restoration, retention and reconciliation
- enterprise identity, named accounts, least privilege, session controls and independent audit storage
- configuration versioning, review, signed release packages and tested rollback
- site-specific hazard analysis, cybersecurity risk assessment and network segmentation
- electrical, instrumentation, control-panel, field-device and communications design
- FAT, SAT, commissioning, qualification, operator training and handover
- validated procedures and records controls where regulated use applies

The hosted reference must not be used to directly control equipment.

## Standards and public architecture targets

The implementation uses public high-level concepts from IEC 61131-3, ISA-88, ISA-95/IEC 62264, alarm-management practice, OPC UA, MQTT Sparkplug, ISA/IEC 62443, NIST SP 800-82 and risk-based validation principles. It does not reproduce restricted standards text, and it makes no certification or compliance claim.

Official public starting points are linked inside the Documentation module.

## Source integrity

This suite is an independent open implementation. It does not include proprietary vendor code, confidential customer material or copied private documentation. Capability selection is based on public industrial architecture patterns and the project requirements supplied for this build.

## Repository layout

```text
open-industrial-automation/
  index.html                 Application shell
  styles.css                 Design system and responsive layout
  data.js                    Deterministic seed project
  app.js                     Application state, workflows and rendering
  model.json                 Portable project-model snapshot
  manifest.webmanifest       Installable application metadata
  sw.js                      Offline cache
  schemas/                   Portable JSON schema
  examples/                  Example site and migration inputs
  docs/                      Architecture, deployment, safety and contribution guides
  LICENSE                    Apache License 2.0
  SECURITY.md                Security reporting and production boundary
  CONTRIBUTING.md            Contribution and verification gate
```

## Licence

Apache License 2.0. See `LICENSE`.
