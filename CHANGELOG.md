# Changelog

All notable protocol-repo changes.
Semantic versioning applies to individual AIPs; this file tracks repo state.

## 2026-07-24 (later)

### Added — Phase 1 near-complete
- `deployments/` — ERC-8004 network registry.
  - `deployments/README.md` (BSC Testnet table + manifest binding + update procedure)
  - `deployments/abi/{identity,reputation,validation}.json` (extracted from `ERC8004.sol`)
  - `contracts/ERC8004.sol` mirrored into repo for portability.
- `site/` — zero-dependency static generator for `spec.aixin.io`.
  - `site/build.mjs` renders `specs/*.md` + `schemas/*.json` + `examples/*.json` → `site/dist/`.
  - `site/templates/{page.html,style.css}` — cream/coral brand.
  - Verified: 3 AIPs, 5 schemas, 5 examples build clean.
- `.github/workflows/publish-cli.yml` — tag-triggered npm publish with provenance; runs conformance pre-publish.
- `.github/workflows/publish-site.yml` — GitHub Pages deploy on `main` push.

### Remaining external steps
- `NPM_TOKEN` secret + push tag `cli-v1.0.0-rc.1` → publishes `@aixin/protocol-cli`.
- Point `spec.aixin.io` DNS at the GitHub Pages target.
- Fill in deployed contract addresses after Phase 4 audit.

## 2026-07-24

### Added — Phase 1 checkpoint
- `cli/` — `@aixin/protocol-cli` v1.0.0-rc.1
  - `aixin validate <kind|--auto> <file>` — single-artifact validation
  - `aixin conformance` — runs bundled fixtures
  - Ajv 2020-12 with cross-schema `$ref` resolution
- `conformance/` — 18 fixtures (6 positive, 12 negative) across intent, sip-report,
  outcome-contract, bounded-loop, aixin-manifest. **18/18 passing.**
- `.github/workflows/conformance.yml` — CI runs the suite on every PR/push.

## 2026-07-23 — Phase 0 complete

- Drafted **AIP-0** (Process), **AIP-1** (SIP), **AIP-2** (TOP).
- JSON Schemas: intent, sip-report, outcome-contract, bounded-loop, aixin-manifest.
- Canonical examples: travel, marketing, finance, support intents + aixin.json manifest.
- Repo scaffolding: LICENSE (dual CC0 / Apache-2.0), README, CONTRIBUTING, CODE_OF_CONDUCT.
