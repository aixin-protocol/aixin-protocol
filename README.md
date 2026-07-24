# AiXin Protocol

**The open trust layer for agentic AI.**
AiXin Protocol is a two-part open specification that lets any AI agent — ours or anyone else's — prove that its actions are governed, bounded, and auditable.

- **SIP — Signal Intent Protocol** — per-action validation. Turns an LLM's stochastic intent into a deterministic, typed, policy-checked action with a signed receipt.
- **TOP — Twin Operating Protocol** — per-agent operating envelope. Outcome contracts, bounded loops, pre-flight reflection, and on-chain revocation.

Together: **SIP + TOP = AiXin Protocol.**
Analogy: HTTP + TLS. SMTP + DKIM. Checklists + type ratings.

---

## What lives here

| Path | Contents | License |
|---|---|---|
| [`specs/AIP-0-Process.md`](specs/AIP-0-Process.md) | RFC-style AIP process | CC0 |
| [`specs/AIP-1-SIP.md`](specs/AIP-1-SIP.md) | Signal Intent Protocol v1.0 (normative) | CC0 |
| [`specs/AIP-2-TOP.md`](specs/AIP-2-TOP.md) | Twin Operating Protocol v1.0 (normative) | CC0 |
| [`schemas/`](schemas/) | JSON Schema (draft 2020-12) for every contract | CC0 |
| [`examples/`](examples/) | Canonical Travel / Marketing / Finance / Support intents | CC0 |
| [`tutorials/`](tutorials/) | OpenClaw, Hermes, BYO-framework integration guides | Apache-2.0 |
| [`docs/why-aixin.md`](docs/why-aixin.md) | When (and when not) to use the protocol, with worked examples | CC0 |
| `ROADMAP.md` | Execution roadmap through v1.0 + IDO | — |

Spec text is CC0 (maximum reuse). Reference tooling shipped alongside is Apache-2.0.

---

## Adopting AiXin Protocol in ~10 minutes

1. Drop an `aixin.json` at your agent repo root — see [`schemas/aixin-manifest.schema.json`](schemas/aixin-manifest.schema.json).
2. `npm i @aixin/protocol` and wrap your action handler: `await aixin.execute(intent, manifest)`.
3. Anchor receipts to the AiXin Trust Graph (BSC testnet today, mainnet after audit).
4. Display the **SIP+TOP Verified** badge in your marketplace listing.

Full quickstart: `docs/quickstart.md` (Phase 2, coming).

---

## AIP index

| # | Title | Status |
|---|---|---|
| AIP-0 | AIP Process | Draft |
| AIP-1 | Signal Intent Protocol (SIP) | Draft |
| AIP-2 | Twin Operating Protocol (TOP) | Draft |

---

## Governance

This repository will be transferred to the **AiXin Foundation** (neutral steward) once formed (Roadmap Phase 6). Until then, the AiXin core team acts as interim editors. All changes flow through the AIP process — including from us.

## License

- Specifications (`specs/`, `schemas/`, `examples/`): [CC0 1.0](LICENSE).
- Everything else: [Apache-2.0](LICENSE).
