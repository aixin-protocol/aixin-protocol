# Contributing to AiXin Protocol

Thank you for helping make AI agents auditable by default.

## Ways to contribute

- **Editorial fixes** (typos, clarifications) — open a PR directly.
- **Schema tweaks / new examples** — open a PR; label `schemas` or `examples`.
- **Normative changes to a spec (AIP-1, AIP-2, …)** — MUST follow the [AIP process](specs/AIP-0-Process.md). Open an issue first with the AIP number and rationale.
- **New AIP proposal** — copy `specs/AIP-0-Process.md` as a template, number it next in sequence, submit as draft PR.

## Ground rules

1. Every normative claim uses **MUST / SHOULD / MAY** (RFC 2119) — no ambiguous "should probably".
2. Every schema change ships with a **migration note** in `CHANGELOG.md`.
3. Every example MUST validate against the referenced schema — CI enforces this.
4. Discussion happens in GitHub Discussions, decisions land in AIPs. Chat is not a source of record.

## CLA

By submitting a contribution you agree to the AiXin Contributor License Agreement (managed via EasyCLA once the Foundation is formed — until then, contributions are dedicated to CC0 for spec files and Apache-2.0 for code).

## Local checks

```bash
npm i -g ajv-cli
ajv validate -s schemas/intent.schema.json -d "examples/*.intent.json"
```

## Editors

Interim editors: AiXin core team. Once AIP-0 ratifies, an editors group (3–5, incl. at least one non-AiXin member) takes over.
