# AiXin Roadmap

> Last updated: 2026-07-26
> Current phase: **Track A ✅ · Track B 🟡 real persistence + live anchor shipped; realism gaps + task management still open · Track C GTM next**

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
- [x] Live end-to-end loop wired (delegate → validator Ed25519 sig → BSC Testnet anchor → ERC-8004 identity/reputation/validation).
- [x] Persistent tasks + task_events with Realtime, task history at `/dashboard/tasks`.
- [x] ISO badge corrected to **ISO/IEC 42001** everywhere (legacy "ISO 27001" strings removed on receipts/governance UI).
- [ ] **Realistic intent capture** — before Plan, ask domain-specific follow-ups (Travel: from/to/dates/pax/budget; Marketing: channels/audience/dates; Money: amount/currency/counterparty). No plan is produced until required slots are filled. *Blocks a believable demo.*
- [ ] **Task management UX** — start a new task while another runs, resume an in-flight task from `/dashboard/tasks` back into the live activity view, archive/delete tasks, "Running" badge in sidebar. *Blocks multi-task demo.*
- [ ] **On-chain evidence panel** per task — plain-language "what this tx proves" tooltip on every hash (audit anchor = payload hash committed; ERC-8004 Identity = agent registered; Reputation = feedback score signed; Validation = validator request+response). Link each to BscScan with the exact function called.
- [ ] **ERC-8004 visibility** — surface the three registry txs (Identity / Reputation / Validation) on the Reputation page and the task receipt drawer with contract addresses + BscScan links, not just the audit anchor. Backend already writes them via `erc8004.server.ts`; UI needs to show them.
- [ ] Cut `v0.1.0` tag on `aixin-twin` (triggers `container.yml` → first published GHCR image).

## Phase 4 — Track C: Go-to-Market (sneak preview in days)
- [x] OpenClaw baseline agent harness shipped to `aixin-protocol/aixin-protocol/demos/openclaw-baseline/` — shared MCP ledger, duplicate-refund trap scenario, and PowerShell setup guide for the honest side-by-side demo.
- [ ] Investor demo deck refresh (Ask AiXin screenshots + live BscScan tx + earnings-explained panel)
- [ ] Waitlist landing + CRO copy
- [ ] Reference use-case videos (Travel, Marketing, Finance) — filmed after the realism fixes above
- [ ] Sneak-preview run-of-show doc (5-min demo script)

## Phase 5 — Track D: Tokenomics & Launch
- [ ] ERC-8004 token contract audit
- [ ] Pre-IDO simulation → real ledger
- [ ] Exchange / launch partner integration

## Minimum to go live (sneak preview)

Ordered by dependency — do 1–4 before recording anything:

1. **Slot-filling before Plan** in `/dashboard/ask` so vague intents ("plan a trip to Paris") trigger a short follow-up form instead of jumping to a fabricated itinerary.
2. **Task manager**: parallel runs, resume-from-history, archive/delete, "N running" badge.
3. **On-chain evidence panel**: per-tx explainer + ERC-8004 registry txs surfaced on Reputation + task drawer.
4. **Copy pass**: replace remaining simulation language with "reference simulation" labels where the backend isn't real yet (channel delivery to WhatsApp/WeChat, token payouts).
5. Record demo tx + earnings screenshots.
6. Cut `v0.1.0`, publish GHCR image.
7. Refresh investor deck + run-of-show.

