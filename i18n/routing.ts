import {defineRouting} from 'next-intl/routing';

export const locales = ['en', 'am', 'om'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',

  // Every language gets its own prefix so all three are indexable:
  // /en/projects, /am/projects, /om/projects.
  localePrefix: 'always',

  // next-intl's default is a session cookie. The build document asks for the
  // choice to be remembered, so give it a year.
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365
  }
});
