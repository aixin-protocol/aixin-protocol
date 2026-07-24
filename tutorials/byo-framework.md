# Tutorial — Bring Your Own Framework

**Status:** v6 · **Last updated:** 2026-07-24 · **Time:** ~25 min

If your framework is not OpenClaw or Hermes (LangChain, CrewAI, Mastra, Autogen, custom), integrate AiXin directly against the specs.

You only need two touch points:

1. **Before executing a consequential action**, call `SIP.validate(intent)`.
2. **Before starting an agent run**, load its `aixin.json` and enforce TOP counters as the loop runs.

That's it. Everything else — Decision Cards, receipt anchoring — is UI + a single SDK call.

---

## 1. Install

```bash
npm i @aixin/sdk viem
```

## 2. Minimal integration

```ts
import { validateIntent, hashPayload, anchorReceipt } from "@aixin/sdk";
import manifest from "./aixin.json";

async function runAction(intent) {
  // 1. SIP
  const report = validateIntent(intent);
  if (report.requires_approval) {
    const approved = await surfaceDecisionCard(report); // your UI
    if (!approved) return { status: "rejected", report };
  }

  // 2. Execute your real handler
  const result = await myFrameworkTool(intent);

  // 3. Receipt
  const payloadHash = await hashPayload({ intent, result });
  const receipt = await anchorReceipt(report.sip_id, payloadHash);
  return { status: "approved", result, receipt };
}
```

## 3. TOP counters (framework-agnostic)

```ts
import { createTopEnvelope } from "@aixin/sdk";

const top = createTopEnvelope(manifest.twin.outcome_contract);

while (!done) {
  top.assertCanContinue(); // throws on loop_cap / cost / rate breach
  const step = await agent.step();
  top.recordStep({ cost_usd: step.cost });
  done = step.done;
}
```

## 4. Conformance

```bash
aixin conformance ./my-agent.ts --profile generic
```

The generic profile only asserts that (a) every consequential action passes through `validateIntent`, and (b) the run halts on TOP breach. It does not assume any particular framework runtime.

---

## Design rules (all frameworks)

- **Fail-secure.** If validation errors or the network is down, do **not** execute.
- **Never trust the LLM to enforce its own limits.** All caps live in `aixin.json`, checked by deterministic code.
- **One agent = one identity.** Register each agent in the Identity Registry once; reuse its `agent_id` forever.
- **Every receipt links its parent.** Multi-agent runs form a receipt tree, not a flat log.

## Framework notes

| Framework | Notes |
|---|---|
| **LangChain** | Wrap tools with `validateIntent` inside the tool's `_call`. Use `AgentExecutor` `max_iterations` = `loop_cap`. |
| **CrewAI** | One manifest per `Agent`; hook `validateIntent` in the `Task` pre-run callback. |
| **Mastra** | Use Mastra middleware; call `top.recordStep` in `onStepFinish`. |
| **Autogen** | Wrap `GroupChatManager` with a TOP envelope; wrap each `AssistantAgent`'s function-calls with SIP. |
| **Custom** | Follow the two touch points above — nothing else is required. |

## Next

- Publish your manifest by opening a PR to your framework's marketplace.
- Once your agent has ≥100 clean testnet receipts, request a mainnet identity migration.
