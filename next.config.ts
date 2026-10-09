import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
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
          }
        ]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
