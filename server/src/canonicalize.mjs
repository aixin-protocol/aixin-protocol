// Deterministic RFC 8785-style JSON canonicalization + SHA-256, mirroring
// @aixin-protocol/sdk-js and aixin-protocol-sdk (Python). Byte-for-byte
// compatible so a receipt hash from any implementation verifies here.
import { createHash } from "node:crypto";

export function canonicalize(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalize).join(",") + "]";
  const keys = Object.keys(value).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + canonicalize(value[k])).join(",") + "}";
}

export function hashCanonical(value) {
  return createHash("sha256").update(canonicalize(value)).digest("hex");
}
