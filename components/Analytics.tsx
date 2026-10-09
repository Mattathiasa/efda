import Script from 'next/script';

/* Cookie-free analytics, chosen by environment so the site works on either
   host and ships nothing at all when unset. No cookies means no consent
   banner, which was the point.

   Set exactly one:
     NEXT_PUBLIC_CF_BEACON_TOKEN   Cloudflare Web Analytics
     NEXT_PUBLIC_VERCEL_ANALYTICS  Vercel Web Analytics ("1")

   Both are loaded after the page is interactive, so neither competes with
   content for the first paint. */
export function Analytics() {
  const cloudflare = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  const vercel = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === '1';

  if (cloudflare) {
    return (
      <Script
        id="cf-analytics"
        strategy="afterInteractive"
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={JSON.stringify({token: cloudflare})}
      />
    );
  }

  if (vercel) {
    return <Script id="vercel-analytics" strategy="afterInteractive" src="/_vercel/insights/script.js" />;
  }

  return null;
}
