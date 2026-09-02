# Product-And-Desktop-Architecture

## Shared core

All OIA products use the same `model.json`, application runtime, local workspace schema, audit records and export contracts. Product boundaries change navigation and launch context, not the underlying engineering truth.

## Browser entry points

- `/open-industrial-automation/` - OIA Suite
- `/open-industrial-automation/products/operations/`
- `/open-industrial-automation/products/control/`
- `/open-industrial-automation/products/hmi/`
- `/open-industrial-automation/products/mes/`
- `/open-industrial-automation/products/assets/`
- `/open-industrial-automation/products/quality/`
- `/open-industrial-automation/products/security/`
- `/open-industrial-automation/products/integration/`

Each route resolves to the root application with an explicit product identifier and starting module.

## Desktop architecture

```text
Product installer
    |
    v
Secure Electron shell
    |
    +-- context isolation
    +-- sandbox
    +-- Node.js integration disabled
    +-- all permission requests denied
    +-- external navigation denied
    +-- custom oia://app protocol
    |
    v
Shared OIA static suite
    |
    v
Shared Open-Industrial-Automation user-data directory
```

The custom protocol rejects path traversal and returns a restrictive Content Security Policy. Every product uses the same origin and shared data root to preserve interoperability.

## Production adapters

Live equipment and enterprise integration remain separate deployable adapters. A production adapter must define certificate trust, endpoint identity, read/write scope, command allow-lists, payload validation, timeouts, retries, idempotency, store-and-forward behaviour, audit correlation and fail-safe handling. An adapter is not accepted merely because a network connection succeeds.
