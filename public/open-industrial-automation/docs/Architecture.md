# Architecture

## Design intent

Open-Industrial-Automation separates portable engineering intent from runtime-specific infrastructure. The portable model contains stable identities and definitions for assets, signals, alarms, recipes, orders, requirements, tests, interfaces, records and releases. The browser provides a deterministic working reference. Production services are attached behind explicit contracts.

## Layers

| Layer | Responsibility | Hosted implementation | Production extension |
|---|---|---|---|
| Enterprise | ERP, supply chain, finance, LIMS and business analytics | Interface contracts and reference messages | Authenticated enterprise integrations |
| Manufacturing operations | MES, batch, materials, quality, OEE, maintenance and reporting | Executable browser workflows and portable records | Durable services, queues, databases and retention |
| Supervisory control | HMI/SCADA, alarms, events, trends and operator workflows | Deterministic local operator workspace | Redundant servers, historian and approved command gateway |
| Control | PLC/DCS programs, sequences, permissives and I/O | Reference editor and scan simulation | Qualified controller runtime and engineering toolchain |
| Field | Instruments, drives, valves, motors and remote I/O | Asset and tag definitions | Site hardware, networks and commissioning |
| Safety | Safety PLC/SIS, emergency stops, guards and protective functions | Boundary documentation only | Independent engineered and validated safety solution |

## Data contracts

All cross-layer transactions require stable identifiers, versioned schemas, correlation IDs, explicit acknowledgement, visible failure state, controlled replay and reconciliation. Retrieval does not imply semantic acceptance. No failed or ambiguous transaction may be silently dropped.

## Determinism

The hosted process model uses deterministic local state transitions. It is designed for training, engineering review, user-interface validation and test automation. Browser timing is not a deterministic control runtime.

## Portability

- `model.json` is the machine-readable snapshot.
- workspace export includes changed local state and audit events.
- CSV exports provide tag, alarm, historian and migration exchange surfaces.
- release manifests capture project, version, contents, tests and safety boundaries.
