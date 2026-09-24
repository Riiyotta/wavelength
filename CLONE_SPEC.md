Source: original marketing site (reference omitted from this repo)

# Wavelength home page clone spec (route `/`)

Measured live on 2026-09-23 with Playwright (Chromium) at 1440, 1280, 810 and 390 px. Cross-checked against the saved copy `../Wavelength.html` and the site's Framer JS bundles.

Companion files (all under `wavelength-clone/`):
- `ASSET_MANIFEST.json`: every asset with its local path, natural size and where it is used.
- `recon/framer-reference.css`: the original page CSS (all `.framer-Jrb8h` page rules, component rules and type presets), reformatted, with breakpoint media queries. Use it when you need a value this spec doesn't list. Don't import it.
- `recon/full-1440.png`, `recon/full-810.png`, `recon/full-390.png`: full-page references.
- `recon/section-1440-01..10-*.png`: per-section crops at 1440.
- `recon/section-810-*.png`, `recon/section-390-*.png`: responsive crops.
- `recon/hover-1440-testimonial-card.png`: card hover state.
- `public/assets/svg/*.svg`: logo and icon SVGs, which I extracted from the Framer CSS mask data-URIs. They use `currentColor`.

Note: the full-page 1440 screenshot shows the cookie banner at the bottom-right of the first viewport. That banner is real site UI (see section 12).

---

## 0. Global

### 0.1 Breakpoints (confirmed from `__framer__breakpoints` and page CSS)
| Name | Media query | Framer class that hides it |
|---|---|---|
| Desktop | `(min-width: 1200px)` | `hidden-72rtr7` |
| Tablet | `(min-width: 810px) and (max-width: 1199.98px)` | `hidden-5tyifx` |
| Phone | `(max-width: 809.98px)` | `hidden-1d32g61` |

Tailwind: `screens: { tablet: '810px', desktop: '1200px' }`, mobile-first. Phone is the base style.

### 0.2 Page frame
- `html, body`: margin 0, background `#fff`. Framer sets `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`.
- Page root: flex column, `align-items: center`, `overflow: clip`, `min-height: 100vh`, background `#fff`.
- Content column: section inner containers are `width: 100%; max-width: 1200px`. Side padding comes from the section: desktop 160px, tablet 80px, phone 20px. At 1440 the inner width is 1120, at 1280 it is 960, at 810 it is 650 and at 390 it is 350. At 1440 nothing reaches the 1200 max except the nav container (see 1.2).
- Total document height: 7350px @1440, 7304px @1280 (main 7012 + footer 292), 8786px @810, 7757px @390.

### 0.3 Design tokens (from the page's `body { --token-* }` rules)
| Proposed token | Value | Framer token | Used for |
|---|---|---|---|
| `ink` | `#262521` (rgb 38,37,33) | 16055b28 | Dark text, dark section bg, Black button, cards |
| `white` | `#ffffff` | 77fda806 | Text on dark, page bg |
| `paper` | `#fdfcfb` (253,252,251) | 7c824656 | Nav bg, Light button bg |
| `paper-80` | `#fdfcfbcc` | eff0f485 | (defined, unused on home) |
| `mist` | `#f0f0ee` (240,240,238) | cbc0d7d7 | Logo strip, feature cards, FAQ items, metrics bg |
| `stone` | `#f4f2f0` | 8c01b9ba | (defined) |
| `ink-2` | `#34332e` (52,51,46) | 46e04288 | Enterprise inner panel |
| `violet` | `#a184fa` (161,132,250) | 050854ce | Feature 01 accent |
| `pink` | `#f677fd` (246,119,253) | a4592767 | Feature 02 / Single Pane accent |
| `yellow` | `#ffdd03` (255,221,3) | 764f5932 | Feature 03 / Inbox accent |
| `orange` | `#f9720d` (249,114,13) | bb86c9d2 | Account Insights accent |
| `mint` | `#63f6b5` (99,246,181) | 5ac4835f | No Touch Onboarding accent |
| `link-blue` | `#678efd` (103,142,253) | 5c0ba77d | Cookie policy link |
| `red` | `#ff2244` | 0a73a4f2 | (defined) |
| `hairline` | `#28262f1f` | 174e49d9 | (defined) |
| `line-5` | `rgba(38,37,33,0.05)` | n/a | Decorative vertical lines |
| `logo-border` | `#28262f0d` | n/a | Logo strip container side borders |

Radii: 8px (buttons, cards, sections), 5px (media inside overview cards), 12px (enterprise panel on tablet/phone), 14px (cookie banner), 20px (enterprise panel on desktop), 29.53px (number badges), 2px (avatars).
Shadows: only the cookie banner, `rgba(0,0,0,0.25) 0 2px 4px, inset 0 0 0 1px rgba(0,0,0,0.05)`.
Backdrop filters: none on the page.
Gradients: none as CSS. All the colorful "track" artwork is Rive canvas (see 0.6).

### 0.4 Fonts
Font-family mapping (the full `@font-face` list is in Appendix A):
| Framer family | File | Weight | Used by |
|---|---|---|---|
| `"TWK Lausanne 400"` | `/assets/fonts/YHHz0OzMuyHlfEcb0QAeqAKn5c.woff2` | 400 normal, no unicode-range | Almost all text |
| `"TWK Lausanne 700"` | `/assets/fonts/jX0B7oRRDDDH7XgLlaGQaM1v6U.woff2` | 700 normal | `<strong>` inside rich text ("purpose", "post sales") |
| `"Geist Mono"` | `/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2` (latin) + 5 subsets | 500 (same files serve 700) | Enterprise number badges "01/02/03" |
| `Inter` | latin 400 `GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2`, 700 `syRNPWzAMIrcJ3wIlPIP43KjQs.woff2` (+ subsets and italics) | 400/700 | Cookie banner only |

Fallback stacks: `"TWK Lausanne 400", "TWK Lausanne 400 Placeholder", sans-serif`; `"Geist Mono", monospace`; cookie banner `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
Bold inside a rich-text block switches family to `"TWK Lausanne 700"` at weight 700 (Framer `--framer-font-family-bold`).

### 0.5 Type scale (computed values; D = desktop >=1200, T = tablet, P = phone)
| Role / Framer preset | Tag | D size/line-height/letter-spacing | T | P | Notes |
|---|---|---|---|---|---|
| Hero H1 `1v6bq0y` | h1 | 64/64 (100%) / -1.28px (-0.02em) | 51/51 / -1.02px | 34/34 / -0.68px | weight 400, `text-wrap: balance`, centered, white |
| Section H3 `iut6v1` | h3 | 40/44 (110%) / -0.8px | 32/35.2 / -0.64px | 26/28.6 / -0.52px | |
| Feature H4 `tlwwbe` | h4 | 32/35.2 / -0.64px | 28/30.8 / -0.56px | 26/28.6 / -0.52px | also the phone menu links (26px) |
| Enterprise H5 `1ai0hxv` | h5 | 24/28.8 (120%) / -0.24px | 20/24 / -0.2px | 20/24 / -0.2px | |
| Card H6 `1t56geo` | h6 | 20/22 (110%) / -0.4px | 20/22 | 18/19.8 / -0.36px | |
| Body L `8nx0kk` | p | 16/22.4 (140%) / 0 | 14/19.6 | 14/19.6 | |
| Body S `1erya29` | p | 14/19.6 (140%) / 0 | same | same | |
| Link/nav `15owqn` | p | 14/18.2 (130%) / 0 | same | same | nav links, banner, text-link, copyright |
| Button `b9ec6q` | p | 16/20.8 (130%) / 0 | same | same | button labels, footer links |
| Caption `qjky40` | p | 12/16.2 (135%) / -0.12px (-0.01em) | same | same | default color `#fffc` (rgba 255,255,255,0.8) |
| Mono label `1v9k9nl` | p | Geist Mono 500, 14/16.8 (1.2em) / +0.28px (0.02em), uppercase | 12/14.4 / +0.24px | 12/14.4 | |
| FAQ question | span | 16/22.4 (1.4em) / -0.16px (-0.01em) | same | 14/19.6 / -0.14px | |
| FAQ answer | div | 14/19.6 / -0.14px, color `rgba(38,37,33,0.8)` | same | same | |

Default text color is `#262521` unless noted.

### 0.6 Rive canvases (critical)
All the colorful tube/track illustrations, the hero background and the dotted side patterns are Rive animations drawn on `<canvas>`. Playwright can't read what's drawn inside, so reproduce them by embedding the same `.riv` files:
- Use `@rive-app/react-canvas` (the site loads `@rive-app/canvas@2.27.5`). Every instance sets `stateMachines="State Machine 1"`, `autoplay`, `autoBind: true`, `handleEvents: true` (pointer listeners are live, so the Rive art can react to hover), `isTouchScrollEnabled: false`, and Rive's `Layout({ fit, alignment, layoutScaleFactor })`.
- The file, artboard, fit, alignment and per-breakpoint overrides for each instance are in `ASSET_MANIFEST.json` → `rive`, and they're repeated in each section below.
- Each canvas fills its container (`width: 100%; height: 100%`, canvas `vertical-align: top`).

### 0.7 Decorative vertical line columns (the "Line" component)
These appear in section 3 (Platform), section 4 (Product Overview) and section 7 (Metrics, inside its bg). Each is two absolutely positioned columns, `Left` and `Right`, `z-index: 1`, `overflow: clip`, full section height (section 4's go 20px past the bottom: `bottom: -20px`).
- Desktop: each column is 160px wide at `left: 0` and `right: 0` of the section (at 1280, x = 0 and 1120). Inside is a row with `padding: 0 20px; justify-content: space-between` holding **15** vertical bars, each `1px × 2073px`, bg `rgba(38,37,33,0.05)`. Bars sit 8.5px apart at 1440/1280: x = 20, 28.5 … 139.
- Tablet variant: column 60px wide, padding 0, **13** bars 4.9px apart.
- Phone variant: column 20px wide, padding 0, **8** bars 2.7px apart.
- They're static. There's no animation.

### 0.8 Links
`CALENDLY` below stands for:
`https://calendly.com/pranav-assembly/assembly-demo?_gl=1%2A1xop1un%2A_gcl_au%2ANDI3MDAxNTk0LjE3MzAxMDc5Mzc.%2A_ga%2ANDQxNTk2MzkyLjE3MTIxNDkxOTY.%2A_ga_D430Z6534X%2AMTczMzgyMzQ1Ny45NS4xLjE3MzM4MjQ4NDYuNjAuMC4w&month=2024-12` (target `_blank`)

### 0.9 Shared components

**Primary button** (Framer "Primary", `framer-EvxSW`)
- Height 36, `padding: 10px`, `gap: 8px`, `border-radius: 8px`, `overflow: hidden`, `display: flex; align-items: center; justify-content: flex-end`, width fits content. "Schedule Demo" with arrow is 157.4px; "Explore Integrations" 186.6; "Contact Us" 101.3.
- Label uses the Button preset (16/20.8). The arrow is a separate text node, `"→"` (14.1px wide), after the label with an 8px gap.
- 1px inset border via `::after` (`border-radius: inherit`).

| Variant | Bg | Border | Text | Hover bg | Hover text |
|---|---|---|---|---|---|
| Light (+ Light Mobile, same look) | `#fdfcfb` | 1px `#fff` | `#262521` | `#262521` | `#fff` |
| Black (+ Black Mobile) | `#262521` | 1px `#262521` | `#fff` | `#fdfcfb` | `#262521` |
| No Icon (+ Mobile), no arrow | `rgba(255,255,255,0.1)` | 1px transparent | `#fff` | `rgba(255,255,255,0.22)` | `#fff` |

Transition on all hover changes: `0.3s cubic-bezier(0.33, 1, 0.68, 1)` (Framer tween `{duration: .3, ease: [.33,1,.68,1]}`). No scale or translate.

**Text link "Schedule Demo →"** (`framer-Ouudo`): flex row, gap 8px, 14/18.2 `#262521`; label 100.9px + arrow 12.4px = 121.3px wide. Hover: label and arrow go to opacity 0.6, same 0.3s easing.

**Nav link** (`framer-LC95R`): 14/18.2 `#262521`. Hover: opacity 1 → 0.6, same 0.3s easing.

**Banner / footer small link** (`framer-ywJ6n`): 14/18.2 white at opacity 0.6. Hover: opacity 1.

**Footer column link** (`framer-lP74D`): 16/20.8 white at opacity 0.6. Hover: opacity 1.

**Label icon tile** (`framer-z65He`): 32×32 (28×28 on phone), `border-radius: 8px`, bg = the accent color, centered 18×18 icon. The icon is the SVG used as a CSS mask on bg `#262521` (or inline SVG with `color: #262521`).

**Number badge** (`framer-6HQhX`): 40×40 (phone 42.9×42.4 as measured; the Framer mobile variant is nominally 28px but renders about 43 because of padding), `padding: 14px`, `border-radius: 29.53px`, bg `rgba(246,246,246,0.12)`. Text is the Mono label, white, opacity 0.8.

---

## 1. Top announcement banner + Nav (both `position: fixed`)

### 1.1 Announcement banner
- `position: fixed; top: 0; left: 0; right: 0; z-index: 10`. Height 35.6px, `padding: 8px`, bg `#262521`, flex row centered, gap 10px.
- Text: "Assembly is now Wavelength!" (Body S, white, `white-space: pre`, 186.9px wide), then link "Read More" → `./blogs/assembly-is-now-wavelength` (Link preset, white, opacity 0.6, hover 1).
- Identical at all breakpoints. At 1440 the text is at x=586.9 and "Read More" at x=783.9.

### 1.2 Nav bar
- `position: fixed; top: 35px; left: 0; right: 0; z-index: 10`. Bg `#fdfcfb`, no shadow, no border.
- It doesn't change on scroll. I checked at scrollY 0/300/800/1500: same position, bg and shadow every time. No hide/reveal.
- **Desktop/Tablet** (variants "Desktop" and "Tablet" are visually identical): height 52, `padding: 8px 20px`. Inner container `max-width: 1200px; width: 100%`, flex row, gap 16, items centered. At 1440 it is x=120 w=1200; at 1280 x=40; at 810 x=20 w=770. Three equal flex:1 children (389.3px each at 1440):
  1. Logo_Menu (left): `<a href="./">` holding the wordmark, 144×24 (aspect 6.00568), color `#262521`. Use `/assets/svg/wavelength-logo.svg` as a mask or inline SVG.
  2. Link group (center, justify-center, gap 16): "Integrations" → `./integrations`, "Blogs" → `./blogs`, "About us" → `./about`. Widths 75.1 / 35.5 / 56.7.
  3. Button wrapper (right, justify-end): Black primary button "Schedule Demo →" → CALENDLY, 157.4×36.
- **Phone** (390): the bar is 48px tall (Logo_Menu `padding: 12px 20px`). Logo 144×24 at x=20 and a 24×24 hamburger at x=346.
  - Hamburger: two bars, each 24×1, fill `rgba(0,0,0,0.8)`, at y=9 ("top") and y=14 ("bottom") inside the 24px box.
  - Opening it (variant "Phone"): the bars move to the center and rotate. Top goes to -45deg, bottom to +45deg, giving an X. The bar grows to 321.8px tall with the same bg `#fdfcfb`.
  - Open content: container gap 40. Link list (`padding: 0 20px`, gap 16) with "Integrations", "Blogs", "About us" at 26/28.6, -0.52px (h4 preset), `#262521`, at y=123/167.6/212.2. Then Button wrapper (`padding: 0 20px 40px`) with the Black button "Schedule Demo →" at x=20.
  - Transition: tween 0.3s `[.33,1,.68,1]`.

---

## 2. Hero (`framer-1hukrmr`)
- Section: bg `#262521`, `overflow: clip`, flex row, `justify-content: center; align-items: flex-start`. Padding D `160px 160px 0`, T `160px 80px 0`, P `140px 20px 0`. Height: D 988.8, T 797.2, P 616.8. The section starts at y=0 (under the fixed banner and nav).
- **Background Rive**: absolute wrapper (`framer-1avi2cx`) at `top: 88px` (P: 80px), `left: 0`, width 100%, height 923px, `pointer-events: none`. Inside it an element with `max-width: 1500px`, width 100%, height 100%, bg `#262521`, `overflow: clip`, which holds the Rive canvas (inset 0).
  - File `/assets/riv/iMN1EoReEqPtnF1pvfm2DCDbAto.riv`, artboard "Cover", fit `layout`, alignment `center`, layoutScaleFactor 1 on desktop and 0.75 on tablet/phone.
  - This draws the colored tubes at the left and right edges (see `recon/section-1440-02-hero.png`).
- **Edge hairlines**: inside the container, two 1px lines (`Line_L` at `left: 0`, `Line_R` at `right: 0`), `position: absolute; bottom: 0; height: 150%`, bg `#f0f0ee`, opacity 0.1, z-index 1. They show at x=160 and x=1279 at 1440.
- **Container** (`framer-7auyrq`): flex column centered, flex:1, `max-width: 1200px`. Gap D 80, T 60, P 40.
  - Text wrapper: column, `align-items: center`, gap 20, `max-width: 780px` (P: `padding: 0 20px`).
    - H1 "Welcome to Customer SuperIntelligence": white, centered, width 780 → 2 lines at 1440 (128px tall). T 650w, 102 tall. P 310w, 3 lines, 102 tall.
    - P (Body L; T/P 14px) "Finally, an AI-native platform where modern GTM teams can access, analyze, and act on revenue data in a single platform": white, centered, `max-width: 440px`. 2 lines at D (44.8px), 2 lines at T (39.2), 3 lines at P (58.8).
    - Button: Light "Schedule Demo →" → CALENDLY (P uses Light Mobile, same look). 157.4×36, centered. At 1440 y=372.8.
  - Mockup clip (`framer-1l0cc0p`): width 100%, `overflow: clip`. Height D 500, T 360, P 200 (on P, `overflow: visible`).
    - Inside it the image `/assets/images/8YfN5DvRoONMgkbgb2Y8Y5iOw.png` (4636×2854) fills a box with `aspect-ratio: 1.624387; width: 100%`, `object-fit: cover`, no radius. At 1440 it renders 1120×689.5 clipped to 500; at 1280 960×591; at 810 650×400.1; at 390 350×215.5.
- **Appear animation (on page load)**: see section 11.1.

---

## 3. Logo strip "Trusted by" (`framer-1jy5af3`)
- Section: bg `#f0f0ee`, `overflow: clip`, column centered, gap 16. Padding `0 160px` (T `0 79px`, P `0 20px`). Height D/1280 143.6, T 139.6, P 159.2.
- **Background Rive, desktop only** (hidden on T/P): absolute, `left: 10px; right: 10px; bottom: -1px; height: 101%`, z-index 0.
  - `/assets/riv/NyWiQDmsS9ebggZxNFRg5HfL4.riv`, artboard "Trusted By", fit `layout`, alignment `center`.
  - Draws the dotted circle patterns at both ends.
- Container: `max-width: 1200px`, width 100%, `padding: 40px 0` (P `40px 12px`), column centered, gap 20. It has 1px left/right borders `#28262f0d` (via `::after`). At 1440 those borders sit at x=160/1280.
  - Label "Trusted by Hundreds of Customer Obsessed Companies:" (Body S, `#262521`, opacity 0.6, `white-space: pre`, 359.9px). Centered on D/T. On P it is left-aligned, wraps, 326px wide and 2 lines.
  - **Logo rotator** (custom Framer "Logo" component, full width, auto height). Logos in order: CI07Vk…, cCVpgY…, p2a7xf…, gk8YtN…, F0FLW1…, Q3mf5w…, 9ijWiH…, lXx0Fq…, wN2i3Y… (paths in manifest). All have `filter: brightness(0)` (renders them black) and `object-fit: contain`.
    - **Desktop and Tablet, grid mode**: 4 columns × 1 row (`grid-template-columns: repeat(4, 1fr)`, gap 0, padding 0), `justify-items: center; align-items: center`. Logo height is fixed: D 24px, T 20px, width auto. At 1440 the cells are 280×24. See 11.3 for the cycling animation.
    - **Phone, ticker mode**: horizontal marquee, logos 20px tall, gap 40px, `overflow: hidden`. The track loops `translateX(0 → -groupWidth)` linearly over 20s, infinite, and runs only while the strip is in view (IntersectionObserver amount 0.1). The group repeats enough to cover 2× the viewport. Measured at 390: first logos at x=32, 143.8, 274.7.

---

## 4. Platform features (`framer-4bpt3e`)
- Section: bg `#fff`, `overflow: clip`. Padding D `120px 160px 0`, T `120px 80px 0`, P `60px 20px 0`. Height D 1886.8, T 2530.2, P 1874.6.
- Line columns: see 0.7.
- Container: column, gap 50, `max-width: 1200px`, `overflow: clip`.
  - Text wrapper: column, `align-items: flex-start`, gap 20.
    - H3: "The AI-native Customer Intelligence Platform **purpose** built for **post sales** teams". The two bold words use TWK Lausanne 700. 2 lines at 1440 (88px), full width.
    - P (Body L): "Wavelength brings your entire customer data stack into one place - with powerful AI agents that uncover important signals and act instantly". `max-width: 600px`, 2 lines.
  - Wrapper: column, gap 20, holding 3 feature cards.
- **Feature card** (desktop): width 100%, height 508, `padding: 14px`, bg `#f0f0ee`, radius 8, flex row, `align-items: center`, gap 20.
  - **Mockup**: `width: 65%; max-width: 640px; height: 100%` (640×480 at 1440, 605.8×480 at 1280), radius 8, `overflow: hidden`, bg = accent. The video covers it: absolute inset 0, `object-fit: cover`, `z-index: 1`, `autoplay loop muted playsInline preload="auto"`, no poster, no controls.
  - **Right column**: flex:1 (432 at 1440, 306.2 at 1280), height 100%, `padding: 40px 20px`, column `justify-content: space-between`. Inner wrapper: column, `justify-content: center`, gap 20, containing:
    - Label row (gap 8): icon tile 32 + label text (Body S). Card 2 and 3 also have an empty 20×20 spacer `div` after the label text (reproduce it as a spacer).
    - H4 (Feature preset), `white-space: pre-wrap`.
    - P (Body S), opacity 0.6.
    - Text link "Schedule Demo →" → CALENDLY.
  - Card 1: mockup left, text right. Card 2: text left, mockup right; its mockup also has `padding: 60px 52px 0`, which doesn't matter because the video is absolute. Card 3: mockup left.

| Card | Accent (mockup bg + icon tile) | Icon | Label | H4 | Body | Video |
|---|---|---|---|---|---|---|
| Feature 01 | `#a184fa` | icon-ask-ai.svg | Ask AI | Fields and Tables are Dead | Modern GTM teams can't spend hours looking through CRM tables for one field to act. They use our AI to speak directly with their revenue data. | /assets/videos/Feature_A.mp4 |
| Feature 02 | `#f677fd` | icon-account-prioritization-agent-builder.svg | Account Prioritzation (sic, keep the typo) | Customer needs - your priorities: on the same wave | Wavelength’s powerful revenue AI agents automagically prioritize your accounts based on customer signals from across your data stack. | Feature_B.mp4 |
| Feature 03 | `#ffdd03` | icon-account-prioritization-agent-builder.svg | Agent Builder | Revenue Signals meet instant scalable action | Gone are the days of pasting the same message 100 times in Gmail. Welcome to instantly scalable personalized outreach based on customer signals, with a single click. | Feature_C.mp4 |

Positions at 1440: cards at y = 1455.2, 1983.2, 2511.2 (x=160, w=1120). The text wrapper is vertically centered in the right column, with the label at card-top+162 and the link at card-top+436.
- **Tablet**: card becomes a column, `height: auto`, gap 0 (card height 730.2).
  - Mockup: `width: 100%; aspect-ratio: 1.41364; padding: 30px` → 622×440. On card 2 the mockup comes first too (`order: 0`), so all cards are mockup on top.
  - Right column: `padding: 40px 20px 20px`, gap 32, `height: min-content`.
- **Phone**: column, gap 20.
  - Mockup: `width: 100%`, `padding: 20px`, aspect 1.25833 (cards 1 and 3, 322×255.9) or 1.37273 (card 2, 322×234.6).
  - Right column: padding 0, gap 24. Label tile 28px.
  - Card heights 501.5 / 508.8 / 549.7.

---

## 5. Product Overview (`framer-2ueerk`)
- Section: bg `#fff`. Padding D `120px 160px`, T `120px 80px`, P `60px 20px`. Height D 1183.6, T 2083.6, P 1629.
- Line columns: see 0.7 (they extend 20px below the section).
- Container: column, gap 50 (P 30).
  - Text wrapper: column centered, gap 20 (P 12).
    - H3 "Product Overview" (centered block, 312.7px wide at D).
    - P (Body L), centered, `max-width: 240px`: "All your revenue data. One intelligent system. Instant action." followed by `<br><strong><br></strong><br>`, which adds two blank lines. Total height at D is 89.6 (4 lines × 22.4). Keep the trailing breaks so the spacing below matches.
  - **Grid** (`framer-1atw8r`): D `grid-template-columns: repeat(5, minmax(50px, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 20px`. Columns are 208px at 1440 and 176px at 1280. Row height 360.
    - Card A spans 3 columns, Card B 2, Card C 2, Card D 3.
    - All cards: `height: 360px; border-radius: 8px; overflow: clip`, flex column, gap 30, `align-items: flex-start`.
    - Card A has `padding: 20px` and **no CSS background** (its grey comes from its Rive art). Cards B/C/D have `padding: 14px` and bg `#f0f0ee`. Suggest a `#f0f0ee` fallback bg on A as well.
    - Each card has: a text wrapper (column, gap 12, `max-width: 280px`, z-index 1 or 2) with icon tile 32 + H6 + P (Body S, opacity 0.6); a media block; and a Rive canvas absolutely filling the card at z-index 0 (card D: z-index 1).
    - T/P: the grid becomes a flex column (gap 20), cards width 100%. Card height T 400, P 325. On P the card gap is 20.

| Card | Accent | Icon | H6 | P | Video (poster) | Rive (file / artboard / fit / align) |
|---|---|---|---|---|---|---|
| A (span 3) | `#f677fd` | icon-single-pane.svg | Single Pane of Glass | Unify all of your conversational, usage, and CRM data under one roof | 1.mp4 (P1Lgom5PNWwYYoJOBmgCCrVBSWs.png) | 9IL1aPqz438g9ksxNz6HohQnUCI / "Product Overview #A 2" / cover / centerRight. P: container 118% wide |
| B (span 2) | `#f9720d` | icon-account-insights.svg | Account Insights | Get instant highlights on every account in your book of business | 2.mp4 (3v3uUZgCC5luUh6PZJK9tASrU.png) | wsNvE8lyfM4sOjrtMza0ZB4iyXo / "Feature D" / cover / topRight |
| C (span 2) | `#ffdd03` | icon-inbox-manager.svg | Customer Inbox Manager | Never miss a beat on your customer interactions | 3.mp4 (R7MDWJvw5MMwZeG5xRiBRswIes.png) | eHE1DQsgIElPCsQD72t5L5k3R5Q / "Product Overview #B 5" / cover / topRight |
| D (span 3) | `#63f6b5` | icon-no-touch-onboarding.svg | No Touch Onboarding | Track your customer’s journey in one integrated system | 4.mp4 (oTLxEBPu4QQC7JSF8hmJhxTPok.png) | ixPC1d8kmFhN7mgZJzS21DVjs / "Porduct Overview #C" / cover / center. T: fill / topRight, container `width: 117%; top: -20px; bottom: -57px; left: -8.69231%` |

Media blocks (all videos `autoplay loop muted playsInline preload=auto`, `object-fit: cover`, with the poster set):
- **A**: flex column, `align-items: flex-end`, width 100%, z-index 1. Inner box `width: 80%; aspect-ratio: 2.00384; border-radius: 5px; overflow: clip` holds the video (inset 0). 499.2×249.1 at 1440, at x=304.8 y=3510, which is 167px below the card top. P: width 100%.
- **B**: centered column. Inner box `width: 90%; max-width: 100%; aspect-ratio: 1.17573; border-radius: 5px; overflow: clip` (367.2×312.3). Video container `position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 100%; height: auto`, so the video renders 367.2×389.7 and the bottom is cropped.
  - T: the media block is 338 tall with `padding: 5px; align-items: flex-end`. The inner box becomes `position: absolute; top: 0; right: 0; width: 80%; min-height: 423px`.
- **C**: centered column, z-index 2. Inner box `width: 100%; aspect-ratio: 1.25413; overflow: clip` (408×325.3, **no radius**). Video `position: absolute; top: 0; right: 0; width: 100%`.
  - T: inner box height 496, radius 5; video width 80%, right-aligned. P: video `width: 90%; left: 50%; transform: translateX(-50%)`.
- **D**: column, `align-items: flex-end`, z-index 2. Inner box `width: 80%; aspect-ratio: 1.4333; border-radius: 5px; overflow: clip` (508.8×355). The video also has radius 5. P: width 100%.

---

## 6. Enterprise (`framer-1xkulix`)
- Section: bg `#fff`, `overflow: clip`. Padding D `80px 160px`, T `80px`, P `60px 20px`. Height D 706, T 745.6, P 943.4.
- **Dark bg panel** (`framer-ut9yie`): absolute, `top: 0; left: 20px; right: 20px; bottom: 20px`, bg `#262521`, radius 8, `overflow: clip`, `pointer-events: none`, z-index 0. At 1440: x=20, w=1400, h=686. On P it is `inset: 0` with **no radius**.
  - Rive 1, desktop only: `/assets/riv/RTuHhUc6vCjz6u1I1ErEuoSwL7U.riv`, "Enterprise Scale_Part 1", fit `layout`, center, inset 0. Draws the dot grid.
  - Rive 2, all breakpoints: `/assets/riv/0dp7iGHbAf4prIHv9XhuKEgZs.riv`, "Enterprise Scale_Part 2", fit `fill` (T/P `cover`), center. Positioned `top: 1.5px; bottom: 0.5px; left/right 0`. At P it is 390×684 at y=4410. Draws the colored tracks entering from both sides.
- Container: z-index 1, column centered, gap 50 (P 30).
  - Text wrapper: column centered, gap 24 (P 12).
    - H3 "Built for Enterprise Scale", white.
    - P (Body L) white, centered, `max-width: 440px`: "The first Customer Happiness Platform purpose built for post-sales teams to track your customers’ journey from the moment they onboard till the day they expand." 3 lines at D.
    - Light button "Schedule Demo →" → CALENDLY.
  - **Panel** (`framer-axf5ma`): bg `#34332e`, radius D 20 / T 12 / P 12, padding D/T `28px 38px`, P `20px`. At 1440 it's 1120×300.8.
    - Row: flex, gap 40, `align-items: center`. Three columns (flex:1, 294 wide at 1440), each a column with gap 80 (P 24), separated by `line` elements. The lines are 1px wide, `align-self: stretch`, 1px **dashed** white border, opacity 0.1. On P they become 100% wide × 1px horizontal and the row becomes a column with gap 32.
    - Each column: number badge (0.9) with "01", "02", "03", then a text frame (column, gap 16) with H5 + P (Body S, white, opacity 0.6, `min-height: 80px` on D; T `min-height: 180px` on the frame; P `min-height: unset`).

| # | H5 | P |
|---|---|---|
| 01 | Enterprise-Ready | Built to handle high-volume teams with reliable performance, robust security, and seamless scaling. |
| 02 | Aligned Teams | All customer data flows into one system, reducing noise and improving decision-making. |
| 03 | Secure by Design | Data controls, privacy standards, and protected workflows ensure enterprise-grade safety end-to-end. |

---

## 7. Metrics / Testimonials (`framer-tyimk7`)
- Section: bg `#fff`. Padding D `80px 160px`, T `80px`, P `60px 20px 80px`. Height D 796.4, T 854.8, P 828.8.
- Bg panel: absolute `inset: 20px`, bg `#f0f0ee`, radius 8, `overflow: clip`, z-index 0. It contains the Line columns (0.7) at `top/bottom: -20px; left: -20px` and `right: -20px`. On P it is `inset: 0` with no radius.
- Container: z-index 3, column, gap 50 (P 30).
  - Text wrapper: left-aligned, gap 20 (P 12).
    - H3 "Customer success metrics on track."
    - P (Body L) opacity 0.6, `max-width: 600px`: "Your revenue, your customers, finally speaking clearly."
  - **Desktop**: 3-column grid, `repeat(3, minmax(50px, 1fr))`, gap 20. Cards are 360×500 at 1440 and 306.7×500 at 1280.
  - **Tablet and Phone**: the grid is replaced by a slideshow (see 11.6), inside a row container with `padding-bottom: 60px`. The slideshow is 510px tall.
- **Testimonial card** (an `<a>`): bg `#262521`, radius 8, `padding: 16px`, `overflow: hidden`, flex column, gap 70, full height 500. Inner wrapper: column, gap 60.
  1. Company logo image (white PNG), fixed height: Latchel 114×36.8 (aspect 3.1), Lexamica 138×24, Rho 51.8×24.
  2. A 100px-tall row that holds the Rive track art. The art is absolutely positioned, overflows the row and sits at z-index 1: Latchel/Lexamica `top: -121px; left: -65px; right: -113px; bottom: -269.18px` (506×490 at a 360 card); Rho `top: -82px; left: -60px; right: -121px; bottom: -311.086px` (509×493). `pointer-events` live (handleEvents).
  3. Text_wrapper (z-index 3, flex:1, column `justify-content: space-between`): quote (Body S, white, pre-wrap), then an author row (gap 8) with a 40×40 avatar (radius 2, cover) and a column of name and role (Caption preset 12/16.2, white).

| Card | href | Logo | Rive | Quote | Name | Role | Avatar |
|---|---|---|---|---|---|---|---|
| Yellow | https://latchel.com | 52gP4Zu0Cx4jDCo8NOg5RMqHZQ4.png | nuwOJr5hOc5jfJafpbaZpJW64 "Mini-Card" fill | “Service at scale only works when insight guides action. Wavelength supports a more deliberate approach—one that strengthens trust and sustains long-term relationships.” | Jennifer Lye | VP Service Operations @ Latchel | 6HfsizF7I1oslgzRCogDe86z9c.jpeg |
| Green | https://lexamica.com/refer | LH4TFynfdvmGBntyW6FWjA2qc.png | yRKeZFzUisz2JKMHQAOxfJpjg "Mini-Card" fill | "Wavelength reflects how we believe client relationships should be managed: with context, continuity, and care. It gives our team the clarity to serve clients thoughtfully as we scale." | Kate Anand | VP of Customer Success @ Lexamica | NmYHButanta1IQNIWCsoUxoSwnQ.jpeg |
| Orange | https://www.rho.co | z0kB33hEOl5n5YkLPjkR24t40.png | wyklSoGLZqeRFqZhABgohz2Cvw "Mini-Card 2" fitWidth | “In business banking, post-sales is about trust and timing. Wavelength surfaces the right customer signals at the right moment, allowing our team to engage proactively, strengthen relationships, and grow accounts in a thoughtful, compliant way." | JD Reichenbach | Head of Growth Accounts @ Rho | 32tIMnJWk18CHrA4KATxa0Ei0.jpeg |

The quote marks are mixed curly and straight in the source. Copy them exactly as shown.
- **Card hover** (verified live, see `recon/hover-1440-testimonial-card.png`):
  - Card bg `#262521` → `#ffffff`.
  - Quote, name and role → `#262521`.
  - The logo wrapper gets `mix-blend-mode: exclusion`, so the white logo turns black on white.
  - Transition 0.3s `[.33,1,.68,1]`.
  - The Rive art stays as it is (it may react through its own listeners).

---

## 8. Integrations + FAQ (`framer-1tnn2de`)
- Section: bg `#fff`, column, gap 80 (P 60). Padding D `80px 160px`, T `80px`, P `60px 20px 80px`. Height D 1005.6, 1280 958.9, T 1077, P 986.

### 8.1 Integrations banner
- Container: bg `#262521`, radius 8, `overflow: clip`, z-index 3, `max-width: 1200px`.
- Inside is a row (`pointer-events: none`) holding the Rive container:
  - Sizing: `flex: 1; aspect-ratio: 2.31579` → 1120×483.6 at 1440 and 960×414.5 at 1280. T aspect 1.625 (650×400). P `width: 130%; height: 320px; flex: none` (455×320, overflowing right; the container clips it).
  - Rive: `/assets/riv/5yxLzQ8vf9c0NeoyQOZgJlGUv0.riv`, "Explore our integrations 2". D: cover / topLeft. T: fitHeight / bottomLeft. P: scaleDown / bottomLeft.
- Text overlay: `position: absolute; top: 20px; left: 20px; right: 20px`, row. Text wrapper z-index 1, `max-width: 340px` (T 300), column, gap 24 (P 12).
  - H3 "Explore our Integrations", white, 2 lines at D/T.
  - P (Body L) white, `max-width: 440px`: "With over 40+ integrations to streamline your workflow, from Slack to Zendesk, supercharge your team in just a few clicks!"
  - Light button "Explore Integrations →" → `./integrations` (186.6×36).

### 8.2 FAQ
- Container: row (`framer-b4f8w7`), gap 0. T becomes a column with gap 40, P a column with gap 30.
  - Left (flex:1, 560 at 1440): column, gap 21.
    - H3 "Frequently Asked", `max-width: 320px`.
    - P (Body S), opacity 0.6, `max-width: 320px`: "The First AI-Native CRM purpose built for post-sales teams to track your customers’ journey from the moment they onboard till the day they expand."
  - Right "Faqs" (flex:1, 560): column, gap 10. It holds 5 accordion items; each item is 560×48.4 closed at D, 350×46–65.2 at P because questions wrap.
- **Accordion item**:
  - Wrapper: bg `#f0f0ee`, `border: 1px solid rgba(230,230,230,0)`, radius 8, `overflow: hidden`, `cursor: pointer`, `user-select: none`, `transition: border-color 300ms ease-in-out`.
  - Header: `padding: 12px`, flex, `justify-content: space-between; align-items: center`, gap 16, `transition: background-color 300ms ease-in-out`.
    - Question span flex:1, FAQ question style (P 14px).
    - Right-side plus icon, 20×20: SVG `viewBox 0 0 24 24`, stroke `#262521`, `stroke-width: 1.5`, round caps and joins, lines (12,5)-(12,19) and (5,12)-(19,12).
  - Answer: region `height: 0 → scrollHeight`, `overflow: hidden`, `transition: height 300ms ease-in-out`. Inner `padding: 0 12px 12px`, FAQ answer style.
  - Open: the plus rotates `0deg → 45deg` (so it reads as ×), `transition: transform 300ms ease-in-out`. Each item toggles on its own, so several can be open at once. Keyboard: Enter/Space toggles, `role="button"`, `aria-expanded`.
  - Hover: border goes to `rgba(204,204,204,0)` and bg to transparent, so there is **no visible hover change**.

| Q | A |
|---|---|
| How does Wavelength integrate with our existing tools? | Wavelength connects with Salesforce, Email, and your internal systems (support, calls, usage) so all customer conversations and data flow into one place without changing your workflows. |
| Is Wavelength secure for enterprise use? | Wavelength has worked with some of the largest enterprises in the most regulated industries in the world. It's been designed with the highest grade security standards. It is also compliant with SOC II and GDPR. |
| Can we customize workflows for our team? | Wavelength's dynamic workflow system is completly customizable for individual organzations, teams and even contributors. Simply specify the workspace the workflow will live in! |
| How does Wavelength help Account Management teams? | Wavelength allows modern AM teams to automatically prioritize their accounts, get insights instantly, and act within a single system, without the hassle of table lookups and constant context switching. |
| Does Wavelength support large-scale customer operations? | Some of Wavelength's customers support 10s of thousands of customers across the globe. They use our system to scale customer experiences without a hitch. |

(Keep the source typos: "completly", "organzations".)

---

## 9. CTA (`framer-4gub7k` > `framer-b4jw1k`)
- Outer: bg `#262521`, `overflow: clip`. Inner section: column, gap 80, bg `#262521`. Padding D `40px 160px 120px`, T `40px 80px 80px`, P `40px 20px 100px`. Height D 348, T 290.4, P 245.2.
- Container: z-index 3, radius 8, `overflow: clip`, gap 50, `padding-bottom: 40px` (P: gap 30, padding 0).
  - Text wrapper: **bg `#262521`**, which masks the Rive art behind the text. `max-width: 480px`, column, gap 24 (P 12).
    - H3 "The only customer platform you will ever need", white, 2 lines.
    - Button row (gap 12): Light "Schedule Demo →" → CALENDLY, then No Icon "Contact Us" → `./contact`.
- Rive layer: absolute inset 0, `overflow: clip`, behind the container.
  - D and P: `/assets/riv/M560tT3PFFd0T3ciANv2oN0uU.riv` ("111.riv"), artboard "Landing Foot", cover / topRight.
    - D: container `position: absolute; top: 50%; left: 0; right: 0; aspect-ratio: 3.44828; transform: translateY(-50%)` → 1440×417.6 (static; it is not a scroll effect).
    - P: `height: 145px; bottom: 0; right: -85px; left: 0; top: auto; transform: none`.
  - T only: `/assets/riv/gEUIM1UnyqYvqol29hVZR6OA50Q.riv` ("Landing Footer.riv"), artboard "Landing Foot", cover / topLeft, `inset: 0 0 -289px`.

---

## 10. Footer (`framer-4WCCA`)
- Bg `#262521`, column centered, gap 16. Padding D `54px 160px`, T `54px 80px 30px`, P `32px 20px`. Height D 291.6, T 267.6, P 473.8.
- Container: `max-width: 1200px`, column, gap 16 (P 64).
  - **Top row**: `justify-content: space-between; align-items: flex-start` (P: column, gap 64).
    - Logo_wrapper: column, gap 18.
      - Wordmark 168×28, white.
      - "Backed by" row (flex, gap 6.4, `align-items: center`): "Backed by" (Caption, `rgba(255,255,255,0.8)`), Y Combinator mark `/assets/images/whqflScpEWGapBxaNgrWqIymKmU.png` at 22×22, then "Combinator" (Caption).
    - Links: row, gap 40.
      - Column 1 (column, gap 16; 204 wide at D, 142.5 at T, 155 at P): "Case Studies" → `./`, "Integrations" → `./integrations`, "About us" → `./about`, "Blogs" → `./blogs`.
      - Column 2: "Privacy Policy" → `./legals/privacy-policy`, "Terms & Conditions" → `./legals/terms-conditions`.
      - All are footer column links (16/20.8, white, opacity 0.6 → 1 on hover) with `target="_blank"`, as on the source.
  - **Bottom row**: `justify-content: space-between; align-items: flex-end` (P: column, gap 32, with the Links row **first**, above the copyright).
    - Copyright (Link preset 14/18.2, white, opacity 0.6), two paragraphs: "Copyright Assembly Works Inc. " and "2024 Built in San Francisco, CA".
    - Links: row, gap 26 (P 20). "Linkedin" → `https://www.linkedin.com/company/askassemblyapp/?viewAsMember=true`, and "Email" (an `<a>` with **no href** on the source). Both 14/18.2, white, opacity 0.6 → hover 1.

---

## 11. Motion inventory

### 11.1 Load/appear animations (hero only)
Framer `data-framer-appear-id`; values from `__framer__appearAnimationsContent`.

| Element | Initial | Animate | Transition |
|---|---|---|---|
| H1 wrapper (`swz52t`) | `opacity: 0.001; translateY(12px)` | `opacity: 1; translateY(0)` | spring, `duration: 0.5, bounce: 0, delay: 0` |
| Hero paragraph (`16odfg7`) | same | same | spring 0.5 / bounce 0 / **delay 0.05** |
| Hero button (`pt3kux`) | same | same | spring 0.5 / bounce 0 / **delay 0.1**, at all breakpoints |

- Implementation with framer-motion: `initial={{opacity:0.001, y:12}} animate={{opacity:1, y:0}} transition={{type:'spring', duration:0.5, bounce:0, delay}}`.
- CSS alternative: 500ms, `cubic-bezier(0.25, 0.1, 0.25, 1)` or similar critically damped curve. The measured WAAPI keyframes were translateY 12 → 11.8189 at 2% → 11.3577 … over 500ms, a critically damped spring.
- They run once on mount, not on scroll.

### 11.2 Scroll-triggered reveals and scroll-linked effects
- **None on the home page.** The home bundle has zero `__framer__animate`, `__framer__enter` or `useScroll` references. The `__framer__threshold` reveal configs in other bundles belong to other routes.
- I sampled every element's transform and opacity at scrollY 0, 1000, 2000, 3000, 4000, 5000, 5800, 6300 and 6450 (max). The only transforms are static centering: the CTA Rive `translateY(-50%)` and the card-B video `translateX(-50%)`.
- No parallax, no sticky elements (except the fixed banner and nav), no smooth-scroll library.

### 11.3 Logo rotator (desktop/tablet grid mode)
Framer "Logo" code component props: `mode: grid, columns: 4, rows: 1`, `animation: {enabled: true, animationDuration: 0.5, displayDuration: 1.5, staggerDelay: 0.2, easing: 'easeOut', loop: true, randomizeOrder: false, clipHidden: true}`.
- 9 logos are shown 4 at a time. Batch index `F` starts at 0. The visible set is `logos[(F*4 + n) % 9]` for n = 0..3.
- Number of batches is `9 / gcd(9,4) = 9`. After the last batch it loops back to 0.
- Each cell is wrapped in AnimatePresence (`mode="wait"`), keyed `${F}-${n}`:
  - enter `{opacity: 0, scale: 0.9} → {opacity: 1, scale: 1}`
  - exit `→ {opacity: 0, scale: 0.9}`
  - transition `{duration: 0.5, delay: n*0.2, ease: 'easeOut'}`
- Timer: the next batch is scheduled `0.5 + 0.2*3 = 1.1s` (in) + `1.5s` (display) + `1.1s` (out allowance) = **3.7s** after each batch change, via setTimeout.
- I observed this mid-transition: cells at opacity 0.93/0.56 with scale 0.993/0.956.

### 11.4 Logo ticker (phone)
Ticker mode, `tickerDuration: 20` (s), linear, infinite. The track animates `x: [0, -singleGroupWidth]` only while in view (`useInView` amount 0.1). Logos 20px tall, gap 40px, and each group also has `margin-right: 40px`. Direction: leftward. Speed = group width / 20s.

### 11.5 Hover states
See 0.9 for buttons and links, 7 for cards, and 8.2 for the FAQ (no visible change).
- All Framer variant hovers use tween 0.3s `cubic-bezier(.33,1,.68,1)`. The FAQ uses its own 300ms `ease-in-out` CSS transitions.
- The cookie banner buttons fade to opacity 0.6 on hover and 0.4 on tap.

### 11.6 Tablet/phone testimonial slideshow
Framer Slideshow props:
- `autoPlayControl: false`, so there's **no auto-cycling**. `intervalControl: 1.5` is ignored.
- `dragControl: false`, `direction: left`, `startFrom: 0`. It is infinite: slides are cloned, so at T you can see cards at x = -925 … 1755.
- Items and gap: `itemAmount` 1 with `gap: 10` on phone; `itemAmount` 2 with `gap: 20` on tablet. Cards are 315 wide at T and 350 at P, height 500 (slideshow 510, `paddingBottom: 80`).
- Transition: spring `{stiffness: 200, damping: 40, mass: 1}`.
- `effectsOptions`: opacity 1, scale 1, rotate 0, perspective 1200, `effectsHover: true`. No fade (`fadeContent: false`). Progress dots are off.
- Arrows: `showMouseControls: true`, position `bottom-left`, size 40, radius 8, gap 10, `arrowPaddingBottom: -60`, `arrowPaddingLeft: 0`, `arrowFill: rgba(0,0,0,0.2)`. Images: left `/assets/images/XS3VZuCeUlMKgTQN5czLqhz4j4.png`, right `/assets/images/wdBglVmblpgQZGWAyYchtgCRwA.png` (white rounded squares with dark arrows; see `recon/section-390-testimonials.png`). They sit about 30px below the cards at x=20 and x=70.
- Slides are the same 3 testimonial cards (CMS-driven "Quote 1..n", same content as section 7).

### 11.7 Videos
All 7 `<video>` elements: `autoplay`, `loop`, `muted`, `playsInline`, `preload="auto"`, `controls` off, `object-fit: cover`, `object-position: 50% 50%`, transparent bg, start time 0. Posters exist only for 1–4.mp4. Framer's volume prop of 25 is irrelevant because they're muted.

### 11.8 Rive
See 0.6 and the manifest. All autoplay their "State Machine 1" loops. They're pointer-interactive (`handleEvents`) but don't react to scroll.

### 11.9 Mobile menu
Hamburger to X: the bars rotate ∓45deg and meet at the center, and the nav height animates 48 → 321.8. Tween 0.3s `[.33,1,.68,1]`.

---

## 12. Cookie banner (Framer Cookie Banner, EU "medium" mode)
- Mounted fixed at bottom-right: wrapper `position: fixed; right: 0; bottom: 0; padding: 20px; z-index: 10; pointer-events: none`.
  - D: box at x=1060 y=700 (viewport 1440×900), 360 wide (`max-width: 360px`).
  - P: full width minus 40 (350×180 at x=20).
- Card: bg `#fff`, radius 14, `box-shadow: rgba(0,0,0,0.25) 0 2px 4px, inset 0 0 0 1px rgba(0,0,0,0.05)`, inner `padding: 20px`, font Inter.
  - Title "Cookie Settings": 14px, 700, `#262521`, `margin-bottom: 10px`.
  - Body: "We use cookies to enhance your experience, analyze site traffic and deliver personalized content. Read our [Cookie Policy](https://www.framer.com/legal/policy/)." 14px, line-height 1.5 (21px), `#262521`. The link is `#678efd`, no underline, `target=_blank`.
  - Buttons row: `margin-top: 16px`, gap 10, fluid (each 155×34 at D). "Reject": bg `#f0f0ee`, text `#262521`. "Accept": bg `#262521`, text `#fff`. Both `padding: 10px`, radius 8, 14px.
- Enter animation: `initial {opacity: 0, y: 10, scale: 1}` → `{opacity: 1, y: 0}`, spring `{stiffness: 500, damping: 60, mass: 1}`. Exit reverses it.
- Behavior: it shows until the user chooses. On the source, consent is stored and GTM `GTM-KS8ZHJWB` loads, which is out of scope. The clone can store the choice in localStorage and skip GTM.

---

## 13. Per-breakpoint geometry summary (section top y / height)
| Section | 1440 | 1280 | 810 | 390 |
|---|---|---|---|---|
| Hero | 0 / 988.8 | 0 / 988.8 | 0 / 797.2 | 0 / 616.8 |
| Logo strip | 988.8 / 143.6 | 988.8 / 143.6 | 797.2 / 139.6 | 616.8 / 159.2 |
| Platform features | 1132.4 / 1886.8 | 1132.4 / 1886.8 | 936.8 / 2530.2 | 776 / 1874.6 |
| Product Overview | 3019.2 / 1183.6 | 3019.2 / 1183.6 | 3467 / 2083.6 | 2650.6 / 1629 |
| Enterprise | 4202.8 / 706 | 4202.8 / 706 | 5550.6 / 745.6 | 4279.6 / 943.4 |
| Metrics | 4908.8 / 796.4 | 4908.8 / 796.4 | 6296.2 / 854.8 | 5223 / 828.8 |
| Integrations + FAQ | 5705.2 / 1005.6 | 5705.2 / 958.9 | 7151 / 1077 | 6051.8 / 986 |
| CTA | 6710.8 / 348 | 6664.1 / 348 | 8228 / 290.4 | 7037.8 / 245.2 |
| Footer | 7058.8 / 291.6 | 7012.1 / 291.6 | 8518.4 / 267.6 | 7283 / 473.8 |

At 1280 everything is the 1440 layout with a 960px inner width. The only heights that change are the ones driven by aspect ratio (hero image 591, integrations 414.5). The feature mockup becomes 605.8 wide (65%) and the right column 306.2.

---

## 14. Missing assets / ambiguities
**Downloaded by Recon** (they weren't in `public/assets/` before):
- Images: `gk8YtN5h1vJH6aWTLDjzSpqPug.png`, `F0FLW1PAMhbHm15NSJ1ewW4mth8.png`, `p2a7xf2NHWUddtC1UUKF6kFc1U.png`, `cCVpgYDbMKapsGtJzx5rYRflvDc.png` (logo-wall logos), and `wdBglVmblpgQZGWAyYchtgCRwA.png`, `XS3VZuCeUlMKgTQN5czLqhz4j4.png` (slideshow arrows). Source: `https://framerusercontent.com/images/<id>.png`.
- All 15 Rive files, into `public/assets/riv/`, from `https://framerusercontent.com/assets/<id>.riv`: iMN1EoReEqPtnF1pvfm2DCDbAto, NyWiQDmsS9ebggZxNFRg5HfL4, 9IL1aPqz438g9ksxNz6HohQnUCI, wsNvE8lyfM4sOjrtMza0ZB4iyXo, eHE1DQsgIElPCsQD72t5L5k3R5Q, ixPC1d8kmFhN7mgZJzS21DVjs, RTuHhUc6vCjz6u1I1ErEuoSwL7U, 0dp7iGHbAf4prIHv9XhuKEgZs, nuwOJr5hOc5jfJafpbaZpJW64, yRKeZFzUisz2JKMHQAOxfJpjg, wyklSoGLZqeRFqZhABgohz2Cvw, 5yxLzQ8vf9c0NeoyQOZgJlGUv0, M560tT3PFFd0T3ciANv2oN0uU, gEUIM1UnyqYvqol29hVZR6OA50Q, gy0wRCiRrmBoxUfjjUx9xv0kNs (unused).
- SVG logo and icons, extracted from CSS into `public/assets/svg/`.

**Still external**: the Rive WASM runtime (`https://unpkg.com/@rive-app/canvas@2.27.5/rive.wasm`). Install `@rive-app/react-canvas` (or `@rive-app/canvas`) through npm, which bundles and loads its own wasm. `framer-motion` is recommended for the hero appear, logo rotator, slideshow and cookie banner.

**Ambiguities / not measurable**:
1. Rive canvas content (tube shapes, dot grids, their internal animation timing, and whether they react to hover) is drawn on canvas and can't be read with getComputedStyle. Reproduce it by embedding the same `.riv` files with the listed artboard/fit/alignment. Don't hand-draw it.
2. The logos in the 1440 strip look grey in the screenshot even though they are `brightness(0)` (black). That's because the screenshot caught them mid-fade, not because they're styled grey.
3. Product Overview card A has no CSS background. Its #f0f0ee-looking fill comes from the Rive art. Add a `#f0f0ee` fallback so the card isn't blank while the Rive loads.
4. The Framer spring `duration: 0.5, bounce: 0` has no exact CSS equivalent. Use framer-motion for fidelity.
5. The phone number badge renders about 43×42 rather than its nominal 28px mobile variant size (measured value given).
6. The footer "Email" link has no href on the source.

---

## Appendix A: @font-face block (ready to paste into src/index.css)
Every file below already exists in `public/assets/fonts/`. The gstatic Geist Mono files are variable, so the same file serves weights 500 and 700. The two TWK Lausanne rules have no unicode-range.

```css
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrodmgPn.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrMdmgPn.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFg08vz7ehw.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  unicode-range: U+2000-2001, U+2004-2008, U+200A, U+23B8-23BD, U+2500-259F;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrgdmgPn.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrkdmgPn.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrodmgPn.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrMdmgPn.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFg08vz7ehw.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+2000-2001, U+2004-2008, U+200A, U+23B8-23BD, U+2500-259F;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrgdmgPn.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrkdmgPn.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: "Geist Mono";
  src: url("/assets/fonts/or3nQ6H-1_WfwkMZI_qYFrcdmg.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: "TWK Lausanne 400";
  src: url("/assets/fonts/YHHz0OzMuyHlfEcb0QAeqAKn5c.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "TWK Lausanne 700";
  src: url("/assets/fonts/jX0B7oRRDDDH7XgLlaGQaM1v6U.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/EOr0mi4hNtlgWNn9if640EZzXCo.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+1F00-1FFF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0370-03FF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/b6Y37FthZeALduNqHicBT6FutY.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/DpPBYI0sL4fYLgAkX8KXOPVt7c.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/4RAEQdEOrcnDkhHiiCbJOw92Lk.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/1K3W8DizY3v4emK8Mb08YHxTbs.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+1F00-1FFF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/tUSCtfYVM1I1IchuyCwz9gDdQ.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0370-03FF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/VgYFWiwsAC5OYxAycRXXvhze58.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/syRNPWzAMIrcJ3wIlPIP43KjQs.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/GIryZETIX4IFypco5pYZONKhJIo.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/H89BbHkbHDzlxZzxi8uPzTsp90.woff2") format("woff2");
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/u6gJwDuwB143kpNK1T1MDKDWkMc.woff2") format("woff2");
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/43sJ6MfOPh1LCJt46OvyDuSbA6o.woff2") format("woff2");
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  unicode-range: U+1F00-1FFF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/wccHG0r4gBDAIRhfHiOlq6oEkqw.woff2") format("woff2");
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0370-03FF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/WZ367JPwf9bRW6LdTHN8rXgSjw.woff2") format("woff2");
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/ia3uin3hQWqDrVloC1zEtYHWw.woff2") format("woff2");
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/2A4Xx7CngadFGlVV4xrO06OBHY.woff2") format("woff2");
  font-weight: 700;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/CfMzU8w2e7tHgF4T4rATMPuWosA.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/867QObYax8ANsfX4TGEVU9YiCM.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/Oyn2ZbENFdnW7mt2Lzjk1h9Zb9k.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+1F00-1FFF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/cdAe8hgZ1cMyLu9g005pAW3xMo.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0370-03FF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/DOfvtmE1UplCq161m6Hj8CSQYg.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/pKRFNWFoZl77qYCAIp84lN1h944.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: "Inter";
  src: url("/assets/fonts/tKtBcDnBMevsEEJKdNGhhkLzYo.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
```
