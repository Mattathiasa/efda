/* Reads and writes for the `messages` table (scripts/db-init.mjs).

   Mirrors lib/site-config.ts's shape: a thin, server-only layer around
   lib/db.ts, with no caching on reads since the admin inbox must show the
   effect of its own writes immediately. */

import 'server-only';

import {getDb} from './db';
import type {ContactMessage} from './contact';

export type MessageStatus = 'unread' | 'read' | 'archived';

export interface Message {
  id: number;
  topic: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  body: string;
  locale: string;
  status: MessageStatus;
  ipHash: string | null;
  notified: boolean;
  notifyError: string | null;
  createdAt: string;
}

interface MessageRow {
  id: number;
  topic: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  body: string;
  locale: string;
  status: MessageStatus;
  ip_hash: string | null;
  notified: boolean;
  notify_error: string | null;
  created_at: string;
}

function fromRow(r: MessageRow): Message {
  return {
    id: r.id,
    topic: r.topic,
    name: r.name,
    organization: r.organization,
    email: r.email,
    phone: r.phone,
    body: r.body,
    locale: r.locale,
    status: r.status,
    ipHash: r.ip_hash,
    notified: r.notified,
    notifyError: r.notify_error,
    createdAt: r.created_at
  };
}

/** Inserts the enquiry and returns its id, so the caller can mark it notified. */
export async function insertMessage(
  m: ContactMessage,
  ipHash: string | null
): Promise<number> {
  const sql = getDb();
  const [row] = (await sql`
    INSERT INTO messages (topic, name, organization, email, phone, body, locale, ip_hash)
    VALUES (${m.topic}, ${m.name}, ${m.organization}, ${m.email}, ${m.phone}, ${m.message}, ${m.locale}, ${ipHash})
    RETURNING id
  `) as {id: number}[];
  return row.id;
}

/** Records whether the notification email went out, for the admin inbox to show. */
export async function markNotified(
  id: number,
  ok: boolean,
  error?: string
): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE messages
    SET notified = ${ok}, notify_error = ${error ?? null}
    WHERE id = ${id}
  `;
}

/** Newest first. Capped - this is an inbox, not a report. */
export async function listMessages(limit = 100): Promise<Message[]> {
  const sql = getDb();
  const rows = (await sql`
    SELECT id, topic, name, organization, email, phone, body, locale, status,
           ip_hash, notified, notify_error, created_at
    FROM messages
    ORDER BY created_at DESC
    LIMIT ${limit}
  `) as MessageRow[];
  return rows.map(fromRow);
}

export async function setMessageStatus(
  id: number,
  status: MessageStatus
): Promise<void> {
  const sql = getDb();
  await sql`UPDATE messages SET status = ${status} WHERE id = ${id}`;
}
