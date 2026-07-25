# @aixin-protocol/sdk-js

TypeScript/JavaScript SDK for the [AiXin Protocol](https://spec.aixin.io) — validate SIP artifacts, verify signed receipts, and produce canonical JSON for signing.

Pairs with [`@aixin-protocol/cli`](https://www.npmjs.com/package/@aixin-protocol/cli). The CLI is for humans and CI; the SDK is for your app or agent runtime.

## Install

```bash
npm install @aixin-protocol/sdk-js
```

Requires Node.js ≥ 18. Pure ESM.

## Quickstart

### Validate an intent

```js
import { validate, detectKind } from "@aixin-protocol/sdk-js";

const intent = {
  $schema: "https://spec.aixin.io/schemas/intent.schema.json",
  intent_id: "01J8Y2K7ZQ8H3TVJ1E7R4M0Y9C",
  actor: "twin:master:alice",
  action: "transfer_funds",
  parameters: { amount: 250, currency: "USD", to: "acct_9k2" },
  risk: "high",
};

const kind = detectKind(intent); // "intent"
const { ok, errors } = validate(kind, intent);
if (!ok) console.error(errors);
```

### Verify a signed receipt

```js
import { verifyReceipt } from "@aixin-protocol/sdk-js";

const result = verifyReceipt(receipt, { publicKey: pemString });
if (!result.ok) throw new Error(result.reason);
```

### Canonicalize for hashing / signing

```js
import { canonicalize, hashCanonical } from "@aixin-protocol/sdk-js";

const bytes = canonicalize(payload);      // deterministic JSON string
const digest = hashCanonical(payload);    // sha256 hex
```

## API

| Export             | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `validate`         | Validate a document against a bundled protocol schema.   |
| `createValidator`  | Build a validator with your own schema set (versioning). |
| `detectKind`       | Infer artifact kind from `$schema`.                      |
| `verifyReceipt`    | Verify an ed25519-signed receipt envelope.               |
| `canonicalize`     | RFC 8785–style deterministic JSON serialization.         |
| `hashCanonical`    | sha256 hex of `canonicalize(value)`.                     |
| `VERSION`          | SDK semver string.                                       |

Supported artifact kinds: `intent`, `sip-report`, `outcome-contract`, `bounded-loop`, `manifest`.

## License

Apache-2.0
