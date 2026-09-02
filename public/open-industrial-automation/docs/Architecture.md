# Architecture

## Product topology

```text
OIA Suite
  |
  +-- OIA Operations
  +-- OIA Control
  +-- OIA HMI
  +-- OIA MES
  +-- OIA Asset Care
  +-- OIA Quality
  +-- OIA OT Security
  +-- OIA Integration Hub
          |
          v
Shared portable automation project model
          |
          v
Shared local workspace and audit history
```

The focused products are not disconnected copies. They are product-scoped views of one audited runtime and data contract.

## Industrial topology

```text
Enterprise systems
ERP / LIMS / QMS / WMS / CMMS
            |
            | versioned contracts
            v
OIA Integration Hub
            |
            +---- OIA MES
            +---- OIA Quality
            +---- OIA Asset Care
            |
            v
OIA Operations / OIA HMI / OIA Control
            |
            | separately reviewed site adapters
            v
PLC / DCS / SCADA / historian / broker / edge runtime
            |
            v
Physical process and equipment

Independent boundary:
safety PLC, SIS, emergency stops, guarding and hazardous-energy isolation
```

## Runtime boundaries

The browser runtime uses local storage, portable JSON, CSV export and a deterministic simulation clock. The desktop runtime serves the same audited assets over the secure `oia://app` origin and shares one application-data directory across products.

Production adapters are separate deployables so that plant credentials, certificate stores, network access and command permissions are not embedded in the public UI package.

## Data ownership

`model.json` is the portable reference snapshot. `data.js` supplies the browser seed. Runtime changes, audit records and preferences are stored in the local workspace and can be exported. An enterprise deployment should replace local persistence with a durable, access-controlled service while preserving the same schema and correlation identifiers.
