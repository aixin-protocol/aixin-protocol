#!/usr/bin/env node
// Conformance runner — reused by CI and by `npm test` in the CLI package.
// Delegates to the CLI's `conformance` command so there's exactly one implementation.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(HERE, "../cli/bin/aixin.mjs");

const res = spawnSync(process.execPath, [CLI, "conformance", "--dir", HERE], {
  stdio: "inherit",
});
process.exit(res.status ?? 1);
