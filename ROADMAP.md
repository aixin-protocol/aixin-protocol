# AiXin Roadmap

> Last updated: 2026-07-25
> Current phase: **Track A ✅ 100% · Track B ✅ live loop + Ask AiXin + transparent earnings shipped · Track C GTM next**

## Repo map

| Repo | Purpose | Status |
| --- | --- | --- |
| `aixin-protocol/aixin-protocol` | Protocol specs, CLI, SDKs (JS/Python), reference validator server, whitepapers | ✅ Active, 3 packages published |
| `aixin-protocol/aixin-twin` | Reference implementation web app (this Lovable project) extracted into its own repo | 🟡 Scaffold shipped; live demo tx pending |

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
- [x] Wire the app to `@aixin-protocol/validator-server` via `AIXIN_VALIDATOR_URL`
- [x] Reference-implementation PRD checked into `aixin-twin`
- [x] Decision Card approve flow signs via validator-server (Ed25519) and anchors to BSC Testnet with BscScan link in Governance UI

**UX polish (done):**
- [x] Specialist Twin lifecycle (pause / retire / delete + "Show retired" toggle)
- [x] Skill persistence + specialist assignment picker in SkillCraft
- [x] Chat UI overhaul ("Twin at Work" panel, animated status ring)
- [x] **"Ask AiXin" intent-first home at `/dashboard/ask`** — Master Twin hero, domain tiles (Travel · Marketing · Money · Work · Health · Something else), editable goal-starters, animated Chain-of-Thought thinking phase, propose→approve plan card flagging capability gaps, "working 24/7" living state with channel toggles (WhatsApp · WeChat · App). Default landing after sign-in and onboarding.
- [x] Collapsible sidebar (icon rail ↔ full nav, `localStorage` persisted); "Ask AiXin" pinned at top

**Earnings transparency (done):**
- [x] Deterministic per-receipt earning breakdown in `src/lib/earnings.ts` (base + anchor bonus + ERC-8004 receipts + SIP quality × stake multiplier), used by both server (`sip.functions.ts`) and Reputation UI so the Earning Pool total reconciles line-by-line with each signed receipt.
- [x] "How earnings are calculated" card on `/dashboard/reputation` showing the last action's breakdown, lifetime total, and formula.
- [x] Per-receipt `+$X.XX $AXN` badge on every signed receipt row.

**Sneak-preview closeout (Phase 3):**
- [x] Live end-to-end loop wired (delegate → validator Ed25519 sig → BSC Testnet anchor → ERC-8004 identity/reputation/validation) — capture the recording during rehearsal.
- [ ] Cut `v0.1.0` tag on `aixin-twin` (triggers `container.yml` → first published GHCR image). Manual step in GitHub UI: **Releases → Draft a new release → tag `v0.1.0` → Publish**.

## Phase 4 — Track C: Go-to-Market (sneak preview in days)
- [ ] Investor demo deck refresh (Ask AiXin screenshots + live BscScan tx + earnings-explained panel)
- [ ] Waitlist landing + CRO copy
- [ ] Reference use-case videos (Travel, Marketing, Finance) — all filmed starting from the Ask AiXin front door
- [ ] Sneak-preview run-of-show doc (5-min demo script: hatch → ask → thinking → plan → approve → BscScan → earning breakdown)

## Phase 5 — Track D: Tokenomics & Launch
- [ ] ERC-8004 token contract audit
- [ ] Pre-IDO simulation → real ledger
- [ ] Exchange / launch partner integration

## Immediate next actions

1. **Record the demo tx once** on the running app (approve a Decision Card, capture the BscScan link + earnings breakdown) — drop screenshots into the investor deck.
2. **Cut `v0.1.0`** on `aixin-twin` from the GitHub UI to publish the first GHCR image.
3. **Refresh the investor deck** with Ask AiXin + earnings-explained slides.
4. **Draft the sneak-preview run-of-show** so anyone on the team can demo the same 5-minute flow.

## How much is left?

- **Protocol Track A**: ✅ 100% done.
- **App extraction Track B**: ✅ 100% wired. Only two out-of-app manual actions remain (record demo tx, cut `v0.1.0` tag) — these are captures/releases, not build work.
- **GTM Track C**: starting now.
- **Token launch Track D**: not started.
