# AiXin Protocol — Execution Roadmap

**Owner:** AiXin core team
**Status:** Living document. Update as items complete.
**Last updated:** 2026-07-24 (Phase 1 in progress)
**Target:** Publish AiXin Protocol v1.0 (SIP + TOP) as open spec, ship reference implementation, land 2 external adopters, then $AXN IDO.

Legend: ☐ todo · ◐ in progress · ☑ done

---

## Phase 0 — Foundations (Week 0) ✅ COMPLETE

- ☑ Whitepaper v4 (SIP + TOP + Flywheel + Adoption)
- ☑ Investor Demo Deck v5
- ☑ Reference implementation MVP (AiXin Twin app, SIP validator, BSC Testnet anchoring, ERC-8004 Identity/Reputation/Validation)
- ☑ In-app Governance page showing SIP+TOP, Flywheel, Adoption surface
- ☑ **AIP-0: Process** — RFC-style governance for future AIPs
- ☑ **AIP-1: SIP** normative spec (MUST/SHOULD/MAY, security considerations, CC0)
- ☑ **AIP-2: TOP** normative spec
- ☑ JSON Schemas (draft 2020-12): intent, SIP report, outcome contract, bounded-loop, aixin.json manifest
- ☑ CEO + COO investor decks v6 aligned with SIP+TOP + reference-implementation use case

## Phase 1 — Publishable Spec (Weeks 1–2) ◐ IN PROGRESS

- ◐ `aixin-protocol/aixin-protocol` GitHub repo scaffold (Apache-2.0 for docs, CC0 for specs)
  - ☑ `README.md` — index of AIPs
  - ☑ `AIP-1-SIP.md`, `AIP-2-TOP.md`, `AIP-0-Process.md` (RFC process)
  - ☑ `schemas/` — JSON Schema (draft 2020-12) for each contract
  - ☑ `examples/` — canonical Travel / Marketing / Finance / Support intents
  - ☑ `CHANGELOG.md`, `LICENSE`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`
  - ☑ **`cli/` — `@aixin/protocol-cli` validator (`aixin validate`, `aixin conformance`)**
  - ☑ **`conformance/` — 18 fixtures (6 positive, 12 negative) covering all 5 kinds — 18/18 passing**
  - ☑ **`.github/workflows/conformance.yml` — CI enforces conformance on every PR**
- ☐ Push to GitHub under neutral org, enable Discussions *(requires org creation — external)*
- ◐ Publish `@aixin/protocol-cli` to npm
  - ☑ `.github/workflows/publish-cli.yml` (tag-triggered `cli-v*`, npm provenance, runs conformance pre-publish)
  - ☐ Add `NPM_TOKEN` secret + push tag `cli-v1.0.0-rc.1` *(requires npm creds — external)*
- ☑ ERC-8004 contract ABIs + deployed testnet addresses documented
  - ☑ `deployments/README.md` (network table + manifest binding + update procedure)
  - ☑ `deployments/abi/{identity,reputation,validation}.json`
  - ☑ `contracts/ERC8004.sol` mirrored into repo
  - ☐ Fill in checksummed addresses after audit-verified deploy (Phase 4)
- ☑ Public spec site at `spec.aixin.io` (static, generated from repo)
  - ☑ `site/build.mjs` zero-dep generator, `site/templates/{page.html,style.css}` on brand
  - ☑ `.github/workflows/publish-site.yml` (GitHub Pages)
  - ☑ Verified local build: 3 AIPs + 5 schemas + 5 examples rendered
  - ☐ Point `spec.aixin.io` DNS at Pages target *(requires DNS access — external)*

## Phase 2 — Reference SDK (Weeks 2–4)

- ☐ `@aixin/protocol` npm package
  - ☐ `validate(intent)` — deterministic SIP validator
  - ☐ `envelope(twinConfig)` — TOP invariant enforcement
  - ☐ `anchor(receipt)` — writes to BSC Testnet via viem
  - ☐ `register/feedback/validate` — ERC-8004 wrappers
- ☐ `@aixin/protocol-py` (Python port — Hermes-friendly)
- ☐ Reverse adapter: read a ClawHub / A2A / MCP manifest → emit `aixin.json`
- ☐ Docs site with 10-minute Quickstart

## Phase 3 — Reference Implementation Open-Source (Weeks 3–5)

- ☐ Extract AiXin Twin app into `aixin-twin` GitHub repo
  - ☐ License: BSL 1.1 (converts to Apache-2.0 after 3 years) — protects hosted business, still credible
  - ☐ Strip Lovable-specific tooling, add generic Vite/TanStack Start setup docs
- ☐ Docker Compose one-liner for self-host
- ☐ CI + published container images

## Phase 4 — Trust Graph & Contracts (Weeks 4–6)

- ☐ Solidity audit of `contracts/ERC8004.sol` (Peckshield or Zellic — budget $25–40k)
- ☐ Deploy audited contracts to BSC Testnet with published addresses
- ☐ Public block-explorer verified sources
- ☐ Anchoring fee module (paid in BNB testnet → will be $AXN on mainnet)
- ☐ Validator staking module (bond, slash, reward — testnet only for now)

## Phase 5 — Adoption Motion (Weeks 5–8)

- ☐ Land 2 external adopters (target: 1 ClawHub skill author + 1 Hermes-family agent)
- ☐ "SIP+TOP Verified" badge program + verifier endpoint
- ☐ Reverse-integration adapter published for ClawHub manifests
- ☐ 3 case-study blog posts
- ☐ Talk / demo at one AI-agent conference (AI Engineer Summit, ETHDenver AI track)

## Phase 6 — Governance & Foundation (Weeks 6–10)

- ☐ Neutral steward entity ("AiXin Foundation" — Swiss Verein or Singapore Ltd.)
- ☐ Transfer spec repo + ERC-8004 contract ownership to foundation
- ☐ AIP editors group (3–5 people incl. 1 external)
- ☐ Trademark filing for "AiXin Protocol" + SIP+TOP wordmarks
- ☐ Contributor License Agreement (CLA) via EasyCLA

## Phase 7 — Mainnet + Token (Weeks 10–14, gated on Phase 4–6 completion)

- ☐ Mainnet audit (second firm)
- ☐ Deploy ERC-8004 registries to BSC mainnet
- ☐ $AXN BEP-20 contract audit + deploy
- ☐ Tokenomics finalisation: 1B supply, sinks (listing burn, validation stake, anchor fee, reputation access)
- ☐ CEX/DEX listing strategy (PancakeSwap first; CEX after adoption metrics)
- ☐ IDO or fair-launch decision **only after** ≥2 external adopters live on testnet
- ☐ Public token generation event

## Phase 8 — Post-Launch (Weeks 14+)

- ☐ AIP-3+: extensions (multi-validator quorum, cross-chain anchoring, insurer hooks)
- ☐ Regulator engagement: submit to ISO/IEC AI WG, EU AI Act sandbox
- ☐ Insurer pilot (Munich Re / Lloyd's syndicate on receipts-as-underwriting-data)
- ☐ Enterprise pilot program (3 F500 buyers)

---

## Guardrails (do not skip)

1. **No mainnet token before 2 external adopters live.** History says this is what kills AI+crypto projects.
2. **No proprietary spec.** SIP+TOP repo must be Apache-2.0 from day one, or OpenClaw legal will veto adoption.
3. **Foundation before token.** IDO on a single-vendor-owned protocol reads as a rug.
4. **Every AIP change goes through the AIP process** once AIP-0 is ratified — including from us.
