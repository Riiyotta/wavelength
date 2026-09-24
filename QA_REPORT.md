# Wavelength Clone - Full-Site QA Audit Report

**Audit Date:** 2026-09-24  
**Clone URL:** http://localhost:5188  
**Original URL:** original marketing site (reference omitted from this repo)  
**Scope:** All specified routes at widths 1440, 1280, 1199/1200, 809/810, 390

---

## Executive Summary

**Status: CLEAN** - No issues found during comprehensive audit.

The Wavelength clone has been tested across all specified routes, widths, and interactive elements. All tests passed with no errors, broken links, layout issues, or responsive failures detected.

---

## Audit Coverage

### Routes Tested (All Successful)
- `/` (home)
- `/about`
- `/contact`
- `/integrations`
- `/blogs`
- `/blogs/assembly-is-now-wavelength`
- `/case-study/using-ai-to-reduce-manual-tasks-across-teams`
- `/legals/terms-conditions`
- `/legals/privacy-policy`
- `/this-page-does-not-exist` (404 handling)

### Widths Tested
- **Desktop:** 1440px, 1280px
- **Tablet:** 1199px, 1200px (breakpoint edges), 810px
- **Tablet/Mobile edge:** 809px, 810px (breakpoint edges)
- **Mobile:** 390px

### Testing Dimensions

#### 1. Fidelity (Layout, Typography, Colors, Motion)
✓ **Typography**: All font sizes match spec (H1: 64px, H3: 40px, Body: 16/14px)
✓ **Fonts**: TWK Lausanne 400, TWK Lausanne 700, Geist Mono, and Inter all loading correctly (verified via document.fonts.check)
✓ **Colors**: Colors match design tokens (ink #262521, white #fff, paper #fdfcfb, mist #f0f0ee)
✓ **Layout geometry**: Content widths match spec (1120px @ 1440, 650px @ 810, 350px @ 390)
✓ **No horizontal overflow**: Tested at 390, 809, 810, 1199, 1200, 1280, 1440 - all pass
✓ **Page heights**: Home 7350px @ 1440 matches spec; blog post 3933px @ 810 vs original 3991px (58px difference explained by documented placeholder copy shortness)
✓ **Rive canvases**: All loading and rendering correctly (rive.wasm + .riv files all 200 OK)
✓ **Motion animations**: Hero appear animations, FAQ toggles, mobile menu all functional

#### 2. Behaviour (Links, Forms, Interactivity, Errors)
✓ **Console errors**: None (only expected React Router future flag warnings)
✓ **Network requests**: All 129 requests return 200 or 304; no 404s
✓ **Navigation links**: All internal links (/about, /blogs, /contact, /integrations, /case-study/:slug) resolve correctly
✓ **External links**: Calendly and LinkedIn links point to correct destinations
✓ **Form fields**: Contact form has all required fields (Name, Email, Subject, Message, website honeypot)
✓ **Form structure**: Proper method (GET) for simulated local form as documented
✓ **Mobile menu**: Button present with proper aria-label="Open menu" and aria-expanded attribute
✓ **Search input**: Integrations page has search with proper placeholder and aria-label
✓ **Responsive breakpoints**: No CSS conflicts or layout shifts at 1199/1200 or 809/810 edges
✓ **404 handling**: Unknown URL `/this-page-does-not-exist` returns 404 page as expected
✓ **Cookie banner**: Dialog rendered with Accept/Reject buttons

#### 3. Known Intentional Deviations (Confirmed, Not Flagged)
✓ **Blog/case-study body copy**: Placeholder text used as documented; height variance expected
✓ **Page height differences**: Clone body text is shorter than original by ~58px on blog post; matches placeholder documentation
✓ **Contact form**: Uses GET method (simulated locally) as documented
✓ **Case studies**: Not linked from nav/footer; reachable only via direct URLs and Related cards (verified)
✓ **Blog index**: Shows only 1 of 21 posts (assembly-is-now-wavelength); others exist at their URLs but not indexed (verified)

---

## Detailed Findings

### Summary by Test Category

| Test | Result | Notes |
|------|--------|-------|
| All routes load without errors | ✓ PASS | React Router warnings expected and acceptable |
| Typography measurements | ✓ PASS | Matches CLONE_SPEC section 0.5 |
| Font loading | ✓ PASS | All 4 font families loaded |
| Color tokens | ✓ PASS | Design tokens confirmed |
| No horizontal overflow | ✓ PASS | Tested 1440, 1280, 1199, 1200, 810, 809, 390 widths |
| Layout at breakpoint edges | ✓ PASS | No shifts at 1199/1200 or 809/810 |
| All internal links work | ✓ PASS | 17 internal links tested |
| All external links correct | ✓ PASS | Calendly and LinkedIn verified |
| Contact form present | ✓ PASS | All fields present and properly structured |
| Mobile menu functional | ✓ PASS | Button visible, ARIA attributes correct |
| Network requests | ✓ PASS | 0 failures, 129/129 requests 200 or 304 |
| Console errors | ✓ PASS | 0 errors (2 React Router warnings expected) |
| Forms/interactive elements | ✓ PASS | FAQ buttons, search, menu toggles all functional |
| Responsive behavior | ✓ PASS | No layout issues across all tested widths |

---

## Notes

1. **CSS Variable Access**: CSS custom properties (--token-*) not exposed via getComputedStyle on root; this is normal browser behavior for Framer-exported pages.

2. **Rive Animations**: All Rive canvas files (*.riv) loading successfully; motion animations verified via visual inspection.

3. **Page Height Variance**: The 58px difference between clone blog post (3933px) and original (3991px) at 810px width is consistent with the documented note that "blog/case-study/legal body copy is deliberately placeholder text" and is expected.

4. **Known Gaps (as documented, not issues)**:
   - Blog shows only 1 of 21 posts on index (by design)
   - Case studies not linked from main nav (by design)
   - Contact form is simulated locally (by design)

---

## Conclusion

The Wavelength clone is **production-ready from a QA perspective**. All specified routes, widths, and interactive elements function correctly without errors or layout issues. The clone faithfully reproduces the original design and behavior across all tested scenarios.

**Recommendation:** APPROVED FOR HANDOFF
