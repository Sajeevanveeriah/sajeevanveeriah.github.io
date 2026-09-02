# Open-Industrial-Automation-Suite-Design

Date: 2026-09-02
Status: Implemented candidate

## Outcome

Replace the narrow three-page demonstration with a cohesive, public, vendor-neutral automation suite that is useful as an engineering reference, training environment, solution demonstrator and extensible open-source foundation.

## Source boundaries

The design uses:

- the existing public Open-Industrial-Automation implementation and repository constraints
- user-supplied high-level capability requirements for control, HMI/SCADA, MES, historian, batch, reporting, migration, validation and field integration
- public architecture concepts associated with IEC 61131-3, ISA-88, ISA-95/IEC 62264, alarm-management practice, OPC UA, MQTT Sparkplug, ISA/IEC 62443, NIST SP 800-82 and risk-based validation

It does not copy proprietary documentation, vendor code, confidential customer content or restricted standards text.

## Product boundary

The hosted product is a static browser engineering and simulation suite. It is not a live PLC/DCS runtime, safety controller, validated records platform or direct field-equipment gateway. Production connectivity must be implemented in a separate reviewed edge runtime.

## Information architecture

The suite contains 19 modules:

1. Overview
2. Operations
3. Alarm management
4. Historian and analytics
5. OEE and reporting
6. Control studio
7. HMI studio
8. Tags and I/O
9. Integration gateway
10. Migration workbench
11. Batch and MES
12. Materials and movement
13. Maintenance
14. Validation and quality
15. OT cybersecurity
16. Identity and records
17. Deployment centre
18. Documentation
19. System settings

## Visual system

- persistent industrial module rail
- high-density top command bar and command palette
- dark-first operational theme plus verified light theme
- limited cyan operational accent, amber warning and red fault semantics
- real process schematics, tables, trends, state ribbons and engineering workspaces
- no decorative imagery or fake business metrics
- 320 px to ultrawide reflow, controlled internal scrolling and 200 percent zoom-equivalent containment
- visible focus, reduced-motion support and no colour-only meaning

## Functional workflows

- start, progress, pause, stop, fault and reset deterministic production and CIP sequences
- acknowledge, shelve, unshelve and clear alarms
- edit and validate Structured Text and run a deterministic scan
- filter HMI screens, inspect bindings and preview operating states
- filter and export the tag database, simulate signal quality and test connection definitions
- inspect, test and replay versioned integration messages
- trend process values, append samples and export historian CSV
- calculate OEE transparently and classify downtime
- release and complete manufacturing orders and inspect batch genealogy
- advance material and AMR/AGV missions
- create and complete work orders and inspect calibration status
- execute tests, inspect traceability, deviations, change control and audit history
- assess OT security control completion, zones, conduits and risks
- review and sign demonstration electronic records with attributable audit entries
- compare environments, create release manifests and preserve rollback lineage
- import/export migration registers and portable workspaces

## Data model

`model.json` and `data.js` contain the deterministic reference project. The schema covers project identity, hierarchy, process state, assets, tags, protocols, interfaces, alarms, historian data, OEE, recipes, orders, batches, materials, maintenance, validation, cybersecurity, identities, records, deployment and migration.

## Acceptance criteria

- 19 modules render and remain navigable
- core workflows produce observable deterministic state changes and reset
- all required source and documentation assets export in the static build
- no public former-employer branding or proprietary material appears
- no page-level horizontal overflow at desktop, mobile or 200 percent zoom-equivalent layouts
- browser console, failed requests and HTTP responses remain clean
- selected high-risk modules have zero axe-core WCAG 2.2 AA violations
- light and dark states render correctly
- compatibility links route `/demo/` to Operations and `/studio/` to Control studio
- production deployment and live browser QA pass against the public URL
