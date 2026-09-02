# Security-Policy

## Supported hosted surface

The public hosted application is a static browser reference suite. It has no server-side database, user account, analytics service or live industrial connection. Demonstration state is stored in the browser and can be reset or exported.

## Reporting a vulnerability

Report security issues privately through the repository owner's GitHub security-reporting channel where available. Include the affected path, reproduction steps, observed impact and a minimal proof of concept. Do not include third-party secrets or private plant information.

## Production boundary

A real industrial deployment requires a separate reviewed edge and server architecture. At minimum, apply:

- named identities, least privilege and controlled engineering access
- certificate-based trust and encrypted supported protocols
- zones, conduits and deny-by-default network rules
- explicit command allow-lists and state-dependent authorisation
- schema validation, bounded payloads, timeouts and rate limits
- secure configuration, secret management and signed releases
- independent event and audit storage
- backup, restoration, disaster recovery and periodic testing
- vulnerability, patch and incident-response processes suitable for OT availability and safety constraints

The browser application must never be treated as an independent safety layer.
