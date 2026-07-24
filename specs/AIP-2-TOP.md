# AIP-2: Twin Operating Protocol (TOP)

- **AIP:** 2
- **Title:** Twin Operating Protocol
- **Status:** Draft
- **Type:** Standards Track
- **Category:** Core
- **Created:** 2026-07-24
- **Requires:** AIP-0, AIP-1
- **Companion:** AIP-1 (SIP)

## Abstract

Where AIP-1 (SIP) governs the *action*, AIP-2 (TOP) governs the *agent*.
TOP defines the minimum operating envelope for any autonomous "twin"
that emits or executes SIP-validated intents: an Outcome Contract that
binds the twin to a business objective, Bounded Loop invariants that
cap resource and step consumption, a Pre-flight Reflection step, and
a Revocation capability that can halt the twin mid-execution.

TOP is to twins what a pilot license and flight envelope are to
pilots.

## Motivation

Per-action gating (SIP) is necessary but not sufficient. A twin that
passes every SIP check individually can still drift, loop, or exceed
scope in aggregate. TOP constrains the *operator*, not just the
*operation*.

## Specification

### 1. Outcome Contract

Every conformant twin MUST be initialized with an Outcome Contract
conforming to `schemas/outcome-contract.schema.json`:

```json
{
  "objective": "<short human-readable goal>",
  "success_metrics": [
    { "name": "<metric>", "op": "<= | >= | == | in", "value": <number|string|array> }
  ],
  "out_of_scope": ["<action or domain>", "..."],
  "principal": "<user id or org id>",
  "created_at": "<ISO-8601 UTC>"
}
```

The Outcome Contract:

- MUST be immutable for the life of a twin instance. Changes require
  minting a new twin.
- MUST be presented to the principal at twin creation and be
  retrievable at any time.
- MUST be evaluated by the twin before every consequential action
  (see §3).

### 2. Bounded Loop Invariants

Every twin MUST declare bounds conforming to
`schemas/bounded-loop.schema.json`:

| Bound | Required | Semantics |
|---|---|---|
| `max_steps` | MUST | Total reasoning/action steps per delegation. |
| `max_spend` | MUST if any action carries `amount` | Cumulative `amount` across a delegation. |
| `max_wallclock_seconds` | MUST | Real-time cap per delegation. |
| `max_external_calls` | SHOULD | Cap on outbound integrations. |

An executor MUST halt the twin and mark the delegation `bounded_halt`
when any bound is exceeded. A `bounded_halt` MUST emit a Receipt
(AIP-1 §7) with reason `top:bounded_halt:<bound_name>`.

### 3. Pre-flight Reflection

Before executing any action with SIP risk `medium` or `high`, the
twin MUST perform a reflection step producing:

```json
{
  "action_id": "<SIP sip_id>",
  "objective_match": "advances | neutral | conflicts",
  "in_scope": true|false,
  "reasoning": "<short rationale, ≤ 500 chars>"
}
```

If `objective_match == "conflicts"` OR `in_scope == false`, the twin
MUST NOT proceed and MUST emit a Decision Card annotated with the
reflection. Approval by the principal overrides.

### 4. Revocation

Every twin MUST expose a revocation capability:

- A `revocation_key` (public key or opaque token) MUST be recorded in
  the twin's `aixin.json` at creation.
- Holders of the corresponding secret MUST be able to signal
  revocation, which MUST cause the executor to refuse any further
  actions from that twin within the executor's next scheduling tick
  (SHOULD be ≤ 1 second wall-clock).
- Revocation MUST be recorded on-chain against the twin's ERC-8004
  Identity entry.

### 5. Anchoring (Trust Graph Binding)

Every executed Receipt (AIP-1 §7) MUST be anchored to the AiXin Trust
Graph:

- **Identity** — ERC-8004 Identity Registry (`newAgent(domain, address)`).
- **Audit** — Anchor contract `anchor(sip_id, payload_hash)`.
- **Reputation** — ERC-8004 Reputation Registry `giveFeedback(agentId,
  score, dataHash, dataURI)` on successful completion.
- **Validation** — ERC-8004 Validation Registry request/response for
  actions where SIP risk = high.

Chain and contract addresses MUST be declared in the twin's
`aixin.json` (`registries` block). Reference deployment: BSC Testnet.
Mainnet addresses to be published post-audit.

### 6. `aixin.json` Manifest

Every conformant twin MUST publish an `aixin.json` per
`schemas/aixin-manifest.schema.json`:

```json
{
  "protocol": "aixin/1.0",
  "agent": { "name": "...", "domain": "twin.example.aixin.agent" },
  "sip":  { "action_set": ["book_flight", "..."], "amount_cap": 10000 },
  "top":  {
    "outcome_contract": "./outcome.json",
    "bounds": { "max_steps": 20, "max_spend": 500, "max_wallclock_seconds": 120 },
    "revocation_key": "0x..."
  },
  "registries": {
    "identity":   { "chain": "bsc-testnet", "address": "0x..." },
    "reputation": { "chain": "bsc-testnet", "address": "0x..." },
    "validation": { "chain": "bsc-testnet", "address": "0x..." },
    "anchor":     { "chain": "bsc-testnet", "address": "0x..." }
  }
}
```

### 7. Conformance

An implementation is TOP-conformant if it: (a) refuses to start
without a valid Outcome Contract, (b) enforces all MUST bounds, (c)
performs Pre-flight Reflection on medium/high risk, (d) honors
Revocation within one scheduling tick, and (e) anchors Receipts per §5.
Test suite at `tests/aip-2/`.

## Rationale

- **Why separate from SIP?** Different failure modes — SIP catches
  bad packets; TOP catches bad pilots. Bundling them muddles both.
- **Why on-chain revocation?** So a compromised or malicious operator
  cannot suppress the kill-switch signal from the true principal.
- **Why immutable Outcome Contract?** Mutable objectives are indistinguishable
  from goal-drift; a "new twin" boundary makes drift observable.

## Backwards Compatibility

None — v1.0. Non-conformant twins MAY interoperate with SIP alone but
MUST NOT display the "SIP+TOP Verified" badge.

## Reference Implementation

`aixin-twin` reference app: `src/lib/erc8004.server.ts`,
`src/lib/anchor.server.ts`, forthcoming `src/lib/top.server.ts`.

## Security Considerations

- **Bounds bypass.** Executors MUST enforce bounds server-side; a
  client-side bound is not a bound.
- **Revocation liveness.** Executors SHOULD subscribe to the on-chain
  revocation event; polling MUST be ≤ 5 seconds.
- **Outcome Contract poisoning.** The principal MUST sign the initial
  Outcome Contract; unsigned contracts MUST be rejected.
- **Reflection prompt injection.** Reflection output MUST be
  structurally validated; free-form text MUST NOT be executed.

## Copyright

CC0 1.0 Universal.
