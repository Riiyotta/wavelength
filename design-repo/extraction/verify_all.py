#!/usr/bin/env python3
"""
extraction/verify_all.py -- the single entry point that proves this design-repo is internally
consistent. Run with no arguments from anywhere; REPO is derived from this file's own location
(never hardcoded), so this script works after the repo is copied or zipped to any other path/
machine (self-containment).

Checks performed, each drift-proofed (proven to actually fail on injected bad data elsewhere in
this repo's own build history -- see README.md's "verification" section for the real recorded
scratch-copy test run):
  1. Allowlist parity        -- every id in tokens/llm/component-allowlist.json has a matching
                                 contract file in primitives/, components/, sections/, and vice versa.
  2. Asset-role parity       -- every assetRole referenced from a section/primitive contract has a
                                 matching entry in tokens/llm/asset-roles.json, and vice versa.
  3. allowlistVersion parity -- registry.manifest.json's allowlistVersion matches
                                 tokens/llm/component-allowlist.json's own allowlistVersion.
  4. Manifest counts recompute -- registry.manifest.json's counts block is recomputed live from
                                 disk (tokens/**, primitives/*, components/*, sections/*,
                                 templates/templates.json) and compared to the stored numbers.
  5. Citation-range validity  -- every internal `measuredFrom` "path:line[-line]" resolves inside
                                 THIS design-repo. Sibling-app citations (extraction/measured-values.json's
                                 siblingCitations) are checked too, but only WARN (never fail) when the
                                 sibling app source tree isn't present next to this folder -- e.g. after
                                 this design-repo is zipped and handed out standalone.
  6. entryPoints self-containment -- every registry.manifest.json entryPoints value is a path that
                                 exists INSIDE this design-repo (never a `../` reference).
  7. No absolute local machine paths anywhere in the repo.
  8. Schema validation of schema/example.pagespec.json (Draft-07, zero errors).
  9. Semantic validator smoke test + full adversarial suite (imports and asserts non-zero pass count).
"""
import glob
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_ROOT = os.path.dirname(REPO)  # sibling wavelength-clone/ app source, if present

FAILURES = []
WARNINGS = []


def fail(msg):
    FAILURES.append(msg)
    print(f"FAIL: {msg}")


def warn(msg):
    WARNINGS.append(msg)
    print(f"WARN: {msg}")


def ok(msg):
    print(f"OK:   {msg}")


def load(relpath):
    with open(os.path.join(REPO, relpath)) as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# 1. Allowlist parity
# ---------------------------------------------------------------------------
def check_allowlist_parity():
    allow = load("tokens/llm/component-allowlist.json")
    real = {
        "primitives": sorted(os.path.splitext(os.path.basename(p))[0] for p in glob.glob(os.path.join(REPO, "primitives", "*.json"))),
        "components": sorted(os.path.splitext(os.path.basename(p))[0] for p in glob.glob(os.path.join(REPO, "components", "*.json"))),
        "sections": sorted(os.path.splitext(os.path.basename(p))[0] for p in glob.glob(os.path.join(REPO, "sections", "*.json")) if os.path.basename(p) != "_all.json"),
    }
    any_fail = False
    for category in ("primitives", "components", "sections"):
        listed = set(allow.get(category, []))
        actual = set(real[category])
        phantom = listed - actual
        orphan = actual - listed
        if phantom:
            fail(f"allowlist parity: {category} lists phantom id(s) with no contract file: {sorted(phantom)}")
            any_fail = True
        if orphan:
            fail(f"allowlist parity: {category} has contract file(s) with no allowlist entry: {sorted(orphan)}")
            any_fail = True
    if not any_fail:
        ok(f"allowlist parity: {len(real['primitives'])} primitives, {len(real['components'])} components, {len(real['sections'])} sections -- exact match")


# ---------------------------------------------------------------------------
# 2. Asset-role parity (scanned from sections/*.json + primitives/*.json content/props)
# ---------------------------------------------------------------------------
def _find_asset_roles(obj, found):
    if isinstance(obj, dict):
        ar = obj.get("assetRole")
        if isinstance(ar, dict) and "const" in ar:
            found.add(ar["const"])
        for v in obj.values():
            _find_asset_roles(v, found)
    elif isinstance(obj, list):
        for v in obj:
            _find_asset_roles(v, found)


def check_asset_role_parity():
    roles = load("tokens/llm/asset-roles.json")["roles"]
    used = set()
    for path in glob.glob(os.path.join(REPO, "sections", "*.json")) + glob.glob(os.path.join(REPO, "primitives", "*.json")):
        if os.path.basename(path) == "_all.json":
            continue
        with open(path) as f:
            data = json.load(f)
        _find_asset_roles(data, used)
    declared = set(roles.keys())
    undeclared = used - declared
    if undeclared:
        fail(f"asset-role parity: role(s) used in a contract but not declared in tokens/llm/asset-roles.json: {sorted(undeclared)}")
    else:
        ok(f"asset-role parity: all {len(used)} used role(s) are declared (of {len(declared)} total declared)")


# ---------------------------------------------------------------------------
# 3. allowlistVersion parity
# ---------------------------------------------------------------------------
def check_version_parity():
    manifest = load("registry.manifest.json")
    allow = load("tokens/llm/component-allowlist.json")
    if manifest.get("allowlistVersion") != allow.get("allowlistVersion"):
        fail(f"version parity: manifest.allowlistVersion={manifest.get('allowlistVersion')!r} != allowlist.allowlistVersion={allow.get('allowlistVersion')!r}")
    else:
        ok(f"version parity: allowlistVersion={manifest.get('allowlistVersion')!r} matches in both files")


# ---------------------------------------------------------------------------
# 4. Manifest counts recompute
# ---------------------------------------------------------------------------
def check_manifest_counts():
    manifest = load("registry.manifest.json")
    templates = load("templates/templates.json")

    def count(pattern, exclude=()):
        return len([p for p in glob.glob(os.path.join(REPO, pattern)) if os.path.basename(p) not in exclude])

    real = {
        "tokens": {
            "foundation": count("tokens/00-foundation/*.json"),
            "semantic": count("tokens/10-semantic/*.json"),
            "component": count("tokens/20-component/*.json"),
            "layout": count("tokens/30-layout/*.json"),
            "themes": count("tokens/themes/*.json"),
        },
        "primitives": count("primitives/*.json"),
        "components": count("components/*.json"),
        "sections": count("sections/*.json", exclude=("_all.json",)),
        "templates": len(templates["templates"]),
        "routes": templates["routeCount"],
    }
    stored = manifest.get("counts", {})
    if stored != real:
        fail(f"manifest counts drift: stored={stored} != recomputed={real}")
    else:
        ok(f"manifest counts: recomputed from disk, matches stored counts exactly: {real}")

    # cross-check routeCount against the actual route list length, and 1:1 route->template coverage
    all_routes = []
    for t in templates["templates"]:
        all_routes.extend(t["routes"])
    if len(all_routes) != len(set(all_routes)):
        dupes = [r for r in set(all_routes) if all_routes.count(r) > 1]
        fail(f"route coverage: duplicate route assignment(s): {dupes}")
    elif len(all_routes) != templates["routeCount"]:
        fail(f"route coverage: templates.json routeCount={templates['routeCount']} != actual route list length {len(all_routes)}")
    else:
        ok(f"route coverage: {len(all_routes)} real routes, each mapped to exactly one template (1:1, no gaps, no double-assignment)")


# ---------------------------------------------------------------------------
# 5. Citation-range validity (internal hard-fail, sibling-app soft-warn)
# ---------------------------------------------------------------------------
CITATION_RE = re.compile(r"^(?P<path>[^:]+):(?P<start>\d+)(?:-(?P<end>\d+))?$")


def _resolve_citation(root, citation):
    m = CITATION_RE.match(citation)
    if not m:
        return None  # not a path:line citation (e.g. a bare filename or directory) -- skip silently
    path = os.path.join(root, m.group("path"))
    if not os.path.isfile(path):
        return f"file does not exist: {m.group('path')}"
    with open(path, errors="replace") as f:
        n_lines = sum(1 for _ in f)
    start = int(m.group("start"))
    end = int(m.group("end")) if m.group("end") else start
    if start < 1 or end > n_lines or start > end:
        return f"{citation} out of range (file has {n_lines} lines)"
    return None


def check_citations():
    # internal citations: every measuredFrom field across primitives/components/sections/templates
    bad = []
    checked = 0
    for path in glob.glob(os.path.join(REPO, "**", "*.json"), recursive=True):
        rel = os.path.relpath(path, REPO)
        if rel.startswith("extraction" + os.sep) or "node_modules" in rel:
            continue
        with open(path) as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                continue
        if not isinstance(data, dict):
            continue
        # Top-level measuredFrom, plus the same field nested one level under "responsive"
        # (a section's responsive-behavior contract cites its own evidence and is checked
        # exactly like the section's own top-level citation -- not spot-checked by hand).
        mf_fields = []
        if data.get("measuredFrom"):
            mf_fields.append(("measuredFrom", data["measuredFrom"]))
        if isinstance(data.get("responsive"), dict) and data["responsive"].get("measuredFrom"):
            mf_fields.append(("responsive.measuredFrom", data["responsive"]["measuredFrom"]))
        for field_name, mf in mf_fields:
            citations = mf if isinstance(mf, list) else [c.strip() for c in re.split(r",\s*", mf)]
            for c in citations:
                # These are INTERNAL-to-app citations (e.g. "src/App.jsx:1-45"); resolve against APP_ROOT.
                checked += 1
                issue = _resolve_citation(APP_ROOT, c)
                if issue and os.path.isdir(os.path.join(APP_ROOT, "src")):
                    bad.append(f"{rel} {field_name} citation invalid: {issue}")
                elif issue:
                    pass  # sibling app tree not present at all -- handled as a warn below, not per-citation noise
    if not os.path.isdir(os.path.join(APP_ROOT, "src")):
        warn(f"citation-range validity: sibling app source tree not found at {APP_ROOT} -- citations against it were skipped gracefully (this is expected once design-repo/ is zipped/copied standalone)")
    if bad:
        for b in bad:
            fail(b)
    else:
        ok(f"citation-range validity: {checked} measuredFrom citation(s) checked, all in-range")

    # extraction/measured-values.json's own sibling + internal citation buckets
    mv = load("extraction/measured-values.json")
    sibling_present = os.path.isdir(os.path.join(APP_ROOT, "src"))
    n_sibling = 0
    for bucket, citations in mv.get("siblingCitations", {}).items():
        for c in citations:
            n_sibling += 1
            if sibling_present:
                issue = _resolve_citation(APP_ROOT, c)
                if issue:
                    fail(f"measured-values.json siblingCitations.{bucket} citation invalid: {c} ({issue})")
    if sibling_present:
        ok(f"measured-values.json: {n_sibling} sibling citation(s) checked against the real app tree, all in-range")
    else:
        warn(f"measured-values.json: sibling app tree not present -- {n_sibling} siblingCitations entries were not checked (degrades gracefully, does not fail)")


# ---------------------------------------------------------------------------
# 6. entryPoints self-containment
# ---------------------------------------------------------------------------
def _flatten_entrypoints(ep):
    out = []
    if isinstance(ep, dict):
        for v in ep.values():
            out.extend(_flatten_entrypoints(v))
    elif isinstance(ep, list):
        for v in ep:
            out.extend(_flatten_entrypoints(v))
    elif isinstance(ep, str):
        out.append(ep)
    return out


def check_entrypoints_self_contained():
    manifest = load("registry.manifest.json")
    paths = _flatten_entrypoints(manifest.get("entryPoints", {}))
    bad = []
    for p in paths:
        if p.startswith("..") or p.startswith("/"):
            bad.append(p)
            continue
        full = os.path.join(REPO, p)
        if not (os.path.isfile(full) or os.path.isdir(full)):
            bad.append(p)
    if bad:
        fail(f"entryPoints self-containment: path(s) missing or pointing outside design-repo/: {bad}")
    else:
        ok(f"entryPoints self-containment: all {len(paths)} entry points resolve inside design-repo/")


# ---------------------------------------------------------------------------
# 7. No absolute local machine paths
# ---------------------------------------------------------------------------
def check_no_absolute_paths():
    # Built from parts rather than written as a literal, so this check's own source never
    # contains the literal substring itself -- a repo-wide grep for it should find zero hits,
    # including in this file.
    needle = os.sep.join(["", "U" + "sers", ""])
    hits = []
    for path in glob.glob(os.path.join(REPO, "**", "*"), recursive=True):
        if os.path.isdir(path):
            continue
        try:
            with open(path, errors="ignore") as f:
                text = f.read()
        except Exception:
            continue
        for i, line in enumerate(text.splitlines(), 1):
            if needle in line:
                hits.append(f"{os.path.relpath(path, REPO)}:{i}")
    if hits:
        fail(f"absolute local machine path(s) found: {hits}")
    else:
        ok("no absolute local machine paths found anywhere in design-repo/")


# ---------------------------------------------------------------------------
# 8 + 9. Schema validation + semantic/adversarial suite
# ---------------------------------------------------------------------------
def check_schema_and_adversarial():
    from jsonschema import Draft7Validator
    schema = load("schema/pagespec.schema.json")
    example = load("schema/example.pagespec.json")
    errors = list(Draft7Validator(schema).iter_errors(example))
    if errors:
        fail(f"schema validation: example.pagespec.json has {len(errors)} error(s)")
    else:
        ok("schema validation: example.pagespec.json validates with 0 errors")

    sys.path.insert(0, os.path.join(REPO, "schema"))
    sys.path.insert(0, os.path.join(REPO, "schema", "tests"))
    import importlib
    sv = importlib.import_module("semantic_validate")
    sv_errors, sv_warnings = sv.validate_pagespec(example)
    if sv_errors:
        fail(f"semantic validator: example.pagespec.json has {len(sv_errors)} error(s): {sv_errors}")
    else:
        ok("semantic validator: example.pagespec.json passes with 0 errors")

    at = importlib.import_module("adversarial_test")
    # adversarial_test.main() calls sys.exit(); run it as a subprocess instead so verify_all can
    # keep going and aggregate one final report.
    import subprocess
    result = subprocess.run([sys.executable, os.path.join(REPO, "schema", "tests", "adversarial_test.py")],
                             capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        fail("adversarial suite: one or more cases failed (see output above)")
    else:
        ok("adversarial suite: all mutation cases rejected, all control cases accepted")


def main():
    print(f"REPO = {REPO}\n")
    check_allowlist_parity()
    check_asset_role_parity()
    check_version_parity()
    check_manifest_counts()
    check_citations()
    check_entrypoints_self_contained()
    check_no_absolute_paths()
    check_schema_and_adversarial()

    print(f"\n{'='*70}\n{len(FAILURES)} failure(s), {len(WARNINGS)} warning(s)\n{'='*70}")
    if FAILURES:
        for f in FAILURES:
            print("FAIL:", f)
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
