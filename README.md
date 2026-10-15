# EFDA website

The website of Education For Development Association, an Ethiopian civil society
organization working in Oromia and Benishangul Gumuz. Four pages in English,
Amharic and Afaan Oromoo — twelve statically generated URLs.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run check      # types + locale key parity + open content items + unit tests
```

> **Do not run `npm run build` while `npm run dev` is up.** They share `.next`
> by default, so the build overwrites what the dev server is serving and
> leaves it handing out chunks that no longer match what the browser cached —
> the page then loads with pieces missing. To verify a production build
> alongside a running dev server, send it somewhere else:
>
> ```bash
> NEXT_DIST_DIR=.next-verify npm run build
> ```
>
> If a dev server does get into that state: stop it, `rm -rf .next`, start it
> again, and hard-reload the browser.

## How it is put together

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript |
| i18n | next-intl, one route tree per language |
| Styling | the design's own CSS, with Tailwind v4 available for new markup |
| Fonts | self-hosted woff2, no runtime calls to Google |
| Contact form | server route with a pluggable delivery adapter |
| Hosting | host-agnostic: runs on Vercel, or Cloudflare via `@opennextjs/cloudflare` |

```
app/[locale]/        home, about, projects, contact
app/api/contact/     form endpoint
components/          one file per piece of the design
content/             typed data that does not change by language
i18n/                routing, request config, navigation helpers
locales/             en.json (source), am.json, om.json (DRAFTS)
proxy.ts             locale negotiation
public/              fonts, logo, photos
styles/              styles.css and fonts.css from the design, plus tailwind.css
efda-website-design/ the original static design, kept as reference
```

### Styling

`styles/styles.css` is the design's stylesheet, carried over unchanged apart from
one line (see Fonts below). React components emit the same class names, so the
design remains the source of truth for how the site looks. The rendered class
sequence is checked against the design markup page by page.

Tailwind is installed for new markup, but **imported without preflight** —
`styles.css` has its own reset, and preflight would undo it. `styles/tailwind.css`
bridges the design tokens, so `bg-forest` resolves to `var(--forest)`.

### Fonts

Self-hosted and already subset by unicode-range. EFDA's Amharic name appears in
the header and footer in every language, which would otherwise make English and
Afaan Oromoo visitors download the full 193 KB Ethiopic face for one line. A
3 KB micro-subset covers it; Amharic pages still load the full face for body
text. Regenerate with `node scripts/subset-lockup-font.mjs`.

### Languages

- `/` redirects by `NEXT_LOCALE` cookie, then `Accept-Language`, then English.
- The switcher keeps the visitor on the same page: `/en/projects` → `/om/projects`.
- Slugs stay English in every language so links survive translation changes.
- All three locale files must share an identical key set — arrays are indexed by
  position, so a missing entry silently shifts content. `npm run check:locales`
  enforces this.
- **`am.json` and `om.json` are drafts** and need a native speaker before launch.

### Contact form

`POST /api/contact`. Validation and the honeypot run server-side, and the
thank-you state only appears on a 2xx. A 400 surfaces the rejected fields next
to each input; any other failure keeps what was typed and offers both the phone
number and a pre-filled `mailto:`, so a dropped connection never costs someone
their message. Delivery is chosen by environment:

| Set this | Messages go to |
|---|---|
| `FIREBASE_PROJECT_ID` + credentials | Firestore, and the Trigger Email extension |
| `FORMSPREE_ENDPOINT` | Formspree |
| neither | logged in development; **503 in production**, so nothing is silently lost |

**Turnstile is one switch, not two.** `NEXT_PUBLIC_TURNSTILE_SITE_KEY` makes the
browser render the widget and produce a token; `TURNSTILE_SECRET_KEY` lets the
server check it. Set both or neither — setting only the secret leaves protection
off and logs an error on every submission, rather than rejecting enquiries the
browser had no way to get a token for. Cloudflare's test pair is in
`.env.example`. Firestore needs `npm install firebase-admin`.

### Platform

Icons and the web manifest are generated at build from the same Globe E paths
the site uses (`app/icon.tsx`, `app/apple-icon.tsx`, `app/manifest.ts`), so the
SVG stays the single source and the site installs to an Android home screen.

Security headers are in `next.config.ts`. The CSP deliberately has **no nonce**:
a nonce must be unique per request, which Next can only do while rendering on
the server, and that would turn all twelve prerendered pages into per-request
renders and make them uncacheable. For a site with no login, no database and
nothing reflected from a URL into the page, that is a bad trade. The directives
that matter without a nonce — `frame-ancestors`, `form-action`, `base-uri`,
`object-src` — are all set. Revisit if the site ever grows a login or a CMS.

Analytics are cookie-free and chosen by env var (Cloudflare or Vercel); nothing
loads when unset, so there is no consent banner.

## Before launch

Run `npm run check:placeholders` — everything still missing appears on the site
in visible `[BRACKETS]`, never silently blank.

- [ ] Native-speaker review of `am.json` and `om.json`
- [ ] EFDA's official Afaan Oromoo name, and Ge'ez spellings of people's names
- [ ] Funder of the West Wollega peacebuilding project
- [ ] Tucho Enkossa's role, and the head-office street address
- [ ] Reply time for the form's "[X] working days"
- [ ] Board portraits, an Asosa office photo, a peacebuilding photo
- [ ] Confirm the seven projects and the 2024 impact figures are current
- [ ] Domain, HTTPS, and role addresses replacing the personal ones in
      `content/contacts.ts` and `content/site.ts`
- [ ] Set `NEXT_PUBLIC_SITE_URL`, then submit `sitemap.xml` to Search Console
- [ ] Board approval of the Globe E logo
- [ ] **Confirm EFDA has consent to publish the photographs of children on the
      web.** They come from a printed profile, and web publication is a
      different use.
