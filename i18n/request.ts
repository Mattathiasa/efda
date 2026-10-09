import * as rootParams from 'next/root-params';
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({locale}) => {
  // Next 16.3+ reads the [locale] root param directly, which keeps pages
  // statically renderable. setRequestLocale is no longer needed.
  if (!locale) {
    const fromParams = await rootParams.locale();
    if (!hasLocale(routing.locales, fromParams)) notFound();
    locale = fromParams;
  }

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default
  };
});
