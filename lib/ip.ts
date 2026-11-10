/* Salted SHA-256 IP hashing for the `messages` table.

   Counting repeat submissions from the same visitor needs equality matching
   and nothing more - hashing keeps the enquiry table from accumulating raw
   IP addresses at rest. The salt is a shared secret, not a per-row value:
   the point is to stop a leaked table from being directly correlated
   against other logs, not to defend against a brute-force guess of a
   /32 - IPv4 space is small enough that a salt alone would not help there
   anyway. */

import {createHash} from 'node:crypto';

export function hashIp(ip: string | undefined | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? '';
  return createHash('sha256').update(salt + ip).digest('hex');
}
