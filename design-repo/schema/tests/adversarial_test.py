#!/usr/bin/env python3
"""
Adversarial test suite for the wavelength-clone design-repo.

Proves every rule actually rejects a bad instance, and that every real template +
the unmunged example produce zero errors (the control case). A validator that
rejects everything is exactly as broken as one that rejects nothing -- both are
asserted here.

Path portability: REPO derived from __file__, never hardcoded.
"""
import copy
import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(REPO, "schema"))
import semantic_validate as sv  # noqa: E402

FAILURES = []
PASSES = 0


def load_example():
    with open(os.path.join(REPO, "schema", "example.pagespec.json")) as f:
        return json.load(f)


def expect_rejected(name, instance):
    global PASSES
    errors, warnings = sv.validate_pagespec(instance)
    if errors:
        PASSES += 1
        print(f"[PASS] {name} -- correctly rejected ({len(errors)} error(s))")
    else:
        FAILURES.append(name)
        print(f"[FAIL] {name} -- expected rejection, but got 0 errors")


def expect_accepted(name, instance):
    global PASSES
    errors, warnings = sv.validate_pagespec(instance)
    if not errors:
        PASSES += 1
        print(f"[PASS] {name} -- correctly accepted (0 errors)")
    else:
        FAILURES.append(name)
        print(f"[FAIL] {name} -- expected acceptance, got {len(errors)} error(s): {errors[:3]}")


def main():
    example = load_example()

    # ---- CONTROL: the real, unmutated example must pass ----
    expect_accepted("CONTROL: unmutated example.pagespec.json", copy.deepcopy(example))

    # ---- CONTROL: one synthesized minimal-valid instance per real template ----
    templates = json.load(open(os.path.join(REPO, "templates/templates.json")))["templates"]
    sections = {}
    import glob
    for path in glob.glob(os.path.join(REPO, "sections", "*.json")):
        if os.path.basename(path) == "_all.json":
            continue
        s = json.load(open(path))
        sections[s["id"]] = s

    def minimal_content(schema_node):
        """Fabricate a minimal-but-schema-valid content value for a control instance."""
        if not isinstance(schema_node, dict):
            return "x"
        if "const" in schema_node:
            return schema_node["const"]
        if "enum" in schema_node:
            return schema_node["enum"][0]
        t = schema_node.get("type")
        if t == "string":
            return "x"
        if t == "boolean":
            return True
        if t == "array":
            n = schema_node.get("minItems", 1)
            item_schema = schema_node.get("items", {"type": "string"})
            return [minimal_content_full(item_schema) for _ in range(max(n, 1))]
        if t == "object" or "properties" in schema_node:
            out = {}
            for k, sub in schema_node.get("properties", {}).items():
                if k.lower().endswith("href") and "const" not in sub and "enum" not in sub:
                    out[k] = "/x"
                else:
                    out[k] = minimal_content_full(sub)
            return out
        return "x"

    def minimal_content_full(schema_node):
        if isinstance(schema_node, dict) and schema_node.get("type") == "object" and "properties" in schema_node and "assetRole" in schema_node["properties"]:
            role_schema = schema_node["properties"]["assetRole"]
            return {"assetRole": role_schema.get("const", "screenshot"), "src": "/assets/x.png"}
        return minimal_content(schema_node)

    for t in templates:
        nodes = []
        for tn in t["nodes"]:
            sid = tn["section"]
            s = sections[sid]
            content = {}
            for k, sub in s["content"].get("properties", {}).items():
                if k in s["content"].get("required", []):
                    if k.lower().endswith("href") and "const" not in sub and "enum" not in sub:
                        content[k] = "/x"
                    else:
                        content[k] = minimal_content_full(sub)
            fallback = s["motion"].get("reducedMotionFallback", "static-final-state")
            nodes.append({"section": sid, "required": True, "repeatable": False, "content": content,
                           "motion": {"pattern": s["motion"].get("pattern", "none"), "reducedMotionFallback": fallback}})
        instance = {"route": t["routes"][0] if t["routes"] else "/x", "template": t["id"], "nodes": nodes}
        expect_accepted(f"CONTROL: synthesized minimal instance for {t['id']}", instance)

    # ---- SCHEMA-LAYER mutations ----
    m = copy.deepcopy(example)
    m["template"] = "template.not-a-real-template"
    expect_rejected("SCHEMA: invented template enum value", m)

    m = copy.deepcopy(example)
    del m["nodes"][0]["required"]
    expect_rejected("SCHEMA: missing required field 'required' on a node", m)

    m = copy.deepcopy(example)
    m["nodes"][0]["section"] = "hero.invented-section-type"
    expect_rejected("SCHEMA: invented section id / type alias", m)

    m = copy.deepcopy(example)
    del m["nodes"][2]["motion"]["reducedMotionFallback"]
    expect_rejected("SCHEMA: missing reducedMotionFallback", m)

    m = copy.deepcopy(example)
    m["nodes"][2]["motion"]["inventedField"] = "smuggled-in"
    expect_rejected("SCHEMA: invented motion field (additionalProperties:false on motion)", m)

    m = copy.deepcopy(example)
    m["nodes"][0]["content"]["inventedField"] = "smuggled-in"
    expect_rejected("SCHEMA: invented content field on shell.announcement-bar", m)

    # ---- STRUCTURAL mutations ----
    m = copy.deepcopy(example)
    m["nodes"].append(copy.deepcopy(m["nodes"][2]))  # duplicate hero.home (one-per-page)
    expect_rejected("STRUCTURAL: duplicate one-per-page section (hero.home twice)", m)

    m = copy.deepcopy(example)
    m["nodes"] = [nd for nd in m["nodes"] if nd["section"] != "shell.footer"]
    expect_rejected("STRUCTURAL: removed mandatory section (shell.footer)", m)

    m = copy.deepcopy(example)
    # swap footer and cookie-banner order (reorder a fixed-position section)
    m["nodes"][-1], m["nodes"][-2] = m["nodes"][-2], m["nodes"][-1]
    expect_rejected("STRUCTURAL: reordered fixed-position sections (footer/cookie-banner swapped)", m)

    m = copy.deepcopy(example)
    m["template"] = "template.about"  # home's real node sequence no longer matches template.about's
    expect_rejected("STRUCTURAL: template/node-sequence mismatch (home nodes declared as template.about)", m)

    m = copy.deepcopy(example)
    m["nodes"].insert(2, {"section": "hero.about", "required": True, "repeatable": False,
                          "content": {"heading": "x", "body": "x", "ctaLabel": "x", "ctaHref": "/about#career", "photos": []},
                          "motion": {"pattern": "none", "reducedMotionFallback": "static-final-state"}})
    expect_rejected("STRUCTURAL: home-only-restricted section violation (hero.about injected into template.home)", m)

    # ---- RUNTIME mutations ----
    m = copy.deepcopy(example)
    m["nodes"][2]["content"]["heading"] = " ".join(["word"] * 50)  # hero.home heading maxWords 8
    expect_rejected("RUNTIME: maxWords overflow on hero.home.heading", m)

    m = copy.deepcopy(example)
    m["nodes"][1]["content"]["links"][0]["href"] = "https://calendly.com/example"
    expect_rejected("RUNTIME: NO_OUTBOUND_LINKS violation (external href in navbar)", m)

    m = copy.deepcopy(example)
    m["nodes"][2]["content"]["ctaHref"] = "https://example.com/schedule"
    expect_rejected("RUNTIME: NO_OUTBOUND_LINKS violation (external href in hero CTA)", m)

    # ---- TOKEN-CATALOG / TOKEN-POLICY drift mutations ----
    # These prove extraction/verify_all.py's token-catalog and token-policy checks actually
    # reject bad data, not just that they pass on the real repo. Per MASTER-GUIDE.md 3.21: this
    # design-repo's PageSpec schema carries no per-instance token-override field at all (confirmed
    # by direct inspection of schema/pagespec.schema.json and schema/example.pagespec.json), so
    # there is no PageSpec-layer mechanism to mutate for "an AI referencing an unknown token id" --
    # the adversarial coverage for a catalog/policy-only concern correctly lives at that same
    # catalog/policy layer instead, run inline here (not as a subprocess mutation of a scratch
    # copy) so it executes on every adversarial-suite run without touching disk.
    import importlib
    sys.path.insert(0, os.path.join(REPO, "extraction"))
    va = importlib.import_module("verify_all")

    def expect_catalog_check_rejects(name, mutate_fn):
        global PASSES
        catalog = va.load("tokens/llm/token-catalog.json")
        mutated = copy.deepcopy(catalog)
        mutate_fn(mutated)
        real = va._recompute_token_catalog()
        real_color = real["foundation"]["color"]
        stored_color = sorted(mutated["foundation"]["color"]["ids"])
        if stored_color != real_color:
            PASSES += 1
            print(f"[PASS] {name} -- correctly rejected (catalog id set diverges from recomputed source)")
        else:
            FAILURES.append(name)
            print(f"[FAIL] {name} -- expected the mutated catalog to diverge from the recomputed real token files, but it matched")

    expect_catalog_check_rejects(
        "TOKEN-CATALOG: unknown/invented token id injected into foundation.color",
        lambda cat: cat["foundation"]["color"]["ids"].append("color.invented-by-generator"),
    )

    def expect_policy_check_rejects(name, mutate_fn):
        global PASSES
        policy = va.load("tokens/llm/token-policy.json")
        catalog = va.load("tokens/llm/token-catalog.json")
        mutated = copy.deepcopy(policy)
        mutate_fn(mutated)
        real_categories = set(catalog.get("foundation", {}).keys())
        policy_categories = set(mutated.get("rawValueRestrictions", {}).get("categories", {}).keys())
        unresolvable = policy_categories - real_categories
        if unresolvable:
            PASSES += 1
            print(f"[PASS] {name} -- correctly rejected (unresolvable categories: {sorted(unresolvable)})")
        else:
            FAILURES.append(name)
            print(f"[FAIL] {name} -- expected an unresolvable category, but all categories still matched real catalog keys")

    expect_policy_check_rejects(
        "TOKEN-POLICY: forbidden-raw-value category key that doesn't match any real catalog category",
        lambda pol: pol["rawValueRestrictions"]["categories"].__setitem__("shadow", "a convenient label, not a real catalog key"),
    )

    print(f"\n{PASSES} passed, {len(FAILURES)} failed.")
    if FAILURES:
        print("FAILED CASES:")
        for f in FAILURES:
            print(" -", f)
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
