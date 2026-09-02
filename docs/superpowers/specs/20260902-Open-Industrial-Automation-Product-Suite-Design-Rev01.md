# Open-Industrial-Automation-Product-Suite-Design-Rev01

Date: 2026-09-02
Status: Approved implementation design

## Outcome

Deliver a premium-quality, light-first, open-source industrial automation product family that can be used in a browser or installed as separate Windows, macOS and Linux desktop applications. Each product has a focused information architecture while sharing one portable project model and one local workspace.

## Product family

1. OIA Suite - complete lifecycle command centre
2. OIA Operations - HMI, alarm management, historian and OEE
3. OIA Control - control engineering, tags, I/O, migration and deployment
4. OIA HMI - HMI and SCADA engineering
5. OIA MES - manufacturing execution, batch, materials and genealogy
6. OIA Asset Care - maintenance, work orders, calibration and health
7. OIA Quality - validation, traceability, records and release evidence
8. OIA OT Security - zones, conduits, controls, risks and recovery evidence
9. OIA Integration Hub - plant, MES, ERP, LIMS, historian and broker contracts

Every browser product is a focused view of the same audited suite source. Every desktop product uses the same `oia://app` origin and shared application data directory, so project data and records remain interconnected.

## Visual system

The accepted visual direction is the user-supplied Dub-style reference:

- pure white primary canvas
- #f5f5f5 nested paper surfaces
- 1 px #e5e5e5 structural borders
- #171717 body text and #0a0a0a high-emphasis text
- #2563eb as the primary active-state accent
- #000000 as the single filled primary action
- compact 4 px spacing system
- 6 px inputs, 8 px buttons, 12 px cards, 16 px large surfaces and pill badges
- Inter as the implementation-safe Satoshi substitute for 36 to 48 px medium-weight headings
- Inter for UI and body text
- Cascadia Code or IBM Plex Mono for technical metadata
- no decorative stock imagery, heavy shadows, card clutter or unbounded gradients
- restrained dotted blueprint texture behind the product surface
- light theme by default with an accessible optional dark theme

## Functional system

The suite retains all 19 lifecycle modules and deterministic workflows from the prior design. The release additionally requires:

- product selector and product-scoped module navigation
- shared project state across products
- simulation-speed control
- full automatic production progression beyond Charge Water
- full production completion and batch-count increment
- portable project and register exports
- PWA shortcuts for primary products
- product-specific browser entry routes
- Windows, macOS and Linux installers
- secure desktop protocol and navigation boundary
- no embedded credential, telemetry or public equipment-control endpoint

## Desktop boundary

Desktop products are offline-capable engineering, simulation and records applications. They do not become safety controllers merely because they run locally. Direct PLC, DCS, device or enterprise connectivity must be implemented through separately reviewed adapters with site-specific trust, permissions, allow-lists, validation, network segmentation and acceptance evidence.

## Installer outputs

- Windows x64 NSIS installer
- Windows x64 portable executable
- macOS universal DMG
- macOS universal ZIP
- Linux x64 AppImage
- Linux x64 Debian package

Community builds are unsigned. Organisation-controlled signing and Apple notarisation are a release-management responsibility and cannot be fabricated without the required certificates and accounts.

## Acceptance gates

- all 19 modules render and remain functional
- all fifteen focused products open their correct module and expose only their product scope
- every product uses the shared browser workspace
- production starts at Charge Water, advances to later phases, completes and increments batch count
- existing module interaction QA remains green
- light-first Dub design tokens are active
- no document-level overflow at 390 px or 200 percent zoom-equivalent layouts
- accessibility, keyboard focus, reduced motion and runtime checks pass
- desktop product contract verifies sixteen unique products, application IDs and routes
- Windows, macOS and Linux packaging jobs produce non-empty installers and SHA-256 manifests
- GitHub Pages live HTTP and browser QA pass after merge
- no unsupported safety, signing or production-commissioning claim is made
