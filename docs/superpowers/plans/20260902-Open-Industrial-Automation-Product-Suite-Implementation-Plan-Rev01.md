# Open-Industrial-Automation-Product-Suite-Implementation-Plan-Rev01

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement and verify each task.

**Goal:** Upgrade the existing OIA suite to the approved Dub-style product family and produce cross-platform desktop installers.

**Architecture:** Preserve the existing deterministic 19-module browser core. Add a light-first CSS layer, a product-scoping layer, a configurable simulation clock, product entry routes and a secure Electron shell driven by one product catalogue. Browser and desktop products share the same project-model contract.

**Tech Stack:** HTML, CSS, JavaScript, GitHub Pages, Playwright, axe-core, Electron 44.1.1, electron-builder 26.15.7 and GitHub Actions.

**Spec:** `docs/superpowers/specs/20260902-Open-Industrial-Automation-Product-Suite-Design-Rev01.md`

## Global constraints

- No user PC configuration is required to build or validate the release.
- No live equipment-control endpoint is exposed by the public site.
- Certified safety remains independent.
- Browser and desktop products must share the portable project model.
- Community installers remain explicitly unsigned unless real signing credentials are supplied.
- Existing portfolio routes and the current OIA rollback source remain intact.

## Tasks

- [x] Add the user-approved Dub-style tokens and component overrides.
- [x] Set light theme and compact density as the default while retaining accessible dark mode.
- [x] Add product catalogue, selector, scoped navigation and direct product routes.
- [x] Add a configurable deterministic simulation clock and default 5x reference speed.
- [x] Add QA proving progression beyond Charge Water and complete production-cycle return to IDLE.
- [x] Add QA proving shared state across focused products.
- [x] Add secure desktop shell, shared user-data root and custom `oia://app` protocol.
- [x] Add sixteen product definitions and cross-platform build configuration.
- [x] Add Windows, macOS and Linux installer workflow and SHA-256 evidence.
- [x] Update PWA manifest and offline cache.
- [x] Add product and installer documentation.
- [ ] Open pull request and run branch quality gates.
- [ ] Repair any failing gate and rerun.
- [ ] Merge the exact passing head with the approved release marker.
- [ ] Verify GitHub Pages and live product interactions.
- [ ] Verify installer artefacts and publish the installer prerelease.
