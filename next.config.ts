import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';

/* Content Security Policy, deliberately WITHOUT a nonce.

   A nonce has to be unique per request, so Next can only inject one while
   rendering on the server. Its own documentation is explicit: "To use a
   nonce, your page must be dynamically rendered... Static optimization and
   ISR are disabled." That would turn all twelve prerendered pages into
   per-request renders and make them uncacheable by a CDN - a direct trade of
   this site's whole performance position for a stricter script-src.

   For what this site is, that trade is not worth making. There is no
   authentication, no database, no user-generated content and nothing
   reflected from a URL into the page: the XSS surface a nonce would protect
   is close to nil. The directives that genuinely matter here need no nonce at
   all, and all of them are set below - frame-ancestors against clickjacking,
   form-action against exfiltration through an injected form, base-uri against
   base-tag injection, object-src against plugin-based injection.

   Revisit if the site ever grows a login, a CMS, or anything that renders
   user input. The experimental hash-based SRI option keeps static rendering
   and was considered, but it is marked experimental and this site will not be
   watched closely enough after handover to carry that risk.

   The two Cloudflare origins are allowlisted unconditionally rather than from
   env, so switching Turnstile or analytics on later cannot be broken by a CSP
   baked at the previous build. */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com https://static.cloudflareinsights.com`,
  // React style props and Next's injected styles are inline by nature.
  "style-src 'self' 'unsafe-inline'",
  // data: covers the blur-up placeholders; blob: covers next/image.
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
  // The Turnstile challenge renders in an iframe.
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests'
].join('; ');

const nextConfig: NextConfig = {
  /* `next build` and `next dev` share .next by default, so running a build
     while a dev server is up overwrites what that server is serving and
     leaves it handing out chunks that no longer match what the browser has
     cached. Set NEXT_DIST_DIR to verify a production build without touching a
     running dev server:  NEXT_DIST_DIR=.next-verify npm run build  */
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // No `output` or adapter pinned: the default build runs on Vercel or on
  // Cloudflare via @opennextjs/cloudflare. Static export is deliberately NOT
  // used - proxy.ts would not run, and the site needs it for locale
  // negotiation and the NEXT_LOCALE cookie.
  images: {
    // Photos are 748-1586px scans. Keep the candidate widths at or below what
    // the sources actually contain so next/image never upscales.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 828, 1080, 1320, 1600],
    imageSizes: [96, 160, 240, 320, 480, 640],
    // The sources are already soft, upscaled scans. Re-encoding them at the
    // default 75 compounds the artefacts; 82 costs a few KB and holds detail.
    qualities: [82]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Do not leak the full URL to third parties; send the origin only
          // when crossing to another site.
          {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
          // The site asks for none of these.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Only meaningful over HTTPS; browsers ignore it on http://localhost.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {key: 'Content-Security-Policy', value: csp}
        ]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
