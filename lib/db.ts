/* Neon Postgres access.

   Provisioned through the Vercel Marketplace (`vercel integration add neon`),
   which injects DATABASE_URL into every environment. Nothing here reads the
   connection string at module scope: `neon()` throws when DATABASE_URL is
   missing, and Next evaluates top-level module code during `next build`, so a
   module-level client would turn a missing env var into a failed build rather
   than a failed request.

   Deliberately a plain function and a module-level `let` rather than a
   `Proxy` around the client. A Proxy intercepts the property and method-
   existence checks that libraries perform when they introspect a database
   handle, which breaks them in ways that surface as a hang with no error. */

import {neon, type NeonQueryFunction} from '@neondatabase/serverless';

let client: NeonQueryFunction<false, false> | null = null;

/** The tagged-template SQL client. Throws if DATABASE_URL is unset. */
export function getDb(): NeonQueryFunction<false, false> {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL is not set. Run `vercel env pull .env.local --yes` after ' +
          'provisioning Neon with `vercel integration add neon`.'
      );
    }
    client = neon(url);
  }
  return client;
}

/* Whether a database is configured at all.

   The contact route uses this to decide between delivering and returning 503.
   It checks only for the env var, never opening a connection, so it stays
   cheap enough to call on every request and safe to call during a build. */
export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
