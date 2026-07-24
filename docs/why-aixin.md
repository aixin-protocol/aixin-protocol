# Why (and When) to Use AiXin Protocol

**Status:** v6 · **Last updated:** 2026-07-24

AiXin Protocol is the trust layer for agentic AI. It is **two specs + one registry**:

- **AIP-1 SIP** (Signal Intent Protocol) — turns stochastic LLM output into a deterministic, rule-checked intent before any consequential action runs.
- **AIP-2 TOP** (Twin Operating Protocol) — bounds the agent's flight envelope: outcome contracts, loop caps, pre-flight reflection.
- **ERC-8004 registries on BSC** — Identity, Reputation, Validation. Every approved action emits a signed on-chain receipt.

You do **not** need AiXin to build an agent. You need it the moment an agent takes an action that costs money, touches a customer, or has to be defended to a regulator, an auditor, or an insurer.

---

## When to use AiXin

Use AiXin when **any one** of these is true:

| Trigger | Why AiXin |
|---|---|
| The agent spends money, moves funds, or commits inventory | SIP hard-caps + Decision Cards for high-risk actions |
| The agent posts, emails, or messages on behalf of a brand | SIP schema-check + receipt = defensible audit trail |
| The agent runs unattended (cron, webhook, background loop) | TOP bounded-loops prevent runaway spend / infinite retries |
| You need to prove to a regulator, auditor, or insurer what the agent did and why | On-chain receipt (payload hash + validation score) |
| You're integrating a third-party agent and don't fully trust it | Reputation Registry gives a portable, tamper-evident track record |
| EU AI Act / SOC2 / ISO scope covers this workflow | SIP+TOP maps cleanly to "human-in-the-loop" + "logging" controls |

Skip AiXin when the agent is a pure read-only assistant (summarise, draft, search) with no side-effects. It's overhead you don't need yet.

---

## With vs Without AiXin — realistic examples

### Example 1 — Travel Concierge books a flight

**Without AiXin:**
```
User: "Book me the cheapest flight to Tokyo next Tuesday, under $1200."
Agent: [calls flight API]
Agent: ✅ Booked LHR→NRT, $1,847, non-refundable.
User: 😱
```
No schema check on `amount`. No human approval. No receipt. The chargeback dispute is your word against the model's output.

**With AiXin:**
```
User: "Book me the cheapest flight to Tokyo next Tuesday, under $1200."
LLM → intent: { action: "book_flight", amount: 1847, currency: "USD", ... }
SIP validate:
  ✗ amount 1847 > user_cap 1200  → risk: high → requires_approval: true
→ Decision Card surfaced to user.  User rejects.
Receipt anchored on BSC: { sip_id, payload_hash, status: "rejected" }
```
No money moved. Full audit trail. If the user *had* approved, the receipt is your defence.

---

### Example 2 — Marketing agent schedules a week of posts

**Without AiXin:**
Agent posts 47 tweets in 4 minutes because a retry loop misread a 429. Brand account suspended.

**With AiXin (TOP bounded loop):**
```
TOP outcome contract:
  max_actions_per_hour: 6
  max_total_cost_usd: 20
  loop_cap: 12
Agent hits loop_cap at iteration 12 → halts → emits TOP violation receipt.
Human sees Decision Card: "Marketing Twin hit loop cap. 6 posts published, 41 blocked."
```

---

### Example 3 — Finance agent issues a refund

**Without AiXin:** Refund issued. Someone in the CS thread asks "who authorised this?" — nobody can prove it.

**With AiXin:** `issue_refund` is a HIGH_RISK action; SIP forces a Decision Card. On approve, receipt writes:
- Payload hash (refund amount, order id, reason)
- Identity Registry: which specialist twin acted
- Validation Registry: score 95
- Anchored on BSC Testnet (later: mainnet)

Auditor query: `SELECT * FROM receipts WHERE action = 'issue_refund'` → cryptographic proof, exportable.

---

### Example 4 — Third-party agent (OpenClaw) plugs into your workflow

**Without AiXin:** You have no idea if OpenClaw's agent has been rug-pulled, prompt-injected, or silently regressed.

**With AiXin:** OpenClaw ships an `aixin.json` manifest. Before every consequential call, you check its Reputation score on-chain. Bad actor? Score drops in public. Portable trust, no bilateral audits.

---

## The one-line rule

> If the agent can do something you'd have to **explain to a lawyer, an auditor, or an angry customer**, wrap it in AiXin.

Everything else — chat, summarise, brainstorm — doesn't need us. That's a feature, not a limitation.
