# Contributing-To-Open-Industrial-Automation

Contributions should strengthen a vendor-neutral, inspectable and testable industrial automation reference platform.

## Required change contract

Every functional change should include:

1. a stated engineering or operating requirement
2. an automated test that fails before the implementation
3. the smallest implementation that satisfies the requirement
4. browser verification at desktop, mobile and 200 percent zoom-equivalent reflow
5. keyboard, focus, reduced-motion and accessibility checks
6. data-contract and export verification where records change
7. security and safety-boundary review where commands or connectivity change
8. updated documentation and capability classification
9. a reversible release and explicit rollback reference

## Design rules

- Keep real controls, text, tables and navigation code-native.
- Prefer open layouts, rails, tables, canvases and purposeful panels over decorative card grids.
- Use semantic HTML, visible keyboard focus and no colour-only meaning.
- Preserve usable operation from 320 px through ultrawide screens.
- Use SI units and stable engineering identifiers.
- Do not invent performance, compliance, certification or field-validation evidence.

## Industrial boundary

Do not merge browser-direct control of physical equipment. Live protocol connectors belong in a separate edge runtime with authentication, authorisation, command allow-lists, message validation, rate limits, timeout behaviour, audit records, network segmentation and tested fail-safe states.

Do not claim that the project is a safety controller, validated electronic-records platform or certified industrial product.
