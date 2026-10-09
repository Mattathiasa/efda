import type {Metadata, Viewport} from 'next';
import {notFound} from 'next/navigation';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {site} from '@/content/site';
import {ScrollEffects} from '@/components/ScrollEffects';
import {Analytics} from '@/components/Analytics';

/* Design CSS first, Tailwind last. tailwind.css deliberately omits preflight -
   styles.css carries the design's own reset. */
import '@/styles/fonts.css';
import '@/styles/styles.css';
import '@/styles/enhancements.css';
import '@/styles/tailwind.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const viewport: Viewport = {
  themeColor: '#0E2B22'
};

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'home.meta'});

  return {
    metadataBase: new URL(site.url),
    title: {default: t('title'), template: `%s — EFDA`},
    description: t('description'),
    // Declared explicitly because setting metadata.icons at all suppresses
    // Next's automatic pickup of app/icon.tsx and app/apple-icon.tsx. The SVG
    // comes first for browsers that take it and scale it cleanly; the
    // generated PNGs cover everything else.
    icons: {
      icon: [
        {url: '/logo/efda-favicon.svg', type: 'image/svg+xml'},
        {url: '/icon', type: 'image/png', sizes: '512x512'}
      ],
      apple: [{url: '/apple-icon', sizes: '180x180'}]
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <ScrollEffects />
        <Analytics />
      </body>
    </html>
  );
}
