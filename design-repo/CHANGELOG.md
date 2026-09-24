# Changelog

## 1.1.0 -- responsive contract added (recheck pass, this session)

A recheck against this project's own build methodology's pre-ship checklist
found one real gap: no section had a structured, cited `responsive` field
("every section with materially different responsive behavior has a
structured (not prose-only) responsive field, cited against real CSS") --
responsive differences existed only as prose inside `measuredFrom`-cited
component code, not as a machine-checkable field of their own.

- Added a `responsive` block (`measuredFrom` + `phone`/`tablet`/`desktop`
  descriptions) to all 32 `sections/*.json` files, each grounded in the real
  `tablet:`/`desktop:`-prefixed Tailwind classes inside that section's own
  already-cited `measuredFrom` range (auto-extracted and cross-checked
  against the real source file, not hand-recalled).
- 3 sections (`shell.announcement-bar`, `shell.cookie-banner`,
  `content.legal-prose`) were confirmed, by direct inspection of their cited
  range, to have **no** breakpoint-prefixed classes at all -- documented as
  genuinely uniform across breakpoints, not left blank or guessed.
- `extraction/verify_all.py`'s citation-range check was extended to also
  validate every section's `responsive.measuredFrom` (previously it only
  read each file's top-level `measuredFrom`) -- checked citation count rose
  from 71 to 106. Proven to actually catch drift with a scratch-copy test
  (an injected out-of-range citation on `hero.home.json` was confirmed to
  fail the check, then the file was restored and reconfirmed clean) before
  being trusted, per this design-repo's own established verification
  discipline.
- This field lives at the section-contract level (alongside `measuredFrom`/
  `purpose`/`constraints`), not the per-PageSpec-instance schema layer --
  responsive behavior here is fixed by the section's own implementation, not
  authored per page instance, so `schema/pagespec.schema.json` and the
  adversarial suite's generic instance synthesizer needed no changes; all 24
  adversarial cases and both the in-place and isolated self-containment runs
  were re-confirmed clean after this change.

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
