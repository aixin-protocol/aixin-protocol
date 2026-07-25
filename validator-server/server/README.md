# @aixin-protocol/validator-server

Hosted HTTP reference validator for the AiXin Protocol (SIP + TOP).

Accepts intents, validates against the normative schemas, and returns
Ed25519-signed receipts. Integrators can call the service directly instead
of embedding `@aixin-protocol/sdk-js` or `aixin-protocol-sdk` (Python).

## Install

```
npm i -g @aixin-protocol/validator-server
aixin-validator-server
# listening on :8787
```

Or run from source:

```
git clone https://github.com/aixin-protocol/aixin-protocol
cd aixin-protocol/server
npm i && npm start
```

## Configuration

| Env | Description |
| --- | --- |
| `PORT` | Listen port (default `8787`) |
| `HOST` | Listen host (default `0.0.0.0`) |
| `AIXIN_SIGNING_KEY` | Ed25519 PEM private key. If unset, an ephemeral key is generated (dev only). |

Generate a signing key:

```
openssl genpkey -algorithm Ed25519 -out signing.pem
export AIXIN_SIGNING_KEY="$(cat signing.pem)"
```

## Endpoints

- `GET  /healthz` — liveness
- `GET  /v1/kinds` — list supported artifact kinds
- `GET  /v1/pubkey` — the server's Ed25519 public key (PEM)
- `POST /v1/validate` — `{ kind?, document }` → `{ ok, kind, errors, hash }`
- `POST /v1/receipts` — validate then sign; returns receipt on success
- `POST /v1/receipts/verify` — `{ receipt, pubkey? }` → `{ ok }`

### Example

```
curl -X POST http://localhost:8787/v1/receipts \
  -H 'content-type: application/json' \
  -d '{"document":{"$schema":"https://spec.aixin.io/intent.schema.json","intent_id":"int_1","version":"1.0","actor":{"twin_id":"twn_1","kind":"master"},"action":{"name":"transfer","params":{"amount":"1.00","currency":"USDC","recipient":"0xabc"}},"risk":"low","issued_at":"2026-07-25T00:00:00Z"}}'
```

## Interop

Canonicalization matches `@aixin-protocol/sdk-js` and `aixin-protocol-sdk`
byte-for-byte, so hashes and signatures are portable across the three
reference implementations.

## License

Apache-2.0
