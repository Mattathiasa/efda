# EFDA website

The website of Education For Development Association, an Ethiopian civil society
organization working in Oromia and Benishangul Gumuz. Seven pages in English,
Amharic and Afaan Oromoo — twenty-one statically generated URLs.

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
app/[locale]/        home, about, projects (+ enset case study), partners,
                     strategy, contact
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

`npm run check:placeholders` reports none, and no bracketed text appears in
any of the 21 prerendered pages. What remains below is not missing from the
site — it is work that needs EFDA, or a decision somebody has to make.

**Nothing on the site is invented.** If a fact is not in one of EFDA's own
documents it is not published. Where two documents disagree, the site follows
one and this list says which and why.

- [ ] **Confirm the header does not wrap**, in Afaan Oromoo, just above the
      1460px burger threshold. The threshold has been raised twice from
      arithmetic rather than measurement — eight links at roughly 90px each on
      top of the brand and the theme/language/CTA cluster. Eight is the
      practical ceiling: a ninth link means rethinking the navigation, not
      another breakpoint bump
- [ ] Native-speaker review of `am.json` and `om.json` — now including the
      Partners page with its funding history and references, the enset case
      study, the core values, the areas of experience and the policy list
- [ ] EFDA's official Afaan Oromoo name, and Ge'ez spellings of people's names
- [ ] **Which board chair is current.** The board roster says Ilili Hordofa,
      chair, since 2024; the organizational-chart attachment says Asfaw Kaba.
      The strategic plan says the board is five members, three of them women
      "including the board chair lady", which supports Ilili Hordofa — the
      site keeps her, but confirm it
- [ ] **The organizational chart differs from the one on the site.** The
      governance file has an Admin & Finance Head, Program Managers, a
      Capacity Development Officer and a Cashier, and no separate Planning &
      Implementation box. The site's chart came from the 2025 profile. Left
      unchanged: `components/OrgChart.tsx` renders the hierarchy twice and the
      two sources disagree about what the structure even is
- [ ] **Three different vision and mission wordings** are in circulation. The
      vision is identical everywhere and the strategic plan says of it "no
      modification is needed". The mission is not: the 2025 profile, the 2023
      audit notes, and the strategic plan's change table all differ, and the
      plan proposes a fourth — "to fill the gap in information, resource and
      technical skill". The site follows the 2025 profile as the most recent
      document. Ask EFDA which is canonical
- [ ] **Whether the strategic plan's targets are still current.** The plan was
      adopted January 2024 and commits to doubling the portfolio from five
      projects to eleven, offices in two further Oromia zones, and 30% revenue
      growth a year. The 2023 audit shows total expenditure of about 16m birr
      against the 24m the plan cites for 2022, so the growth target starts
      from a reduced base. Confirm before a funder asks
- [ ] The strategic plan's revenue sentence **breaks off before naming a 2028
      figure** — "the revenue will increase by 30% every year and reach". The
      site states the rate only
- [ ] **The HR policy manual is watermarked DRAFT** on most pages, though its
      text says the Board approved it on 1 October 2021. Request a clean
      signed copy before sending the pack to a funder
- [ ] **Policies named but not supplied.** The site lists safeguarding, a
      child policy and an SHG training manual; the folder contains only the
      financial, HR, procurement and code-of-conduct manuals. The code of
      conduct also cross-references anticorruption, conflict-of-interest,
      whistleblowing and safeguarding policies that are not in the pack
- [ ] **The file named `Certificate.pdf` is not the registration certificate** —
      it is a CCRDA certificate of appreciation. The actual ACSO registration
      certificate is missing from the folder
- [ ] Whether the funding-history amounts can be published. The source table
      mixes four currencies and transposes columns on several rows, so
      `content/funding.ts` carries dates and donors only
- [ ] Whether EFDA's TIN should stay on the public About page. It is on the
      site because EFDA published it in its own 2025 profile, but a tax
      identifier is the kind of thing an organization may prefer to give on
      request
- [ ] Whether `SCD` in the 2024 profile and `SDC` in the 2025 one are the same
      body, and `CSSP2` and `CSSP` the same programme. Listed once each
- [ ] **Tucho Enkossa's role.** Two documents in the due-diligence folder
      disagree: the address confirmation calls him Program Officer, the staff
      roster Admin. & finance. The site follows the roster; `/admin/settings`
      overrides it per language without a deploy
- [ ] **Confirm the street address.** The site shows Gullele Sub City, Woreda
      9, House No. 430, from the 2025 profile. The 2016 TIN certificate gives
      the same sub-city but Woreda 148, Kebele 10, House No. 243 — consistent
      with Addis's woreda renumbering, but worth confirming
- [ ] **Get a domain mailbox.** The site publishes `efhda@yahoo.com` because
      it works. `info@edu-development.org` was configured at one point and
      bounces: EFDA does not own the domain yet
- [ ] **Role addresses for the Contact page.** All three people route to the
      organisation's landline and mailbox, because the only details on file
      are personal mobiles and personal Gmail accounts. `programs@` and
      `finance@` would let each person have their own row
- [ ] Confirm the two-working-day reply time currently configured is one
      EFDA can actually keep
- [ ] Board portraits — initials show until they arrive — and an Asosa
      office photograph, if one exists
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
