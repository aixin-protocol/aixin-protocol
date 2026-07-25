// packages/adapter/test/reverse.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fromOpenAIFunction, fromLangChainTool, fromOpenAPIOperation, reverseAdapt } from '../dist/reverse.js';

test('OpenAI function → manifest', () => {
  const m = fromOpenAIFunction({
    name: 'transfer_funds',
    description: 'Transfer USDC to a recipient',
    parameters: {
      type: 'object',
      properties: { to: { type: 'string' }, amount: { type: 'number' } },
      required: ['to', 'amount'],
    },
  });
  assert.equal(m.aixin, '1');
  assert.equal(m.risk, 'high');
  assert.equal(m.inputs.length, 2);
  assert.equal(m.source.format, 'openai.function');
});

test('LangChain tool → manifest', () => {
  const m = fromLangChainTool({
    name: 'search_web',
    description: 'Read-only web search',
    schema: { properties: { query: { type: 'string' } }, required: ['query'] },
  });
  assert.equal(m.risk, 'low');
});

test('OpenAPI operation → manifest', () => {
  const m = fromOpenAPIOperation({
    operationId: 'createBooking',
    description: 'Book a hotel room',
    parameters: [{ name: 'hotelId', required: true, schema: { type: 'string' } }],
  });
  assert.equal(m.risk, 'medium');
  assert.equal(m.name, 'createBooking');
});

test('reverseAdapt auto-detects', () => {
  const m = reverseAdapt({ name: 'ping', parameters: { properties: {} } });
  assert.equal(m.source.format, 'openai.function');
});
