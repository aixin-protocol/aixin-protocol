# @aixin-protocol/cli

Validator + conformance runner for the AiXin Protocol (SIP + TOP).

## Install

```bash
npm i -g @aixin-protocol/cli
```

## Validate a single artifact

```bash
aixin validate intent           ./my.intent.json
aixin validate outcome-contract ./contract.json
aixin validate manifest         ./aixin.json
aixin validate --auto           ./anything.json   # infer kind from $schema
```

Exit codes: `0` ok, `1` validation failed, `2` usage, `3` parse error.

## Run the conformance suite

```bash
aixin conformance                       # uses bundled fixtures
aixin conformance --dir ./my-fixtures   # your own positive/negative dirs
```

Directory layout expected:

```
conformance/
  positive/<kind>/*.json    # must validate
  negative/<kind>/*.json    # must fail
```

## Kinds

| kind                | schema                                  | AIP    |
|---------------------|-----------------------------------------|--------|
| `intent`            | intent.schema.json                      | AIP-1  |
| `sip-report`        | sip-report.schema.json                  | AIP-1  |
| `outcome-contract`  | outcome-contract.schema.json            | AIP-2  |
| `bounded-loop`      | bounded-loop.schema.json                | AIP-2  |
| `manifest`          | aixin-manifest.schema.json              | AIP-0  |

## 10-minute integration

1. Drop an `aixin.json` at your agent repo root (see `examples/aixin.json`).
2. Wrap your action handler so it emits an `intent` artifact per AIP-1 before execution.
3. Run `aixin validate --auto ./intent.json` in CI; fail the build on non-zero exit.
4. Anchor the resulting `sip-report` to the Trust Graph. Done.
