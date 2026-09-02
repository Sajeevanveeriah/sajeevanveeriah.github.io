# Capability-Matrix

Status meanings:

- **Implemented:** working in the browser and desktop products with automated acceptance coverage
- **Contract:** portable engineering definition and adapter boundary are implemented; site runtime is supplied separately
- **Site engineering:** requires physical equipment, infrastructure, qualified personnel and acceptance evidence

| Capability | Community suite | Production adapter or service | Site engineering |
|---|---|---|---|
| Project hierarchy and asset model | Implemented | Optional master-data synchronisation | Asset survey and ownership |
| Tag database and I/O mapping | Implemented | OPC UA, Modbus, Profinet or vendor adapter | Address confirmation and loop checks |
| Deterministic reference process | Implemented | PLC or DCS runtime contract | Controller implementation and tuning |
| Production and CIP sequences | Implemented | ISA-88 or controller phase adapter | Process validation |
| Structured Text workspace | Implemented | PLCopen XML or vendor import/export adapter | Vendor compiler and runtime qualification |
| Ladder, FBD and SFC views | Implemented | Vendor project transformation | Controller-specific implementation |
| Operator HMI and process mimic | Implemented | SCADA runtime adapter | Operator review and site acceptance |
| Alarm lifecycle | Implemented | Durable alarm/event service | Rationalisation and response ownership |
| Historian trends and export | Implemented | Time-series database adapter | Retention and backup policy |
| OEE and downtime | Implemented | Production and downtime data adapter | Loss-code governance |
| Recipes and manufacturing orders | Implemented | MES or ERP adapter | Master-data ownership and release procedure |
| Batch records and genealogy | Implemented | Durable database and electronic-record service | Validation and reconciliation |
| Materials and movement | Implemented | WMS and mobile-equipment adapters | Warehouse and traffic risk controls |
| Work orders and calibration | Implemented | CMMS adapter | Maintenance strategy and calibration execution |
| Requirements and traceability | Implemented | Document-management integration | Approval and controlled records |
| Deviations and change control | Implemented | Quality-system adapter | Quality governance |
| OT zones and conduits | Implemented | Identity, PKI, firewall and monitoring services | Network design and verification |
| Roles and audit records | Implemented | Enterprise identity and immutable audit service | Account lifecycle and periodic review |
| Release and rollback | Implemented | Signed artefact registry and deployment service | Site release authorisation |
| Legacy migration register | Implemented | Import/export transformers | Source-system inventory and acceptance |
| Offline browser application | Implemented | Managed update channel | Device management |
| Windows desktop products | Implemented by CI | Code signing service | Endpoint allow-listing |
| macOS desktop products | Implemented by CI | Signing and notarisation | Endpoint management |
| Linux desktop products | Implemented by CI | Repository signing | Distribution policy |
| Functional safety | Explicitly excluded | Certified safety lifecycle and hardware | Hazard analysis, design and validation |
| Direct internet control | Explicitly excluded | Secure site edge and broker | Cybersecurity acceptance |
