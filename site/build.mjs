#!/usr/bin/env node
// Zero-dep static site generator for spec.aixin.io
// Renders ../specs/*.md and ../schemas/*.json to ./dist
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(__dirname, "dist");

// --- tiny markdown → html (headings, code fences, inline code, links, lists, paragraphs) ---
function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function md2html(md) {
  const lines = md.replace(/\r\n/g,"\n").split("\n");
  let out = [], inCode = false, codeBuf = [], inList = false;
  const flushList = () => { if (inList) { out.push("</ul>"); inList = false; } };
  for (const raw of lines) {
    if (raw.startsWith("```")) {
      if (!inCode) { flushList(); inCode = true; codeBuf = []; }
      else { out.push(`<pre><code>${esc(codeBuf.join("\n"))}</code></pre>`); inCode = false; }
      continue;
    }
    if (inCode) { codeBuf.push(raw); continue; }
    let line = raw;
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flushList(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); continue; }
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/,""))}</li>`);
      continue;
    }
    if (line.trim() === "") { flushList(); out.push(""); continue; }
    flushList();
    out.push(`<p>${inline(line)}</p>`);
  }
  flushList();
  if (inCode) out.push(`<pre><code>${esc(codeBuf.join("\n"))}</code></pre>`);
  return out.join("\n");
}
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

const tpl = readFileSync(join(__dirname, "templates/page.html"), "utf8");
function render({ title, body, nav }) {
  return tpl.replace("{{TITLE}}", esc(title)).replace("{{NAV}}", nav).replace("{{BODY}}", body);
}

if (existsSync(DIST)) rmSync(DIST, { recursive: true });
mkdirSync(DIST, { recursive: true });
mkdirSync(join(DIST, "specs"), { recursive: true });
mkdirSync(join(DIST, "schemas"), { recursive: true });
mkdirSync(join(DIST, "examples"), { recursive: true });

const specs = readdirSync(join(ROOT, "specs")).filter(f => f.endsWith(".md")).sort();
const schemas = readdirSync(join(ROOT, "schemas")).filter(f => f.endsWith(".json")).sort();
const examples = readdirSync(join(ROOT, "examples")).filter(f => f.endsWith(".json")).sort();

const nav = `
  <a href="/">Home</a>
  <a href="/specs/">AIPs</a>
  <a href="/schemas/">Schemas</a>
  <a href="/examples/">Examples</a>
  <a href="https://github.com/aixin-protocol/aixin-protocol">GitHub</a>
`;

// Home
const readme = readFileSync(join(ROOT, "README.md"), "utf8");
writeFileSync(join(DIST, "index.html"), render({
  title: "AiXin Protocol — Spec",
  nav,
  body: md2html(readme),
}));

// Specs
for (const f of specs) {
  const src = readFileSync(join(ROOT, "specs", f), "utf8");
  const slug = basename(f, ".md");
  writeFileSync(join(DIST, "specs", `${slug}.html`), render({
    title: `${slug} — AiXin Protocol`,
    nav,
    body: md2html(src),
  }));
}
writeFileSync(join(DIST, "specs", "index.html"), render({
  title: "AIPs — AiXin Protocol",
  nav,
  body: `<h1>AIPs</h1><ul>${specs.map(f => {
    const slug = basename(f, ".md");
    return `<li><a href="/specs/${slug}.html">${slug}</a></li>`;
  }).join("")}</ul>`,
}));

// Schemas + Examples: pretty-print JSON in a <pre>
function jsonPage(dir, f) {
  const src = readFileSync(join(ROOT, dir, f), "utf8");
  const pretty = JSON.stringify(JSON.parse(src), null, 2);
  return render({
    title: `${f} — AiXin Protocol`,
    nav,
    body: `<h1>${esc(f)}</h1><p><a href="/${dir}/${f}">raw</a></p><pre><code>${esc(pretty)}</code></pre>`,
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
  nav,
  body: `<h1>JSON Schemas</h1><ul>${schemas.map(f => `<li><a href="/schemas/${basename(f,".json")}.html">${f}</a></li>`).join("")}</ul>`,
}));
writeFileSync(join(DIST, "examples", "index.html"), render({
  title: "Examples — AiXin Protocol",
  nav,
  body: `<h1>Canonical Examples</h1><ul>${examples.map(f => `<li><a href="/examples/${basename(f,".json")}.html">${f}</a></li>`).join("")}</ul>`,
}));

// CNAME
writeFileSync(join(DIST, "CNAME"), "spec.aixin.io\n");
cpSync(join(__dirname, "templates/style.css"), join(DIST, "style.css"));

console.log(`Built ${specs.length} specs, ${schemas.length} schemas, ${examples.length} examples → ${DIST}`);
