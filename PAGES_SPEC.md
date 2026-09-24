Source: original marketing site (reference omitted from this repo)

# Wavelength subpages clone spec

Measured live on 2026-09-24 with Playwright (Chromium 153, private headless instance) at 1440, 810 and 390 px (viewport height 900), after scrolling each page top to bottom so lazy content and scroll reveals had fired. Numbers are `getComputedStyle` / `getBoundingClientRect` values. Positions are `[x, y, w, h]` in document px. "D / T / P" means desktop (>=1200) / tablet (810 to 1199.98) / phone (<=809.98), the same breakpoints as the home page.

**Read `CLONE_SPEC.md` first.** Everything in its section 0 (tokens, fonts, type scale, Rive setup, buttons, links), section 1 (announcement banner + nav), section 8.2 (FAQ accordion), section 10 (footer) and section 12 (cookie banner) applies to every page here unless this file says otherwise. This file lists only what is new or different.

Companion files (all under `wavelength-clone/`):
- `PAGES_ASSET_MANIFEST.json`: every new asset (images, SVGs, Rive files with artboard/fit/alignment) and the 21 integrations.
- `src/data/blogs.json`: metadata and body structure for all 21 blog posts.
- `src/data/case-studies.json`: metadata, body structure and Related list for all 18 case studies.
- `recon/pages/<route>-<width>.png`: full-page references for every template at 1440/810/390 (route slashes become `__`).
- `recon/pages/hover-1440-*.png`: hover states. `recon/pages/contact-1440-focus-invalid.png`, `integrations-1440-search-sla.png`, `integrations-1440-search-empty.png`: interaction states.
- `recon/pages/css/<template>.css`: the page's Framer SSR CSS with breakpoint media queries, minus rules identical to the home page. Reference only; don't import.
- `recon/pages/measurements/*.json`: raw per-page, per-width extraction (every text node with font metrics, every box with bg/padding/gap, every image/canvas, appear ids, loaded resources). Use these when you need a number this file doesn't list.

---

## 0. Sitemap and route map

| Route | Template | Framer page chunk |
|---|---|---|
| `/` | home (already built) | VprTl5… |
| `/about` | About (section 2) | -x2U_Au… |
| `/contact` | Contact (section 3) | Ofrk4wv… |
| `/404` and any unknown URL | 404 (section 4). Unknown URLs return HTTP 404 with this same page. | BMq5klX… |
| `/integrations` | Integrations (section 5) | QtvtersO… |
| `/blogs` | Blog index (section 6) | POcT0sD… |
| `/blogs/:slug` (21) | Blog post (section 7) | R311phr… |
| `/case-study/:slug` (18) | Case study (section 8) | MGOgJIr… |
| `/legals/terms-conditions`, `/legals/privacy-policy` | Legal (section 9) | RbZrYUR… |

Slugs are in `src/data/*.json` in sitemap order (which is the CMS collection order).

**Where case studies are linked from:** nowhere in the nav, the footer or any page other than another case study. The footer's "Case Studies" link points to `./` (home). The only inbound links are the three "Related Case Studies" cards at the bottom of each case study (relative hrefs `./<slug>`). Reproduce this as-is.

**Blog index shows 1 of 21 posts.** `/blogs` lists only `assembly-is-now-wavelength` (as the featured card and as the only grid card). The other 20 posts exist and render at their URLs, but nothing links to them. There's no pagination, category filter or search on `/blogs`. The CMS filter that hides them isn't visible in the page output; the clone should render only items with `listedOnIndex: true`.

---

## 1. Shared subpage components

### 1.1 Nav, banner, footer, cookie banner
Identical to home on every subpage: same markup, sizes, links and behaviour. The footer is the same dark footer (291.6 tall at 1440, 267.6 at 810, 473.8 at 390) directly after the last section; there's no extra footer CTA.

**Nav active state (new):** the link for the current top-level page gets `text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; text-decoration-color: #262521`, with no colour or weight change. Measured on `/about` ("About us"), `/blogs` ("Blogs") and `/integrations` ("Integrations"). Blog posts, case studies, contact, legal and 404 show **no** active link (`/blogs/*` does not underline "Blogs").

On phone the nav is the same 48px bar with a hamburger. The page content starts under it at y=80 (banner 35 + nav 48 ≈ 80; hero bg panels start at y=80 on phone, or y=0 where noted).

### 1.2 Page-title H1 preset (new, `8q1ft7`)
Every subpage H1 uses this instead of the home 64px hero H1: TWK Lausanne 400, weight 400.
| | D | T | P |
|---|---|---|---|
| size / line-height / letter-spacing | 48 / 48 (100%) / -0.96px | 38 / 38 / -0.76px | 32 / 32 / -0.64px |

Colour is `#262521` on light heroes and `#fff` on dark heroes.

### 1.3 Section box model (applies to every section below unless noted)
Each section is a full-width block with `overflow: clip`, a bg of `#fff`, and an inner `Container` with `max-width: 1200px; width: 100%`. Horizontal padding is D 160, T 80 and P 20, so the content width is 1120 / 650 / 350. Hero sections put the coloured panel in an absolutely positioned `bg` child (`top: 80px` on D/T, so the panel starts under the nav). The text sits at z-index 3 above the bg and the Rive canvas.

### 1.4 Page hero pattern (About, Contact, 404, Integrations, Blogs, Legal, Blog post, Case study)
- The `bg` panel sits behind the hero; its colour is per page (table below). Inside it is a Rive canvas filling the panel: `<RiveCanvas>` as in CLONE_SPEC 0.6, `stateMachines="State Machine 1"`, `fit: layout`, `alignment: center`, `layoutScaleFactor: 1`. **D uses the "About" artboard file and T uses the "About_Break Point" artboard file. P renders no Rive** (plain colour panel).
- Load appear (all heroes): the text blocks animate `opacity 0.001 → 1`, `y 12 → 0`, spring `duration 0.5, bounce 0`, with delays of 0 (first), 0.05 (second), 0.1 (third) and 0.15 (fourth), in DOM order. Same implementation as home 11.1.

| Page | Panel bg | Panel starts at y | D Rive | T Rive |
|---|---|---|---|---|
| About | `#ffdd03` | 0 on D/T (full section), 80 on P | `HlJWhQXKLiwPA8cob7OjHpIwjhU.riv` | `CUIzkbzcTG52R1qzdAuoh60Fo.riv` |
| Contact | `#ffdd03` | 0 on D/T, 80 on P | HlJWhQ… | CUIzkb… |
| 404 | `#f0f0ee` | 0 | HlJWhQ… | CUIzkb… |
| Integrations | `#262521` | 80 (P 0) | `Uq3YeQEEX0UsPfhU8yFnHzkJZlU.riv` | `8ubTz5jBPfH05evDGWznRfB74M.riv` |
| Case study | `#262521` | 80 | Uq3YeQ… | 8ubTz5… |
| Legal | `#262521` | 80 (P 0) | Uq3YeQ… | 8ubTz5… |
| Blogs index | `#a184fa` | 80 | `HSuPIw4chuDb29eAOVt30CnWew.riv` | `DnAJJnDxUqf6TDdmrNTHXZ5JA.riv` |
| Blog post | `#f4f2f0` | 80 (P 0) | HSuPIw… | DnAJJn… |

All eight files use artboard "About" (D) or "About_Break Point" (T) with fit `layout`. They draw the dotted side patterns seen in the screenshots.

### 1.5 CTA card "Join The Wave" (shared component `framer-vPhyq`, chunk z4HQ…)
It's used at the bottom of About, Blogs, Integrations, Blog post and Case study (it replaces the home CTA of CLONE_SPEC 9, which only appears on home).
- Card: `max-width: 1400px`, width 100% of the container, bg `#262521`, radius 8, `overflow: clip`, flex column centered, gap 40. Padding D `96px 20px`, T `100px 20px`, P `0` (on P the inner wrapper carries `padding: 120px 20px`).
- Inner wrapper: `max-width: 680px` (T 560), column centered, gap 20, z-index above the Rive.
  - H3 (Section H3 preset: 40/44 D, 32/35.2 T, 26/28.6 P), white, centered.
  - P (Body S 14/19.6), white at opacity 0.64, centered.
  - Light primary button "Schedule Demo →" → CALENDLY (P uses "Light Mobile", which looks the same).
- Per-page copy:

| Page | H3 | P |
|---|---|---|
| About | Join The Wave | The first integrated platform for all customer work has arrived |
| Blogs | On the Same Wavelength | Finally, the first AI-Native platform for all customer teams is here. Why wait to start now |
| Integrations | Find your Frequency | All customer conversations and feedback flow into one system, reducing noise and improving decision-making. |
| Blog post, Case study | The only customer platform you will ever need | All customer conversations and feedback flow into one system, reducing noise and improving decision-making. |

- Card height at 1440: 331.6 (about, blogs; 1-line H3), 351.2 (integrations; 2-line P), 395.2 (blog/case; 2-line H3). At 810: 330.8 / 385.6. At 390: 383.8 to 432.
- Three Rive canvases, absolutely positioned inside the card at z-index 0, `pointer-events: none`, each an aspect-ratio box:

| Layer | File / artboard / fit / align | D | T (`v-16urgf6`) | P (`v-13f76fd`) |
|---|---|---|---|---|
| RIGHT.riv | `Aw54OYkSRnZlmjRkUd6iNyKjco.riv` / "Demo 4" / contain / bottomRight | `width 1105; aspect 2.90789` (380 tall), `bottom 0; right 0` | width 919 (316 tall) | height 239, width auto, `left: -305px` (bottom 0, right 0) |
| LEFT.riv | `nhu0tRmUpWwEoH2Ln6s62J1x1Y.riv` / "Demo 5" / contain / bottomLeft | `width 1117; aspect 2.82785` (395), `bottom 0; left 0` | width 819 (290) | **not rendered** |
| TOP.riv | `OInirLcETOKEtorAiFhBgAGxqU.riv` / "Demo 3" / contain / topRight | `width 1192; aspect 2.85916` (417), `top -11px; right 0` | width 849 (297), `top 0; right -9px` | height 244, `top 0; left -153px; right -153px` |

- **Scroll reveal:** H3, P and button each go from `opacity 0, y 12` to `opacity 1, y 0` with spring `duration 0.5, bounce 0`, delays 0 / 0.05 / 0.1. The trigger is 50% of the element in view (`threshold 0.5`), and it plays once.
- Section padding around the card varies: About D `60px 160px`, T `60px 80px`, P `60px 20px`. Blogs and Integrations D `40px 160px 60px`, T `40px 80px 60px`, P `60px 20px`. Blog post and Case study D `120px 160px 60px`, T `80px 80px 60px`, P `60px 20px`.

### 1.6 "Customer Intelligence without complexity" CTA (component `framer-uZkp6`, chunk QGoOvn3td)
Used on Blog post and Case study, directly after the article.
- Card: bg `#262521`, radius 8, `overflow: clip`, flex column, `align-items: flex-end; justify-content: center`, gap 40.
  - D: 1120×248, padding `80px 80px 80px 20px`. Wrapper is a row, gap 24, `max-width: 85%` (867 wide), items centered. It holds the H3 (40/44, white, 563.5 wide, 2 lines) and a button row with gap 10: Light "See How It Works →" (168.3×36) → `../integrations` and No Icon "Contact Us" (101.3×36) → `../contact`.
  - T: 650×210.4, padding `40px 60px`. Wrapper is a column, gap 24, `max-width: 70%` (371). H3 32/35.2.
  - P: 350×237.2, padding `100px 20px 20px`. Wrapper is a column, gap 24. H3 26/28.6. Uses the Light Mobile and No Icon Mobile variants.
- Decorative strip: `/assets/images/PhOrHsyRPTwVeC99j0wnf9Q4Pk.png` (1420×3144, the vertical coloured tracks), absolutely positioned and clipped by the card, `object-fit: cover`:
  - D: `left -83px; top -133px`, 239.8×531 (right 963.172, bottom -150).
  - T: `left -97px; top -133px`, 222.8×493.4.
  - P: rotated 90° (`transform: rotate(90deg)`), box 253×560.2 at `left 71px; top -242px`, so it runs across the top of the card.
- **Scroll reveal:** H3, button 1 and button 2 each go from `opacity 0, y 24` to `opacity 1, y 0` with tween `0.4s cubic-bezier(.33,1,.68,1)`, delays 0 / 0.1 / 0.2. Threshold 0.5, plays once.
- Section padding: D `40px 160px 60px`, T `40px 80px 60px`, P `60px 20px`.

### 1.7 Card hover (blog cards, related case-study cards, integration cards)
All are Framer variant hovers, tween `0.3s cubic-bezier(.33,1,.68,1)`. I sampled the integration card at 60ms intervals and it was 55% done at 60ms and 98% at 180ms, consistent with this curve. The card background changes and all text inside turns `#fff`. Details are per card below.

---

## 2. /about

Screenshots: `recon/pages/about-{1440,810,390}.png`. Document height 3999 / 4174 / 5186.

### 2.1 Hero
- Section: D `padding 160px 160px 300px`, height 721.6. T `160px 80px 220px`, height 610.4. P `150px 20px 240px`, height 612.
- Yellow `bg` + Rive per 1.4 (D About.riv, T About_Breaking, P none).
- Container: `padding 0 20px` (P `0 10px`), column centered, gap 50 (P 30). Text wrapper: gap 20 (P 12), centered.
  - H1 "Building for the revenue teams of tomorrow": 600 wide at D and T (2 lines), P 330 wide. Centered.
  - P (Body L 16/22.4; T/P 14/19.6), `max-width: 440px` (P 330), centered: "We’re reimagining the way GTM teams interact with data, starting with post-sales. We think that every revenue team should be able to interact, understand, and act on customer signals to create a truly magical customer experience."
  - Black primary button "Explore Careers →" (158.6×36) → `./about#career` (in-page anchor to 2.5).
- Image_Wrapper: absolute, `top: 80px`, full width, height 641.6 (T 530.4, P 532), `overflow: clip`, z-index 0.
  - Track illustration `/assets/images/mCdezME6QB37hVMUxrnfofYkG4A.png` (6937×2629), `object-fit: contain`, centered horizontally. D 1440×545.7 at y=480. T 891×337.7 at x=-40.5, y=420. P 468×177.4 at x=-39, y=522.1.
  - Two framed photos, absolutely positioned:
    - Left `4cg2NEy3YbZwGJxueiAbzbVwLVs.jpg`: D 158.1 square at (250.9, 270.9). T 112.9 at (43.5, 273.5). P 90.4 at (4.8, 396.3).
    - Right `tMQC2muSScoj9CE2n0ytLbe7GAs.jpg`: D 147.1 at (1036.4, 276.4). T 105.1 at (657.5, 277.5). P 84.1 at (298, 399.4).
    - Each is `object-fit: cover; border-radius: 8px` inside a frame with a 10px (left) or 8px (right) solid border `rgba(47,40,82,0.1)` (`#2f28521a`) and a `bg` layer of the same colour extending the border (180.7 / 168.2 at D), radius 8.
    - **Appear (load):** left goes from `opacity .001, rotate 8deg, scale .95, y 20` to `opacity 1, rotate -8deg, scale 1, y 0` over tween 0.5s `cubic-bezier(.22,.9,.32,1)`, delay 0.2. Right goes from `rotate -3deg, scale .95, y 20` to `rotate 3deg`, same tween, delay 0.4. Final measured transforms are `rotate(-8deg)` and `rotate(3deg)`.
- Hero text appear: H1 0, P 0.05, button 0.1 (1.4).

### 2.2 Our mission (`id="our-mission"`)
- Section: D `padding 120px 160px 80px`, height 872.1. T `120px 80px 80px`, 747.1. P `60px 20px 80px`, 778.4.
- Container: `max-width: 1400px`, column, gap `48px 20px`, centered.
- Card ("Content"): `max-width: 480px` (P full 350), bg `#f4f2f0`, radius 8, `overflow: hidden`. Padding `60px 40px` (P `48px 20px`), column centered, gap 24. D 480×672.1 at x=480.
  - H4 (Feature preset 32/35.2 D, 28/30.8 T, 26/28.6 P) "Our mission", centered.
  - Rich text, 400 wide (P 310), centered, Body L (T/P 14/19.6). Four paragraphs separated by one empty line (22.4 D / 19.6 T/P). Paragraph 2 has **Wavelength** in TWK Lausanne 700:
    1. "Customer relationships used to feel simple. Signals were clear, context was shared, and teams had a real sense of how their customers were doing. Over time, basic context that teams stored in spreadsheets and email was replaced by complex systems, manual processes, and a focus on data entry."
    2. "We set out to change this outdated model. We don’t believe customer teams need another tool. They need a better way to work with their customers. We called it **Wavelength**—because great customer relationships aren’t linear, they are circular."
    3. "What began as a way to search through revenue data has evolved into an AI-native platform for managing and understanding customer relationships end-to-end."
    4. "From fast-growing startups to global enterprises, modern GTM teams use Wavelength to stay close to their customers. Wavelength helps them focus on what matters most: making customer work feel intuitive again."
  - Top strip Rive `DCOySC2BuXWymEhmnOZXHmu72XI.riv`, artboard "Our Mission", contain/center: 1044×37 at card-top +11. D x=180 (300 left of the card's left edge); the card clips it.
  - Bottom strip Rive `1asyi1d9j29xN9d8sE6Hlgg67Q.riv`, "Our Mission 2", contain/center: 1044×37 about 29px above the card bottom.
- Background tracks Rive `y3w7BY0rkzhHAExCainCnWrcHsw.riv`, artboard "Card", fit cover, center. Absolute behind the card, spanning the page: D 1454.4×366.3 at x=-7.2, 255.7 below section top. T 818×313.8, 219 below. P 394×281, 243 below. These are the horizontal coloured tracks with dots that enter left and exit right in the screenshot.
- Two stickers `/assets/images/umhQGx0rXCUSSr8zH3WCQoqTiNY.png` (560×750), `object-fit: cover`, z-index 1, 154.9×194.4 (P 111×139.3):
  - TR: D at (845.6, 733.1), overlapping the card's top-right corner.
  - BL: D at (451.6, 1465.8), overlapping the bottom-left.
  - **Scroll reveal:** each goes from `rotate -7deg, scale .95` to `rotate 7deg, scale 1` (opacity stays 1), tween 0.5s `cubic-bezier(.22,.9,.32,1)`. BL has delay 0.2, TR delay 0. The trigger is the mission container reaching 50% in view (`threshold .5`); plays once.

### 2.3 Our Values
- Section: D `padding 80px 160px`, height 685.2, bg `#f0f0ee` (full-bleed `bg`). D only: About.riv canvas (`HlJWhQ…`, "About", layout) fills the section and draws the dotted side patterns. T/P have no Rive. T `80px`, 1050.8. P `60px 20px 80px`, 1524.9.
- Content: column, gap 30 (T 40). H4 "Our Values" centered (text wrapper gap 21).
- Grid: D 4 columns × 2 rows, cards 265×220, gap 20. T 2 columns, 315×190, gap 20. P 1 column, 350 wide, gap 20, heights 163 (2-line body) or 143.4 (1-line).
- Value card: bg `rgba(253,252,251,0.8)` (`#fdfcfbcc`, the `paper-80` token), radius 8, `padding 20px`, column, gap 30 (P 20), `overflow: hidden`.
  - Icon 32×32, the full-colour SVG (`/assets/svg/about-<slug>.svg`, viewBox 18, rendered at 32, no tile).
  - Title wrapper (column, gap 12): H6 (Card H6 20/22 D/T, 18/19.8 P) and P (Body S 14/19.6, opacity 0.8).

| # | Icon file | Title | Body |
|---|---|---|---|
| 1 | about-empathy.svg | Empathy | We should know what our customer's needs are, and build from that |
| 2 | about-beautiful-design.svg | Beautiful Design | Software should be beautiful, it’s in the details |
| 3 | about-accountability.svg | Accountability | Taking things end-to-end, own mistakes, trust each other |
| 4 | about-less-is-more.svg | Less is More | Quality over quantity, anyday |
| 5 | about-question-everything.svg | Question Everything | Assume nothing, disagree, be open minded. |
| 6 | about-relentless-purpose.svg | Relentless Purpose | Don’t do busy work |
| 7 | about-it-will-be-ugly.svg | It will be ugly | It won’t be easy - doing great things never are |
| 8 | about-no-finish-line.svg | No Finish Line | We’re changing the way people work - forever |

- **Scroll reveal:** each card goes from `opacity 0` to `opacity 1` (no translate), spring `duration 0.5, bounce 0`, threshold 0, once. Delays by card: 0.05, 0.1, 0.15, 0.2, 0.25, 0.3 (this one has `duration 0.7`), 0.4, 0.45.
- Hover: none. I checked; the computed styles didn't change.

### 2.4 The Team
- Section: D `padding 80px 160px`, height 550.4. T `80px`, 537.6. P `60px 20px 80px`, 568.8.
- Container: gap `48px 20px` (P 30). Text wrapper: gap 8.
  - H4 "The Team".
  - P (Body L; T/P 14/19.6), `max-width: 480px`, left: "We've worked at some of the largest companies in the world, shipped products to billions, and have been backed by Y Combinator, Village, and so many more."
- Grid: D 4 columns, cards 265×106, gap 20. T 3 columns (203.3). P 2 columns (165×87.8), gap 20.
- Team card (CMS list): bg `#f0f0ee`, radius 8, `padding 12px`, column, gap 20 (P 12). It holds a 40×40 logo (P 32), `object-fit: contain`, radius 4, and an H6 name (20/22; P 18/19.8).
- Items in order: Y Combinator `1eVahYVFxvy4F0rN19A3EhOqjLc.png`, Village Global `YSOCLc10Pm5giKy92FKDm3N98.png`, Apple `aARJ5drAj0mHZPvWzaEjVqZjdLI.png`, Intuit `3IEZBrREHwPvhMW0nkAp2jvHEo.png`, Convoy `40V2YTi7ouK9RIAqsmTiMKppQcs.png`, Berkeley `qF3RCB3tZef2Qb5l9UUaDfG8w.jpeg`.
- Scroll reveal: opacity 0 → 1, spring 0.5 / bounce 0, delay `index × 0.05`, once. No hover.

### 2.5 Open roles (`id="career"`)
- Section: D `padding 80px 160px`, height 426.4, gap 0. The `bg` panel is inset 20px (x=20, w=1400 at D), bg `#f0f0ee`, radius 8. T `80px`, 510.2. P `60px 20px 80px`, 724.2; on P the panel is still inset (radius 8).
- Content: column, gap 40 (P 30). Text wrapper gap 8: H4 "Open roles" and P (Body L) "Join us and be part of something extraordinary!".
- Cards: D 2 columns, 550 wide, gap 20. T 2 columns, 315. P 1 column, 350.
- Role card: the whole card is an `<a>` (`target="_blank"`) with an absolute `bg` layer of `rgba(253,252,251,0.8)`, radius 8, `overflow: clip`.
  - Padding 20. D is a row: 32×32 icon (`about-role-icon-blue.svg` / `-pink.svg`), gap 20, then the content column (345.8 wide, gap 12), with "Learn More →" top-right.
  - Content column: H6 title; P (Body S, opacity 0.8); a chip row (gap 12) of chips with bg `#f4f2f0`, radius 8, `padding 8px`, text 14/19.6 at opacity 0.8.
  - Link "Learn More →" is 14/18.2 `#262521` with the arrow in the same underline: `underline 1px, offset 4px` (the Framer "Underline" link component). T and P put it below the chips, left-aligned, and stack the icon above the text (card height T 251.8, P 248.8 / 229.2).

| Title | Body | Chips | href |
|---|---|---|---|
| Founding Engineer | Build systems end-to-end for the fastest growing companies | San Francsisco (sic), Full-time | https://www.workatastartup.com/jobs/8020 |
| Founding Engineer (Remote) | Build scalable systems from scratch | India, Contract | https://www.workatastartup.com/jobs/8276 |

- Scroll reveal: opacity 0 → 1, spring 0.5, delay `index × 0.05`. Hover: none measured.

### 2.6 CTA card
Component 1.5 with "Join The Wave". Section D `60px 160px`.

---

## 3. /contact

Screenshots `recon/pages/contact-*.png` and `contact-1440-focus-invalid.png`. Document height 1157 / 1178 / 1200. There is only one section, then the footer.

### 3.1 Layout
- Section: D `padding 160px`, height 865.6. T `160px 80px 220px`, 910. P `150px 20px 60px`, 726.
- Yellow `bg` + Rive: D About.riv, T About_Breaking.riv, P none (on P the panel starts at y=80).
- Container: `padding 0 20px` (P 0), column, gap 50 (P 30). Text wrapper: `max-width: 480px`, column, `align-items: flex-start`, gap 20 (P 16), centered in the page. At D it is at x=480.
  - H1 "Contact Us" (page-title preset), left-aligned block (234.3 wide at D).
  - P (Body L; T/P 14/19.6), `max-width: 440px`, left-aligned: "Reach out for support, inquiries, or to learn more about how Assembly can elevate your customer experience." (Says "Assembly"; keep it.)
  - The form (3.2).
- Appear: H1 at delay 0, P at 0.05. The form has no appear animation.

### 3.2 Form (Framer native form, `framer-d0Rps`)
- `<form>` with no action or method attribute; Framer's form runtime posts it. `novalidate` is **false**, so native HTML validation runs. Layout: `display: flex; flex-direction: column; gap: 20px; width: 480px` (P 350), `overflow: hidden`.
- Four fields. Each is wrapped by Framer in a `<button type="submit">` "Text" component (a Framer quirk). Don't copy that; use a plain `<label>`/`<div>`.

| # | Element | name | type | required | placeholder | Box |
|---|---|---|---|---|---|---|
| 1 | input | `Name` | text | no | Name | 480×44 |
| 2 | input | `Email Address` | email | **yes** | Email Address | 480×44 |
| 3 | input | `Subject` | text | no | Subject | 480×44 |
| 4 | textarea | `Message` | textarea | no | Message | 480×160, `min-height: 160px`, `resize: vertical` |

- Field wrapper (`.framer-form-text-input`): bg `#f0f0ee`, radius 6, `padding: 10px`, height 44, flex row, `align-items: center`, no border and no shadow at rest. `transition-property: background, box-shadow`.
- Input text: TWK Lausanne 400, 16px, line-height 1.2em (19.2px), letter-spacing 0, colour `#262521`, bg transparent, no border, `outline: none` on focus-visible. Placeholder colour `rgba(38,37,33,0.6)`. The textarea has its own `padding: 10px` (the wrapper has 0 for textareas).
- **Focus state:** a 1px solid `#262521` ring drawn by the wrapper's `::after` (`--framer-input-focused-border-color: #262521; --framer-input-focused-border-style: solid; --framer-input-focused-border-width: 1px`), shown via `:focus-within`, with `border-radius: inherit` (6px). Background is unchanged.
- **Invalid state:** there's no custom styling. Typing "not-an-email" in Email and blurring leaves the field visually unchanged; `checkValidity()` is false. On submit the browser shows its native bubble ("Please include an '@' in the email address…"). An empty required Email also triggers the native "Please fill out this field." bubble. Nothing else is validated.
- Honeypots: 10 hidden `type="text"` inputs (`website, company, message, subject, title, description, feedback, notes, details, remarks`), 0×0, `autocomplete="one-time-code"`. They're Framer's spam trap; the clone can include one hidden honeypot or skip them.
- **Submit button** (Framer component `framer-YKBon`), `type="submit"`, auto width (164.2×40.8): bg `#262521`, radius 6, `padding: 10px`, row with gap 10. Label "Submit message" (Button preset 16/20.8, white) then "→". Transition on all states is tween `0.2s cubic-bezier(.44,0,.56,1)`.

| Variant | Trigger | Bg | Content |
|---|---|---|---|
| Default | idle | `#262521` | "Submit message →", white |
| Hover | pointer over | `rgba(51,51,51,0.85)` (measured) | same |
| Pressed | mousedown | `rgb(51,51,51)` | same |
| Loading | form pending | `#262521` | label hidden; 20×20 spinner: a conic gradient `from 0deg, rgba(255,255,255,0) 7.2deg → #fff 342deg`, masked by `/assets/svg/form-spinner-mask.svg` (ring), rotating 360° over 1s linear, infinite |
| Success | submit OK | `#262521` | "Thank you" (white) |
| Error | submit failed | `rgba(255,34,68,0.15)` | "Something went wrong", colour `#ff2244` (red token) |
| Disabled | while incomplete (Framer "incomplete" state) | opacity 0.5 | same |

- Behaviour: on submit Framer POSTs to its form backend, shows Loading, then Success or Error. The page doesn't navigate or redirect, and the fields stay filled. **I didn't submit the form**, per instructions; Success and Error come from the component code, not from observation. In the clone, wire submit to a stub (or a real endpoint if you have one) and drive these variants.

---

## 4. /404 (also served for unknown routes)

- One section with `height: 100vh` (from the page CSS; 900 at every width tested), then the footer. Document height 1192 / 1168 / 1374.
- Section: D `padding 140px 160px 80px`, T `140px 80px 80px`, P `120px 20px 40px`. Bg `#f0f0ee` over the full section (y=0). Rive: D About.riv, T About_Breaking, P none.
- Container: `padding 0 20px` (P `0 10px`), text wrapper gap 20 (P 12), everything centered **vertically and horizontally**. H1 top at D y=406.8.
  - H1 "Page not found".
  - P (Body L; T/P 14) "We can’t find the page you were looking for."
  - Black primary button "Return Home →" (136.3×36) → `./`.
- Appear: H1 0, P 0.05, button 0.1.

---

## 5. /integrations

Screenshots `recon/pages/integrations-*.png`, `integrations-1440-search-*.png`, `hover-1440-integration-card.png`. Document height 3434 / 4274 / 5911.

### 5.1 Hero (dark)
- Section: D `padding 140px 160px 0`, height 583.2. T `140px 80px 0`, 464.8. P `150px 20px 30px`, 454.8. The `bg` is `#262521` from y=80 (P from y=0), with Rive `Uq3YeQ…` (D) or `8ubTz5…` (T).
- Container: column centered, gap 80 (T 30, P 20). Text wrapper gap 20 (P 12):
  - H1 in two lines rendered as two `<span>`s: "Connect With Your" / "Tools Seamlessly" (non-breaking space between Tools and Seamlessly). White, centered, page-title preset. Each span box is 54 tall at D because of span line boxes; the H1 is 96 tall.
  - P (Body L; T/P 14) white, `max-width: 440px`, centered: "Explore over 40+ integrations to streamline your workflow, from Slack to Zendesk, and supercharge your team’s efficiency in just a few clicks!"
- **Icon cluster** (appear id `1tria3`): a box 840×180 at D (x=300, clipped, bg `#262521`). T 630×105 at x=90. On P it's scaled 0.75 (630×90 box at x=-120, overflowing both edges).
  - Inside: `/assets/svg/integrations-hero-tracks.svg` (viewBox 1150×576), rendered 865.2×433.3 at x=-12.6 (T 648.9×325), `overflow: clip`. It draws the coloured rounded-rectangle tracks.
  - Six icons, absolutely positioned, z-index 1. Each is 48×48 (P 36): image `object-fit: contain`, radius 8, 4px solid `#262521` border, plus a 6px coloured ring via `box-shadow: 0 0 0 6px <colour>`.

| Icon | Image | D pos in cluster (x, y) | Ring | Loop offset |
|---|---|---|---|---|
| Gmail | 7B7ZrreucQrygOVcmetA7S0dc.png | 110.5, -8 | `#f9720d` | x +120 |
| Hubspot | 8r7sztvIXadESA8pCpk8slX4XTc.png | 334.5, -8 | `#f9720d` | x +120 |
| Intercom | S3RKtEYSzUUuSahluNIMk9GLeA.png | 646.3, -8 | `#f9720d` | x -80 |
| Salesforce | CzSofVwEgTZxiejLbyBAGwUpyX8.png | 25.7, 59 | `#f677fd` | x +80 |
| Slack | gCGFzFGCt80Cbr9gMxJX3CEgM.png | 225.7, 59 | `#f677fd` | x +80 |
| Linear | UfTrFPCijebpj5IFlfRkLKLacOI.png | 547.7, 59 | `#f677fd` | x +80 |
| (Whatsapp) | none; zero-size layer | n/a | n/a | y +40 (invisible) |

  - **Loop animation:** each icon translates from 0 to its offset and back, forever. The Framer loop is tween `duration 3s, ease cubic-bezier(.5,0,.5,1)`, `repeatType: mirror`, repeat delay 0, starting on mount. Icons slide along the tracks.
  - Cluster appear: `opacity .001, y 12` → `opacity 1, y 0`, spring 0.5, delay 0.1. On P the appear keeps `scale: 0.75`.
- Hero text appear: H1 0, P 0.05.

### 5.2 Integrations list
- Section: D `padding 100px 160px 80px`, height 2107.6. T `80px`, 3091.2. P `60px 20px 80px`, 4458.9.
- Container: column, gap `48px 20px` (P 40).
  - H4 "Integrations", left.
  - **Search field** (Superfields search, `id="superfields-*"`): 440×44.4 at D and T (`max-width: 100%`; P full 350). Bg `#f4f2f0`, radius 8, `padding: 10px`, flex row, `align-items: center`, gap 10, `cursor: text`.
    - Icon: 20×20 SVG, viewBox 24, stroke `#262521`, stroke-width 1.5, round caps and joins, `opacity: 0.5`. Paths `M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0` and `M21 21l-6 -6`.
    - Input: no border, bg none, TWK Lausanne 16px / 1.4em (22.4), colour `#262521`. Placeholder "Search integrations" in `rgba(38,37,33,0.5)`.
    - An absolute overlay `inset: 0` with a 1px solid `#262521` border, `border-radius: inherit`, sits over the field (it measured visible at rest at 390; treat it as the focus ring, shown on focus).
  - **Behaviour:** live filter as you type, case-insensitive substring match on the integration **name** ("sla" → only Slack). No debounce was observable (the result was ready within 900ms). With no matches the grid is replaced by a centered P (Body L, `text-align: center`): **"No items matching filters"**. Clearing the input restores all 21. No pagination and no sort control. The order is alphabetical, as in the CMS.
  - **Grid:** D 3 columns, 365.3 wide, gap 12 (rows 240 tall, row pitch 252). T 2 columns, 319 wide, gap 12. P 1 column, 350. Cards are `height: 240px` at every width.
- **Integration card** (whole card is `<a href=<vendor url> target="_blank">`):
  - Bg `#f4f2f0`, radius 8, `padding: 24px 0`, column centered, gap 24.
  - Row 1 "Wrapper" (48 tall, `padding-left: 24px`, row, gap 16, items centered):
    - Track strip ("svg" layer): absolute, full card width, 39 tall at wrapper-top +4.5, opacity **0.1**, z-index 0, `overflow: clip`. It contains:
      - A `bg` with 6px solid black top and bottom borders.
      - Four equal segments (91.3 wide at D, 1px solid black dividers). Each segment is `#a7a7a7` with an inner random-colour fill layer.
      - Segments 2 and 4 carry a centered group of three 12×12 dots (bg `#f4f2f0`, 2px solid `#262521` border, radius 50%, gap 10).
    - Icon tile: 60×60, bg `#f4f2f0`, radius 8, `padding: 6px`, `box-shadow: 0 0 0 2px #dcdad8`, z-index 1. Holds the 48×48 vendor icon (`object-fit: cover`, radius 8).
  - Row 2 "Content" (`padding: 0 24px`, column, gap 16): H6 name (20/22) and P description (Body L 16/22.4 D; 14/19.6 T/P; opacity 0.8).
  - **Hover** (0.3s `[.33,1,.68,1]`):
    - Card bg → `#262521`; H6 and P → `#fff`.
    - Track strip opacity 0.1 → 1.
    - Icon tile bg → `#000`; ring → `0 0 0 2px #171717`.
    - The segments show their colours. The outer segment colours were `#ffdd03, #f677fd, #f9720d, #f677fd`. The inner fills are a "random colour" code component: each segment picks **one random colour at mount** from `[#f677fd, #a184fa, #63f6b5, #ffdd03, #f9720d, #678efd]` (default `#a7a7a7`), so every card and every page load differs. Implement it with `useMemo(() => colors[Math.floor(Math.random()*6)])`.
  - **Scroll reveal:** each card goes from `opacity 0, y 12` to `1, 0`, spring 0.5 / bounce 0, delay `index × 0.05`, threshold 0, once.
- The 21 integrations (name, description, href, icon) are in `PAGES_ASSET_MANIFEST.json` → `integrations`. Keep the source copy exactly, including lowercase "wavelength" in Hubspot's line and "https://linear" as Linear's href.

### 5.3 CTA card
Component 1.5, "Find your Frequency".

---

## 6. /blogs (index)

Screenshots `recon/pages/blogs-*.png`, `hover-1440-blog-*.png`. Document height 1986 / 1926 / 2154.

### 6.1 Hero
- Section: D `padding 140px 160px 80px`, height 702.8. T `140px 80px 60px`, 667.2. P `150px 20px 20px`, 726.3. The `bg` is `#a184fa` (violet) from y=80, with Blog.riv (D) or Blog Breaking (T).
- Container: column, gap 50 (P 30). Text wrapper: gap 20 (P 12), centered.
  - H1 "Blog".
  - P (Body L; T/P 14), `max-width: 440px`, centered: "Discover how modern GTM teams have changed their work with Wavelength".
- **Featured card** (`<a>` → `./blogs/assembly-is-now-wavelength`; appear delay 0.1):
  - D: 900×320 centered (x=270), bg `#fdfcfb`, radius 8, `padding: 20px`, row, gap 40.
    - Left wrapper (420×280, column, `justify-content: space-between`). Its text wrapper (gap 20) holds the H4 title (32/35.2) and the P excerpt (Body S, opacity 0.8, `max-width: 240px`). "Read More →" (underline link, 14/18.2) sits at the bottom.
    - Right: image `/assets/images/AcwsZwnlfPgOR358Zn4ZX8nmY.png`, 420×280, `object-fit: cover`, radius 8.
  - T: 650×320, the two halves are 295 wide with gap 20. H4 28/30.8.
  - P: 350×443.1, column. Image first (310×232.5, radius 8), then the text wrapper (gap 24; inner gap 12). H4 26/28.6.
  - **Hover:** bg `#fdfcfb` → `#262521`; title, excerpt and link → `#fff`. The mid-transition sample at 150ms was `rgb(76,75,73)`.

### 6.2 Post grid
- Section: D `padding 40px 160px 80px`, column, gap 80. T `40px 80px 80px`. P `60px 20px 80px`.
- Grid: D 3 columns of 360 (only one item exists: 360×440 at x=160). T 315×440. P 350×309.8.
- **Post card** (`<a>` overlay, bg `#f4f2f0`, **radius 0**, `overflow: clip`):
  - Date "February 6, 2026" (Body S 14/19.6, `#262521`) at card +20, +14.
  - Wrapper at card-top +48: `padding: 30px 20px`, bottom radii 8, column, gap 20. Content (gap 20): H5 title (Enterprise H5 preset 24/28.8 D, 20/24 T/P), P excerpt (Body S, opacity 0.8), "Read More →" underline link.
  - Decorative strip `PhOrHsyRPTwVeC99j0wnf9Q4Pk.png` rotated 90° (`transform: rotate(90deg)` on a 300×664.2 box, so it renders 664.2×300) at `left: 180px; top: 70.8px` (T `left 157.5px`, P `left 175px; top -59.4px`). The card clips it, so only its end shows as coloured horizontal tracks at the card bottom.
  - **Hover:** bg `#f4f2f0` → `#34332e` (`ink-2`); text → `#fff`.
  - Scroll reveal: `opacity 0` → 1 (no translate), spring 0.5, delay `(i % 9) × 0.05` (the phone list uses `i % 10`), threshold 0, once.

### 6.3 CTA card
Component 1.5, "On the Same Wavelength".

---

## 7. /blogs/:slug (blog post template, 21 posts)

Samples measured: `assembly-is-now-wavelength` and `using-ai-to-reduce-manual-tasks-across-teams`; they are identical apart from title and excerpt. Screenshots `recon/pages/blogs__*.png`. Document height 4105 / 3991 / 3986. Per-post data is in `src/data/blogs.json`.

### 7.1 Hero
- Section: D `padding 140px 160px 0`, height 740. T `140px 80px 0`, 660. P `150px 20px 0`, 510. The `bg` is `#f4f2f0` from y=80 (P from 0), with Blog.riv (D) or Blog Breaking (T).
- Container: `padding 0 20px` (P `0 10px`), column centered, gap 50 (P 30), `overflow: clip`.
- Text wrapper: `max-width: 800px`, centered, gap 20 (P 12).
  - Meta row (appear delay 0): row, gap 10, centered. Author "Pranav Mallampalli", a 6×6 circle dot (bg `rgba(38,37,33,0.06)`, radius 100%), then the date "February 6, 2025". Both use the Caption preset (12/16.2, -0.12px) in `#262521`.
  - H1 title (page-title preset), centered, 800 wide at D (2 lines), T 610, P 330 (3 lines). Appear delay 0.05.
  - P excerpt (Body L; T/P 14), `max-width: 600px`, centered. Appear delay 0.1.
- Hero art (appear delay 0.15, `opacity .001, y 12` → 1): `/assets/svg/blog-hero-arrow.svg`, `object-fit: fill`. D 972×602.7 at (234, 387). T 549×340.4 at (130.5, 341.8). P 330×204.6 at (30, 355.4). The section clips it at the bottom edge.

### 7.2 Article
- Section: D `padding 100px 160px 40px`. T `100px 80px 40px`. P `40px 20px`.
- Container: row, gap 80, `justify-content: center`, `align-items: flex-start`, `max-width: 1200px`. Three children:
  1. **TOC ("Filter")**, 112 wide: `position: sticky; top: 120px`, z-index 1, column, gap 6. **Hidden on phone.** Details in 7.3.
  2. **Content** column, gap 48 (P 32): 735.9 wide at D, 458 at T, 350 at P.
  3. A **second, invisible copy** of the TOC (`opacity: 0`, 112 wide, the 5-item case-study variant). It balances the row so the content is centered. Reproduce it with an empty 112px spacer (hidden on T/P). At T the visible TOC is at x=80 and the content at 272.
- **Content blocks** (in order, from `bodyOrder` in blogs.json):
  - Section block (`id` = anchor: `overview`, `the-challenge`, `the-approach`, `why-it-matters`): column, gap 16, `overflow: clip`.
    - H6 heading (Card H6: 20/22 D/T, 18/19.8 P, `#262521`).
    - Rich text of `<p>`s (Body L 16/22.4 D; 14/19.6 T/P; `#262521`, left). Paragraphs are separated by **empty `<p>`s**, each one line tall (22.4 / 19.6), not by margins. blogs.json marks these as `{"type":"spacer"}`.
  - Image block between "The Challenge" and "The Approach": `AcwsZwnlfPgOR358Zn4ZX8nmY.png`, full content width, `object-fit: cover`, radius 8, `overflow: hidden`. D 735.9×551.9, T 458×343.5, P 350×262.5 (aspect 4:3).
- Body structure (identical in all 21 posts; placeholder copy is fine):

| Anchor | TOC label | H6 text | Paragraphs (words) |
|---|---|---|---|
| overview | Overview | Overview | 34, 15 (no spacer between) |
| the-challenge | The Challenge | Customer relationships used to feel simple | 17 · 21 · 24 (spacer between each) |
| (image) | | | 4:3 image, radius 8 |
| the-approach | The Approach | The Approach | 29 · 31 · 17 |
| why-it-matters | Why It Matters | Why we built this | 28 · 20 · 20 · 15 |

  No lists, quotes, links, bold or code appear in any post body.

### 7.3 TOC (component `framer-lX1SC`)
- Each item is an `<a href="./<slug>#<anchor>">`: flex row, gap 12, `align-items: center`, height 22.
  - Indicator ("wrapper") 8×22 with two layers:
    - `bg` pill 8×22, radius 29px. Inactive `rgb(217,217,217)` (`#d9d9d9`); active `#262521`.
    - `dot` 4×4, bg `#fdfcfb`, radius 100%, at x=2. Inactive at y=2 (top of the pill); active at y=16 (bottom).
  - Label: P, Body S (14/19.6), `#262521`, at x=20. It doesn't change between states.
- Hover on an inactive item: the pill → `#262521` (the dot doesn't move).
- Transition for all TOC changes: tween `0.5s cubic-bezier(.33,1,.68,1)`, so the dot slides top → bottom and the pill darkens.
- **Active logic:** Framer scroll variants. Each item targets its section ref with `threshold: 0`, not once. An item is Active while its section is in the viewport. Samples at 1440:

| scrollY | Active |
|---|---|
| 0 and 700 | Overview |
| 1100 and 1500 | The Challenge |
| 1900 | The Approach |
| 2300+ | The Approach **and** Why It Matters |

  Two items can be active at once on the source. Reproduce that with an IntersectionObserver per section (active = intersecting), or pick the topmost if you prefer; note the difference.
- Click: jumps to `#anchor` with `scroll-behavior: auto` (instant, no smooth scroll) and updates `location.hash`. Clicking "The Challenge" landed at scrollY 1016.
- At scrollY 0 the TOC is at D y=840 (content top). It sticks once its top reaches 120px.

### 7.4 "Customer Intelligence without complexity" CTA
Component 1.6.

### 7.5 FAQ
The home FAQ (CLONE_SPEC 8.2) inside a grey panel:
- Section: D `padding 80px 160px`, height 442. T `80px`, 597. P `60px 20px`, 577.6.
- Panel: `bg` inset 20px (D 1400 wide), `#f0f0ee`, radius 8. On P it is inset 0 with radius 0.
- Rive inside the panel: D `HSuPIw…` (Blog.riv, artboard "About", layout), 1400×402. T `DnAJJn…`, 814×557. P none.
- Content: row at D (left text wrapper 560 wide with H3 "Frequently Asked" and the P at opacity 0.6, `max-width: 320px`; right the FAQ list 560 wide, gap 10). T and P use a column (gap 40 / 30).
- **Difference from home:** accordion items have bg **`#fbfaf9`** (not `#f0f0ee`) with the same 1px `rgba(230,230,230,0)` border and radius 8, 48.4 tall closed at D. On P the question is 14/18.2 (-0.14px) and items are 46 or 62.4 tall. Same five Q&As, same behaviour, `+` icon 20×20 at the right.

### 7.6 CTA card
Component 1.5, "The only customer platform you will ever need". Section D `120px 160px 60px`.

---

## 8. /case-study/:slug (18 case studies)

Samples measured: `using-ai-to-reduce-manual-tasks-across-teams` and `turning-raw-data-into-clear-business-decisions` (identical except text). Screenshots `recon/pages/case-study__*.png`, `hover-1440-related-case-card.png`. Document height 4368 / 4237 / 5360. Data is in `src/data/case-studies.json`.

### 8.1 Hero (dark)
- Section: D `padding 140px 160px 20px`, height 713.2. T `140px 80px 20px`, 631.2. P `150px 20px 20px`, 567.2. The `bg` is `#262521` from y=80, with Rive `Uq3YeQ…` (D) or `8ubTz5…` (T).
- Bottom track strip: `/assets/images/g5yjnDc0WoLZMg4PIjD9w2ZdC8.png` (5308×801), absolute, `object-fit: cover`. D 1180×178.1 at (130, 555.2). T 690×104.1 at (60, 547.1). P 390×58.8 at (0, 518.3). These are the tracks under the cover.
- Container: z-index 3, column centered, gap 50 (P 30). `padding-bottom` 100 (T 70, P 30).
  - Text wrapper: `max-width: 800px`, gap 20 (P 12). H1 (white, page-title preset, 800 wide, 2 lines at D) and P excerpt (Body L; T/P 14; white; `max-width: 440px`), both centered. There is **no author or date** on case studies.
  - Cover `9ztf1OxOfNWaDQZHlFzRewVYbw.png`, `object-fit: cover`, radius 8. D 400×242.4 at x=520, y=350.8. T 400×216. P 313.5×190.
- Appear: H1 0, P 0.05, cover 0.1 (`opacity .001, y 12`, spring 0.5).

### 8.2 Article
Same layout as the blog post (7.2 and 7.3), with these differences:
- The TOC has **5 items**: Overview, The Challenge, The Approach, The Impact, Why It Matters. Anchors: `overview, the-challenge, the-approach, the-impact, why-it-matters`. The hidden balancing copy is the same 5-item list.
- H6 headings equal the TOC labels.
- The image block between "The Challenge" and "The Approach" is an **empty grey box** on the source: `div[data-framer-name=Image]` with bg `#f4f2f0`, radius 8, height 460, full content width, and no `<img>` (the CMS image field is empty). Reproduce the grey box.
- Body structure (identical for all 18):

| Anchor | Paragraphs (words; `·` = spacer between) |
|---|---|
| overview | 68 |
| the-challenge | 60 · 27 |
| (image placeholder) | 460-tall grey box |
| the-approach | 35 · 50 |
| the-impact | 8, 7, 8, 7 (four one-line `<p>`s with no spacers, which read as a list but are not `<ul>`) · 20 |
| why-it-matters | 32 · 24 |

- Section padding: D `100px 160px 40px`, T `100px 80px 40px`, P `40px 20px`.

### 8.3 "Customer Intelligence without complexity" CTA
Component 1.6.

### 8.4 Related Case Studies
- Section: D `padding 120px 160px 0`, height 602.9. T `120px 80px 0`. P `60px 20px 0`.
- Container: column, gap 30. H3 "Related Case Studies" (Section H3 preset), **centered**.
- Grid: D 3 columns of 360×408.9, gap 20. **T shows only 2 cards** (315×372; the third is hidden). P shows all 3 stacked (350×393.3, gap 20).
- **Related card** (`<a href="./<slug>">` overlay; bg `#f4f2f0`; radius 0; `overflow: clip`), `padding: 20px`, column:
  - H5 title (24/28.8 D, 20/24 T/P), 320 wide, 2 lines.
  - P excerpt (Body S, opacity 0.8), 20 below the title.
  - Cover image `9ztf1Ox…`, 320×193.9 (T 275×166.7, P 310×187.9), `object-fit: cover`, radius 8, 20 below the excerpt.
  - "Read More →" underline link (14/18.2), 20 below the image.
- **Hover:** bg `#f4f2f0` → `#262521`; all text → `#fff` (see `hover-1440-related-case-card.png`).
- Which three: `related` in case-studies.json. The rule I observed, which holds for all 18: `items.filter(i => i.slug !== current).slice(2, 5)` in collection order.

### 8.5 CTA card
Component 1.5, "The only customer platform you will ever need". Section D `120px 160px 60px`.

---

## 9. /legals/terms-conditions and /legals/privacy-policy

Screenshots `recon/pages/legals__*.png`. Document height: terms 2485 / 2279 / 2450; privacy 11870 / 10046 / 13865. No CTA card; the footer follows the body.

### 9.1 Hero (dark)
- Section: D `padding 140px 160px 80px`, height 310.4. T `140px 80px 80px`, 297.6. P `120px 20px 40px`, 223.6. The `bg` is `#262521` from y=80 (P from 0), with Rive `Uq3YeQ…` (D, 1440×230) or `8ubTz5…` (T).
- Text wrapper: `max-width: 600px`, **left-aligned**, placed at D x=420 (the column is centered in the page), gap 20 (P 12). Appear delays 0 / 0.05.
  - P "Last updated: January 1, 2025" (Body L; T/P 14), white, left.
  - H1 "Terms & Conditions" or "Privacy Policy" (page-title preset), white.

### 9.2 Body
- Section: D `padding 40px 160px 80px`. T `40px 80px 80px`. P `40px 20px 80px`.
- Container: `max-width: 600px` (P 350), a single rich-text block, left-aligned, `#262521`. Appear delay 0.1 (`opacity .001, y 12`).
- Rich-text styles. Block spacing is `margin-top` = the element's paragraph-spacing (first block 0):

| Tag | Style (D / T / P) | Space above |
|---|---|---|
| h4 | Feature H4 32/35.2 / 28/30.8 / 26/28.6 | 40px |
| h5 | Enterprise H5 24/28.8 / 20/24 / 20/24 | 40px |
| h6 | Card H6 20/22 / 20/22 / 18/19.8 | 40px |
| p | Body L 16/22.4 / 14/19.6 / 14/19.6 | 0 |
| ul | same size as p; `li` indented 19.5px (D) / 17px (T/P); nested `ul` indents another 19.5 / 17 | 11px |
| strong | TWK Lausanne 700 | n/a |
| a | inherits colour `#262521`, underlined | n/a |

  Empty `<p>`s are used as extra line breaks in the privacy policy (keep them as one-line spacers).
- Structure (legal text is not copied; use placeholder copy):
  - **Terms & Conditions**: 36 top-level blocks, 9 h4, 22 p, 5 ul, 0 h5/h6, 1 link. Note the body actually contains privacy-policy wording ("Your privacy matters to us.") on the source. Sequence: `p, p | h4, p, ul[2 li, each with a nested ul (3 and 4 li)], p | h4, p, ul[4], p | h4, p, ul[3], p | h4, p, ul[3], p | h4, p, p, p | h4, p, ul[4], p | h4, p, p, p | h4, p, p | h4, p, p(link)`. The h4s are Information We Collect, How We Use Your Information, Cookies and Tracking, Sharing Your Information, Data Security, Your Rights, Third Party Links, Changes to This Policy, Contact Us.
  - **Privacy Policy**: 86 top-level blocks, 3 h4, 14 h5, 12 h6, 54 p (several empty spacers), 3 ul, 46 strong, 3 links. The h4s are "Your privacy matters to us." (the first block, so no space above), "Interpretation and Definitions" and "Collecting and Using Your Personal Data". The Definitions list is a single long `<p>` of "• **Term** means…" lines joined with `<br>`, each term in bold.

---

## 10. Motion inventory (subpages)

| Where | Trigger | From → To | Timing |
|---|---|---|---|
| All hero text blocks (1.4) | page load | opacity .001, y 12 → 1, 0 | spring 0.5s, bounce 0; delays 0 / .05 / .1 / .15 |
| About hero photos | load | L: rot 8°, scale .95, y 20, op .001 → rot -8°. R: rot -3° → 3° | tween 0.5s `[.22,.9,.32,1]`, delay .2 (L) / .4 (R) |
| About mission stickers | mission container 50% in view, once | rot -7°, scale .95 → rot 7°, scale 1 | tween 0.5s `[.22,.9,.32,1]`, delay 0 (TR) / .2 (BL) |
| About value cards | in view (threshold 0), once | opacity 0 → 1 | spring 0.5; delays .05 .1 .15 .2 .25 .3 (0.7s) .4 .45 |
| About team + role cards | in view, once | opacity 0 → 1 | spring 0.5; delay index × .05 |
| Integrations hero cluster | load | op .001, y 12 → 1, 0 | spring 0.5, delay .1 |
| Integrations hero icons | mount, infinite | x 0 ↔ +120 / -80 / +80 | tween 3s `[.5,0,.5,1]`, mirror |
| Integration cards | in view, once | op 0, y 12 → 1, 0 | spring 0.5, delay index × .05 |
| Blog index cards | in view, once | op 0 → 1 | spring 0.5, delay (i % 9) × .05 |
| CTA card text (1.5) | 50% in view, once | op 0, y 12 → 1, 0 | spring 0.5; delays 0 / .05 / .1 |
| CI CTA (1.6) | 50% in view, once | op 0, y 24 → 1, 0 | tween 0.4s `[.33,1,.68,1]`; delays 0 / .1 / .2 |
| TOC items (7.3) | section in view (not once) | pill #d9d9d9 → #262521, dot y 2 → 16 | tween 0.5s `[.33,1,.68,1]` |
| Card hovers (6.1, 6.2, 8.4, 5.2) | hover | bg + text colours | tween 0.3s `[.33,1,.68,1]` |
| Contact submit | hover / press / state | see 3.2 | tween 0.2s `[.44,0,.56,1]`; spinner 1s linear loop |
| Nav, buttons, links, FAQ, cookie banner | as on home | n/a | CLONE_SPEC 11 |
| All Rive canvases | autoplay "State Machine 1" | n/a | pointer events live, not scroll-linked |

There's no parallax, no scroll-linked transforms, no sticky elements other than the TOC (and the fixed banner and nav), and no videos on any subpage.

---

## 11. New assets (all downloaded)

Full list with sizes and uses is in `PAGES_ASSET_MANIFEST.json`. Summary:
- **Images** (35 files in `public/assets/images/`):
  - About: hero tracks, 2 photos, sticker, 6 team logos.
  - Blog image `AcwsZwnl…`; track strip `PhOrHs…`; case-study cover `9ztf1Ox…` and hero strip `g5yjnDc…`.
  - 21 integration icons (6 of them reused in the integrations hero).
- **SVG** (`public/assets/svg/`), extracted from inline data-URIs or the sprite:
  - `blog-hero-arrow.svg`, `integrations-hero-tracks.svg`, 8 `about-*.svg` value icons, `about-role-icon-{blue,pink}.svg`, `form-spinner-mask.svg`.
- **Rive** (12 new files in `public/assets/riv/`): HlJWhQ…, CUIzkb…, y3w7BY…, DCOySC…, 1asyi1…, Uq3YeQ…, 8ubTz5…, HSuPIw…, DnAJJn…, Aw54OY…, nhu0tR…, OInirL…. Artboard, fit and alignment for each are in the manifest.
- **Fonts:** none new. **Videos:** none.

---

## 12. Ambiguities and things I couldn't measure

1. **Rive canvas content** (dot patterns, tracks, CTA art) can't be read with computed styles. Embed the listed `.riv` files with the given artboard/fit/alignment; don't hand-draw them.
2. **Blog index filter:** only 1 of 21 posts is listed on `/blogs`. The CMS filter that hides the rest isn't in the page output. `listedOnIndex` in blogs.json reflects what's shown.
3. **Date mismatch:** the `/blogs` card shows "February 6, 2026"; every post page shows "February 6, 2025". Both are recorded. (The SSR HTML also contains "December 13, 2025", but only as a Framer layer name (`data-framer-name`), not as visible text. Ignore it.)
4. **Placeholder CMS content:** all 21 posts share one body and one image, and all 18 case studies share one body, one cover and an empty image slot. The source uses template copy. blogs.json and case-studies.json record the structure only.
5. **Contact submission** wasn't tested (as instructed). The Loading, Success and Error visuals come from the component code, not from a live run. The backend is Framer's form service; the clone needs its own handler.
6. **TOC double-active:** the source can show two active items at once (7.3). Decide whether to copy that or show only the topmost.
7. **Integration hover colours are random** per segment on each page load (5.2). You can't match a specific screenshot.
8. **Integrations search** matched the name for "sla". I didn't test whether descriptions are also searched; they may be.
9. **Copy typos on the source, kept as-is:** "San Francsisco" (about roles), "Assembly" in the contact intro, the privacy-policy wording under Terms & Conditions, and Linear's href `https://linear`.
10. **Phone nav menu on subpages** was not re-measured; it's assumed identical to home (CLONE_SPEC 1.2).
11. **Browser note:** the shared Playwright MCP browser was being driven by another agent during this run (it navigated and resized my tab), so all measurements were taken with a private headless Playwright instance instead. I removed the files I created in `/Users/riyaghosh/V2 cloned/datashake/.playwright-mcp` and the temporary `datashake/wl-recon/` folder.
