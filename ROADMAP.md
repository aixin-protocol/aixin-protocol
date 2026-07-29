# AiXin Roadmap

> Last updated: 2026-07-26
> Current phase: **Track A ✅ · Track B 🟡 real persistence + live anchor shipped; realism gaps + task management still open · Track C 🟡 OpenClaw baseline shipped · Track D (Trust Graph & Contracts) 🔜**
>
> **Single source of truth.** This file is the canonical roadmap for both
> `aixin-protocol/aixin-protocol` and `aixin-protocol/aixin-twin`. Any change
> here MUST be mirrored to the protocol repo in the same commit — do not keep
> a divergent copy. If the protocol repo drifts, this file wins.

## Repo map

| Repo | Purpose | Status |
| --- | --- | --- |
| `aixin-protocol/aixin-protocol` | Protocol specs, CLI, SDKs (JS/Python), reference validator server, whitepapers, ERC-8004 contracts | ✅ Active, 3 packages published |
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
- [x] Shared Ledger panel at `/dashboard/ledger` (live tables + reset) proving AiXin and OpenClaw hit the same MCP substrate
- [x] Reset demo data (cascading delete of tasks/cards/receipts, seed restore for ORD-1001)
- [x] Telegram bot loop (`@aixinchrisbot`) mirroring task threads deterministically

**Earnings transparency (done):**
- [x] Deterministic per-receipt earning breakdown in `src/lib/earnings.ts` (base + anchor bonus + ERC-8004 receipts + SIP quality × stake multiplier), used by both server (`sip.functions.ts`) and Reputation UI so the Earning Pool total reconciles line-by-line with each signed receipt.
- [x] "How earnings are calculated" card on `/dashboard/reputation` showing the last action's breakdown, lifetime total, and formula.
- [x] Per-receipt `+$X.XX $AXN` badge on every signed receipt row.

**Sneak-preview closeout (Phase 3):**
- [x] Live end-to-end loop wired (delegate → validator Ed25519 sig → BSC Testnet anchor → ERC-8004 identity/reputation/validation).
- [x] Persistent tasks + task_events with Realtime, task history at `/dashboard/tasks`.
- [x] ISO badge corrected to **ISO/IEC 42001** everywhere (legacy "ISO 27001" strings removed on receipts/governance UI).
- [ ] **Realistic intent capture** — before Plan, ask domain-specific follow-ups (Travel: from/to/dates/pax/budget; Marketing: channels/audience/dates; Money: amount/currency/counterparty). No plan is produced until required slots are filled. *Blocks a believable demo.*
- [ ] **Task management UX** — start a new task while another runs, resume an in-flight task from `/dashboard/tasks` back into the live activity view, archive/delete tasks, "Running" badge in sidebar. *Blocks multi-task demo.* (delete shipped; parallel + resume + badge still open)
- [ ] **On-chain evidence panel** per task — plain-language "what this tx proves" tooltip on every hash (audit anchor = payload hash committed; ERC-8004 Identity = agent registered; Reputation = feedback score signed; Validation = validator request+response). Link each to BscScan with the exact function called.
- [ ] **ERC-8004 visibility** — surface the three registry txs (Identity / Reputation / Validation) on the Reputation page and the task receipt drawer with contract addresses + BscScan links, not just the audit anchor. Backend already writes them via `erc8004.server.ts`; UI needs to show them.
- [ ] **Full ZH i18n coverage (pre-IDO blocker)** — every dashboard route, modal, empty state, toast, error message, tooltip and seeded demo copy must render in Simplified Chinese when the language toggle is set to 中文. Audit for hardcoded English strings across `src/routes/**` and `src/components/**`, move them into `src/lib/i18n.tsx`, then walk every page in both locales before sign-off.
- [ ] **Mobile-first responsive pass (pre-IDO blocker)** — every page must render cleanly at 375px / 414px / 768px: no horizontal scroll, no clipped headers, no overflowing tables or Decision Cards. Apply the grid + `min-w-0` + `shrink-0` header pattern, make tables scroll or stack as cards, and verify the sidebar, SkillCraft modal, Ask AiXin, Governance, Ledger, Tasks and Specialist detail on a real phone viewport before sign-off.
- [ ] Cut `v0.1.0` tag on `aixin-twin` (triggers `container.yml` → first published GHCR image).

## Phase 4 — Track D: Trust Graph & Contracts
> Goal: turn the receipt trail into a queryable, cryptographically-verifiable trust graph
> anchored by audited on-chain contracts. This is what makes AiXin a *protocol*, not just
> a governed app. Lives primarily in `aixin-protocol/aixin-protocol`.

**Contracts (on-chain):**
- [x] ERC-8004 Identity / Reputation / Validation registries deployed to BSC Testnet
- [x] `AuditAnchor` contract deployed to BSC Testnet (payload-hash commitments)
- [ ] **Anchoring fee module** — per-anchor fee in $AXN, split between validator stake pool and burn address; parameterised via governance.
- [ ] **Validator staking module** — stake $AXN to run a validator; slashable on signed-but-invalid receipts; rewards from anchoring fees.
- [ ] Third-party contract audit (Identity + Reputation + Validation + Anchor + Fee + Staking as one bundle)
- [ ] Mainnet deployment plan + multisig ownership handover

**Trust Graph (off-chain, verifiable):**
- [ ] **Trust Graph indexer** — subgraph / worker that reads every anchor tx + ERC-8004 event and reconstructs the (agent → skill → receipt → validator → outcome) graph.
- [ ] **Verified sources registry** — signed manifest of "trusted skill publishers" (org DID + Ed25519 pubkey); consumed by validator-server to raise/lower SIP quality scores.
- [ ] **Public Trust Graph API** (`api.aixin.io/graph`) — read-only GraphQL over the indexed graph so any third party can independently verify a receipt without trusting our app.
- [ ] **Trust Graph explorer UI** at `spec.aixin.io/graph` — search by agent DID, receipt hash, or validator; renders the provenance chain with BscScan links at every edge.
- [ ] Reference client: `@aixin-protocol/graph-client` (JS + Python) so integrators can query the graph in three lines.

**Spec work:**
- [ ] AIP-3: Anchoring fee & validator staking economics
- [ ] AIP-4: Verified Sources Registry format
- [ ] AIP-5: Trust Graph query surface

## Phase 5 — Track C: Go-to-Market (sneak preview in days)
- [x] OpenClaw baseline agent harness shipped to `aixin-protocol/aixin-protocol/demos/openclaw-baseline/` — shared MCP ledger, duplicate-refund trap scenario, and PowerShell setup guide for the honest side-by-side demo.
- [x] Live head-to-head demo script (`DEMO_SCRIPT.md`) + investor addendum deck (`AiXin_Demo_Deck_v7_Live_Demo_Addendum.pptx`).
- [x] CEO + COO master decks aligned to v7 (Ask AiXin front door, ISO/IEC 42001, Telegram loop).
- [ ] Investor demo deck refresh (Ask AiXin screenshots + live BscScan tx + earnings-explained panel) — final pass after Phase 3 realism fixes.
- [ ] Waitlist landing + CRO copy
- [ ] Reference use-case videos (Travel, Marketing, Finance) — filmed after the realism fixes above
- [ ] Sneak-preview run-of-show doc (5-min demo script) — polished for external distribution
- [ ] "Repos & Artifacts" investor handout (URLs + versions + commit hashes)

## Phase 6 — Tokenomics & Launch
- [ ] $AXN token contract (post-audit — bundled with Phase 4 audit)
- [ ] Pre-IDO ledger-preview → real ledger migration (unfreeze non-tradeable balances)
- [ ] Exchange / launch partner integration
- [ ] Mainnet launch of Identity / Reputation / Validation / Anchor / Fee / Staking bundle
- [ ] Token generation event (TGE)

## Minimum to go live (sneak preview)

Ordered by dependency — do 1–6 before recording anything:

1. **Slot-filling before Plan** in `/dashboard/ask` so vague intents ("plan a trip to Paris") trigger a short follow-up form instead of jumping to a fabricated itinerary.
2. **Task manager**: parallel runs, resume-from-history, archive/delete, "N running" badge.
3. **On-chain evidence panel**: per-tx explainer + ERC-8004 registry txs surfaced on Reputation + task drawer.
4. **Copy pass**: replace remaining simulation language with "reference simulation" labels where the backend isn't real yet (channel delivery to WhatsApp/WeChat, token payouts).
5. **Full ZH i18n coverage** — no English leaks anywhere when the toggle is 中文 (pre-IDO blocker).
6. **Mobile-first responsive pass** — every page verified at 375/414/768px (pre-IDO blocker).
7. Record demo tx + earnings screenshots.
8. Cut `v0.1.0`, publish GHCR image.
9. Refresh investor deck + run-of-show.
