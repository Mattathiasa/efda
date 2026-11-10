/* A single shared admin password and a stateless signed-cookie session.

   No user accounts and no sessions table: one password in ADMIN_PASSWORD,
   checked with a timing-safe comparison, and a cookie whose value is an
   expiry timestamp plus its own HMAC-SHA256 signature. Verifying it needs
   nothing but the secret - no database round trip, no lookup that could be
   stale after a deploy. */

import {createHmac, timingSafeEqual} from 'node:crypto';

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set.');
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

/** Constant-time regardless of where the candidate and the real password diverge. */
export function checkPassword(candidate: string): boolean {
  const actual = process.env.ADMIN_PASSWORD;
  if (!actual) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(actual);
  // Buffers of different length can never be a match; timingSafeEqual
  // requires equal length, so this check cannot be the thing that leaks
  // timing information - it is a constant comparison on `a`'s length, which
  // the caller (a request body) already controls.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionCookieValue(now = Date.now()): string {
  const expires = String(now + SESSION_MAX_AGE_SECONDS * 1000);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionCookieValue(
  value: string | undefined,
  now = Date.now()
): boolean {
  if (!value) return false;
  const [expires, sig] = value.split('.');
  if (!expires || !sig) return false;

  const expected = sign(expires);
  const sigBuf = Buffer.from(sig, 'hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return false;

  return Number(expires) > now;
}
