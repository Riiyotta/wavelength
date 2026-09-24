#!/usr/bin/env python3
"""
Semantic validator for the wavelength-clone design-repo.

Enforces everything JSON Schema structurally cannot express:
  - basedOnTemplate cross-reference: a PageSpec's declared `template` field is checked
    against that template's OWN real node list (not just nodes[] validated in isolation).
    This is deliberately the first, most emphasized check -- see MASTER-GUIDE.md section 3.3,
    "the single most repeated bug class across all reviewed design-repos in this workspace."
  - route/template restrictions (home-only sections, blog-post-only, case-study-only, etc.)
  - rhythm rules from compatibility/graph.json, respecting each rule's severity
  - required reducedMotionFallback presence
  - per-instance maxWords enforcement (walked against the section's own real content schema,
    not just the bundled example)
  - the no-outbound-links product constraint (every href-shaped field must be same-site)

Path portability: REPO is derived from this file's own location, never hardcoded, so this
script (and the whole design-repo) works when copied/zipped to any other machine or path.
"""
import json
import os
import sys
import glob

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

try:
    from jsonschema import Draft7Validator
except ImportError:
    print("ERROR: this validator requires the 'jsonschema' package (pip install jsonschema)", file=sys.stderr)
    raise


def _load(relpath):
    with open(os.path.join(REPO, relpath)) as f:
        return json.load(f)


def _load_templates():
    return {t["id"]: t for t in _load("templates/templates.json")["templates"]}


def _load_sections():
    out = {}
    for path in glob.glob(os.path.join(REPO, "sections", "*.json")):
        if os.path.basename(path) == "_all.json":
            continue
        with open(path) as f:
            s = json.load(f)
        out[s["id"]] = s
    return out


def _load_graph():
    return _load("compatibility/graph.json")["rules"]


MOTION_FALLBACKS = {"static-final-state", "first-frame-static"}


def _check_max_words(schema_node, instance_node, path, errors):
    if not isinstance(schema_node, dict):
        return
    if schema_node.get("type") == "string" and "maxWords" in schema_node and isinstance(instance_node, str):
        n = len(instance_node.split())
        if n > schema_node["maxWords"]:
            errors.append(f"maxWords: {path} has {n} words, exceeds maxWords {schema_node['maxWords']}")
    if "properties" in schema_node and isinstance(instance_node, dict):
        for k, sub in schema_node["properties"].items():
            if k in instance_node:
                _check_max_words(sub, instance_node[k], f"{path}.{k}", errors)
    if schema_node.get("type") == "array" and "items" in schema_node and isinstance(instance_node, list):
        item_schema = schema_node["items"]
        for i, item in enumerate(instance_node):
            _check_max_words(item_schema, item, f"{path}[{i}]", errors)


def _walk_hrefs(obj, path, errors):
    """No-outbound-links rule: every *Href/href-shaped string field must be same-site ('/' or '#')."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, str) and (k.lower().endswith("href") or k == "href"):
                if not (v.startswith("/") or v.startswith("#")):
                    errors.append(f"NO_OUTBOUND_LINKS: {path}.{k} = {v!r} is not same-site (must start with '/' or '#')")
            else:
                _walk_hrefs(v, f"{path}.{k}", errors)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            _walk_hrefs(v, f"{path}[{i}]", errors)


def validate_pagespec(instance, strict_warnings=False):
    """Returns (errors: list[str], warnings: list[str]). Raises nothing; caller decides pass/fail."""
    errors = []
    warnings = []

    schema = _load("schema/pagespec.schema.json")
    v = Draft7Validator(schema)
    schema_errors = list(v.iter_errors(instance))
    for e in schema_errors:
        errors.append(f"SCHEMA: {'/'.join(str(p) for p in e.path)}: {e.message}")
    if schema_errors:
        # Structural failure -- downstream semantic checks would be meaningless (they assume
        # a shape the schema already rejected), so stop here, same as a real generator pipeline would.
        return errors, warnings

    templates = _load_templates()
    sections = _load_sections()
    graph_rules = {r["id"]: r for r in _load_graph()}

    template_id = instance["template"]
    if template_id not in templates:
        errors.append(f"TEMPLATE_UNKNOWN: '{template_id}' is not a real template in templates/templates.json")
        return errors, warnings

    template = templates[template_id]
    template_section_seq = [n["section"] for n in template["nodes"]]
    instance_section_seq = [n["section"] for n in instance["nodes"]]

    # --- THE cross-reference check: declared template vs. its OWN real node list -------------
    if instance_section_seq != template_section_seq:
        errors.append(
            "TEMPLATE_NODE_MISMATCH: declared template '{}' requires this exact node sequence: {} -- "
            "instance has: {}".format(template_id, template_section_seq, instance_section_seq)
        )
        # Still continue running the other checks -- a real reviewer wants the full list, not just the first hit.

    # --- route/template restriction rules -----------------------------------------------------
    home_only = {"hero.home", "proof.logo-strip", "features.platform-grid", "features.product-overview",
                 "proof.enterprise-scale", "proof.testimonials", "faq.integrations-promo", "cta.closing"}
    route_restricted = {
        "hero.blog-post": "template.blog-post", "faq.blog-post": "template.blog-post",
        "hero.case-study": "template.case-study", "content.related-case-studies": "template.case-study",
        "hero.legal": "template.legal", "content.legal-prose": "template.legal",
        "hero.not-found": "template.not-found",
    }
    for sid in instance_section_seq:
        if sid in home_only and template_id != "template.home":
            errors.append(f"HOME_ONLY_SECTIONS: '{sid}' may only appear on template.home, found on '{template_id}'")
        if sid in route_restricted and route_restricted[sid] != template_id:
            errors.append(f"ROUTE_RESTRICTED_SECTIONS: '{sid}' is restricted to '{route_restricted[sid]}', found on '{template_id}'")

    # --- rhythm rules from compatibility/graph.json, respecting severity ----------------------
    def fail(rule_id, msg):
        rule = graph_rules.get(rule_id, {"severity": "error"})
        (errors if rule["severity"] == "error" else warnings).append(f"{rule_id}: {msg}")

    hero_nodes = [i for i, s in enumerate(instance_section_seq) if s.startswith("hero.")]
    if len(hero_nodes) != 1:
        fail("ONE_HERO_PER_PAGE", f"expected exactly 1 hero.* node, found {len(hero_nodes)} at indices {hero_nodes}")
    else:
        for i in range(len(instance_section_seq) - 1):
            if instance_section_seq[i].startswith("hero.") and instance_section_seq[i + 1].startswith("hero."):
                fail("NO_ADJACENT_SAME_CATEGORY_HERO", f"two adjacent hero.* nodes at indices {i},{i+1}")

    if "shell.navbar" not in instance_section_seq:
        fail("SHELL_MUST_BRACKET_PAGE", "shell.navbar is missing")
    else:
        nav_i = instance_section_seq.index("shell.navbar")
        preceding = instance_section_seq[:nav_i]
        if preceding not in ([], ["shell.announcement-bar"]):
            fail("SHELL_MUST_BRACKET_PAGE", f"shell.navbar must be first, or second only after shell.announcement-bar; found preceded by {preceding}")
    if instance_section_seq[-1:] != ["shell.cookie-banner"]:
        fail("SHELL_MUST_BRACKET_PAGE", "shell.cookie-banner must be the last node")
    if len(instance_section_seq) < 2 or instance_section_seq[-2] != "shell.footer":
        fail("SHELL_MUST_BRACKET_PAGE", "shell.footer must be the second-to-last node")

    for cta_id in ("cta.join-the-wave", "cta.closing"):
        if cta_id in instance_section_seq:
            i = instance_section_seq.index(cta_id)
            footer_i = instance_section_seq.index("shell.footer") if "shell.footer" in instance_section_seq else -99
            if i + 1 != footer_i:
                fail("JOIN_CTA_MUST_PRECEDE_FOOTER", f"'{cta_id}' at index {i} must immediately precede shell.footer (found at {footer_i})")

    if template_id in ("template.blog-post", "template.case-study") and "content.article-body" in instance_section_seq:
        i = instance_section_seq.index("content.article-body")
        nxt = instance_section_seq[i + 1] if i + 1 < len(instance_section_seq) else None
        if nxt != "cta.customer-intelligence":
            fail("ARTICLE_BODY_REQUIRES_CI_CTA", f"content.article-body at index {i} must be followed by cta.customer-intelligence, found '{nxt}'")

    # --- per-node checks: reducedMotionFallback, maxWords, no-outbound-links ------------------
    for idx, node in enumerate(instance["nodes"]):
        motion = node.get("motion", {})
        fb = motion.get("reducedMotionFallback")
        if fb not in MOTION_FALLBACKS:
            fail("REDUCED_MOTION_FALLBACK_REQUIRED", f"node[{idx}] ({node.get('section')}) has invalid/missing reducedMotionFallback: {fb!r}")

        sid = node.get("section")
        if sid in sections:
            content_schema = sections[sid]["content"]
            _check_max_words(content_schema, node.get("content", {}), f"nodes[{idx}].content", errors)

    _walk_hrefs(instance, "instance", errors)
    for rid, r in graph_rules.items():
        if r["id"] == "NO_OUTBOUND_LINKS":
            pass  # already enforced via _walk_hrefs above with error severity baked in

    return errors, warnings


def main():
    if len(sys.argv) < 2:
        print("usage: semantic_validate.py <pagespec.json> [<pagespec.json> ...]", file=sys.stderr)
        # No args: validate the bundled example as a smoke test.
        targets = [os.path.join(REPO, "schema", "example.pagespec.json")]
    else:
        targets = sys.argv[1:]

    overall_ok = True
    for t in targets:
        with open(t) as f:
            instance = json.load(f)
        errors, warnings = validate_pagespec(instance)
        status = "PASS" if not errors else "FAIL"
        if errors:
            overall_ok = False
        print(f"[{status}] {t} -- {len(errors)} error(s), {len(warnings)} warning(s)")
        for e in errors:
            print(f"  ERROR: {e}")
        for wmsg in warnings:
            print(f"  WARN:  {wmsg}")
    sys.exit(0 if overall_ok else 1)


if __name__ == "__main__":
    main()
