# @aixin-protocol/adapter

Reverse Manifest Adapter for the AiXin Protocol.

Takes an existing agent/tool descriptor from another ecosystem and returns
a canonical AiXin `SkillManifest`. Pure, deterministic, no I/O.

## Supported source formats

- `openai.function` — OpenAI function-calling / tool spec
- `langchain.tool` — LangChain Tool JSON
- `openapi.operation` — OpenAPI 3.x operation object

## Usage

```ts
import { reverseAdapt } from '@aixin-protocol/adapter';

const manifest = reverseAdapt(openAIFunctionSpec);
// → { aixin: '1', kind: 'skill', id: 'skill.transfer-funds', risk: 'high', ... }
```

## Risk inference

Risk is inferred heuristically from name + description. High-risk verbs
(transfer, pay, delete, approve, mint, burn) → `high`. Write verbs → `medium`.
Everything else → `low`. Downstream governance policies should treat this
as a hint, not a source of truth.
