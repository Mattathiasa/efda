import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {routing, type Locale} from '@/i18n/routing';
import {site} from '@/content/site';

type Page =
  | 'home'
  | 'about'
  | 'projects'
  | 'partners'
  | 'strategy'
  | 'contact'
  | 'enset';

/** Absolute URL for a page in a given locale. */
export function urlFor(locale: string, path: string) {
  const suffix = path === '/' ? '' : path;
  return `${site.url}/${locale}${suffix}`;
}

/* Title, description, hreflang alternates and Open Graph for one page.
   Copy comes from the `meta` block in each namespace. */
export async function buildMetadata(
  locale: string,
  page: Page,
  path: string
): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: `${page}.meta`});

  const languages = Object.fromEntries([
    ...routing.locales.map((l) => [l, urlFor(l, path)]),
    // x-default points at English, which is the source language.
    ['x-default', urlFor(routing.defaultLocale, path)]
  ]);

  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: {
      canonical: urlFor(locale, path),
      languages
    },
    openGraph: {
      type: 'website',
      siteName: 'EFDA',
      locale,
      url: urlFor(locale, path),
      title,
      description
    },
    twitter: {card: 'summary_large_image', title, description}
  };
}

/* The site itself, so search engines can tie the three language trees
   together as one property. */
export function WebSiteJsonLd({locale}: {locale: string}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EFDA',
    alternateName: 'Education For Development Association',
    url: site.url,
    inLanguage: routing.locales,
    publisher: {'@type': 'NGO', name: 'Education For Development Association'}
  };
  return <JsonLd data={data} />;
}

/* Breadcrumbs. Stating the trail lets search results show it rather than a
   bare URL. Exclude<Page, 'home'> rather than a second hand-written union, so
   the two cannot drift apart again.

   `parent` is for the one page that is not a direct child of home: the enset
   case study sits under Projects, and its crumb has to say so or the trail
   points at a URL that does not exist. */
export function BreadcrumbJsonLd({
  locale,
  page,
  label,
  parent
}: {
  locale: string;
  page: Exclude<Page, 'home'>;
  label: string;
  parent?: {page: Exclude<Page, 'home'>; label: string};
}) {
  const path = parent ? `/${parent.page}/${page}` : `/${page}`;
  const trail = [
    {'@type': 'ListItem', position: 1, name: 'EFDA', item: urlFor(locale, '/')},
    ...(parent
      ? [
          {
            '@type': 'ListItem',
            position: 2,
            name: parent.label,
            item: urlFor(locale, `/${parent.page}`)
          }
        ]
      : []),
    {
      '@type': 'ListItem',
      position: parent ? 3 : 2,
      name: label,
      item: urlFor(locale, path)
    }
  ];

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail
      }}
    />
  );
}

function JsonLd({data}: {data: unknown}) {
  return (
    <script
      type="application/ld+json"
      // Values are our own constants, not user input.
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}

/* Organization structured data. `sameAs` is deliberately absent until EFDA
   has social accounts to point at.

   Contact details come in as a prop rather than from content/site.ts, which
   only sees the environment. The settings table overrides the environment, so
   reading site.phone here published "[PHONE - CONFIRM]" to search engines
   while the page beside it showed the real number. A placeholder is meant to
   be visible on the page, not ingested as fact. A street address is still
   omitted: EFDA's is a house number, not a public counter.

   The caller passes its own already-awaited config, so this stays sync. */
export function OrganizationJsonLd({
  phone,
  email
}: {
  phone: {display: string; tel: string};
  email: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Education For Development Association',
    alternateName: 'EFDA',
    url: site.url,
    logo: `${site.url}/logo/efda-globe-forest.svg`,
    foundingDate: site.founded,
    telephone: phone.display,
    email: email,
    address: {
      '@type': 'PostalAddress',
      postOfficeBoxNumber: '25725',
      addressLocality: 'Addis Ababa',
      addressCountry: 'ET'
    },
    areaServed: ['Oromia', 'Benishangul Gumuz'],
    identifier: [`Ethiopian CSO No. ${site.csoNumber}`, `Ethiopian TIN ${site.tin}`]
  };

  return (
    <script
      type="application/ld+json"
      // Values are our own constants, not user input.
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}
