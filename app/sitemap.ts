import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';
import {site} from '@/content/site';
import {urlFor} from '@/lib/seo';

const paths = ['/', '/about', '/projects', '/contact'];

/* All 12 URLs, each listing its siblings as alternates so search engines can
   match a visitor to the right language. */
export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: urlFor(locale, path),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries([
          ...routing.locales.map((l) => [l, urlFor(l, path)]),
          ['x-default', urlFor(routing.defaultLocale, path)]
        ])
      }
    }))
  );
}

export const baseUrl = site.url;
