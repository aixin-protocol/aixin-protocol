# Validator Server — BSC Anchor Patch (v1.1.0)

Apply three small edits to `server/src/server.mjs`:

## 1. Import at the top

```js
import { anchorStatus, anchorHash } from './anchor.mjs';
```

## 2. Add two routes (near your other route registrations)

```js
app.get('/v1/anchor/status', async () => anchorStatus());

app.post('/v1/anchor', async (req, reply) => {
  const { payloadHash, sipId } = req.body ?? {};
  if (!payloadHash) return reply.code(400).send({ error: 'payloadHash required' });
  return anchorHash(payloadHash, sipId);
});
```

## 3. Extend `POST /v1/receipts` to honour `?anchor=1`

Inside the existing handler, after you have signed the receipt:

```js
if (req.query?.anchor === '1' || req.query?.anchor === 'true') {
  receipt.anchor = await anchorHash(receipt.hash, receipt.sipId);
}
return receipt;
```

## Environment (optional, live mode)

- `AIXIN_ANCHOR_RPC_URL` — e.g. `https://data-seed-prebsc-1-s1.binance.org:8545`
- `AIXIN_ANCHOR_CONTRACT` — deployed AuditAnchor address
- `AIXIN_ANCHOR_PRIVATE_KEY` — funded testnet key

Without these, `/v1/anchor/status` returns `{ mode: "simulated" }` and CI stays green.
