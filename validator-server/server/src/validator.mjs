// Loads the normative AiXin schemas and exposes a validate() function.
// Schemas are embedded so the package is self-contained when published.
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = resolve(HERE, "../schemas");

export const KIND_TO_FILE = {
  "intent": "intent.schema.json",
  "sip-report": "sip-report.schema.json",
  "outcome-contract": "outcome-contract.schema.json",
  "bounded-loop": "bounded-loop.schema.json",
  "manifest": "aixin-manifest.schema.json",
};

let _ajv = null;
function ajv() {
  if (_ajv) return _ajv;
  const a = new Ajv({ allErrors: true, strict: false });
  addFormats(a);
  for (const f of readdirSync(SCHEMA_DIR)) {
    if (f.endsWith(".schema.json")) {
      a.addSchema(JSON.parse(readFileSync(join(SCHEMA_DIR, f), "utf8")));
    }
  }
  _ajv = a;
  return a;
}

export function detectKind(doc) {
  const s = doc?.$schema;
  if (typeof s !== "string") return null;
  const m = s.match(/([a-z-]+)\.schema\.json/);
  if (!m) return null;
  const key = m[1] === "aixin-manifest" ? "manifest" : m[1];
  return KIND_TO_FILE[key] ? key : null;
}

export function validate(kind, doc) {
  const file = KIND_TO_FILE[kind];
  if (!file) return { ok: false, errors: [{ message: `unknown kind: ${kind}` }] };
  const schema = JSON.parse(readFileSync(join(SCHEMA_DIR, file), "utf8"));
  const v = ajv().getSchema(schema.$id) || ajv().compile(schema);
  const ok = v({ ...doc });
  return { ok, errors: v.errors || [] };
}
