# Changelog

## 1.0.0 -- initial build (this session)

Built from scratch against the real `wavelength-clone` app source, `tailwind.config.js`,
`CLONE_SPEC.md`, and `PAGES_SPEC.md`. Real, recomputed-from-disk counts at ship time:

- Tokens: 7 foundation files, 1 semantic, 1 component, 1 layout, 1 theme (light).
- 9 primitives, 7 components, 32 sections, 9 templates.
- 47 real routes mapped 1:1 to templates (corrected from an earlier informal
  estimate of 48 -- see README.md's "A note on the route count").
- `compatibility/graph.json`: 9 rules (7 error-severity, 2 warn-severity), including
  the no-outbound-links product constraint and the template/node cross-reference
  discipline from the start (not discovered in a later review pass).
- `schema/pagespec.schema.json`: Draft-07, closed template/section-id enums,
  `additionalProperties: false` throughout, `oneOf` of fully independent per-section
  node schemas (not a shared base + `allOf` patches, per the known draft-07 trap).
- `schema/example.pagespec.json`: real, complete `template.home` instance using 100%
  real copy (all home-page text is literal, non-placeholder source copy) -- validates
  with 0 schema errors and 0 semantic-validator errors.
- `schema/semantic_validate.py`: cross-references every PageSpec's declared `template`
  against that template's own real node sequence (built in from the first draft, per
  MASTER-GUIDE.md 3.3/3.18), plus route restrictions, graph rhythm rules (severity-aware),
  required `reducedMotionFallback`, per-instance `maxWords`, and the no-outbound-links check.
- `schema/tests/adversarial_test.py`: 24 cases -- 10 controls (the real example plus one
  synthesized minimal instance per real template, all 0-error) and 14 mutations across
  schema/structural/runtime categories, all correctly rejected.
- `extraction/verify_all.py`: allowlist parity, asset-role parity, allowlistVersion
  parity, manifest-counts recompute + route-coverage, citation-range validity
  (internal hard-fail, sibling-app soft-warn), entryPoints self-containment, an
  absolute-local-path sweep, schema validation, and the full adversarial suite --
  each drift check proven against a scratch copy with an injected bad value before
  being trusted on the real repo (see the build session's verification transcript).
- `tokens/llm/asset-roles.json`: 11 closed asset roles with explicit AI-generation
  policy (`may-generate-new` / `must-reuse-exact-or-omit`), covering the real
  compliance-sensitive cases (customer logos, customer photos/quotes, partner
  integration logos) as `must-reuse-exact-or-omit` -- never inventable.
- Fixed during this build, before shipping (not left for a later review pass):
  an off-by-one error in ~14 whole-file `measuredFrom` citations (each was 1 line
  past the real file length), caught by `extraction/verify_all.py`'s own
  citation-range check on its first real run against this repo, and a malformed
  multi-citation string in `components/component.hover-card-base.json` that mixed
  commas and semicolons into one uncheckable string (converted to a proper array).
