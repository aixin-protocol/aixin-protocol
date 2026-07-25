#!/usr/bin/env node
// AiXin Protocol reference validator server.
// Hosted HTTP surface so integrators can validate SIP intents and receive
// signed receipts without embedding sdk-js or sdk-py.
import Fastify from "fastify";
import { validate, detectKind, KIND_TO_FILE } from "./validator.mjs";
import { signReceipt, verifyReceipt, publicKeyPem, loadKey } from "./receipt.mjs";
import { hashCanonical } from "./canonicalize.mjs";

export function buildServer(opts = {}) {
  const app = Fastify({ logger: opts.logger ?? true });

  app.get("/healthz", async () => ({ ok: true, service: "aixin-validator-server", version: "1.0.0-rc.1" }));

  app.get("/v1/kinds", async () => ({ kinds: Object.keys(KIND_TO_FILE) }));

  app.get("/v1/pubkey", async () => ({ alg: "Ed25519", pem: publicKeyPem() }));

  // POST /v1/validate  { kind?, document }
  // Returns { ok, kind, errors, hash }
  app.post("/v1/validate", async (req, reply) => {
    const { kind: kindIn, document } = req.body ?? {};
    if (!document || typeof document !== "object") {
      return reply.code(400).send({ ok: false, error: "missing 'document' object" });
    }
    const { $schema, _reason, ...doc } = document;
    const kind = kindIn ?? detectKind(document);
    if (!kind) return reply.code(400).send({ ok: false, error: "unknown kind; pass 'kind' or include $schema" });
    const result = validate(kind, doc);
    return { ok: result.ok, kind, errors: result.errors, hash: hashCanonical(doc) };
  });

  // POST /v1/receipts  { kind?, document }
  // Validates, then returns a signed receipt on success.
  app.post("/v1/receipts", async (req, reply) => {
    const { kind: kindIn, document } = req.body ?? {};
    if (!document || typeof document !== "object") {
      return reply.code(400).send({ ok: false, error: "missing 'document' object" });
    }
    const { $schema, _reason, ...doc } = document;
    const kind = kindIn ?? detectKind(document);
    if (!kind) return reply.code(400).send({ ok: false, error: "unknown kind" });
    const result = validate(kind, doc);
    if (!result.ok) return reply.code(422).send({ ok: false, kind, errors: result.errors });
    const receipt = signReceipt({
      kind,
      subject_hash: hashCanonical(doc),
      issued_at: new Date().toISOString(),
      issuer: "aixin-validator-server@1.0.0-rc.1",
    });
    return { ok: true, kind, receipt };
  });

  // POST /v1/receipts/verify  { receipt, pubkey? }
  app.post("/v1/receipts/verify", async (req, reply) => {
    const { receipt, pubkey } = req.body ?? {};
    if (!receipt) return reply.code(400).send({ ok: false, error: "missing 'receipt'" });
    try {
      const ok = verifyReceipt(receipt, pubkey);
      return { ok };
    } catch (e) {
      return reply.code(400).send({ ok: false, error: e.message });
    }
  });

  return app;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  loadKey();
  const port = Number(process.env.PORT ?? 8787);
  const host = process.env.HOST ?? "0.0.0.0";
  buildServer().listen({ port, host }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
