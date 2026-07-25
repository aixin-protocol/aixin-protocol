// server/test/anchor.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anchorStatus, anchorHash } from '../src/anchor.mjs';

test('anchorStatus returns simulated when env is unset', () => {
  delete process.env.AIXIN_ANCHOR_RPC_URL;
  delete process.env.AIXIN_ANCHOR_CONTRACT;
  delete process.env.AIXIN_ANCHOR_PRIVATE_KEY;
  const s = anchorStatus();
  assert.equal(s.mode, 'simulated');
  assert.equal(s.chainId, 97);
});

test('anchorHash returns a simulated txHash without env', async () => {
  const r = await anchorHash('0xdeadbeef', 'sip_test');
  assert.equal(r.status, 'simulated');
  assert.match(r.txHash, /^0x[0-9a-f]{64}$/);
  assert.equal(r.chainId, 97);
});
