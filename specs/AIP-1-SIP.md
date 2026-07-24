# AIP-1: Signal Intent Protocol (SIP)

- **AIP:** 1
- **Title:** Signal Intent Protocol
- **Status:** Draft
- **Type:** Standards Track
- **Category:** Core
- **Created:** 2026-07-24
- **Requires:** AIP-0
- **Companion:** AIP-2 (TOP)

## Abstract

The Signal Intent Protocol (SIP) is a deterministic, model-independent
validation layer that sits between a stochastic language model and any
consequential action. SIP takes a structured *intent signal* as input,
runs a fixed set of schema and business-rule checks, classifies risk,
and produces a signed *SIP Report*. High-risk or under-specified intents
MUST be routed to a human via a Decision Card before execution.

SIP is to agent actions what TLS is to network packets: an envelope of
provable checks around a payload that would otherwise be trusted purely
on the reputation of its sender.

## Motivation

Language models are stochastic; consequential actions require determinism.
Existing agent frameworks conflate the two by executing tool calls
directly from model output. SIP separates them: the model emits a
signal, deterministic code decides whether to execute it.

## Terminology

Per RFC 2119.

- **Intent Signal** — a JSON object emitted by a language model or
  upstream planner describing a proposed action.
- **SIP Report** — the deterministic output of a SIP validator over an
  Intent Signal.
- **Decision Card** — a human-approval artifact produced when a SIP
  Report indicates approval is required.
- **Receipt** — a post-execution record whose hash is anchored on-chain
  per AIP-2.

## Specification

### 1. Intent Signal — Wire Format

An Intent Signal is a JSON object conforming to the schema in
`schemas/intent.schema.json`. It MUST contain:

| Field | Type | Required | Notes |
|---|---|---|---|
| `action` | string | MUST | Enumerated action identifier. |
| `specialist` | string | MAY | Twin/agent identifier the action targets. |
| `skill` | string | MAY | Skill identifier under which the action is executed. |
| `params` | object | MAY | Action-specific parameters. MUST be a JSON object (not array). |
| `amount` | number | MAY | If present, MUST be a positive finite number. |
| `currency` | string | MAY | If present, MUST match `^[A-Z]{3}$` (ISO 4217). |

Implementations MUST reject any Intent Signal containing top-level
fields not enumerated above (fail-secure).

### 2. Validator — Rules

A conforming SIP validator MUST evaluate the following rules in order
and MUST NOT short-circuit:

1. **Schema** — `action` is a non-empty string.
2. **Known action** — `action` is a member of the implementation's
   registered action set. Implementations MUST publish their action set.
3. **Amount bound** — if `amount` present, `0 < amount < AMOUNT_CAP`
   where `AMOUNT_CAP` is configured per-twin under AIP-2. Default: 10000.
4. **Currency form** — if `currency` present, matches `^[A-Z]{3}$`.
5. **Params shape** — if `params` present, is a JSON object.
6. **No extras** — no unknown top-level fields.

Each rule contributes to `rules_passed`. `rules_total` MUST equal the
number of rules evaluated (6 in this version).

### 3. Risk Classification

Given rules passed and action metadata:

- `high` — any rule fails, OR `action` is in the implementation's
  `HIGH_RISK_ACTIONS` set.
- `medium` — all rules pass, action is not high-risk, and either
  `amount` is present or the action is in a `MEDIUM_RISK_ACTIONS` set.
- `low` — otherwise.

Implementations MUST publish `HIGH_RISK_ACTIONS` and
`MEDIUM_RISK_ACTIONS` as part of their action registry.

### 4. Approval Requirement

`requires_approval` MUST be true if risk is `medium` or `high`, or if
any rule failed. Executors MUST NOT execute the action when
`requires_approval` is true without a corresponding approved Decision
Card (see §6).

### 5. SIP Report — Wire Format

Output conforms to `schemas/sip-report.schema.json`:

```json
{
  "sip_id": "sip_<12 hex>",
  "schema_ok": true,
  "rules_passed": 6,
  "rules_total": 6,
  "risk": "low|medium|high",
  "requires_approval": false,
  "reasons": ["<human-readable reason>", "..."],
  "intent": { /* echoed Intent Signal */ }
}
```

`sip_id` MUST be unique per report and MUST NOT be predictable across
reports (implementations SHOULD use a CSPRNG).

### 6. Decision Card

When `requires_approval` is true, executors MUST persist a Decision
Card containing at minimum: `sip_report`, `requestor`, `subject`,
`created_at`, `status ∈ {pending, approved, rejected}`. Only a
human principal MAY transition `pending → approved|rejected`.
Automated approval is a protocol violation.

### 7. Execution & Receipt

On execution (immediate for low-risk, post-approval otherwise), the
executor MUST:

1. Compute `payload_hash = SHA-256(canonical_json(payload))`.
2. Emit a Receipt containing `sip_id`, `payload_hash`, `tx_hash`
   (from AIP-2 anchoring), executor identity, timestamp.
3. Anchor `payload_hash` per AIP-2 §Anchoring.

### 8. Conformance

An implementation is SIP-conformant if it passes the AIP-1 conformance
suite at `tests/aip-1/`. The suite MUST cover: each rule, each risk
class, approval routing, and receipt emission.

## Rationale

- **Why deterministic, not LLM-based?** Determinism is auditable and
  falsifiable. An LLM-based validator collapses back into the same
  stochastic surface the protocol exists to guard.
- **Why fail-secure on unknown fields?** Adversaries add fields; a
  permissive validator becomes an injection surface.
- **Why 6 rules, not more?** Additive rules SHOULD be proposed as
  AIP-1.x amendments rather than added ad-hoc, preserving conformance.

## Backwards Compatibility

None — v1.0.

## Reference Implementation

`aixin-protocol/reference/sip.ts` and the AiXin Twin app
(`src/lib/sip.server.ts` in the reference implementation repo).

## Security Considerations

- **Signal, not truth.** SIP treats the intent as untrusted input. Do
  not skip validation for "trusted" upstream models.
- **Canonical JSON.** `payload_hash` MUST use RFC 8785 (JCS) or an
  equivalent canonicalization to prevent hash mismatches on
  semantically-identical payloads.
- **Replay.** Executors MUST reject a Decision Card `approved` more
  than once for the same `sip_id`.
- **Time.** All timestamps MUST be UTC ISO-8601.

## Copyright

CC0 1.0 Universal.
