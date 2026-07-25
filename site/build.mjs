#!/usr/bin/env node
// Zero-dep static site generator for spec.aixin.io
// Renders ../specs/*.md, ../schemas/*.json, ../examples/*.json to ./dist
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(__dirname, "dist");

// BASE_PATH: "" for custom domain (spec.aixin.io) or "/aixin-protocol" for github.io preview.
// Override with: BASE_PATH=/aixin-protocol node site/build.mjs
const BASE = (process.env.BASE_PATH || "").replace(/\/$/, "");
const href = (p) => `${BASE}${p}`;

// ---------- tiny markdown → html ----------
function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
function md2html(md) {
  const lines = md.replace(/\r\n/g,"\n").split("\n");
  let out = [], inCode = false, codeBuf = [], codeLang = "", inList = false, i = 0;
  const flushList = () => { if (inList) { out.push("</ul>"); inList = false; } };

  while (i < lines.length) {
    const raw = lines[i];

    // code fence
    if (raw.startsWith("```")) {
      if (!inCode) { flushList(); inCode = true; codeBuf = []; codeLang = raw.slice(3).trim(); }
      else {
        const cls = codeLang ? ` class="lang-${esc(codeLang)}"` : "";
        out.push(`<pre><code${cls}>${esc(codeBuf.join("\n"))}</code></pre>`);
        inCode = false;
      }
      i++; continue;
    }
    if (inCode) { codeBuf.push(raw); i++; continue; }

    // horizontal rule
    if (/^\s*---\s*$/.test(raw)) { flushList(); out.push("<hr>"); i++; continue; }

    // heading
    const h = raw.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flushList(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }

    // table: header row then |---|---| then body rows
    if (/^\s*\|.+\|\s*$/.test(raw) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i+1])) {
      flushList();
      const splitRow = (r) => r.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(c => c.trim());
      const header = splitRow(raw);
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && /^\s*\|.+\|\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i])); i++;
      }
      out.push("<table><thead><tr>" + header.map(c => `<th>${inline(c)}</th>`).join("") + "</tr></thead><tbody>" +
        rows.map(r => "<tr>" + r.map(c => `<td>${inline(c)}</td>`).join("") + "</tr>").join("") +
        "</tbody></table>");
      continue;
    }

    // list
    if (/^\s*[-*]\s+/.test(raw)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(raw.replace(/^\s*[-*]\s+/,""))}</li>`);
      i++; continue;
    }

    // blank
    if (raw.trim() === "") { flushList(); out.push(""); i++; continue; }

    // paragraph
    flushList();
    out.push(`<p>${inline(raw)}</p>`);
    i++;
  }
  flushList();
  if (inCode) out.push(`<pre><code>${esc(codeBuf.join("\n"))}</code></pre>`);
  return out.join("\n");
}

// ---------- template ----------
const tpl = readFileSync(join(__dirname, "templates/page.html"), "utf8");
function render({ title, description, body, nav }) {
  return tpl
    .replace(/{{TITLE}}/g, esc(title))
    .replace(/{{DESCRIPTION}}/g, esc(description || "AiXin Protocol — the open trust layer for agentic AI. SIP + TOP: signed, deterministic, auditable agent actions."))
    .replace(/{{BASE}}/g, BASE)
    .replace(/{{NAV}}/g, nav)
    .replace(/{{BODY}}/g, body);
}

// ---------- build ----------
if (existsSync(DIST)) rmSync(DIST, { recursive: true });
mkdirSync(DIST, { recursive: true });
mkdirSync(join(DIST, "specs"), { recursive: true });
mkdirSync(join(DIST, "schemas"), { recursive: true });
mkdirSync(join(DIST, "examples"), { recursive: true });

const specs = readdirSync(join(ROOT, "specs")).filter(f => f.endsWith(".md")).sort();
const schemas = readdirSync(join(ROOT, "schemas")).filter(f => f.endsWith(".json")).sort();
const examples = readdirSync(join(ROOT, "examples")).filter(f => f.endsWith(".json")).sort();

const nav = `
  <a href="${href("/")}">Home</a>
  <a href="${href("/specs/")}">AIPs</a>
  <a href="${href("/schemas/")}">Schemas</a>
  <a href="${href("/examples/")}">Examples</a>
  <a href="https://github.com/aixin-protocol/aixin-protocol">GitHub</a>
`;

// Home
const readme = readFileSync(join(ROOT, "README.md"), "utf8");
writeFileSync(join(DIST, "index.html"), render({
  title: "AiXin Protocol — the open trust layer for agentic AI",
  description: "SIP + TOP: signed, deterministic, policy-checked actions with on-chain receipts. Open specifications for governed AI agents.",
  nav,
  body: md2html(readme),
}));

// Specs
for (const f of specs) {
  const src = readFileSync(join(ROOT, "specs", f), "utf8");
  const slug = basename(f, ".md");
  writeFileSync(join(DIST, "specs", `${slug}.html`), render({
    title: `${slug} — AiXin Protocol`,
    description: `${slug} — normative specification in the AiXin Protocol.`,
    nav,
    body: md2html(src),
  }));
}
writeFileSync(join(DIST, "specs", "index.html"), render({
  title: "AIPs — AiXin Protocol",
  description: "Index of AiXin Improvement Proposals (AIPs) — the normative specs for SIP and TOP.",
  nav,
  body: `<h1>AiXin Improvement Proposals</h1>
  <p class="lede">The normative specs. CC0. Anyone can implement.</p>
  <ul class="doc-list">${specs.map(f => {
    const slug = basename(f, ".md");
    return `<li><a href="${href(`/specs/${slug}.html`)}">${slug}</a></li>`;
  }).join("")}</ul>`,
}));

// Schemas + Examples
function jsonPage(dir, f) {
  const src = readFileSync(join(ROOT, dir, f), "utf8");
  const pretty = JSON.stringify(JSON.parse(src), null, 2);
  return render({
    title: `${f} — AiXin Protocol`,
    description: `${f} — JSON artifact in the AiXin Protocol.`,
    nav,
    body: `<h1>${esc(f)}</h1><p><a href="${href(`/${dir}/${f}`)}">Download raw</a></p><pre><code class="lang-json">${esc(pretty)}</code></pre>`,
  });
}
for (const f of schemas) {
  writeFileSync(join(DIST, "schemas", `${basename(f,".json")}.html`), jsonPage("schemas", f));
  cpSync(join(ROOT, "schemas", f), join(DIST, "schemas", f));
}
for (const f of examples) {
  writeFileSync(join(DIST, "examples", `${basename(f,".json")}.html`), jsonPage("examples", f));
  cpSync(join(ROOT, "examples", f), join(DIST, "examples", f));
}
writeFileSync(join(DIST, "schemas", "index.html"), render({
  title: "Schemas — AiXin Protocol",
  description: "JSON Schema (draft 2020-12) for every AiXin Protocol contract.",
  nav,
  body: `<h1>JSON Schemas</h1><p class="lede">Draft 2020-12. One schema per contract.</p>
  <ul class="doc-list">${schemas.map(f => `<li><a href="${href(`/schemas/${basename(f,".json")}.html`)}">${f}</a></li>`).join("")}</ul>`,
}));
writeFileSync(join(DIST, "examples", "index.html"), render({
  title: "Examples — AiXin Protocol",
  description: "Canonical Travel, Marketing, Finance, and Support intents.",
  nav,
  body: `<h1>Canonical Examples</h1><p class="lede">Golden fixtures used by the conformance suite.</p>
  <ul class="doc-list">${examples.map(f => `<li><a href="${href(`/examples/${basename(f,".json")}.html`)}">${f}</a></li>`).join("")}</ul>`,
}));

// Static files
// NOTE: Do NOT emit CNAME here. Configure the custom domain in
// GitHub → repo Settings → Pages → Custom domain. GitHub writes/manages
// the CNAME file itself. Emitting it manually can conflict with that flow
// before DNS is verified.
writeFileSync(join(DIST, ".nojekyll"), "");
cpSync(join(__dirname, "templates/style.css"), join(DIST, "style.css"));

console.log(`Built ${specs.length} specs, ${schemas.length} schemas, ${examples.length} examples → ${DIST}${BASE ? ` (base: ${BASE})` : ""}`);
