#!/usr/bin/env node
// @aixin/protocol-cli — validator for AiXin Protocol artifacts.
// Usage:
//   aixin validate <kind> <file>            # kind: intent | sip-report | outcome-contract | bounded-loop | manifest
//   aixin validate --auto <file>            # detect kind from $schema
//   aixin conformance [--dir <path>]        # run conformance suite (positive + negative fixtures)
//   aixin --version
//
// Exit codes: 0 ok, 1 validation failed, 2 usage error, 3 IO/parse error.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, basename } from "node:path";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const HERE = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = resolve(HERE, "../../schemas");

const KIND_TO_FILE = {
  "intent": "intent.schema.json",
  "sip-report": "sip-report.schema.json",
  "outcome-contract": "outcome-contract.schema.json",
  "bounded-loop": "bounded-loop.schema.json",
  "manifest": "aixin-manifest.schema.json",
};

function loadAjv() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  // Preload every schema so $ref by $id resolves.
  for (const f of Object.values(KIND_TO_FILE)) {
    const s = JSON.parse(readFileSync(join(SCHEMA_DIR, f), "utf8"));
    ajv.addSchema(s);
  }
  return ajv;
}

function readJson(p) {
  try { return JSON.parse(readFileSync(p, "utf8")); }
  catch (e) { console.error(`parse error: ${p}: ${e.message}`); process.exit(3); }
}

// Strip fixture-only metadata ($schema hint, _reason comment) before validation.
function stripMeta(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const { $schema, _reason, ...rest } = doc;
  return rest;
}

function detectKind(doc) {
  const s = doc?.$schema;
  if (typeof s !== "string") return null;
  const m = s.match(/([a-z-]+)\.schema\.json/);
  if (!m) return null;
  const key = m[1] === "aixin-manifest" ? "manifest" : m[1];
  return KIND_TO_FILE[key] ? key : null;
}

function validate(kind, doc) {
  const ajv = loadAjv();
  const file = KIND_TO_FILE[kind];
  if (!file) return { ok: false, errors: [`unknown kind: ${kind}`] };
  const schema = JSON.parse(readFileSync(join(SCHEMA_DIR, file), "utf8"));
  const v = ajv.getSchema(schema.$id) || ajv.compile(schema);
  const ok = v(doc);
  return { ok, errors: v.errors || [] };
}

function cmdValidate(argv) {
  let auto = false, kind = null, file = null;
  for (const a of argv) {
    if (a === "--auto") auto = true;
    else if (!kind && !auto) kind = a;
    else if (!file) file = a;
  }
  if (!file) { console.error("usage: aixin validate <kind|--auto> <file>"); process.exit(2); }
  const doc = readJson(file);
  if (auto) {
    kind = detectKind(doc);
    if (!kind) { console.error(`could not detect kind from $schema in ${file}`); process.exit(2); }
  }
  const { ok, errors } = validate(kind, stripMeta(doc));
  if (ok) {
    console.log(`ok  ${kind}  ${file}`);
    process.exit(0);
  }
  console.error(`FAIL ${kind}  ${file}`);
  for (const e of errors) console.error(`  ${e.instancePath || "/"} ${e.message} ${e.params ? JSON.stringify(e.params) : ""}`);
  process.exit(1);
}

function cmdConformance(argv) {
  let dir = resolve(HERE, "../../conformance");
  for (let i = 0; i < argv.length; i++) if (argv[i] === "--dir") dir = resolve(argv[++i]);
  const ajv = loadAjv();
  const compiled = Object.fromEntries(
    Object.entries(KIND_TO_FILE).map(([k, f]) => {
      const s = JSON.parse(readFileSync(join(SCHEMA_DIR, f), "utf8"));
      return [k, ajv.getSchema(s.$id) || ajv.compile(s)];
    })
  );
  const results = { pass: 0, fail: 0, cases: [] };

  function walk(root, expect) {
    let entries; try { entries = readdirSync(root); } catch { return; }
    for (const name of entries) {
      const p = join(root, name);
      if (statSync(p).isDirectory()) { walk(p, expect); continue; }
      if (!name.endsWith(".json")) continue;
      const doc = readJson(p);
      const kind = detectKind(doc) || basename(root); // fallback: parent dir name is kind
      const v = compiled[kind];
      if (!v) { results.fail++; results.cases.push({ file: p, status: "FAIL", reason: `unknown kind: ${kind}` }); continue; }
      const ok = v(stripMeta(doc));
      const passed = expect === "positive" ? ok : !ok;
      if (passed) { results.pass++; results.cases.push({ file: p, kind, expect, status: "PASS" }); }
      else {
        results.fail++;
        results.cases.push({ file: p, kind, expect, status: "FAIL", errors: v.errors });
      }
    }
  }

  walk(join(dir, "positive"), "positive");
  walk(join(dir, "negative"), "negative");

  for (const c of results.cases) {
    const tag = c.status === "PASS" ? "ok  " : "FAIL";
    console.log(`${tag} [${c.expect}/${c.kind || "?"}] ${c.file}`);
    if (c.status === "FAIL" && c.errors) {
      for (const e of c.errors) console.log(`      ${e.instancePath || "/"} ${e.message}`);
    } else if (c.status === "FAIL" && c.reason) {
      console.log(`      ${c.reason}`);
    }
  }
  console.log(`\n${results.pass} passed, ${results.fail} failed (${results.cases.length} total)`);
  process.exit(results.fail === 0 ? 0 : 1);
}

const [, , cmd, ...rest] = process.argv;
if (cmd === "--version" || cmd === "-v") { console.log("1.0.0-rc.1"); process.exit(0); }
if (cmd === "validate") cmdValidate(rest);
else if (cmd === "conformance") cmdConformance(rest);
else {
  console.error("aixin — AiXin Protocol validator\n\n" +
    "  aixin validate <kind|--auto> <file>\n" +
    "  aixin conformance [--dir <path>]\n" +
    "  aixin --version\n\n" +
    "kinds: intent | sip-report | outcome-contract | bounded-loop | manifest");
  process.exit(2);
}
