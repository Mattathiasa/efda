/* Creates the two tables the site needs, idempotently.

   Kept in the repo rather than pasted into the Neon console once, so the
   schema is version-controlled and the same command can be re-run against a
   fresh Neon branch (preview branches start empty).

   Usage:
     vercel env pull .env.local --yes
     node --env-file=.env.local scripts/db-init.mjs

   Node's --env-file is used instead of dotenv because only Next auto-loads
   .env.local; a bare node script does not. */

import {neon} from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    'DATABASE_URL is not set.\n' +
      'Run: vercel env pull .env.local --yes\n' +
      'Then: node --env-file=.env.local scripts/db-init.mjs'
  );
  process.exit(1);
}

const sql = neon(url);

/* `status` is a plain text column with a CHECK rather than a Postgres enum:
   adding a value to an enum needs a migration, and this set may well grow a
   'spam' member once the form is public. */
const statements = [
  /* This table is the record of truth. The Resend notification is a
     convenience: a failed email must never mean a lost enquiry, which is why
     lib/contact.ts reports `delivered` on the strength of this insert alone. */
  `CREATE TABLE IF NOT EXISTS messages (
     id           bigserial PRIMARY KEY,
     topic        text NOT NULL,
     name         text NOT NULL,
     organization text NOT NULL DEFAULT '',
     email        text NOT NULL,
     phone        text NOT NULL DEFAULT '',
     body         text NOT NULL,
     locale       text NOT NULL,
     status       text NOT NULL DEFAULT 'unread'
                  CHECK (status IN ('unread', 'read', 'archived')),
     read_at      timestamptz,
     /* Salted SHA-256, never the raw address. Counting repeat submissions
        needs equality matching and nothing more, and this keeps the enquiry
        table from accumulating personal data at rest for an organisation
        that may face a data-protection review. See lib/ip.ts. */
     ip_hash      text,
     /* Whether the notification email actually went out, so an unverified
        Resend sending domain is visible in the inbox rather than silent. */
     notified     boolean NOT NULL DEFAULT false,
     notify_error text,
     created_at   timestamptz NOT NULL DEFAULT now()
   )`,

  // The inbox lists newest-first and filters by status; these cover both.
  `CREATE INDEX IF NOT EXISTS messages_created_at_idx
     ON messages (created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS messages_status_idx
     ON messages (status, created_at DESC)`,
  // Backs the per-IP count that supplements the in-memory rate limiter.
  `CREATE INDEX IF NOT EXISTS messages_ip_recent_idx
     ON messages (ip_hash, created_at DESC)`,

  /* Single-row-per-key settings, so the admin form can write one field
     without reading and rewriting a whole JSON blob, and so two editors
     saving different fields cannot clobber each other. */
  `CREATE TABLE IF NOT EXISTS settings (
     key        text PRIMARY KEY,
     value      text NOT NULL,
     updated_at timestamptz NOT NULL DEFAULT now()
   )`
];

for (const statement of statements) {
  const label = statement.match(/CREATE (?:TABLE|INDEX)[^(]*?(\w+)\s*(?:\(|ON)/);
  await sql.query(statement);
  console.log(`  ok  ${label ? label[1] : statement.slice(0, 40)}`);
}

const [{count}] = await sql.query('SELECT count(*)::int AS count FROM messages');
console.log(`\nSchema ready. messages table holds ${count} row(s).`);
