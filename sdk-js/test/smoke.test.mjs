import { test } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, sign as cryptoSign } from "node:crypto";
import {
  canonicalize,
  hashCanonical,
  detectKind,
  verifyReceipt,
  VERSION,
} from "../src/index.mjs";

test("canonicalize sorts keys deterministically", () => {
  const a = canonicalize({ b: 1, a: 2, nested: { z: 1, a: 2 } });
  const b = canonicalize({ nested: { a: 2, z: 1 }, a: 2, b: 1 });
  assert.equal(a, b);
});

test("hashCanonical is stable across key order", () => {
  const h1 = hashCanonical({ x: [1, 2, 3], y: "hi" });
  const h2 = hashCanonical({ y: "hi", x: [1, 2, 3] });
  assert.equal(h1, h2);
  assert.match(h1, /^[0-9a-f]{64}$/);
});

test("detectKind recognizes known schema URLs", () => {
  assert.equal(
    detectKind({ $schema: "https://spec.aixin.io/schemas/intent.schema.json" }),
    "intent"
  );
  assert.equal(
    detectKind({ $schema: "https://spec.aixin.io/schemas/aixin-manifest.schema.json" }),
    "manifest"
  );
  assert.equal(detectKind({}), null);
});

test("verifyReceipt round-trips a real ed25519 signature", () => {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const payload = { action: "transfer_funds", amount: 100, to: "acct_1" };
  const sig = cryptoSign(null, Buffer.from(canonicalize(payload)), privateKey)
    .toString("hex");
  const receipt = {
    payload,
    signature: sig,
    public_key: publicKey.export({ type: "spki", format: "pem" }),
  };
  const ok = verifyReceipt(receipt);
  assert.equal(ok.ok, true);

  // Tamper: flip a byte in payload -> verify fails.
  const tampered = { ...receipt, payload: { ...payload, amount: 999 } };
  const bad = verifyReceipt(tampered);
  assert.equal(bad.ok, false);
});

test("VERSION is a semver-ish string", () => {
  assert.match(VERSION, /^\d+\.\d+\.\d+/);
});
