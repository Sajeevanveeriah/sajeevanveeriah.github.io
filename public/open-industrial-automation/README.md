# Open-Industrial-Automation-Suite

Open-Industrial-Automation is an Apache-2.0, vendor-neutral product family for industrial automation engineering, operations, HMI and SCADA, manufacturing execution, historian analysis, asset care, validation, integration and OT governance.

The public edition is local-first. It runs in the browser, works offline after the first load, exports portable JSON and CSV records, and is packaged as separate Windows, macOS and Linux desktop products. All products use one project-model contract and one shared workspace.

## Product family

| Product | Primary responsibility | Starting workspace |
|---|---|---|
| OIA Suite | Complete Open Industrial Automation command centre and lifecycle suite. | Overview |
| OIA Operations | Operator HMI, process control, alarms, historian and OEE. | Operations |
| OIA Control | IEC 61131-3-oriented control engineering, tags, I/O and deployment. | Control studio |
| OIA HMI | HMI and SCADA graphics, bindings, navigation, alarms and trends. | HMI studio |
| OIA Alarm Management | Alarm rationalisation, lifecycle, acknowledgement, shelving and performance. | Alarm management |
| OIA Historian | Time-series trends, event chronology, replay, exports and reporting context. | Historian and analytics |
| OIA OEE | Availability, performance, quality, downtime and production reporting. | OEE and reporting |
| OIA Integration Hub | Plant, MES, ERP, LIMS, historian, broker and edge contracts. | Integration gateway |
| OIA MES | Manufacturing orders, recipes, batches, materials, genealogy and OEE. | Batch and MES |
| OIA Materials | Material lots, warehouse movement, line supply and mobile-equipment tasks. | Materials and movement |
| OIA Asset Care | Asset criticality, health, maintenance work, calibration and condition context. | Maintenance |
| OIA Quality | Requirements, testing, traceability, deviations, electronic records and release evidence. | Validation and quality |
| OIA OT Security | OT zones, conduits, risks, least privilege, recovery and assurance. | OT cybersecurity |
| OIA Identity and Records | Named roles, access controls, attributable records, signatures and audit trails. | Identity and records |
| OIA Deployment Centre | Environment comparison, release packaging, configuration drift and rollback lineage. | Deployment centre |
| OIA Migration Workbench | Legacy screens, tags, scripts, bindings, navigation and controlled migration. | Migration workbench |

Focused products hide unrelated modules while retaining the same local project model and audit history. A change made in one product is visible from the other products.

## Complete module coverage

| Domain | Built-in capability |
|---|---|
| Operations | Deterministic mixing, dosing and CIP reference process, commands, progression, pause, stop, fault and reset |
| Control engineering | Structured Text editor, ladder, function-block and sequential-chart views, validation and one-scan simulation |
| HMI and SCADA | Screen inventory, process graphics, bindings, navigation and operating-state previews |
| Tags and I/O | Asset hierarchy, tag database, scaling, engineering units, quality, scan rates, addresses and alarms |
| Integration gateway | Versioned ERP, MES, LIMS, historian, broker and edge contracts with correlation, testing and replay |
| Alarm management | Priority, state, acknowledgement, shelving, clearing, rationalisation, consequences and response |
| Historian and analytics | Multi-series deterministic trends, quality context, event sequence, replay and CSV export |
| OEE and reporting | Transparent availability, performance, quality and OEE calculation with downtime classification |
| Batch and MES | Versioned recipes, production orders, batch records, genealogy and quality-review state |
| Materials and movement | Material lots, release and quarantine, warehouse movement and AMR or AGV mission state |
| Maintenance | Criticality, health, work orders, completion workflow and calibration register |
| Validation and quality | Requirements, functional links, executable tests, traceability, deviations and change control |
| OT cybersecurity | Zones, conduits, least privilege, control register, risk posture, backup and recovery evidence |
| Identity and records | Role matrix, attributable audit trail, checksummed records and review signatures |
| Deployment | Environment comparison, drift, release manifests, package export and rollback lineage |
| Migration | Legacy screens, buttons, bindings, scripts and navigation inventory with CSV exchange |
| Documentation | Architecture, capability classification, deployment, safety and contribution guidance |
| Workspace | Import, export, persistence, reset, light and dark themes and compact density |
| Offline operation | PWA manifest, product shortcuts and service-worker cache |

## Reference process

The deterministic process automatically advances through:

```text
Production:
CHARGE_WATER -> DOSE_CONCENTRATE -> MIX -> HEAT -> HOLD -> TRANSFER -> IDLE

Clean-in-place:
CIP_PRE_RINSE -> CIP_CAUSTIC -> CIP_INTERMEDIATE_RINSE -> CIP_FINAL_RINSE -> IDLE
```

The default reference speed is 5x. It can be changed to 1x, 2x, 5x, 10x or 20x. Sequence progress, process values, events, batch count and audit records update through the same shared workspace used by every product.

## Visual system

The suite uses the approved Dub-inspired light product system:

- pure white canvas
- #f5f5f5 paper surfaces
- 1 px #e5e5e5 structure
- #171717 primary text
- #2563eb active accent
- #000000 primary actions
- compact spacing
- 6 px inputs, 8 px buttons, 12 px cards and pill badges
- medium-weight editorial headings
- product-first UI with no stock imagery or heavy decorative effects

## Browser use

Open:

```text
https://sajeevanveeriah.github.io/open-industrial-automation/
```

Focused browser entry points are under:

```text
/open-industrial-automation/products/
```

No account or installation is required. Project state stays in the current browser unless exported.

## Desktop installers

The release workflow builds every product for:

- Windows x64: NSIS installer and portable executable
- macOS universal: DMG and ZIP
- Linux x64: AppImage and Debian package

All desktop products use a secure `oia://app` protocol, Chromium sandboxing, context isolation, disabled Node.js integration, denied permission requests and one shared OIA user-data directory.

Community builds are unsigned. Production distribution should add organisation-controlled Windows signing and Apple notarisation.

## Repository verification

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run qa:oia
node scripts/qa-oia-products.mjs
node desktop/verify.cjs
```

GitHub Actions additionally builds the desktop installers on native hosted runners and generates SHA-256 manifests.

## Production integration boundary

The suite is production-oriented software, but it does not pretend that a browser or desktop shell is a certified controller. A real plant deployment also requires:

- deterministic PLC or DCS runtime and qualified controller hardware
- independently engineered safety system and physical protective functions
- reviewed protocol adapters with trust, allow-lists, validation and fail-safe behaviour
- durable historian and manufacturing database with backup and reconciliation
- enterprise identity, named accounts and independently retained audit data
- site-specific network segmentation and cybersecurity assessment
- electrical, instrumentation, panel and field engineering
- FAT, SAT, commissioning, qualification, operator training and handover
- validated procedures and records controls where regulated use applies

The public suite therefore exposes simulation and engineering workflows, not an unauthenticated internet control endpoint.

## Source integrity

This is an independent open implementation. It contains no proprietary vendor code, confidential customer content or copied private documentation. Public industrial architecture concepts are mapped without reproducing restricted standards text or making certification claims.

## Licence

Apache License 2.0. See `LICENSE`.
