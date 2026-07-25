# Spec Site — Wire the Quickstart page

Add a link to the quickstart in the site navigation.

## 1. In `site/src/nav.json` (or wherever your nav is defined), add:

```json
{ "title": "Quickstart", "href": "/quickstart" }
```

Place it as the first item, before "Specs".

## 2. The generator picks up `site/content/quickstart.md` automatically.

After committing, the GitHub Pages workflow will publish it to
`https://<org>.github.io/aixin-protocol/quickstart/` (or your custom domain).
