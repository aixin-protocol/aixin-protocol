# AiXin Protocol Conformance Suite

Fixtures a compliant implementation MUST agree on.

```
positive/<kind>/*.json   # implementation MUST accept
negative/<kind>/*.json   # implementation MUST reject, with a reason
```

Run with the reference validator:

```bash
node cli/bin/aixin.mjs conformance
```

Or via npm test:

```bash
cd cli && npm test
```

Every fixture carries a `$schema` pointing to the artifact kind so `--auto`
detection works. Negative fixtures include a top-level `_reason` comment key
(stripped by the validator) documenting *why* they must be rejected.
