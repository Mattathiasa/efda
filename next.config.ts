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
  }
};

export default withNextIntl(nextConfig);
