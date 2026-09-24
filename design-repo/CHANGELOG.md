# Changelog

## 1.2.0 -- LLM token-catalog/token-policy layer added, asset-roles relocated, root IA route accounting clarified (external punch-list pass, this session)

Applied an external review's punch list against this design-repo, verifying every item
against the real files first (per this project's own build discipline) before fixing
anything. All 8 items reproduced against the real repo -- none were stale or mistaken.

- **Added `tokens/llm/token-catalog.json`** (BLOCKER): the single canonical, closed
  inventory of every real token id across `tokens/00-foundation/**`,
  `tokens/10-semantic/semantic.json`, `tokens/20-component/component.json`,
  `tokens/30-layout/layout.json`, and `tokens/themes/light.json` -- 115 ids total.
  Gives a generator one file to consult instead of crawling 11 separate token files.
- **Added `tokens/llm/token-policy.json`** (BLOCKER): semantic-token preference (prefer
  `text.*`/`surface.*`/`border.*`/`accent.*` over raw `color.*`, with the real,
  checked exception that typography/radius/breakpoint/elevation/icon-size/motion have
  no semantic layer in this design-repo), raw-value restrictions keyed to
  token-catalog.json's own real foundation category names (per this project's own
  MASTER-GUIDE.md 3.21 caution against inventing unresolvable convenience labels like
  "typography"/"shadow"), the one legitimate override point (component-token layer),
  and deterministic theme-resolution order. Explicitly documents that this
  design-repo's `schema/pagespec.schema.json` carries no per-instance token-override
  field on any node (confirmed by direct inspection, not assumed) -- so PageSpec-level
  override enforcement has nothing to validate today; this gap is recorded plainly
  rather than papered over with an invented field.
- **Wired both into `registry.manifest.json`** (BLOCKER): new `tokenCatalogVersion`/
  `tokenPolicyVersion` fields (machine-checked, like `allowlistVersion`), new
  `entryPoints.tokenCatalog`/`entryPoints.tokenPolicy` keys, and both files added to
  the `entryPoints.tokens` array.
- **Added token-catalog parity validation to `extraction/verify_all.py`** (BLOCKER):
  recomputes the same id sets straight from the real foundation/semantic/component/
  layout/theme files (never from the catalog itself) and fails on any addition,
  removal, or rename the catalog hasn't mirrored -- plus a `tokenCatalogVersion`
  parity check. Proven to actually catch drift with a scratch-copy test: an injected
  phantom color id and an injected version mismatch were both confirmed to fail the
  check, then the scratch copy was restored and reconfirmed clean.
- **Added token-policy validation to `extraction/verify_all.py`** (BLOCKER): checks
  every `rawValueRestrictions` category key resolves against a real
  token-catalog.json foundation category (not a made-up label), plus a
  `tokenPolicyVersion` parity check. Proven with the same scratch-copy drift-injection
  method (an unresolvable `"shadow"` category key was confirmed to fail the check).
- **Added adversarial drift-injection cases for unknown token ids / forbidden raw
  values** (HIGH) to `schema/tests/adversarial_test.py`: since this design-repo's
  PageSpec schema has no per-instance token-override field to mutate (confirmed per
  MASTER-GUIDE.md 3.21), the adversarial coverage correctly lives at the catalog/
  policy layer itself -- one case injects an invented token id into the catalog and
  asserts the recompute check rejects it, one case injects an unresolvable
  raw-value-restriction category into the policy and asserts the same. Both run
  inline on every adversarial-suite invocation (24 → 26 total cases).
- **Moved `tokens/llm/asset-roles.json` to `assets/asset-roles.json`** (RECOMMENDED)
  to match this workspace's common handoff structure; every reference across
  `registry.manifest.json` (including a new `entryPoints.assets` key),
  `extraction/verify_all.py`, `README.md`, and `CHANGELOG.md` was updated to the new
  path (verified with a repo-wide grep for the old path returning zero hits after the
  move) -- the asset-role contract content itself was already correct and unchanged.
- **Clarified root IA route accounting** (RECOMMENDED): the sibling `ia.json`
  (outside this design-repo, at the project root) previously counted `totalRoutes: 48`
  by treating `/404` and the `*` catch-all as two separate routes; this design-repo's
  own `templates/templates.json` and README already correctly counted 47. Fixed
  `ia.json`'s `meta.totalRoutes` to 47 with new explicit `totalConcreteRoutes: 47` /
  `totalCatchAllRoutes: 1` fields and a `routeAccountingNote`, gave the
  `template.not-found` entry a `catchAllRoutes` array separate from its concrete
  `routes` array, and regenerated `IA.md`/`matrix.csv` from the corrected JSON via the
  project's own `build.mjs` (never hand-edited, since `IA.md` states "Generated from
  `ia.json` by `build.mjs`. Edit the JSON, not this file."). The root project's own
  `validate.mjs` was re-run and confirmed "All hard invariants reconcile" afterward.
- All 4 mandatory verification steps re-run after every fix, not just once at the
  end: schema validation (0 errors), the full adversarial suite (26/26 passed,
  including the 2 new cases), a self-containment scratch-copy run (used to prove the
  drift-injection tests above, then restored clean), and a fresh, clean zip
  (0 `__MACOSX`/`.DS_Store` entries, regenerated last after all fixes).

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
- `assets/asset-roles.json`: 11 closed asset roles with explicit AI-generation
  policy (`may-generate-new` / `must-reuse-exact-or-omit`), covering the real
  compliance-sensitive cases (customer logos, customer photos/quotes, partner
  integration logos) as `must-reuse-exact-or-omit` -- never inventable.
- Fixed during this build, before shipping (not left for a later review pass):
  an off-by-one error in ~14 whole-file `measuredFrom` citations (each was 1 line
  past the real file length), caught by `extraction/verify_all.py`'s own
  citation-range check on its first real run against this repo, and a malformed
  multi-citation string in `components/component.hover-card-base.json` that mixed
  commas and semicolons into one uncheckable string (converted to a proper array).
