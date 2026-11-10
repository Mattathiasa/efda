/* The shape of the editable site configuration, and the build-time defaults.

   Deliberately free of server-only imports. app/[locale]/error.tsx is a client
   component and it renders SiteHeader and SiteFooter, which pulls both of them
   - and anything they import - into that route's client graph. So the config
   type and its defaults have to be importable from the browser, and the
   database access lives next door in site-config.ts behind `server-only`.

   The fallback chain is:

     settings table  ->  NEXT_PUBLIC_* env var  ->  [BRACKETS] placeholder

   content/site.ts and content/contacts.ts keep their exact current shape and
   stay the source of the last two links in that chain. They are not folded in
   here, for two reasons: scripts/check-placeholders.mjs scans content/*.ts for
   bracket literals and would stop finding them, and NEXT_PUBLIC_SITE_PHONE_*
   remains the only value available to app/global-error.tsx, which replaces the
   root layout and therefore sits outside every provider. */

import {site} from '@/content/site';
import {contacts, type Contact} from '@/content/contacts';
import {locales, type Locale} from '@/i18n/routing';

export interface SiteConfig {
  phone: {display: string; tel: string};
  email: string;
  /** Always three entries. Index is positional and matches contact.people[i]. */
  contacts: Contact[];
  /** null means never set - the caller keeps the translated bracket text. */
  street: string | null;
  /** A bare number of working days, substituted into the translated sentence. */
  replyDays: string | null;
  /** Per-language override for the third contact's role. */
  dept2: Record<Locale, string | null>;
}

/* What the site rendered before any of this existed: environment variables
   where they are set, visible placeholders where they are not. Also the
   React context default, which is what app/global-error.tsx receives. */
export const defaultSiteConfig: SiteConfig = {
  phone: {display: site.phone.display, tel: site.phone.tel},
  email: site.email,
  contacts,
  street: null,
  replyDays: null,
  dept2: Object.fromEntries(locales.map((l) => [l, null])) as Record<
    Locale,
    string | null
  >
};

/* The editable fields, as one list, so the admin form, the write validation
   and the merge below cannot drift apart. */
export const SETTING_FIELDS = [
  {key: 'site.phone.display', label: 'Site phone (as displayed)'},
  {key: 'site.phone.tel', label: 'Site phone (tel: link)'},
  {key: 'site.email', label: 'Site email'},

  {key: 'contact.0.name', label: 'Contact 1 — name'},
  {key: 'contact.0.phoneDisplay', label: 'Contact 1 — phone (displayed)'},
  {key: 'contact.0.phoneTel', label: 'Contact 1 — phone (tel: link)'},
  {key: 'contact.0.email', label: 'Contact 1 — email'},

  {key: 'contact.1.name', label: 'Contact 2 — name'},
  {key: 'contact.1.phoneDisplay', label: 'Contact 2 — phone (displayed)'},
  {key: 'contact.1.phoneTel', label: 'Contact 2 — phone (tel: link)'},
  {key: 'contact.1.email', label: 'Contact 2 — email'},

  {key: 'contact.2.name', label: 'Contact 3 — name'},
  {key: 'contact.2.phoneDisplay', label: 'Contact 3 — phone (displayed)'},
  {key: 'contact.2.phoneTel', label: 'Contact 3 — phone (tel: link)'},
  {key: 'contact.2.email', label: 'Contact 3 — email'},

  {key: 'contact.street', label: 'Head-office street address'},
  {key: 'contact.replyDays', label: 'Reply time, in working days (a number)'},

  /* The third contact's role is the one [ROLE — CONFIRM] that lives in the
     locale files rather than in content/. It is prose, so it is editable per
     language; the locale files themselves are never rewritten. */
  {key: 'contact.2.dept.en', label: 'Contact 3 — role (English)'},
  {key: 'contact.2.dept.am', label: 'Contact 3 — role (Amharic)'},
  {key: 'contact.2.dept.om', label: 'Contact 3 — role (Afaan Oromoo)'}
] as const;

export type SettingKey = (typeof SETTING_FIELDS)[number]['key'];

export const SETTING_KEYS: ReadonlySet<string> = new Set(
  SETTING_FIELDS.map((f) => f.key)
);

/* Merge stored rows over the defaults. Pure, so it is unit-testable without a
   database or a Next request context.

   A blank stored value counts as absent, so clearing a field in the admin form
   restores the environment variable or the placeholder rather than rendering
   an empty gap where a phone number should be. */
export function mergeSiteConfig(
  defaults: SiteConfig,
  stored: Record<string, string>
): SiteConfig {
  const v = (key: SettingKey): string | null => {
    const raw = stored[key];
    return raw && raw.trim() ? raw.trim() : null;
  };

  const contactRow = (i: 0 | 1 | 2): Contact => {
    const fallback = defaults.contacts[i];
    return {
      name: v(`contact.${i}.name` as SettingKey) ?? fallback.name,
      phone: {
        display:
          v(`contact.${i}.phoneDisplay` as SettingKey) ?? fallback.phone.display,
        tel: v(`contact.${i}.phoneTel` as SettingKey) ?? fallback.phone.tel
      },
      email: v(`contact.${i}.email` as SettingKey) ?? fallback.email
    };
  };

  return {
    phone: {
      display: v('site.phone.display') ?? defaults.phone.display,
      tel: v('site.phone.tel') ?? defaults.phone.tel
    },
    email: v('site.email') ?? defaults.email,
    contacts: [contactRow(0), contactRow(1), contactRow(2)],
    street: v('contact.street'),
    replyDays: v('contact.replyDays'),
    dept2: Object.fromEntries(
      locales.map((l) => [l, v(`contact.2.dept.${l}` as SettingKey)])
    ) as Record<Locale, string | null>
  };
}

/** Substitute the configured reply time into an already-translated sentence. */
export function applyReplyDays(
  translated: string,
  replyDays: string | null
): string {
  if (!replyDays) return translated;
  // Source string is "We usually reply within [X] working days."; the Amharic
  // and Afaan Oromoo drafts carry the same [X] token.
  return translated.replace(/\[X\]/g, replyDays);
}
