import type {Metadata, Viewport} from 'next';
import {notFound} from 'next/navigation';
import Script from 'next/script';
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
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#0E2B22'},
    {media: '(prefers-color-scheme: dark)', color: '#0A1512'}
  ]
};

/* Sets data-theme on <html> before paint, so there is no flash between the
   OS-default and a remembered explicit choice, and no mismatch between what
   the server rendered and what the client then corrects it to. Content is
   a fixed string, not user input - same safety profile as the JSON-LD
   blocks in lib/seo.tsx. See ThemeToggle.tsx for why this can't instead be
   decided in React state. */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`;

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
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* beforeInteractive, not a bare <script>: a plain <script> in JSX is
            only ever executed by the browser's OWN parse of the initial HTML
            - React warns (and will not re-run it) the moment it has to
            render that node itself, which Fast Refresh does on every edit in
            dev. beforeInteractive is Next's own mechanism for exactly this
            case: injected outside React's normal reconciliation, guaranteed
            to run before hydration either way. It sets data-theme on <html>
            before React hydrates, so the server-rendered markup and the live
            DOM legitimately differ on that one attribute every time -
            suppressHydrationWarning above is the sanctioned way to tell
            React that's expected, scoped to just this element. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <ScrollEffects />
        <Analytics />
      </body>
    </html>
  );
}
