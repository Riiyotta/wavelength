# wavelength-clone — Information Architecture

`ia.json` is the only file in this set to hand-edit. `IA.md` and `matrix.csv`
are generated from it — never edit them directly; re-run the scripts below
after changing `ia.json`.

This IA documents the actual `src/` codebase of the Wavelength clone (not a
plan) — every template's `sections` list and every `routeCount` was read
directly out of `src/App.jsx`'s route table and the page components
themselves, not guessed.

## Regenerating

```bash
node validate.mjs   # checks route-count/section-reference consistency; fix any hard failure first
node build.mjs       # regenerates IA.md and matrix.csv from ia.json
```

## Findings

- **48 routes across 9 templates**, of which **39 (81%)** are patterned detail
  pages generated from just 2 templates — `template.blog-post` (21 routes,
  `/blogs/{slug}`) and `template.case-study` (18 routes,
  `/case-study/{slug}`). The real per-template design/build effort is
  concentrated in the other 7 templates covering the remaining 9 routes.
- **8 sections are shared across templates**, 26 are single-use/page-local.
  The 4 true global-chrome sections (`shell.announcement-bar`, `shell.navbar`,
  `shell.footer`, `shell.cookie-banner`) appear on all 9 templates / 48
  routes, rendered once in `App.jsx` outside the route table. `cta.join` (the
  shared closing CTA band) is reused across 5 templates with per-route
  copy/padding presets (`JOIN_COPY`/`JOIN_PAD`), and `content.article-body` +
  `cta.ci-cta` are shared by exactly the two article-shaped templates
  (blog-post, case-study).
- **`shell.page-lines` has two different renderings of the same component**,
  which the IA records explicitly rather than merging into one claim: a
  global `fixed`-position variant rendered by `App.jsx` on 5 templates
  (integrations, blog-index, blog-post, case-study, not-found, gated by
  `FIXED_LINE_ROUTES`), and a locally embedded `absolute`-position variant
  inside the hero markup itself on `about` and `contact`. Home and the legal
  templates render neither.
- All 9 templates carry `chrome: "full"` — there is no reduced/chrome-less
  template in this project (unlike sites with a landing-page or modal-only
  route type).

## Files

| File | Purpose |
|---|---|
| `ia.json` | Source of truth — categories, sections, templates. Hand-edit this only. |
| `IA.md` | Generated readable doc: shape/share table, section-reuse table, per-template section tables, full section reference. |
| `matrix.csv` | Generated section × template matrix for a spreadsheet. |
| `build.mjs` / `validate.mjs` | Generic generator/validator scripts, copied in from the `ia-builder` skill. |
