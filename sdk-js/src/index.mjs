// @aixin-protocol/sdk-js
// Programmatic client for the AiXin Protocol.
// - validate(kind, doc): schema-validate SIP artifacts
// - detectKind(doc): infer artifact kind from $schema
// - verifyReceipt(receipt, {publicKey}): verify a receipt's ed25519 signature
// - canonicalize(obj): RFC 8785-style JSON canonicalization for signing
// - hashCanonical(obj): sha256 hex of the canonical form
//
// This SDK is pure ESM. It bundles the protocol schemas so it works
// without touching the filesystem at runtime.

import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createHash, verify as cryptoVerify, createPublicKey } from "node:crypto";

const HERE = dirname(fileURLToPath(import.meta.url));

// Schemas ship with the repo under ../../schemas relative to the CLI, but
// when installed from npm the sdk-js package is standalone. We resolve
// schemas by walking up from the SDK dir; if not found, the caller can
// pass their own schemas via createValidator({schemas}).
function loadBundledSchemas() {
  const candidates = [
    resolve(HERE, "../../schemas"),          // monorepo dev
    resolve(HERE, "../schemas"),             // packaged with schemas/
    resolve(HERE, "../../../schemas"),       // nested install
  ];
  for (const dir of candidates) {
    try {
      const files = readdirSync(dir).filter((f) => f.endsWith(".schema.json"));
      if (files.length === 0) continue;
      const out = {};
      for (const f of files) {
        const doc = JSON.parse(readFileSync(join(dir, f), "utf8"));
        out[f] = doc;
      }
      return out;
    } catch { /* try next */ }
  }
  return null;
}

const KIND_TO_FILE = {
  "intent": "intent.schema.json",
  "sip-report": "sip-report.schema.json",
  "outcome-contract": "outcome-contract.schema.json",
  "bounded-loop": "bounded-loop.schema.json",
  "manifest": "aixin-manifest.schema.json",
};

/**
 * Create a validator. Pass `schemas` (map of filename -> schema JSON) to
 * override the bundled ones — useful for pinning to a specific spec version.
 */
export function createValidator(opts = {}) {
  const schemas = opts.schemas || loadBundledSchemas();
  if (!schemas) {
    throw new Error(
      "@aixin-protocol/sdk-js: schemas not found. Pass createValidator({schemas}) explicitly."
    );
  }
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const s of Object.values(schemas)) ajv.addSchema(s);
  return {
    validate(kind, doc) {
      const file = KIND_TO_FILE[kind];
      if (!file) return { ok: false, errors: [{ message: `unknown kind: ${kind}` }] };
      const schema = schemas[file];
      if (!schema) return { ok: false, errors: [{ message: `schema missing: ${file}` }] };
      const v = ajv.getSchema(schema.$id) || ajv.compile(schema);
      const ok = v(stripMeta(doc));
      return { ok: !!ok, errors: v.errors || [] };
    },
    detectKind,
  };
}

/** Top-level convenience: validate against bundled schemas. */
export function validate(kind, doc) {
  const v = createValidator();
  return v.validate(kind, doc);
}

/** Infer artifact kind from `$schema` URL. Returns null if unknown. */
export function detectKind(doc) {
  const s = doc && doc.$schema;
  if (typeof s !== "string") return null;
  const m = s.match(/([a-z-]+)\.schema\.json/);
  if (!m) return null;
  const key = m[1] === "aixin-manifest" ? "manifest" : m[1];
  return KIND_TO_FILE[key] ? key : null;
}

function stripMeta(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const { $schema, _reason, ...rest } = doc;
  return rest;
}

/**
 * Deterministic JSON serialization (RFC 8785 subset — sorted keys, no
 * insignificant whitespace). Used to hash & sign receipts so any signer
 * produces the same bytes.
 */
export function canonicalize(value) {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = sortKeys(v[k]);
    return out;
  }
  return v;
}

/** sha256 hex digest of the canonical serialization of `value`. */
export function hashCanonical(value) {
  return createHash("sha256").update(canonicalize(value)).digest("hex");
}

/**
 * Verify a receipt's ed25519 signature.
 *
 * Expected receipt shape (matches sip-report / receipt envelope):
 *   { payload: {...}, signature: "<hex>", public_key: "<pem or hex>" }
 *
 * `opts.publicKey` overrides the receipt's `public_key` (PEM string).
 * Returns { ok, reason? }.
 */
export function verifyReceipt(receipt, opts = {}) {
  if (!receipt || typeof receipt !== "object") {
    return { ok: false, reason: "receipt must be an object" };
  }
  const { payload, signature } = receipt;
  const pubKeyPem = opts.publicKey || receipt.public_key;
  if (!payload) return { ok: false, reason: "receipt.payload missing" };
  if (!signature) return { ok: false, reason: "receipt.signature missing" };
  if (!pubKeyPem) return { ok: false, reason: "public key missing (pass opts.publicKey)" };
  const bytes = Buffer.from(canonicalize(payload), "utf8");
  const sig = Buffer.from(signature, "hex");
  let keyObject;
  try {
    keyObject = createPublicKey(pubKeyPem);
  } catch (e) {
    return { ok: false, reason: `invalid public key: ${e.message}` };
  }
  try {
    const ok = cryptoVerify(null, bytes, keyObject, sig);
    return ok ? { ok: true } : { ok: false, reason: "signature does not verify" };
  } catch (e) {
    return { ok: false, reason: `verify error: ${e.message}` };
  }
}

/** SDK version — kept in sync with package.json manually. */
export const VERSION = "1.0.0-rc.1";
