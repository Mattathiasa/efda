'use client';

import Script from 'next/script';

/* Cloudflare Turnstile widget.

   Rendered only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. Uses the implicit
   rendering mode: the script finds .cf-turnstile and injects a hidden input
   named cf-turnstile-response into the enclosing form, which ContactForm then
   reads out of FormData. No extra dependency, and nothing loads at all when
   the key is absent.

   The server half of this is turnstileStatus() in lib/contact.ts, which only
   enforces verification when this key and the secret are BOTH present. */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function Turnstile({theme = 'dark'}: {theme?: 'dark' | 'light' | 'auto'}) {
  if (!TURNSTILE_SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div
        className="cf-turnstile"
        data-sitekey={TURNSTILE_SITE_KEY}
        data-theme={theme}
        data-size="flexible"
      />
    </>
  );
}
