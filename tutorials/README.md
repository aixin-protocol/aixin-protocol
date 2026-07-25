# AiXin Protocol Tutorials

**Status:** v6 · **Last updated:** 2026-07-24

Hands-on integration guides for agent frameworks. Each tutorial ends with a working, receipt-emitting demo.

| Tutorial | For | Time |
|---|---|---|
| [openclaw.md](./openclaw.md) | OpenClaw agent developers | ~15 min |
| [hermes.md](./hermes.md) | Hermes multi-agent orchestrator users | ~20 min |
| [byo-framework.md](./byo-framework.md) | Any other framework (LangChain, CrewAI, Mastra, custom) | ~25 min |

Before you start, read [`docs/why-aixin.md`](../docs/why-aixin.md) so you know **when** to reach for the protocol and when not to.

## Common prerequisites

- Node.js ≥ 20
- An AiXin manifest (`aixin.json`) at your repo root — see [examples/](../examples/)
- `@aixin-protocol/cli` installed globally: `npm i -g @aixin-protocol/cli`
- (Optional, for on-chain receipts) A BSC Testnet key with test BNB from the [faucet](https://testnet.bnbchain.org/faucet-smart)
