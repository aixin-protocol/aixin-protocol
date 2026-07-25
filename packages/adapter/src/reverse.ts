// packages/adapter/src/reverse.ts
// Reverse Manifest Adapter: takes an external agent/skill descriptor
// (OpenAI function spec, LangChain Tool JSON, or generic OpenAPI operation)
// and returns a canonical AiXin SkillManifest.
//
// This is a pure function — no network, no filesystem — so it can run in
// the browser, in Node, or inside a server function.

export type AiXinSkillManifest = {
  aixin: '1';
  kind: 'skill';
  id: string;
  name: string;
  version: string;
  description?: string;
  inputs: { name: string; type: string; required: boolean; description?: string }[];
  outputs: { name: string; type: string; description?: string }[];
  risk: 'low' | 'medium' | 'high';
  source: { format: string; ref?: string };
};

type OpenAIFn = {
  name: string;
  description?: string;
  parameters?: { type?: string; properties?: Record<string, any>; required?: string[] };
};

type LangChainTool = {
  name: string;
  description?: string;
  schema?: { properties?: Record<string, any>; required?: string[] };
};

type OpenAPIOp = {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: { name: string; required?: boolean; schema?: { type?: string }; description?: string }[];
  requestBody?: { content?: Record<string, { schema?: any }> };
};

const RISK_KEYWORDS: Record<'high' | 'medium', RegExp> = {
  high: /(transfer|send|pay|withdraw|delete|revoke|approve|mint|burn)/i,
  medium: /(create|update|write|post|book|charge|refund)/i,
};

function inferRisk(name: string, desc = ''): AiXinSkillManifest['risk'] {
  const hay = `${name} ${desc}`;
  if (RISK_KEYWORDS.high.test(hay)) return 'high';
  if (RISK_KEYWORDS.medium.test(hay)) return 'medium';
  return 'low';
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function propsToInputs(
  props: Record<string, any> = {},
  required: string[] = [],
): AiXinSkillManifest['inputs'] {
  return Object.entries(props).map(([name, schema]) => ({
    name,
    type: (schema?.type as string) ?? 'string',
    required: required.includes(name),
    description: schema?.description,
  }));
}

export function fromOpenAIFunction(fn: OpenAIFn): AiXinSkillManifest {
  return {
    aixin: '1',
    kind: 'skill',
    id: `skill.${slug(fn.name)}`,
    name: fn.name,
    version: '0.1.0',
    description: fn.description,
    inputs: propsToInputs(fn.parameters?.properties, fn.parameters?.required),
    outputs: [{ name: 'result', type: 'object' }],
    risk: inferRisk(fn.name, fn.description),
    source: { format: 'openai.function' },
  };
}

export function fromLangChainTool(tool: LangChainTool): AiXinSkillManifest {
  return {
    aixin: '1',
    kind: 'skill',
    id: `skill.${slug(tool.name)}`,
    name: tool.name,
    version: '0.1.0',
    description: tool.description,
    inputs: propsToInputs(tool.schema?.properties, tool.schema?.required),
    outputs: [{ name: 'result', type: 'object' }],
    risk: inferRisk(tool.name, tool.description),
    source: { format: 'langchain.tool' },
  };
}

export function fromOpenAPIOperation(op: OpenAPIOp, ref?: string): AiXinSkillManifest {
  const name = op.operationId ?? op.summary ?? 'operation';
  const params = (op.parameters ?? []).map((p) => ({
    name: p.name,
    type: p.schema?.type ?? 'string',
    required: Boolean(p.required),
    description: p.description,
  }));
  return {
    aixin: '1',
    kind: 'skill',
    id: `skill.${slug(name)}`,
    name,
    version: '0.1.0',
    description: op.description ?? op.summary,
    inputs: params,
    outputs: [{ name: 'response', type: 'object' }],
    risk: inferRisk(name, op.description ?? op.summary ?? ''),
    source: { format: 'openapi.operation', ref },
  };
}

export function reverseAdapt(input: unknown, ref?: string): AiXinSkillManifest {
  const any = input as any;
  if (any?.parameters?.properties) return fromOpenAIFunction(any);
  if (any?.schema?.properties) return fromLangChainTool(any);
  if (any?.operationId || any?.responses) return fromOpenAPIOperation(any, ref);
  throw new Error('reverseAdapt: unrecognised source format');
}
