/* Server-side read and write of the editable site configuration.

   `server-only` is load-bearing here: app/[locale]/error.tsx is a client
   component that renders SiteHeader and SiteFooter, so anything those two can
   reach must stay out of the server graph. The type and the defaults live in
   site-config-shared.ts, which is safe to import from either side; the
   database lives here.

   Caching strategy, and why it is not `unstable_cache`:

   The twelve public pages are prerendered, so a read in the (already async)
   locale layout happens at build time and costs nothing per request. React's
   `cache()` dedupes it within a single render pass. Invalidation is then an
   explicit `revalidatePath` per locale when the admin saves.

   `unstable_cache` with a tag was the obvious alternative, but it buys nothing
   here - the pages are already cached by virtue of being static - and it adds
   two uncertainties: whether its tags propagate into a build-time prerender
   entry, and the two-argument `revalidateTag(tag, profile)` signature that
   Next 16.4 now requires. `revalidatePath(path, 'layout')` is one call with
   settled semantics, and it cascades to every page under the locale. */

import 'server-only';

import {cache} from 'react';
import {revalidatePath} from 'next/cache';
import {getDb, hasDb} from './db';
import {routing} from '@/i18n/routing';
import {
  defaultSiteConfig,
  mergeSiteConfig,
  SETTING_KEYS,
  type SiteConfig
} from './site-config-shared';

/** Raw key/value rows. Uncached - the admin form must show what was just saved. */
export async function getRawSettings(): Promise<Record<string, string>> {
  if (!hasDb()) return {};
  const sql = getDb();
  const rows = (await sql`SELECT key, value FROM settings`) as {
    key: string;
    value: string;
  }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

/* Uncached read, exported for tests.

   When DATABASE_URL is absent this returns the build-time defaults rather than
   throwing, so `next build` works on a fresh clone and in CI, where there is
   no database. A query that fails while the variable IS set is a different
   matter and propagates: baking [PHONE — CONFIRM] into production HTML because
   of a transient connection error would be the silent-wrong-answer this
   codebase consistently refuses elsewhere. */
export async function loadSiteConfig(): Promise<SiteConfig> {
  if (!hasDb()) return defaultSiteConfig;
  return mergeSiteConfig(defaultSiteConfig, await getRawSettings());
}

/** Per-render dedupe, so several components in one pass share a single query. */
export const getSiteConfig = cache(loadSiteConfig);

/* Write changed keys and invalidate the public pages.

   Upserts one row per key so two editors changing different fields cannot
   clobber each other, and so a blank value can be stored as a genuine "unset"
   that falls back through to the placeholder. Unknown keys are rejected rather
   than silently written, which keeps SETTING_FIELDS the single definition of
   what is editable. */
export async function saveSettings(
  entries: Record<string, string>
): Promise<void> {
  const sql = getDb();

  const pairs = Object.entries(entries).filter(([key]) => {
    if (SETTING_KEYS.has(key)) return true;
    console.warn('[settings] ignoring unknown key:', key);
    return false;
  });

  for (const [key, value] of pairs) {
    await sql`
      INSERT INTO settings (key, value, updated_at)
      VALUES (${key}, ${value}, now())
      ON CONFLICT (key) DO UPDATE
        SET value = excluded.value, updated_at = now()
    `;
  }

  /* One call per locale, with 'layout' so it cascades to every page beneath -
     the configured phone number and email appear in SiteFooter, which the
     locale layout renders on all four pages. Concrete paths rather than the
     '/[locale]' pattern: there are only three, and they leave nothing to
     infer about how patterns are matched. */
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`, 'layout');
  }
}
