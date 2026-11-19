# EFDA website

The website of Education For Development Association, an Ethiopian civil society
organization working in Oromia and Benishangul Gumuz. Five pages in English,
Amharic and Afaan Oromoo — fifteen statically generated URLs.

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
app/[locale]/        home, about, projects, partners, contact
app/api/contact/     form endpoint
components/          one file per piece of the design
content/             typed data that does not change by language
i18n/                routing, request config, navigation helpers
locales/             en.json (source), am.json, om.json (DRAFTS)
proxy.ts             locale negotiation
public/              fonts, logo, photos
styles/              styles.css and fonts.css from the design, plus tailwind.css
efda-website-design/ the original static design, kept as reference
source-material/     EFDA's originals, gitignored (see below)
```

### Source material

EFDA's own documents and unprocessed photographs live in `source-material/`,
which is **gitignored and outside `public/`**. Both matter: the files are large
(the 2025 profile alone is 21 MB), and anything under `public/` is served, so a
`.docx` left there would be downloadable from the live site at a guessable URL.
Photographs are resized into `public/photos/` and registered in
`content/photos.ts` before they can be used.

### Styling

`styles/styles.css` is the design's stylesheet, carried over unchanged apart from
one line (see Fonts below). React components emit the same class names, so the
design remains the source of truth for how the site looks. The rendered class
sequence is checked against the design markup page by page.

Tailwind is installed for new markup, but **imported without preflight** —
`styles.css` has its own reset, and preflight would undo it. `styles/tailwind.css`
bridges the design tokens, so `bg-forest` resolves to `var(--forest)`.

### Photos

Sources go in `source-material/`; the web copies go in `public/photos/`, are
kebab-case, and are registered as camelCase keys in `content/photos.ts` in
alphabetical order. Two rules, both enforced by nothing but this paragraph:

**Never wider than 1600px.** That is the top of `deviceSizes` in
`next.config.ts`, so anything larger is bytes `next/image` will never serve.

**Strip the camera metadata.** `sips` does not — it leaves EXIF, the MakerNote
and an embedded thumbnail in place. Pillow does, because its JPEG writer reads
`exif` and `icc_profile` only from the `save()` kwargs, never from the source:

```python
from PIL import Image, ImageOps

im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
if im.width > 1600:
    im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
im.save(dst, 'JPEG', quality=85, optimize=True, progressive=True)
```

`quality=85` sits one rung above the serving quality of 82, so the source is
not compressed twice at the same setting. Verify with:

```python
im = Image.open(dst)
assert im.width <= 1600
assert not im.info.get('exif') and not im.info.get('icc_profile')
```

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

- [ ] Native-speaker review of `am.json` and `om.json` — now including the
      Partners page, the core values, the areas of experience and the policy
      list, all added from the 2025 profile
- [ ] EFDA's official Afaan Oromoo name, and Ge'ez spellings of people's names
- [ ] Funder of the West Wollega peacebuilding project. The 2025 profile shows
      a USAID/Ethiopia banner at the Gimbi workshop, which is suggestive but
      not a statement — `[FUNDER — CONFIRM]` stays until EFDA says so
- [ ] Whether USAID belongs on the funder roster — same evidence, same
      `[USAID — CONFIRM]` placeholder in `content/funders.ts`
- [ ] Whether `SCD` in the 2024 profile and `SDC` in the 2025 one are the same
      body, and `CSSP2` and `CSSP` the same programme. Listed once each
- [ ] Tucho Enkossa's role
- [ ] Paste the head-office street address — Gullele Sub City, Woreda 9, House
      No. 430 — into `/admin/settings`. It is settings-table only, with no
      environment fallback
- [ ] Reply time for the form's "[X] working days"
- [ ] Board portraits, and an Asosa office photo
- [ ] Whether Asosa should still be listed in `content/offices.ts`. The 2025
      profile says two EFDA-owned offices and names only Shambu and Woliso
- [ ] Which building is Shambu and which is Woliso. The 2025 profile's caption
      order is ambiguous; the site keeps the 2024 profile's labels
- [ ] Confirm the seven projects and the impact figures are current
- [ ] **Which capacity figures are right.** The 2025 printed profile says 22
      staff, 5 vehicles and 2 owned offices. The operational staff roster in
      EFDA's due-diligence folder lists 15 people, "one hard top Toyota
      vehicle", and only the Woliso office as currently active. The site
      follows the roster, on the grounds that a named operational list beats a
      summary figure — but it is a visible downgrade and EFDA should confirm it
- [ ] Domain, HTTPS, and role addresses replacing the personal ones in
      `content/contacts.ts` and `content/site.ts`
- [ ] Set `NEXT_PUBLIC_SITE_URL`, then submit `sitemap.xml` to Search Console
- [ ] Board approval of the Globe E logo
- [ ] **Confirm EFDA has consent to publish the photographs of children on the
      web.** They come from printed profiles, and web publication is a
      different use. The 2025 profile added more of them, so this matters more
      than it did, not less — classrooms, a health group portrait, and the
      Roger Federer photographs on the Partners page
- [ ] **Confirm the Roger Federer Foundation is content for the February 2010
      visit photographs to be republished on the web**, and that EFDA may use
      its name and the RFF/EFDA jerseys as it does on the Partners page
- [ ] Establish provenance and licence for `Play for peace.jpg` before it is
      used anywhere. It is a professionally shot image of an Ethiopian girl on
      a Swiss alpine pasture carrying a Play for Peace logo — a partner
      foundation's campaign photograph, not EFDA field work. It is in the
      source material but deliberately not in `public/photos/`
- [ ] A PDF of the 2025 profile, if EFDA wants one offered as a download. The
      `.docx` is 21 MB and is not shipped; no converter is installed here
