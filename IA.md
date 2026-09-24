# wavelength-clone (React+Vite clone of the original marketing site; link omitted from this repo), documented from the actual src/ codebase

Source: wavelength-clone (React+Vite clone of the original marketing site; link omitted from this repo), documented from the actual src/ codebase
Status: **measured-from-repo**
48 routes · 9 templates · 34 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Blog post, Case study, Legal) account for 41 of 48 routes (85%). The remaining 7 routes span 6 templates.

| template | routes | share |
|---|---:|---:|
| Blog post | 21 | 44% |
| Case study | 18 | 38% |
| Legal | 2 | 4% |
| Not found | 2 | 4% |
| Home | 1 | 2% |
| About | 1 | 2% |
| Contact | 1 | 2% |
| Integrations | 1 | 2% |
| Blog index | 1 | 2% |

## Page chrome

**48 routes carry chrome = `full`** — Home, About, Contact, Integrations, Blog index, Blog post, Case study, Legal, Not found.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | scope |
|---|---|---:|---:|---|
| `shell.announcement-bar` | SHELL | 9 | 48 | Rendered once in App.jsx above the navbar on every route. |
| `shell.navbar` | SHELL | 9 | 48 | Rendered once in App.jsx on every route (remounted per-route via `key={pathname}` to reset the mobile menu). |
| `shell.footer` | SHELL | 9 | 48 | Rendered once in App.jsx below <main> on every route. |
| `shell.cookie-banner` | SHELL | 9 | 48 | Rendered once in App.jsx on every route. |
| `shell.page-lines` | SHELL | 5 | 43 | Listed as a template-level section only where App.jsx renders the fixed (global) variant — integrations, blog-index, blog-post, case-study, and not-found. On about and contact the same component is instead embedded locally, absolutely positioned inside the hero section markup itself (hero.about / hero.contact), so it isn't a separate top-level slot there; home and legal render neither variant. |
| `cta.join` | CTA | 5 | 42 | Appears as the final section on about, blog-index, blog-post, case-study, and integrations templates (not on home, contact, legal, or not-found). |
| `content.article-body` | CONTENT | 2 | 39 | Both the blog-post and case-study templates. |
| `cta.ci-cta` | CTA | 2 | 39 | Both the blog-post and case-study templates, directly after the article body. |
| `hero.blog-post` | HERO | 1 | 21 | Only the blog-post template (/blogs/:slug), one per post. |
| `content.blog-faq` | FAQ | 1 | 21 | Only the blog-post template (/blogs/:slug). |
| `hero.case-study` | HERO | 1 | 18 | Only the case-study template (/case-study/:slug), one per case study. |
| `content.related-case-studies` | CONTENT | 1 | 18 | Only the case-study template (/case-study/:slug). |
| `hero.legal` | HERO | 1 | 2 | Only the legal templates (/legals/terms-conditions, /legals/privacy-policy). |
| `content.legal-body` | CONTENT | 1 | 2 | Only the legal templates. |
| `content.not-found` | CONTENT | 1 | 2 | Only the not-found template (/404, and any unmatched route, and as a fallback render inside BlogPost/CaseStudy when a slug doesn't resolve). |
| `hero.home` | HERO | 1 | 1 | Only the home template (/). |
| `hero.about` | HERO | 1 | 1 | Only the about template (/about). |
| `hero.contact` | HERO | 1 | 1 | Only the contact template (/contact). |
| `hero.integrations` | HERO | 1 | 1 | Only the integrations template (/integrations). |
| `hero.blogs-index` | HERO | 1 | 1 | Only the blog-index template (/blogs). |
| `proof.logo-strip` | PROOF | 1 | 1 | Only the home template (/). |
| `proof.testimonials` | PROOF | 1 | 1 | Only the home template (/). |
| `proof.our-mission` | PROOF | 1 | 1 | Only the about template (/about). |
| `proof.our-values` | PROOF | 1 | 1 | Only the about template (/about). |
| `proof.the-team` | PROOF | 1 | 1 | Only the about template (/about). |
| `feature.platform-features` | FEATURE | 1 | 1 | Only the home template (/). |
| `feature.product-overview` | FEATURE | 1 | 1 | Only the home template (/). |
| `feature.enterprise` | FEATURE | 1 | 1 | Only the home template (/). |
| `content.integrations-faq` | FAQ | 1 | 1 | Only the home template (/). |
| `content.open-roles` | CONTENT | 1 | 1 | Only the about template (/about), section id="career". |
| `content.contact-form` | CONTENT | 1 | 1 | Only the contact template (/contact). |
| `content.integrations-list` | CONTENT | 1 | 1 | Only the integrations template (/integrations). |
| `content.blog-grid` | CONTENT | 1 | 1 | Only the blog-index template (/blogs). |
| `cta.closing` | CTA | 1 | 1 | Only the home template (/). |

**8 shared sections** appear in more than one template and belong in a component library.

**26 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Home — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.announcement-bar` | shared ×9 |
| 2 | SHELL | `shell.navbar` | shared ×9 |
| 3 | HERO | `hero.home` | page-local |
| 4 | PROOF | `proof.logo-strip` | page-local |
| 5 | FEATURE | `feature.platform-features` | page-local |
| 6 | FEATURE | `feature.product-overview` | page-local |
| 7 | FEATURE | `feature.enterprise` | page-local |
| 8 | PROOF | `proof.testimonials` | page-local |
| 9 | FAQ | `content.integrations-faq` | page-local |
| 10 | CTA | `cta.closing` | page-local |
| 11 | SHELL | `shell.footer` | shared ×9 |
| 12 | SHELL | `shell.cookie-banner` | shared ×9 |

### About — `template.about`

1 route · `/about` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.announcement-bar` | shared ×9 |
| 2 | SHELL | `shell.navbar` | shared ×9 |
| 3 | HERO | `hero.about` | page-local |
| 4 | PROOF | `proof.our-mission` | page-local |
| 5 | PROOF | `proof.our-values` | page-local |
| 6 | PROOF | `proof.the-team` | page-local |
| 7 | CONTENT | `content.open-roles` | page-local |
| 8 | CTA | `cta.join` | shared ×5 |
| 9 | SHELL | `shell.footer` | shared ×9 |
| 10 | SHELL | `shell.cookie-banner` | shared ×9 |

### Contact — `template.contact`

1 route · `/contact` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.announcement-bar` | shared ×9 |
| 2 | SHELL | `shell.navbar` | shared ×9 |
| 3 | HERO | `hero.contact` | page-local |
| 4 | CONTENT | `content.contact-form` | page-local |
| 5 | SHELL | `shell.footer` | shared ×9 |
| 6 | SHELL | `shell.cookie-banner` | shared ×9 |

### Integrations — `template.integrations`

1 route · `/integrations` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.announcement-bar` | shared ×9 |
| 2 | SHELL | `shell.navbar` | shared ×9 |
| 3 | SHELL | `shell.page-lines` | shared ×5 |
| 4 | HERO | `hero.integrations` | page-local |
| 5 | CONTENT | `content.integrations-list` | page-local |
| 6 | CTA | `cta.join` | shared ×5 |
| 7 | SHELL | `shell.footer` | shared ×9 |
| 8 | SHELL | `shell.cookie-banner` | shared ×9 |

### Blog index — `template.blog-index`

1 route · `/blogs` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.announcement-bar` | shared ×9 |
| 2 | SHELL | `shell.navbar` | shared ×9 |
| 3 | SHELL | `shell.page-lines` | shared ×5 |
| 4 | HERO | `hero.blogs-index` | page-local |
| 5 | CONTENT | `content.blog-grid` | page-local |
| 6 | CTA | `cta.join` | shared ×5 |
| 7 | SHELL | `shell.footer` | shared ×9 |
| 8 | SHELL | `shell.cookie-banner` | shared ×9 |

### Blog post — `template.blog-post`

21 routes · `/blogs/{slug}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.announcement-bar` | shared ×9 |
| 2 | SHELL | `shell.navbar` | shared ×9 |
| 3 | SHELL | `shell.page-lines` | shared ×5 |
| 4 | HERO | `hero.blog-post` | page-local |
| 5 | CONTENT | `content.article-body` | shared ×2 |
| 6 | CTA | `cta.ci-cta` | shared ×2 |
| 7 | FAQ | `content.blog-faq` | page-local |
| 8 | CTA | `cta.join` | shared ×5 |
| 9 | SHELL | `shell.footer` | shared ×9 |
| 10 | SHELL | `shell.cookie-banner` | shared ×9 |

### Case study — `template.case-study`

18 routes · `/case-study/{slug}` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.announcement-bar` | shared ×9 |
| 2 | SHELL | `shell.navbar` | shared ×9 |
| 3 | SHELL | `shell.page-lines` | shared ×5 |
| 4 | HERO | `hero.case-study` | page-local |
| 5 | CONTENT | `content.article-body` | shared ×2 |
| 6 | CTA | `cta.ci-cta` | shared ×2 |
| 7 | CONTENT | `content.related-case-studies` | page-local |
| 8 | CTA | `cta.join` | shared ×5 |
| 9 | SHELL | `shell.footer` | shared ×9 |
| 10 | SHELL | `shell.cookie-banner` | shared ×9 |

### Legal — `template.legal`

2 routes · `/legals/terms-conditions`, `/legals/privacy-policy` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.announcement-bar` | shared ×9 |
| 2 | SHELL | `shell.navbar` | shared ×9 |
| 3 | HERO | `hero.legal` | page-local |
| 4 | CONTENT | `content.legal-body` | page-local |
| 5 | SHELL | `shell.footer` | shared ×9 |
| 6 | SHELL | `shell.cookie-banner` | shared ×9 |

### Not found — `template.not-found`

2 routes · `/404`, `*` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.announcement-bar` | shared ×9 |
| 2 | SHELL | `shell.navbar` | shared ×9 |
| 3 | SHELL | `shell.page-lines` | shared ×5 |
| 4 | CONTENT | `content.not-found` | page-local |
| 5 | SHELL | `shell.footer` | shared ×9 |
| 6 | SHELL | `shell.cookie-banner` | shared ×9 |

## Section reference

### SHELL

_Persistent chrome rendered around every route by App.jsx — announcement bar, nav, footer, cookie banner._

**`shell.announcement-bar`** — Thin dismissible banner above the navbar (AnnouncementBar in Navbar.jsx).

· Rendered once in App.jsx above the navbar on every route. · appears on 48 routes

**`shell.navbar`** — Sticky top navigation: logo, nav links, mobile menu, CTA button.

· Rendered once in App.jsx on every route (remounted per-route via `key={pathname}` to reset the mobile menu). · appears on 48 routes

**`shell.footer`** — Site footer: link columns, legal links, social links.

· Rendered once in App.jsx below <main> on every route. · appears on 48 routes

**`shell.cookie-banner`** — Bottom cookie-consent banner, dismissible and persisted client-side.

· Rendered once in App.jsx on every route. · appears on 48 routes

**`shell.page-lines`** — Decorative vertical guide lines overlaid on certain hero sections (PageLines in components/sub/shared.jsx).

· Listed as a template-level section only where App.jsx renders the fixed (global) variant — integrations, blog-index, blog-post, case-study, and not-found. On about and contact the same component is instead embedded locally, absolutely positioned inside the hero section markup itself (hero.about / hero.contact), so it isn't a separate top-level slot there; home and legal render neither variant. · appears on 43 routes

### HERO

_The above-the-fold intro block of a page: headline, supporting copy, primary CTA and/or hero art._

**`hero.home`** — Home page hero: headline, subcopy, primary CTA, and animated Rive hero art (Hero.jsx).

· Only the home template (/). · appears on 1 routes

**`hero.about`** — About page hero: 'Building for the revenue teams of tomorrow' headline, rotated photo pair, Explore Careers CTA (AboutHero in About.jsx).

· Only the about template (/about). · appears on 1 routes

**`hero.contact`** — Contact page hero: 'Contact Us' headline + intro copy, directly above the contact form.

· Only the contact template (/contact). · appears on 1 routes

**`hero.integrations`** — Integrations page hero: headline + animated horizontal-scrolling row of integration icon tiles (IntegrationsHero in Integrations.jsx).

· Only the integrations template (/integrations). · appears on 1 routes

**`hero.blogs-index`** — Blog index hero: 'Blog' headline + subcopy + one featured post card (the single item flagged listedOnIndex).

· Only the blog-index template (/blogs). · appears on 1 routes

**`hero.blog-post`** — Blog post hero: fixed-height banner with author/date byline, title, excerpt, and post hero art (post.heroArt.svg).

· Only the blog-post template (/blogs/:slug), one per post. · appears on 21 routes

**`hero.case-study`** — Case study hero (dark bg-ink): title, excerpt, cover image, track art image.

· Only the case-study template (/case-study/:slug), one per case study. · appears on 18 routes

**`hero.legal`** — Legal page hero (dark bg-ink): 'updated' date, document title.

· Only the legal templates (/legals/terms-conditions, /legals/privacy-policy). · appears on 2 routes

### PROOF

_Social proof: customer/investor/company logos, testimonials, team affiliations._

**`proof.logo-strip`** — Row of customer/investor logos directly under the home hero (LogoStrip.jsx).

· Only the home template (/). · appears on 1 routes

**`proof.testimonials`** — Customer testimonial cards (Testimonials.jsx).

· Only the home template (/). · appears on 1 routes

**`proof.our-mission`** — 'Our mission' narrative card with Rive-animated background tracks and corner stickers (Mission in About.jsx).

· Only the about template (/about). · appears on 1 routes

**`proof.our-values`** — 8-item 'Our Values' icon+title+body grid over a Rive-animated background (Values in About.jsx).

· Only the about template (/about). · appears on 1 routes

**`proof.the-team`** — 'The Team' grid of past-employer/investor logos (Team in About.jsx).

· Only the about template (/about). · appears on 1 routes

### FEATURE

_Product/platform capability blocks — feature grids, product overview, enterprise pitch._

**`feature.platform-features`** — Grid of platform capability tiles (PlatformFeatures.jsx).

· Only the home template (/). · appears on 1 routes

**`feature.product-overview`** — Product walkthrough / overview section (ProductOverview.jsx).

· Only the home template (/). · appears on 1 routes

**`feature.enterprise`** — Enterprise-tier pitch section (Enterprise.jsx).

· Only the home template (/). · appears on 1 routes

### CONTENT

_Long-form or listing content specific to a content type — article body, post grid, integration list, legal text._

**`content.open-roles`** — 2-item open-roles list with title/body/location chips and a Learn More affordance (OpenRoles in About.jsx).

· Only the about template (/about), section id="career". · appears on 1 routes

**`content.contact-form`** — Contact form (Name/Email/Subject/Message fields, honeypot field, submit button with idle/loading/success/error states).

· Only the contact template (/contact). · appears on 1 routes

**`content.integrations-list`** — Searchable grid of integration cards, filtered client-side by name substring, with an empty-state illustration when no match (IntegrationsList in Integrations.jsx).

· Only the integrations template (/integrations). · appears on 1 routes

**`content.blog-grid`** — Grid of post cards for every entry in blogs.json (PostCard, includes the featured item again).

· Only the blog-index template (/blogs). · appears on 1 routes

**`content.article-body`** — Shared long-form article renderer: table-of-contents sidebar with active-anchor tracking + rendered body blocks (Article in components/sub/Article.jsx).

· Both the blog-post and case-study templates. · appears on 39 routes

**`content.related-case-studies`** — 3-card 'Related Case Studies' grid, selected via ITEMS.filter(i => i.slug !== slug).slice(2, 5).

· Only the case-study template (/case-study/:slug). · appears on 18 routes

**`content.legal-body`** — Rendered legal document body (headings/paragraphs/lists) from src/data/legal.js's structure-only blocks.

· Only the legal templates. · appears on 2 routes

**`content.not-found`** — 404 'page not found' message, full-viewport-height centered.

· Only the not-found template (/404, and any unmatched route, and as a fallback render inside BlogPost/CaseStudy when a slug doesn't resolve). · appears on 2 routes

### FAQ

_Question/answer accordion blocks._

**`content.integrations-faq`** — Home page integrations-flavored FAQ accordion (IntegrationsFaq.jsx).

· Only the home template (/). · appears on 1 routes

**`content.blog-faq`** — FAQ accordion appended after every blog post body (BlogFaq in components/sub/Article.jsx).

· Only the blog-post template (/blogs/:slug). · appears on 21 routes

### CTA

_Standalone conversion sections whose only job is to drive a click (demo, careers, contact form)._

**`cta.ci-cta`** — Mid-article conversion banner (CiCta in components/sub/Ctas.jsx), shown once per article-bearing page.

· Both the blog-post and case-study templates, directly after the article body. · appears on 39 routes

**`cta.join`** — Shared closing 'Join'/demo CTA band (JoinCta in components/sub/Ctas.jsx) with per-route copy/padding presets from JOIN_COPY/JOIN_PAD.

· Appears as the final section on about, blog-index, blog-post, case-study, and integrations templates (not on home, contact, legal, or not-found). · appears on 42 routes

**`cta.closing`** — Home page's own closing CTA band (ClosingCta.jsx) — distinct component from the shared JoinCta used elsewhere.

· Only the home template (/). · appears on 1 routes
