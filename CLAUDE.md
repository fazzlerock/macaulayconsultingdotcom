# Macaulay Consulting — Site Guide

Static HTML website. No build tools, no frameworks — plain HTML, CSS, and JS, hosted on Cloudflare Pages (primary) and mirrored on GitHub Pages for preview.

Claude Code acts as the CMS: when content needs updating, edit the HTML files directly and push to deploy.

**Source of truth for all page copy:** `content_copy.md`
**Source of truth for SEO metadata:** `seo_metadata.csv`

---

## File structure

```
/
├── index.html                  ← Home (/)
├── about.html                  ← /about
├── services.html               ← /services
├── case-studies.html           ← /case-studies
├── more-joy-at-work.html       ← /more-joy-at-work
├── contact.html                ← /contact
├── visual-identity.html        ← Visual identity reference (internal — not in public nav)
├── font-options.html           ← Scratch file (internal — ignore)
├── status/
│   └── index.html              ← /status (noindex — not in public nav)
├── assets/
│   ├── css/
│   │   └── style.css           ← Single stylesheet — all styles go here
│   ├── js/
│   │   └── main.js             ← Site-wide JS
│   ├── logos/                  ← Brand logo PNGs
│   │   ├── cm-consulting-logo.png
│   │   ├── cm-consulting-logo-horizontal.png
│   │   └── cm-consulting-logo-horizontal-monochrome.png
│   ├── images/                 ← General site images
│   │   └── portrait.webp       ← Caroline's headshot (About page)
│   └── clients/                ← Client logo PNGs (referenced from clients.json)
├── clients.json                ← Client list — set confirmed:true to show logo on Home
├── _redirects                  ← Cloudflare Pages clean-URL rules
└── _headers                    ← Cloudflare Pages HTTP header rules
```

---

## Working with this project

**To update content:** refer to `content_copy.md` for the correct copy, then edit the relevant `.html` file directly. When editing a page's content (body copy, headings, links — not just nav, footer, or structural/CSS changes shared across pages), also update `<meta name="last-updated" content="YYYY-MM-DD">` in that page's `<head>` to today's date.

**To add a page:**
1. Create a new `.html` file in the appropriate location.
2. Copy the full header/nav/footer from the nearest equivalent page.
3. Add a link to the new page wherever appropriate — primary nav for top-level public pages.
4. Pages inside `status/` need `../assets/css/style.css` and `../assets/js/main.js` (one level up). Root-level pages use `assets/css/style.css`.
5. Add the new page's path to the `PAGES` array in `status/index.html` so it appears in the status dashboard.
6. Add the new page to `_redirects` if it needs a clean URL (e.g. `/new-page  /new-page.html  200`).
7. Update the file structure listing in this file.

**To update nav or footer:** nav and footer HTML are duplicated across all pages. Update every `.html` file — there is no shared template.

**To show a client logo on the Home page:** place the PNG in `assets/clients/` and set `"confirmed": true` for that client in `clients.json`. The logo filename must match the `logo` field in `clients.json`.

**To deploy:** push to `main`. Cloudflare Pages deploys automatically. Development work goes on a feature branch and is merged via pull request. Never push directly to `main`.

**Clean URLs (external use only):** Cloudflare Pages serves `about.html` at `/about`, `status/index.html` at `/status`, etc., and the `_redirects` file ensures clean paths still resolve. However, **internal site links use relative paths with `.html`** (`about.html`, `services.html`, …), not absolute clean URLs. This is required for GitHub Pages previews and local previews to work, since those don't honour `_redirects`. Reserve clean URLs for things like canonical/og:url meta tags and external references (LinkedIn, business listings).

---

## Pre-merge consistency checks

Because nav and footer markup is duplicated across pages, drift is easy. Before merging any PR that touches shared structure (nav, footer, head meta, or anything that should appear on every page), verify:

- **Nav markup is identical** across all 7 pages (`index`, `about`, `services`, `case-studies`, `more-joy-at-work`, `contact`, `status/index`). The status page has a slimmed internal nav and uses `../` relative paths — its nav is intentionally different but its footer should match the public pages structurally.
- **Footer markup is identical** across all public pages (links, descriptor, acknowledgement text, copyright year). The status page footer differs only in: (a) `../` relative paths in footer-nav links, and (b) `Internal reference — not for distribution.` copyright suffix.
- **Copyright year** is current and consistent across all pages.
- **Internal links use relative paths with `.html`** (e.g. `about.html`) on the root-level pages. Status page uses `../about.html` style relative paths. No absolute clean URLs in nav, footer, or body links — they break GitHub Pages and local previews.
- **All `<img>` tags have an `alt` attribute** (empty `alt=""` is acceptable for purely decorative images).
- **All external links** carry `target="_blank" rel="noopener"`.
- **Every public page has** `<meta name="description">`, the four core Open Graph tags (`og:type`, `og:url`, `og:title`, `og:description`), and `<meta name="last-updated" content="YYYY-MM-DD">`.
- **Internal-only pages** (`status/`, `visual-identity.html`, `font-options.html`) have `<meta name="robots" content="noindex, nofollow">`.
- **`status/index.html` `PAGES` array** includes every public page (otherwise the status dashboard silently omits it).
- **`_redirects`** has a clean-URL entry for every top-level public page.

Quick sanity command to spot-check shared blocks:
```
grep -c "footer-descriptor" *.html status/index.html   # should be 1 on every line
grep -c "footer-col-nav"    *.html status/index.html   # should be 1 on every line
grep -E "© 20[0-9]{2}"      *.html status/index.html   # all should be current year
```

When in doubt, diff the nav block (between `<nav` and `</nav>`) and the footer block (between `<footer` and `</footer>`) between `index.html` and each other page — they should be byte-identical for the public pages.

---

## Effectiveness standards

These principles govern every development and content decision on this site. Macaulay Consulting is a credence-good business (clients cannot easily evaluate quality before engaging), so trust-building is the primary purpose of the website.

### Site purpose and target audience

**Primary purpose:** Convert visitors from health and public sector organisations into enquiries (phone call or contact form).

**Target audience:** Senior leaders, programme managers and procurement decision-makers in Queensland Health, other health agencies, government departments, and community sector organisations. Typically time-poor, risk-aware, and evaluating multiple options.

**Core user scenarios to keep in mind when making any change:**
1. A Health Executive searches for a facilitator for a leadership away-day and lands on the homepage — can they understand what Caroline does, assess her credibility, and find a contact path within 30 seconds?
2. A programme manager who has heard Caroline's name searches for her — does the About page give them enough to advocate for her internally?
3. A potential client on a mobile device wants to get in touch quickly — can they reach a phone number or form within two taps?

---

### Usability standards

- **Navigation must be visible and consistent on every page** — the fixed nav bar satisfies this; do not remove or obscure it.
- **Maximum 3 clicks to contact** — Home → Contact and Home → any service → Contact are the critical paths. Do not add friction.
- **No visible placeholders on public pages** — "coming soon", "under construction", and empty sections signal unprofessionalism and destroy trust. If content is not ready, the section should not be visible to the public. Use HTML comments to hold placeholder notes for internal reference only.
- **No broken links or missing images** — before any deployment, verify all internal links resolve and all `<img>` tags have accessible sources.

---

### Trust signals — what this site must communicate

Consulting is a credence good: clients cannot evaluate quality until after the engagement. The site's job is to make the trust decision as easy as possible across three dimensions:

**Emotional trust** — "I feel comfortable with this person"
- Caroline's headshot is the highest-priority missing asset on the site; its absence is the single biggest trust gap. Once supplied, place it prominently on the About page and consider a smaller version on the Home intro section.
- Testimonials (already present) carry significant weight — add new ones as engagements are completed.
- The warm, editorial visual style (Cormorant Garamond, parchment tones) signals sophistication and care; maintain this standard in all new sections.

**Rational trust** — "This person has the credentials and track record"
- Credentials section in About is already present — keep it current.
- Case studies are the most underdeveloped trust element; prioritise completing them as Caroline's first content contribution.
- Client logos (once confirmed) provide instant sector credibility — activate them as soon as logo files are available.

**Institutional trust** — "There are structural assurances here"
- A privacy policy page is pending — add it before the site goes live publicly; place a footer link to it on every page.
- Contact details (phone and email) must remain visible in the footer and on the Contact page at all times — they are a structural trust signal.
- The contact form's "not yet active" notice should be removed as soon as the Web3Forms key is in place; a non-functional form is worse than no form.

---

### Interactivity

- The contact form is the primary two-way channel — activating it is a priority.
- LinkedIn is the secondary channel; the link is present in nav and footer on all pages.
- As the business matures, consider adding a simple enquiry-type selector to the contact form (e.g. "What are you enquiring about?" dropdown) to help Caroline triage responses.

---

### Sector-specific guidance

- This is a **B2B consulting** site. Avoid entertainment-oriented features (animations, gamification, decorative interactions). Every feature should serve a utilitarian purpose: helping the visitor find information, assess credibility, or make contact.
- Do not add features that prioritise visual novelty over clarity. Sophistication here means restraint, not complexity.
- When adding new content, ask: does this help a decision-maker trust Caroline enough to pick up the phone? If not, it does not belong on the site.

---



- **One stylesheet:** `assets/css/style.css` — do not create additional CSS files.
- **CSS custom properties** defined in `:root` — always use them for colours, never hardcoded hex values.
- **JavaScript** goes in `assets/js/main.js` unless a page genuinely needs isolated script (e.g. the status page's fetch logic).
- **No build tool** — header and footer HTML are duplicated across pages. When updating nav or footer, update every page.
- **Relative asset paths** throughout — `assets/css/style.css` not `/assets/css/style.css`. This is required for GitHub Pages subdirectory compatibility.
- **Internal links** use **relative paths with `.html`** (`about.html`, `services.html`, etc.) — not absolute clean URLs. This keeps the site working on GitHub Pages preview (which serves from a subdirectory) and local file:// previews. Cloudflare's `_redirects` still maps `/about` → `/about.html` for any external inbound links using clean URLs.
- **`loading="lazy"`** on all images below the fold.
- **`target="_blank" rel="noopener"`** on all external links.
- **Australian English** spelling throughout all copy (e.g. organisation, programme, practitioner, honour).
- **`<meta name="last-updated">`** must be updated whenever a page's content changes.

---

## Business information

| Field | Value |
|-------|-------|
| Business name | Macaulay Consulting |
| Owner / principal | Caroline Macaulay |
| Address | Brisbane (Meanjin), QLD |
| Phone | +61 404 014 117 |
| Email | caro@consultcm.com.au |
| Website | consultcm.com.au |
| LinkedIn | linkedin.com/in/caroline-macaulay-91b2689b/ |

### Services
1. Strategy & Planning — strategic planning facilitation for boards and leadership teams
2. Co-design — human-centred design with service users, staff and communities
3. Evaluation — qualitative programme evaluation and research
4. Facilitation — workshop and event facilitation
5. More Joy at Work — structured team culture programme (neuro-leadership, emotional culture)

### Key facts
- Sole practitioner — Caroline does all work personally
- 15 years frontline health experience + a decade of strategy and improvement work
- Works across Queensland and beyond
- Primary clients: health and public sector organisations
- Every engagement is scoped to need — no standard packages

---

## Design system

### Palette
```css
--color-moss:         #2A3B30   /* deep moss — dark sections, nav logo, headings */
--color-moss-dark:    #1E2C24   /* footer background */
--color-parchment:    #FAF7F2   /* page background, hero */
--color-linen:        #F0EAE0   /* alternate section background, card hover */
--color-cumquat:      #E07828   /* brand accent — CTAs, links, highlights */
--color-cumquat-dark: #C4681E   /* hover state for cumquat elements */
--color-cumquat-pale: #FDF0E4   /* pale cumquat — More Joy hero background */
--color-slate:        #5C5248   /* secondary text, labels */
--color-stone:        #DDD5C8   /* borders, dividers */
--color-text:         #1E1A16   /* body text */
--color-text-light:   #5C5248   /* lighter body text (same as slate) */
--color-white:        #FFFFFF   /* nav background, card backgrounds */
--color-error:        #C0392B   /* form validation errors */
```

### Typography
- **Display / headings:** Cormorant Garamond (Google Fonts) — h1–h4, `.footer-logo`, `.nav-logo`, large pull quotes
- **Body / UI:** Lora (Google Fonts) — body copy, nav links, buttons, labels, captions
- Google Fonts URL: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Lora:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap`

### Heading sizes
```css
h1 { font-size: clamp(40px, 6vw, 68px); line-height: 1.08; }
h2 { font-size: clamp(28px, 4vw, 44px); line-height: 1.1;  }
h3 { font-size: clamp(20px, 2.5vw, 28px); line-height: 1.15; }
```
Italic (`<em>`) inside headings renders in cumquat (`--color-cumquat`).

### Section backgrounds
- `.bg-parchment` → `#FAF7F2`
- `.bg-linen` → `#F0EAE0`
- `.bg-moss` → `#2A3B30` (text overrides: headings → parchment, p → 85% parchment)
- `.bg-cumquat-pale` → `#FDF0E4`

### Section label (eyebrow text above headings)
```html
<span class="section-label">Label text</span>
```
Rendered in cumquat, italic Lora, 13px, uppercase letter-spacing.

### Buttons
- **Primary:** `.btn-primary` — cumquat background, white text, Lora 700, 15px, `padding: 14px 28px`, border-radius 3px
- **Text link:** `.btn-text-link` — inline, bottom border, cumquat on hover
- **Arrow link:** `.arrow-link` — cumquat, bold, gap animates on hover (`gap` transitions from 6px → 12px)

### Navigation
- White background, fixed, `height: 72px` (`--nav-h`)
- Adds `border-bottom: 1px solid var(--color-stone)` on scroll (`.scrolled` class)
- Nav links: Lora 15px, underline scale-in on hover/active
- LinkedIn icon sits at end of desktop nav, suppresses underline effect
- Mobile: hamburger (`.nav-hamburger`) at 860px, opens fullscreen moss overlay (`.nav-mobile`)

### Footer
- Background: `--color-moss-dark` (`#1E2C24`)
- Two-column grid: logo + contact on left, acknowledgement of country on right
- `.footer-bar` at bottom: flex, `justify-content: space-between`
  - Left: `.footer-copy` (copyright)
  - Centre: `.footer-li` (LinkedIn icon, public pages only)
  - Right: `.footer-updated` — injected at runtime by `main.js` from `<meta name="last-updated">`

### Testimonial carousel (Home, `.t-carousel`)
- Slides fade in/out with JS; dots navigate manually
- On moss background: white quote text, stone attribution
- `t-single` / `.t-single-inner` — used for a single static quote (e.g. More Joy page)

### Cards
- Workshop cards (Home): white bg, stone border, `border-radius: 4px`, lift on hover (`translateY(-4px)`)
- Services snapshot (Home): flex column, large muted number, cumquat arrow-link
- All card grids use CSS Grid — do not use `translateY` for visual stagger as it breaks perceived height alignment

---

## Navigation

### Primary nav (in order)
1. Home → `/` (or `index.html` in relative links)
2. About → `/about`
3. Services → `/services`
4. Case Studies → `/case-studies`
5. More Joy at Work → `/more-joy-at-work`
6. Contact → `/contact`
7. LinkedIn icon → external, `target="_blank" rel="noopener"`

### Footer nav
No formal footer nav columns. Footer contains: logo, phone, email, country acknowledgement, LinkedIn icon, copyright, last-updated date.

### Internal reference pages (not in nav)
- `/visual-identity` — living style guide, links to live stylesheet
- `/status` — live-fetch status dashboard (noindex)

---

## Client logos

`clients.json` is the source of truth for the clients grid on the Home page.

Each entry:
```json
{
  "name": "Organisation Name",
  "logo": "filename.png",
  "sector": "health|government|community",
  "tier": "featured|standard",
  "confirmed": false
}
```

- `confirmed: false` → renders organisation name as text placeholder
- `confirmed: true` → renders the PNG from `assets/clients/[logo]`

Logo PNGs should be square or landscape, transparent background, greyscale or dark preferred (CSS applies `filter: grayscale(1) opacity(0.6)` which lifts on hover).

---

## SEO

**Source of truth for SEO metadata:** `seo_metadata.csv` — one row per page. Update this file at the same time as editing a page's `<head>` meta tags.

### Meta tags — every page needs
- `<meta name="description">` — unique per page, 150–160 characters
- Open Graph: `og:type`, `og:url`, `og:title`, `og:description`, `og:image`
- `<meta name="last-updated" content="YYYY-MM-DD">` — update when content changes
- Internal reference pages also need: `<meta name="robots" content="noindex, nofollow">`

### Schema.org JSON-LD (Home page)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Macaulay Consulting",
  "description": "Brisbane-based facilitation and strategy consulting for health and public sector organisations.",
  "url": "https://consultcm.com.au",
  "telephone": "+61404014117",
  "email": "caro@consultcm.com.au",
  "founder": { "@type": "Person", "name": "Caroline Macaulay" },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Brisbane",
    "addressRegion": "QLD",
    "addressCountry": "AU"
  },
  "areaServed": ["Queensland", "Australia"],
  "knowsAbout": ["Strategic Planning", "Facilitation", "Co-design", "Evaluation", "Team Culture"]
}
```

---

## Contact form

Uses [Web3Forms](https://web3forms.com). Free tier, no server required.

**To activate:**
1. Go to web3forms.com and enter `caro@consultcm.com.au` to generate an access key.
2. In `contact.html`, replace the placeholder access key value in the hidden input.
3. Remove `onsubmit="return false;"` from the `<form>` tag.
4. Remove the "Form not yet active" notice from the page.

---

## Pending / placeholders

- [x] **Logo artwork — horizontal nav lockup** — `assets/logos/cm-consulting-logo-horizontal.png` (RGBA, transparent background) is live in the nav on all pages.
- [ ] **Logo artwork — footer/dark variant** — the current horizontal logo is dark green and orange, so it disappears on the footer's moss-dark background. Footer still uses the text wordmark. Needs a parchment/cream version on transparent background (RGB green is `42, 59, 48` / `#2A3B30`; orange is `#E07828`).
- [x] **Headshot** — `assets/images/portrait.webp`, live on About page
- [x] **Site imagery** — `small-group-session.webp` (services), `workshop-lead.webp` (More Joy), `your-town-engagement-strategy.webp` (case studies) are live
- [ ] **Web3Forms key** — enter `caro@consultcm.com.au` at web3forms.com, paste key into `contact.html`, remove `onsubmit="return false;"` and the "not yet active" notice
- [ ] **Case study content** — West Moreton Health and yourtown are drafted with attributed testimonials; both need Caroline's confirmation of the situation/approach/outcome detail before publishing. 2 further placeholder slots remain in `case-studies.html` (HTML comments) for additional case studies.
- [ ] **Client logos** — PNG files for confirmed clients go in `assets/clients/`; set `"confirmed": true` in `clients.json` per client
- [ ] **More Joy at Work programme phases** — Caroline to review phase names, sequence and descriptions in `more-joy-at-work.html`
- [ ] **Video embed** — add YouTube/Vimeo URL in `more-joy-at-work.html` once content is published; replace the placeholder block
- [ ] **Google Business Profile** — set up once `consultcm.com.au` is live
- [ ] **Social links beyond LinkedIn** — add if/when other channels are established
