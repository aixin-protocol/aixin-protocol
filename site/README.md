# spec.aixin.io — Static Site

Zero-framework static site that renders the AIPs (Markdown) and JSON Schemas from this repo.
Designed for GitHub Pages / Cloudflare Pages / any static host.

## Build

```bash
node build.mjs
# → outputs to ./dist
```

Then deploy `dist/` to `spec.aixin.io`.

## Structure

- `build.mjs` — reads `../specs/*.md`, `../schemas/*.json`, `../examples/*.json`, renders to `dist/`.
- `templates/` — HTML skeleton (header, nav, footer).
- `dist/` — generated. Not checked in.

## Deploy

GitHub Pages workflow at `.github/workflows/publish-site.yml` runs the build on every push to `main`
and publishes `dist/` to the `gh-pages` branch. Point `spec.aixin.io` CNAME at
`<org>.github.io`.
