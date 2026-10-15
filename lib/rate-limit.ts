/* Per-IP rate limiting, in-memory.

   Defense-in-depth for /api/contact, underneath the honeypot and Turnstile:
   Turnstile can be left unconfigured (it fails open by design, see
   turnstileStatus() in contact.ts) and the honeypot only catches bots that
   don't bother reading the form. This stops a bare request loop regardless
   of either.

   Deliberately NOT backed by Upstash/Vercel KV or similar - that's a real
   dependency and a real account, and this site runs on whichever host the
   deploy chooses. A plain in-memory map covers the single-instance case
   (dev, a single long-running Node server) at zero setup cost. It does NOT
   hold a limit across multiple serverless instances or survive a cold
   start - each instance gets its own bucket. If the production deploy runs
   on a platform that scales to multiple concurrent instances, swap this for
   a shared store (same "pluggable by environment" pattern as contact.ts's
   dispatch()) rather than trusting this for anything but a single node. */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

// Without this, a long-running dev/single-instance server would leak one
// entry per distinct IP forever.
const MAX_TRACKED_IPS = 5000;

export interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds: number;
}

/** Call once per request. `key` is typically the caller's IP. */
export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= WINDOW_MS) {
    if (!existing && buckets.size >= MAX_TRACKED_IPS) {
      evictOldest();
    }
    buckets.set(key, {count: 1, windowStart: now});
    return {limited: false, retryAfterSeconds: 0};
  }

  if (existing.count >= MAX_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((existing.windowStart + WINDOW_MS - now) / 1000);
    return {limited: true, retryAfterSeconds: Math.max(retryAfterSeconds, 1)};
  }

  existing.count += 1;
  return {limited: false, retryAfterSeconds: 0};
}

function evictOldest() {
  const oldest = buckets.keys().next();
  if (!oldest.done) buckets.delete(oldest.value);
}
