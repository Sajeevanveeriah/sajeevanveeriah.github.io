# Open-Industrial-Automation-Desktop

This package builds sixteen desktop applications from one audited suite source:

- **OIA Suite** - Complete Open Industrial Automation command centre and lifecycle suite.
- **OIA Operations** - Operator HMI, process control, alarms, historian and OEE.
- **OIA Control** - IEC 61131-3-oriented control engineering, tags, I/O and deployment.
- **OIA HMI** - HMI and SCADA graphics, bindings, navigation, alarms and trends.
- **OIA Alarm Management** - Alarm rationalisation, lifecycle, acknowledgement, shelving and performance.
- **OIA Historian** - Time-series trends, event chronology, replay, exports and reporting context.
- **OIA OEE** - Availability, performance, quality, downtime and production reporting.
- **OIA Integration Hub** - Plant, MES, ERP, LIMS, historian, broker and edge contracts.
- **OIA MES** - Manufacturing orders, recipes, batches, materials, genealogy and OEE.
- **OIA Materials** - Material lots, warehouse movement, line supply and mobile-equipment tasks.
- **OIA Asset Care** - Asset criticality, health, maintenance work, calibration and condition context.
- **OIA Quality** - Requirements, testing, traceability, deviations, electronic records and release evidence.
- **OIA OT Security** - OT zones, conduits, risks, least privilege, recovery and assurance.
- **OIA Identity and Records** - Named roles, access controls, attributable records, signatures and audit trails.
- **OIA Deployment Centre** - Environment comparison, release packaging, configuration drift and rollback lineage.
- **OIA Migration Workbench** - Legacy screens, tags, scripts, bindings, navigation and controlled migration.

## Security defaults

- context isolation enabled
- Node.js integration disabled
- Chromium sandbox enabled
- all permission requests denied
- webviews blocked
- external navigation denied and HTTPS links opened in the system browser
- path traversal rejected by the custom protocol handler
- local application assets served with a restrictive Content Security Policy
- no telemetry, analytics, remote control endpoint or embedded credential

## Installer outputs

GitHub Actions builds:

- Windows x64: NSIS installer and portable executable
- macOS universal: DMG and ZIP
- Linux x64: AppImage and Debian package

Community installers are unsigned. Windows SmartScreen and macOS Gatekeeper may therefore request explicit user confirmation. Production distribution should add organisation-controlled code signing and Apple notarisation without changing the application source.

## Verification

```bash
npm install
npm test
OIA_PRODUCT=suite npm run build
```

Every product is generated from `product-catalog.json`; the build fails if identifiers, application IDs, routes or modules are missing or duplicated.
