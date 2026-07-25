---
title: Quickstart
description: Get an AiXin twin issuing signed receipts in 5 minutes.
---

# Quickstart

Get an AiXin twin issuing signed, anchored receipts in about five minutes.
You'll need Node 20+ and a terminal.

## 1. Install the CLI

```bash
npm install -g @aixin-protocol/cli
aixin --version
```

## 2. Scaffold a skill

```bash
aixin init my-first-skill
cd my-first-skill
```

This creates a minimal skill manifest, an intent schema, and a sample
receipt payload.

## 3. Validate against the spec

```bash
aixin validate manifest.json
aixin validate intent.json --schema intent
```

Both should print `✓ valid`.

## 4. Run the reference validator server

```bash
npx @aixin-protocol/validator-server
# → listening on http://localhost:8787
```

Sign a receipt:

```bash
curl -X POST http://localhost:8787/v1/receipts \
  -H 'content-type: application/json' \
  -d '{"sipId":"sip_hello","action":"greet","payload":{"msg":"hi"}}'
```

You'll get back a receipt with an Ed25519 signature and a canonical hash.

## 5. Anchor to BSC Testnet (optional)

Set three env vars, then repeat the receipt call with `?anchor=1`:

```bash
export AIXIN_ANCHOR_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
export AIXIN_ANCHOR_CONTRACT=0x...        # your deployed AuditAnchor
export AIXIN_ANCHOR_PRIVATE_KEY=0x...     # funded testnet key

curl -X POST 'http://localhost:8787/v1/receipts?anchor=1' \
  -H 'content-type: application/json' \
  -d '{"sipId":"sip_hello","action":"greet","payload":{"msg":"hi"}}'
```

The response now includes an `anchor` object with the on-chain txHash.
Without those env vars, the server stays in `simulated` mode and returns
a deterministic fake hash — safe for CI.

## Next steps

- **SDKs** — [`@aixin-protocol/sdk-js`](https://www.npmjs.com/package/@aixin-protocol/sdk-js) and `aixin-protocol-sdk` (Python) for signing and verifying in-process.
- **Adapter** — [`@aixin-protocol/adapter`](https://www.npmjs.com/package/@aixin-protocol/adapter) to import existing OpenAI / LangChain / OpenAPI tools.
- **Spec** — read [AIP-1](/specs/aip-1) (SIP) and [AIP-2](/specs/aip-2) (Receipts).
