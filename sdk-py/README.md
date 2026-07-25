# `@aixin-protocol/sdk-py`

Python SDK for the AiXin Signal Intent Protocol (SIP).

Provides the same three core primitives as the TypeScript SDK, with byte-for-byte canonicalization interop:

- **`validate(intent, schema, rules)`** — JSON Schema + deterministic rule checks.
- **`canonicalize(obj)` / `hash_canonical(obj)`** — deterministic JSON serialization and SHA-256 hashing.
- **`verify(receipt, public_key)`** — Ed25519 receipt-signature verification.

## Install

```bash
pip install aixin-protocol-sdk
```

## Quick start

```python
from aixin_protocol_sdk import validate, canonicalize, hash_canonical, verify
from aixin_protocol_sdk.keys import generate_keypair

# 1. Validate an intent against a SIP schema and rules
intent = {
    "kind": "sip:transfer:v1",
    "params": {
        "recipient": "0x1234...",
        "amount": "100.00",
        "denomination": "USD"
    }
}

schema = {
    "type": "object",
    "properties": {
        "kind": {"const": "sip:transfer:v1"},
        "params": {
            "type": "object",
            "properties": {
                "recipient": {"type": "string", "pattern": "^0x[a-fA-F0-9]{40}$"},
                "amount": {"type": "string", "pattern": "^\\d+\\.\\d{2}$"},
                "denomination": {"enum": ["USD", "EUR", "CNY"]}
            },
            "required": ["recipient", "amount", "denomination"]
        }
    },
    "required": ["kind", "params"]
}

rules = [
    {"path": "params.amount", "op": "lte", "value": "1000.00"}
]

result = validate(intent, schema=schema, rules=rules)
assert result.valid is True
assert result.kind == "sip:transfer:v1"

# 2. Canonicalize and hash
payload = {"b": 2, "a": {"z": 1, "y": 2}}
canonical = canonicalize(payload)
assert canonical == {"a": {"y": 2, "z": 1}, "b": 2}

digest = hash_canonical(payload)
# digest is a 64-character hex string

# 3. Sign and verify receipts
private_key, public_key = generate_keypair()
receipt = {
    "version": "sip:receipt:v1",
    "canonical_hash": digest,
    "decision": "approved",
    "timestamp": "2026-07-25T00:00:00Z"
}

# In production the validator signs; here we show the round-trip.
from aixin_protocol_sdk import sign_receipt
signed = sign_receipt(receipt, private_key)

assert verify(signed, public_key) is True
```

## Deterministic canonicalization

`canonicalize` recursively sorts object keys and emits compact JSON with no
insignificant whitespace. It is designed to produce the same bytes as
`@aixin-protocol/sdk-js` so that cross-language validators agree on hashes.

## API

### `validate(intent, schema=None, rules=None)`

Returns a `ValidationResult`:

- `valid: bool`
- `kind: str | None`
- `errors: list[str]`

### `canonicalize(obj)`

Returns a new object with recursively sorted keys, suitable for
`json.dumps(..., separators=(",", ":"))`.

### `hash_canonical(obj)`

Returns the hex-encoded SHA-256 of the canonical JSON bytes.

### `verify(receipt, public_key)`

Verifies the Ed25519 signature on a receipt dict. `public_key` may be hex
string or 32 raw bytes. Returns `True` / `False`.

### `sign_receipt(receipt, private_key)`

Convenience helper for testing / local validators. Adds `signature` and
`public_key` fields to the receipt dict.

## License

MIT — see the main AiXin Protocol repository.
