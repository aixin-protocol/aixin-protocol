# Tutorial — Add AiXin Protocol to a Hermes Multi-Agent Workflow

**Status:** v6 · **Last updated:** 2026-07-24 · **Time:** ~20 min

Hermes orchestrates multiple specialist agents behind a coordinator. AiXin wraps **each specialist** with SIP+TOP and gives the coordinator a single receipt stream to reason over.

> **When you need this:** as soon as one specialist in your Hermes graph can spend money, publish content, or trigger an external side-effect. See [why-aixin.md](../docs/why-aixin.md).

---

## 1. Install

```bash
npm i @aixin/protocol-cli @aixin/sdk @aixin/hermes-adapter
```

## 2. Manifest per specialist

Hermes specialists each get their own `aixin.json`. Example for a Finance specialist:

```json
{
  "$schema": "https://spec.aixin.io/schemas/manifest.v1.json",
  "name": "hermes-finance-specialist",
  "version": "0.1.0",
  "framework": "hermes",
  "twin": {
    "role": "specialist",
    "outcome_contract": {
      "goal": "execute trades within user risk budget",
      "max_actions_per_hour": 10,
      "max_total_cost_usd": 5000,
      "loop_cap": 5
    }
  },
  "high_risk_actions": ["execute_trade", "transfer_funds", "issue_refund"],
  "registries": { "chain": "bsc-testnet" }
}
```

Validate the whole workspace:

```bash
aixin validate ./specialists/*/aixin.json
```

## 3. Register specialists with the Hermes adapter

```ts
// coordinator.ts
import { Hermes } from "hermes";
import { registerAixinSpecialist } from "@aixin/hermes-adapter";
import financeSpec from "./specialists/finance/aixin.json";
import marketingSpec from "./specialists/marketing/aixin.json";

const hermes = new Hermes({ model: "gpt-4o" });

registerAixinSpecialist(hermes, {
  manifest: financeSpec,
  handler: async (intent) => {
    // your real trade execution
    return { fill_price: 42.13, qty: intent.params.qty };
  },
});

registerAixinSpecialist(hermes, {
  manifest: marketingSpec,
  handler: async (intent) => {
    return { post_id: "tw_9x1" };
  },
});

const run = await hermes.run("Rebalance my portfolio and announce it on Twitter");
```

## 4. What the adapter does

For every specialist call inside a Hermes plan:

1. **SIP validate** the specialist's intent (6 rules, fail-secure).
2. **TOP envelope check** against that specialist's `outcome_contract`.
3. High-risk → surface a **Decision Card** through the Hermes coordinator; the coordinator pauses that branch, other branches keep running.
4. On approve → execute handler → hash payload → **anchor receipt** with Identity/Reputation/Validation registries.
5. Emit a Hermes `event: "aixin.receipt"` that the coordinator can consume.

## 5. Coordinator-level receipts

The Hermes coordinator itself gets a `master` manifest so the *entire* multi-agent run produces one parent receipt linking every child receipt:

```json
{
  "twin": { "role": "master", "outcome_contract": { "loop_cap": 20, "max_total_cost_usd": 10000 } }
}
```

Query the resulting run:

```bash
aixin trace <master-tx-hash> --chain bsc-testnet
# → tree of child receipts, one per specialist call
```

## 6. Conformance

```bash
aixin conformance ./coordinator.ts --profile hermes
```

Passing entitles the workflow to a **"SIP+TOP Verified · Multi-agent"** badge.

---

## Design notes for Hermes users

- **One manifest per specialist**, not per tool. TOP is about bounding an agent, not a function.
- **Never share private keys across specialists.** Each specialist gets its own on-chain agent identity, so its reputation is portable.
- **Decision Cards are branch-scoped.** A pending approval on the Finance specialist does not block the Marketing branch — this is the whole point of running them under Hermes.

## Troubleshooting

- **"Coordinator receipt missing child links"** — the coordinator manifest must be role `master`, and specialists must be registered via `registerAixinSpecialist` (not called as raw Hermes tools).
- **"Two specialists with same agent_id"** — you reused a private key. Each specialist needs its own key/identity registration.

## Next

- Read [AIP-2 TOP §4 — Coordinator/Specialist relationship](../specs/AIP-2-top.md).
- See the [Marketing + Finance canonical example](../examples/).
