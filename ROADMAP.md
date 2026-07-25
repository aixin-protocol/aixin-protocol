# AiXin Roadmap

> Last updated: 2026-07-25
> Current phase: **Track A ✅ 100% · Track B live loop wired ✅ · Ask AiXin intent-first home shipped ✅ · capture live demo tx next**

## Repo map

| Repo | Purpose | Status |
| --- | --- | --- |
| `aixin-protocol/aixin-protocol` | Protocol specs, CLI, SDKs (JS/Python), reference validator server, whitepapers | ✅ Active, 3 packages published |
| `aixin-protocol/aixin-twin` | Reference implementation web app extracted into its own repo | 🟡 Scaffold shipped; live demo tx pending |

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
- [x] `spec.aixin.io` static site

## Phase 2 — Track A: Reference Tooling
- [x] `@aixin-protocol/cli`
- [x] `@aixin-protocol/sdk-js`
- [x] `aixin-protocol-sdk` (Python)
- [x] `@aixin-protocol/validator-server` v1.1.0 with BSC Testnet anchoring
- [x] Reverse manifest adapter (`@aixin-protocol/adapter` v0.1.0)
- [x] Quickstart page on spec site

## Phase 3 — Track B: Reference Implementation Open-Source

**Scaffolding (done):**
- [x] Create `aixin-protocol/aixin-twin` GitHub repo
- [x] Vite/TanStack Start scaffold, Docker Compose, GHCR CI, validator wiring, PRD
- [x] Decision Card approve flow signs via validator-server (Ed25519) + BSC Testnet anchor + BscScan link

**UX polish (done):**
- [x] Specialist Twin lifecycle (pause / retire / delete)
- [x] Skill persistence + specialist assignment in SkillCraft
- [x] Chat UI overhaul ("Twin at Work" panel)
- [x] **"Ask AiXin" intent-first home at `/dashboard/ask`** — Master Twin hero, domain tiles (Travel · Marketing · Money · Work · Health · Something else), editable goal-starters, animated Chain-of-Thought thinking phase, propose→approve plan card flagging capability gaps, "working 24/7" living state with channel toggles (WhatsApp · WeChat · App). Default landing after sign-in and onboarding.
- [x] Collapsible sidebar (icon rail ↔ full nav); "Ask AiXin" pinned at top

**Remaining in Phase 3:**
- [ ] Capture the live demo tx end-to-end and screenshot it into the investor deck
- [ ] Cut `v0.1.0` tag on `aixin-twin` (first published GHCR image)

## Phase 4 — Track C: Go-to-Market
- [ ] Investor demo deck refresh (add Ask AiXin screenshots + live BscScan tx)
- [ ] Waitlist + landing CRO
- [ ] Reference use-case videos (Travel, Marketing, Finance) — filmed starting from Ask AiXin

## Phase 5 — Track D: Tokenomics & Launch
- [ ] ERC-8004 token contract audit
- [ ] Pre-IDO simulation → real ledger
- [ ] Exchange / launch partner integration

## How much is left?

- **Protocol Track A**: ✅ 100% done.
- **App extraction Track B**: ~97% — only demo tx capture + first tagged image remain.
- **GTM Track C**: not started.
- **Token launch Track D**: not started.
