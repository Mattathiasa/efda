# EFDA website — design files (HTML/CSS/JS)

This is the canvas design rebuilt as a plain static site: Home, About, Projects and Contact, in English, Amharic and Afaan Oromoo. It has no build step and no dependencies.

**Open it:** double-click `index.html`. Everything works from disk, including the language switcher, program switcher, before/after slider, project filters, contact form states and mobile menu.

**Preview without a browser:** see `previews/`. It has full-page captures at 1440 px (EN / AM / OM) and 390 px for every page.

> This is a design reference, not the production site. The Build Document describes the production stack (Next.js + next-intl). The sections below say how each part of this folder maps onto it.

---

## Folder map

```
index.html  about.html  projects.html  contact.html
assets/
  css/fonts.css        self-hosted @font-face (Bricolage Grotesque, Instrument Sans, DM Mono, Noto Sans Ethiopic)
  css/styles.css       tokens (:root) → base → layout → components → page sections → responsive
  js/locales.js        GENERATED from locales/*.json (lets i18n work on file://)
  js/main.js           all behaviour, ~250 lines, no framework
  fonts/               woff2 + SIL OFL licence files
  img/logo/            Globe E mark: forest, reversed, white, favicon (SVG)
  img/photos/          18 photos from EFDA's January 2024 profile
locales/en.json am.json om.json   ← the source of truth for all copy
tools/build-locales.mjs           regenerates assets/js/locales.js
previews/                         full-page JPEG captures
```

## Design tokens

All tokens are at the top of `assets/css/styles.css`.

| Token | Value | Use |
|---|---|---|
| `--forest` | `#0E2B22` | primary dark, hero, footer |
| `--canopy` | `#163A2E` | secondary dark surfaces |
| `--laterite` | `#B5491F` | primary action, labels, accents |
| `--honey` | `#F0B43C` | accent on dark only (the lit "Ethiopia" tile) |
| `--chalk` | `#F2F1EC` | page background |
| `--paper` | `#FBFAF6` | cards |
| `--dust` | `#E8E6DD` | alternate section background |
| `--ink` / `--muted` | `#10201A` / `#4A5A52` | text |

Type families:

- **Display:** Bricolage Grotesque 700/800, tight tracking.
- **Body:** Instrument Sans.
- **Labels:** DM Mono, uppercase, letter-spacing 0.1em.
- **Ethiopic:** every stack falls back to Noto Sans Ethiopic. Under `html[lang="am"]`, the negative tracking is removed and line-height goes up to 1.18.

## How the localization works

- **Text:** every translatable element has `data-i18n="namespace.key"`, and arrays use numeric indexes (`home.stats.2.label`).
  - Attributes use `data-i18n-attr="alt:home.heroAlt;aria-label:common.menu"`.
- **Interpolation:** `{n}` is replaced from a `data-n` attribute (used by "Showing {n} of 7 projects").
- **Language choice:** the current language comes from `?lang=am` first, then `localStorage['efda-lang']`, then English.
  - Switching sets `<html lang>`, re-renders every string and updates the page `<title>`.
- **English is baked into the HTML,** so the pages read correctly without JS.

**Editing copy:**

1. Edit `locales/*.json`.
2. Run `node tools/build-locales.mjs`.
3. Reload.

**One key was added since the dev kit:** `common.skip` (skip-to-content link). Copy it into the kit's locales too.

**Porting to next-intl:** the JSON shape is already next-intl's message format.

- `data-i18n="home.heroP"` becomes `const t = useTranslations('home'); t('heroP')`.
- For arrays, use `t.raw('stats')` and map over the result.
- Replace the localStorage switcher with `/en`, `/am` and `/om` routes plus `hreflang`. Language should live in the URL in production so that search engines index all three languages.

## Interactions (in `assets/js/main.js`)

| Feature | Function | Notes for production |
|---|---|---|
| Language switcher | `initLanguageSwitch` | becomes a `<Link locale>` switch |
| Mobile menu | `initMenu` | `aria-expanded`, Escape closes, focus moves into the menu |
| Program switcher | `initPrograms` | `aria-pressed` buttons + `aria-live` panel; program 5 shows a quote until EFDA supplies a photo |
| Before/after slider | `initCompare` | real `<input type=range>` (keyboard accessible); CSS vars `--pos` / `--clip` |
| Project filters | `initProjectFilters` | theme × region; chip counts follow the region filter; empty state |
| Contact form | `initContactForm` | **demo only, nothing is sent.** Wire it to the endpoint from Build Document §10 and show the "sent" state only on a 2xx response. Honeypot field: `company_website` |

Photo treatment (`.duo`):

- Photos are greyscale and multiplied onto paper, with forest lighten-blended on top.
- On hover, the image zooms to 1.07× and a chalk "viewfinder" frame fades in.
- There is deliberately no colour change on hover.
- Arch shapes are the `.arch`, `.arch--wide`, `.arch--card` and `.arch--office` border-radius presets.

Org chart:

- **Desktop (721 px and up):** an absolutely positioned chart (`.org`, 1120 × 632).
- **Phones (720 px and below):** an indented tree (`.org-list`).
- **Screen readers:** always read the tree.

Responsive breakpoints:

- **900 px:** nav collapses into the burger.
- **860 px:** the statement block drops to one column.
- **720 px:** phone spacing.

All other grids use `auto-fit` with `minmax`. `prefers-reduced-motion` turns off the reveal, the badge spin and the marquee.

## Placeholders EFDA must fill before launch

These appear in the design in `[BRACKETS]`, so they are visible on purpose.

- Funder of the West Wollega peacebuilding project (`home.projects.3.funder`, `projects.projects.3.funder`)
- Tucho Enkossa's role/department (`contact.people.2.dept`)
- Head-office street address (`contact.streetTbd`)
- Reply time "[X] working days" (`contact.replyNote`)
- Asosa office photo, a photo for the peacebuilding program, and Board portraits (initials are shown until then)
- **Amharic and Afaan Oromoo copy is a DRAFT.** A native speaker must review it, especially EFDA's official Oromo name and the Ge'ez spellings of people's names (currently in Latin script).
- **Photos of children:** confirm EFDA has consent to publish them on the web. They come from a printed profile, and web publication is a different use.

## Licences

- **Fonts:** SIL Open Font License, via Fontsource (licence files in `assets/fonts/`).
- **Photos and logo:** EFDA's own material.
