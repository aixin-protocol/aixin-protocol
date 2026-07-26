# AiXin Baseline Agent (OpenClaw side)

The OpenClaw half of the honest **AiXin vs. OpenClaw** side-by-side demo.
Both agents hit the same ledger — `https://twin-trust-orchestrator.lovable.app/api/public/mcp` —
with attributed API keys. AiXin runs the request through SIP + Decision Card + BSC anchoring.
The OpenClaw baseline just calls the tools.

## What's here

| File | Purpose |
| --- | --- |
| `openclaw-mcp.json` | MCP server definition to paste into OpenClaw Control → MCP → Custom entries. |
| `SOUL.md` | Persona for OpenClaw's `workspace/SOUL.md` (identical to AiXin's refund agent). |
| `skill/refund-agent/SKILL.md` | Optional skill package. |
| `test-scenario.md` | The duplicate-refund trap script. |

## PowerShell setup

```powershell
# 1. Confirm OpenClaw daemon is running
openclaw mcp status --verbose

# 2. Add the AiXin payments MCP server via Control UI:
#    MCP → Custom entries → + Add Entry, then set the fields to match
#    openclaw-mcp.json exactly:
#      name        : aixin-payments
#      transport   : streamable-http
#      url         : https://twin-trust-orchestrator.lovable.app/api/public/mcp
#      headers     : Authorization = Bearer aixin-demo-key-openclaw
#      enabled     : ON
#    Click "Save & Publish".

# 3. Reload MCP runtime and verify
openclaw mcp reload
openclaw mcp doctor --probe
openclaw mcp status --verbose
# Expect: aixin-payments → 4 tools (get_customer, list_orders, list_refunds, issue_refund)

# 4. Copy the persona into your workspace
Copy-Item .\SOUL.md $HOME\.openclaw\workspace\SOUL.md -Force
```

## Run the demo

Open `test-scenario.md` and paste the prompt into a new OpenClaw session.
The seed data already contains a fully-refunded order (`ORD-1001`, $129.00),
so the baseline agent will happily double-refund. Then run the same prompt
inside AiXin at `/dashboard/ask` and compare: AiXin blocks on a Decision Card,
the receipt anchors to BSC Testnet, the duplicate is prevented.

## Attribution

- Bearer `aixin-demo-key-openclaw` → logged as `openclaw-baseline`.
- Bearer `aixin-demo-key-aixin`    → logged as `aixin-governed`.

Both write to `demo_refunds` and `demo_agent_actions` in the shared ledger.
