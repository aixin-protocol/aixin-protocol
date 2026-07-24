# Canonical Examples

Every file here MUST validate against its `$schema` reference. CI (Phase 1) will enforce this.

| File | Schema | Risk (per AIP-1) |
|---|---|---|
| `travel.book-flight.intent.json` | `intent.schema.json` | HIGH — spends money, real-world booking |
| `marketing.schedule-posts.intent.json` | `intent.schema.json` | MEDIUM — publishes on external channels |
| `finance.execute-trade.intent.json` | `intent.schema.json` | HIGH — irreversible trade |
| `support.issue-refund.intent.json` | `intent.schema.json` | HIGH — moves money out |
| `aixin.json` | `aixin-manifest.schema.json` | Manifest — declares the agent to the Trust Graph |

Validate locally:

```bash
npx -y ajv-cli validate -s ../schemas/intent.schema.json -d "*.intent.json"
npx -y ajv-cli validate -s ../schemas/aixin-manifest.schema.json -d aixin.json
```
