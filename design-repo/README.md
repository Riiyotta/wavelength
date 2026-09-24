# Wavelength-clone design-repo

An AI-ready, machine-validated design system extracted from the `wavelength-clone`
project: a pixel-fidelity React 18 + Vite 5 + Tailwind v3 clone of the real, live
marketing site (an AI-native CRM product, formerly branded "Assembly";
link omitted from this repo). This folder is a **snapshot**, built by direct inspection of
the app's real source (`src/`), its own reverse-engineered token file
(`tailwind.config.js`), and its recon/spec documents (`CLONE_SPEC.md`,
`PAGES_SPEC.md`) — not a living mirror of the app. See "Real counts" below for the
numbers as of this build.

## What this is for

A generator (human or AI) that wants to produce a new, on-brand PageSpec for this
product should never invent a color, a copy budget, a section, or an asset role.
Every fact in this repo is cited back to real, measured evidence — either a real
file+line range inside this design-repo, or (for the more detailed design/measurement
history) a citation into the sibling app source in `extraction/measured-values.json`.

## Real counts (recomputed from disk by `extraction/verify_all.py`, not hand-typed)

| | count |
|---|---|
| Foundation token files | 7 |
| Semantic token files | 1 |
| Component token files | 1 |
| Layout token files | 1 |
| Theme instances | 1 (light only — no dark-mode toggle exists anywhere in the real app) |
| Primitives | 9 |
| Components | 7 |
| Sections | 32 |
| Templates (distinct page shapes) | 9 |
| Real routes | **47** |

### A note on the route count

An earlier informal estimate for this project assumed 48 real routes. Direct,
programmatic verification during this build (counting `src/App.jsx`'s real
`<Route>` table plus every real slug in `src/data/blogs.json` and
`src/data/case-studies.json`) found **47**, not 48:

- 8 static routes: `/`, `/about`, `/contact`, `/integrations`, `/blogs`,
  `/legals/terms-conditions`, `/legals/privacy-policy`, `/404`
- 21 `/blogs/:slug` routes
- 18 `/case-study/:slug` routes

`src/App.jsx`'s catch-all `path="*"` route renders the same 404 component as the
literal `/404` path, but it is not itself a distinct sitemap URL, so it is not
counted as a 48th route. `templates/templates.json`'s own `routeCountNote` field
and `extraction/verify_all.py`'s route-coverage check both encode this as the
authoritative, machine-checked number.

## Structure

```
design-repo/
  README.md, CHANGELOG.md, registry.manifest.json
  tokens/{00-foundation,10-semantic,20-component,30-layout,themes,llm}/
  primitives/   -- 9 atomic building blocks
  components/   -- 7 composed, still content-agnostic pieces
  sections/     -- 32 real, distinct section types, each with a full content contract
  templates/templates.json  -- 9 page shapes, 47 routes mapped 1:1
  compatibility/graph.json  -- rhythm/adjacency rules, severity error|warn
  schema/{pagespec.schema.json, example.pagespec.json, semantic_validate.py, tests/adversarial_test.py}
  extraction/{measured-values.json, verify_all.py}
```

## Real, deliberate product constraints baked into this design-repo

These are load-bearing facts about the real app, not simplifications this
design-repo made up:

- **No outbound/external links anywhere.** Every link to another domain was
  deliberately stripped/redirected internally this session. `src/components/ui.jsx`'s
  `localHref`/`isInternal` helpers structurally refuse to render a non-same-site
  href. `compatibility/graph.json`'s `NO_OUTBOUND_LINKS` rule and
  `schema/semantic_validate.py`'s `_walk_hrefs` check enforce the same constraint
  on every generated PageSpec.
- **The contact form never really submits.** `src/pages/Contact.jsx` resolves a
  local `setTimeout` (`submitLocally()`), never a network request. The
  `hero.contact-form` section contract locks `formBehavior` to the const
  `"local-simulation-no-network"`.
- **`/blogs` deliberately lists only 1 of 21 real posts** (the featured
  "Assembly is now Wavelength" card) — a real quirk of the live source, not a bug
  in this clone. The other 20 posts are real, fully-built pages reachable only by
  direct URL or sitemap. `content.blog-grid`'s section contract documents this
  explicitly; do not "fix" it in a generated instance.
- **Case studies are not linked from nav or footer at all** — only from another
  case study's "Related Case Studies" cards, using the real, fixed selection rule
  `ITEMS.filter(i => i.slug !== slug).slice(2, 5)` (cited verbatim from
  `src/pages/CaseStudy.jsx:13-16`, not re-derived).
- **`/404` and any unmatched URL return real HTTP 200`**, not a server 404 — this
  is a plain client-side SPA router characteristic, not a defect.
- **This is a real, live company's real product/brand.** Integration-partner
  logos (Gmail, Slack, HubSpot, Salesforce, Intercom, Linear, Zendesk, etc.),
  testimonial customer logos/names/quotes (real named people at Latchel,
  Lexamica, and Rho), and the Wavelength/Assembly product mark itself are real
  third-party assets bundled locally. `tokens/llm/asset-roles.json` locks every
  one of these to `must-reuse-exact-or-omit` — a generator must never fabricate a
  new "customer testimonial," a new integration-partner logo, or a variation on
  the real brand mark. Omission is always the safe move; invention never is.
- **TWK Lausanne (400/700) is a bundled commercial/paid font.** It ships with the
  real app under its existing license (`public/assets/fonts/` in the sibling app).
  `tokens/00-foundation/typography.json`'s `licensingNote` field flags this
  explicitly — a generator must reuse the existing font files, never "generate" a
  lookalike replacement.
- **Rive (`.riv`) canvas animations and MP4 background videos are a real motion
  mechanism** (15+ distinct `.riv` files, several product-capture videos), not
  decorative filler. Every section/primitive that uses one declares a real
  `motion.pattern` plus a required `reducedMotionFallback`
  (`static-final-state` for springs/tweens, `first-frame-static` for loops).

## Responsive contract

Every one of the 32 `sections/*.json` files also carries a `responsive` block
(`measuredFrom` + `phone`/`tablet`/`desktop` descriptions), cited to the same
real Tailwind breakpoint classes (`tablet:`/`desktop:`-prefixed) as the
section's own `measuredFrom` evidence — e.g. `content.blog-grid` documents
`grid-cols-1 → tablet:grid-cols-2 → desktop:grid-cols-3`, cited to
`Blogs.jsx:105-116`. Two sections (`shell.announcement-bar`,
`shell.cookie-banner`) and one (`content.legal-prose`) are explicitly
documented as uniform across breakpoints — a real, checked absence of
responsive classes in their cited range, not an unfilled field. This is a
section-contract-level field (like `measuredFrom`/`purpose`/`constraints`),
not a per-PageSpec-instance field, since responsive behavior here is fixed by
the section's own implementation rather than authored per page instance.
`extraction/verify_all.py`'s citation-range check validates
`responsive.measuredFrom` exactly like every other citation in this repo —
proven with an injected-bad-citation scratch test, not just asserted to work.

## Verification

Run `python3 extraction/verify_all.py` from inside this folder. It performs, in
order: allowlist parity, asset-role parity, allowlistVersion parity, manifest
counts recompute + route-coverage check, citation-range validity (every
top-level `measuredFrom` and every section's `responsive.measuredFrom`;
internal hard-fail, sibling-app soft-warn when the sibling app tree isn't
present), `registry.manifest.json` entryPoints self-containment, an
absolute-local-path sweep, Draft-07 schema validation of the bundled example,
the semantic validator, and the full adversarial suite — all in one command,
with real pass/fail output.

## Packaging note

This project now has a real git repository (initialized and pushed to
`https://github.com/Riiyotta/wavelength-clone` this session), and its
`.gitignore` already lists `design-repo.zip` by name — the zip is
regenerated fresh from this folder and is never committed alongside it,
per the note above and this repo's own build guidance. Regenerate it with
the CLI `zip` tool (not Finder/Archive Utility, which leaves `__MACOSX`/
`.DS_Store` entries) any time this folder changes.
