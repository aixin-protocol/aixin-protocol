# Tutorial — Add AiXin Protocol to an OpenClaw Agent

**Status:** v6 · **Last updated:** 2026-07-24 · **Time:** ~15 min

This walkthrough wraps an OpenClaw agent so that every consequential tool-call is validated by **SIP**, bounded by **TOP**, and receipt-anchored on BSC Testnet.

> **When you need this:** the moment your OpenClaw agent takes an action that costs money, posts publicly, or must be defended to an auditor. See [why-aixin.md](../docs/why-aixin.md).

---

## 1. Install

```bash
npm i @aixin-protocol/cli @aixin/sdk viem
```

## 2. Add a manifest

Create `aixin.json` at your repo root:

```json
{
  "$schema": "https://spec.aixin.io/schemas/manifest.v1.json",
  "name": "openclaw-travel-agent",
  "version": "0.1.0",
  "framework": "openclaw",
  "twin": {
    "role": "specialist",
    "outcome_contract": {
      "goal": "book travel under user-approved budget",
      "max_actions_per_hour": 6,
      "max_total_cost_usd": 2000,
      "loop_cap": 8
    }
  },
  "high_risk_actions": ["book_flight", "book_hotel", "execute_trade", "issue_refund"],
  "registries": { "chain": "bsc-testnet" }
}
```

Validate it:

```bash
aixin validate aixin.json
```

## 3. Wrap your OpenClaw tool-call

OpenClaw agents expose actions as `tool` handlers. Wrap each consequential handler with `withSIP`:

```ts
// agent.ts
import { createAgent, tool } from "openclaw";
import { withSIP, withTOP, anchorReceipt } from "@aixin/sdk";

const bookFlight = withSIP(
  tool({
    name: "book_flight",
    parameters: { from: "string", to: "string", amount: "number", currency: "string" },
    async run(input) {
      // your real booking call goes here
      return { pnr: "ABC123", ...input };
    },
  }),
);

const agent = withTOP(
  createAgent({
    model: "gpt-4o",
    tools: [bookFlight],
  }),
  { manifestPath: "./aixin.json" },
);

const result = await agent.run("Book LHR→NRT under $1200 next Tuesday");
console.log(result.receipt); // { sip_id, tx_hash, chain: "bsc-testnet", ... }
```

### What `withSIP` does at runtime

1. Intercepts the LLM's structured intent before `run()` executes.
2. Runs the 6-rule deterministic validator (schema, known-action, amount cap, currency, params, no-extras).
3. If `risk === "high"` or `requires_approval`, it pauses and emits a Decision Card event; your host app renders it.
4. On approve, it hashes the payload, calls the tool, and anchors the receipt via the Identity + Reputation + Validation registries.

### What `withTOP` does

Enforces the manifest's `outcome_contract`: caps loop iterations, per-hour actions, and cumulative $ spend. On breach, the agent halts and emits a TOP violation receipt — no runaway loops.

## 4. Run the conformance suite against your agent

```bash
aixin conformance ./agent.ts --profile openclaw
```

Passing runs entitle you to display the **"SIP+TOP Verified"** badge in the OpenClaw marketplace.

## 5. Verify a receipt

```bash
aixin verify <tx-hash> --chain bsc-testnet
```

Or open the tx in [BscScan Testnet](https://testnet.bscscan.com/).

---

## Troubleshooting

- **"SIP validation failed: unknown action"** — add the action name to `KNOWN_ACTIONS` in your manifest, or use a canonical action from [`examples/`](../examples/).
- **"TOP loop_cap exceeded"** — raise `loop_cap` in the manifest *only* if the workflow legitimately needs more iterations. Prefer fixing the loop.
- **Receipt shows `status: "simulated"`** — you're missing `BSC_TESTNET_PRIVATE_KEY` or contract addresses in env. Fine for dev; set them for real anchoring.

## Next

- Read [AIP-1 SIP](../specs/AIP-1-sip.md) and [AIP-2 TOP](../specs/AIP-2-top.md).
- Browse [canonical examples](../examples/).
- Migrate to mainnet once your agent has ≥100 clean testnet receipts.
