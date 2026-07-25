// Ed25519-signed receipts. Loads a private key from AIXIN_SIGNING_KEY (PEM),
// or generates an ephemeral one on boot (dev only; logged with a warning).
import { generateKeyPairSync, createPrivateKey, createPublicKey, sign as edSign, verify as edVerify, KeyObject } from "node:crypto";
import { canonicalize, hashCanonical } from "./canonicalize.mjs";

let _priv = null;
let _pub = null;

export function loadKey() {
  if (_priv) return { priv: _priv, pub: _pub };
  const pem = process.env.AIXIN_SIGNING_KEY;
  if (pem) {
    _priv = createPrivateKey(pem);
    _pub = createPublicKey(_priv);
  } else {
    const kp = generateKeyPairSync("ed25519");
    _priv = kp.privateKey;
    _pub = kp.publicKey;
    console.warn("[aixin] AIXIN_SIGNING_KEY not set — using ephemeral key (do not use in production).");
  }
  return { priv: _priv, pub: _pub };
}

export function publicKeyPem() {
  const { pub } = loadKey();
  return pub.export({ type: "spki", format: "pem" });
}

export function signReceipt(payload) {
  const { priv } = loadKey();
  const canonical = canonicalize(payload);
  const hash = hashCanonical(payload);
  const sig = edSign(null, Buffer.from(canonical), priv).toString("base64");
  return { ...payload, hash, signature: sig, alg: "Ed25519" };
}

export function verifyReceipt(receipt, pubPem) {
  const { signature, hash, alg, ...rest } = receipt;
  if (alg !== "Ed25519") return false;
  const pub = pubPem ? createPublicKey(pubPem) : loadKey().pub;
  const canonical = canonicalize(rest);
  return edVerify(null, Buffer.from(canonical), pub, Buffer.from(signature, "base64"));
}
