# Deployment-Guide

## Hosted reference

The hosted build is static and can be served by GitHub Pages or another HTTPS static host. HTTPS enables service-worker caching and installable-app behaviour.

## Production adoption sequence

1. Fork the public source and pin an approved release.
2. Create a site-specific project model in a protected branch.
3. Define ownership, intended use, regulated scope and safety boundaries.
4. Complete equipment, signal, alarm, recipe, interface, record, role and network inventories.
5. Implement a separate edge runtime for supported industrial protocols.
6. Add durable historian, event, MES and audit persistence.
7. Integrate enterprise identity and named access.
8. Establish development, test and production environments with configuration comparison.
9. Execute unit, integration, simulation, cybersecurity, backup and restoration tests.
10. Complete FAT, SAT, commissioning, qualification and training as required.
11. Deploy a signed release package with an explicit rollback point.
12. Monitor operation, reconcile records and control all subsequent changes.

## Edge-runtime acceptance

A production connector must prove:

- authenticated and authorised communication
- certificate and key lifecycle management
- bounded and validated messages
- explicit quality and timestamp semantics
- command allow-list and state-dependent permissions
- idempotency, acknowledgement and controlled retry
- disconnection, stale-data and recovery behaviour
- event and audit evidence
- tested fail-safe response

## Rollback

Rollback is a planned release path, not an improvised file copy. Preserve the previous approved application, configuration, controller logic, HMI package, database migration state and recovery instructions. Validate compatibility before reversing a release.
