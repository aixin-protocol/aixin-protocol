# AiXin Protocol — Deployments

Canonical registry of ERC-8004 contract deployments used by AiXin Protocol reference tooling.

## Networks

### BSC Testnet (chainId `97`)

RPC (public): `https://data-seed-prebsc-1-s1.binance.org:8545`
Explorer: https://testnet.bscscan.com

| Registry | Address | Source | ABI |
|---|---|---|---|
| Identity   | *TBD — populate after deploy* | [`ERC8004.sol`](../../contracts/ERC8004.sol) | [`abi/identity.json`](./abi/identity.json) |
| Reputation | *TBD — populate after deploy* | same | [`abi/reputation.json`](./abi/reputation.json) |
| Validation | *TBD — populate after deploy* | same | [`abi/validation.json`](./abi/validation.json) |

Anchor sink (audit-hash contract): SEPARATE from the three registries above. Reference implementation
uses a plain EOA `sendTransaction({ to: self, data: hash })` on BSC Testnet; production deployments
SHOULD swap in a dedicated `AuditAnchor` contract with an `event Anchored(bytes32 sipId, bytes32 hash)`.

## Manifest binding

An `aixin.json` manifest MUST reference deployments by `{ chain, address }` for each registry. Example:

```json
{
  "registries": {
    "identity":   { "chain": "eip155:97", "address": "0x..." },
    "reputation": { "chain": "eip155:97", "address": "0x..." },
    "validation": { "chain": "eip155:97", "address": "0x..." },
    "anchor":     { "chain": "eip155:97", "address": "0x..." }
  }
}
```

## Update procedure

1. Deploy `ERC8004.sol` via Remix / Foundry to target network.
2. Verify source on the block explorer.
3. Add a row above with the checksummed address and explorer link.
4. Bump `CHANGELOG.md` under **Deployments**.
5. Update `examples/aixin.json` if the canonical example should follow.

Addresses are **append-only** in this file. Never overwrite — if a contract is superseded, mark the
old row `DEPRECATED (see AIP-X)` and add a new row below.
