# AiXin Roadmap

> Last updated: 2026-07-25
> Current phase: **Track A ✅ 100% · Track B scaffolding ✅ complete · close the live end-to-end loop next**

## Repo map

| Repo | Purpose | Status |
| --- | --- | --- |
| `aixin-protocol/aixin-protocol` | Protocol specs, CLI, SDKs (JS/Python), reference validator server, whitepapers | ✅ Active, 3 packages published |
| `aixin-protocol/aixin-twin` *(does not exist yet)* | Reference implementation web app (this Lovable project) extracted into its own repo | ⏳ Track B |

## Phase 0 — Foundation
- [x] Brand / design system (#FAF9F6 cream, #D97757 coral, #1A1814 dark, Sora/Inter/JetBrains Mono)
- [x] Bilingual i18n (EN + ZH)
- [x] Landing page, auth, onboarding
- [x] Master Twin + Specialist Twins data model
- [x] SIP (Signal Intent Protocol) deterministic validator
- [x] Decision Cards + signed receipts
- [x] BSC Testnet audit anchor contract + `anchor.server.ts`

## Phase 1 — Protocol Publication
- [x] Whitepaper v3
- [x] AIP-1 / AIP-2 normative specs
- [x] `spec.aixin.io` static site (works at `aixin-protocol.github.io/aixin-protocol`; DNS for custom domain deferred)

## Phase 2 — Track A: Reference Tooling
- [x] `@aixin-protocol/cli`
- [x] `@aixin-protocol/sdk-js`
- [x] `aixin-protocol-sdk` (Python) — *Trusted Publisher pending on PyPI; code ready*
- [x] `@aixin-protocol/validator-server` v1.0.0-rc.1
- [x] `@aixin-protocol/validator-server` v1.1.0 with BSC Testnet anchoring
- [x] Reverse manifest adapter (`@aixin-protocol/adapter` v0.1.0)
- [x] Quickstart page on spec site

## Phase 3 — Track B: Reference Implementation Open-Source
> Goal: extract the Lovable-built AiXin app into a standalone, self-hostable `aixin-twin` repo.

**Scaffolding (done):**
- [x] Create `aixin-protocol/aixin-twin` GitHub repo
- [x] Strip Lovable-specific bits and document generic Vite/TanStack Start setup (scaffold preset)
- [x] Add `docker-compose.yml` for one-liner self-host
- [x] Publish container image workflow (`ghcr.io/aixin-protocol/aixin-twin`)
- [x] Wire the app to `@aixin-protocol/validator-server` via `AIXIN_VALIDATOR_URL` (client scaffolded)
- [x] Reference-implementation PRD checked into `aixin-twin`

**Remaining in Phase 3:**
- [ ] Close the loop end-to-end: live app delegates → validator signs receipt → BSC anchor tx visible in UI

## Phase 4 — Track C: Go-to-Market
- [ ] Investor demo deck finalization
- [ ] Waitlist + landing CRO
- [ ] Reference use-case videos (Travel, Marketing, Finance)

## Phase 5 — Track D: Tokenomics & Launch
- [ ] ERC-8004 token contract audit
- [ ] Pre-IDO simulation → real ledger
- [ ] Exchange / launch partner integration

## Immediate next actions

1. **End-to-end live loop** (closes Phase 3): point the deployed app at a running `validator-server`, delegate a real Decision Card, capture the signed receipt + BSC Testnet tx, and screenshot it into the investor deck.
2. **Publish first container image** by cutting `v0.1.0` tag on `aixin-twin` (triggers `container.yml`).
3. Kick off **Track C** (GTM): waitlist CRO + demo videos.

## How much is left?

- **Protocol Track A**: ✅ 100% done.
- **App extraction Track B**: ~85% — scaffold/docker/CI/wiring/PRD shipped; live end-to-end loop + first tagged image remaining before Phase 3 is fully closed.
- **GTM Track C**: not started.
- **Token launch Track D**: not started.

Phase 3 scaffolding is complete. The only open Phase 3 item is the live end-to-end loop; once that and the `v0.1.0` tag ship, Track B is 100% and we move to Track C.
